/**
 * flashcards-study.js
 * UI logic for the study page: the text and audio pickers and the batch
 * summary. Talks only to Parser. Files are read on this device; nothing is
 * uploaded anywhere.
 */
console.log('[STUDY INIT] Flashcards study script loaded.');

// CHANGE HERE: biggest text file accepted, in bytes. A batch is tiny; this blocks wrong files.
const MAX_TEXT_BYTES = 1024 * 1024;

const $ = (id) => document.getElementById(id);

// Single source of truth for what the page shows (render() reads only this).
const state = { fileName: null, batch: null, error: null, audioFile: null, session: null, showingAnswer: false };

// CHANGE HERE: length of the flip squash, in milliseconds.
const FLIP_MS = 90;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let flipping = false;

// ---- TEXT PICKER ----
$('textPicker').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  console.log('[STUDY TEXT] Chosen:', file.name, '| bytes:', file.size);

  try {
    if (file.size > MAX_TEXT_BYTES) throw new Error('That file is too big to be a flashcard batch.');
    state.batch = Parser.parse(await file.text());
    state.session = null;
    state.fileName = file.name;
    state.error = null;
    console.log('[STUDY TEXT] Loaded. Cards:', state.batch.cards.length);
  } catch (err) {
    console.error('[STUDY TEXT] FAILED:', err.message);
    state.batch = null;
    state.session = null;
    state.error = `${file.name}: ${err.message}`;
  }

  e.target.value = ''; // lets you pick the same file again after editing it
  render();
});

// ---- AUDIO PICKER (optional) ----
$('audioPicker').addEventListener('change', (e) => {
  state.audioFile = e.target.files[0] || null;
  console.log('[STUDY AUDIO] Chosen:', state.audioFile ? state.audioFile.name : 'none');
  if (state.batch) state.error = null; // a loaded batch means any old error was about audio
  setAudioSource();
  render();
});

// ---- AUDIO PLAYBACK ----
let audioUrl = null;

/** Points the player at the picked file (or clears it). The file never leaves this device. */
function setAudioSource() {
  const player = $('player');
  player.pause();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = state.audioFile ? URL.createObjectURL(state.audioFile) : null;
  if (audioUrl) player.src = audioUrl;
  else player.removeAttribute('src');
  console.log('[STUDY AUDIO] Player source:', audioUrl ? 'set' : 'cleared');
}

$('playBtn').addEventListener('click', async () => {
  const player = $('player');
  try {
    if (player.paused) await player.play();
    else player.pause();
  } catch (err) {
    console.error('[STUDY AUDIO] Playback failed:', err.name, err.message);
    state.error = `Audio: can't play ${state.audioFile.name}. Cards still work.`;
    render();
  }
});

// Keep the button label in step with the player.
['play', 'pause', 'ended'].forEach((ev) =>
  $('player').addEventListener(ev, () => {
    $('playBtn').textContent = $('player').paused ? '▶ Play audio' : '⏸ Pause';
  })
);

// ---- STUDY ROUNDS ----
$('startBtn').addEventListener('click', () => {
  state.session = Session.create(state.batch.cards);
  state.showingAnswer = false;
  render();
});

/** Two-frame flip: squash the card, swap the text, restore. */
$('card').addEventListener('click', () => {
  if (!state.session || state.session.done || flipping) return;
  const swap = () => { state.showingAnswer = !state.showingAnswer; render(); };
  if (reduceMotion) return swap();

  flipping = true;
  $('card').classList.add('half');
  setTimeout(() => {
    swap();
    $('card').classList.remove('half');
    flipping = false;
  }, FLIP_MS);
});

function mark(knewIt) {
  Session.mark(state.session, knewIt);
  state.showingAnswer = false;
  if (state.session.done) {
    state.batch.lastCompleted = new Date().toISOString(); // starts the cooldown
    console.log('[STUDY DONE] Stamped last_completed:', state.batch.lastCompleted);
  }
  render();
}
/** Share sheet on phones ("Save to Files"); plain download elsewhere. */
$('saveBtn').addEventListener('click', async () => {
  const text = Parser.serialize(state.batch, state.batch.lastCompleted);
  const file = new File([text], state.fileName, { type: 'text/plain' });
  console.log('[STUDY SAVE] Saving:', state.fileName);
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      console.log('[STUDY SAVE] Shared.');
      return;
    }
  } catch (err) {
    if (err.name === 'AbortError') return console.log('[STUDY SAVE] Share cancelled.');
    console.warn('[STUDY SAVE] Share failed, downloading instead:', err.message);
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = state.fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  console.log('[STUDY SAVE] Downloaded.');
});

$('knewBtn').addEventListener('click', () => mark(true));
$('missedBtn').addEventListener('click', () => mark(false));

function renderStudy() {
  const s = state.session;
  $('studyPanel').classList.toggle('hidden', !s);
  $('playBtn').classList.toggle('hidden', !state.audioFile);
  if (!s || s.done) $('player').pause(); // stop sound when leaving a session
  if (!s) return;

  $('cardArea').classList.toggle('hidden', s.done);
  $('doneMsg').classList.toggle('hidden', !s.done);
  if (s.done) {
    $('doneMsg').textContent = `All cards correct. Finished in ${s.round} round${s.round > 1 ? 's' : ''}. Save the file to lock it for ${Cooldown.MINUTES} min.`;
    return;
  }
  const p = Session.progress(s);
  const card = Session.current(s);
  $('progress').textContent = `Round ${p.round} · Card ${p.position} of ${p.total}`;
  $('cardLabel').textContent = state.showingAnswer ? 'Answer' : 'Question';
  $('cardText').textContent = state.showingAnswer ? card.a : card.q;
  $('verdict').classList.toggle('hidden', !state.showingAnswer);
}

// ---- RENDER ----
/** One line of the summary: "Label: value" (textContent only, no innerHTML). */
function addItem(list, label, value) {
  const li = document.createElement('li');
  const strong = document.createElement('strong');
  strong.textContent = label + ': ';
  li.append(strong, value);
  list.appendChild(li);
}

/** Says what the audio situation is, without ever blocking the batch. */
function audioText(expected) {
  const picked = state.audioFile ? state.audioFile.name : null;
  if (picked && expected) {
    return picked.toLowerCase() === expected.toLowerCase() ? `${picked} ✔` : `${picked} (batch expects ${expected})`;
  }
  if (picked) return `${picked} (batch names no audio)`;
  if (expected) return `none picked (batch expects ${expected}). Continuing without audio.`;
  return 'none';
}

function render() {
  const list = $('summary');
  list.innerHTML = '';
  $('error').textContent = state.error || '';

  if (state.batch) {
    const b = state.batch;
    addItem(list, 'File', state.fileName);
    addItem(list, 'Title', b.title || '(none)');
    addItem(list, 'Cards', String(b.cards.length));
    addItem(list, 'Last completed', b.lastCompleted ? new Date(b.lastCompleted).toLocaleString() : 'never');
    const left = Cooldown.remainingMs(b.lastCompleted);
    if (left) addItem(list, 'Locked', `${Cooldown.format(left)} left`);
    addItem(list, 'Audio', audioText(b.audio));
  }
  const studying = state.session && !state.session.done;
  const locked = state.batch && Cooldown.remainingMs(state.batch.lastCompleted) > 0;
  $('startBtn').classList.toggle('hidden', !state.batch || studying || locked);
  $('saveBtn').classList.toggle('hidden', !(state.session && state.session.done));
  $('startBtn').textContent = state.session ? 'Study again' : 'Start';
  renderStudy();
  console.log('[STUDY RENDER] Batch loaded:', !!state.batch, '| error:', !!state.error);
}

// Keeps the lock countdown fresh while the page stays open.
setInterval(render, 30000);