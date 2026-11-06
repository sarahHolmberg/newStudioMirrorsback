/**
 * netlify/functions/links-api.mjs
 * -----------------------------------------------------------------------
 * API for OTHER apps (e.g. the Grid Player) to read the links and mark one done.
 *   GET  (header X-Code: <code>) = { links: [{ id, name, link, createdAt, hasImage }], message?, needCode? }, newest first
 *                                  (the picture itself: GET /.netlify/functions/links?image=<id>)
 *                                  message = a note for the app to show when the list is empty;
 *                                  needCode = the app should ask for the person's code and send it (see PACE below)
 *   DELETE { id, code, stored }  = the Grid Player's Done button: writes a row in video_done (who = the code,
 *                                  the link, the name, stored = where the finished video is) and removes the link
 *   POST { code }                = "videos done" for that code: { who, count, payAmount, payFor, payPerVideo, currency, total, videos }
 *   POST (header X-Import: 1) { key, links?, done? } = load a backup in (tools/migrate.mjs); needs IMPORT_KEY. Anything
 *                                  already there is skipped, so running it twice is safe. -> { links: added, done: added }
 * Reading the links needs no code: only trusted people have the apps, and the same list is already
 * visible on the Video Vault page. Done and the counts need a done code, which is checked HERE
 * (server side). The codes live only in the Netlify env vars DONE_CODES / DONE_CODE, never in this public repo.
 * Each person has their own code (usually their name in capitals), so the code says who did the video.
 * Any website may call it (CORS is open): the Grid Player runs from a file on your computer.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';
import { run, tables } from '../shared/tables.mjs';

// CHANGE HERE: most links one request can return (newest first).
const MAX_ROWS = 500;
// CHANGE HERE: the pay: PAY_FOR this many videos (17 000 XAF for 30 videos = 566.67 XAF a video).
// The total is rounded only at the end, so 30 videos is exactly 17 000.
const PAY_AMOUNT = 17000;
const PAY_FOR = 30;
const CURRENCY = 'XAF';
// CHANGE HERE: most finished videos listed in the "videos done" window (the count and the total always include all of them).
const MAX_DONE_ROWS = 500;
// CHANGE IN NETLIFY, not here (Site configuration -> Environment variables): the pace of the work, per person.
//   PACE_PER_DAY      = "5-9": each person gets between 5 and 9 videos a day (not set = every link for everyone, as before)
//   PACE_FAST_MINUTES = 10: someone who usually needs this long (or less) between two videos gets the top of the range
//   PACE_SLOW_MINUTES = 40: this long (or more) gets the bottom; in between, in proportion. No history yet = the middle
//   PACE_TZ           = "Africa/Douala": where "a day" starts and ends
// Speed = the usual (median) time between one Done and the next of that person, over their last 30 Done rows, counting
// only gaps under 3 hours (a break is not slowness). GET hands out the oldest links, as many as are left of today's number.
const [PACE_MIN, PACE_MAX] = (process.env.PACE_PER_DAY || '').split('-').map(Number);
const PACE_ON = PACE_MIN > 0 && PACE_MAX >= PACE_MIN;
const PACE_FAST = Number(process.env.PACE_FAST_MINUTES) || 10;
const PACE_SLOW = Number(process.env.PACE_SLOW_MINUTES) || 40;
const PACE_TZ = process.env.PACE_TZ || 'Africa/Douala';
const PAUSE_MESSAGE = process.env.PAUSE_MESSAGE || 'No videos available for you right now. New videos appear regularly, so check back in a while.';
// CHANGE IN NETLIFY, not here: IMPORT_KEY = a long secret of your own; switches on the import (tools/migrate.mjs).
// Not set = import is off. Remove it again after moving the data.
const IMPORT_KEY = process.env.IMPORT_KEY || '';
const MAX_IMPORT_DONE = 200; // done rows per import request
// CHANGE IN NETLIFY, not here: Site configuration -> Environment variables ->
//   DONE_CODES = everyone's codes, separated by commas (for example: SARAH, BRYAN). Each person types their own.
//   DONE_CODE  = the older single code; still accepted.
// Without either, Done is switched off. Never write the codes in this file: the repo is public.
const DONE_CODES = [...(process.env.DONE_CODES || '').split(','), process.env.DONE_CODE || '']
  .map((c) => c.trim().toUpperCase()).filter(Boolean);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Code, X-Import',
};
const reply = (body, status = 200) =>
  Response.json(body, { status, headers: { ...CORS, 'Cache-Control': 'no-store' } });

const norm = (s) => s.trim().toUpperCase(); // capitals and spaces around the code do not matter
const sha = (s) => crypto.createHash('sha256').update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b)); // constant-time compare
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** The code as it is stored (= who did it), or null if it is not one of the codes. Checks every code, so timing gives nothing away. */
function whoFor(code) {
  if (typeof code !== 'string' || !code.trim()) return null;
  let who = null;
  for (const c of DONE_CODES) if (same(norm(code), c)) who = c;
  return who;
}

const db = getDatabase();
console.log('[API INIT] DATABASE client ready.');

// The tables (and the one-time clear) live in netlify/shared/tables.mjs, shared with links.mjs.
const ensureTable = tables(db, 'API');

/** How many videos this person gets today: PACE_MIN..PACE_MAX, more for someone who usually works faster. */
async function dailyNumber(who) {
  const rows = await run(db.sql`SELECT done_at FROM video_done WHERE who = ${who} ORDER BY done_at DESC LIMIT 30`);
  const gaps = [];
  for (let i = 0; i + 1 < rows.length; i++) {
    const min = (new Date(rows[i].done_at) - new Date(rows[i + 1].done_at)) / 60000;
    if (min > 0 && min < 180) gaps.push(min);
  }
  if (gaps.length < 2) return Math.round((PACE_MIN + PACE_MAX) / 2); // not enough history yet: the middle
  gaps.sort((a, b) => a - b);
  const usual = gaps[Math.floor(gaps.length / 2)];
  const fast = Math.min(1, Math.max(0, (PACE_SLOW - usual) / (PACE_SLOW - PACE_FAST))); // 1 = fast, 0 = slow
  return Math.round(PACE_MIN + fast * (PACE_MAX - PACE_MIN));
}
/** Videos this person has done today (the day as in PACE_TZ). */
async function doneToday(who) {
  const [{ n }] = await run(db.sql`
    SELECT count(*)::int AS n FROM video_done
    WHERE who = ${who} AND (done_at AT TIME ZONE ${PACE_TZ})::date = (now() AT TIME ZONE ${PACE_TZ})::date`);
  return n;
}

/** Loads part of a backup (tools/migrate.mjs): links with their picture and original date, and Done rows. Skips what is there. */
async function importBackup(body) {
  if (!IMPORT_KEY) return reply({ error: 'Import is off (IMPORT_KEY is not set in Netlify).' }, 503);
  if (typeof body.key !== 'string' || !same(body.key, IMPORT_KEY)) {
    console.warn('[API] Import REFUSED: wrong key.');
    await sleep(500);
    return reply({ error: 'Wrong import key.' }, 403);
  }
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const when = (v) => (v && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : new Date().toISOString());
  let links = 0, done = 0;
  for (const l of (Array.isArray(body.links) ? body.links : []).slice(0, 5)) {
    const link = str(l.link, 500);
    if (!/^https:\/\/([a-z0-9-]+\.)*instagram\.com\//i.test(link)) continue;
    const img = typeof l.image === 'string' && l.image.length < 2000000 ? l.image : '';
    const isJpeg = img && Buffer.from(img.slice(0, 8), 'base64').subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    const rows = await run(db.sql`
      INSERT INTO video_links (link, name, image, created_at) VALUES (${link}, ${str(l.name, 100)}, ${isJpeg ? img : null}, ${when(l.createdAt)})
      ON CONFLICT (link) DO NOTHING RETURNING id`);
    links += rows.length;
  }
  for (const d of (Array.isArray(body.done) ? body.done : []).slice(0, MAX_IMPORT_DONE)) {
    const who = str(d.who, 100).toUpperCase(), link = str(d.link, 500);
    if (!who || !link) continue;
    const rows = await run(db.sql`
      INSERT INTO video_done (who, link, name, stored, done_at)
      SELECT ${who}, ${link}, ${str(d.name, 100)}, ${str(d.stored, 500)}, ${when(d.doneAt)}
      WHERE NOT EXISTS (SELECT 1 FROM video_done WHERE who = ${who} AND link = ${link} AND done_at = ${when(d.doneAt)})
      RETURNING id`);
    done += rows.length;
  }
  console.log('[API DATABASE] Import: links added', links, '| done rows added', done);
  return reply({ links, done });
}

export default async (req) => {
  console.log('[API] Invoked. Method:', req.method);
  // Before a DELETE the browser first asks (OPTIONS) whether it is allowed: say yes.
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  try {
    await ensureTable();

    if (req.method === 'GET') {
      let room = MAX_ROWS;
      if (PACE_ON) {
        const who = whoFor(req.headers.get('x-code'));
        if (!who) {
          if (req.headers.get('x-code')) await sleep(500); // slows down guessing
          return reply({ links: [], needCode: true, message: req.headers.get('x-code') ? 'Wrong code. Type your code again.' : 'Type your code to see your videos.' });
        }
        room = Math.max(0, Math.min(MAX_ROWS, (await dailyNumber(who)) - (await doneToday(who))));
      }
      // The oldest links that fit (the ones worked on first), sent newest first like before
      const links = room ? await run(db.sql`
        SELECT * FROM (
          SELECT id, name, link, created_at AS "createdAt", (image IS NOT NULL) AS "hasImage" FROM video_links ORDER BY id LIMIT ${room}
        ) oldest ORDER BY id DESC`) : [];
      console.log('[API DATABASE] Sent', links.length, 'links (room:', room, ').');
      return reply(links.length || !PACE_ON ? { links } : { links, message: PAUSE_MESSAGE });
    }

    if (req.method === 'POST' && req.headers.get('x-import') === '1') return await importBackup(await req.json().catch(() => ({})));

    if (req.method === 'DELETE' || req.method === 'POST') {
      if (!DONE_CODES.length) {
        console.error('[API] REFUSED: env var DONE_CODES / DONE_CODE is not set in Netlify.');
        return reply({ error: 'Done is not set up on the website yet (DONE_CODES is missing in Netlify).' }, 503);
      }
      const body = await req.json().catch(() => ({}));
      const who = whoFor(body.code);
      if (!who) {
        console.warn('[API] REFUSED: wrong code (code not logged).');
        await sleep(500); // slows down guessing
        return reply({ error: 'Wrong code.' }, 403);
      }

      if (req.method === 'POST') {
        const [{ count }] = await run(db.sql`SELECT count(*)::int AS count FROM video_done WHERE who = ${who}`);
        const videos = await run(db.sql`
          SELECT name, link, stored, done_at AS "doneAt" FROM video_done WHERE who = ${who} ORDER BY id DESC LIMIT ${MAX_DONE_ROWS}`);
        console.log('[API DATABASE] Videos done for', who, ':', count);
        return reply({
          who, count, payAmount: PAY_AMOUNT, payFor: PAY_FOR, payPerVideo: Math.round((PAY_AMOUNT / PAY_FOR) * 100) / 100,
          currency: CURRENCY, total: Math.round((count * PAY_AMOUNT) / PAY_FOR), videos,
        });
      }

      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return reply({ error: 'Which link? The id is missing.' }, 400);
      const stored = typeof body.stored === 'string' ? body.stored.trim() : '';
      if (stored && (stored.length > 500 || !/^https?:\/\//i.test(stored))) return reply({ error: 'The stored-video link must start with https://' }, 400);
      // One statement: the link is removed AND the Done row written, or neither
      const rows = await run(db.sql`
        WITH gone AS (DELETE FROM video_links WHERE id = ${id} RETURNING link, name)
        INSERT INTO video_done (who, link, name, stored) SELECT ${who}, link, name, ${stored} FROM gone RETURNING id`);
      console.log('[API DATABASE] Done by', who, ': removed link id', id, '| found:', rows.length > 0);
      if (!rows.length) return reply({ error: 'That link was already removed.' }, 404);
      return reply({ deleted: 1 });
    }

    return reply({ error: 'Method not allowed.' }, 405);
  } catch (err) {
    console.error('[API] DATABASE error:', err);
    return reply({ error: 'Server error.' }, 500);
  }
};
