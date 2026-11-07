/* ==========================================================================
   booking.js — страница «Бронировать корт»
   Выбор вида игры, корта, даты и времени + отправка заявки.
   Тексты и список кортов лежат в content.js (раздел BOOKING).
   ========================================================================== */

/* Что сейчас выбрал посетитель (хранится, пока страница открыта) */
const booking = {
  kind: Object.keys(BOOKING.kinds)[0],           // вид игры: «Теннис»…
  court: BOOKING.kinds[Object.keys(BOOKING.kinds)[0]].courts[0],   // корт: «Корт 1»…
  time: '',                                      // время: «18:00»
  date: ''                                       // дата: «2026-10-24»
};

/* Время начала: каждый час от открытия до закрытия (SITE.openHour … SITE.closeHour) */
const timeSlots = () => Array.from({ length: SITE.closeHour - SITE.openHour }, (_, i) => (SITE.openHour + i) + ':00');

/* Сегодняшняя дата в формате ГГГГ-ММ-ДД (раньше сегодняшнего дня выбрать нельзя) */
const todayISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

/* Рисует левую часть страницы: вид игры, корты, дата, время */
function renderBookingPicker() {
  const kind = BOOKING.kinds[booking.kind];
  $('#bkp').innerHTML = `
    <h3>${BOOKING.steps[0]}</h3>
    <div class="chips" style="margin:0">${Object.keys(BOOKING.kinds).map(k => `<button class="chip ${k === booking.kind ? 'on' : ''}" data-kind="${k}">${k}</button>`).join('')}</div>

    <h3>${BOOKING.steps[1]}</h3>
    <div class="ct">${kind.courts.map((c, i) => `<button class="${c === booking.court ? 'on' : ''}" data-court="${c}">${ART[kind.art](i + 1)}<span>${c}</span></button>`).join('')}</div>

    <h3>${BOOKING.steps[2]}</h3>
    <input type="date" id="dt" value="${booking.date}" min="${todayISO()}">
    <div class="tm" style="margin-top:14px">${timeSlots().map(t => `<button class="${t === booking.time ? 'on' : ''}" data-time="${t}">${t}</button>`).join('')}</div>`;

  $('#dt').onchange = e => { booking.date = e.target.value; renderBookingSummary(); };
  renderBookingSummary();
}

/* Правая карточка: что выбрано */
function renderBookingSummary() {
  const f = BOOKING.form;
  const date = booking.date ? formatDate(booking.date) : f.noDate;
  $('#sum').innerHTML = `<small>${f.title}</small><b>${booking.kind}, ${booking.court}</b><p>${date}, ${booking.time || f.noTime}</p>`;
}

/* Нажатия на кнопки выбора. Возвращает true, если нажатие обработано. */
function bookingClick(d) {
  if (d.kind) { booking.kind = d.kind; booking.court = BOOKING.kinds[d.kind].courts[0]; }
  else if (d.court) booking.court = d.court;
  else if (d.time) booking.time = d.time;
  else return false;
  renderBookingPicker();
  return true;
}


/* --------------------------------------------------------------------------
   Отправка заявки
   Если в SITE.formEndpoint указан адрес формы (Formspree, Web3Forms и т. п.),
   заявка отправляется туда. Если адреса нет, открывается письмо на SITE.email
   с уже заполненным текстом заявки, чтобы данные не потерялись.
   -------------------------------------------------------------------------- */
async function sendRequest(data) {
  if (SITE.formEndpoint) {
    const res = await fetch(SITE.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ...SITE.formExtra, ...data })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return 'sent';
  }
  const body = `Заявка с сайта\n\n${data.kind}, ${data.court}\nДата: ${data.date}\nВремя: ${data.time}\nИмя: ${data.name}\nТелефон: ${data.phone}`;
  location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Заявка на бронирование')}&body=${encodeURIComponent(body)}`;
  return 'mail';
}

function initBookingForm() {
  const form = $('#f');
  form.onsubmit = async e => {
    e.preventDefault();
    const f = BOOKING.form;
    if (!booking.time || !booking.date) { $('#er').textContent = f.needDateTime; return; }

    const data = {
      kind: booking.kind, court: booking.court,
      date: booking.date, time: booking.time,
      name: form.elements.namedItem('name').value, phone: form.elements.namedItem('phone').value
    };
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      const how = await sendRequest(data);
      const summary = `${booking.kind}, ${booking.court}, ${formatDate(booking.date)}, ${booking.time}`;
      form.innerHTML = `<div class="ok">${f.thanks}</div><p>${summary}. ${how === 'mail' ? f.mailText : f.thanksText}</p>`;
    } catch (err) {
      button.disabled = false;
      $('#er').textContent = f.failed;
    }
  };
}

function initBooking() {
  renderBookingPicker();
  initBookingForm();
}
