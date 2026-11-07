/* ==========================================================================
   app.js — «двигатель» сайта: переключение страниц, меню, анимации
   Это одностраничный сайт: страницы не перезагружаются, а подставляются в
   <main id="app"> по адресу после значка # (например, сайт.ru/#/prices).

   Обычно этот файл менять не нужно. Он подключается последним.
   ========================================================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const body = document.body;
const app = $('#app');

/* Названия страниц по адресу: { '': 'Главная', services: 'Услуги', … } */
const PAGE_TITLES = Object.fromEntries(NAV);
COACHES.forEach(c => { PAGE_TITLES['coach/' + c.slug] = c.name; });   // страницы тренеров
PAGE_TITLES.privacy = PRIVACY.title;
PAGE_TITLES.consent = CONSENT.title;
PAGE_TITLES.luzhik = LUZHIK_PAGE.title;

/* Цвета полос при переходе между страницами */
const TRANSITION_COLORS = ['#0a1410', '#cdf24a', '#9c3f2b', '#2a6bd0', '#2f6b3a'];


/* --------------------------------------------------------------------------
   Шапка, меню и полосы перехода строятся один раз при загрузке
   -------------------------------------------------------------------------- */
$('#hd').innerHTML = headerHtml();
$('#mn').innerHTML = mobileMenuHtml();
$('#bars').innerHTML = '<i></i><img class="tr-lz" src="img/luzhik/run.png?v=2" alt="">';  // переход: тёмно-зелёный экран + бегущий Лужик


/* --------------------------------------------------------------------------
   Какая страница открыта: берём из адреса. Если такой страницы нет, главная.
   -------------------------------------------------------------------------- */
const currentPage = () => {
  const hash = location.hash.replace(/^#\/?/, '');
  return PAGES[hash] ? hash : '';
};

let shownPage = null;       // страница, которая показана сейчас
let transitioning = false;  // идёт ли анимация перехода


/* Мобильное меню: открыть / закрыть */
function toggleMenu(open) {
  body.classList.toggle('mo', open);
  $('#mb').setAttribute('aria-expanded', open);
  $('#mb').textContent = open ? MENU_BUTTON.close : MENU_BUTTON.open;
  body.style.overflow = open ? 'hidden' : '';
}


/* --------------------------------------------------------------------------
   Показать страницу: подставить HTML, подсветить пункт меню,
   включить плавное появление блоков и скрипты конкретной страницы
   -------------------------------------------------------------------------- */
function render(page) {
  shownPage = page;
  app.innerHTML = PAGES[page]() + footerHtml();
  document.title = (page ? PAGE_TITLES[page] + ' — ' : '') + SITE.fullName;

  // На странице тренера в меню подсвечен пункт «Тренеры»
  const menuPage = page.startsWith('coach/') ? 'coaches' : page;
  $$('.lk, .mn a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + menuPage));
  scrollTo(0, 0);

  // Блоки с классом .rv плавно появляются, когда до них доскроллили
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: .1 });
  $$('.rv').forEach(el => observer.observe(el));

  setupCookieUi();                             // cookies.js: загрузка расписания по согласию
  insertLuzhikDividers();                      // luzhik.js: Лужик на стыках разделов

  // Скрипты отдельных страниц
  if (page === '') startBallGame();            // ball-game.js

  updateOnScroll();
}


/* --------------------------------------------------------------------------
   Переход на другую страницу: экран мягко затемняется в фирменный зелёный,
   через него пробегает Лужик с названием страницы, затем открывается новая страница.
   -------------------------------------------------------------------------- */
async function navigate() {
  const page = currentPage();
  if (transitioning || page === shownPage) return;
  toggleMenu(false);
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return render(page);

  transitioning = true;
  const cover = $('#bars i'), lz = $('#bars .tr-lz'), label = $('.wl');
  label.textContent = PAGE_TITLES[page];
  const fadeIn = cover.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards', easing: 'ease-out' });
  const run = lz.animate([{ transform: 'translateX(-60vw) translateY(0)' }, { transform: 'translateX(0) translateY(-14px)', offset: .5 },
                          { transform: 'translateX(60vw) translateY(0)' }], { duration: 1100, easing: 'ease-in-out', fill: 'forwards' });
  await fadeIn.finished;
  const labelIn = label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
  await new Promise(resolve => setTimeout(resolve, 450));
  render(page);
  await run.finished;
  const labelOut = label.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  const fadeOut = cover.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards', easing: 'ease-in' });
  await fadeOut.finished;
  [fadeIn, run, labelIn, labelOut, fadeOut].forEach(x => x.cancel());
  transitioning = false;
  if (currentPage() !== shownPage) navigate();
}


/* --------------------------------------------------------------------------
   Прокрутка: шапка получает фон, а схема слоёв «раскладывается»
   -------------------------------------------------------------------------- */
function updateOnScroll() {
  $('#hd').classList.toggle('sc', scrollY > 40);
  const stack = $('.stack');
  if (stack) {
    const top = stack.getBoundingClientRect().top;
    stack.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .95 - top) / (innerHeight * .75))));
  }
}


/* --------------------------------------------------------------------------
   Подписки на события
   -------------------------------------------------------------------------- */
addEventListener('hashchange', navigate);
addEventListener('scroll', updateOnScroll, { passive: true });
addEventListener('keydown', e => e.key === 'Escape' && toggleMenu(false));
$('#mb').onclick = () => toggleMenu(!body.classList.contains('mo'));

/* Все нажатия на кнопки с data-… (вкладки цен, выбор корта, стрелки карусели) */
document.addEventListener('click', e => {
  const target = e.target.closest('[data-tab],[data-kind],[data-court],[data-time],[data-scroll]');
  if (!target) return;
  const d = target.dataset;

  if (d.tab) {                                         // вкладки на странице «Цены»
    activePriceTab = d.tab;
    $('#prp').innerHTML = priceTabs();
  } else if (d.scroll) {                               // стрелки карусели на главной
    $('#cs').scrollBy({ left: d.scroll * 380, behavior: 'smooth' });
  } else {
    bookingClick(d);                                   // выбор вида игры, корта, времени
  }
});


/* Старт: показываем страницу, на которую пришёл посетитель */
render(currentPage());
