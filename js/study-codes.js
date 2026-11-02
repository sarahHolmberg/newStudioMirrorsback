/**
 * study-codes.js
 * Code words spoken at the end of a lesson loop. You type the ones you heard to
 * prove you listened (see "listening codes" in study.js). Each word has a short
 * mp3 at /audio/codes/<word>.mp3, made by scripts/make-study-audio.py js/study-codes.js ...
 *
 * CHANGE HERE: add or swap words (short, easy to hear, all different), then make the mp3s.
 */
const STUDY_CODE_WORDS = [
  'apple', 'banana', 'river', 'rocket', 'tiger', 'piano', 'candle', 'garden',
  'pepper', 'window', 'dragon', 'mango', 'silver', 'jacket', 'pillow', 'lemon'
];

if (typeof module !== 'undefined') module.exports = STUDY_CODE_WORDS; // Node only (audio script)
