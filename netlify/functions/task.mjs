/**
 * netlify/functions/task.mjs
 * -----------------------------------------------------------------------
 * Sends a finished video + its transcript to the comic server (Google Cloud Run, POST /api/tasks), with the secret
 * INBOX_KEY added HERE (server side): the Grid Player runs in the browser, so a key in it could be read by anyone.
 * A Netlify function takes at most about 6 MB per request and a video may be 13 MB, so the Grid Player uploads it in
 * pieces first; the pieces wait in the database and are deleted once the comic server has the video.
 *   POST ?step=start  { code, taskId, size, parts }   -> { ok }          (starts again from nothing for that taskId)
 *   PUT  ?step=part&taskId=..&n=..  (header X-Code; body = the piece's bytes, at most PART_MAX)
 *   POST ?step=send   { code, taskId, transcript }     -> the comic server's answer { ok, code, message, ... }
 *        code MISSING_PARTS = the pieces are gone (or never all arrived): upload again;
 *        temporary: true    = a timeout / 5xx without a code: try again later with the SAME taskId (safe)
 *   POST ?step=status { code, taskId }                 -> the comic server's GET /api/tasks/<taskId>
 * Only for a valid code (the Code adder page, or DONE_CODES in Netlify). The key: INBOX_KEY in Netlify, or the
 * Settings box on the Code adder page. CHANGE IN NETLIFY (optional): TASKS_URL.
 * -----------------------------------------------------------------------
 */
import crypto from 'node:crypto';
import { getDatabase } from '@netlify/database';
import { run, tables } from '../shared/tables.mjs';
import { norm, findPerson, getSetting } from '../shared/people.mjs';

const TASKS_URL = process.env.TASKS_URL || 'https://remotion-render-15508612518.us-central1.run.app/api/tasks';
const VIDEO_MAX = 13631488;          // the comic server's limit (13 MB)
const PART_MAX = 3 * 1024 * 1024;    // CHANGE HERE (and in the Grid Player): one piece; stays under Netlify's ~6 MB per request
const TRANSCRIPT_MAX = 50000;
const KEEP_HOURS = 48;               // unfinished uploads older than this are deleted
const DONE_CODES = [...(process.env.DONE_CODES || '').split(','), process.env.DONE_CODE || ''].map((c) => c.trim().toUpperCase()).filter(Boolean);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Code' };
const reply = (body, status = 200) => Response.json(body, { status, headers: { ...CORS, 'Cache-Control': 'no-store' } });
const sha = (s) => crypto.createHash('sha256').update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const validTaskId = (t) => typeof t === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(t);

const db = getDatabase();
const ensureTable = tables(db, 'TASK');

async function whoFor(code) {
  if (!norm(code)) return null;
  let who = null;
  for (const c of DONE_CODES) if (same(norm(code), c)) who = c;
  return who || (await findPerson(db, code))?.code || null;
}
const inboxKey = async () => process.env.INBOX_KEY || (await getSetting(db, 'INBOX_KEY'));
const forget = (taskId) => Promise.all([run(db.sql`DELETE FROM task_parts WHERE task_id = ${taskId}`), run(db.sql`DELETE FROM task_uploads WHERE task_id = ${taskId}`)]);

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  try {
    await ensureTable();
    const url = new URL(req.url), step = url.searchParams.get('step');

    // ---- a piece of the video (raw bytes) ----
    if (req.method === 'PUT' && step === 'part') {
      const taskId = url.searchParams.get('taskId'), n = Number(url.searchParams.get('n'));
      const who = await whoFor(req.headers.get('x-code'));
      if (!who) { await sleep(500); return reply({ ok: false, code: 'WRONG_CODE', message: 'Wrong code.' }, 403); }
      const [up] = validTaskId(taskId) ? await run(db.sql`SELECT parts FROM task_uploads WHERE task_id = ${taskId} AND who = ${who}`) : [];
      if (!up || !Number.isInteger(n) || n < 0 || n >= up.parts) return reply({ ok: false, code: 'MISSING_PARTS', message: 'Start the upload again.' }, 400);
      const bytes = Buffer.from(await req.arrayBuffer());
      if (!bytes.length || bytes.length > PART_MAX) return reply({ ok: false, code: 'BAD_PART', message: 'That piece is empty or too big.' }, 400);
      await run(db.sql`
        INSERT INTO task_parts (task_id, part, data) VALUES (${taskId}, ${n}, ${bytes.toString('base64')})
        ON CONFLICT (task_id, part) DO UPDATE SET data = EXCLUDED.data`);
      return reply({ ok: true, part: n });
    }

    if (req.method !== 'POST') return reply({ ok: false, code: 'BAD_REQUEST', message: 'Method not allowed.' }, 405);
    const body = await req.json().catch(() => ({}));
    const who = await whoFor(body.code);
    if (!who) { await sleep(500); return reply({ ok: false, code: 'WRONG_CODE', message: 'Wrong code.' }, 403); }
    if (!validTaskId(body.taskId)) return reply({ ok: false, code: 'BAD_REQUEST', message: 'The taskId is missing or has characters that are not allowed.' }, 400);
    const taskId = body.taskId;

    // ---- start: a new upload for this taskId (anything uploaded before for it is dropped) ----
    if (step === 'start') {
      const size = Number(body.size), parts = Number(body.parts);
      if (!Number.isInteger(size) || size <= 0) return reply({ ok: false, code: 'BAD_REQUEST', message: 'The video is empty.' }, 400);
      if (size > VIDEO_MAX) return reply({ ok: false, code: 'VIDEO_TOO_BIG', message: `The video is ${(size / 1048576).toFixed(1)} MB; the most is 13 MB.` }, 413);
      if (parts !== Math.ceil(size / PART_MAX)) return reply({ ok: false, code: 'BAD_REQUEST', message: `The video must come in ${Math.ceil(size / PART_MAX)} pieces.` }, 400);
      await run(db.sql`DELETE FROM task_parts WHERE task_id IN (SELECT task_id FROM task_uploads WHERE created_at < now() - ${KEEP_HOURS} * interval '1 hour')`);
      await run(db.sql`DELETE FROM task_uploads WHERE created_at < now() - ${KEEP_HOURS} * interval '1 hour'`);
      await forget(taskId);
      await run(db.sql`INSERT INTO task_uploads (task_id, who, size, parts) VALUES (${taskId}, ${who}, ${size}, ${parts})`);
      console.log('[TASK] Upload started:', taskId, size, 'bytes in', parts, 'pieces');
      return reply({ ok: true, partMax: PART_MAX });
    }

    const key = await inboxKey();
    if (!key) return reply({ ok: false, code: 'NOT_READY', message: 'The inbox key is not set on the website yet (Code adder page -> Settings, or INBOX_KEY in Netlify).' }, 503);

    // ---- send: put the pieces back together and send video + transcript to the comic server ----
    if (step === 'send') {
      const transcript = typeof body.transcript === 'string' ? body.transcript : '';
      if (!transcript.trim() || transcript.length > TRANSCRIPT_MAX) return reply({ ok: false, code: 'BAD_REQUEST', message: `The transcript must be 1 to ${TRANSCRIPT_MAX} characters.` }, 400);
      const [up] = await run(db.sql`SELECT size, parts FROM task_uploads WHERE task_id = ${taskId} AND who = ${who}`);
      const rows = up ? await run(db.sql`SELECT part, data FROM task_parts WHERE task_id = ${taskId} ORDER BY part`) : [];
      if (!up || rows.length !== up.parts) return reply({ ok: false, code: 'MISSING_PARTS', message: 'The video did not all arrive: upload it again.' }, 400);
      const video = Buffer.concat(rows.map((r) => Buffer.from(r.data, 'base64')));
      if (video.length !== up.size) return reply({ ok: false, code: 'MISSING_PARTS', message: 'The video arrived with the wrong size: upload it again.' }, 400);

      const form = new FormData(); // the library sets the multipart Content-Type with its boundary
      form.append('taskId', taskId);
      form.append('transcript', transcript);
      form.append('video', new Blob([video], { type: 'video/mp4' }), `${taskId}.mp4`);
      let res, data;
      try {
        res = await fetch(TASKS_URL, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form, signal: AbortSignal.timeout(110000) });
        data = await res.json().catch(() => ({}));
      } catch (err) {
        console.warn('[TASK] No answer from the comic server:', err.message);
        return reply({ ok: false, temporary: true, code: 'NO_ANSWER', message: 'The comic server did not answer in time. It will be tried again.' }, 502);
      }
      console.log('[TASK] Comic server answered', res.status, data.code, 'for', taskId, 'by', who);
      const known = ['ACCEPTED', 'DUPLICATE', 'WRONG_KEY', 'BAD_REQUEST', 'VIDEO_UNREADABLE', 'VIDEO_TOO_BIG', 'STORAGE_FULL', 'SLOTS_FULL', 'NOT_READY'];
      if (!known.includes(data.code)) {
        return reply({ ok: false, temporary: true, code: data.code || `HTTP_${res.status}`, message: data.message || `The comic server had trouble (${res.status}). It will be tried again.` }, 502);
      }
      // The comic server has it, or it can never take this upload as it is: the pieces are not needed any more
      if (['ACCEPTED', 'DUPLICATE', 'BAD_REQUEST', 'VIDEO_UNREADABLE', 'VIDEO_TOO_BIG'].includes(data.code)) await forget(taskId);
      return reply({ ...data, httpStatus: res.status }, res.status);
    }

    // ---- status: what the comic server says about this task now (optional) ----
    if (step === 'status') {
      try {
        const res = await fetch(`${TASKS_URL}/${encodeURIComponent(taskId)}`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20000) });
        return reply(await res.json().catch(() => ({ ok: false, code: `HTTP_${res.status}` })), res.status);
      } catch (err) {
        return reply({ ok: false, temporary: true, code: 'NO_ANSWER', message: 'The comic server did not answer.' }, 502);
      }
    }

    return reply({ ok: false, code: 'BAD_REQUEST', message: 'Unknown step.' }, 400);
  } catch (err) {
    console.error('[TASK] error:', err);
    return reply({ ok: false, temporary: true, code: 'SERVER_ERROR', message: 'The website had a problem. It will be tried again.' }, 500);
  }
};
