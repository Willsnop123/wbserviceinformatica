/* ============================================================
   WB Service — Motor de animaciones
   ============================================================ */
(function(){
  'use strict';

  // ----- Helpers -----
  const easeOut     = t => 1 - Math.pow(1 - t, 3);
  const easeOutBack = t => { const c1=1.70158, c3=c1+1; return 1 + c3*Math.pow(t-1,3) + c1*Math.pow(t-1,2); };
  const clamp       = (v,lo,hi) => Math.max(lo, Math.min(hi, v));
  const remap       = (v,lo,hi) => clamp((v-lo)/(hi-lo), 0, 1);

  // ----- Nav scroll state -----
  const nav = document.querySelector('.nav');
  function onNav(){
    if(!nav) return;
    if(window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onNav, { passive: true });
  onNav();

  // ----- Generic cinematic section: services + equipment -----
  function setupCinematic(sectionId, windows){
    const section = document.getElementById(sectionId);
    if(!section) return;
    const equips = section.querySelectorAll('.equip');
    const services = section.querySelector('.services');
    if(!services) return;
    const kicker = services.querySelector('.kicker');
    const heading = services.querySelector('h2');
    const items = services.querySelectorAll('li');

    function update(){
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = section.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);
      const stage = section.querySelector('.images');

      let landed = 0;
      equips.forEach(eq => {
        const key = eq.dataset.eq;
        const win = windows[key];
        if(!win) return;
        const local = remap(p, win[0], win[1]);
        const eased = easeOutBack(local);
        const y = (1 - eased) * 60;
        const opacity = easeOut(remap(local, 0, 0.4));
        const inner = eq.querySelector('.equip-inner');
        if(inner){
          inner.style.transform = `translateY(${y}%)`;
          inner.style.opacity = opacity.toFixed(3);
        }
        if(local > 0.9){ eq.classList.add('tag-in'); landed++; }
        else eq.classList.remove('tag-in');
      });
      if(stage){
        if(landed > 0) stage.classList.add('has-landed');
        else stage.classList.remove('has-landed');
      }
    }

    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('is-in');
        else if(e.boundingClientRect.top > 0) e.target.classList.remove('is-in');
      });
    }, { threshold: 0.25 });
    if(kicker) io.observe(kicker);
    if(heading) io.observe(heading);
    items.forEach(li => io.observe(li));

    return update;
  }

  // ----- PC: partículas tech + glow reactivo al scroll -----
  function setupPC(){
    const section = document.getElementById('pc');
    if(!section) return;
    const equips = section.querySelectorAll('.equip');
    const services = section.querySelector('.services');
    const kicker  = services && services.querySelector('.kicker');
    const heading = services && services.querySelector('h2');
    const items   = services ? services.querySelectorAll('li') : [];

    // Generar partículas tech (cyan + azul eléctrico)
    const particlesBox = section.querySelector('[data-pc-particles]');
    const gridBg       = section.querySelector('[data-pc-grid]');
    const colors = ['rgba(14,165,233,0.9)', 'rgba(56,189,248,0.8)', 'rgba(99,102,241,0.7)', 'rgba(6,182,212,0.8)'];
    if(particlesBox && !particlesBox.children.length){
      for(let i = 0; i < 28; i++){
        const pt = document.createElement('span');
        pt.className = 'pc-particle';
        const size = (1.5 + Math.random() * 3).toFixed(1) + 'px';
        pt.style.setProperty('--x',   (Math.random() * 100) + '%');
        pt.style.setProperty('--y',   (Math.random() * 100) + '%');
        pt.style.setProperty('--d',   (7 + Math.random() * 9) + 's');
        pt.style.setProperty('--del', (-Math.random() * 9) + 's');
        pt.style.setProperty('--s',   size);
        pt.style.setProperty('--col', colors[Math.floor(Math.random() * colors.length)]);
        // desplazamiento aleatorio para la animación
        pt.style.setProperty('--mx',  ((Math.random() - 0.5) * 50) + 'px');
        pt.style.setProperty('--my',  (-(10 + Math.random() * 50)) + 'px');
        particlesBox.appendChild(pt);
      }
    }

    const windows = {
      laptop: [0.00, 0.42],
      office: [0.20, 0.62],
      gamer:  [0.40, 0.82],
    };

    function update(){
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;
      const scrolled = -rect.top;
      const total    = section.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);

      // Grid background: aparece conforme se hace scroll
      if(gridBg){
        const gridP = clamp(p * 2.5, 0, 1);
        if(gridP > 0.05) gridBg.classList.add('active');
        else             gridBg.classList.remove('active');
      }

      // Partículas: opacidad global sube con el scroll
      if(particlesBox){
        const partP = clamp((p - 0.1) / 0.5, 0, 1);
        particlesBox.style.opacity = easeOut(partP).toFixed(3);
      }

      let landed = 0;
      equips.forEach(eq => {
        const key = eq.dataset.eq;
        const win = windows[key];
        if(!win) return;
        const local = remap(p, win[0], win[1]);
        const eased = easeOutBack(local);
        const y = (1 - eased) * 60;
        const opacity = easeOut(remap(local, 0, 0.4));
        // Glow reactivo: pulsa cuando el equipo está posado
        const glow = local > 0.85 ? (0.35 + Math.sin((p - win[0]) * 5) * 0.25) : 0;
        const inner = eq.querySelector('.equip-inner');
        if(inner){
          inner.style.transform = `translateY(${y}%)`;
          inner.style.opacity   = opacity.toFixed(3);
          inner.style.setProperty('--pc-glow', glow.toFixed(3));
        }
        if(local > 0.9){ eq.classList.add('tag-in'); landed++; }
        else eq.classList.remove('tag-in');
      });

      const stage = section.querySelector('.images');
      if(stage){
        if(landed > 0) stage.classList.add('has-landed');
        else           stage.classList.remove('has-landed');
      }
    }

    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('is-in');
        else if(e.boundingClientRect.top > 0) e.target.classList.remove('is-in');
      });
    }, { threshold: 0.25 });
    if(kicker) io.observe(kicker);
    if(heading) io.observe(heading);
    items.forEach(li => io.observe(li));
  }
  setupPC();

  // ----- PlayStation: levitate + tilt + glow ondulante -----
  function setupPS(){
    const section = document.getElementById('ps');
    if(!section) return;
    const equips = section.querySelectorAll('.equip');
    const aurora = section.querySelector('.ps-aurora');
    const services = section.querySelector('.services');
    const kicker = services && services.querySelector('.kicker');
    const heading = services && services.querySelector('h2');
    const items = services ? services.querySelectorAll('li') : [];

    // Generate floating particles
    const particlesBox = section.querySelector('[data-ps-particles]');
    if(particlesBox && !particlesBox.children.length){
      for(let i=0;i<24;i++){
        const p = document.createElement('span');
        p.className = 'ps-particle';
        p.style.setProperty('--x', Math.random()*100 + '%');
        p.style.setProperty('--y', Math.random()*100 + '%');
        p.style.setProperty('--d', (8 + Math.random()*10) + 's');
        p.style.setProperty('--del', (-Math.random()*10) + 's');
        p.style.setProperty('--s', (0.5 + Math.random()*1.2) + 'px');
        particlesBox.appendChild(p);
      }
    }

    // Per-equip windows: levanta, rota leve, escala
    // ps5 izquierda (aparece primero), ps4 derecha (aparece segundo)
    const windows = {
      ps5: [0.00, 0.55],
      ps4: [0.25, 0.85],
    };
    // Tilt direction per equip (positive = right, negative = left)
    const tilts = { ps5: -1, ps4: 1 };

    function update(){
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = section.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);

      // Aurora parallax
      if(aurora){
        const a = clamp(p*1.3, 0, 1);
        aurora.style.opacity = (0.45 + a*0.4).toFixed(3);
        aurora.style.transform = `translate3d(${(p-0.5)*40}px, ${(p-0.5)*30}px, 0) scale(${1 + p*0.3})`;
      }

      let landed = 0;
      equips.forEach(eq => {
        const key = eq.dataset.eq;
        const win = windows[key];
        if(!win) return;
        const local = remap(p, win[0], win[1]);
        const eased = easeOutBack(local);
        // levantar desde 110% abajo + escalar
        const y = (1 - eased) * 110;
        const scale = 0.6 + eased*0.4;
        const tiltDir = tilts[key] || 0;
        const rot = (1 - eased) * 14 * tiltDir;
        const opacity = easeOut(remap(local, 0, 0.35));
        // Glow ondulante en estado landed
        const glow = local > 0.85 ? Math.sin((p - win[0]) * 6) * 0.4 + 0.6 : 0;
        const inner = eq.querySelector('.equip-inner');
        if(inner){
          inner.style.transform = `translateY(${y}%) rotate(${rot}deg) scale(${scale})`;
          inner.style.opacity = opacity.toFixed(3);
          inner.style.setProperty('--ps-glow', glow.toFixed(3));
        }
        if(local > 0.92){ eq.classList.add('tag-in'); landed++; }
        else eq.classList.remove('tag-in');
      });

      const stage = section.querySelector('.images');
      if(stage){
        if(landed > 0) stage.classList.add('has-landed');
        else stage.classList.remove('has-landed');
      }
    }

    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking=false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('is-in');
        else if(e.boundingClientRect.top > 0) e.target.classList.remove('is-in');
      });
    }, { threshold: 0.25 });
    if(kicker) io.observe(kicker);
    if(heading) io.observe(heading);
    items.forEach(li => io.observe(li));
  }
  setupPS();

  // ----- Xbox: deslizan desde costados con snap + glitch verde -----
  function setupXbox(){
    const section = document.getElementById('xbox');
    if(!section) return;
    const equips = section.querySelectorAll('.equip');
    const pulse = section.querySelector('.xbox-pulse');
    const services = section.querySelector('.services');
    const kicker = services && services.querySelector('.kicker');
    const heading = services && services.querySelector('h2');
    const items = services ? services.querySelectorAll('li') : [];

    // Each equip enters from a side
    const sides = { seriesS: -1, seriesX: 1 }; // S desde izq, X desde der
    const windows = {
      seriesS: [0.00, 0.55],
      seriesX: [0.20, 0.80],
    };

    function update(){
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = section.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);

      // Pulse intensifies as it approaches
      if(pulse){
        pulse.style.opacity = (0.3 + p*0.5).toFixed(3);
        pulse.style.transform = `scale(${0.8 + p*0.6})`;
      }

      let landed = 0;
      equips.forEach(eq => {
        const key = eq.dataset.eq;
        const win = windows[key];
        if(!win) return;
        const local = remap(p, win[0], win[1]);
        // 2-step easing: deslizar rápido + snap final
        const slidePhase = remap(local, 0, 0.7);
        const snapPhase = remap(local, 0.7, 1);
        const slide = easeOut(slidePhase);
        const snap = easeOutBack(snapPhase);
        const sideDir = sides[key] || 0;
        // x: comienza a 130% fuera del lado, llega a 0
        const x = (1 - slide) * 130 * sideDir;
        // overshoot blur al llegar
        const blur = (1 - slidePhase) * 8;
        // pequeño rebote final
        const bounceY = snap > 0 ? Math.sin(snap * Math.PI) * -8 : 0;
        const opacity = easeOut(remap(local, 0, 0.3));
        const inner = eq.querySelector('.equip-inner');
        if(inner){
          inner.style.transform = `translate(${x}%, ${bounceY}px)`;
          inner.style.opacity = opacity.toFixed(3);
          inner.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : '';
        }
        if(local > 0.92){ eq.classList.add('tag-in'); landed++; }
        else eq.classList.remove('tag-in');
      });

      const stage = section.querySelector('.images');
      if(stage){
        if(landed > 0) stage.classList.add('has-landed');
        else stage.classList.remove('has-landed');
      }
    }

    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking=false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('is-in');
        else if(e.boundingClientRect.top > 0) e.target.classList.remove('is-in');
      });
    }, { threshold: 0.25 });
    if(kicker) io.observe(kicker);
    if(heading) io.observe(heading);
    items.forEach(li => io.observe(li));
  }
  setupXbox();

  // ----- Planes: cards en cascada con scroll -----
  function setupPlanes(){
    const section = document.getElementById('planes');
    if(!section) return;
    const head = section.querySelector('[data-plans-head]');
    const deck = section.querySelector('[data-plans-deck]');
    const foot = section.querySelector('[data-plans-foot]');
    if(!deck) return;
    const cards = deck.querySelectorAll('.plancard');

    // En mobile: mostrar todo inmediatamente, sin animación de scroll
    if(window.innerWidth <= 768){
      const showNow = el => {
        if(!el) return;
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      };
      showNow(head);
      showNow(foot);
      cards.forEach(c => { showNow(c); c.classList.add('plancard-landed'); });
      return;
    }

    function update(){
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = section.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);

      // Head: siempre visible (mínimo 15 %) y completo al 14 % de scroll
      if(head){
        const hp = remap(p, 0.00, 0.14);
        const hOpacity = 0.15 + easeOut(hp) * 0.85;
        const hY = (1 - easeOut(hp)) * 35;
        head.style.opacity = hOpacity.toFixed(3);
        head.style.transform = `translateY(${hY}px)`;
      }

      // Cards: cascada, cada una con su ventana
      cards.forEach((card, i) => {
        const start = 0.20 + i * 0.18;
        const end = start + 0.32;
        const local = remap(p, start, end);
        const eased = easeOutBack(local);
        const opacity = easeOut(remap(local, 0, 0.4));
        const y = (1 - eased) * 140;
        const rot = (1 - eased) * (i === 1 ? 0 : (i === 0 ? -3 : 3));
        const scale = 0.85 + eased * 0.15;
        card.style.opacity = opacity.toFixed(3);
        card.style.transform = `translateY(${y}px) rotate(${rot}deg) scale(${scale})`;
        if(local > 0.85) card.classList.add('plancard-landed');
        else card.classList.remove('plancard-landed');
      });

      // Foot fades in at the end
      if(foot){
        const fp = remap(p, 0.80, 0.95);
        foot.style.opacity = easeOut(fp).toFixed(3);
        foot.style.transform = `translateY(${(1 - easeOut(fp)) * 30}px)`;
      }
    }

    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking=false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  setupPlanes();

  // ----- Sobre WB: photo parallax extra -----
  function setupSobrePhoto(){
    const photo = document.querySelector('[data-sobre-photo]');
    const track = document.querySelector('.sobre-track');
    if(!photo || !track) return;
    // En mobile: foto siempre visible, sin parallax
    if(window.innerWidth <= 768){
      photo.style.opacity = '1';
      photo.style.transform = 'none';
      return;
    }
    function update(){
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = track.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);
      const eased = easeOut(remap(p, 0, 0.4));
      const y = (1 - eased) * 60;
      const scale = 0.92 + eased * 0.08;
      photo.style.transform = `translateY(${y}px) scale(${scale})`;
      photo.style.opacity = eased.toFixed(3);
    }
    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking=false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  setupSobrePhoto();

  // ----- Sobre WB: word-by-word reveal driven by scroll -----
  function setupSobre(){
    const track = document.querySelector('.sobre-track');
    if(!track) return;
    const titleWords = track.querySelectorAll('.sobre-title .word');
    const paraWords  = track.querySelectorAll('.sobre-paragraph .word');
    const stats = track.querySelector('.sobre-stats');
    const logo  = track.querySelector('.sobre-logo');

    // En mobile: mostrar todo de una vez, sin animación de scroll
    if(window.innerWidth <= 768){
      titleWords.forEach(w => w.classList.add('in'));
      paraWords.forEach(w => w.classList.add('lit'));
      if(stats) stats.classList.add('in');
      return;
    }

    function update(){
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = track.offsetHeight - vh;
      const p = clamp(scrolled / total, 0, 1);

      // Title words: reveal one by one over 0..0.35
      const tWin = remap(p, 0.0, 0.35);
      titleWords.forEach((w, i) => {
        const localStart = i / titleWords.length;
        const localEnd   = localStart + 0.5 / titleWords.length;
        const localP = remap(tWin, localStart, localEnd);
        if(localP > 0.5) w.classList.add('in');
        else w.classList.remove('in');
      });

      // Paragraph words: light up over 0.30..0.75
      const pWin = remap(p, 0.30, 0.78);
      paraWords.forEach((w, i) => {
        const localStart = i / paraWords.length;
        if(pWin >= localStart) w.classList.add('lit');
        else w.classList.remove('lit');
      });

      // Stats fade in at 0.78
      if(stats){
        if(p >= 0.80) stats.classList.add('in');
        else stats.classList.remove('in');
      }

      // Logo parallax + zoom
      if(logo){
        const scale = 0.85 + p * 0.5;
        const x = (p - 0.5) * 80;
        const y = (p - 0.5) * 40;
        const opacity = 0.05 + p * 0.18;
        logo.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        logo.style.opacity = opacity.toFixed(3);
      }
    }
    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Wrap each title and paragraph word in a <span class="word">
  function wrapWords(){
    document.querySelectorAll('[data-words]').forEach(el => {
      // Allow nested elements (e.g. .accent) — split text nodes only
      const html = el.innerHTML;
      // tokenize: split on spaces but preserve tags
      const tokens = html.split(/(\s+|<[^>]+>[^<]*<\/[^>]+>)/).filter(Boolean);
      const out = tokens.map(tok => {
        if(/^\s+$/.test(tok)) return tok;
        if(/^<.*>.*<\/.*>$/.test(tok)){
          return `<span class="word">${tok}</span>`;
        }
        return `<span class="word">${tok}</span>`;
      }).join('');
      el.innerHTML = out;
    });
  }
  wrapWords();
  setupSobre();

  // ----- Generic IntersectionObserver fade-in for elements with data-fade -----
  const fadeIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-fade]').forEach(el => fadeIO.observe(el));

  // Generic IO for kicker/heading/items inside non-cinematic sections (planes, galeria, etc)
  const sectIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('is-in');
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.planes .kicker, .planes h2, .galeria-text .kicker, .galeria-text h2, .ubic-head .kicker, .ubic-head h2, .porque-head .kicker, .porque-head h2, .porque-head p').forEach(el => sectIO.observe(el));

  // ----- Comparador antes / después -----
  (function(){
    const widget = document.querySelector('[data-compare]');
    if(!widget) return;
    const afterEl  = widget.querySelector('.cw-after');
    const divider  = widget.querySelector('.cw-divider');
    const hint     = widget.querySelector('.cw-hint');
    if(!afterEl || !divider) return;

    let pct      = 50;
    let dragging = false;
    let raf      = null;
    let prevTs   = null;
    let autoDir  = -1;   // empieza moviéndose hacia la izquierda (muestra el "antes")
    const SPEED  = 20;   // % por segundo

    function setPos(p){
      pct = Math.max(3, Math.min(97, p));
      afterEl.style.clipPath = `inset(0 ${(100 - pct).toFixed(2)}% 0 0)`;
      divider.style.left = pct + '%';
    }

    function autoStep(ts){
      if(!prevTs) prevTs = ts;
      const dt = Math.min(ts - prevTs, 50);
      prevTs = ts;
      if(!dragging){
        pct += autoDir * (dt / 1000) * SPEED;
        if(pct <= 12){ pct = 12; autoDir = 1; }
        if(pct >= 88){ pct = 88; autoDir = -1; }
        setPos(pct);
      }
      raf = requestAnimationFrame(autoStep);
    }

    function stopAuto(){ if(raf){ cancelAnimationFrame(raf); raf = null; prevTs = null; } }
    function startAuto(){ stopAuto(); raf = requestAnimationFrame(autoStep); }

    // Arranca la animación solo cuando el widget es visible
    const io = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) startAuto();
      else stopAuto();
    }, { threshold: 0.25 });
    io.observe(widget);

    // Drag / touch — dirección bloqueada para no interferir con scroll vertical
    let touchX0 = 0, touchY0 = 0, touchLocked = false;

    // Mouse (desktop)
    widget.addEventListener('mousedown', e => {
      dragging = true;
      widget.classList.add('dragging');
      stopAuto();
      if(hint) hint.classList.add('hidden');
    });
    window.addEventListener('mousemove', e => {
      if(!dragging) return;
      const rect = widget.getBoundingClientRect();
      setPos(((e.clientX - rect.left) / rect.width) * 100);
    });
    window.addEventListener('mouseup', () => {
      if(!dragging) return;
      dragging = false;
      widget.classList.remove('dragging');
      setTimeout(() => { if(!dragging) startAuto(); }, 2500);
    });

    // Touch (mobile) — detecta si el gesto es horizontal antes de tomar control
    widget.addEventListener('touchstart', e => {
      touchX0 = e.touches[0].clientX;
      touchY0 = e.touches[0].clientY;
      touchLocked = false;
      stopAuto();
    }, { passive: true });

    widget.addEventListener('touchmove', e => {
      const dx = Math.abs(e.touches[0].clientX - touchX0);
      const dy = Math.abs(e.touches[0].clientY - touchY0);
      if(!touchLocked && (dx > 8 || dy > 8)){
        touchLocked = true;
        if(dx >= dy){
          dragging = true;
          widget.classList.add('dragging');
          if(hint) hint.classList.add('hidden');
        }
      }
      if(dragging){
        e.preventDefault();
        const rect = widget.getBoundingClientRect();
        setPos(((e.touches[0].clientX - rect.left) / rect.width) * 100);
      }
    }, { passive: false });

    widget.addEventListener('touchend', () => {
      dragging = false;
      touchLocked = false;
      widget.classList.remove('dragging');
      setTimeout(() => { if(!dragging) startAuto(); }, 2500);
    }, { passive: true });

    // Oculta el hint tras 4 segundos o al primer toque
    if(hint){
      setTimeout(() => hint.classList.add('hidden'), 4000);
      widget.addEventListener('mousedown',  () => hint.classList.add('hidden'), { once: true });
      widget.addEventListener('touchstart', () => hint.classList.add('hidden'), { once: true });
    }

    setPos(50);
  })();

  // ----- Menú móvil -----
  const hamBtn    = document.getElementById('hamBtn');
  const mobMenu   = document.getElementById('mobMenu');
  const mobOverlay = document.getElementById('mobOverlay');

  function closeMobMenu() {
    if (!mobMenu) return;
    mobMenu.classList.remove('active');
    mobOverlay.classList.remove('active');
    hamBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  function openMobMenu() {
    mobMenu.classList.add('active');
    mobOverlay.classList.add('active');
    hamBtn.classList.add('active');
    document.body.classList.add('menu-open');
  }

  if (hamBtn && mobMenu) {
    hamBtn.addEventListener('click', () => {
      mobMenu.classList.contains('active') ? closeMobMenu() : openMobMenu();
    });
    // Botón X dentro del panel
    const mobClose = document.getElementById('mobClose');
    if (mobClose) mobClose.addEventListener('click', closeMobMenu);
    // Cerrar al tocar el logo dentro del menú (vuelve al inicio)
    const mobBrandLink = document.getElementById('mobBrandLink');
    if (mobBrandLink) mobBrandLink.addEventListener('click', closeMobMenu);
    // Cerrar al tocar cualquier link de navegación
    document.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', closeMobMenu);
    });
  }
  if (mobOverlay) {
    mobOverlay.addEventListener('click', closeMobMenu);
  }

  // ----- Smooth anchor links offset -----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ----- Carrusel de reseñas -----
  (function(){
    const carousel = document.querySelector('[data-carousel]');
    if(!carousel) return;

    const viewport = carousel.querySelector('.carousel-viewport');
    const track    = carousel.querySelector('.carousel-track');
    const slides   = carousel.querySelectorAll('.carousel-slide');
    const dots     = document.querySelectorAll('.carousel-dot');
    const btnPrev  = carousel.querySelector('.carousel-prev');
    const btnNext  = carousel.querySelector('.carousel-next');
    const total    = slides.length;
    const INTERVAL = 5000;

    let current = 0;
    let timer   = null;

    function setWidths(){
      const w = viewport.offsetWidth;
      slides.forEach(s => { s.style.width = w + 'px'; });
    }

    function goTo(i){
      current = ((i % total) + total) % total;
      track.style.transform = `translateX(-${current * viewport.offsetWidth}px)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    function startAuto(){ stopAuto(); timer = setInterval(() => goTo(current + 1), INTERVAL); }
    function stopAuto(){ if(timer){ clearInterval(timer); timer = null; } }

    if(btnPrev) btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if(btnNext) btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    // Pausa al hover / focus
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin',    stopAuto);
    carousel.addEventListener('focusout',   startAuto);

    // Swipe táctil
    let touchX = 0;
    carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if(Math.abs(dx) > 40){ stopAuto(); goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });

    // Resize: recalcular anchos y posición
    window.addEventListener('resize', () => { setWidths(); goTo(current); });

    setWidths();
    goTo(0);
    startAuto();
  })();

})();
