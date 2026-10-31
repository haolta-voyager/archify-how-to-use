(() => {
  const SLIDE_SELECTOR = 'main > :is(section, article, nav)';
  const DESIGN_WIDTH = 1000;
  const STAGE_PAD = 32;
  const BAR_HEIGHT = 52;
  // Shrinking dense slides makes them unreadable on a projector, so they scroll instead.
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 2;
  const SWIPE_MIN = 50;
  const root = document.documentElement;

  let slides = [];
  let index = 0;
  let bar = null;
  let wentFullscreen = false;

  const isPresenting = () => root.classList.contains('presenting');

  const fit = () => {
    const slide = slides[index];
    if (!slide) return;
    const availW = window.innerWidth - STAGE_PAD * 2;
    const availH = window.innerHeight - BAR_HEIGHT - STAGE_PAD * 2;
    const width = Math.min(DESIGN_WIDTH, availW);
    slide.style.setProperty('--slide-w', `${width}px`);
    slide.style.setProperty('--slide-zoom', '1');
    const zoom = Math.min(availW / width, availH / slide.offsetHeight);
    slide.style.setProperty('--slide-zoom', String(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))));
  };

  const show = (next) => {
    index = Math.max(0, Math.min(slides.length - 1, next));
    slides.forEach((slide, i) => slide.classList.toggle('is-current', i === index));
    fit();
    document.querySelector('main').scrollTop = 0;
    bar.querySelector('.present-count').textContent = `${index + 1} / ${slides.length}`;
    bar.querySelector('.present-progress').style.width = `${((index + 1) / slides.length) * 100}%`;
    bar.querySelector('[data-present="prev"]').disabled = index === 0;
    bar.querySelector('[data-present="next"]').disabled = index === slides.length - 1;
  };

  const startIndex = () => {
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const fromHash = target ? slides.findIndex((slide) => slide.contains(target)) : -1;
    if (fromHash >= 0) return fromHash;
    const fromScroll = slides.findIndex((slide) => slide.getBoundingClientRect().bottom > BAR_HEIGHT * 2);
    return Math.max(0, fromScroll);
  };

  const buildBar = () => {
    const el = document.createElement('div');
    el.className = 'present-bar';
    el.innerHTML = `
      <span class="present-progress"></span>
      <button type="button" data-present="prev" aria-label="Slide trước">←</button>
      <span class="present-count"></span>
      <button type="button" data-present="next" aria-label="Slide sau">→</button>
      <button type="button" data-present="exit" aria-label="Thoát trình chiếu">✕ Thoát</button>`;
    document.body.append(el);
    return el;
  };

  const start = () => {
    if (isPresenting()) return;
    slides = [...document.querySelectorAll(SLIDE_SELECTOR)];
    if (slides.length < 2) return;
    bar = bar || buildBar();
    const first = startIndex();
    root.classList.add('presenting');
    show(first);
    wentFullscreen = false;
    // Fullscreen is a nicety: iOS Safari and embedded frames reject it, and the slide mode still works.
    root.requestFullscreen?.().then(() => { wentFullscreen = true; }).catch(() => {});
  };

  const stop = () => {
    if (!isPresenting()) return;
    const current = slides[index];
    root.classList.remove('presenting');
    slides.forEach((slide) => slide.classList.remove('is-current'));
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    current.scrollIntoView({ block: 'start' });
  };

  const KEYS = {
    ArrowRight: 1, ArrowDown: 1, PageDown: 1, ' ': 1, Enter: 1,
    ArrowLeft: -1, ArrowUp: -1, PageUp: -1, Backspace: -1,
  };

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
    if (!isPresenting()) {
      if (event.key === 'p' || event.key === 'P') start();
      return;
    }
    if (event.key === 'Escape') stop();
    else if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(slides.length - 1);
    else if (event.key in KEYS) show(index + KEYS[event.key]);
    else return;
    event.preventDefault();
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-present-start]')) return start();
    const action = event.target.closest('[data-present]')?.dataset.present;
    if (action === 'prev') show(index - 1);
    else if (action === 'next') show(index + 1);
    else if (action === 'exit') stop();
  });

  let touchX = null;
  document.addEventListener('touchstart', (event) => { touchX = event.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (event) => {
    if (!isPresenting() || touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) >= SWIPE_MIN) show(index + (dx < 0 ? 1 : -1));
  });

  // Esc in fullscreen is swallowed by the browser, so leaving fullscreen is the exit signal.
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && wentFullscreen) stop();
  });
  window.addEventListener('resize', () => { if (isPresenting()) fit(); });

  document.addEventListener('DOMContentLoaded', () => {
    const anchor = document.querySelector('.topbar [data-theme-btn]');
    if (!anchor || document.querySelectorAll(SLIDE_SELECTOR).length < 2) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn present-btn';
    btn.dataset.presentStart = '';
    btn.title = 'Trình chiếu (phím P)';
    btn.innerHTML = '▶<span> Trình chiếu</span>';
    anchor.before(btn);
  });
})();
