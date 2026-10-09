/**
 * flashcards-session.js
 * Pure study logic (no DOM, no storage): rounds and retry of missed cards.
 * A round shows every card once. Missed cards come back in the next round.
 * The session is done when a whole round has zero misses.
 */
const Session = (() => {
  console.log('[SESSION INIT] Flashcards session module loaded.');

  /** @param {{q:string,a:string}[]} cards  @returns the new session */
  function create(cards) {
    console.log('[SESSION CREATE] Cards:', cards.length);
    return { round: 1, queue: [...cards], failed: [], index: 0, done: false };
  }

  /** @returns the card being studied, or null when the session is done */
  function current(s) {
    return s.done ? null : s.queue[s.index];
  }

  /** Records the verdict for the current card and moves on. */
  function mark(s, knewIt) {
    if (s.done) {
      console.warn('[SESSION MARK] Ignored: session already done.');
      return;
    }
    if (!knewIt) s.failed.push(current(s));
    console.log('[SESSION MARK] Round', s.round, '| card', s.index + 1, '/', s.queue.length, '| knew it:', knewIt);
    s.index++;

    if (s.index < s.queue.length) return; // more cards in this round

    if (s.failed.length === 0) {
      s.done = true;
      console.log('[SESSION DONE] Clean round reached. Rounds:', s.round);
    } else {
      console.log('[SESSION ROUND] Round', s.round, 'over. Retrying', s.failed.length, 'missed card(s).');
      s.queue = s.failed;
      s.failed = [];
      s.index = 0;
      s.round++;
    }
  }

  /** @returns {{round:number, position:number, total:number}} */
  function progress(s) {
    return { round: s.round, position: s.index + 1, total: s.queue.length };
  }

  return { create, current, mark, progress };
})();

if (typeof module !== 'undefined') module.exports = Session; // Node only (testing)