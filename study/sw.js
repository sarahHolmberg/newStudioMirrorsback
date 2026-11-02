/**
 * study/sw.js
 * Service worker for the /study pages: keeps the study lines usable offline.
 *  - On install: saves the pages, CSS, JS and data for every study line (small).
 *  - Audio: the page asks for its own line's mp3s (message 'cache-audio'); they are
 *    downloaded one at a time in the background, so the phone does not lag.
 *  - Pages, CSS and JS: network first (updates arrive when online), saved copy when offline.
 *  - Audio: saved copy first. Phones ask for audio in pieces (Range requests), so a
 *    saved file is answered piece by piece (206) too, or it would not play offline.
 *
 * CHANGE HERE: bump CACHE when an mp3 is replaced at the same path, so phones fetch the new one.
 */
const CACHE = 'study-v1';

const SHELL = [
  '/study/', '/study/battle/', '/study/bootstrap/',
  '/css/style.css', '/css/study.css',
  '/js/study.js', '/js/study-srs.js', '/js/study-codes.js',
  '/js/study-data.js', '/js/study-battle-data.js', '/js/study-bootstrap-data.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('study-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The page sends { type: 'cache-audio', urls: [...] } for the line it shows
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'cache-audio') event.waitUntil(cacheAudio(event.data.urls));
});

let queue = Promise.resolve(); // one download at a time, even if several tabs ask
function cacheAudio(urls) {
  queue = queue.then(async () => {
    const cache = await caches.open(CACHE);
    for (const url of urls) {
      if (await cache.match(url)) continue;
      try {
        const res = await fetch(url);
        if (res.ok && res.status === 200) await cache.put(url, res);
      } catch { return; } // offline: try again next visit
      const clients = await self.clients.matchAll();
      clients.forEach((c) => c.postMessage({ type: 'audio-cached', url }));
    }
  });
  return queue;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(audioResponse(req));
  } else if (req.mode === 'navigate' || SHELL.includes(url.pathname)) {
    event.respondWith(networkFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const url = new URL(req.url);
    const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`; // /study/battle → /study/battle/
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match(path)) || Response.error();
  }
}

async function audioResponse(req) {
  const saved = await caches.match(req.url);
  if (!saved) return fetch(req); // not downloaded yet: straight from the network
  const range = req.headers.get('range');
  return range ? rangeOf(saved, range) : saved;
}

// Answer "bytes=start-end" from a saved full file
async function rangeOf(saved, range) {
  const buf = await saved.arrayBuffer();
  const size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = m[1] ? Number(m[1]) : 0;
  let end = m[2] ? Number(m[2]) : size - 1;
  if (!m[1] && m[2]) { start = size - Number(m[2]); end = size - 1; } // "bytes=-500": the last 500 bytes
  end = Math.min(end, size - 1);
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': saved.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}
