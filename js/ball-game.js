/* ==========================================================================
   ball-game.js — мяч на главном экране, который можно бить

   Мяч падает, отскакивает от пола и стен. Его можно схватить и бросить
   (мышь или палец) либо ударить быстрым движением курсора.
   Внизу справа считается число ударов.

   Выключить игру совсем: в content.js поставьте BALL_GAME.enabled = false.
   Настройки физики (сила тяжести, упругость, размер) в блоке ниже.
   ========================================================================== */

function startBallGame() {
  const hero = $('.hero');
  if (!BALL_GAME.enabled || !hero) return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;    // уважаем настройку «меньше анимации»

  /* ---- Настройки ---- */
  const GRAVITY = 2200;         // сила тяжести: больше число — мяч падает быстрее
  const BOUNCE = .74;           // упругость: 1 — вечные отскоки, 0 — мяч не отскакивает
  const radius = Math.max(54, Math.min(98, innerWidth * .07));   // размер мяча (радиус в пикселях)

  /* ---- Элементы: мяч, тень, подсказка, счётчик ---- */
  const ball = document.createElement('div');
  const shadow = document.createElement('div');
  const hint = document.createElement('div');
  const counter = document.createElement('div');
  ball.className = 'pball';
  shadow.className = 'psh';
  hint.className = 'hint';
  hint.textContent = BALL_GAME.hint;
  counter.className = 'cnt';
  counter.innerHTML = `<small>${BALL_GAME.counter}</small><span>0</span>`;
  hero.append(shadow, ball, hint, counter);
  ball.style.width = ball.style.height = 2 * radius + 'px';

  /* ---- Состояние ---- */
  const floorHeight = () => hero.clientHeight - ($('.facts').offsetHeight || 60);   // пол — верх полосы с фактами
  let W = hero.clientWidth, H = floorHeight();
  let x = W * .84, y = H * .30;         // положение центра мяча
  let vx = -240, vy = 0;                // скорость
  let dragging = false, px = 0, py = 0; // перетаскивание: положение пальца/мыши
  let hits = 0, rotation = 0, cooldown = false;
  let lastTime = performance.now();

  const countHit = () => {
    hits++;
    counter.lastChild.textContent = hits;
    hint.style.opacity = 0;
  };

  const pointerPos = e => {
    const box = hero.getBoundingClientRect();
    px = e.clientX - box.left;
    py = e.clientY - box.top;
  };

  /* ---- Управление: схватить и бросить ---- */
  ball.addEventListener('pointerdown', e => {
    dragging = true;
    ball.setPointerCapture(e.pointerId);
    pointerPos(e);
    vx = vy = 0;
    e.preventDefault();
  });
  ball.addEventListener('pointermove', e => { if (dragging) pointerPos(e); });
  const release = () => { if (dragging) { dragging = false; countHit(); } };
  ball.addEventListener('pointerup', release);
  ball.addEventListener('pointercancel', release);

  /* ---- Управление: удар быстрым движением мыши ---- */
  hero.addEventListener('pointermove', e => {
    if (dragging || e.pointerType !== 'mouse' || cooldown) return;
    const box = hero.getBoundingClientRect();
    const dx = x - (e.clientX - box.left);
    const dy = y - (e.clientY - box.top);
    const dist = Math.hypot(dx, dy) || 1;
    const speed = Math.hypot(e.movementX, e.movementY);
    if (dist < radius + 16 && speed > 3) {
      const power = Math.min(1500, 380 + speed * 55);
      vx = dx / dist * power;
      vy = dy / dist * power - 220;
      countHit();
      cooldown = true;
      setTimeout(() => cooldown = false, 160);
    }
  });

  /* ---- Главный цикл: кадр за кадром двигаем мяч ---- */
  function frame(now) {
    if (!ball.isConnected) return;       // перешли на другую страницу, игра останавливается
    const dt = Math.min(.033, (now - lastTime) / 1000);
    lastTime = now;
    if (hero.getBoundingClientRect().bottom < 0) { requestAnimationFrame(frame); return; }   // экран прокручен, не считаем

    W = hero.clientWidth;
    H = floorHeight();
    let squashX = 1, squashY = 1;        // сплющивание при ударе об пол

    if (dragging) {
      const q = Math.max(dt, .008);
      vx = vx * .5 + (px - x) / q * .5;  // запоминаем скорость руки, чтобы бросок был «живым»
      vy = vy * .5 + (py - y) / q * .5;
      x = px; y = py;
    } else {
      vy += GRAVITY * dt;
      x += vx * dt;
      y += vy * dt;
      if (x < radius)     { x = radius;     vx = -vx * BOUNCE; }   // левая стена
      if (x > W - radius) { x = W - radius; vx = -vx * BOUNCE; }   // правая стена
      if (y < radius)     { y = radius;     vy = -vy * BOUNCE; }   // потолок
      if (y > H - radius) {                                         // пол
        y = H - radius;
        if (Math.abs(vy) > 260) { squashX = 1 + Math.min(.3, Math.abs(vy) / 4200); squashY = 2 - squashX; }
        vy = -vy * BOUNCE;
        vx *= .985;
        if (Math.abs(vy) < 90) vy = 0;
      }
    }

    rotation += vx * dt * .35;
    const height = Math.max(0, Math.min(1, y / (H - radius)));      // 0 — наверху, 1 — на полу
    const shadowWidth = 2 * radius * (.45 + .55 * height);

    ball.style.transform = `translate(${x - radius}px,${y - radius}px) scale(${squashX},${squashY}) rotate(${rotation}deg)`;
    shadow.style.cssText = `width:${shadowWidth}px;height:${radius * .28}px;transform:translate(${x - shadowWidth / 2}px,${H - radius * .12}px);opacity:${.15 + .3 * height}`;
    const hintX = Math.max(8, Math.min(W - hint.offsetWidth - 8, x - 70));   // подсказка не вылезает за край экрана
    hint.style.transform = `translate(${hintX}px,${y - radius - 48}px)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
