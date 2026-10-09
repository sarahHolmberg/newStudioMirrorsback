/**
 * flashcards-parser.js
 * -----------------------------------------------------------------------
 * Reads and writes flashcard batch text files. Knows the file format and
 * nothing else (no page code, no storage), so every other script goes
 * through Parser.parse / Parser.serialize.
 *
 * FILE FORMAT (headers first, then cards; all headers are optional):
 *   title: Spanish Week 3
 *   audio: batch1.m4a
 *   last_completed: 2026-10-09T14:05:00Z
 *
 *   Q: Hola
 *   A: Hello
 *
 * A question or answer may continue on following lines (until the next Q: / A:).
 * -----------------------------------------------------------------------
 */
const Parser = (() => {
  const MARKER = /^\s*([QA]):\s?(.*)$/i;          // "Q: ..." or "A: ..."
  const HEADER = /^\s*([A-Za-z_]+):\s*(.*)$/;     // "key: value"
  const HEADER_KEYS = ['title', 'audio', 'last_completed'];

  console.log('[PARSER INIT] Flashcards parser loaded.');

  /** Logs and throws an error that names the line, so the page can show it as-is. */
  function fail(line, message) {
    const msg = line ? `Line ${line}: ${message}` : message;
    console.error('[PARSER PARSE] FAILED:', msg);
    throw new Error(msg);
  }

  /**
   * Parses the text of a batch file.
   * @param {string} text
   * @returns {{title:?string, audio:?string, lastCompleted:?string, cards:{q:string,a:string}[]}}
   * @throws {Error} with a readable message (and line number) if the file is invalid
   */
  function parse(text) {
    console.log('[PARSER PARSE] Start. Characters:', text.length);

    // Normalise: strip BOM, turn Windows/old-Mac line endings into "\n"
    const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
    const batch = { title: null, audio: null, lastCompleted: null, cards: [] };

    let card = null; // card being built: { q: [lines], a: [lines], hasA, line }
    let field = null; // 'q' or 'a': where continuation lines go

    function finishCard() {
      const q = card.q.join('\n').trim();
      const a = card.a.join('\n').trim();
      if (!q) fail(card.line, 'this question is empty.');
      if (!a) fail(card.line, `question "${q.slice(0, 30)}" has no answer.`);
      batch.cards.push({ q, a });
      console.log('[PARSER PARSE] Card', batch.cards.length, 'read (line ' + card.line + ').');
    }

    lines.forEach((raw, i) => {
      const n = i + 1;
      const marker = raw.match(MARKER);

      if (marker && marker[1].toUpperCase() === 'Q') {
        if (card) finishCard();
        card = { q: [marker[2]], a: [], hasA: false, line: n };
        field = 'q';
      } else if (marker) { // "A:"
        if (!card) fail(n, 'found an answer before any question.');
        if (card.hasA) fail(n, 'a second answer for the same question.');
        card.hasA = true;
        card.a = [marker[2]];
        field = 'a';
      } else if (card) {
        card[field].push(raw); // continuation line (blank lines are trimmed at the ends)
      } else if (raw.trim()) { // still in the header area
        const header = raw.match(HEADER);
        if (!header) fail(n, `unexpected text "${raw.trim().slice(0, 30)}" before the first question.`);
        const key = header[1].toLowerCase();
        const value = header[2].trim();
        if (!HEADER_KEYS.includes(key)) fail(n, `unknown header "${header[1]}". Allowed: ${HEADER_KEYS.join(', ')}.`);

        if (key === 'last_completed' && value) {
          const t = Date.parse(value);
          if (Number.isNaN(t)) fail(n, `last_completed "${value}" is not a valid date.`);
          batch.lastCompleted = new Date(t).toISOString();
        } else if (key === 'title') {
          batch.title = value || null;
        } else if (key === 'audio') {
          batch.audio = value || null;
        }
        console.log('[PARSER PARSE] Header read:', key);
      }
    });

    if (card) finishCard();
    if (!batch.cards.length) fail(0, 'No cards found. Each card needs a "Q:" line and an "A:" line.');

    console.log('[PARSER PARSE] Success. Cards:', batch.cards.length, '| lastCompleted:', batch.lastCompleted);
    return batch;
  }

  /**
   * Writes a batch back to text, with last_completed set to completedAt.
   * @param {object} batch  a batch returned by parse()
   * @param {string} [completedAt] ISO date; defaults to now
   * @returns {string}
   */
  function serialize(batch, completedAt = new Date().toISOString()) {
    if (Number.isNaN(Date.parse(completedAt))) {
      console.error('[PARSER SERIALIZE] FAILED: invalid date:', completedAt);
      throw new Error('Cannot save: invalid completion time.');
    }
    console.log('[PARSER SERIALIZE] Stamping last_completed:', completedAt, '| cards:', batch.cards.length);

    const out = [];
    if (batch.title) out.push(`title: ${batch.title}`);
    if (batch.audio) out.push(`audio: ${batch.audio}`);
    out.push(`last_completed: ${completedAt}`, '');
    batch.cards.forEach((c) => out.push(`Q: ${c.q}`, `A: ${c.a}`, ''));
    return out.join('\n');
  }

  return { parse, serialize };
})();

// Lets Node load this same file (terminal checks); ignored in the browser.
if (typeof module !== 'undefined') module.exports = Parser;