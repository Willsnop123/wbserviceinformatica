/* ============================================================
   WB Service — Galería de trabajos
   ============================================================ */
window.__galeriaInit = function(signal){
  'use strict';

  // Mismo criterio que wb-script.js: con navegacion sin recarga esto corre de
  // nuevo por pagina, asi que todo lo registrado se da de baja con la señal.
  function on(target, ev, fn, opts){
    target.addEventListener(ev, fn, typeof opts === 'object' ? { ...opts, signal } : { signal });
  }
  function newIO(cb, opts){
    const io = new IntersectionObserver(cb, opts);
    signal.addEventListener('abort', () => io.disconnect(), { once: true });
    return io;
  }
  const _timers = new Set();
  const setInterval = (fn, ms) => { const id = window.setInterval(fn, ms); _timers.add(id); return id; };
  signal.addEventListener('abort', () => {
    _timers.forEach(id => window.clearInterval(id));
    _timers.clear();
  }, { once: true });

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    document.querySelectorAll('.hero-stat-n[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 1400;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + Math.floor(current) + suffix;
        if (current >= target) {
          el.textContent = prefix + target + suffix;
          clearInterval(timer);
        }
      }, 16);
    });
  }
  // Trigger when hero is visible
  const heroObs = newIO(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObs.disconnect(); } });
  }, { threshold: 0.3 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObs.observe(heroStats);

  // ===== DATOS DE TRABAJOS =====
  const trabajos = [
    {
      titulo: "PS4 — Limpieza completa y pasta térmica",
      resultado: "Temperatura bajó de 85°C a 68°C",
      antes:   "/imagenes/ps4-antes.webp",
      despues: "/imagenes/ps4-despues.webp",
      cat: "playstation"
    },
    {
      titulo: "PC Gamer — Mantenimiento completo",
      resultado: "Limpieza de componentes y nueva pasta térmica",
      antes:   "/imagenes/pc-antes.webp",
      despues: "/imagenes/pc-despues.webp",
      cat: "pc"
    },
    {
      titulo: "Joystick PS5 — Reparación de drift",
      resultado: "Cambio de potenciómetros y calibración",
      antes:   "/imagenes/joystick-antes.webp",
      despues: "/imagenes/joystick-despues.webp",
      cat: "joystick"
    },
    {
      titulo: "PS3 — Limpieza y mantenimiento",
      resultado: "Prevención de fallos por calor",
      antes:   "/imagenes/ps3-antes.webp",
      despues: "/imagenes/ps3-despues.webp",
      cat: "playstation"
    },
    {
      titulo: "Xbox One — Mantenimiento preventivo",
      resultado: "Limpieza interna y cambio de pasta térmica",
      antes:   "/imagenes/xbox-antes.webp",
      despues: "/imagenes/xbox-despues.webp",
      cat: "xbox"
    }
  ];

  // ===== LIGHTBOX =====
  let lbActual = 0;
  let isDragging = false;

  function abrirLightbox(index) {
    lbActual = index;
    renderLightbox();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Esperar un frame para que el modal sea visible y tenga dimensiones reales
    requestAnimationFrame(() => {
      updateLbWidth();
      resetSlider();
    });
  }

  function cerrarLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }

  function cerrarLightboxClick(e) {
    if (e.target === document.getElementById('lightbox')) cerrarLightbox();
  }

  function renderLightbox() {
    const t = trabajos[lbActual];
    document.getElementById('lb-titulo').textContent    = t.titulo;
    document.querySelector('#lb-subtitulo span').textContent = t.resultado;
    document.getElementById('lb-img-antes').src   = t.antes;
    document.getElementById('lb-img-despues').src = t.despues;

    // dots
    const dotsEl = document.getElementById('lb-dots');
    dotsEl.innerHTML = trabajos.map((_, i) =>
      `<span class="lb-dot ${i === lbActual ? 'active' : ''}" onclick="irALb(${i})"></span>`
    ).join('');

    resetSlider();
  }

  function navegarLb(dir) {
    lbActual = (lbActual + dir + trabajos.length) % trabajos.length;
    renderLightbox();
  }

  function irALb(index) {
    lbActual = index;
    renderLightbox();
  }

  // ===== SLIDER DRAG =====
  function resetSlider() {
    const container = document.getElementById('lb-comparacion');
    const slider    = document.getElementById('lb-slider');
    const antes     = document.getElementById('lb-antes');
    const despues   = document.getElementById('lb-despues');
    slider.style.left   = '50%';
    antes.style.width   = '50%';
    despues.style.width = '50%';
    // Sincronizar el ancho real del contenedor para que las imágenes se vean completas
    updateLbWidth();
  }

  function updateLbWidth() {
    const container = document.getElementById('lb-comparacion');
    if (!container) return;
    const w = container.getBoundingClientRect().width;
    container.style.setProperty('--lb-width', w + 'px');
  }

  function initSlider() {
    const container = document.getElementById('lb-comparacion');
    const slider    = document.getElementById('lb-slider');
    const antes     = document.getElementById('lb-antes');
    const despues   = document.getElementById('lb-despues');

    // Actualizar ancho al redimensionar
    on(window, 'resize', updateLbWidth);

    function mover(clientX) {
      const rect = container.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.max(0.05, Math.min(0.95, pct));
      slider.style.left     = (pct * 100) + '%';
      antes.style.width     = (pct * 100) + '%';
      despues.style.width   = ((1 - pct) * 100) + '%';
    }

    slider.addEventListener('mousedown',  e => { isDragging = true; e.preventDefault(); });
    on(window, 'mousemove',  e => { if (isDragging) mover(e.clientX); });
    on(window, 'mouseup',    ()  => { isDragging = false; });

    slider.addEventListener('touchstart', e => { isDragging = true; e.preventDefault(); }, { passive: false });
    on(window, 'touchmove',  e => { if (isDragging) mover(e.touches[0].clientX); }, { passive: true });
    on(window, 'touchend',   ()  => { isDragging = false; });
  }
  initSlider();

  // ===== FILTROS =====
  function filtrar(cat, btn) {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.trabajo-card');
    let visibles = 0;
    cards.forEach(card => {
      if (cat === 'todos' || card.dataset.cat === cat) {
        card.classList.remove('hidden');
        visibles++;
      } else {
        card.classList.add('hidden');
      }
    });

    const empty = document.getElementById('empty-state');
    empty.classList.toggle('visible', visibles === 0);
  }

  // Teclado
  on(document, 'keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'ArrowRight') navegarLb(1);
    if (e.key === 'ArrowLeft')  navegarLb(-1);
    if (e.key === 'Escape')     cerrarLightbox();
  });

};
