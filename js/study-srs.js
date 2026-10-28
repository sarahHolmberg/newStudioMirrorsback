/**
 * study-srs.js
 * Pure spaced-repetition logic (Leitner boxes) for the /study flashcards.
 * Every card sits in a box. Knowing it on the first try moves it up one box,
 * so the wait before it comes back grows. Missing it sends it back to box 1.
 * "now" is a parameter so it can be tested with any time.
 */
const SRS = (() => {
  // CHANGE HERE: days to wait before a card in each box comes back.
  // Box 0 = never studied (due now); a missed card goes to box 1 (tomorrow).
  const INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
  const DAY = 24 * 60 * 60 * 1000;
  const TOP = INTERVAL_DAYS.length - 1;

  const keyOf = (card) => card.front; // the question text identifies a card

  /** @returns {{box:number, due:string|null}} a card's saved state, or a new card */
  function stateOf(card, states) {
    return states[keyOf(card)] || { box: 0, due: null };
  }

  function isDue(card, states, now = new Date()) {
    const s = stateOf(card, states);
    return !s.due || new Date(s.due).getTime() <= now.getTime();
  }

  /** @returns {object[]} the cards to study now */
  function dueCards(cards, states, now = new Date()) {
    return cards.filter((c) => isDue(c, states, now));
  }

  /**
   * Record a finished card. firstTry = right the first time it was shown this session.
   * @returns {object} the new states object (the old one is not changed)
   */
  function grade(card, firstTry, states, now = new Date()) {
    const box = firstTry ? Math.min(stateOf(card, states).box + 1, TOP) : 1;
    const due = new Date(now.getTime() + INTERVAL_DAYS[box] * DAY).toISOString();
    return { ...states, [keyOf(card)]: { box, due } };
  }

  /** @returns {number} ms until the next card is due (0 if one is due now) */
  function nextDueMs(cards, states, now = new Date()) {
    let soonest = Infinity;
    cards.forEach((c) => {
      const s = stateOf(c, states);
      const left = s.due ? new Date(s.due).getTime() - now.getTime() : 0;
      soonest = Math.min(soonest, Math.max(0, left));
    });
    return soonest === Infinity ? 0 : soonest;
  }

  /** @returns {number[]} how many cards are in each box */
  function boxCounts(cards, states) {
    const counts = INTERVAL_DAYS.map(() => 0);
    cards.forEach((c) => { counts[stateOf(c, states).box]++; });
    return counts;
  }

  /** @returns {string} e.g. "3 days", "5h 10m", "12m" */
  function format(ms) {
    const mins = Math.ceil(ms / 60000);
    if (mins >= 48 * 60) return `${Math.round(mins / (24 * 60))} days`;
    const h = Math.floor(mins / 60);
    return h ? `${h}h ${mins % 60}m` : `${mins}m`;
  }

  return { INTERVAL_DAYS, dueCards, grade, nextDueMs, boxCounts, format };
})();

if (typeof module !== 'undefined') module.exports = SRS; // Node only (testing)
