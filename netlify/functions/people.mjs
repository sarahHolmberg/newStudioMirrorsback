/**
 * netlify/functions/people.mjs
 * -----------------------------------------------------------------------
 * The Code adder page (/code-adder/): the people and their codes, kept in the DATABASE (table people).
 * A code added here works at once for Done, Videos done, the pay and the pace (links-api.mjs).
 * Every request is POST { action, key, ... }; key = the admin key:
 *   - the code of a person ticked "admin" on this page, or
 *   - ADMIN_KEY (CHANGE IN NETLIFY, optional: a key that always works, e.g. if you lock yourself out).
 * While there is no admin at all (first use), the page may add ONE person, who becomes the admin.
 *   status                                   -> { setup: true/false }  (no key needed)
 *   list                                     -> { people: [{ code, name, deadline, isAdmin, done, pay }], payAmount, payFor, currency }
 *   save   { code, name, deadline, isAdmin } -> add, or change the person with that code
 *   remove { code }                          -> remove the person (their videos done stay; the code stops working)
 *   setting { name: "INBOX_KEY", value }     -> save a setting (empty value = remove it). list says which are set.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';
import { run, tables } from '../shared/tables.mjs';
import { PAY_AMOUNT, PAY_FOR, CURRENCY, payFor, norm, findPerson, getSetting } from '../shared/people.mjs';

const SETTINGS = ['INBOX_KEY']; // CHANGE HERE: the settings the page may save (the values are never sent back to the page)

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const sha = (s) => crypto.createHash('sha256').update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b)); // constant-time compare
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

const db = getDatabase();
const ensureTable = tables(db, 'PEOPLE');
const adminCount = async () => (await run(db.sql`SELECT count(*)::int AS n FROM people WHERE is_admin`))[0].n;

/** Is this key allowed to change the people? (ADMIN_KEY, or the code of an admin) */
async function isAdmin(key) {
  if (typeof key !== 'string' || !key.trim()) return false;
  if (ADMIN_KEY && same(key.trim(), ADMIN_KEY)) return true;
  return !!(await findPerson(db, key))?.isAdmin;
}

export default async (req) => {
  if (req.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405);
  try {
    await ensureTable();
    const body = await req.json().catch(() => ({}));
    const setup = !ADMIN_KEY && (await adminCount()) === 0; // first use: nobody can open the page yet

    if (body.action === 'status') return reply({ setup });

    if (!setup && !(await isAdmin(body.key))) {
      console.warn('[PEOPLE] REFUSED: wrong admin key.');
      await sleep(500); // slows down guessing
      return reply({ error: 'Wrong admin key.' }, 403);
    }

    if (body.action === 'list') {
      const people = await run(db.sql`
        SELECT p.code, p.name, to_char(p.deadline, 'YYYY-MM-DD') AS deadline, p.is_admin AS "isAdmin",
               (SELECT count(*)::int FROM video_done d WHERE d.who = p.code) AS done
        FROM people p ORDER BY p.created_at`);
      people.forEach((p) => (p.pay = payFor(p.done)));
      const settings = {};
      for (const n of SETTINGS) settings[n] = process.env[n] ? 'netlify' : (await getSetting(db, n)) ? 'page' : '';
      return reply({ people, payAmount: PAY_AMOUNT, payFor: PAY_FOR, currency: CURRENCY, settings });
    }

    if (body.action === 'save') {
      const code = norm(body.code);
      if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return reply({ error: 'The code: 3 to 40 letters or digits (no spaces; - and _ are fine).' }, 400);
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
      const deadline = typeof body.deadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.deadline) ? body.deadline : null;
      const makeAdmin = setup || body.isAdmin === true; // the very first person is always the admin
      const before = await findPerson(db, code);
      if (before?.isAdmin && !makeAdmin && (await adminCount()) === 1) return reply({ error: 'This is the only admin: tick "admin" for someone else first.' }, 400);
      await run(db.sql`
        INSERT INTO people (code, name, deadline, is_admin) VALUES (${code}, ${name}, ${deadline}, ${makeAdmin})
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, deadline = EXCLUDED.deadline, is_admin = EXCLUDED.is_admin`);
      console.log('[PEOPLE] Saved', before ? '(changed)' : '(new)', 'admin:', makeAdmin);
      return reply({ saved: code, isNew: !before, setup });
    }

    if (body.action === 'remove') {
      const p = await findPerson(db, body.code);
      if (!p) return reply({ error: 'There is no one with that code.' }, 404);
      if (p.isAdmin && (await adminCount()) === 1) return reply({ error: 'This is the only admin: tick "admin" for someone else first.' }, 400);
      await run(db.sql`DELETE FROM people WHERE code = ${p.code}`);
      console.log('[PEOPLE] Removed one person (their videos done stay).');
      return reply({ removed: p.code });
    }

    if (body.action === 'setting') {
      if (setup) return reply({ error: 'Add the first admin first.' }, 400);
      if (!SETTINGS.includes(body.name)) return reply({ error: 'Unknown setting.' }, 400);
      const value = typeof body.value === 'string' ? body.value.trim().slice(0, 500) : '';
      if (value) await run(db.sql`INSERT INTO app_settings (name, value) VALUES (${body.name}, ${value}) ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value`);
      else await run(db.sql`DELETE FROM app_settings WHERE name = ${body.name}`);
      console.log('[PEOPLE] Setting', body.name, value ? 'saved' : 'removed');
      return reply({ setting: body.name, set: !!value });
    }

    return reply({ error: 'Unknown action.' }, 400);
  } catch (err) {
    console.error('[PEOPLE] DATABASE error:', err);
    return reply({ error: 'Server error.' }, 500);
  }
};
