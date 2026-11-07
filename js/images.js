/* ==========================================================================
   images.js — вывод фото и запасные нарисованные картинки

   Какие фото есть на сайте и где они лежат, указано в content.js (раздел PHOTOS).
   Здесь только код, который их показывает. Обычно трогать не нужно.

   Как это работает: сначала рисуется запасная SVG-картинка (корт, ракетка…),
   поверх неё загружается настоящее фото. Если фото не загрузилось
   (нет интернета, неверный путь), остаётся нарисованная картинка и сайт
   не выглядит сломанным.
   ========================================================================== */

const ART_LINES = 'stroke="#fff" stroke-width="2.2" fill="none"';

/* Нарисованные запасные картинки. n — номер корта, он рисуется крупной цифрой. */
const ART = {
  court: (n = 0) => `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#16402c"/><rect x="30" y="34" width="340" height="232" fill="#1f4f9a"/><g ${ART_LINES}><rect x="30" y="34" width="340" height="232"/><path d="M30 63H370M30 237H370M110 63V237M290 63V237M110 150H290M200 26V274"/></g>${n ? `<text x="200" y="158" fill="#fff" opacity=".3" font-size="90" font-family="Georgia" text-anchor="middle">${n}</text>` : ''}</svg>`,

  padel: () => `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#0d1a30"/><rect x="80" y="20" width="240" height="260" rx="10" fill="#1c6aa8" stroke="#9fd0f0" stroke-width="6"/><g ${ART_LINES}><path d="M80 150H320M200 150V280M200 20V150M80 70H320M80 230H320"/></g><circle cx="250" cy="100" r="9" fill="#cdf24a"/></svg>`,

  bad: () => `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#4a1f14"/><rect x="40" y="40" width="320" height="220" fill="#9c3f2b"/><g ${ART_LINES}><rect x="40" y="40" width="320" height="220"/><path d="M40 62H360M40 238H360M200 40V260M110 62V238M290 62V238M110 150H290"/></g></svg>`,

  wall: () => `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#16231d"/><rect x="40" y="30" width="320" height="200" fill="#2f6b3a"/><path d="M40 150H360" stroke="#f4f0c8" stroke-width="3"/><circle cx="270" cy="95" r="16" fill="#cdf24a"/></svg>`,

  kids: () => `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#cdf24a"/><image href="img/luzhik/hello.png" x="120" y="40" width="160" height="220" preserveAspectRatio="xMidYMid meet"/></svg>`,

  adult: () => `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#123326"/><image href="img/luzhik/play.png" x="120" y="40" width="160" height="220" preserveAspectRatio="xMidYMid meet"/></svg>`
};


/* --------------------------------------------------------------------------
   PX(ключ, пропорции, класс) — готовый HTML фото.
     ключ        — имя из PHOTOS в content.js, например 'a1'
     пропорции   — '4/3', '3/4', '21/9'… (пусто = на всю область родителя)
     класс       — 'bg' делает фото фоном секции
   -------------------------------------------------------------------------- */
const PX = (key, ratio = '4/3', cls = '') => {
  const photo = PHOTOS[key];
  if (!photo) {
    console.warn('Нет фото с ключом «' + key + '». Проверьте раздел PHOTOS в content.js.');
    return `<div class="px ${cls}" ${ratio ? `style="aspect-ratio:${ratio}"` : ''}>${ART.court()}</div>`;
  }
  const [path, art] = photo;
  const drawn = ART[art]().replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
  // data-thumb: уменьшенная копия, если полноразмерное фото не нашлось (так устроен WordPress старого сайта)
  const src = path.startsWith('img/') ? path : `${IMG_BASE}${path}.jpg`;
  return `<div class="px ${cls}" ${ratio ? `style="aspect-ratio:${ratio}"` : ''}>${drawn}<img src="${src}" alt="" loading="lazy" decoding="async" onerror="this.remove()"></div>`;
};
