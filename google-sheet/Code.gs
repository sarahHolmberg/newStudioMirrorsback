/**
 * google-sheet/Code.gs
 * -----------------------------------------------------------------------
 * Studio Mirrors database = this Google Sheet + this script (free; replaces the Netlify database).
 * Paste this whole file into the sheet: Extensions -> Apps Script -> Code.gs.
 *
 * Tabs (made by the menu "Studio Mirrors -> 1. Set up the tabs"):
 *   Links    : id | link | name | createdAt | pictureId     the Instagram links (Video Vault + the Grid Player's Next link)
 *   Done     : when | who | linkId | link | name            one row each time someone clicks Done in the Grid Player
 *   People   : username | code | ...                        who may use the dashboard (you type their codes)
 *   Settings : key | value                                  SCISSORS_CODE (Video Vault) and DONE_CODE (Grid Player)
 * Pictures are files in the Drive folder "Studio Mirrors pictures" (a sheet cell is too small for them).
 *
 * Web app (Deploy -> New deployment -> Web app; Execute as: Me; Who has access: Anyone):
 *   GET  ?action=links[&before=<id>]        { links, hasMore }  newest first, PAGE_SIZE at a time (Video Vault)
 *   GET  ?action=all                        { links }           newest first, all of them (Grid Player)
 *   GET  ?action=image&id=<id>              { image }           the picture as JPEG base64
 *   POST { action: "add", link, name, image }       save a new link (image = JPEG base64, required)
 *   POST { action: "remove", ids, code }            Video Vault scissors; needs SCISSORS_CODE
 *   POST { action: "done", id, code, who }          Grid Player Done; needs DONE_CODE; writes a Done row
 * POSTs are sent as text/plain (so browsers send them straight away). Errors come back as
 * { error, status } because a Google web app always answers 200.
 * The codes are only read here, on Google's side: the pages never contain them.
 * -----------------------------------------------------------------------
 */

// CHANGE HERE: how many links the Video Vault loads at a time, and the size limits (same as the Netlify version).
const PAGE_SIZE = 5;
const MAX_LINK_LENGTH = 500;
const MAX_NAME_LENGTH = 100;
const MAX_REMOVE = 50;
const MAX_IMAGE_B64 = 2000000; // about 1.5 MB picture
// CHANGE HERE: the current Netlify site, only used once by "2. Import from Netlify".
const NETLIFY_SITE = 'https://studiomirrors.netlify.app';
const PICTURE_FOLDER = 'Studio Mirrors pictures';

const TABS = {
  Links: ['id', 'link', 'name', 'createdAt', 'pictureId'],
  Done: ['when', 'who', 'linkId', 'link', 'name'],
  People: ['username', 'code', 'paymentName', 'currency', 'currencyName', 'weeklyGoal', 'payPerVideo'],
  Settings: ['key', 'value'],
};

// ---------------------------------------------------------------- menu
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Studio Mirrors')
    .addItem('1. Set up the tabs', 'setup')
    .addItem('2. Import from Netlify', 'importFromNetlify')
    .addToUi();
}

/** Makes the four tabs with their headers (safe to run again: nothing is overwritten). */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach((name) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(TABS[name]);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, TABS[name].length).setFontWeight('bold');
    }
  });
  const settings = tab('Settings');
  ['SCISSORS_CODE', 'DONE_CODE'].forEach((k) => { if (setting(k) === null) settings.appendRow([k, '']); });
  const people = tab('People');
  if (people.getLastRow() === 1) people.appendRow(['LEGBANEJEAN', '', '', '', '', '', '']);
  const first = ss.getSheets()[0];
  if (first.getName() !== 'Links' && first.getLastRow() === 0 && Object.keys(TABS).indexOf(first.getName()) < 0) ss.deleteSheet(first); // the empty "Sheet1"
  pictureFolder();
  log('[SETUP] Tabs ready.');
  toast('Tabs ready. Now type the codes in Settings (and People).');
}

// ---------------------------------------------------------------- web app
function doGet(e) {
  return answer(() => {
    const p = e.parameter || {};
    if (p.action === 'image') return { image: pictureBase64(Number(p.id)) };
    const rows = linkRows().reverse(); // newest first
    if (p.action === 'all') return { links: rows.map(publicLink) };
    const before = Number(p.before) || Infinity;
    const page = rows.filter((r) => r.id < before).slice(0, PAGE_SIZE + 1); // one extra to know if there is more
    return { links: page.slice(0, PAGE_SIZE).map(publicLink), hasMore: page.length > PAGE_SIZE };
  });
}

function doPost(e) {
  return answer(() => {
    let body;
    try { body = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { return fail('Bad request.', 400); }
    if (body.action === 'add') return addLink(body);
    if (body.action === 'remove') return removeLinks(body);
    if (body.action === 'done') return markDone(body);
    return fail('Unknown action.', 400);
  });
}

function addLink(body) {
  const link = cleanInstagramLink(body.link);
  if (!link) return fail('Please paste a valid Instagram link (https://www.instagram.com/...).', 400);
  const bytes = cleanImage(body.image);
  if (!bytes) return fail('A picture is required (JPEG, not too big).', 400);
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, MAX_NAME_LENGTH) : '';
  return locked(() => {
    const sh = tab('Links'), rows = linkRows(), old = rows.find((r) => r.link === link);
    if (old) {
      // Same link again: only fills in a missing name or picture, never overwrites.
      let changed = false;
      if (!old.name && name) { sh.getRange(old.row, 3).setValue(name); changed = true; }
      if (!old.pictureId) { sh.getRange(old.row, 5).setValue(savePicture(bytes, old.id)); changed = true; }
      log('[ADD] Link was already saved. Filled in something:', changed);
      return { added: changed };
    }
    const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    sh.appendRow([id, link, name, new Date().toISOString(), savePicture(bytes, id)]);
    log('[ADD] Saved link id', id, '| has name:', !!name);
    return { added: true };
  });
}

function removeLinks(body) {
  if (!setting('SCISSORS_CODE')) return notSetUp('SCISSORS_CODE');
  if (!codeOk(body.code, 'SCISSORS_CODE', false)) return slowFail();
  const ids = Array.isArray(body.ids) ? body.ids.filter((n) => Number.isInteger(n)).slice(0, MAX_REMOVE) : [];
  if (!ids.length) return fail('Select at least one video.', 400);
  return locked(() => {
    const gone = deleteLinks(ids);
    log('[REMOVE] Removed clipped links:', gone.length);
    return { deleted: gone.length };
  });
}

function markDone(body) {
  if (!setting('DONE_CODE')) return notSetUp('DONE_CODE');
  if (!codeOk(body.code, 'DONE_CODE', true)) return slowFail();
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) return fail('Which link? The id is missing.', 400);
  const who = typeof body.who === 'string' ? body.who.trim().slice(0, MAX_NAME_LENGTH) : '';
  return locked(() => {
    const [row] = deleteLinks([id]);
    if (!row) return fail('That link was already removed.', 404);
    tab('Done').appendRow([new Date().toISOString(), who, row.id, row.link, row.name]);
    log('[DONE] Link id', id, 'done by', who || '(no name)');
    return { deleted: 1 };
  });
}

// ---------------------------------------------------------------- import (run once from the menu)
/** Copies every link (and its picture) from the Netlify database. Safe to run again: links already here are skipped. */
function importFromNetlify() {
  const res = UrlFetchApp.fetch(NETLIFY_SITE + '/.netlify/functions/links-api', { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error('Netlify answered ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200));
  const theirs = (JSON.parse(res.getContentText()).links || []).slice().sort((a, b) => a.id - b.id); // oldest first
  const have = {};
  linkRows().forEach((r) => { have[r.link] = true; });
  let added = 0, pictures = 0;
  locked(() => {
    const sh = tab('Links');
    theirs.forEach((l) => {
      if (have[l.link]) return;
      let pictureId = '';
      const pic = UrlFetchApp.fetch(NETLIFY_SITE + '/.netlify/functions/links?image=' + l.id, { muteHttpExceptions: true });
      if (pic.getResponseCode() === 200) { pictureId = savePicture(pic.getContent(), l.id); pictures++; }
      sh.appendRow([l.id, l.link, l.name || '', l.createdAt || new Date().toISOString(), pictureId]);
      added++;
    });
  });
  log('[IMPORT] Added', added, 'links,', pictures, 'pictures. Skipped (already here):', theirs.length - added);
  toast('Imported ' + added + ' links (' + pictures + ' pictures). ' + (theirs.length - added) + ' were already here.');
}

// ---------------------------------------------------------------- helpers
function tab(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Tab "' + name + '" is missing: run Studio Mirrors -> 1. Set up the tabs.');
  return sh;
}

/** All links as objects, in sheet order (oldest first); row = its row number in the tab. */
function linkRows() {
  const values = tab('Links').getDataRange().getValues().slice(1);
  return values
    .map((v, i) => ({ row: i + 2, id: Number(v[0]), link: String(v[1]), name: String(v[2] || ''), createdAt: toIso(v[3]), pictureId: String(v[4] || '') }))
    .filter((r) => r.id && r.link);
}
const publicLink = (r) => ({ id: r.id, link: r.link, name: r.name, createdAt: r.createdAt, has_image: !!r.pictureId });
const toIso = (v) => (v instanceof Date ? v.toISOString() : String(v || ''));

/** Deletes these link ids (and their pictures). Returns the rows that were there. */
function deleteLinks(ids) {
  const sh = tab('Links'), gone = linkRows().filter((r) => ids.indexOf(r.id) >= 0);
  gone.slice().sort((a, b) => b.row - a.row).forEach((r) => { // bottom up, so the row numbers stay right
    sh.deleteRow(r.row);
    if (r.pictureId) { try { DriveApp.getFileById(r.pictureId).setTrashed(true); } catch (err) { log('[PICTURE] Could not trash', r.pictureId); } }
  });
  return gone;
}

function setting(key) {
  const row = tab('Settings').getDataRange().getValues().find((v) => String(v[0]).trim() === key);
  return row ? String(row[1]) : null;
}
/** Compares a typed code with Settings (constant time). ignoreCase: capitals and spaces around it do not matter. */
function codeOk(typed, key, ignoreCase) {
  const real = setting(key);
  if (!real || typeof typed !== 'string') return false; // no code set = switched off
  const norm = (s) => (ignoreCase ? s.trim().toUpperCase() : s);
  const h = (s) => Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, norm(s), Utilities.Charset.UTF_8);
  const a = h(typed), b = h(real);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function pictureFolder() {
  const it = DriveApp.getFoldersByName(PICTURE_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PICTURE_FOLDER);
}
function savePicture(bytes, id) {
  return pictureFolder().createFile(Utilities.newBlob(bytes, 'image/jpeg', 'link-' + id + '.jpg')).getId();
}
function pictureBase64(id) {
  const r = linkRows().find((x) => x.id === id);
  if (!r || !r.pictureId) throw httpError('No picture.', 404);
  return Utilities.base64Encode(DriveApp.getFileById(r.pictureId).getBlob().getBytes());
}

function cleanInstagramLink(raw) {
  if (typeof raw !== 'string' || !raw.trim() || raw.length > MAX_LINK_LENGTH) return null;
  const m = /^https:\/\/([^\/?#]+)(\/[^\s]*)?$/i.exec(raw.trim());
  if (!m) return null;
  const host = m[1].toLowerCase();
  return host === 'instagram.com' || /\.instagram\.com$/.test(host) ? 'https://' + host + (m[2] || '/') : null;
}
/** The picture's bytes if it is a real JPEG within the size limit, else null. */
function cleanImage(raw) {
  if (typeof raw !== 'string' || !raw || raw.length > MAX_IMAGE_B64) return null;
  let bytes;
  try { bytes = Utilities.base64Decode(raw); } catch (err) { return null; }
  return (bytes[0] & 255) === 0xff && (bytes[1] & 255) === 0xd8 && (bytes[2] & 255) === 0xff ? bytes : null; // JPEG signature
}

/** Only one change at a time (two people clicking Done together must not mix up rows). */
function locked(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function httpError(message, status) { const e = new Error(message); e.status = status; return e; }
function fail(error, status) { return { error: error, status: status }; }
function notSetUp(key) { log('[CODE] Refused:', key, 'is empty in Settings.'); return fail('Not set up yet: type ' + key + ' in the Settings tab of the sheet.', 503); }
function slowFail() { Utilities.sleep(500); log('[CODE] Refused: wrong code (code not logged).'); return fail('Wrong code.', 403); } // slows down guessing
function answer(fn) {
  let out;
  try { out = fn(); } catch (err) { log('[ERROR]', err && err.stack || err); out = fail(err.status ? err.message : 'Server error.', err.status || 500); }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function log() { console.log.apply(console, arguments); }
function toast(msg) { try { SpreadsheetApp.getActiveSpreadsheet().toast(msg, 'Studio Mirrors', 8); } catch (err) { log(msg); } }
