/* ==========================================================================
   pages.js — СБОРКА СТРАНИЦ
   Здесь описано, из каких блоков состоит каждая страница и в каком порядке.
   Сами тексты лежат в content.js, а мелкие детали (карточки, шапка, подвал)
   собираются в components.js.

   КАК ПОМЕНЯТЬ БЛОКИ МЕСТАМИ: найдите нужный блок (он начинается с комментария
   <!-- ===== Название ===== -->) и перенесите его целиком от <section
   до </section> выше или ниже. Чтобы убрать блок, удалите его целиком.

   Адрес страницы в браузере = ключ ниже:
     ''          → сайт.ru/#/            (главная)
     'services'  → сайт.ru/#/services
     и так далее, как в NAV из content.js.
   Страницы тренеров (#/coach/…) и страница политики конфиденциальности (#/privacy)
   добавляются в самом конце файла, их не нужно описывать здесь.
   ========================================================================== */

const PAGES = {

  /* ======================================================================
     ГЛАВНАЯ
     ====================================================================== */
  '': () => `

<!-- ===== Главный экран: видео, заголовок, кнопки, мяч ===== -->
<section class="hero">
  <svg class="bga" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">${ART.court().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>
  ${HERO_VIDEO ? `<video class="hero-video" autoplay muted loop playsinline preload="auto" poster="img/hero-poster.jpg?v=2" src="${HERO_VIDEO}" onloadeddata="this.classList.add('is-ready')" onerror="this.remove()"></video>` : ''}
  <div class="ov"></div>
  <svg class="badge" viewBox="0 0 150 150" aria-hidden="true">
    <defs><path id="cb" d="M75 75m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0"/></defs>
    <text><textPath href="#cb">${HOME.badge}</textPath></text>
    <circle cx="75" cy="75" r="26" fill="#cdf24a"/>
    <path d="M53 64c16 7 16 29 0 36M97 64c-16 7-16 29 0 36" stroke="#fff" stroke-width="3.4" fill="none"/>
  </svg>
  <div class="side">${HOME.sideWords.map(w => `<span>${w}</span>`).join('')}</div>
  <div class="wrap" style="width:100%;position:relative;z-index:3">
    <span class="lb" style="--delay:.3s">${HOME.eyebrow}</span>
    <h1>${HOME.title.map((t, i) => `<span class="ln ${i === HOME.title.length - 1 ? 'lm' : ''}"><span style="--delay:${(0.4 + i * 0.15).toFixed(2)}s">${t}</span></span>`).join('')}</h1>
    <p class="sub" style="--delay:1.2s">${HOME.subtitle}</p>
    <div class="cta" style="--delay:1.5s">
      <a class="btn" href="#/book">${HOME.buttonBook}</a>
      <a class="bt" href="#/prices">${ARROW}${HOME.buttonPrices}</a>
    </div>
  </div>
  <img class="hero-lz" src="img/luzhik/hello.png" alt="Лужик машет рукой" width="260" height="260">
  <div class="facts"><div class="wrap">
    ${HOME.facts.map(f => `<span>${f}</span>`).join('')}
    <a href="${TEL}">${SITE.phone}</a>
  </div></div>
</section>

<!-- ===== Бегущая строка ===== -->
<div class="tk" aria-hidden="true"><div>${HOME.ticker.map(w => `<span>${w}</span>${BALL_ICON('#0a1410')}`).join('').repeat(4)}</div></div>

<!-- ===== Салатовый блок: «Почему Лужайка» и 4 преимущества ===== -->
<section class="sec lime"><div class="wrap fx">
  <div class="rv">
    <span class="lb">${HOME.why.label}</span>
    <h2 style="margin:16px 0 28px">${HOME.why.titleStart}<span class="lm">${HOME.why.titleAccent}</span></h2>
    <div class="band"><div class="ball3"></div></div>
  </div>
  <div class="ft">${HOME.why.features.map(f => `<div class="rv"><svg viewBox="0 0 32 32">${ICONS[f.icon]}</svg><h3>${f.title}</h3><p>${f.text}</p></div>`).join('')}</div>
</div></section>

<!-- ===== Ретро-блок: «Теннис» и «Цены» ===== -->
<section class="rt">
  <div class="g"><h2>${HOME.retro.green}</h2></div>
  <i class="l"></i><i class="rb"></i>
  <div class="b">
    <h2>${HOME.retro.brick}</h2>
    <div class="pl">${HOME.retro.rows.map(r => `<a href="#/${r.to}"><b>${num(r.price)}</b>${r.text}</a>`).join('')}</div>
    <a class="btn" href="#/prices">${HOME.retro.button}</a>
  </div>
</section>

<!-- ===== Синий блок «Теннис для всех» ===== -->
<section class="bl"><div class="wrap">
  <h2 class="rv">${HOME.blue.title.join('<br>')}</h2>
  <div class="rv" style="position:relative">${PX(HOME.blue.photo, '21/9')}<div class="gl">${HOME.blue.caption}</div></div>
</div></section>

<!-- ===== Светлый блок «О клубе» ===== -->
<section class="sec lt"><div class="wrap">
  <div class="mk"><b>A</b>${HOME.about.marker}</div>
  <div class="ab">
    <h2 class="rv">${HOME.about.title}</h2>
    <p class="rv">${HOME.about.text1}</p>
    <div class="rv"><p style="margin-bottom:22px">${HOME.about.text2}</p><a class="btn" href="#/about">${HOME.about.button}</a></div>
  </div>
  <div class="st">
    <div class="big rv">${PX(HOME.about.photoBig, '4/3')}<div class="stt">${HOME.about.stats.map(s => `<div><b>${s.n}</b>${s.t}</div>`).join('')}</div></div>
    <div class="rv" style="display:grid;gap:20px;align-content:space-between">
      ${PX(HOME.about.photoSmall, '4/3')}
      <div>
        <div class="num">${HOME.about.bigNumber}<span>${HOME.about.bigNumberCaption}</span></div>
        <ul class="ul">${HOME.about.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
  </div>
</div></section>

<!-- ===== Карусель программ ===== -->
<section class="sec lt" style="padding-top:0"><div class="wrap">
  <div class="mk"><b>B</b>${HOME.programs.marker}</div>
  <div class="ch">
    <h2 class="rv">${HOME.programs.title}</h2>
    <div class="ar"><button data-scroll="-1" aria-label="Назад">←</button><button data-scroll="1" aria-label="Вперёд">→</button></div>
  </div>
  <div class="cs" id="cs">${HOME.programs.items.map(p => `<a class="pg" href="#/${p.to}">${PX(p.photo, '3/4')}<h3>${p.title}</h3><small>${p.caption}</small></a>`).join('')}</div>
</div></section>

<!-- ===== Галерея «Корты, люди, игра» ===== -->
<section class="sec dk2"><div class="wrap">
  <div class="ch"><div><span class="lb">${HOME.life.label}</span><h2 style="margin-top:16px" class="rv">${HOME.life.title}</h2></div></div>
  <div class="gg">${HOME.life.items.map(x => `<div class="gt rv">${PX(x[0], '3/4')}<b>${x[1]}</b></div>`).join('')}</div>
</div></section>

<!-- ===== Тренеры ===== -->
<section class="sec grn"><div class="wrap pp">
  <div>
    <span class="lb">${HOME.coaches.label}</span>
    <h2 style="margin-top:16px" class="rv">${HOME.coaches.title}<span class="lm">${HOME.coaches.titleAccent}</span></h2>
    <p style="margin-top:20px;opacity:.8;max-width:460px">${HOME.coaches.text}</p>
    ${coachList()}
    <a class="bt" href="#/coaches">${ARROW}${HOME.coaches.button}</a>
  </div>
  <div class="rv">${PX(HOME.coaches.photo, '4/5')}</div>
</div></section>

<!-- ===== Финальный призыв ===== -->
<section class="cta2">
  <div class="ball3" aria-hidden="true"></div>
  <img class="cta-lz" src="img/luzhik/book.png" alt="Лужик: бронирую корт" width="260" height="260" loading="lazy">
  <div class="wrap">
    <span class="lb">${HOME.cta.label}</span>
    <h2 class="rv">${HOME.cta.title}<span class="lm">${HOME.cta.titleAccent}</span></h2>
    <div class="cta">
      <a class="btn" href="#/book">${HOME.cta.button}</a>
      <a class="bt" href="${TEL}">${ARROW}${SITE.phone}</a>
    </div>
  </div>
</section>`,


  /* ======================================================================
     УСЛУГИ
     ====================================================================== */
  services: () =>
    pageHead('', SERVICES.head.label, SERVICES.head.title, SERVICES.head.text, SERVICES.head.photo) +
    SERVICES.blocks.map(serviceBlock).join('') + `

<!-- ===== Как записаться ===== -->
<section class="sec dk2"><div class="wrap">
  <h2 class="rv" style="margin-bottom:44px">${SERVICES.stepsTitle}</h2>
  ${stepsBlock()}
  <div class="row" style="margin-top:50px">
    <a class="btn" href="${SITE.trainingFormUrl}" target="_blank" rel="noopener">Записаться на тренировку</a>
    <a class="bt" href="#/prices">${ARROW}${SERVICES.stepsButtons.prices}</a>
  </div>
</div></section>`,


  /* ======================================================================
     ПАДЕЛ и БАДМИНТОН (одинаковая вёрстка, разные тексты)
     ====================================================================== */
  padel: () => gamePage(PADEL),
  badminton: () => gamePage(BADMINTON),


  /* ======================================================================
     ЦЕНЫ
     ====================================================================== */
  prices: () =>
    pageHead('', PRICES_PAGE.label, PRICES_PAGE.title, PRICES_PAGE.text, PRICES_PAGE.photo) + `

<!-- ===== Прайс с вкладками ===== -->
<section class="sec dk"><div class="wrap" id="prp">${priceTabs()}</div></section>

<!-- ===== Частые вопросы ===== -->
<section class="sec lt"><div class="wrap">
  <h2 class="rv" style="margin-bottom:34px">${PRICES_PAGE.faqTitle}</h2>
  ${faqList()}
  <div class="row" style="margin-top:44px"><a class="btn" href="#/book">${HOME.buttonBook}</a>${callButton()}</div>
</div></section>`,


  /* ======================================================================
     О КЛУБЕ
     ====================================================================== */
  about: () =>
    pageHead('', ABOUT.head.label, ABOUT.head.title, ABOUT.head.text, ABOUT.head.photo) + `

<!-- ===== История по годам ===== -->
<section class="sec dk"><div class="wrap">
  ${ABOUT.timeline.map(t => `<div class="yr rv"><h2>${t.year}</h2><p>${t.text}</p></div>`).join('')}
</div></section>

<!-- ===== Покрытие: схема слоёв ===== -->
<section class="sec dk2"><div class="wrap">${surfaceBlock()}</div></section>

<!-- ===== Два коротких блока ===== -->
<section class="sec lt"><div class="wrap two" style="align-items:start">
  ${ABOUT.twoBlocks.map(b => `<div class="rv"><h3 style="font-size:36px">${b.title}</h3><p style="margin-top:12px;max-width:460px;opacity:.8">${b.text}</p></div>`).join('')}
</div></section>
` + (EVENT.show ? `
<!-- ===== Событие ===== -->
<section class="sec dk"><div class="wrap">${eventBlock()}</div></section>` : ''),


  /* ======================================================================
     ТРЕНЕРЫ
     ====================================================================== */
  coaches: () =>
    pageHead(COACHES_PAGE.theme, COACHES_PAGE.label, COACHES_PAGE.title, COACHES_PAGE.text, COACHES_PAGE.photo) + `

<section class="sec dk"><div class="wrap" style="max-width:900px">
  ${coachList()}
  <p class="rv" style="margin:50px 0 26px;opacity:.8">${COACHES_PAGE.note}</p>
  <a class="btn" href="${SITE.trainingFormUrl}" target="_blank" rel="noopener">Записаться на тренировку</a>
</div></section>`,


  /* ======================================================================
     БРОНИРОВАНИЕ
     Левая часть (#bkp) и сводка (#sum) наполняются скриптом из booking.js.
     ====================================================================== */
  book: () =>
    pageHead('', BOOKING.head.label, BOOKING.head.title, BOOKING.head.text, BOOKING.head.photo) + `

<section class="sec dk"><div class="wrap">
  <div class="booking-intro">
    <span class="lb">ОНЛАЙН-БРОНИРОВАНИЕ</span>
    <h2>Выберите корт и свободное время</h2>
    <p>Выберите вид игры, дату и свободный интервал в расписании. Шаги времени — 30 минут. Бронирование оформляется в системе клуба.</p>
  </div>
  <div class="booking-frame">
    <div id="bk-gate" class="bk-gate"><p>${COOKIES.frameText}</p><button class="btn" type="button" data-load-booking>${COOKIES.frameButton}</button></div>
  </div>
</div></section>`,


  /* ======================================================================
     КОНТАКТЫ
     ====================================================================== */
  contacts: () =>
    pageHead(CONTACTS.theme, CONTACTS.label, CONTACTS.title, CONTACTS.text, CONTACTS.photo) + `

<section class="sec dk"><div class="wrap">
  <div class="info">
    <div class="rv"><small>${CONTACTS.labels.address}</small><b>${SITE.address}</b></div>
    <div class="rv"><small>${CONTACTS.labels.hours}</small><b>${SITE.hours}</b></div>
    <a class="rv" href="${TEL}"><small>${CONTACTS.labels.phone}</small><b>${SITE.phone}</b></a>
    <a class="rv" href="mailto:${SITE.email}"><small>${CONTACTS.labels.email}</small><b>${SITE.email}</b></a>
  </div>
  <div class="row" style="margin-top:44px">
    <a class="btn" href="https://yandex.ru/maps/?text=${encodeURIComponent(SITE.mapSearch)}">${CONTACTS.routeButton}</a>
    <a class="bt" href="${SITE.feedbackFormUrl}" target="_blank" rel="noopener">${ARROW}Обратная связь</a>
    <a class="bt" href="#/book">${ARROW}${CONTACTS.bookButton}</a>
  </div>
</div></section>`
};


/* Страница каждого тренера создаётся сама из списка COACHES (content.js):
   адрес #/coach/ + slug тренера. Чтобы добавить тренера, правьте только content.js. */
COACHES.forEach(c => { PAGES['coach/' + c.slug] = () => coachPage(c); });

/* Политика конфиденциальности: ссылка на неё в подвале и в форме бронирования */
PAGES.privacy = privacyPage;
PAGES.consent = consentPage;
PAGES.luzhik = luzhikPage;
