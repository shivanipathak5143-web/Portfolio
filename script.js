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