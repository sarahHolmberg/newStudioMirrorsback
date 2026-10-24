/**
 * netlify/functions/links-api.mjs
 * -----------------------------------------------------------------------
 * API for OTHER apps (e.g. the Grid Player) to read all links and names.
 *   GET  = { links: [{ id, name, link }] }, newest first
 * No access code: only trusted people have the apps. Any website may call it
 * (CORS is open), and the same list is already visible on the Video Vault page.
 * -----------------------------------------------------------------------
 */
import { getDatabase } from '@netlify/database';

// CHANGE HERE: most links one request can return (newest first).
const MAX_ROWS = 500;

const CORS = { 'Access-Control-Allow-Origin': '*' };
const reply = (body, status = 200) =>
  Response.json(body, { status, headers: { ...CORS, 'Cache-Control': 'no-store' } });

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
  if (req.method !== 'GET') return reply({ error: 'Method not allowed.' }, 405);

  try {
    await ensureTable();
    const links = await run(db.sql`SELECT id, name, link FROM video_links ORDER BY id DESC LIMIT ${MAX_ROWS}`);
    console.log('[API DATABASE] Sent', links.length, 'links.');
    return reply({ links });
  } catch (err) {
    console.error('[API] DATABASE error:', err);
    return reply({ error: 'Server error.' }, 500);
  }
};