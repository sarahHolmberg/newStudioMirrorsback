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
// CHANGE HERE: the pay for ADDING videos in Video Vault (counted per logged-in person): 290 XAF a video.
export const ADD_PAY_AMOUNT = 290;
export const ADD_PAY_FOR = 1;
export const addPayFor = (count) => Math.round((count * ADD_PAY_AMOUNT) / ADD_PAY_FOR);

export const norm = (s) => (typeof s === 'string' ? s.trim().toUpperCase() : ''); // capitals and spaces do not matter

// A person's deadline: the Netlify setting DEADLINES ("CODE=YYYY-MM-DD, ...") first, else the one on the Code adder page
const ENV_DEADLINES = Object.fromEntries((process.env.DEADLINES || '').split(',').map((p) => p.split('=').map((x) => x.trim()))
  .filter(([c, d]) => c && /^\d{4}-\d{2}-\d{2}$/.test(d || '')).map(([c, d]) => [c.toUpperCase(), d]));
export const deadlineOf = (person) => (person ? ENV_DEADLINES[person.code] || person.deadline || null : null);

/** A setting saved on the Code adder page (app_settings), or ''. */
export async function getSetting(db, name) {
  const [row] = await run(db.sql`SELECT value FROM app_settings WHERE name = ${name}`);
  return row?.value || '';
}

/** Freeze operations (the Code adder button): while it is on, the Grid Player gets no videos to do. '' = not frozen,
 *  else the moment it was switched on (ISO date). */
export const frozenSince = (db) => getSetting(db, 'FROZEN');
export const FROZEN_MESSAGE = 'Work is paused for now: there are no videos to do. Check again later.'; // CHANGE HERE: what the Grid Player shows

/** The person with this code, or null: { code, name, deadline ('YYYY-MM-DD' or null), isAdmin } */
export async function findPerson(db, code) {
  const c = norm(code);
  if (!c) return null;
  const [p] = await run(db.sql`
    SELECT code, name, to_char(deadline, 'YYYY-MM-DD') AS deadline, is_admin AS "isAdmin" FROM people WHERE code = ${c}`);
  return p || null;
}
