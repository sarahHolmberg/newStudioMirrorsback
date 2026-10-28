/**
 * study.js
 * The /study page: a roadmap of info and quiz steps, plus a flashcard deck.
 * Content comes from STUDY_DATA (study-data.js); the flashcard lock time from Cooldown.
 *
 * Roadmap: steps unlock one by one. An info step is done when you press
 * "I've read this"; a quiz step is done when you score at least passScore.
 * Flashcards: round 1 is every card; each next round is only the cards you
 * missed, until you get them all. Then the deck locks for Cooldown.MINUTES.
 * Progress is kept in this browser (localStorage).
 */
(() => {
  const PROGRESS_KEY = 'study-progress-v2'; // { done: [stepIndex, ...] }; bump when the steps change
  const FLASH_KEY = 'study-flashcards';     // { lastCompleted: ISO date }

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
          el('span', { className: `tag ${step.type}`, textContent: step.type === 'quiz' ? 'QUIZ' : 'INFO' })));
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
      el('p', { className: 'muted', textContent: doneCount === steps.length
        ? `All ${steps.length} steps done — you've covered the whole course!`
        : `${doneCount} of ${steps.length} steps done. Steps unlock one by one.` }),
      bar,
      STUDY_DATA.skipped && STUDY_DATA.skipped.length
        ? el('p', { className: 'muted', textContent: `Left out (you know these): ${STUDY_DATA.skipped.join(', ')}` })
        : '',
      el('button', { className: 'flash-btn', textContent: `🃏 Flashcards (${STUDY_DATA.flashcards.length} cards)`, onclick: renderFlashcards }),
      road,
      el('div', { className: 'nav-row' }, resetBtn));
  }

  function openStep(i) {
    if (steps[i].type === 'quiz') renderQuiz(i); else renderInfo(i);
  }

  // ---------- info step ----------
  function renderInfo(i) {
    const step = steps[i];
    const body = el('div');
    step.sections.forEach((s) => {
      body.append(el('h3', { textContent: s.heading }));
      body.append(el('div', { innerHTML: s.html })); // trusted content from study-data.js
    });
    const doneBtn = el('button', { textContent: isDone(i) ? 'Back to roadmap ✓' : "I've read this ✓", onclick: () => {
      markDone(i);
      renderRoadmap();
    } });
    show(`📖 Step ${i + 1} of ${steps.length}`,
      el('h2', { textContent: step.title }),
      el('p', { className: 'muted', textContent: `${step.part} · Info` }),
      body,
      el('div', { className: 'nav-row' }, backBtn(), doneBtn));
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

  // ---------- flashcards ----------
  function renderFlashcards() {
    const flash = load(FLASH_KEY, {});
    const lockLeft = Cooldown.remainingMs(flash.lastCompleted);
    if (lockLeft > 0) return renderLocked(lockLeft);

    let round = 1;
    let queue = shuffle(STUDY_DATA.flashcards);
    let missed = [];
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
        el('h2', { textContent: round === 1 ? 'Round 1: every card' : `Round ${round}: only the ones you missed` }),
        el('p', { className: 'muted', textContent: `Card ${pos + 1} of ${queue.length} · ${missed.length} missed this round` }),
        cardBtn,
        verdict,
        el('div', { className: 'nav-row' }, backBtn()));
    }

    function next(gotIt) {
      if (!gotIt) missed.push(queue[pos]);
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
      save(FLASH_KEY, { lastCompleted: new Date().toISOString() });
      show('🃏 Flashcards',
        el('div', { className: 'lock' },
          el('div', { className: 'big', textContent: '🏆' }),
          el('h2', { textContent: `All ${STUDY_DATA.flashcards.length} cards right!` }),
          el('p', { textContent: `It took ${round} round${round > 1 ? 's' : ''}. The deck now rests for ${Cooldown.format(Cooldown.MINUTES * 60000)} so the next review is spaced out.` })),
        el('div', { className: 'nav-row' }, backBtn()));
    }

    card();
  }

  function renderLocked(ms) {
    show('🃏 Flashcards',
      el('div', { className: 'lock' },
        el('div', { className: 'big', textContent: '🔒' }),
        el('h2', { textContent: 'Resting' }),
        el('p', { textContent: `You finished the whole deck. It opens again in ${Cooldown.format(ms)}.` })),
      el('div', { className: 'nav-row' }, backBtn()));
  }

  renderRoadmap();
})();
