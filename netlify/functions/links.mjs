/**
 * netlify/functions/links.mjs
 * -----------------------------------------------------------------------
 * Instagram links (+ a name + a picture) stored in the Netlify DATABASE.
 *   GET    ?before=<id>            = next page of links, newest first
 *   GET    ?image=<id>             = the picture of one link (JPEG)
 *   POST   { link, name, image }   = save a new link; image (JPEG, base64) is required
 *   DELETE { ids, code }           = remove clipped links; needs the scissors code
 * The scissors code is checked HERE (server side). The page never contains it.
 * Pictures are kept as base64 text in the DATABASE and are NOT sent with the
 * list, so the list stays fast; each picture is fetched only when downloaded.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';

// CHANGE HERE: how many links each "load" returns.
const PAGE_SIZE = 5;
const MAX_LINK_LENGTH = 500;
const MAX_NAME_LENGTH = 100;
const MAX_DELETE = 50;
const MAX_IMAGE_B64 = 2000000; // picture size limit in base64 characters (about 1.5 MB)
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
    console.log('[LINKS DATABASE] Ensuring table video_links (name + image columns) exists.');
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

/** Returns the picture as clean base64 if it is a real JPEG within the size limit, else null. */
function cleanImage(raw) {
  if (typeof raw !== 'string' || !raw || raw.length > MAX_IMAGE_B64) return null;
  const buf = Buffer.from(raw, 'base64');
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff; // JPEG signature
  return isJpeg ? buf.toString('base64') : null;
}

export default async (req) => {
  console.log('[LINKS] Invoked. Method:', req.method);
  try {
    await ensureTable();

    if (req.method === 'GET') {
      const params = new URL(req.url).searchParams;

      const imageId = Number(params.get('image'));
      if (imageId) {
        const [row] = await run(db.sql`SELECT image FROM video_links WHERE id = ${imageId}`);
        if (!row?.image) {
          console.warn('[LINKS] No picture for id:', imageId);
          return Response.json({ error: 'No picture.' }, { status: 404 });
        }
        console.log('[LINKS DATABASE] Sending picture for id:', imageId);
        return new Response(Buffer.from(row.image, 'base64'), {
          headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=3600' },
        });
      }

      const before = Number(params.get('before')) || MAX_ID;
      const rows = await run(db.sql`
        SELECT id, link, name, (image IS NOT NULL) AS has_image FROM video_links
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
      const image = cleanImage(body.image);
      if (!image) {
        console.warn('[LINKS] Rejected: picture missing, not a JPEG, or too big.');
        return Response.json({ error: 'A picture is required (JPEG, not too big).' }, { status: 400 });
      }
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, MAX_NAME_LENGTH) : '';
      // Same link again: only fills in a missing name or picture, never overwrites.
      const rows = await run(db.sql`
        INSERT INTO video_links (link, name, image) VALUES (${link}, ${name}, ${image})
        ON CONFLICT (link) DO UPDATE SET
          name = CASE WHEN video_links.name = '' THEN EXCLUDED.name ELSE video_links.name END,
          image = COALESCE(video_links.image, EXCLUDED.image)
        WHERE (video_links.name = '' AND EXCLUDED.name <> '') OR video_links.image IS NULL
        RETURNING id`);
      const added = rows.length > 0;
      console.log('[LINKS DATABASE] Write done. Added:', added, '| has name:', !!name, '| picture chars:', image.length);
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