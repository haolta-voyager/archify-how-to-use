(() => {
  const W = 1600;
  const H = 900;
  const SWIPE_MIN = 50;
  const CHANNEL = 'seminar-deck';
  const root = document.documentElement;
  const deck = document.querySelector('.deck');
  const slides = [...deck.querySelectorAll('.slide')];
  const isPresenter = new URLSearchParams(location.search).has('presenter');
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null;
  const $ = (sel) => document.querySelector(sel);

  let index = 0;
  let step = 0;

  // data-step groups fragments that appear on the same click; otherwise DOM order is the build order.
  const stepOf = (f, i) => (f.dataset.step ? Number(f.dataset.step) : i + 1);
  const buildOrder = (slide) => {
    const frags = [...slide.querySelectorAll('.f')];
    const order = [...new Set(frags.map(stepOf))].sort((a, b) => a - b);
    return { frags, order };
  };
  const stepCount = (i) => buildOrder(slides[i]).order.length;

  const fitStage = (el, width, height) => {
    el.style.setProperty('--s', String(Math.min(width / W, height / H)));
  };

  const applyFragments = (slide, count) => {
    const { frags, order } = buildOrder(slide);
    frags.forEach((f, i) => f.classList.toggle('on', order.indexOf(stepOf(f, i)) < count));
  };

  const renderDeck = (dir) => {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.classList.remove('go-next', 'go-prev');
      if (active && dir) slide.classList.add(dir);
    });
    applyFragments(slides[index], step);
    $('.progress').style.width = `${((index + 1) / slides.length) * 100}%`;
    $('.hud .count').textContent = `${index + 1} / ${slides.length}`;
    history.replaceState(null, '', `${location.search}#${index + 1}`);
  };

  const mountMini = (box, slide, count) => {
    box.innerHTML = '';
    if (!slide) return;
    const copy = slide.cloneNode(true);
    copy.classList.add('is-active');
    copy.classList.remove('go-next', 'go-prev');
    box.append(copy);
    applyFragments(copy, count);
    fitStage(box, box.clientWidth, box.clientHeight);
  };

  const renderPresenter = () => {
    const next = slides[index + 1];
    const hasMoreSteps = step < stepCount(index);
    mountMini($('.pv .now'), slides[index], step);
    mountMini($('.pv .next'), hasMoreSteps ? slides[index] : next, hasMoreSteps ? step + 1 : 0);
    $('.pv .notes-box').textContent = slides[index].querySelector('.notes')?.textContent.trim() || '(Không có ghi chú)';
    $('.pv .pos').textContent = `Slide ${index + 1} / ${slides.length} · bước ${step}/${stepCount(index)}`;
  };

  const render = (dir) => (isPresenter ? renderPresenter() : renderDeck(dir));

  const go = (i, s, { silent = false } = {}) => {
    const dir = i > index ? 'go-next' : i < index ? 'go-prev' : null;
    index = Math.max(0, Math.min(slides.length - 1, i));
    step = Math.max(0, Math.min(stepCount(index), s));
    render(dir);
    if (!silent) channel?.postMessage({ index, step });
  };

  const next = () => {
    if (step < stepCount(index)) go(index, step + 1);
    else if (index < slides.length - 1) go(index + 1, 0);
  };

  const prev = () => {
    if (step > 0) go(index, step - 1);
    else if (index > 0) go(index - 1, stepCount(index - 1));
  };

  const openPresenter = () => {
    window.open(`${location.pathname}?presenter#${index + 1}`, 'deck-presenter', 'width=1280,height=760');
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else root.requestFullscreen?.().catch(() => {});
  };

  const KEYS = {
    ArrowRight: next, ArrowDown: next, PageDown: next, ' ': next, Enter: next,
    ArrowLeft: prev, ArrowUp: prev, PageUp: prev, Backspace: prev,
    Home: () => go(0, 0),
    End: () => go(slides.length - 1, stepCount(slides.length - 1)),
    f: toggleFullscreen, F: toggleFullscreen,
    s: openPresenter, S: openPresenter,
    b: () => document.body.classList.toggle('blackout'),
    B: () => document.body.classList.toggle('blackout'),
    '?': () => $('.help').classList.toggle('open'),
    Escape: () => $('.help').classList.remove('open'),
  };

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const action = KEYS[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  });

  deck.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    next();
  });

  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-act]')?.dataset.act;
    if (action === 'prev') prev();
    else if (action === 'next') next();
    else if (action === 'full') toggleFullscreen();
    else if (action === 'presenter') openPresenter();
    else if (action === 'help') $('.help').classList.toggle('open');
  });

  let touchX = null;
  deck.addEventListener('touchstart', (event) => { touchX = event.touches[0].clientX; }, { passive: true });
  deck.addEventListener('touchend', (event) => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) >= SWIPE_MIN) (dx < 0 ? next : prev)();
  });

  channel?.addEventListener('message', ({ data }) => go(data.index, data.step, { silent: true }));

  const startTimer = () => {
    const started = Date.now();
    const pad = (n) => String(n).padStart(2, '0');
    let offset = 0;
    const tick = () => {
      const sec = Math.floor((Date.now() - started) / 1000) - offset;
      $('.pv .timer').textContent = `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
      $('.pv .clock').textContent = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };
    $('.pv [data-reset]').addEventListener('click', () => {
      offset = Math.floor((Date.now() - started) / 1000);
      tick();
    });
    tick();
    setInterval(tick, 1000);
  };

  window.addEventListener('resize', () => {
    fitStage(deck, innerWidth, innerHeight);
    if (isPresenter) renderPresenter();
  });

  if (isPresenter) {
    document.body.classList.add('presenter');
    startTimer();
  }
  fitStage(deck, innerWidth, innerHeight);
  const fromHash = parseInt(location.hash.slice(1), 10);
  go(Number.isNaN(fromHash) ? 0 : fromHash - 1, 0, { silent: true });
})();
