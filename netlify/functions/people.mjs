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
 *   list                                     -> { people: [{ code, name, deadline, isAdmin, hasPassword, done, pay, added, addPay, trimmed, trimPay }], ... }
 *   save   { code, name, deadline, isAdmin, password? } -> add, or change the person with that code
 *                                            (password = their Video Vault login; empty keeps the old one)
 *   remove { code }                          -> remove the person (their videos done stay; the code stops working)
 *   setting { name: "INBOX_KEY", value }     -> save a setting (empty value = remove it). list says which are set.
 *   freeze { on: true/false }                -> Freeze operations: while on, the Grid Player gets no videos to do.
 *                                               list says { frozen: '' or the moment it was switched on }
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';
import { run, tables } from '../shared/tables.mjs';
import { PAY_AMOUNT, PAY_FOR, ADD_PAY_AMOUNT, ADD_PAY_FOR, TRIM_PAY_AMOUNT, TRIM_PAY_FOR, CURRENCY, payFor, addPayFor, trimPayFor, norm, findPerson, getSetting, frozenSince } from '../shared/people.mjs';
import { hashPassword } from '../shared/auth.mjs';

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
               (p.password_hash IS NOT NULL) AS "hasPassword",
               (SELECT count(*)::int FROM video_done d WHERE d.who = p.code) AS done,
               (SELECT count(*)::int FROM video_added a WHERE a.who = p.code) AS added,
               (SELECT count(*)::int FROM video_trimmed t WHERE t.who = p.code) AS trimmed
        FROM people p ORDER BY p.created_at`);
      people.forEach((p) => { p.pay = payFor(p.done); p.addPay = addPayFor(p.added); p.trimPay = trimPayFor(p.trimmed); });
      const settings = {};
      for (const n of SETTINGS) settings[n] = process.env[n] ? 'netlify' : (await getSetting(db, n)) ? 'page' : '';
      return reply({ people, payAmount: PAY_AMOUNT, payFor: PAY_FOR, addPayAmount: ADD_PAY_AMOUNT, addPayFor: ADD_PAY_FOR, trimPayAmount: TRIM_PAY_AMOUNT, trimPayFor: TRIM_PAY_FOR, currency: CURRENCY, settings, frozen: await frozenSince(db) });
    }

    if (body.action === 'save') {
      const code = norm(body.code);
      if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return reply({ error: 'The code: 3 to 40 letters or digits (no spaces; - and _ are fine).' }, 400);
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
      const deadline = typeof body.deadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.deadline) ? body.deadline : null;
      const makeAdmin = setup || body.isAdmin === true; // the very first person is always the admin
      const before = await findPerson(db, code);
      if (before?.isAdmin && !makeAdmin && (await adminCount()) === 1) return reply({ error: 'This is the only admin: tick "admin" for someone else first.' }, 400);
      // The Video Vault password: empty = keep the one they have; otherwise at least 8 characters, kept only as a hash
      const password = typeof body.password === 'string' ? body.password : '';
      if (password && password.length < 8) return reply({ error: 'The password: at least 8 characters.' }, 400);
      const hash = password ? await hashPassword(password) : null;
      await run(db.sql`
        INSERT INTO people (code, name, deadline, is_admin, password_hash) VALUES (${code}, ${name}, ${deadline}, ${makeAdmin}, ${hash})
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, deadline = EXCLUDED.deadline, is_admin = EXCLUDED.is_admin,
          password_hash = COALESCE(EXCLUDED.password_hash, people.password_hash)`);
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

    if (body.action === 'freeze') {
      if (setup) return reply({ error: 'Add the first admin first.' }, 400);
      if (body.on === true) await run(db.sql`INSERT INTO app_settings (name, value) VALUES ('FROZEN', ${new Date().toISOString()}) ON CONFLICT (name) DO NOTHING`);
      else await run(db.sql`DELETE FROM app_settings WHERE name = 'FROZEN'`);
      console.warn('[PEOPLE] Operations', body.on === true ? 'FROZEN' : 'unfrozen');
      return reply({ frozen: await frozenSince(db) });
    }

    return reply({ error: 'Unknown action.' }, 400);
  } catch (err) {
    console.error('[PEOPLE] DATABASE error:', err);
    return reply({ error: 'Server error.' }, 500);
  }
};
