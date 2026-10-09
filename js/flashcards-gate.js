/**
 * flashcards-gate.js
 * UI logic for /flashcards/projects (the dialog box). Talks only to Access.
 */
console.log('[GATE INIT] Flashcards gate script loaded.');

// CHANGE HERE: where to go after the correct word is entered.
const NEXT_URL = '/flashcards/projects/welcome/';

const gateForm = document.getElementById('gateForm');
const gateInput = document.getElementById('gateInput');

gateForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stay on the page; we decide where to go
  console.log('[GATE SUBMIT] Enter pressed.');

  if (Access.check(gateInput.value)) {
    console.log('[GATE] Correct. Going to:', NEXT_URL);
    window.location.assign(NEXT_URL);
    return;
  }

  console.warn('[GATE] Wrong word. Staying on page.');
  gateInput.classList.add('wrong');
  gateInput.select();
});

// Clear the red border as soon as the user types again
gateInput.addEventListener('input', () => gateInput.classList.remove('wrong'));