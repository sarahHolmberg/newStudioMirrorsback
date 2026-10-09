/**
 * flashcards-access.js
 * -----------------------------------------------------------------------
 * Access logic for the flashcards pages (UI scripts never touch the word
 * or the storage key directly - they only call Access.check / isUnlocked).
 *
 * NOTE: this is a client-side gate. The word is visible in this file, so it
 * keeps out casual visitors only. FUTURE: move the check into a Netlify
 * function (like netlify/functions/auth.js); the Access API can stay the same.
 * -----------------------------------------------------------------------
 */
const Access = (() => {
  // CHANGE HERE: the word that unlocks the flashcards.
  const SECRET_WORD = 'this';
  const KEY = 'flashcardsUnlocked';

  console.log('[ACCESS INIT] Flashcards access module loaded.');

  /**
   * Checks the typed word. On success, remembers it for this browser tab.
   * @param {string} word
   * @returns {boolean}
   */
  function check(word) {
    const ok = typeof word === 'string' && word.trim() === SECRET_WORD;
    console.log('[ACCESS CHECK] Word accepted:', ok); // the typed word is never logged
    if (ok) {
      try {
        sessionStorage.setItem(KEY, '1');
        console.log('[ACCESS CHECK] Unlock saved for this tab.');
      } catch (err) {
        console.error('[ACCESS CHECK] Could not save unlock:', err);
      }
    }
    return ok;
  }

  /** @returns {boolean} true if the word was entered earlier in this tab */
  function isUnlocked() {
    let unlocked = false;
    try {
      unlocked = sessionStorage.getItem(KEY) === '1';
    } catch (err) {
      console.error('[ACCESS STATE] Could not read unlock state:', err);
    }
    console.log('[ACCESS STATE] Unlocked:', unlocked);
    return unlocked;
  }

  return { check, isUnlocked };
})();