
/**
 * tutorials.js
 * -----------------------------------------------------------------------
 * Tutorial videos (YouTube). Each one shows only a thumbnail at first; the
 * real YouTube player is created when clicked, so the page loads fast.
 * Set the links with data-url on the .yt elements in index.html.
 * -----------------------------------------------------------------------
 */
console.log('[TUTORIALS INIT] Tutorials script loaded.');

/** Pulls the video id out of any common YouTube link (watch, youtu.be, shorts, embed). */
function youtubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

document.querySelectorAll('.yt').forEach((box, i) => {
  const id = youtubeId(box.dataset.url || '');
  if (!id) {
    console.warn('[TUTORIALS] Video', i + 1, 'has no valid YouTube link in data-url.');
    box.textContent = 'Tutorial video coming soon.';
    return;
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'yt-play';
  btn.setAttribute('aria-label', 'Play tutorial ' + (i + 1));
  btn.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
  btn.textContent = '▶';
  btn.addEventListener('click', () => {
    console.log('[TUTORIALS] Playing video', i + 1, '| id:', id);
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.title = 'Tutorial video ' + (i + 1);
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    box.replaceChildren(frame);
  });
  box.replaceChildren(btn);
  console.log('[TUTORIALS] Video', i + 1, 'ready (thumbnail only). id:', id);
});