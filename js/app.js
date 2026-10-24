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

// CHANGE HERE: longest side of the saved picture, in pixels (smaller = faster).
const MAX_SIDE = 1280;

// ---- DOM REFS ----
const nameInput = document.getElementById('nameInput');
const linkInput = document.getElementById('linkInput');
const picInput = document.getElementById('picInput');
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

// ---- COPY ----
/** Copies text to the clipboard; falls back for pages without clipboard access. */
async function copyText(text, btn) {
  console.log('[COPY] Copying:', text);
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.warn('[COPY] Clipboard API failed, using fallback:', err.message);
    const t = document.createElement('textarea');
    t.value = text;
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    if (!ok) return setMsg('Could not copy. Select the name and copy it by hand.', true);
  }
  btn.textContent = '✓'; // quick confirmation, then back to the icon
  setTimeout(() => { btn.textContent = '📋'; }, 1500);
}

/** One row: the name, its copy icon, and the download-picture icon. */
function nameRow(item) {
  const row = document.createElement('div');
  row.className = 'namerow';

  if (item.name) {
    const n = document.createElement('strong');
    n.className = 'nm';
    n.textContent = item.name;
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'ico';
    copy.textContent = '📋';
    copy.title = 'Copy name';
    copy.setAttribute('aria-label', 'Copy name');
    copy.addEventListener('click', () => copyText(item.name, copy));
    row.append(n, copy);
  }

  if (item.has_image) {
    const dl = document.createElement('a');
    dl.className = 'ico';
    dl.href = DB.imageUrl(item.id);
    dl.download = (item.name || 'picture') + '.jpg';
    dl.textContent = '⬇';
    dl.title = 'Download picture';
    dl.setAttribute('aria-label', 'Download picture');
    row.appendChild(dl);
  }
  return row;
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

    const body = document.createElement('div'); // name row + link
    body.className = 'item';
    if (item.name || item.has_image) body.appendChild(nameRow(item));

    const a = document.createElement('a');
    a.href = item.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = item.link;
    body.appendChild(a);

    li.appendChild(body);
    videoList.appendChild(li);
  });
  console.log('[RENDER] Added', links.length, 'links.');
}

// ---- ADD LINK: "Add" asks for a picture, then link + name + picture are sent together ----
/** Shrinks the chosen picture to a JPEG (longest side MAX_SIDE) and returns it as base64 text. */
async function toJpegBase64(file) {
  const bmp = await createImageBitmap(file).catch(() => {
    throw new Error('Could not read that picture. Try a JPG or PNG.');
  });
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // JPEG has no transparency
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]; // drop the "data:image/jpeg;base64," start
}

addBtn.addEventListener('click', () => {
  console.log('[ADD CLICKED] link:', linkInput.value.trim());
  if (!linkInput.value.trim()) return console.warn('[ADD ABORTED] Empty input, nothing saved.');
  setMsg('Now choose a picture for this link.', false);
  picInput.click(); // must happen right inside the click, or phones block the picker
});

picInput.addEventListener('change', async () => {
  const file = picInput.files[0];
  picInput.value = ''; // lets the same picture be chosen again next time
  if (!file) return console.warn('[ADD] No picture chosen, nothing saved.');
  const link = linkInput.value.trim();
  const name = nameInput.value.trim();
  console.log('[ADD] Picture chosen:', file.name, '| bytes:', file.size);

  addBtn.disabled = true;
  try {
    const image = await toJpegBase64(file);
    console.log('[ADD] Picture shrunk. base64 chars:', image.length);
    const { added } = await DB.addVideo(link, name, image);
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