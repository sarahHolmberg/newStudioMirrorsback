/**
 * netlify/functions/inbox.mjs
 * -----------------------------------------------------------------------
 * Passes a finished video's link on to the render inbox, with the secret inbox key added HERE (server side): the
 * Grid Player runs in the browser, so a key in it could be read by anyone.
 *   POST { code, url, title? } -> { received: "<id>" }
 *     code  = the person's code (DONE_CODES in Netlify, or the Code adder page), so strangers cannot use it
 *     url   = the link to the video (http/https), title = optional (the Grid Player sends "<name> #<link id>")
 * The key: INBOX_KEY in Netlify, or the Settings box on the Code adder page. CHANGE IN NETLIFY (optional): INBOX_URL.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';
import { tables } from '../shared/tables.mjs';
import { norm, findPerson, getSetting } from '../shared/people.mjs';

const INBOX_URL = process.env.INBOX_URL || 'https://remotion-render-15508612518.us-central1.run.app/api/inbox';
const DONE_CODES = [...(process.env.DONE_CODES || '').split(','), process.env.DONE_CODE || ''].map((c) => c.trim().toUpperCase()).filter(Boolean);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const reply = (body, status = 200) => Response.json(body, { status, headers: { ...CORS, 'Cache-Control': 'no-store' } });
const sha = (s) => crypto.createHash('sha256').update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const db = getDatabase();
const ensureTable = tables(db, 'INBOX');

async function whoFor(code) {
  if (!norm(code)) return null;
  let who = null;
  for (const c of DONE_CODES) if (same(norm(code), c)) who = c;
  return who || (await findPerson(db, code))?.code || null;
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405);
  try {
    await ensureTable();
    const body = await req.json().catch(() => ({}));
    const who = await whoFor(body.code);
    if (!who) { await sleep(500); return reply({ error: 'Wrong code.' }, 403); }
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    if (!/^https?:\/\/\S+$/i.test(url) || url.length > 1000) return reply({ error: 'The link must start with http:// or https://' }, 400);
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 200) : '';
    const key = process.env.INBOX_KEY || (await getSetting(db, 'INBOX_KEY'));
    if (!key) return reply({ error: 'The inbox key is not set yet (Code adder page -> Settings, or INBOX_KEY in Netlify).' }, 503);

    const res = await fetch(INBOX_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(title ? { url, title } : { url }),
    });
    const data = await res.json().catch(() => ({}));
    console.log('[INBOX] Sent for', who, '-> status', res.status);
    if (res.status === 401) return reply({ error: 'The inbox refused the key: check the inbox key on the Code adder page.' }, 502);
    if (res.status === 400) return reply({ error: 'The inbox refused the link (it must be an http/https link).' }, 400);
    if (!res.ok || !data.received) return reply({ error: `The inbox did not take it (${res.status}).` }, 502);
    return reply({ received: data.received });
  } catch (err) {
    console.error('[INBOX] error:', err);
    return reply({ error: 'Could not reach the inbox. Try again.' }, 502);
  }
};
