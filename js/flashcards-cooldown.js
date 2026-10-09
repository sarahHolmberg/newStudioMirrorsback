/**
 * flashcards-cooldown.js
 * Pure lock logic: is a finished batch still cooling down?
 * "now" is a parameter so it can be tested with any time.
 */
const Cooldown = (() => {
  // CHANGE HERE: minutes a finished batch stays locked.
  const MINUTES = 90;

  /** @returns {number} ms left on the lock (0 = unlocked) */
  function remainingMs(lastCompleted, now = new Date()) {
    if (!lastCompleted) return 0;
    const left = new Date(lastCompleted).getTime() + MINUTES * 60000 - now.getTime();
    return Math.max(0, left);
  }

  /** @returns {string} e.g. "1h 12m" or "45m" */
  function format(ms) {
    const total = Math.ceil(ms / 60000);
    const h = Math.floor(total / 60);
    return h ? `${h}h ${total % 60}m` : `${total}m`;
  }

  return { MINUTES, remainingMs, format };
})();

if (typeof module !== 'undefined') module.exports = Cooldown; // Node only (testing)