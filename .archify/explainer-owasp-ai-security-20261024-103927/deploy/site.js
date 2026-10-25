(() => {
  const KEY = 'seminar-theme';
  const ORDER = ['auto', 'light', 'dark'];
  const LABELS = { auto: 'Giao diện: tự động', light: 'Giao diện: sáng', dark: 'Giao diện: tối' };
  const ICONS = { auto: '◐', light: '☀', dark: '☾' };
  const root = document.documentElement;

  const apply = (mode) => {
    if (mode === 'auto') delete root.dataset.theme;
    else root.dataset.theme = mode;
    document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
      btn.textContent = ICONS[mode];
      btn.title = LABELS[mode];
      btn.setAttribute('aria-label', LABELS[mode]);
    });
  };

  let mode = 'auto';
  try { mode = localStorage.getItem(KEY) || 'auto'; } catch {}
  if (!ORDER.includes(mode)) mode = 'auto';
  // Loaded in <head> so the saved theme lands before first paint; buttons exist only after parse.
  apply(mode);
  document.addEventListener('DOMContentLoaded', () => apply(mode));

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-theme-btn]')) return;
    mode = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    apply(mode);
    try { localStorage.setItem(KEY, mode); } catch {}
  });
})();
