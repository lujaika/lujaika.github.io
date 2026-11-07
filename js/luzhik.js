/* ==========================================================================
   luzhik.js — Лужик между разделами
   Вместо линий между блоками: на стыке разделов Лужик бежит, выглядывает из-за края,
   прыгает, катит мяч. Всё на CSS-анимации (css/09-luzhik.css), без библиотек.
   Картинки: img/luzhik/*.png (стикеры Лужика с прозрачным фоном).
   Чтобы отключить переходы с Лужиком: LUZHIK_DIVIDERS.enabled = false.
   ========================================================================== */
const LUZHIK_DIVIDERS = {
  enabled: true,
  // [вариант анимации, картинка, подпись для скринридера]
  list: [
    ['run',     'run',    'Лужик бежит'],
    ['peek',    'peek',   'Лужик выглядывает из-за края'],
    ['jump',    'ace',    'Лужик подбрасывает мяч'],
    ['roll',    'play',   'Лужик ждёт мяч'],
    ['sway',    'champ',  'Лужик с кубком'],
    ['bounce',  'ura',    'Лужик радуется'],
    ['shuffle', 'warmup', 'Лужик разминается']
  ]
};

/* Ставит разделитель перед каждым разделом страницы (кроме первого экрана и бегущей строки). */
function insertLuzhikDividers() {
  if (!LUZHIK_DIVIDERS.enabled) return;
  const kids = [...app.children];
  let n = 0;
  kids.forEach((el, i) => {
    const isBlock = el.tagName === 'SECTION' || el.tagName === 'FOOTER';
    if (!isBlock || i === 0) return;
    if (el.matches('.hero, .ph, .cp')) return;
    const prev = kids[i - 1];
    if (prev.matches('.hero, .ph, .tk')) return;
    const [kind, img, label] = LUZHIK_DIVIDERS.list[n++ % LUZHIK_DIVIDERS.list.length];
    const dv = document.createElement('div');
    dv.className = 'dv dv-' + kind;
    dv.setAttribute('role', 'img');
    dv.setAttribute('aria-label', label);
    dv.innerHTML = `<div class="dv-i"><img src="img/luzhik/${img}.png?v=2" alt="" width="104" height="104" loading="lazy" decoding="async"></div>` +
      (kind === 'jump' || kind === 'roll' ? '<i class="dv-ball"></i>' : '');
    app.insertBefore(dv, el);
  });
  // Анимация идёт только пока разделитель на экране
  const io = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), { rootMargin: '80px' });
  $$('.dv').forEach(d => io.observe(d));
}
