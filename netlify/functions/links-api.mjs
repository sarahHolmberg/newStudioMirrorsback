/**
 * netlify/functions/links-api.mjs
 * -----------------------------------------------------------------------
 * API for OTHER apps (e.g. the Grid Player) to read the links and mark one done.
 *   GET                 = { links: [{ id, name, link, createdAt }] }, newest first
 *   DELETE { id, code } = remove ONE link (the Grid Player's Done button); needs the done code
 * Reading needs no code: only trusted people have the apps, and the same list is already
 * visible on the Video Vault page. Removing needs the done code, which is checked HERE
 * (server side). It lives only in the Netlify env var DONE_CODE, never in this public repo.
 * Any website may call it (CORS is open): the Grid Player runs from a file on your computer.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';

// CHANGE HERE: most links one request can return (newest first).
const MAX_ROWS = 500;
// CHANGE IN NETLIFY, not here: Site configuration -> Environment variables -> DONE_CODE.
// Without it Done is switched off. Never write the code in this file: the repo is public.
const DONE_CODE = process.env.DONE_CODE || '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const reply = (body, status = 200) =>
  Response.json(body, { status, headers: { ...CORS, 'Cache-Control': 'no-store' } });

const norm = (s) => s.trim().toUpperCase(); // capitals and spaces around the code do not matter
const sha = (s) => crypto.createHash('sha256').update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b)); // constant-time compare
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const db = getDatabase();
console.log('[API INIT] DATABASE client ready.');

/** Runs a db.sql query and always returns an array of rows. */
async function run(query) {
  const res = typeof query.execute === 'function' ? await query.execute() : await query;
  return Array.isArray(res) ? res : res?.rows ?? [];
}

// Same table as links.mjs (keep in sync), so this API also works before links.mjs has ever run.
let tableReady = null;
function ensureTable() {
  if (!tableReady) {
    console.log('[API DATABASE] Ensuring table video_links exists.');
    tableReady = (async () => {
      await run(db.sql`
        CREATE TABLE IF NOT EXISTS video_links (
          id SERIAL PRIMARY KEY,
          link TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`);
      await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT ''`);
      await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS image TEXT`);
    })().catch((err) => { tableReady = null; throw err; });
  }
  return tableReady;
}

export default async (req) => {
  console.log('[API] Invoked. Method:', req.method);
  // Before a DELETE the browser first asks (OPTIONS) whether it is allowed: say yes.
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const links = await run(db.sql`
        SELECT id, name, link, created_at AS "createdAt" FROM video_links ORDER BY id DESC LIMIT ${MAX_ROWS}`);
      console.log('[API DATABASE] Sent', links.length, 'links.');
      return reply({ links });
    }

    if (req.method === 'DELETE') {
      if (!DONE_CODE) {
        console.error('[API] Done REFUSED: env var DONE_CODE is not set in Netlify.');
        return reply({ error: 'Done is not set up on the website yet (DONE_CODE is missing in Netlify).' }, 503);
      }
      const body = await req.json().catch(() => ({}));
      if (typeof body.code !== 'string' || !same(norm(body.code), norm(DONE_CODE))) {
        console.warn('[API] Done REFUSED: wrong code (code not logged).');
        await sleep(500); // slows down guessing
        return reply({ error: 'Wrong code.' }, 403);
      }
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return reply({ error: 'Which link? The id is missing.' }, 400);
      const rows = await run(db.sql`DELETE FROM video_links WHERE id = ${id} RETURNING id`);
      console.log('[API DATABASE] Done: removed link id', id, '| found:', rows.length > 0);
      if (!rows.length) return reply({ error: 'That link was already removed.' }, 404);
      return reply({ deleted: 1 });
    }

    return reply({ error: 'Method not allowed.' }, 405);
  } catch (err) {
    console.error('[API] DATABASE error:', err);
    return reply({ error: 'Server error.' }, 500);
  }
};
