/* Rim Barnat · e-CV · app.js  (no dependencies, no network calls) */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- safe storage helpers ---------- */
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- language (EN / FR) ---------- */
  var lang = get('lang');
  if (lang !== 'en' && lang !== 'fr') {
    lang = (navigator.language || 'en').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  }
  var langBtn = document.getElementById('lang');
  function applyLang() {
    root.setAttribute('lang', lang);
    if (langBtn) langBtn.textContent = lang === 'en' ? 'FR' : 'EN';
    document.title = lang === 'fr'
      ? 'Rim Barnat – Ingénieure de recherche en IA'
      : 'Rim Barnat – AI Research Engineer';
  }
  applyLang();
  if (langBtn) langBtn.addEventListener('click', function () {
    lang = lang === 'en' ? 'fr' : 'en'; set('lang', lang); applyLang();
  });

  /* ---------- theme ---------- */
  var theme = get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  root.setAttribute('data-theme', theme);
  var themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme); set('theme', theme);
  });

  /* ---------- print ---------- */
  var printBtn = document.getElementById('print');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- count-up for key numbers ---------- */
  if (!reduce) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10), t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1200, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e);
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }

  /* ---------- 3D tilt on project cards ---------- */
  if (!reduce && window.matchMedia && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- neural-network canvas background ---------- */
  var canvas = document.getElementById('net');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var nodes = [], mouse = { x: -9999, y: -9999 }, pulses = [];
  var LINK = 150;

  function colors() {
    var cs = getComputedStyle(root);
    return { a1: cs.getPropertyValue('--a1').trim(), a2: cs.getPropertyValue('--a2').trim(), a3: cs.getPropertyValue('--a3').trim() };
  }
  var C = colors();
  if (themeBtn) themeBtn.addEventListener('click', function () { setTimeout(function () { C = colors(); }, 30); });

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(28, Math.min(90, Math.floor(W * H / 20000)));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: 1.2 + Math.random() * 1.6 });
    }
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', function () { mouse.x = mouse.y = -9999; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d, alpha;

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
      dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120 && d > 0) { a.x += dx / d * 0.9; a.y += dy / d * 0.9; }
    }

    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          alpha = (1 - d / LINK) * 0.35;
          ctx.globalAlpha = alpha; ctx.strokeStyle = C.a1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (Math.random() < 0.0004) pulses.push({ a: a, b: b, t: 0 });
        }
      }
    }

    /* signal pulses travelling along edges (like activations) */
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i]; p.t += 0.02;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      ctx.globalAlpha = 0.9; ctx.fillStyle = C.a2;
      ctx.beginPath(); ctx.arc(p.a.x + (p.b.x - p.a.x) * p.t, p.a.y + (p.b.y - p.a.y) * p.t, 2.6, 0, 6.283); ctx.fill();
    }

    /* nodes */
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.globalAlpha = 0.8; ctx.fillStyle = i % 7 === 0 ? C.a3 : C.a2;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(draw);
  }
  draw(); /* browsers pause requestAnimationFrame in hidden tabs and resume it automatically */
})();
