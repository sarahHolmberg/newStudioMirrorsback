/**
 * netlify/functions/session.mjs
 * -----------------------------------------------------------------------
 * Logging in to Video Vault (see netlify/shared/auth.mjs for how it is kept safe).
 *   POST   { code, password } = log in: sets the session cookie        -> { code, name }
 *   GET                        = who is logged in, and what they added   -> { code, name, added, pay, currency } (401 = nobody)
 *   DELETE                     = log out: removes the cookie
 * The people and their passwords are set on the Code adder page.
 * -----------------------------------------------------------------------
 */
import { getDatabase } from '@netlify/database';
import { run, tables } from '../shared/tables.mjs';
import { norm, findPerson, addPayFor, CURRENCY } from '../shared/people.mjs';
import { checkPassword, sessionCookie, logoutCookie, sessionCode } from '../shared/auth.mjs';

const db = getDatabase();
const ensureTable = tables(db, 'SESSION');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reply = (body, status = 200, headers = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export default async (req) => {
  try {
    await ensureTable();

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const code = norm(body.code), password = typeof body.password === 'string' ? body.password : '';
      const [row] = code ? await run(db.sql`SELECT code, name, password_hash FROM people WHERE code = ${code}`) : [];
      // the same answer (and the same wait) for an unknown code and a wrong password: nothing to learn from it
      if (!row || !password || !(await checkPassword(password, row.password_hash))) {
        console.warn('[SESSION] Login refused.');
        await sleep(700); // slows down guessing
        return reply({ error: 'Wrong code or password.' }, 401);
      }
      console.log('[SESSION] Logged in.');
      return reply({ code: row.code, name: row.name }, 200, { 'Set-Cookie': await sessionCookie(db, row.code) });
    }

    if (req.method === 'GET') {
      const code = await sessionCode(db, req);
      const person = code && (await findPerson(db, code)); // removed on the Code adder page = logged out
      if (!person) return reply({ error: 'Not logged in.' }, 401);
      const [{ added }] = await run(db.sql`SELECT count(*)::int AS added FROM video_added WHERE who = ${person.code}`);
      return reply({ code: person.code, name: person.name, added, pay: addPayFor(added), currency: CURRENCY });
    }

    if (req.method === 'DELETE') return reply({ loggedOut: true }, 200, { 'Set-Cookie': logoutCookie() });

    return reply({ error: 'Method not allowed.' }, 405);
  } catch (err) {
    console.error('[SESSION] error:', err);
    return reply({ error: 'Server error.' }, 500);
  }
};
