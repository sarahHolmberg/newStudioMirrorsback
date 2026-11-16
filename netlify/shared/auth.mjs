/**
 * netlify/shared/auth.mjs
 * -----------------------------------------------------------------------
 * The login for Video Vault: the people of the Code adder page log in with their code and the password set there.
 *   - Passwords are kept only as scrypt hashes (salted, built into Node): never as text.
 *   - A login gives a session cookie: "<code>.<expiry>.<signature>", signed with HMAC-SHA256. It is HttpOnly (page scripts
 *     cannot read it), Secure (https only) and SameSite=Lax, for SESSION_DAYS. Changing it breaks the signature.
 *   - The signing secret is made once, at random, and kept in app_settings (AUTH_SECRET): no Netlify setting needed.
 *     Deleting that row logs everyone out.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { run } from './tables.mjs';
import { norm } from './people.mjs';

const scrypt = promisify(crypto.scrypt);
export const SESSION_DAYS = 30; // CHANGE HERE: how long a login lasts
export const COOKIE = 'sm_session';

/** "scrypt$<salt>$<hash>" for a new password */
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(String(password).normalize('NFKC'), salt, 32);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}
/** true if the password matches the stored hash (constant-time) */
export async function checkPassword(password, stored) {
  const [kind, salt, hash] = String(stored || '').split('$');
  if (kind !== 'scrypt' || !salt || !hash) return false;
  const got = await scrypt(String(password).normalize('NFKC'), Buffer.from(salt, 'base64'), 32);
  const want = Buffer.from(hash, 'base64');
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

let secret = null;
async function getSecret(db) {
  if (secret) return secret;
  await run(db.sql`INSERT INTO app_settings (name, value) VALUES ('AUTH_SECRET', ${crypto.randomBytes(32).toString('base64')}) ON CONFLICT (name) DO NOTHING`);
  const [row] = await run(db.sql`SELECT value FROM app_settings WHERE name = 'AUTH_SECRET'`);
  return (secret = row.value); // the same for every function, even if two make one at the same moment
}
const sign = (s, data) => crypto.createHmac('sha256', s).update(data).digest('base64url');

/** The Set-Cookie header value for a new session of this person */
export async function sessionCookie(db, code) {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const data = `${encodeURIComponent(norm(code))}.${exp}`;
  return `${COOKIE}=${data}.${sign(await getSecret(db), data)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}
export const logoutCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** The logged-in person's code, or null (no cookie, expired, or not signed by us) */
export async function sessionCode(db, req) {
  const raw = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return null;
  const [code, exp, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!code || !exp || !sig || Number(exp) < Date.now()) return null;
  const want = sign(await getSecret(db), `${code}.${exp}`);
  if (sig.length !== want.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  return decodeURIComponent(code);
}
