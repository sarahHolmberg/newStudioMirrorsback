/**
 * study.js
 * The /study page: a roadmap of info and quiz steps, plus a flashcard deck.
 * Content comes from STUDY_DATA: each study line has its own data file
 * (study-data.js for HTML, study-battle-data.js for Battle, study-bootstrap-data.js for Bootstrap). Flashcard scheduling from SRS (study-srs.js).
 *
 * Roadmap: steps unlock one by one. An info step is done when you press
 * "I've read this", and if it has audio, only after listening to it all the way
 * through REQUIRED_LISTENS times. A quiz step is done when you score at least passScore.
 * Flashcards: spaced repetition. Only the cards that are due come up. Round 1
 * is every due card; each next round is only the ones you missed, until you
 * get them all. Then each card waits longer or shorter depending on how it went.
 * Audio: info steps with an mp3 get a player. It is a plain <audio> element
 * with Media Session info, so it keeps playing with the phone screen locked.
 * "Listen to all lessons" is a playlist of the same mp3s, so those listens count too.
 * Progress is kept in this browser (localStorage), separately per study line.
 */
(() => {
  // CHANGE HERE: the study lines shown as tabs on the roadmap
  const LINES = [
    { id: 'html', name: 'HTML', href: '/study/' },
    { id: 'battle', name: 'Battle', href: '/study/battle/' },
    { id: 'bootstrap', name: 'Bootstrap', href: '/study/bootstrap/' }
  ];

  // The HTML line keeps its original key names so saved progress carries over
  const prefix = !STUDY_DATA.id || STUDY_DATA.id === 'html' ? 'study' : `study-${STUDY_DATA.id}`;
  const PROGRESS_KEY = `${prefix}-progress-v2`; // { done: [stepIndex, ...] }; bump when the steps change
  const FLASH_KEY = `${prefix}-srs`;            // { [card front]: { box, due } }
  const GOALS_KEY = `${prefix}-goals`;          // { [goal id]: count }
  const LISTENS_KEY = `${prefix}-listens`;      // { [mp3 path]: full listens }

  // CHANGE HERE: full listens needed before an info step with audio can be finished
  const REQUIRED_LISTENS = 3;

  const view = document.getElementById('view');
  const windowTitle = document.getElementById('windowTitle');
  const steps = STUDY_DATA.steps;

  // ---------- storage (never breaks the page if blocked) ----------
  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: progress lasts this visit only */ }
  }
  let progress = load(PROGRESS_KEY, { done: [] });
  const isDone = (i) => progress.done.includes(i);
  const isOpen = (i) => i === 0 || isDone(i - 1) || isDone(i);
  function markDone(i) {
    if (!isDone(i)) progress.done.push(i);
    save(PROGRESS_KEY, progress);
  }

  // ---------- small helpers ----------
  function el(tag, props = {}, ...children) {
    const node = Object.assign(document.createElement(tag), props);
    children.forEach((c) => node.append(c));
    return node;
  }
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function show(title, ...nodes) {
    windowTitle.textContent = title;
    view.replaceChildren(...nodes);
    window.scrollTo(0, 0);
  }
  const backBtn = () => el('button', { textContent: '← Roadmap', onclick: renderRoadmap });

  const listensOf = (src) => load(LISTENS_KEY, {})[src] || 0;
  const listenLabel = (src) => `🎧 ${Math.min(listensOf(src), REQUIRED_LISTENS)}/${REQUIRED_LISTENS}`;
  function listenTag(src) {
    const tag = el('span', { className: 'tag listen-tag', textContent: listenLabel(src) });
    tag.dataset.src = src; // countListens updates tags with this src
    return tag;
  }

  // ---------- roadmap ----------
  function renderRoadmap() {
    const doneCount = progress.done.length;
    const bar = el('div', { className: 'bar' }, el('div'));
    bar.firstChild.style.width = `${Math.round((doneCount / steps.length) * 100)}%`;

    const road = el('ol', { className: 'road' });
    const nextIndex = steps.findIndex((_, i) => !isDone(i));
    steps.forEach((step, i) => {
      const li = el('li', { className: isDone(i) ? 'done' : i === nextIndex ? 'next' : '' });
      const btn = el('button', { disabled: !isOpen(i), onclick: () => openStep(i) },
        el('span', { className: 'dot', textContent: isDone(i) ? '✓' : String(i + 1) }),
        el('span', { className: 'road-text' },
          el('small', { textContent: step.part }),
          step.title,
          el('span', { className: `tag ${step.type}`, textContent: step.type.toUpperCase() }),
          step.audio ? listenTag(step.audio) : ''));
      if (!isOpen(i)) btn.title = 'Finish the step before to unlock';
      li.append(btn);
      road.append(li);
    });

    // Two clicks to reset: the first only asks
    const resetBtn = el('button', { textContent: 'Reset progress', onclick: () => {
      if (!resetBtn.dataset.armed) {
        resetBtn.dataset.armed = '1';
        resetBtn.textContent = 'Click again to start over';
        return;
      }
      progress = { done: [] };
      save(PROGRESS_KEY, progress);
      renderRoadmap();
    } });

    show(`🎓 ${STUDY_DATA.title}`,
      lineTabs(),
      el('p', { className: 'muted', textContent: doneCount === steps.length
        ? `All ${steps.length} steps done — you've covered the whole course!`
        : `${doneCount} of ${steps.length} steps done. Steps unlock one by one.` }),
      bar,
      STUDY_DATA.skipped && STUDY_DATA.skipped.length
        ? el('p', { className: 'muted', textContent: `Left out (you know these): ${STUDY_DATA.skipped.join(', ')}` })
        : '',
      el('button', { className: 'flash-btn', textContent: flashLabel(), onclick: renderFlashcards }),
      steps.some((s) => s.audio) ? playlist() : '',
      road,
      el('div', { className: 'nav-row' }, resetBtn));
  }

  function lineTabs() {
    const current = STUDY_DATA.id || 'html';
    return el('nav', { className: 'lines' }, ...LINES.map((line) => line.id === current
      ? el('span', { className: 'line-tab active', textContent: line.name })
      : el('a', { className: 'line-tab', href: line.href, textContent: line.name })));
  }

  function openStep(i) {
    const type = steps[i].type;
    if (type === 'quiz') renderQuiz(i); else if (type === 'goals') renderGoals(i); else renderInfo(i);
  }

  // ---------- audio ----------
  // A plain <audio> element: phones keep playing it with the screen locked.
  // Media Session puts the title and play/pause on the lock screen.
  function player(src, title, onListen) {
    const audio = el('audio', { controls: true, preload: 'none', src });
    audio.addEventListener('play', () => {
      document.querySelectorAll('audio').forEach((a) => { if (a !== audio) a.pause(); });
      setMediaSession(audio, audio.dataset.title || title);
    });
    countListens(audio, onListen);
    return audio;
  }

  function setMediaSession(audio, title, extra = {}) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title, artist: STUDY_DATA.title });
    const handlers = {
      play: () => audio.play(),
      pause: () => audio.pause(),
      seekbackward: () => { audio.currentTime = Math.max(0, audio.currentTime - 10); },
      seekforward: () => { audio.currentTime += 10; },
      previoustrack: null,
      nexttrack: null,
      ...extra
    };
    Object.entries(handlers).forEach(([action, fn]) => {
      try { navigator.mediaSession.setActionHandler(action, fn); } catch { /* action not supported here */ }
    });
  }

  // A listen counts when the track ends and at least 90% of it was actually played,
  // so jumping to the end does not count. Adds one to LISTENS_KEY for the current src.
  function countListens(audio, onListen) {
    let heard = 0;
    let last = null;
    audio.addEventListener('timeupdate', () => {
      const t = audio.currentTime;
      // Normal playback moves a fraction of a second per update; a seek is a big jump and is ignored
      if (last !== null && t > last && t - last < 1.5 * Math.max(1, audio.playbackRate)) heard += t - last;
      last = t;
    });
    audio.addEventListener('emptied', () => { heard = 0; last = null; }); // new src
    audio.addEventListener('ended', () => {
      const src = audio.getAttribute('src');
      if (audio.duration && heard >= audio.duration * 0.9) {
        const listens = load(LISTENS_KEY, {});
        listens[src] = (listens[src] || 0) + 1;
        save(LISTENS_KEY, listens);
        document.querySelectorAll('.listen-tag').forEach((tag) => {
          if (tag.dataset.src === src) tag.textContent = listenLabel(src);
        });
        if (onListen) onListen(src);
      }
      heard = 0;
      last = null;
    });
  }

  // Every lesson's mp3 one after the other, in one player (keeps going with the screen locked)
  function playlist() {
    const tracks = steps.filter((s) => s.audio).map((s) => ({ src: s.audio, title: s.title }));
    let at = 0;
    const nowPlaying = el('span', { className: 'muted' });
    const audio = player(tracks[0].src, tracks[0].title);

    function go(n, autoplay) {
      at = (n + tracks.length) % tracks.length;
      audio.dataset.title = tracks[at].title;
      audio.src = tracks[at].src;
      nowPlaying.textContent = `Lesson ${at + 1} of ${tracks.length}: ${tracks[at].title}`;
      if (autoplay) audio.play().catch(() => { /* the browser wants a tap first */ });
    }
    audio.addEventListener('play', () => setMediaSession(audio, tracks[at].title, {
      previoustrack: () => go(at - 1, true),
      nexttrack: () => go(at + 1, true)
    }));
    audio.addEventListener('ended', () => { if (at < tracks.length - 1) go(at + 1, true); });
    go(0, false);

    return el('div', { className: 'listen-all' },
      el('strong', { textContent: '🎧 Listen to all lessons' }),
      nowPlaying,
      audio,
      el('div', { className: 'verdict' },
        el('button', { textContent: '⏮ Previous', onclick: () => go(at - 1, !audio.paused) }),
        el('button', { textContent: 'Next ⏭', onclick: () => go(at + 1, !audio.paused) })));
  }

  // ---------- info step ----------
  function renderInfo(i) {
    const step = steps[i];
    const body = el('div');
    step.sections.forEach((s) => {
      body.append(el('h3', { textContent: s.heading }));
      body.append(el('div', { innerHTML: s.html })); // trusted content from study-data.js
    });
    const doneBtn = el('button', { onclick: () => {
      markDone(i);
      renderRoadmap();
    } });
    const listenNote = el('span', { className: 'muted' });
    // Locked until the lesson has been heard REQUIRED_LISTENS times (steps already done stay done)
    function paintDone() {
      const heard = step.audio ? listensOf(step.audio) : REQUIRED_LISTENS;
      const locked = !isDone(i) && heard < REQUIRED_LISTENS;
      doneBtn.disabled = locked;
      doneBtn.textContent = isDone(i) ? 'Back to roadmap ✓'
        : locked ? `🔒 Listen ${REQUIRED_LISTENS - heard} more time${REQUIRED_LISTENS - heard > 1 ? 's' : ''}` : "I've read this ✓";
      listenNote.textContent = `Heard all the way through ${heard} of ${REQUIRED_LISTENS} times` +
        (heard >= REQUIRED_LISTENS ? ' ✓' : '. Skipping ahead does not count.');
    }
    paintDone();
    show(`📖 Step ${i + 1} of ${steps.length}`,
      el('h2', { textContent: step.title }),
      el('p', { className: 'muted', textContent: `${step.part} · Info` }),
      step.audio ? el('div', { className: 'listen' }, el('strong', { textContent: '🎧 Listen to this lesson' }), player(step.audio, step.title, paintDone), listenNote) : '',
      body,
      el('div', { className: 'nav-row' }, backBtn(), doneBtn));
  }

  // ---------- goals step ----------
  function renderGoals(i) {
    const step = steps[i];
    const counts = load(GOALS_KEY, {});
    const now = new Date();
    const [month, day] = step.deadline.split('-').map(Number);
    const deadline = new Date(now.getFullYear(), month - 1, day, 23, 59, 59);
    const daysLeft = Math.max(0, Math.ceil((deadline - now) / 86400000));

    const list = el('div', { className: 'goal-list' });
    function paint() {
      list.replaceChildren(...step.goals.map((g) => {
        const n = counts[g.id] || 0;
        const bar = el('div', { className: 'bar' }, el('div'));
        bar.firstChild.style.width = `${Math.min(100, Math.round((n / g.target) * 100))}%`;
        const change = (d) => {
          counts[g.id] = Math.max(0, n + d);
          save(GOALS_KEY, counts);
          paint();
        };
        return el('div', { className: 'goal' },
          el('div', { className: 'goal-head' },
            el('span', { textContent: `${g.label}${n >= g.target ? ' ✓' : ''}` }),
            el('span', { className: 'goal-count', textContent: `${n} / ${g.target}` })),
          bar,
          el('div', { className: 'verdict' },
            el('button', { textContent: '− 1', ariaLabel: `Remove one from ${g.label}`, onclick: () => change(-1) }),
            el('button', { textContent: '+ 1', ariaLabel: `Add one to ${g.label}`, onclick: () => change(1) })));
      }));
    }
    paint();

    show(`🎯 Step ${i + 1} of ${steps.length}`,
      el('h2', { textContent: step.title }),
      el('p', { className: 'muted', textContent: `${step.part} · ${daysLeft} day${daysLeft === 1 ? '' : 's'} left this year` }),
      list,
      el('div', { className: 'nav-row' }, backBtn(), el('button', { textContent: isDone(i) ? 'Back to roadmap ✓' : 'Got my goals ✓', onclick: () => {
        markDone(i);
        renderRoadmap();
      } })));
  }

  // ---------- quiz step ----------
  function renderQuiz(i) {
    const step = steps[i];
    const questions = shuffle(step.questions);
    let current = 0;
    let right = 0;

    function question() {
      const q = questions[current];
      const options = el('div', { className: 'options' });
      const feedback = el('div');
      const buttons = q.options.map((text, k) => el('button', { textContent: text, onclick: () => pick(k) }));
      options.append(...buttons);

      function pick(k) {
        buttons.forEach((b) => { b.disabled = true; });
        buttons[q.answer].classList.add('right');
        const correct = k === q.answer;
        if (correct) right++; else buttons[k].classList.add('wrong');
        const last = current === questions.length - 1;
        feedback.replaceChildren(
          el('p', { className: 'feedback' }, el('strong', { textContent: correct ? '✓ Right! ' : '✗ Not quite. ' }), q.why),
          el('div', { className: 'nav-row' }, el('button', { textContent: last ? 'See result' : 'Next question →', onclick: () => {
            current++;
            if (last) result(); else question();
          } })));
        feedback.querySelector('.nav-row button').focus();
      }

      show(`📝 Step ${i + 1} of ${steps.length}`,
        el('h2', { textContent: step.title }),
        el('p', { className: 'muted', textContent: `Question ${current + 1} of ${questions.length} · ${right} right so far` }),
        el('p', {}, el('strong', { textContent: q.q })),
        options,
        feedback,
        el('div', { className: 'nav-row' }, backBtn()));
    }

    function result() {
      const share = right / questions.length;
      const passed = share >= STUDY_DATA.passScore;
      if (passed) markDone(i);
      const need = Math.ceil(STUDY_DATA.passScore * questions.length);
      show(`📝 Step ${i + 1} of ${steps.length}`,
        el('h2', { textContent: step.title }),
        el('div', { className: 'score', textContent: `${right} / ${questions.length}` }),
        el('p', { textContent: passed
          ? '🎉 Passed! The next step is unlocked.'
          : `You need ${need} right to pass. Read the step before again and retry.` }),
        el('div', { className: 'nav-row' },
          backBtn(),
          el('button', { textContent: 'Retry quiz', onclick: () => renderQuiz(i) })));
    }

    question();
  }

  // ---------- flashcards (spaced repetition) ----------
  const cards = STUDY_DATA.flashcards;

  function flashLabel() {
    const due = SRS.dueCards(cards, load(FLASH_KEY, {})).length;
    return due ? `🃏 Flashcards · ${due} due` : '🃏 Flashcards · all caught up';
  }

  function renderFlashcards() {
    let states = load(FLASH_KEY, {});
    const due = SRS.dueCards(cards, states);
    if (!due.length) return renderCaughtUp(states);

    let round = 1;
    let queue = shuffle(due);
    let missed = [];
    const lapsed = new Set(); // cards missed at least once this session
    let pos = 0;

    function card() {
      const c = queue[pos];
      let flipped = false;
      const label = el('small');
      const text = el('span');
      const cardBtn = el('button', { className: 'card', onclick: flip }, label, text);
      const verdict = el('div', { className: 'verdict hidden' },
        el('button', { textContent: '✗ Missed it', onclick: () => next(false) }),
        el('button', { textContent: '✓ Got it', onclick: () => next(true) }));

      function paint() {
        label.textContent = flipped ? 'Answer (tap to flip back)' : 'Question (tap to see the answer)';
        text.textContent = flipped ? c.back : c.front;
      }
      function flip() {
        cardBtn.classList.add('half');
        setTimeout(() => {
          flipped = !flipped;
          paint();
          cardBtn.classList.remove('half');
          verdict.classList.remove('hidden');
        }, 90);
      }
      paint();

      show('🃏 Flashcards',
        el('h2', { textContent: round === 1 ? `Round 1: ${queue.length} card${queue.length > 1 ? 's' : ''} due` : `Round ${round}: only the ones you missed` }),
        el('p', { className: 'muted', textContent: `Card ${pos + 1} of ${queue.length} · ${missed.length} missed this round` }),
        cardBtn,
        verdict,
        el('div', { className: 'nav-row' }, backBtn()));
    }

    function next(gotIt) {
      const c = queue[pos];
      if (gotIt) {
        // Schedule a card once it is right: later if it was right first time, tomorrow if missed before
        states = SRS.grade(c, !lapsed.has(c), states);
        save(FLASH_KEY, states);
      } else {
        lapsed.add(c);
        missed.push(c);
      }
      pos++;
      if (pos < queue.length) return card();
      if (missed.length) return roundOver();
      finished();
    }

    function roundOver() {
      show('🃏 Flashcards',
        el('h2', { textContent: `Round ${round} done` }),
        el('p', { textContent: `You got ${queue.length - missed.length} of ${queue.length}. Next round repeats only the ${missed.length} you missed.` }),
        el('div', { className: 'nav-row' }, backBtn(), el('button', { textContent: 'Next round →', onclick: () => {
          round++;
          queue = shuffle(missed);
          missed = [];
          pos = 0;
          card();
        } })));
    }

    function finished() {
      const firstTry = due.length - lapsed.size;
      show('🃏 Flashcards',
        el('div', { className: 'lock' },
          el('div', { className: 'big', textContent: '🏆' }),
          el('h2', { textContent: `All ${due.length} due cards right!` }),
          el('p', { textContent: `${firstTry} right on the first try moved up a box, so they wait longer next time. ${lapsed.size} you missed went back to box 1 and come back tomorrow.` })),
        boxTable(states),
        el('div', { className: 'nav-row' }, backBtn()));
    }

    card();
  }

  function renderCaughtUp(states) {
    show('🃏 Flashcards',
      el('div', { className: 'lock' },
        el('div', { className: 'big', textContent: '🔒' }),
        el('h2', { textContent: 'All caught up' }),
        el('p', { textContent: `No cards are due. The next one comes back in ${SRS.format(SRS.nextDueMs(cards, states))}.` })),
      boxTable(states),
      el('div', { className: 'nav-row' }, backBtn()));
  }

  // How many cards sit in each box, and how long each box waits
  function boxTable(states) {
    const counts = SRS.boxCounts(cards, states);
    const rows = SRS.INTERVAL_DAYS.map((days, box) => el('tr', {},
      el('td', { textContent: box === 0 ? 'New' : `Box ${box}` }),
      el('td', { textContent: box === 0 ? 'now' : `${days} day${days > 1 ? 's' : ''}` }),
      el('td', { textContent: String(counts[box]) })));
    return el('table', { className: 'boxes' },
      el('thead', {}, el('tr', {}, el('th', { textContent: 'Box' }), el('th', { textContent: 'Comes back after' }), el('th', { textContent: 'Cards' }))),
      el('tbody', {}, ...rows));
  }

  renderRoadmap();
})();
