#!/usr/bin/env node
/**
 * tools/migrate.mjs
 * -----------------------------------------------------------------------
 * Moves the database from one Studio Mirrors website to another, from the command line (a Codespace, or any computer with
 * Node 18+; nothing to install).
 *
 *   1. Export (reads only, changes nothing):
 *        node tools/migrate.mjs export --from https://studiomirrors.netlify.app --codes SARAH,BRYAN
 *      -> backup/links.json + links.csv   every waiting link (name, Instagram link, date, picture file)
 *         backup/pictures/<id>.jpg        the pictures
 *         backup/done.json + done.csv     the "videos done" rows of those codes (the website only shows them per code)
 *
 *   2. Import (needs IMPORT_KEY set in the target's Netlify settings, then a redeploy):
 *        IMPORT_KEY=... node tools/migrate.mjs import --to https://studio-mirrors.netlify.app
 *      Adds the links (oldest first, with their pictures and dates) and the done rows. Anything already there is skipped,
 *      so it can be run again safely. Without IMPORT_KEY in the environment it asks for it.
 *
 * Options: --out / --in <folder> (default: backup). backup/ is in .gitignore: it is your data, never commit it.
 * -----------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (name, def) => { const i = args.indexOf('--' + name); return i > 0 && i + 1 < args.length ? args[i + 1] : def; }; // --codes "" = none
const ask = async (q) => { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); const a = await rl.question(q); rl.close(); return a.trim(); };
const site = (u) => (u || '').replace(/\/+$/, '');
const fn = (base, name) => `${site(base)}/.netlify/functions/${name}`;
const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const writeCsv = (file, rows) => fs.writeFileSync(file, '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n'); // BOM: Excel reads æ ø å right

async function getJson(url, opts) {
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(`${res.status} ${data.error || res.statusText} (${url})`), { status: res.status });
  return data;
}

async function exportFrom(from, out, codes) {
  console.log(`Export from ${from} into ${out}/`);
  fs.mkdirSync(path.join(out, 'pictures'), { recursive: true });

  // Every link, page by page (the Video Vault list has no limit); the dates come from the Grid Player list
  const links = [];
  for (let before = ''; ;) {
    const r = await getJson(fn(from, 'links') + (before ? `?before=${before}` : ''));
    links.push(...r.links);
    if (!r.hasMore || !r.links.length) break;
    before = r.links[r.links.length - 1].id;
  }
  const dates = {};
  for (const l of (await getJson(fn(from, 'links-api'))).links || []) dates[l.id] = l.createdAt;
  links.sort((a, b) => a.id - b.id); // oldest first
  let pics = 0;
  for (const l of links) {
    l.createdAt = dates[l.id] || null;
    l.picture = null;
    if (l.has_image) {
      const res = await fetch(fn(from, 'links') + `?image=${l.id}`);
      if (res.ok) { l.picture = `pictures/${l.id}.jpg`; fs.writeFileSync(path.join(out, l.picture), Buffer.from(await res.arrayBuffer())); pics++; }
    }
    process.stdout.write(`\r  links: ${links.indexOf(l) + 1}/${links.length}, pictures: ${pics}`);
  }
  console.log();
  const keep = links.map(({ id, name, link, createdAt, picture }) => ({ id, name, link, createdAt, picture }));
  fs.writeFileSync(path.join(out, 'links.json'), JSON.stringify(keep, null, 2));
  writeCsv(path.join(out, 'links.csv'), [['id', 'name', 'Instagram link', 'added', 'picture'], ...keep.map((l) => [l.id, l.name, l.link, l.createdAt, l.picture])]);

  // Videos done: only per code
  const done = [];
  for (const code of codes) {
    try {
      const d = await getJson(fn(from, 'links-api'), { method: 'POST', body: JSON.stringify({ code }) });
      d.videos.forEach((v) => done.push({ who: d.who, name: v.name, link: v.link, stored: v.stored, doneAt: v.doneAt }));
      console.log(`  ${d.who}: ${d.count} videos done` + (d.count > d.videos.length ? ` (the website lists only the newest ${d.videos.length})` : ''));
    } catch (err) { console.log(`  ${code}: ${err.status === 403 ? 'wrong code, skipped' : err.message}`); }
  }
  done.sort((a, b) => Date.parse(a.doneAt) - Date.parse(b.doneAt));
  fs.writeFileSync(path.join(out, 'done.json'), JSON.stringify(done, null, 2));
  writeCsv(path.join(out, 'done.csv'), [['who', 'name', 'Instagram link', 'stored video', 'done at'], ...done.map((d) => [d.who, d.name, d.link, d.stored, d.doneAt])]);
  console.log(`Done: ${links.length} links, ${pics} pictures, ${done.length} videos-done rows in ${out}/`);
}

async function importTo(to, from, key) {
  const links = JSON.parse(fs.readFileSync(path.join(from, 'links.json'), 'utf8'));
  const done = fs.existsSync(path.join(from, 'done.json')) ? JSON.parse(fs.readFileSync(path.join(from, 'done.json'), 'utf8')) : [];
  console.log(`Import ${links.length} links and ${done.length} videos-done rows from ${from}/ into ${to}`);
  const send = (body) => getJson(fn(to, 'links-api'), { method: 'POST', headers: { 'X-Import': '1' }, body: JSON.stringify({ key, ...body }) });
  let addedLinks = 0, addedDone = 0;
  for (const [i, l] of links.entries()) { // one link per request: a picture can be over a megabyte
    const image = l.picture && fs.existsSync(path.join(from, l.picture)) ? fs.readFileSync(path.join(from, l.picture)).toString('base64') : null;
    addedLinks += (await send({ links: [{ link: l.link, name: l.name, createdAt: l.createdAt, image }] })).links;
    process.stdout.write(`\r  links: ${i + 1}/${links.length} (new: ${addedLinks})`);
  }
  console.log();
  for (let i = 0; i < done.length; i += 200) addedDone += (await send({ done: done.slice(i, i + 200) })).done;
  console.log(`  videos-done rows: ${done.length} (new: ${addedDone})`);
  console.log(`Done. Already there and skipped: ${links.length - addedLinks} links, ${done.length - addedDone} done rows.`);
}

try {
  if (cmd === 'export') {
    const from = site(opt('from')) || site(await ask('Export from which website? (e.g. https://studiomirrors.netlify.app) '));
    const codes = (opt('codes') ?? await ask('Codes for "videos done", separated by commas (empty = skip): ')).split(',').map((c) => c.trim()).filter(Boolean);
    await exportFrom(from, opt('out', 'backup'), codes);
  } else if (cmd === 'import') {
    const to = site(opt('to')) || site(await ask('Import into which website? (e.g. https://studio-mirrors.netlify.app) '));
    const key = process.env.IMPORT_KEY || await ask('The IMPORT_KEY you set in that website\'s Netlify settings: ');
    await importTo(to, opt('in', 'backup'), key);
  } else {
    console.log('Usage:\n  node tools/migrate.mjs export --from <site> --codes A,B\n  IMPORT_KEY=... node tools/migrate.mjs import --to <site>');
  }
} catch (err) {
  console.error('\nFailed:', err.message);
  process.exit(1);
}
