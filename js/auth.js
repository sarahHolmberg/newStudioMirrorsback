/**
 * js/auth.js
 * -----------------------------------------------------------------------
 * The Video Vault login (the server side is netlify/functions/session.mjs). Anyone can fill in a video; the login is asked
 * for only when they press Send (Auth2.ask), and right after it the video is sent. The session is an HttpOnly cookie the
 * page cannot read: it only asks the server who is logged in. Logged in: your name, how many videos you have added and
 * the pay, and Log out.
 * -----------------------------------------------------------------------
 */
const Auth2 = (() => {
  const ENDPOINT = '/.netlify/functions/session';
  const el = (id) => document.getElementById(id);
  const money = (n, cur) => n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ') + ' ' + cur;
  let me = null, afterLogin = null;

  function show(who) {
    me = who;
    el('me').classList.toggle('hidden', !me);
    if (!me) return;
    el('meName').textContent = me.name ? `${me.name} (${me.code})` : me.code;
    el('meStats').textContent = `${me.added} video${me.added === 1 ? '' : 's'} added · ${money(me.pay, me.currency)}`;
  }

  /** Asks the server who is logged in (and their count), and shows it */
  async function refresh() {
    try {
      const res = await fetch(ENDPOINT, { cache: 'no-store' });
      show(res.ok ? await res.json() : null);
    } catch (err) {
      console.error('[AUTH2] Could not check the login:', err);
      show(null);
    }
  }

  /** Opens the login window; once logged in, runs then() (e.g. sends the video) */
  function ask(then) {
    afterLogin = then;
    el('loginMsg').textContent = '';
    el('loginDialog').showModal();
    (el('loginCode').value ? el('loginPass') : el('loginCode')).focus();
  }

  el('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    el('loginMsg').textContent = '';
    el('loginBtn').disabled = true;
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: el('loginCode').value, password: el('loginPass').value }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      el('loginPass').value = '';
      el('loginDialog').close();
      console.log('[AUTH2] Logged in.');
      await refresh();
      const then = afterLogin; afterLogin = null;
      if (then) then();
    } catch (err) {
      el('loginMsg').textContent = err instanceof TypeError ? 'Cannot reach the server. Try again.' : err.message;
      el('loginPass').select();
    } finally {
      el('loginBtn').disabled = false;
    }
  });
  el('loginCancel').addEventListener('click', () => { afterLogin = null; el('loginDialog').close(); });

  el('logoutBtn').addEventListener('click', async () => {
    await fetch(ENDPOINT, { method: 'DELETE' }).catch(() => {});
    console.log('[AUTH2] Logged out.');
    show(null);
  });

  refresh();
  return { refresh, ask, loggedIn: () => !!me };
})();
