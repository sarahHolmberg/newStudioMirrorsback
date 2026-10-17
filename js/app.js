/**
 * app.js
 * -----------------------------------------------------------------------
 * UI logic for Video Vault. Talks only to the DB module (see db.js).
 * The page loads with NO data call; links are fetched when the user asks
 * (View Videos / Load more), a few at a time, so the page stays fast.
 * The scissors code is NOT here: the server checks it (see links.mjs).
 * All values are inserted with textContent (no innerHTML) to avoid XSS.
 * -----------------------------------------------------------------------
 */

console.log('[APP INIT] Video Vault UI script loaded.');

// ---- DOM REFS ----
const nameInput = document.getElementById('nameInput');
const linkInput = document.getElementById('linkInput');
const addBtn = document.getElementById('addBtn');
const viewBtn = document.getElementById('viewBtn');
const scissorsBtn = document.getElementById('scissorsBtn');
const moreBtn = document.getElementById('moreBtn');
const msg = document.getElementById('msg');
const videoListContainer = document.getElementById('videoListContainer');
const videoList = document.getElementById('videoList');
const codeDialog = document.getElementById('codeDialog');
const codeForm = document.getElementById('codeForm');
const codeInput = document.getElementById('codeInput');
const codeMsg = document.getElementById('codeMsg');
const codeCancel = document.getElementById('codeCancel');

// ---- STATE ----
let lastId = null;    // id of the last link shown (used to ask for the next page)
let loaded = false;   // has the first page been fetched yet?
let clipping = false; // scissors mode: checkboxes visible

function setMsg(text, isError) {
  msg.textContent = text;
  msg.className = isError ? 'err' : 'ok-msg';
}

/** Loads one page and appends it. reset=true starts again from the newest. */
async function loadPage(reset) {
  console.log('[LOAD] Start. reset:', reset, '| lastId:', lastId);
  viewBtn.disabled = moreBtn.disabled = true;
  try {
    if (reset) { videoList.innerHTML = ''; lastId = null; }
    const { links, hasMore } = await DB.getVideos(lastId);
    appendLinks(links);
    if (links.length) lastId = links[links.length - 1].id;
    loaded = true;
    moreBtn.classList.toggle('hidden', !hasMore);
    if (!videoList.children.length) addEmptyRow();
    console.log('[LOAD] Done. Shown:', videoList.children.length, '| hasMore:', hasMore);
  } catch (err) {
    console.error('[LOAD FAILED]', err);
    setMsg(err.message, true);
  } finally {
    viewBtn.disabled = moreBtn.disabled = false;
  }
}

function addEmptyRow() {
  const li = document.createElement('li');
  li.textContent = 'No videos stored yet.';
  videoList.appendChild(li);
}

function appendLinks(links) {
  links.forEach((item) => {
    const li = document.createElement('li');

    const box = document.createElement('input'); // only visible in scissors mode (CSS)
    box.type = 'checkbox';
    box.className = 'pick';
    box.value = item.id;
    box.setAttribute('aria-label', 'Select ' + (item.name || item.link));
    li.appendChild(box);

    if (item.name) {
      const n = document.createElement('strong');
      n.className = 'nm';
      n.textContent = item.name;
      li.appendChild(n);
    }

    const a = document.createElement('a');
    a.href = item.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = item.link;
    li.appendChild(a);
    videoList.appendChild(li);
  });
  console.log('[RENDER] Added', links.length, 'links.');
}

// ---- ADD LINK (+ optional name) ----
addBtn.addEventListener('click', async () => {
  const link = linkInput.value.trim();
  const name = nameInput.value.trim();
  console.log('[ADD CLICKED] Raw input value:', link, '| name:', name || '(none)');
  if (!link) return console.warn('[ADD ABORTED] Empty input, nothing saved.');

  addBtn.disabled = true;
  try {
    const { added } = await DB.addVideo(link, name);
    linkInput.value = '';
    nameInput.value = '';
    setMsg(added ? 'Saved!' : 'That link was already saved.', false);
    if (added && loaded) await loadPage(true); // refresh the open list so the new link shows on top
  } catch (err) {
    console.error('[ADD FAILED]', err);
    setMsg(err.message, true);
  } finally {
    addBtn.disabled = false;
  }
});

// ---- VIEW VIDEOS (first click loads from the database, later clicks show/hide) ----
viewBtn.addEventListener('click', async () => {
  console.log('[VIEW CLICKED] loaded:', loaded);
  if (!loaded) {
    await loadPage(true);
    videoListContainer.classList.remove('hidden');
    return;
  }
  videoListContainer.classList.toggle('hidden');
});

// ---- LOAD MORE ----
moreBtn.addEventListener('click', () => {
  console.log('[MORE CLICKED]');
  loadPage(false);
});

// ---- SCISSORS: 1st click = pick clipped videos, 2nd click = ask for the code, then remove ----
function setClipping(on) {
  clipping = on;
  videoList.classList.toggle('clipping', on);
  scissorsBtn.classList.toggle('on', on);
  setMsg(on ? 'Tick the clipped videos, then click ✂ again.' : '', false);
  console.log('[SCISSORS] Mode:', on ? 'ON' : 'OFF');
}

const selectedIds = () => [...videoList.querySelectorAll('.pick:checked')].map((b) => Number(b.value));

scissorsBtn.addEventListener('click', async () => {
  console.log('[SCISSORS CLICKED] clipping:', clipping);
  if (!clipping) {
    if (!loaded) await loadPage(true);
    if (!loaded) return; // loading failed; the message is already shown
    videoListContainer.classList.remove('hidden');
    return setClipping(true);
  }
  const ids = selectedIds();
  console.log('[SCISSORS] Selected:', ids.length);
  if (!ids.length) return setClipping(false); // nothing ticked: just leave scissors mode
  codeInput.value = '';
  codeMsg.textContent = '';
  codeDialog.showModal();
  codeInput.focus();
});

codeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const ids = selectedIds();
  console.log('[REMOVE] Sending code for', ids.length, 'links (code is not logged).');
  try {
    const { deleted } = await DB.removeVideos(ids, codeInput.value);
    codeDialog.close();
    setClipping(false);
    await loadPage(true);
    setMsg(`Removed ${deleted} clipped video${deleted === 1 ? '' : 's'}.`, false);
  } catch (err) {
    console.error('[REMOVE FAILED]', err.message);
    codeMsg.textContent = err.message; // e.g. "Wrong code."
    codeInput.select();
  }
});

codeCancel.addEventListener('click', () => {
  console.log('[REMOVE] Cancelled.');
  codeDialog.close();
});