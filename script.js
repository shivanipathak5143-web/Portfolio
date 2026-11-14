(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* loader */
  var loader = $('#loader'), count = $('#count'), hero = $('#hero');
  var t0 = performance.now(), dur = reduce ? 10 : 1400;
  function tick(now) {
    var n = Math.min(100, Math.round((now - t0) / dur * 100));
    count.textContent = n;
    if (n < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(function () {
        loader.classList.add('up');
        hero.classList.add('go');
      }, 180);
    }
  }
  requestAnimationFrame(tick);
  window.scrollTo(0, 0);

  /* tool chips get a stagger index */
  $$('.chips').forEach(function (group) {
    $$('.chip', group).forEach(function (chip, i) { chip.style.setProperty('--i', i); });
  });

  /* scroll reveal */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 70 + 'ms';
    io.observe(el);
  });


  /* scroll-scrubbed statement: words darken as you scroll through it */
  var sayT = $('#sayT');
  if (sayT) {
    var words = sayT.textContent.trim().split(/\s+/);
    sayT.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var ws = $$('.w', sayT);
    var paint = function () {
      var r = sayT.getBoundingClientRect(), vh = window.innerHeight;
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(p * ws.length);
      ws.forEach(function (el, i) { el.classList.toggle('on', i < n); });
    };
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }


  /* hero network graph */
  (function () {
    var cv = $('#net');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    var names = ['Python', 'FastAPI', 'scikit-learn', 'YOLOv8', 'React', 'Docker', 'AWS', 'MLflow', 'OpenCV', 'MongoDB', 'Groq', 'NetworkX'];
    var nodes = [], W = 0, H = 0, dpr = 1, mx = -999, my = -999, running = false, visible = true;
    var COUNT = 28, LINK = 150;

    function size() {
      var nw = cv.clientWidth, nh = cv.clientHeight;
      if (!nw || !nh) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = nw * dpr; cv.height = nh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length && W) {
        nodes.forEach(function (n) { n.x *= nw / W; n.y *= nh / H; });
      }
      W = nw; H = nh;
      if (!nodes.length) init();
    }
    function init() {
      for (var i = 0; i < COUNT; i++) {
        var lab = i < names.length ? names[i] : null;
        var a = Math.random() * Math.PI * 2, s = 0.12 + Math.random() * 0.22;
        nodes.push({
          x: 30 + Math.random() * (W - 160), y: 20 + Math.random() * (H - 40),
          vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: lab ? 4.5 : 2.5, label: lab
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(17,17,17,' + ((1 - d / LINK) * 0.3).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        dx = a.x - mx; dy = a.y - my; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 170) {
          ctx.strokeStyle = 'rgba(43,75,255,' + ((1 - d / 170) * 0.7).toFixed(3) + ')';
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
        }
      }
      ctx.font = '500 13px "DM Sans", Arial, sans-serif';
      ctx.textBaseline = 'middle';
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832);
        ctx.fillStyle = a.label ? '#2b4bff' : 'rgba(17,17,17,.55)';
        ctx.fill();
        if (a.label) { ctx.fillStyle = '#111'; ctx.fillText(a.label, a.x + 10, a.y + 1); }
      }
    }
    function step() {
      nodes.forEach(function (n) {
        var dx = mx - n.x, dy = my - n.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 170 && d > 1) { n.vx += dx / d * 0.012; n.vy += dy / d * 0.012; }
        n.vx *= 0.995; n.vy *= 0.995;
        var sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (sp > 0.7) { n.vx *= 0.7 / sp; n.vy *= 0.7 / sp; }
        if (sp < 0.1) { n.vx += (Math.random() - 0.5) * 0.04; n.vy += (Math.random() - 0.5) * 0.04; }
        n.x += n.vx; n.y += n.vy;
        var maxX = n.label ? W - 110 : W - 10;
        if (n.x < 10) { n.x = 10; n.vx = Math.abs(n.vx); }
        if (n.x > maxX) { n.x = maxX; n.vx = -Math.abs(n.vx); }
        if (n.y < 10) { n.y = 10; n.vy = Math.abs(n.vy); }
        if (n.y > H - 10) { n.y = H - 10; n.vy = -Math.abs(n.vy); }
      });
    }
    function loop() {
      if (!running) return;
      step(); draw();
      requestAnimationFrame(loop);
    }
    function start() { if (!running && visible && !reduce) { running = true; requestAnimationFrame(loop); } }
    function stop() { running = false; }

    size();
    draw();
    window.addEventListener('resize', function () { size(); if (reduce) draw(); });
    window.addEventListener('mousemove', function (e) {
      var r = cv.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    }, { passive: true });
    document.addEventListener('mouseleave', function () { mx = my = -999; });
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(cv);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    start();
  })();

  /* page transition on nav links */
  var pt = $('#pt');
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      var target = id === '#top' ? document.body : $(id);
      if (!target) return;
      ev.preventDefault();
      if (reduce) { target.scrollIntoView(); return; }
      pt.classList.remove('leave', 'down');
      pt.classList.add('cover');
      setTimeout(function () {
        var y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - (id === '#about' ? 0 : 10);
        window.scrollTo(0, y);
        pt.classList.remove('cover');
        pt.classList.add('leave');
        setTimeout(function () {
          pt.classList.remove('leave');
          pt.classList.add('down');
          void pt.offsetHeight;
          pt.classList.remove('down');
        }, 950);
      }, 900);
    });
  });

  /* resume viewer: builds the PDF from embedded data so it opens from anywhere */
  var modal = $('#modal'), doc = $('#mDoc'), closeBtn = $('#mClose'), lastBtn = null;
  var tab = $('#mTab'), dl = $('#mDl'), blobUrl = null;

  function getBlobUrl() {
    if (blobUrl) return blobUrl;
    if (window.RESUME_B64) {
      var bin = atob(window.RESUME_B64), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      blobUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    } else {
      blobUrl = 'Shivani_Pathak_Resume.pdf';
    }
    return blobUrl;
  }
  function openModal() {
    var u = getBlobUrl();
    tab.href = u;
    dl.href = u;
    doc.scrollTop = 0;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastBtn) lastBtn.focus();
  }
  $$('.js-resume').forEach(function (b) {
    b.addEventListener('click', function () { lastBtn = b; openModal(); });
  });
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* contact form opens the visitor's email app */
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var nm = $('#nm').value, em = $('#em').value, ms = $('#ms').value;
    location.href = 'mailto:shivanipathak5143@gmail.com?subject=' +
      encodeURIComponent('Portfolio message from ' + nm) +
      '&body=' + encodeURIComponent(ms + '\n\n' + nm + ' (' + em + ')');
  });
})();