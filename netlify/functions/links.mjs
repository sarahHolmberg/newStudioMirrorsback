/**
 * netlify/functions/links.mjs
 * -----------------------------------------------------------------------
 * Instagram links (+ a name) stored in the Netlify DATABASE (Postgres).
 *   GET    ?before=<id>        = next page of links, newest first
 *   POST   { link, name }      = save a new link (name is optional)
 *   DELETE { ids, code }       = remove clipped links; needs the scissors code
 * The scissors code is checked HERE (server side). The page never contains it.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';

// CHANGE HERE: how many links each "load" returns.
const PAGE_SIZE = 5;
const MAX_LINK_LENGTH = 500;
const MAX_NAME_LENGTH = 100;
const MAX_DELETE = 50;
const MAX_ID = 2147483647; // "before" default = start from the newest
// CHANGE HERE: code needed to remove clipped links. Best: set env var SCISSORS_CODE in Netlify.
const SCISSORS_CODE = process.env.SCISSORS_CODE || 'scissors';

const db = getDatabase();
console.log('[LINKS INIT] DATABASE client ready.');

const sha = (s) => crypto.createHash('sha256').update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b)); // constant-time compare
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Runs a db.sql query and always returns an array of rows. */
async function run(query) {
  const res = typeof query.execute === 'function' ? await query.execute() : await query;
  return Array.isArray(res) ? res : res?.rows ?? [];
}

// Create/upgrade the table once per cold start. If it fails, try again next request.
let tableReady = null;
function ensureTable() {
  if (!tableReady) {
    console.log('[LINKS DATABASE] Ensuring table video_links (with name column) exists.');
    tableReady = (async () => {
      await run(db.sql`
        CREATE TABLE IF NOT EXISTS video_links (
          id SERIAL PRIMARY KEY,
          link TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`);
      await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT ''`);
    })().catch((err) => { tableReady = null; throw err; });
  }
  return tableReady;
}

/** Returns a clean https Instagram URL string, or null if the link is not acceptable. */
function cleanInstagramLink(raw) {
  if (typeof raw !== 'string' || !raw.trim() || raw.length > MAX_LINK_LENGTH) return null;
  try {
    const url = new URL(raw.trim());
    const host = url.hostname.toLowerCase();
    const isInstagram = host === 'instagram.com' || host.endsWith('.instagram.com');
    return url.protocol === 'https:' && isInstagram ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async (req) => {
  console.log('[LINKS] Invoked. Method:', req.method);
  try {
    await ensureTable();

    if (req.method === 'GET') {
      const before = Number(new URL(req.url).searchParams.get('before')) || MAX_ID;
      const rows = await run(db.sql`
        SELECT id, link, name FROM video_links
        WHERE id < ${before} ORDER BY id DESC LIMIT ${PAGE_SIZE + 1}`);
      const hasMore = rows.length > PAGE_SIZE; // we asked for one extra row to know
      const links = rows.slice(0, PAGE_SIZE);
      console.log('[LINKS DATABASE] Read. before:', before, '| returned:', links.length, '| hasMore:', hasMore);
      return Response.json({ links, hasMore });
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const link = cleanInstagramLink(body.link);
      if (!link) {
        console.warn('[LINKS] Rejected: not a valid https Instagram link.');
        return Response.json({ error: 'Please paste a valid Instagram link (https://www.instagram.com/...).' }, { status: 400 });
      }
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, MAX_NAME_LENGTH) : '';
      // Same link again: only fills in a name if the saved one was empty.
      const rows = await run(db.sql`
        INSERT INTO video_links (link, name) VALUES (${link}, ${name})
        ON CONFLICT (link) DO UPDATE SET name = EXCLUDED.name
        WHERE video_links.name = '' AND EXCLUDED.name <> '' RETURNING id`);
      const added = rows.length > 0;
      console.log('[LINKS DATABASE] Write done. Added:', added, '| has name:', !!name);
      return Response.json({ added }, { status: added ? 201 : 200 });
    }

    if (req.method === 'DELETE') {
      const body = await req.json().catch(() => ({}));
      if (typeof body.code !== 'string' || !same(body.code, SCISSORS_CODE)) {
        console.warn('[LINKS] Remove REFUSED: wrong code (code not logged).');
        await sleep(500); // slows down guessing
        return Response.json({ error: 'Wrong code.' }, { status: 403 });
      }
      const ids = Array.isArray(body.ids) ? body.ids.filter(Number.isInteger).slice(0, MAX_DELETE) : [];
      if (!ids.length) return Response.json({ error: 'Select at least one video.' }, { status: 400 });
      for (const id of ids) await run(db.sql`DELETE FROM video_links WHERE id = ${id}`);
      console.log('[LINKS DATABASE] Removed clipped links:', ids.length);
      return Response.json({ deleted: ids.length });
    }

    console.warn('[LINKS] Unsupported method:', req.method);
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  } catch (err) {
    console.error('[LINKS] DATABASE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
};