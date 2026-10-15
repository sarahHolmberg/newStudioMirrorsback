/**
 * db.js
 * -----------------------------------------------------------------------
 * Data access layer for Video Vault. Talks to the Netlify function
 * /.netlify/functions/links, which stores the links in the Netlify DATABASE.
 * app.js only calls DB.getVideos / DB.addVideo and never touches fetch.
 * -----------------------------------------------------------------------
 */

const DB = (() => {
  const ENDPOINT = '/.netlify/functions/links';

  console.log('[DB INIT] Data layer loaded (mode: Netlify DATABASE via function).');

  /** Calls the function and returns the parsed JSON, or throws a readable error. */
  async function call(url, options) {
    let res;
    try {
      res = await fetch(url, options);
    } catch (err) {
      console.error('[DB CALL] Network error:', err);
      throw new Error('Cannot reach the server. Try again.');
    }
    const data = await res.json().catch(() => ({}));
    console.log('[DB CALL] Status:', res.status);
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }

  /**
   * Fetch one page of links, newest first.
   * @param {number} [before] id of the last link already shown (omit for the first page)
   * @returns {Promise<{links: {id:number, link:string}[], hasMore: boolean}>}
   */
  async function getVideos(before) {
    console.log('[DB READ] Request page. before:', before ?? 'start');
    const url = before ? `${ENDPOINT}?before=${before}` : ENDPOINT;
    const data = await call(url);
    console.log('[DB READ] Got', data.links.length, 'links. hasMore:', data.hasMore);
    return data;
  }

  /**
   * Save a new link.
   * @param {string} link
   * @returns {Promise<{added: boolean}>} added=false means it was already saved
   */
  async function addVideo(link) {
    console.log('[DB WRITE] Request to save video:', link);
    const data = await call(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link }),
    });
    console.log('[DB WRITE] Done. Added:', data.added);
    return data;
  }

  return { getVideos, addVideo };
})();