/* ==========================================================================
   components.js — «кирпичики» страниц
   Небольшие функции, каждая из которых возвращает кусок HTML: шапка страницы,
   карточка цены, блок «фото + текст», список тренеров и т. д.
   Они берут тексты из content.js. Если нужно изменить внешний вид блока,
   правьте здесь (разметку) и в css/ (оформление).
   ========================================================================== */

/* Ссылка для звонка и кнопка с номером телефона */
const TEL = 'tel:' + SITE.phoneLink;
const callButton = () => `<a class="btn" href="${TEL}">${SITE.phone}</a>`;

/* Стрелка в круге (для кнопок «Все тренеры →») */
const ARROW = '<i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></i>';

/* Значок теннисного мяча (логотип и бегущая строка) */
const BALL_ICON = color => `<svg viewBox="0 0 32 32" fill="none" stroke="${color}" stroke-width="2.4"><circle cx="16" cy="16" r="13"/><path d="M5 9c8 3 8 11 0 14M27 9c-8 3-8 11 0 14"/></svg>`;

/* Значки преимуществ (HOME.why.features[].icon) */
const ICONS = {
  court:  '<path d="M3 7h26v18H3zM16 7v18M3 16h26"/>',
  layers: '<path d="M16 4l12 6-12 6-12-6zM4 16l12 6 12-6M4 22l12 6 12-6"/>',
  people: '<circle cx="16" cy="11" r="5"/><path d="M6 28c0-6 4-10 10-10s10 4 10 10"/>',
  star:   '<path d="M16 3l4 9 10 1-7.5 7 2 10L16 24l-8.5 6 2-10L2 13l10-1z"/>'
};

/* Дата в виде «24 октября» из строки «2026-10-24» */
const formatDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });


/* --------------------------------------------------------------------------
   Шапка сайта и меню
   -------------------------------------------------------------------------- */
const headerHtml = () => `<div class="wrap">
  <a class="logo" href="#/">${BALL_ICON('#cdf24a').replace('stroke-width="2.4"', 'stroke-width="1.6"')}${SITE.name}</a>
  <nav class="links" id="lk">${NAV.filter(x => !['', 'book'].includes(x[0])).map(x => `<a class="lk" href="#/${x[0]}">${x[1]}</a>`).join('')}</nav>
  <div style="display:flex;gap:10px;align-items:center">
    <a class="hb" href="#/book">${HEADER_BUTTON}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    <button id="mb" aria-expanded="false">${MENU_BUTTON.open}</button>
  </div>
</div>`;

const mobileMenuHtml = () => NAV.map((x, i) => `<a href="#/${x[0]}" style="--k:${i}">${x[1]}</a>`).join('');


/* --------------------------------------------------------------------------
   Шапка внутренней страницы: большой заголовок на фоне фото.
   theme: '' (тёмная), 'blue' (синяя), 'red' (кирпичная)
   -------------------------------------------------------------------------- */
const pageHead = (theme, label, title, text, photo) =>
  `<section class="ph ${theme}">${PX(photo, '', 'bg')}<div class="wrap"><span class="lb">${label}</span><h1>${title}</h1><p>${text}</p></div></section>`;


/* --------------------------------------------------------------------------
   Блок «фото + текст + кнопка» (страница «Услуги»)
   b — один элемент из SERVICES.blocks
   -------------------------------------------------------------------------- */
const serviceBlock = b => `<section class="${b.theme}"><div class="wrap sb ${b.reverse ? 'rev' : ''}">
  <div class="rv">${PX(b.photo, '4/3')}</div>
  <div class="rv"><span class="lb">${b.label}</span><h2>${b.title}</h2><p>${b.text}</p>
    <ul>${b.bullets.map(x => `<li>${x}</li>`).join('')}</ul>
    <div class="row"><span class="price">${b.price}</span>${b.label === 'Турниры' ? '' : `<a class="btn" href="${SITE.trainingFormUrl}" target="_blank" rel="noopener">${SERVICES.buttonBlock}</a>`}</div>
  </div>
</div></section>`;


/* --------------------------------------------------------------------------
   Карточки цен: список [название, цена, пояснение]
   -------------------------------------------------------------------------- */
const priceCards = (rows, reveal = false) =>
  `<div class="gr">${rows.map(x => `<div class="pc ${reveal ? 'rv' : ''}"><h3>${x[0]}</h3><b>${x[1]}</b><small>${x[2] || ''}</small></div>`).join('')}</div>`;

/* Вкладки на странице «Цены». activePriceTab — открытая сейчас вкладка */
let activePriceTab = Object.keys(PRICES)[0];

const priceTabs = () =>
  `<div class="chips">${Object.keys(PRICES).map(k => `<button class="chip ${k === activePriceTab ? 'on' : ''}" data-tab="${k}">${k}</button>`).join('')}</div>${priceCards(PRICES[activePriceTab])}`;

/* Частые вопросы */
const faqList = () => FAQ.map(x => `<details class="rv"><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('');


/* --------------------------------------------------------------------------
   Страница игры (падел, бадминтон): шапка + список + цены.
   g — объект PADEL или BADMINTON
   -------------------------------------------------------------------------- */
const gamePage = g =>
  pageHead(g.theme, GAME_TEXT.label, g.title, g.text, g.headPhoto) +
  `<section class="sec dk"><div class="wrap two">
    <ul class="rv" style="padding:0;margin:0;list-style:none;display:grid;gap:16px;font-size:20px">${g.bullets.map(x => `<li style="padding-left:26px;position:relative"><span style="position:absolute;left:0;top:.75em;width:12px;height:1px;background:var(--lime)"></span>${x}</li>`).join('')}</ul>
    <div class="rv ${g.sidePhoto === 'coachBadminton' ? 'badminton-coach-frame' : ''}">${PX(g.sidePhoto, g.sidePhoto === 'coachBadminton' ? '' : '4/3', g.sidePhoto === 'coachBadminton' ? 'badminton-coach-photo' : '')}</div>
  </div></section>
  <section class="sec dk2"><div class="wrap">
    <div class="mk lm"><b>₽</b>${GAME_TEXT.pricesMarker}</div>
    ${priceCards(g.prices, true)}
    <div class="row" style="margin-top:44px">${callButton()}</div>
  </div></section>`;


/* --------------------------------------------------------------------------
   Схема слоёв покрытия (страница «О клубе»)
   Число слоёв берётся из SITE.layersTotal и ABOUT.surface
   -------------------------------------------------------------------------- */
const surfaceBlock = () => {
  const s = ABOUT.surface;
  const other = SITE.layersTotal - s.ultracushion - s.cushion;
  const layers = [...Array(other).fill(''), ...Array(s.cushion).fill('c'), ...Array(s.ultracushion).fill('u')];
  return `<div class="two">
    <div class="rv"><span class="lb">${s.label}</span><h2 style="margin:16px 0 22px">${s.title}</h2>
      <p style="max-width:500px;opacity:.8">${s.text}</p>
      <ul class="leg">
        <li class="u"><i></i>ULTRACUSHION: ${s.ultracushion} ${plural(s.ultracushion)}</li>
        <li class="c"><i></i>CUSHION: ${s.cushion} ${plural(s.cushion)}</li>
        <li><i></i>${s.legendOther}: ${other}</li>
      </ul>
    </div>
    <div class="scene" aria-hidden="true"><div class="stack">${layers.map((c, i) => `<div class="ly ${c}" style="--i:${i}"></div>`).join('')}</div></div>
  </div>`;
};

/* «2 слоя», «4 слоя», «5 слоёв» */
const plural = n => (n % 10 === 1 && n % 100 !== 11) ? 'слой' : ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) ? 'слоя' : 'слоёв';


/* --------------------------------------------------------------------------
   Тренеры, шаги «Как записаться», событие
   -------------------------------------------------------------------------- */
/* Список тренеров. Каждая карточка ведёт на страницу тренера внутри сайта (#/coach/slug).
   list — какие тренеры показать (по умолчанию все). */
const coachList = (list = COACHES) => `<div class="cd">${list.map(c =>
  `<a class="rv" href="#/coach/${c.slug}"><div class="ini">${c.photo ? `<img src="${c.photo}" alt="${c.name}" onerror="this.remove()">` : c.initials}</div><div><h3>${c.name}</h3><small>${c.role}</small></div><i>→</i></a>`).join('')}</div>`;

/* Фото тренера. Если photo пустое или файл не найден, остаются инициалы. */
const coachPhoto = c =>
  `<div class="px cp-ph" style="aspect-ratio:3/4"><span>${c.initials}</span>${c.photo ? `<img src="${c.photo}" alt="${c.name}" onerror="this.remove()">` : ''}</div>`;

/* --------------------------------------------------------------------------
   Страница отдельного тренера: фото, данные, описание, кнопки и другие тренеры.
   c — один элемент из COACHES
   -------------------------------------------------------------------------- */
const coachPage = c => {
  const P = COACHES_PAGE;
  const others = COACHES.filter(x => x !== c);
  const info = c.info || [];
  const text = c.text || [];
  return `<section class="cp"><div class="wrap">
  <a class="cp-back" href="#/coaches">← ${P.backText}</a>
  <div class="cp-g">
    <div class="rv">${coachPhoto(c)}</div>
    <div class="rv">
      <span class="lb">${c.role}</span>
      <h1>${c.name}</h1>
      ${info.length ? `<dl class="cp-info">${info.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>` : ''}
      ${text.map(p => `<p class="cp-p">${p}</p>`).join('')}
      <div class="row" style="margin-top:34px"><a class="btn" href="${SITE.trainingFormUrl}" target="_blank" rel="noopener">Записаться на тренировку</a>${callButton()}</div>
    </div>
  </div>
</div></section>` + (others.length ? `
<section class="sec dk2"><div class="wrap" style="max-width:900px">
  <h2 class="rv" style="font-size:clamp(34px,4.6vw,66px)">${P.othersTitle}</h2>
  ${coachList(others)}
</div></section>` : '');
};

/* Страницы-документы: политика конфиденциальности, согласие, «Знакомьтесь, Лужик» (тексты в content.js) */
const docPage = D => `<section class="cp doc"><div class="wrap" style="max-width:860px">
  <a class="cp-back" href="#/">← ${D.back}</a>
  <span class="lb">${D.label}</span>
  <h1>${D.title}</h1>
  ${D.image ? `<img class="doc-img" src="${D.image}" alt="${D.imageAlt || ''}" width="260" height="260">` : ''}
  ${D.sections.map(s => `<h3>${s.title}</h3>${s.text.map(p => `<p>${p}</p>`).join('')}`).join('')}
</div></section>`;
const privacyPage = () => docPage(PRIVACY);
const consentPage = () => docPage(CONSENT);
const luzhikPage = () => docPage(LUZHIK_PAGE);

const stepsBlock = () => `<div class="stp">${STEPS.map((s, i) => `<div class="rv"><b>${i + 1}</b><h3>${s.title}</h3><p>${s.text}</p></div>`).join('')}</div>`;

const eventBlock = () => EVENT.show ? `<div class="ev rv"><time datetime="${EVENT.dateISO}">${EVENT.dateText}</time><div><h3 style="font-size:clamp(28px,3.4vw,46px)">${EVENT.title}</h3><p style="margin:14px 0 0;max-width:560px;opacity:.8">${EVENT.text}</p></div></div>` : '';


/* --------------------------------------------------------------------------
   Подвал сайта
   -------------------------------------------------------------------------- */
const footerHtml = () => `<footer><div class="wrap">
  <div><h3>${SITE.name}</h3><p style="opacity:.7;max-width:340px">${FOOTER.text}</p></div>
  <div>${FOOTER.links.map(x => `<a href="#/${x[0]}">${x[1]}</a>`).join('')}</div>
  <div><p>${SITE.addressFooter}</p><p>${SITE.hoursShort}</p><a href="${TEL}">${SITE.phone}</a><a href="mailto:${SITE.email}">${SITE.email}</a><a href="https://www.instagram.com/lujaika.tennis" target="_blank" rel="noopener">Instagram</a><a href="https://vk.ru/lulaika_tennis" target="_blank" rel="noopener">ВКонтакте</a></div>
  <small>${FOOTER.copyright} · <a href="${SITE.privacyUrl}" style="display:inline">${FOOTER.privacyText}</a> · <a href="#/consent" style="display:inline">Согласие на обработку данных</a> · <a href="#" style="display:inline" data-cookie-settings>${COOKIES.settings}</a></small>
</div></footer>`;
