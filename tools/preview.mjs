#!/usr/bin/env node
/**
 * tools/preview.mjs
 * -----------------------------------------------------------------------
 * Local preview: the whole website (pages + the real functions in netlify/functions) on your computer or Codespace,
 * with a TEST database full of sample data. Nothing touches the live site or its data, so try anything.
 *
 *   npm install          (once)
 *   npm run preview      -> http://localhost:8888 (in a Codespace: the Ports tab opens it in the browser)
 *
 * The test settings below stand in for the Netlify environment variables. Override any of them when starting, e.g.
 *   PACE_PER_DAY=5-9 npm run preview
 * The test database starts fresh (with the samples) every time; Ctrl+C stops the preview.
 * -----------------------------------------------------------------------
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { register, createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8888;

// CHANGE HERE: the test settings (codes, passwords). Only for the preview: the real ones are in Netlify.
const TEST_ENV = {
  DONE_CODES: 'TEST, ANNA',
  SCISSORS_CODE: 'scissors',
  VV_USERNAME: 'test',
  VV_PASSWORD: 'test',
  IMPORT_KEY: 'test-import',
  DEADLINES: 'TEST=' + new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10), // a week from today
};
for (const [k, v] of Object.entries(TEST_ENV)) process.env[k] ??= v;

register('./preview/hooks.mjs', import.meta.url); // "@netlify/database" -> the test database
const { pg } = await import('./preview/database.mjs');
const { PICTURES, LINKS } = await import('./preview/samples.mjs');

// ---- The functions, both kinds: new style (default export: Request -> Response) and old style (exports.handler) ----
const FUNCTIONS = {};
const require = createRequire(import.meta.url);
for (const file of fs.readdirSync(path.join(ROOT, 'netlify/functions'))) {
  const name = file.replace(/\.(m?js)$/, ''), full = path.join(ROOT, 'netlify/functions', file);
  if (file.endsWith('.mjs')) FUNCTIONS[name] = { modern: (await import(pathToFileURL(full).href)).default };
  else if (file.endsWith('.js')) FUNCTIONS[name] = { handler: require(full).handler };
}

// ---- Sample data: links with pictures (the oldest first), and a few Done rows for TEST so Videos done shows something ----
await FUNCTIONS['links-api'].modern(new Request('http://localhost/')); // makes the tables
for (const [i, [link, name]] of LINKS.entries()) {
  await pg.query('INSERT INTO video_links (link, name, image, created_at) VALUES ($1, $2, $3, now() - $4 * interval \'1 hour\')',
    [link, name, PICTURES[i % PICTURES.length], LINKS.length - i]);
}
for (const [i, minutes] of [30, 18, 6].entries()) {
  await pg.query('INSERT INTO video_done (who, link, name, stored, done_at) VALUES ($1, $2, $3, $4, now() - interval \'1 day\' - $5 * interval \'1 minute\')',
    ['TEST', `https://www.instagram.com/reel/DONE${i + 1}/`, `Done Example ${i + 1}`, 'https://fileflap.net/example', minutes]);
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };
const readBody = (req) => new Promise((ok) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => ok(Buffer.concat(c))); });

async function runFunction(fn, req, url) {
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req);
  if (fn.modern) {
    const r = await fn.modern(new Request(url, { method: req.method, headers: req.headers, body }));
    return { status: r.status, headers: Object.fromEntries(r.headers), body: Buffer.from(await r.arrayBuffer()) };
  }
  const r = await fn.handler({ httpMethod: req.method, path: url.pathname, headers: req.headers, body: body?.toString() ?? null,
    queryStringParameters: Object.fromEntries(url.searchParams), isBase64Encoded: false });
  const headers = { ...(r.headers || {}) };
  for (const [k, v] of Object.entries(r.multiValueHeaders || {})) headers[k] = v; // e.g. several Set-Cookie
  return { status: r.statusCode || 200, headers, body: Buffer.from(r.body || '', r.isBase64Encoded ? 'base64' : 'utf8') };
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    const m = url.pathname.match(/^\/\.netlify\/functions\/([\w-]+)/);
    if (m) {
      const fn = FUNCTIONS[m[1]];
      if (!fn) { res.writeHead(404); return res.end('No such function'); }
      const r = await runFunction(fn, req, url);
      res.writeHead(r.status, r.headers);
      return res.end(r.body);
    }
    let file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT) || /(^|[\\/])(\.|node_modules|tools)/.test(path.relative(ROOT, file))) { res.writeHead(404); return res.end('Not found'); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    console.error('[preview] error:', err);
    res.writeHead(500); res.end('Preview error: ' + err.message);
  }
}).listen(PORT, () => {
  const cs = process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}` : null;
  console.log(`\nLocal preview with a TEST database (${LINKS.length} sample links). Nothing here touches the live site.`);
  console.log(`  Open:  ${cs || `http://localhost:${PORT}`}`);
  console.log(`  Codes: Done / Videos done = ${process.env.DONE_CODES} · scissors = ${process.env.SCISSORS_CODE} · dashboard login = ${process.env.VV_USERNAME} / ${process.env.VV_PASSWORD}`);
  console.log(`  Functions: ${Object.keys(FUNCTIONS).join(', ')}`);
  console.log('  Ctrl+C stops it.\n');
});
