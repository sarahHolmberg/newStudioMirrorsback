/**
 * app.js
 * -----------------------------------------------------------------------
 * UI logic for Video Vault. Talks only to the DB module (see db.js).
 * The page loads with NO data call; links are fetched when the user asks
 * (View Videos / Load more), a few at a time, so the page stays fast.
 * All values are inserted with textContent (no innerHTML) to avoid XSS.
 * -----------------------------------------------------------------------
 */

console.log('[APP INIT] Video Vault UI script loaded.');

// ---- DOM REFS ----
const linkInput = document.getElementById('linkInput');
const addBtn = document.getElementById('addBtn');
const viewBtn = document.getElementById('viewBtn');
const moreBtn = document.getElementById('moreBtn');
const msg = document.getElementById('msg');
const videoListContainer = document.getElementById('videoListContainer');
const videoList = document.getElementById('videoList');

// ---- STATE ----
let lastId = null;   // id of the last link shown (used to ask for the next page)
let loaded = false;  // has the first page been fetched yet?

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

// ---- ADD LINK ----
addBtn.addEventListener('click', async () => {
  const link = linkInput.value.trim();
  console.log('[ADD CLICKED] Raw input value:', link);
  if (!link) return console.warn('[ADD ABORTED] Empty input, nothing saved.');

  addBtn.disabled = true;
  try {
    const { added } = await DB.addVideo(link);
    linkInput.value = '';
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