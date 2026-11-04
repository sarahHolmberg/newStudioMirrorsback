/**
 * netlify/functions/links-api.mjs
 * -----------------------------------------------------------------------
 * API for OTHER apps (e.g. the Grid Player) to read the links and mark one done.
 *   GET                          = { links: [{ id, name, link, createdAt, hasImage }] }, newest first
 *                                  (the picture itself: GET /.netlify/functions/links?image=<id>)
 *   DELETE { id, code, stored }  = the Grid Player's Done button: writes a row in video_done (who = the code,
 *                                  the link, the name, stored = where the finished video is) and removes the link
 *   POST { code }                = "videos done" for that code: { who, count, payAmount, payFor, payPerVideo, currency, total, videos }
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
// CHANGE IN NETLIFY, not here: Site configuration -> Environment variables ->
//   DONE_CODES = everyone's codes, separated by commas (for example: SARAH, BRYAN). Each person types their own.
//   DONE_CODE  = the older single code; still accepted.
// Without either, Done is switched off. Never write the codes in this file: the repo is public.
const DONE_CODES = [...(process.env.DONE_CODES || '').split(','), process.env.DONE_CODE || '']
  .map((c) => c.trim().toUpperCase()).filter(Boolean);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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

export default async (req) => {
  console.log('[API] Invoked. Method:', req.method);
  // Before a DELETE the browser first asks (OPTIONS) whether it is allowed: say yes.
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const links = await run(db.sql`
        SELECT id, name, link, created_at AS "createdAt", (image IS NOT NULL) AS "hasImage" FROM video_links ORDER BY id DESC LIMIT ${MAX_ROWS}`);
      console.log('[API DATABASE] Sent', links.length, 'links.');
      return reply({ links });
    }

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
