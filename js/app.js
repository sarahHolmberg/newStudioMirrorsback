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
  if (item.has_profile) {
    const pf = document.createElement('a');
    pf.className = 'ico';
    pf.href = DB.profileUrl(item.id);
    pf.download = (item.name || 'profile') + ' (profile).jpg';
    pf.textContent = '👤';
    pf.title = 'Download profile picture';
    pf.setAttribute('aria-label', 'Download profile picture');
    row.appendChild(pf);
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
    if (item.name || item.has_image || item.has_profile) body.appendChild(nameRow(item));

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

// ---- ADD LINK: step 1 name + link (Submit), step 2 the picture (Send): then all three are sent together ----
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

// Step 1: name + link, then Submit. Both are checked here first, so the picture step only opens for a link that will be accepted.
const picDialog = document.getElementById('picDialog');
const picForm = document.getElementById('picForm');
const picWhat = document.getElementById('picWhat');
const picPreview = document.getElementById('picPreview');
const picMsg = document.getElementById('picMsg');
const picSend = document.getElementById('picSend');
const picTitle = document.getElementById('picTitle');
const picAbout = document.getElementById('picAbout');
// Step 2 = the target picture (who the video is about), step 3 = the profile picture. Both are kept until Send.
const PIC_STEPS = {
  2: { key: 'target', title: 'Step 2: the target picture', about: 'The picture that shows who the video is about.', button: 'Next ▸' },
  3: { key: 'profile', title: 'Step 3: the profile picture', about: 'Their profile picture.', button: 'Send' },
};
let picStep = 2, pics = { target: null, profile: null };

/** Shows step 2 or 3, with the picture already chosen for it (if any). */
function showPicStep(step) {
  picStep = step;
  const s = PIC_STEPS[step], file = pics[s.key];
  picTitle.textContent = s.title; picAbout.textContent = s.about; picSend.textContent = s.button;
  picInput.value = ''; picMsg.textContent = '';
  if (picPreview.src) URL.revokeObjectURL(picPreview.src);
  if (file) { picPreview.src = URL.createObjectURL(file); picPreview.classList.remove('hidden'); }
  else { picPreview.removeAttribute('src'); picPreview.classList.add('hidden'); }
  picSend.disabled = !file;
  console.log('[ADD] Step', step + ':', s.key, 'picture.');
}

function isInstagramLink(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && (host === 'instagram.com' || host.endsWith('.instagram.com'));
  } catch { return false; }
}

addBtn.addEventListener('click', () => {
  const link = linkInput.value.trim();
  const name = nameInput.value.trim();
  console.log('[SUBMIT CLICKED] link:', link, '| name:', name || '(none)');
  if (!name) { setMsg('Please type the name.', true); return nameInput.focus(); }
  if (!isInstagramLink(link)) { setMsg('Please paste a valid Instagram link (https://www.instagram.com/...).', true); return linkInput.focus(); }
  setMsg('', false);
  // Step 2: the target picture (then step 3: the profile picture)
  pics = { target: null, profile: null };
  picWhat.textContent = name + ' · ' + link;
  showPicStep(2);
  picDialog.showModal();
});

/** Shows the chosen or pasted picture (for this step) and allows Next / Send. */
function setPicture(file) {
  if (!file || !file.type.startsWith('image/')) { picMsg.textContent = 'That is not a picture.'; return; }
  pics[PIC_STEPS[picStep].key] = file;
  if (picPreview.src) URL.revokeObjectURL(picPreview.src);
  picPreview.src = URL.createObjectURL(file);
  picPreview.classList.remove('hidden');
  picMsg.textContent = ''; picSend.disabled = false;
  console.log('[ADD]', PIC_STEPS[picStep].key, 'picture ready:', file.name || '(pasted)', '| bytes:', file.size);
}
picInput.addEventListener('change', () => picInput.files[0] && setPicture(picInput.files[0]));
document.addEventListener('paste', (e) => {
  if (!picDialog.open) return;
  const item = [...(e.clipboardData?.items || [])].find((it) => it.type.startsWith('image/'));
  if (!item) { picMsg.textContent = 'There is no picture to paste. Copy a picture first.'; return; }
  e.preventDefault();
  setPicture(item.getAsFile());
});
// Back: from step 3 to step 2 (the target picture is still there), from step 2 out
document.getElementById('picBack').addEventListener('click', () => (picStep === 3 ? showPicStep(2) : picDialog.close()));

// Next (step 2) goes to the profile picture; Send (step 3): name + link + both pictures go to the server together, in one request
picForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (picStep === 2) { if (pics.target) showPicStep(3); return; }
  if (!pics.target || !pics.profile) return;
  const link = linkInput.value.trim();
  const name = nameInput.value.trim();
  picSend.disabled = true; addBtn.disabled = true;
  picMsg.textContent = 'Sending…';
  try {
    const image = await toJpegBase64(pics.target), profile = await toJpegBase64(pics.profile);
    console.log('[ADD] Pictures shrunk. base64 chars:', image.length, '+', profile.length);
    const { added } = await DB.addVideo(link, name, image, profile);
    picDialog.close();
    linkInput.value = '';
    nameInput.value = '';
    setMsg(added ? 'Saved!' : 'That link was already saved.', false);
    if (added && loaded) await loadPage(true); // refresh the open list so the new link shows on top
  } catch (err) {
    console.error('[ADD FAILED]', err);
    picMsg.textContent = err.message;
    picSend.disabled = false;
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