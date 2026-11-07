/* ==========================================================================
   cookies.js — согласие на внешние сервисы и баннер
   Сайт сам cookie не ставит. Единственное, что он запоминает в браузере, —
   ваш выбор (ключ lujaika-consent: "all" или "necessary").
   Внешнее расписание go2sport.ru подгружается только после согласия
   или после нажатия кнопки «Показать расписание».
   Тексты — в content.js, раздел COOKIES.
   ========================================================================== */
const CONSENT_KEY = 'lujaika-consent';
const BOOKING_FRAME_URL = 'https://go2sport.ru/clubs/luzhayka/?i=1';

function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* браузер запретил хранение: тогда спросим снова */ } }

function loadBookingFrame() {
  const gate = document.getElementById('bk-gate');
  if (!gate) return;
  const f = document.createElement('iframe');
  f.src = BOOKING_FRAME_URL;
  f.title = COOKIES.frameTitle;
  f.setAttribute('allow', 'payment');
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  gate.replaceWith(f);
}

function showCookieBanner() {
  if (document.getElementById('ckb')) return;
  const b = document.createElement('div');
  b.id = 'ckb'; b.className = 'ckb'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookie');
  b.innerHTML = `<p>${COOKIES.text} <a href="#/privacy">${COOKIES.policy}</a></p>
    <div><button class="btn" type="button" data-ck="all">${COOKIES.accept}</button>
    <button class="btn ghost" type="button" data-ck="necessary">${COOKIES.decline}</button></div>`;
  document.body.appendChild(b);
}

document.addEventListener('click', e => {
  const ck = e.target.closest('[data-ck]');
  if (ck) { setConsent(ck.dataset.ck); document.getElementById('ckb')?.remove(); if (ck.dataset.ck === 'all') loadBookingFrame(); return; }
  if (e.target.closest('[data-load-booking]')) { loadBookingFrame(); return; }
  if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); showCookieBanner(); }
});

/* Вызывается после каждой отрисовки страницы (app.js) */
function setupCookieUi() {
  if (getConsent() === 'all') loadBookingFrame();
}

if (!getConsent()) showCookieBanner();
