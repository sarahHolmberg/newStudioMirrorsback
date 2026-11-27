/**
 * netlify/shared/tables.mjs
 * -----------------------------------------------------------------------
 * The DATABASE tables, made in ONE place for both functions (links.mjs = Video Vault,
 * links-api.mjs = Grid Player), so they always agree:
 *   video_links : the Instagram links waiting (link, name, image = the target picture, profile = the profile picture,
 *                 trim_end = where the video ends, set on the phone trimmer: first_beat + bpm -> bar 5 beat 3; trimmed_by = who)
 *   video_done  : one row per Done in the Grid Player (who, link, name, stored video link)
 *   people      : the codes (one per person), added on the Code adder page: name, deadline, admin (may open that page),
 *                 password_hash (scrypt) for logging in to Video Vault
 *   video_added : one row per video added in Video Vault by a logged-in person (kept when the link is Done)
 *   video_trimmed: one row per video trimmed on the phone trimmer (who = the code; kept when the link is Done): for the pay
 *   app_settings: settings saved on the Code adder page (name, value), e.g. INBOX_KEY
 *   task_uploads, task_parts: a video being uploaded in pieces for the comic server (task.mjs); deleted once sent
 *   app_resets  : which one-time clears have already run (see RESET below)
 * Not a function itself: it is outside netlify/functions, and Netlify bundles it into the two that import it.
 * -----------------------------------------------------------------------
 */

// CHANGE HERE: to empty the whole database ONE more time, put a new name here (for example 'clear-2026-12-01') and deploy.
// The first request after the deploy empties video_links and video_done and notes the name, so it never runs twice.
// null = no clear.
const RESET = 'clear-2026-11-04';

/** Runs a db.sql query and always returns an array of rows. */
export async function run(query) {
  const res = typeof query.execute === 'function' ? await query.execute() : await query;
  return Array.isArray(res) ? res : res?.rows ?? [];
}

/** Creates/upgrades the tables (and does the one-time clear). Returns a function to call before each request. */
export function tables(db, tag) {
  let ready = null;
  return () => {
    if (!ready) {
      console.log(`[${tag} DATABASE] Ensuring the tables exist.`);
      ready = (async () => {
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS video_links (
            id SERIAL PRIMARY KEY,
            link TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )`);
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT ''`);
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS image TEXT`);
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS profile TEXT`);
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS trim_end REAL`);   // seconds; NULL = not trimmed yet
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS first_beat REAL`);
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS bpm REAL`);
        await run(db.sql`ALTER TABLE video_links ADD COLUMN IF NOT EXISTS trimmed_by TEXT`);
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS video_done (
            id SERIAL PRIMARY KEY,
            who TEXT NOT NULL,
            link TEXT NOT NULL,
            name TEXT NOT NULL DEFAULT '',
            stored TEXT NOT NULL DEFAULT '',
            done_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )`);
        await run(db.sql`CREATE INDEX IF NOT EXISTS video_done_who ON video_done (who)`);
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS people (
            code TEXT PRIMARY KEY,
            name TEXT NOT NULL DEFAULT '',
            deadline DATE,
            is_admin BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )`);
        await run(db.sql`ALTER TABLE people ADD COLUMN IF NOT EXISTS password_hash TEXT`);
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS video_added (
            id SERIAL PRIMARY KEY,
            who TEXT NOT NULL,
            link TEXT NOT NULL,
            name TEXT NOT NULL DEFAULT '',
            added_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )`);
        await run(db.sql`CREATE INDEX IF NOT EXISTS video_added_who ON video_added (who)`);
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS video_trimmed (
            id SERIAL PRIMARY KEY,
            who TEXT NOT NULL,
            link TEXT NOT NULL,
            name TEXT NOT NULL DEFAULT '',
            trimmed_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )`);
        await run(db.sql`CREATE INDEX IF NOT EXISTS video_trimmed_who ON video_trimmed (who)`);
        await run(db.sql`CREATE TABLE IF NOT EXISTS app_settings (name TEXT PRIMARY KEY, value TEXT NOT NULL)`);
        // A video on its way to the comic server (task.mjs): uploaded in pieces, deleted once the server has it
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS task_uploads (
            task_id TEXT PRIMARY KEY,
            who TEXT NOT NULL,
            size INTEGER NOT NULL,
            parts INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )`);
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS task_parts (
            task_id TEXT NOT NULL,
            part INTEGER NOT NULL,
            data TEXT NOT NULL,
            PRIMARY KEY (task_id, part)
          )`);
        await run(db.sql`
          CREATE TABLE IF NOT EXISTS app_resets (name TEXT PRIMARY KEY, done_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
        if (RESET) {
          // Only the request that manages to write the name does the clear, even if two start at the same moment
          const won = await run(db.sql`INSERT INTO app_resets (name) VALUES (${RESET}) ON CONFLICT DO NOTHING RETURNING name`);
          if (won.length) {
            await run(db.sql`TRUNCATE video_links, video_done RESTART IDENTITY`);
            console.warn(`[${tag} DATABASE] One-time clear "${RESET}" done: all links and all videos done removed.`);
          }
        }
      })().catch((err) => { ready = null; throw err; });
    }
    return ready;
  };
}
