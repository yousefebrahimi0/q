/* GreenRah /q deck engine: navigation, notes (N), auto-advance (A), demos. */
(function () {
  'use strict';
  var TOTAL_SECONDS = 180;
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var notes = window.Q_NOTES || [];
  var icons = window.GR_ICONS || {};
  var cur = -1, autoOn = false, autoTimer = null, autoStart = 0, slideStart = 0, demoTimers = [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var bar = $('#bar'), count = $('#count'), autoBtn = $('#autoBtn'), notesEl = $('#notes');

  /* Icons */
  [].forEach.call(document.querySelectorAll('[data-icon]'), function (el) {
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[el.dataset.icon] || '') + '</svg>';
  });

  /* Durations: spoken words share of 180 s */
  var words = slides.map(function (s, i) { return notes[i] ? notes[i].text.split(/\s+/).length : 20; });
  var totalWords = words.reduce(function (a, b) { return a + b; }, 0);
  var durations = words.map(function (w) { return w / totalWords * TOTAL_SECONDS * 1000; });

  /* Fallback art when a product screenshot is not in assets/app/ yet */
  function blocksSVG(kind) {
    var g = '', i, j;
    if (kind === 'barcelona') {
      var xs = [40, 185, 330, 475, 620, 765, 910], ys = [45, 140, 235, 330, 425, 520];
      for (i = 0; i < xs.length - 1; i++) for (j = 0; j < ys.length - 1; j++) {
        var x = xs[i] + 14, y = ys[j] + 14, w = xs[i + 1] - xs[i] - 28, h = ys[j + 1] - ys[j] - 28;
        g += '<rect x="' + (x + 7) + '" y="' + (y + 9) + '" width="' + w + '" height="' + h + '" rx="16" fill="#0a1a10"/>';
        g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="16" fill="' + ((i + j) % 3 ? '#2a4f3a' : '#234331') + '"/>';
        g += '<rect x="' + (x + 18) + '" y="' + (y + 16) + '" width="' + (w - 36) + '" height="' + (h - 32) + '" rx="8" fill="#183526"/>';
      }
      g += '<path d="M60 600 L990 115" stroke="#33503d" stroke-width="26"/>';
      return '<svg class="fallback" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice"><rect width="1000" height="620" fill="#112a1b"/>' + g + '</svg>';
    }
    var seed = 7; function r() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (i = 0; i < 70; i++) {
      var bx = r() * 1000, by = r() * 470, bw = 40 + r() * 90, bh = 30 + r() * 70, rot = (r() - .5) * 40;
      g += '<g transform="rotate(' + rot.toFixed(1) + ' ' + bx.toFixed(0) + ' ' + by.toFixed(0) + ')"><rect x="' + (bx + 6).toFixed(0) + '" y="' + (by + 10).toFixed(0) + '" width="' + bw.toFixed(0) + '" height="' + bh.toFixed(0) + '" rx="6" fill="#0a1a10"/>' +
        '<rect x="' + bx.toFixed(0) + '" y="' + by.toFixed(0) + '" width="' + bw.toFixed(0) + '" height="' + bh.toFixed(0) + '" rx="6" fill="' + (i % 4 ? '#2a4f3a' : '#3a5f47') + '"/></g>';
    }
    return '<svg class="fallback" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice"><rect width="1000" height="620" fill="#112a1b"/>' + g +
      '<path d="M0 560 C 300 520, 600 600, 1000 540 L1000 620 L0 620Z" fill="#10242a"/></svg>';
  }
  [].forEach.call(document.querySelectorAll('img[data-fallback]'), function (img) {
    function fb() { img.insertAdjacentHTML('afterend', blocksSVG(img.dataset.fallback)); img.remove(); }
    if (img.complete && !img.naturalWidth) fb(); else img.addEventListener('error', fb);
  });

  /* Count-up numbers */
  function countUp(slide) {
    [].forEach.call(slide.querySelectorAll('.count'), function (el) {
      var to = +el.dataset.to, suf = el.dataset.suffix || '', t0 = performance.now(), d = 1400;
      (function step(t) {
        var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e).toLocaleString('en-GB') + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* Accessible demo: Heat smart -> Accessible -> press Find gentle walk -> result */
  function placeFinger(sec, target) {
    var screen = $('.screen', sec), f = $('.finger', sec), el = $(target, sec);
    if (!screen || !el) return;
    var a = screen.getBoundingClientRect(), b = el.getBoundingClientRect();
    f.style.left = (b.left - a.left + b.width / 2 - 17) + 'px';
    f.style.top = (b.top - a.top + b.height / 2 - 17) + 'px';
  }
  function tap(sec) { var f = $('.finger', sec); f.classList.remove('tap'); void f.offsetWidth; f.classList.add('tap'); setTimeout(function () { f.classList.remove('tap'); }, 300); }
  function runAccessDemo(sec) {
    clearDemo(); sec.removeAttribute('data-step');
    var f = $('.finger', sec); f.style.left = '30%'; f.style.top = '85%';
    var plan = [
      [900, function () { sec.dataset.step = 1; placeFinger(sec, '.o2'); }],
      [1900, function () { tap(sec); sec.dataset.step = 2; }],
      [3300, function () { sec.dataset.step = 3; placeFinger(sec, '.go'); }],
      [4400, function () { tap(sec); sec.dataset.step = 4; }],
      [5600, function () { sec.dataset.step = 5; }]
    ];
    plan.forEach(function (p) { demoTimers.push(setTimeout(p[1], p[0])); });
  }
  function clearDemo() { demoTimers.forEach(clearTimeout); demoTimers = []; }

  /* Navigation */
  function go(n, fromAuto) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === cur) return;
    clearDemo();
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === n);
      s.classList.toggle('past', i < n);
      if (i !== n) s.removeAttribute('data-step');
      s.setAttribute('aria-hidden', i === n ? 'false' : 'true');
    });
    // restart CSS animations on re-entry
    var s = slides[n]; s.classList.remove('active'); void s.offsetWidth; s.classList.add('active');
    cur = n; slideStart = performance.now();
    count.textContent = (n + 1) + ' / ' + slides.length;
    bar.style.width = ((n + 1) / slides.length * 100) + '%';
    if (location.hash !== '#/' + (n + 1)) history.replaceState(null, '', '#/' + (n + 1));
    countUp(s);
    if (s.dataset.id === 'accessible') runAccessDemo(s);
    renderNotes();
    if (autoOn && !fromAuto) scheduleAuto();
    if (autoOn && fromAuto) scheduleAuto();
  }
  function next() { go(cur + 1); }
  function prev() { go(cur - 1); }

  /* Notes (N) */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderNotes() {
    var n = notes[cur] || { text: '', src: [] };
    $('#noteText').textContent = n.text;
    $('#noteMeta').textContent = 'Slide ' + (cur + 1) + ' of ' + slides.length + ' · ' + words[cur] + ' words · about ' + Math.round(durations[cur] / 1000) + ' s';
    $('#noteSrc').innerHTML = (n.src || []).map(function (x) { return '<li>' + esc(x[0]) + ' <a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[1]) + '</a></li>'; }).join('');
  }
  function toggleNotes() { notesEl.hidden = !notesEl.hidden; }

  /* Auto-advance (A): about 3 minutes in total */
  function fmt(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function scheduleAuto() {
    clearTimeout(autoTimer);
    var wait = durations[cur];
    autoTimer = setTimeout(function () {
      if (cur < slides.length - 1) go(cur + 1, true); else stopAuto();
    }, wait);
  }
  function startAuto() {
    autoOn = true; autoBtn.setAttribute('aria-pressed', 'true');
    var remaining = durations.slice(cur).reduce(function (a, b) { return a + b; }, 0);
    autoStart = performance.now() - (TOTAL_SECONDS * 1000 - remaining);
    slideStart = performance.now(); scheduleAuto(); tick();
  }
  function stopAuto() { autoOn = false; clearTimeout(autoTimer); autoBtn.setAttribute('aria-pressed', 'false'); autoBtn.textContent = '▶ 3:00'; }
  function tick() {
    if (!autoOn) return;
    var left = TOTAL_SECONDS * 1000 - (performance.now() - autoStart);
    autoBtn.textContent = '❚❚ ' + fmt(left);
    requestAnimationFrame(function () { setTimeout(tick, 250); });
  }
  function toggleAuto() { autoOn ? stopAuto() : startAuto(); }

  function full() {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else document.exitFullscreen();
  }

  /* Input */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'n' || k === 'N') toggleNotes();
    else if (k === 'a' || k === 'A') toggleAuto();
    else if (k === 'f' || k === 'F') full();
    else if (k === 'r' || k === 'R') { var s = slides[cur]; if (s.dataset.id === 'accessible') runAccessDemo(s); else { cur = -1; go(slides.indexOf(s)); } }
    else if (k === '?' || k === 'h' || k === 'H') $('#help').hidden = !$('#help').hidden;
    else if (k === 'Escape') { notesEl.hidden = true; $('#help').hidden = true; }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act],[data-replay]');
    if (!b) return;
    if (b.hasAttribute('data-replay')) return runAccessDemo(slides[cur]);
    ({ prev: prev, next: next, auto: toggleAuto, notes: toggleNotes, full: full })[b.dataset.act]();
  });
  var tx = null, ty = null;
  document.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? next() : prev(); }
    tx = null;
  }, { passive: true });
  var idle; document.addEventListener('mousemove', function () { document.body.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(function () { document.body.classList.add('idle'); }, 2500); });
  window.addEventListener('hashchange', function () { var m = location.hash.match(/#\/(\d+)/); if (m) go(+m[1] - 1); });

  /* QR to the web app (UTM tagged like /g) */
  try {
    var qr = window.qrcode(0, 'M'); qr.addData('mailto:contact@greenrah.com?subject=GreenRah%20pilot'); qr.make();
    $('#qr').innerHTML = qr.createSvgTag(6, 0, 'QR code to email contact@greenrah.com');
  } catch (err) { /* QR is optional */ }

  /* Path tracing helper: open with ?trace, click on a demo image, copy the path from the console */
  if (/[?&]trace\b/.test(location.search)) {
    var pts = [];
    document.addEventListener('click', function (e) {
      var kb = e.target.closest('.kb'); if (!kb) return;
      var svg = kb.querySelector('svg.overlay');
      var vb = svg && svg.viewBox.baseVal.width ? svg.viewBox.baseVal : { width: 1000, height: 620 };
      var r = kb.getBoundingClientRect();
      pts.push(Math.round((e.clientX - r.left) / r.width * vb.width) + ' ' + Math.round((e.clientY - r.top) / r.height * vb.height));
      console.log('d="M ' + pts.join(' L ') + '"');
    });
  }

  var m = location.hash.match(/#\/(\d+)/);
  go(m ? +m[1] - 1 : 0);
  if (/[?&]auto\b/.test(location.search)) startAuto();
})();
