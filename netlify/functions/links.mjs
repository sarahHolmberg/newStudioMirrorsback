/**
 * netlify/functions/links.mjs
 * -----------------------------------------------------------------------
 * Instagram links stored in the Netlify DATABASE (Postgres).
 *   GET  ?before=<id>  = next page of links, newest first (PAGE_SIZE at a time)
 *   POST { link }      = save a new Instagram link
 * The table is created automatically on first use (CREATE TABLE IF NOT EXISTS).
 * -----------------------------------------------------------------------
 */
import { getDatabase } from '@netlify/database';

// CHANGE HERE: how many links each "load" returns.
const PAGE_SIZE = 5;
const MAX_LINK_LENGTH = 500;
const MAX_ID = 2147483647; // "before" default = start from the newest

const db = getDatabase();
console.log('[LINKS INIT] DATABASE client ready.');

/** Runs a db.sql query and always returns an array of rows. */
async function run(query) {
  const res = typeof query.execute === 'function' ? await query.execute() : await query;
  return Array.isArray(res) ? res : res?.rows ?? [];
}

// Create the table once per cold start. If it fails, try again next request.
let tableReady = null;
function ensureTable() {
  if (!tableReady) {
    console.log('[LINKS DATABASE] Ensuring table video_links exists.');
    tableReady = run(db.sql`
      CREATE TABLE IF NOT EXISTS video_links (
        id SERIAL PRIMARY KEY,
        link TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`).catch((err) => { tableReady = null; throw err; });
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
        SELECT id, link FROM video_links
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
      const rows = await run(db.sql`
        INSERT INTO video_links (link) VALUES (${link})
        ON CONFLICT (link) DO NOTHING RETURNING id`);
      const added = rows.length > 0;
      console.log('[LINKS DATABASE] Write done. Added:', added, '(false = duplicate)');
      return Response.json({ added }, { status: added ? 201 : 200 });
    }

    console.warn('[LINKS] Unsupported method:', req.method);
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  } catch (err) {
    console.error('[LINKS] DATABASE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
};