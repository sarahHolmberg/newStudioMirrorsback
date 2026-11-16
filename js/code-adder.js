/**
 * js/code-adder.js
 * -----------------------------------------------------------------------
 * The Code adder page: open it with your admin key, then add, change or remove people (their code, name, deadline,
 * admin). Everything goes to /.netlify/functions/people, which keeps it in the database and checks the key there.
 * All values are inserted with textContent (no innerHTML).
 * -----------------------------------------------------------------------
 */
console.log('[CODES] Code adder loaded.');
const $ = (id) => document.getElementById(id);
let adminKey = '', setupMode = false;

function setMsg(text, isError) { $('msg').textContent = text; $('msg').className = isError ? 'err' : 'ok-msg'; }

async function call(action, extra = {}) {
  let res;
  try {
    res = await fetch('/.netlify/functions/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, key: adminKey, ...extra }) });
  } catch { throw new Error('Cannot reach the website. Try again.'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

const money = (n, cur) => n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' ' + cur;
const cell = (row, text, cls) => { const td = document.createElement('td'); td.textContent = text; if (cls) td.className = cls; row.appendChild(td); return td; };

async function load() {
  const d = await call('list');
  const each = (amount, n) => (n === 1 ? `${money(amount, d.currency)} a video` : `${money(amount, d.currency)} for ${n} videos`);
  $('payRule').textContent = `Pay for adding: ${each(d.addPayAmount, d.addPayFor)} · Pay for done: ${each(d.payAmount, d.payFor)}`;
  const body = $('people');
  body.textContent = '';
  if (!d.people.length) { const tr = body.insertRow(); cell(tr, 'No one yet: add the first person above.').colSpan = 10; }
  const today = new Date().toISOString().slice(0, 10);
  d.people.forEach((p) => {
    const tr = body.insertRow();
    cell(tr, p.code, 'code');
    cell(tr, p.name || '—');
    deadlineCell(cell(tr, '', 'dl'), p, today);
    cell(tr, String(p.added));
    cell(tr, money(p.addPay, d.currency));
    cell(tr, String(p.done));
    cell(tr, money(p.pay, d.currency));
    cell(tr, p.hasPassword ? '✔ password' : 'no password', p.hasPassword ? '' : 'past');
    cell(tr, p.isAdmin ? '✔' : '');
    const actions = cell(tr, '');
    const edit = document.createElement('button'); edit.textContent = 'Edit';
    edit.onclick = () => fill(p);
    const del = document.createElement('button'); del.textContent = 'Remove';
    del.onclick = () => remove(p);
    actions.append(edit, del);
  });
  const s = d.settings?.INBOX_KEY;
  $('inboxState').textContent = s === 'netlify' ? 'Inbox key: set in Netlify (INBOX_KEY), that one is used.' : s === 'page' ? 'Inbox key: saved ✔' : 'Inbox key: not set yet: Send cannot reach the inbox.';
  console.log('[CODES] People:', d.people.length);
}

// The deadline right in the table: change the date = saved at once (✕ = no deadline). The rest of the person stays.
function deadlineCell(td, p, today) {
  const input = document.createElement('input');
  input.type = 'date'; input.value = p.deadline || ''; input.title = `${p.code}'s deadline: change it and it is saved`;
  input.classList.toggle('past', !!p.deadline && p.deadline < today);
  const clear = document.createElement('button');
  clear.type = 'button'; clear.textContent = '✕'; clear.title = 'No deadline'; clear.hidden = !p.deadline;
  const save = async (value) => {
    input.disabled = clear.disabled = true;
    try {
      await call('save', { code: p.code, name: p.name, deadline: value, isAdmin: p.isAdmin }); // no password = theirs stays
      setMsg(value ? `${p.code}: deadline ${value} saved.` : `${p.code}: no deadline any more.`);
      await load();
    } catch (err) { setMsg(err.message, true); input.value = p.deadline || ''; input.disabled = clear.disabled = false; }
  };
  input.onchange = () => save(input.value);
  clear.onclick = () => save('');
  td.append(input, clear);
}

function fill(p) {
  $('code').value = p ? p.code : ''; $('name').value = p ? p.name : ''; $('deadline').value = p?.deadline || ''; $('password').value = '';
  $('password').placeholder = p?.hasPassword ? '(unchanged)' : 'set a password so they can log in';
  $('isAdmin').checked = setupMode || !!p?.isAdmin;
  $('formTitle').textContent = p ? `Change ${p.code}` : 'Add a person';
  (p ? $('name') : $('code')).focus();
}

async function remove(p) {
  if (!confirm(`Remove ${p.code}${p.name ? ' (' + p.name + ')' : ''}? Their code stops working. Their ${p.done} videos done stay.`)) return;
  try { await call('remove', { code: p.code }); setMsg(`${p.code} removed.`); await load(); }
  catch (err) { setMsg(err.message, true); }
}

// 1. Open with the admin key (or, on first use, without one)
$('keyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  adminKey = $('keyInput').value.trim();
  try { await load(); $('main').classList.remove('hidden'); setMsg(''); fill(null); }
  catch (err) { setMsg(err.message, true); $('main').classList.add('hidden'); }
});

// 2. Save a person (new, or the one being changed: the code decides)
$('personForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('saveBtn').disabled = true;
  try {
    const r = await call('save', { code: $('code').value, name: $('name').value, deadline: $('deadline').value, isAdmin: $('isAdmin').checked, password: $('password').value });
    if (r.setup) { // the first admin: from now on their code is the key
      adminKey = r.saved; $('keyInput').value = r.saved; setupMode = false;
      $('setupNote').classList.add('hidden'); $('isAdmin').disabled = false;
      setMsg(`${r.saved} added as the admin. From now on, open this page with the key ${r.saved}.`);
    } else setMsg(`${r.saved} ${r.isNew ? 'added' : 'changed'}. The code works straight away.`);
    fill(null);
    await load();
  } catch (err) { setMsg(err.message, true); }
  finally { $('saveBtn').disabled = false; }
});
$('clearBtn').onclick = () => fill(null);

// 4. The inbox key: saved in the database, never shown again
async function saveInboxKey(value) {
  try { const r = await call('setting', { name: 'INBOX_KEY', value }); $('inboxKey').value = ''; setMsg(r.set ? 'Inbox key saved.' : 'Inbox key removed.'); await load(); }
  catch (err) { setMsg(err.message, true); }
}
$('inboxForm').addEventListener('submit', (e) => { e.preventDefault(); if ($('inboxKey').value.trim()) saveInboxKey($('inboxKey').value); });
$('inboxClear').onclick = () => { if (confirm('Remove the inbox key? Send will stop reaching the inbox.')) saveInboxKey(''); };

// First use: no admin yet -> the page opens without a key, and the first person becomes the admin
(async () => {
  try {
    const { setup } = await call('status');
    if (!setup) return $('keyInput').focus();
    setupMode = true;
    $('setupNote').classList.remove('hidden');
    $('isAdmin').checked = true; $('isAdmin').disabled = true;
    await load(); $('main').classList.remove('hidden'); fill(null);
  } catch (err) { setMsg(err.message, true); }
})();
