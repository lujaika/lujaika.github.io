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
    ['jump',    'ace',    'Лужик подбрасывает мяч'],
    ['roll',    'play',   'Лужик ждёт мяч'],
    ['sway',    'champ',  'Лужик с кубком'],
    ['bounce',  'ura',    'Лужик радуется'],
    ['shuffle', 'warmup', 'Лужик разминается'],
    ['sway',    'hello',  'Лужик машет рукой'],
    ['bounce',  'book',   'Лужик показывает на вас']
  ]
};

/* Ставит разделитель перед каждым разделом страницы (кроме первого экрана и бегущей строки). */
function insertLuzhikDividers() {
  if (!LUZHIK_DIVIDERS.enabled) return;
  const kids = [...app.children];
  let n = 0, eligible = 0;
  // На каждой странице набор начинается с другого Лужика: так страницы не повторяют друг друга
  const start = [...(typeof shownPage === 'string' ? shownPage : '')].reduce((h, c) => h + c.charCodeAt(0), 0) % LUZHIK_DIVIDERS.list.length;
  kids.forEach((el, i) => {
    const isBlock = el.tagName === 'SECTION' || el.tagName === 'FOOTER';
    if (!isBlock || i === 0) return;
    if (el.matches('.hero, .ph, .cp')) return;
    const prev = kids[i - 1];
    if (++eligible % 2 === 0) return;   // Лужик не чаще, чем через раздел: два рядом — перебор
    if (prev.matches('.hero, .ph, .tk')) return;
    const L = LUZHIK_DIVIDERS.list;
    const [kind, img, label] = L[(n++ + start) % L.length];
    const dv = document.createElement('div');
    dv.className = 'dv dv-' + kind;
    dv.setAttribute('role', 'img');
    dv.setAttribute('aria-label', label);
    dv.innerHTML = `<div class="dv-i"><img src="img/luzhik/${img}.png?v=6" alt="" width="104" height="104" loading="lazy" decoding="async"></div>` +
      (kind === 'jump' || kind === 'roll' ? '<i class="dv-ball"></i>' : '');
    app.insertBefore(dv, el);
  });
  // Анимация идёт только пока разделитель на экране
  const io = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), { rootMargin: '80px' });
  $$('.dv').forEach(d => io.observe(d));
}
