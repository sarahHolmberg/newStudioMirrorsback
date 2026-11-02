/**
 * js/audio-join.js  -  /join-audio page
 * -----------------------------------------------------------------------
 * Joins up to 30 audio files into one, then cuts the result into parts
 * of N minutes (25 by default).
 *
 * Why it's light on the browser:
 *   Nothing is decoded or re-encoded. MP3 is a stream of small independent
 *   "frames" and WAV is a header plus raw samples, so we only read the
 *   bytes needed to find frame boundaries (4 MB at a time), remember
 *   "file X, bytes A..B" ranges, and build each part as a Blob made of
 *   File.slice() pieces. Those Blobs point at the original files on disk;
 *   the audio data is never copied into memory. CPU use is tiny and the
 *   quality is identical to the input (no re-encode).
 *
 * Supported: MP3 (any bitrate, CBR or VBR) and WAV (PCM). All files must
 * be the same type. Other formats (m4a, ogg, flac) would need decoding,
 * which is exactly the heavy work this page avoids.
 */
(function () {
  'use strict';

  const MAX_FILES = 30;
  const READ_SIZE = 4 * 1024 * 1024; // bytes read per step while scanning

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const dropZone = $('dropZone');
  const fileInput = $('fileInput');
  const fileList = $('fileList');
  const countEl = $('fileCount');
  const minutesInput = $('minutes');
  const goBtn = $('goBtn');
  const clearBtn = $('clearBtn');
  const msgEl = $('msg');
  const progress = $('progress');
  const progressBar = $('progressBar');
  const results = $('results');

  let files = [];       // File objects, in join order
  let urls = [];        // object URLs from the last run (revoked on next run)
  let busy = false;

  // ---------- helpers ----------
  const naturalCompare = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;

  function kindOf(file) {
    const n = file.name.toLowerCase();
    if (n.endsWith('.mp3') || file.type === 'audio/mpeg' || file.type === 'audio/mp3') return 'mp3';
    if (n.endsWith('.wav') || /audio\/(x-)?wav|audio\/wave/.test(file.type)) return 'wav';
    return null;
  }

  function fmtTime(sec) {
    sec = Math.round(sec);
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const mm = String(m).padStart(h ? 2 : 1, '0'), ss = String(s).padStart(2, '0');
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function fmtSize(b) {
    return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  }

  function say(text, cls) {
    msgEl.textContent = text;
    msgEl.className = cls || '';
  }

  function setProgress(frac) {
    progress.classList.remove('hidden');
    progressBar.style.width = Math.min(100, Math.round(frac * 100)) + '%';
  }

  async function readBytes(file, start, end) {
    return new Uint8Array(await file.slice(start, end).arrayBuffer());
  }

  const ascii = (b, i, n) => String.fromCharCode.apply(null, b.subarray(i, i + n));

  // ---------- file list UI ----------
  function addFiles(list) {
    const incoming = Array.from(list);
    const bad = incoming.filter((f) => !kindOf(f));
    const good = incoming.filter((f) => kindOf(f));
    good.sort((a, b) => naturalCompare(a.name, b.name));
    const room = MAX_FILES - files.length;
    files = files.concat(good.slice(0, Math.max(0, room)));

    const notes = [];
    if (bad.length) notes.push(`Skipped ${bad.length} file(s) that aren't MP3 or WAV: ${bad.map((f) => f.name).join(', ')}`);
    if (good.length > room) notes.push(`Only ${MAX_FILES} files at once - ${good.length - room} left out.`);
    say(notes.join(' '), notes.length ? 'err' : '');
    render();
  }

  function render() {
    fileList.innerHTML = '';
    files.forEach((f, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="aj-n">${i + 1}.</span><span class="aj-name"></span>
        <span class="aj-size">${fmtSize(f.size)}</span>
        <button type="button" class="ico" data-a="up" data-i="${i}" title="Move up" aria-label="Move up">↑</button>
        <button type="button" class="ico" data-a="down" data-i="${i}" title="Move down" aria-label="Move down">↓</button>
        <button type="button" class="ico" data-a="del" data-i="${i}" title="Remove" aria-label="Remove">✕</button>`;
      li.querySelector('.aj-name').textContent = f.name;
      fileList.appendChild(li);
    });
    countEl.textContent = `${files.length} / ${MAX_FILES} files`;
    goBtn.disabled = busy || files.length === 0;
    clearBtn.disabled = busy || files.length === 0;
    fileList.parentElement.classList.toggle('hidden', files.length === 0);
  }

  fileList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-a]');
    if (!btn || busy) return;
    const i = Number(btn.dataset.i), a = btn.dataset.a;
    if (a === 'del') files.splice(i, 1);
    else {
      const j = a === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= files.length) return;
      [files[i], files[j]] = [files[j], files[i]];
    }
    render();
  });

  fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  ['dragenter', 'dragover'].forEach((t) => dropZone.addEventListener(t, (e) => { e.preventDefault(); dropZone.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((t) => dropZone.addEventListener(t, (e) => { e.preventDefault(); dropZone.classList.remove('over'); }));
  dropZone.addEventListener('drop', (e) => { if (!busy) addFiles(e.dataTransfer.files); });
  clearBtn.addEventListener('click', () => { files = []; say(''); clearResults(); render(); });

  // ---------- Parts builder (shared by MP3 and WAV) ----------
  // Collects byte ranges for the current part; neighbouring ranges of the
  // same file are merged so each part is a handful of slices.
  function PartBuilder() {
    this.parts = [];
    this.cur = null;
  }
  PartBuilder.prototype.add = function (file, a, b, seconds) {
    if (!this.cur) this.cur = { ranges: [], seconds: 0, bytes: 0 };
    const r = this.cur.ranges, last = r[r.length - 1];
    if (last && last.file === file && last.b === a) last.b = b;
    else r.push({ file, a, b });
    this.cur.seconds += seconds;
    this.cur.bytes += b - a;
  };
  PartBuilder.prototype.close = function () {
    if (this.cur && this.cur.bytes > 0) this.parts.push(this.cur);
    this.cur = null;
  };

  // ---------- MP3 ----------
  const BR = {
    '3-3': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448], // MPEG1 L1
    '3-2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],    // MPEG1 L2
    '3-1': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],     // MPEG1 L3
    '2-3': [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],    // MPEG2/2.5 L1
    '2-x': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],         // MPEG2/2.5 L2+L3
  };
  const SR = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

  // Returns {size, samples, sr, ver, layer, mono} or null if b[i..] isn't a valid frame header.
  function mp3Header(b, i) {
    if (b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) return null;
    const ver = (b[i + 1] >> 3) & 3, layer = (b[i + 1] >> 1) & 3;
    const brI = b[i + 2] >> 4, srI = (b[i + 2] >> 2) & 3, pad = (b[i + 2] >> 1) & 1;
    if (ver === 1 || layer === 0 || brI === 0 || brI === 15 || srI === 3) return null;
    const table = ver === 3 ? BR['3-' + layer] : (layer === 3 ? BR['2-3'] : BR['2-x']);
    const br = table[brI] * 1000, sr = SR[ver][srI];
    let size, samples;
    if (layer === 3) { size = (Math.floor(12 * br / sr) + pad) * 4; samples = 384; }
    else if (layer === 2) { size = Math.floor(144 * br / sr) + pad; samples = 1152; }
    else if (ver === 3) { size = Math.floor(144 * br / sr) + pad; samples = 1152; }
    else { size = Math.floor(72 * br / sr) + pad; samples = 576; }
    return { size, samples, sr, srI, ver, layer, mono: (b[i + 3] >> 6) === 3 };
  }

  // A Xing / Info / VBRI frame holds the old file's length + seek table, not
  // audio. Left in the middle of a joined file it would confuse players.
  function isInfoFrame(b, i, h) {
    const side = h.ver === 3 ? (h.mono ? 17 : 32) : (h.mono ? 9 : 17);
    const tag = ascii(b, i + 4 + side, 4);
    return tag === 'Xing' || tag === 'Info' || ascii(b, i + 36, 4) === 'VBRI';
  }

  // Byte range of the actual audio: skips ID3v2 at the start, ID3v1 / APE tags at the end.
  async function mp3Bounds(file) {
    let start = 0;
    for (;;) {
      const h = await readBytes(file, start, start + 10);
      if (h.length < 10 || ascii(h, 0, 3) !== 'ID3') break;
      const size = ((h[6] & 127) << 21) | ((h[7] & 127) << 14) | ((h[8] & 127) << 7) | (h[9] & 127);
      start += 10 + size + (h[5] & 0x10 ? 10 : 0);
    }
    let end = file.size;
    if (end - start >= 128) {
      const t = await readBytes(file, end - 128, end);
      if (ascii(t, 0, 3) === 'TAG') end -= 128;
    }
    if (end - start >= 32) {
      const f = await readBytes(file, end - 32, end);
      if (ascii(f, 0, 8) === 'APETAGEX') {
        const size = f[12] | (f[13] << 8) | (f[14] << 16) | (f[15] << 24);
        const hasHeader = (f[23] & 0x80) !== 0;
        end = Math.max(start, end - size - (hasHeader ? 32 : 0));
      }
    }
    return { start, end };
  }

  async function scanMp3(file, limitSec, builder, state, onBytes) {
    const { start, end } = await mp3Bounds(file);
    let buf = new Uint8Array(0), bs = start;
    // Make sure bytes [p, p+n) are in the buffer; false if the file ends first.
    const ensure = async (p, n) => {
      if (p >= bs && p + n <= bs + buf.length) return true;
      if (p + n > end) return false;
      bs = p;
      buf = await readBytes(file, p, Math.min(end, p + Math.max(READ_SIZE, n)));
      onBytes(p - start);
      return p + n <= bs + buf.length;
    };

    let pos = start, first = true, lost = false, skipped = 0;
    while (pos + 4 <= end) {
      if (!(pos >= bs && pos + 4 <= bs + buf.length) && !(await ensure(pos, 4))) break;
      const h = mp3Header(buf, pos - bs);
      let ok = h && pos + h.size <= end;
      if (ok && state.lock && (h.ver !== state.lock.ver || h.layer !== state.lock.layer)) ok = false;
      if (ok && (lost || first)) {
        // After junk, insist the next header lines up too (avoids false syncs).
        ok = (await ensure(pos, h.size + 4))
          ? !!mp3Header(buf, pos - bs + h.size)
          : pos + h.size === end || (await ensure(pos, h.size));
      }
      if (!ok) { pos++; skipped++; lost = true; continue; }
      lost = false;

      if (pos + h.size > bs + buf.length) await ensure(pos, h.size);
      if (first) {
        first = false;
        if (!state.lock) state.lock = { ver: h.ver, layer: h.layer, sr: h.sr, srI: h.srI, mono: h.mono };
        else if (h.sr !== state.lock.sr) state.warnings.add(`${file.name} is ${h.sr} Hz, the first file is ${state.lock.sr} Hz - some players may play it at the wrong speed.`);
        if (isInfoFrame(buf, pos - bs, h)) { pos += h.size; continue; }
      }

      const dur = h.samples / h.sr;
      if (builder.cur && builder.cur.seconds + dur > limitSec + 1e-6) builder.close();
      builder.add(file, pos, pos + h.size, dur);
      builder.cur.frames = (builder.cur.frames || 0) + 1;
      pos += h.size;
    }
    if (skipped > 4096) state.warnings.add(`${file.name}: skipped ${fmtSize(skipped)} of data that wasn't MP3 audio.`);
    if (first) throw new Error(`No MP3 audio found in ${file.name}.`);
  }

  // A fresh Xing frame for the start of each part: tells players the part's
  // real frame count and size, so length and seeking are right even when
  // the joined files had different bitrates. (Layer III only, like LAME.)
  function xingFrame(lock, frames, bytes) {
    if (!lock || lock.layer !== 1) return null;
    const brI = lock.ver === 3 ? 9 : 8; // 128 kbps / 64 kbps: roomy enough for the tag
    const out0 = [0xff, 0xe0 | (lock.ver << 3) | (lock.layer << 1) | 1, (brI << 4) | (lock.srI << 2), lock.mono ? 0xc0 : 0x00];
    const h = mp3Header(out0, 0);
    const out = new Uint8Array(h.size);
    out.set(out0);
    const at = 4 + (lock.ver === 3 ? (lock.mono ? 17 : 32) : (lock.mono ? 9 : 17));
    const dv = new DataView(out.buffer);
    out.set([88, 105, 110, 103], at); // "Xing"
    dv.setUint32(at + 4, 3);          // flags: frame count + byte count
    dv.setUint32(at + 8, frames);
    dv.setUint32(at + 12, bytes + h.size);
    return out;
  }

  // ---------- WAV ----------
  async function wavInfo(file) {
    const head = await readBytes(file, 0, 12);
    if (ascii(head, 0, 4) !== 'RIFF' || ascii(head, 8, 4) !== 'WAVE') throw new Error(`${file.name} isn't a standard WAV file.`);
    let p = 12, fmt = null;
    while (p + 8 <= file.size) {
      const c = await readBytes(file, p, p + 8);
      const id = ascii(c, 0, 4), size = new DataView(c.buffer).getUint32(4, true);
      if (id === 'fmt ') {
        fmt = await readBytes(file, p, p + 8 + size + (size & 1)); // whole chunk, header included
      } else if (id === 'data') {
        if (!fmt) break;
        const dv = new DataView(fmt.buffer);
        const info = {
          fmt, format: dv.getUint16(8, true), channels: dv.getUint16(10, true),
          rate: dv.getUint32(12, true), byteRate: dv.getUint32(16, true),
          align: dv.getUint16(20, true), bits: dv.getUint16(22, true),
          dataStart: p + 8,
        };
        // Streaming writers sometimes leave the size as 0 or 0xFFFFFFFF.
        const avail = file.size - info.dataStart;
        info.dataSize = size === 0 || size > avail ? avail : size;
        info.dataSize -= info.dataSize % info.align;
        return info;
      }
      p += 8 + size + (size & 1);
    }
    throw new Error(`${file.name}: couldn't find the audio data in this WAV.`);
  }

  function wavHeader(fmt, dataLen) {
    const pad = dataLen & 1;
    const out = new Uint8Array(12 + fmt.length + 8);
    const dv = new DataView(out.buffer);
    out.set([82, 73, 70, 70]); // RIFF
    dv.setUint32(4, 4 + fmt.length + 8 + dataLen + pad, true);
    out.set([87, 65, 86, 69], 8); // WAVE
    out.set(fmt, 12);
    out.set([100, 97, 116, 97], 12 + fmt.length); // data
    dv.setUint32(16 + fmt.length, dataLen, true);
    return out;
  }

  async function planWav(list, limitSec, builder, state) {
    const infos = [];
    for (const f of list) infos.push(await wavInfo(f));
    const a = infos[0];
    infos.forEach((w, i) => {
      if (w.channels !== a.channels || w.rate !== a.rate || w.bits !== a.bits || w.format !== a.format) {
        throw new Error(`${list[i].name} is ${w.rate} Hz / ${w.bits}-bit / ${w.channels}ch, but ${list[0].name} is ` +
          `${a.rate} Hz / ${a.bits}-bit / ${a.channels}ch. WAV files can only be joined without re-encoding when they all match.`);
      }
    });
    state.wavFmt = a.fmt;
    const partBytes = Math.max(a.align, Math.floor(limitSec * a.byteRate / a.align) * a.align);
    let room = partBytes;
    infos.forEach((w, i) => {
      let p = w.dataStart;
      const end = w.dataStart + w.dataSize;
      while (p < end) {
        if (room === 0) { builder.close(); room = partBytes; }
        const take = Math.min(room, end - p);
        builder.add(list[i], p, p + take, take / a.byteRate);
        p += take; room -= take;
      }
    });
  }

  // ---------- run ----------
  function clearResults() {
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
    results.innerHTML = '';
    progress.classList.add('hidden');
  }

  function partBlob(part, kind, state) {
    const pieces = part.ranges.map((r) => r.file.slice(r.a, r.b));
    if (kind === 'wav') {
      pieces.unshift(wavHeader(state.wavFmt, part.bytes));
      if (part.bytes & 1) pieces.push(new Uint8Array(1));
      return new Blob(pieces, { type: 'audio/wav' });
    }
    const xing = xingFrame(state.lock, part.frames || 0, part.bytes);
    if (xing) pieces.unshift(xing);
    return new Blob(pieces, { type: 'audio/mpeg' });
  }

  function link(blob, name, label) {
    const url = URL.createObjectURL(blob);
    urls.push(url);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.textContent = label; a.className = 'aj-dl';
    return a;
  }

  async function run() {
    const minutes = parseFloat(minutesInput.value);
    if (!(minutes > 0)) { say('Enter how many minutes each part should be.', 'err'); return; }
    const kinds = new Set(files.map(kindOf));
    if (kinds.size > 1) { say('Mixing MP3 and WAV needs re-encoding. Please use files of one type.', 'err'); return; }
    const kind = files[0] && kindOf(files[0]);
    if (!kind) return;

    busy = true; render();
    clearResults();
    say('Reading files...');
    setProgress(0);

    const limitSec = minutes * 60;
    const builder = new PartBuilder();
    const state = { lock: null, warnings: new Set(), wavFmt: null };
    const total = files.reduce((s, f) => s + f.size, 0) || 1;
    let done = 0;

    try {
      if (kind === 'mp3') {
        for (const f of files) {
          await scanMp3(f, limitSec, builder, state, (n) => setProgress((done + n) / total));
          done += f.size;
          setProgress(done / total);
        }
      } else {
        await planWav(files, limitSec, builder, state);
      }
      builder.close();
      setProgress(1);
      showResults(builder.parts, kind, state, minutes);
    } catch (err) {
      console.error('[JOIN AUDIO]', err);
      say(err.message || String(err), 'err');
      progress.classList.add('hidden');
    } finally {
      busy = false; render();
    }
  }

  function showResults(parts, kind, state, minutes) {
    const totalSec = parts.reduce((s, p) => s + p.seconds, 0);
    const pad = String(parts.length).length < 2 ? 2 : String(parts.length).length;
    const base = 'joined';

    const head = document.createElement('div');
    head.className = 'aj-summary';
    head.innerHTML = `<b>${files.length} file(s), ${fmtTime(totalSec)} total → ${parts.length} part(s) of up to ${minutes} min.</b>`;
    results.appendChild(head);

    if (state.warnings.size) {
      const w = document.createElement('p');
      w.className = 'err';
      w.textContent = Array.from(state.warnings).join(' ');
      results.appendChild(w);
    }

    const ol = document.createElement('ol');
    ol.className = 'aj-parts';
    const anchors = [];
    parts.forEach((p, i) => {
      const li = document.createElement('li');
      const name = `${base}-part-${String(i + 1).padStart(pad, '0')}.${kind}`;
      const a = link(partBlob(p, kind, state), name, `⬇ ${name}`);
      anchors.push(a);
      const info = document.createElement('span');
      info.className = 'aj-meta';
      info.textContent = `${fmtTime(p.seconds)} · ${fmtSize(p.bytes)}`;
      const play = document.createElement('button');
      play.type = 'button'; play.className = 'ico'; play.textContent = '▶'; play.title = 'Preview';
      play.setAttribute('aria-label', 'Preview ' + name);
      // The <audio> element is only created on demand so nothing loads up front.
      play.addEventListener('click', () => {
        const old = li.querySelector('audio');
        if (old) { old.remove(); return; }
        const au = document.createElement('audio');
        au.controls = true; au.src = a.href; au.preload = 'metadata';
        li.appendChild(au);
        au.play().catch(() => {});
      });
      li.append(a, info, play);
      ol.appendChild(li);
    });
    results.appendChild(ol);

    const row = document.createElement('div');
    row.className = 'btn-row';
    const all = document.createElement('button');
    all.type = 'button'; all.textContent = '⬇ Download all parts';
    all.addEventListener('click', async () => {
      // One at a time with a short gap - browsers block bursts of downloads.
      for (const a of anchors) { a.click(); await new Promise((r) => setTimeout(r, 700)); }
    });
    row.appendChild(all);
    if (parts.length > 1) {
      const whole = { ranges: parts.flatMap((p) => p.ranges), bytes: parts.reduce((s, p) => s + p.bytes, 0),
                      frames: parts.reduce((s, p) => s + (p.frames || 0), 0) };
      const w = link(partBlob(whole, kind, state), `${base}-full.${kind}`, '⬇ Whole joined file');
      w.classList.add('aj-btnlink');
      row.appendChild(w);
    }
    results.appendChild(row);
    say('Done. Nothing was uploaded - everything happened on this device.', 'ok-msg');
  }

  goBtn.addEventListener('click', () => { if (!busy && files.length) run(); });
  render();
})();
