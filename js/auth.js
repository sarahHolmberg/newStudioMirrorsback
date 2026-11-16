/**
 * js/auth.js
 * -----------------------------------------------------------------------
 * The Video Vault login (the server side is netlify/functions/session.mjs). The session is an HttpOnly cookie the page
 * cannot read: it only asks the server who is logged in. Logged out: the login form, no adding. Logged in: your name,
 * how many videos you have added and the pay, a Log out button, and the add form.
 * -----------------------------------------------------------------------
 */
const Auth2 = (() => {
  const ENDPOINT = '/.netlify/functions/session';
  const el = (id) => document.getElementById(id);
  const money = (n, cur) => n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ') + ' ' + cur;

  function show(me) {
    el('loginForm').classList.toggle('hidden', !!me);
    el('me').classList.toggle('hidden', !me);
    el('addArea').classList.toggle('hidden', !me);
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
      console.log('[AUTH2] Logged in.');
      await refresh();
    } catch (err) {
      el('loginMsg').textContent = err instanceof TypeError ? 'Cannot reach the server. Try again.' : err.message;
      el('loginPass').select();
    } finally {
      el('loginBtn').disabled = false;
    }
  });

  el('logoutBtn').addEventListener('click', async () => {
    await fetch(ENDPOINT, { method: 'DELETE' }).catch(() => {});
    console.log('[AUTH2] Logged out.');
    show(null);
  });

  refresh();
  return { refresh };
})();
