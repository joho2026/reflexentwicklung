(() => {
  const notice = document.getElementById('siteNotice');
  const confirm = document.getElementById('confirmNotice');
  const reset = document.getElementById('resetNotice');
  const key = 'reflexentwicklung_notice_v1';
  const show = () => { if (!notice) return; notice.hidden = false; document.body.classList.add('locked'); confirm?.focus(); };
  const hide = () => { if (!notice) return; notice.hidden = true; document.body.classList.remove('locked'); };
  try { localStorage.getItem(key) === 'accepted' ? hide() : show(); } catch { show(); }
  confirm?.addEventListener('click', () => { try { localStorage.setItem(key,'accepted'); } catch {} hide(); });
  reset?.addEventListener('click', e => { e.preventDefault(); try { localStorage.removeItem(key); } catch {} show(); });
  const menu = document.getElementById('menuButton');
  const nav = document.getElementById('navLinks');
  menu?.addEventListener('click', () => { const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); }));
  const obs = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }}), {threshold:.12}) : null;
  document.querySelectorAll('.reveal').forEach(el => obs ? obs.observe(el) : el.classList.add('visible'));
  document.getElementById('year')?.append(String(new Date().getFullYear()));
})();
