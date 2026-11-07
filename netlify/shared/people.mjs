/**
 * netlify/shared/people.mjs
 * -----------------------------------------------------------------------
 * The pay, and finding a person by their code in the people table (filled on the Code adder page). Shared by
 * links-api.mjs (Done, Videos done, pacing) and people.mjs (the Code adder page), so both count and pay the same way.
 * -----------------------------------------------------------------------
 */
import { run } from './tables.mjs';

// CHANGE HERE: the pay: PAY_AMOUNT for PAY_FOR videos (17 000 XAF for 30 videos = 566.67 XAF a video).
// The total is rounded only at the end, so 30 videos is exactly 17 000.
export const PAY_AMOUNT = 17000;
export const PAY_FOR = 30;
export const CURRENCY = 'XAF';
export const payFor = (count) => Math.round((count * PAY_AMOUNT) / PAY_FOR);

export const norm = (s) => (typeof s === 'string' ? s.trim().toUpperCase() : ''); // capitals and spaces do not matter

/** The person with this code, or null: { code, name, deadline ('YYYY-MM-DD' or null), isAdmin } */
export async function findPerson(db, code) {
  const c = norm(code);
  if (!c) return null;
  const [p] = await run(db.sql`
    SELECT code, name, to_char(deadline, 'YYYY-MM-DD') AS deadline, is_admin AS "isAdmin" FROM people WHERE code = ${c}`);
  return p || null;
}
