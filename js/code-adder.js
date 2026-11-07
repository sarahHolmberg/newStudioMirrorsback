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
  $('payRule').textContent = `Pay: ${money(d.payAmount, d.currency)} for ${d.payFor} videos (about ${money(Math.round(d.payAmount / d.payFor), d.currency)} each)`;
  const body = $('people');
  body.textContent = '';
  if (!d.people.length) { const tr = body.insertRow(); cell(tr, 'No one yet: add the first person above.').colSpan = 7; }
  const today = new Date().toISOString().slice(0, 10);
  d.people.forEach((p) => {
    const tr = body.insertRow();
    cell(tr, p.code, 'code');
    cell(tr, p.name || '—');
    cell(tr, p.deadline || '—', p.deadline && p.deadline < today ? 'past' : '');
    cell(tr, String(p.done));
    cell(tr, money(p.pay, d.currency));
    cell(tr, p.isAdmin ? '✔' : '');
    const actions = cell(tr, '');
    const edit = document.createElement('button'); edit.textContent = 'Edit';
    edit.onclick = () => fill(p);
    const del = document.createElement('button'); del.textContent = 'Remove';
    del.onclick = () => remove(p);
    actions.append(edit, del);
  });
  console.log('[CODES] People:', d.people.length);
}

function fill(p) {
  $('code').value = p ? p.code : ''; $('name').value = p ? p.name : ''; $('deadline').value = p?.deadline || '';
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
    const r = await call('save', { code: $('code').value, name: $('name').value, deadline: $('deadline').value, isAdmin: $('isAdmin').checked });
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
