/* ui.js — everything that makes the page itself feel alive: nav
   behaviour, theme switching, section reveals, the seriousness
   gauge, the fake dashboard numbers, panic button, "don't click"
   button, FAQ accordion and the testimonial carousel content. */

var SeriusUI = (function () {

  /* ---------- Loading bar ---------- */
  function runLoadingBar() {
    var bar = document.getElementById('loadingBar');
    if (!bar) return;
    var progress = 0;
    var timer = setInterval(function () {
      progress += Math.random() * 18;
      if (progress >= 92) { clearInterval(timer); progress = 92; }
      bar.style.width = progress + '%';
    }, 120);
    window.addEventListener('load', function () {
      clearInterval(timer);
      bar.style.width = '100%';
      setTimeout(function () { bar.classList.add('done'); }, 300);
    });
  }

  /* ---------- Theme toggle ---------- */
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  function initTheme() {
    var state = SeriusStore.get();
    var preferred = state.theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(preferred);
    SeriusStore.set('theme', preferred);

    var btn = document.getElementById('themeToggle');
    var toggleCount = 0;
    if (btn) btn.addEventListener('click', function () {
      var current = SeriusStore.get().theme === 'light' ? 'dark' : 'light';
      applyTheme(current);
      SeriusStore.set('theme', current);
      toggleCount++;
      var counters = SeriusStore.get().eggCounters;
      counters.themeToggles = (counters.themeToggles || 0) + 1;
      SeriusStore.set('eggCounters', counters);
      if (window.SeriusAchievement) {
        SeriusAchievement.unlock(current === 'light' ? 'light_mode' : 'dark_mode');
        if (counters.themeToggles >= 5) SeriusAchievement.unlock('theme_toggle_5');
      }
    });
  }

  /* ---------- Nav / mobile menu ---------- */
  function initNav() {
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('mobileMenu');
    if (burger && menu) {
      burger.addEventListener('click', function () {
        menu.classList.toggle('is-open');
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { menu.classList.remove('is-open'); });
      });
    }

    var navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        navbar.style.borderBottomColor = window.scrollY > 20 ? 'var(--color-border-strong)' : 'var(--color-border)';
      }, { passive: true });
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (i) { observer.observe(i); });
  }

  /* ---------- Seriousness gauge (hero signature element) ---------- */
  function initGauge() {
    var valueEl = document.getElementById('gaugeValue');
    var statusEl = document.getElementById('gaugeStatus');
    var fillEl = document.getElementById('gaugeFill');
    if (!valueEl || !fillEl) return;

    var circumference = 345; // approx half-circle path length used in the SVG
    var statuses = [
      { min: 80, text: 'Level keseriusan: sangat meyakinkan.' },
      { min: 55, text: 'Level keseriusan: cukup profesional.' },
      { min: 30, text: 'Level keseriusan: mulai meragukan.' },
      { min: 0, text: 'Level keseriusan: sudah gitu aja.' }
    ];

    function render(value) {
      valueEl.textContent = value + '%';
      var offset = circumference - (circumference * value) / 100;
      fillEl.style.strokeDashoffset = offset;
      var status = statuses.find(function (s) { return value >= s.min; });
      if (statusEl && status) statusEl.textContent = status.text;
    }

    var current = 87;
    render(current);
    setInterval(function () {
      var delta = Math.round((Math.random() - 0.55) * 14);
      current = Math.max(4, Math.min(99, current + delta));
      render(current);
    }, 3200);
  }

  /* ---------- Fake dashboard metrics ---------- */
  function initDashboard() {
    var bars = document.querySelectorAll('.chart-bar');
    if (bars.length) {
      function randomizeBars() {
        bars.forEach(function (bar) {
          bar.style.height = (20 + Math.random() * 100) + 'px';
        });
      }
      randomizeBars();
      setInterval(randomizeBars, 2600);
    }

    var metricEls = document.querySelectorAll('[data-metric]');
    metricEls.forEach(function (el) {
      var base = parseInt(el.getAttribute('data-metric'), 10) || 100;
      function tick() {
        var jitter = Math.round(base * (0.9 + Math.random() * 0.2));
        el.textContent = jitter.toLocaleString('id-ID');
      }
      tick();
      setInterval(tick, 4000);
    });
  }

  /* ---------- Panic button ---------- */
  function initPanicButton() {
    var btn = document.getElementById('panicBtn');
    var msgEl = document.getElementById('panicMessage');
    var messages = [
      'Tenang. Masalahmu belum selesai, tapi tombolnya sudah ditekan.',
      'Sinyal panik terkirim ke server yang tidak ada.',
      'Krisis dicatat. Solusi: tidak tersedia. Tapi kamu sudah berusaha.',
      'Panik berhasil disalurkan. Silakan lanjutkan hidup seperti biasa.',
      'Tombol ini tidak memperbaiki apa pun, tapi terasa lega, bukan?'
    ];
    if (!btn) return;
    var clicks = 0;
    btn.addEventListener('click', function () {
      clicks++;
      btn.classList.remove('shake');
      void btn.offsetWidth;
      btn.classList.add('shake');
      if (msgEl) msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];
      var counters = SeriusStore.get().eggCounters;
      counters.panicClicks = (counters.panicClicks || 0) + 1;
      SeriusStore.set('eggCounters', counters);
      if (window.SeriusAchievement) {
        SeriusAchievement.unlock('panic_button');
        if (counters.panicClicks >= 5) SeriusAchievement.unlock('panic_5');
      }
    });
  }

  /* ---------- "Jangan Diklik" button ---------- */
  function initDontClick() {
    var btn = document.getElementById('dontClickBtn');
    var msgEl = document.getElementById('dontClickMsg');
    if (!btn) return;
    var responses = [
      'Sudah diduga. Kamu memang tidak bisa menahan diri.',
      'Selamat, kamu resmi seorang pembangkang.',
      'Tombol ini sengaja dibuat untuk diklik. Ironis, ya?',
      'Konsekuensinya: tidak ada. Tapi rasa penasaranmu terjawab.'
    ];
    btn.addEventListener('click', function () {
      if (msgEl) msgEl.textContent = responses[Math.floor(Math.random() * responses.length)];
      if (window.SeriusAchievement) SeriusAchievement.unlock('dont_click');
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (i) {
          i.classList.remove('is-open');
          i.querySelector('.faq-a').style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- Testimonials render ---------- */
  function initTestimonials() {
    var track = document.getElementById('testiTrack');
    if (!track) return;
    fetch('data/fake-reviews.json')
      .then(function (r) { return r.json(); })
      .then(function (reviews) {
        track.innerHTML = reviews.map(function (r) {
          return '<div class="card testi-card">' +
            '<div class="testi-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>' +
            '<p>"' + r.text + '"</p>' +
            '<div class="testi-name">' + r.name + '</div>' +
            '<div class="testi-role">' + r.role + '</div>' +
          '</div>';
        }).join('');
      })
      .catch(function () { track.innerHTML = '<p style="color:var(--color-text-dim)">Testimoni sedang dimuat ulang dengan sangat serius.</p>'; });
  }

  /* ---------- Status ticker ---------- */
  function buildTicker() {
    var track = document.getElementById('statusTicker');
    if (!track) return;
    var items = [
      'API Utama: Operasional', 'Fake Database: Sinkron', 'CDN Buzzword: Aktif',
      'Server Panik: Siaga', 'Uptime: 99.9% (klaim sendiri)', 'Achievement Engine: Berjalan',
      'Marketplace: Stok Tidak Terbatas', 'Chatbot SIGMA-1: Online'
    ];
    var html = items.map(function (t) { return '<span><i class="dot-ok"></i>' + t + '</span>'; }).join('');
    track.innerHTML = html + html;
  }

  /* ---------- Konami visual effect ---------- */
  function triggerKonamiEffect() {
    document.body.style.transition = 'filter .6s';
    document.body.style.filter = 'hue-rotate(180deg) saturate(1.6)';
    setTimeout(function () { document.body.style.filter = ''; }, 2400);
    if (window.SeriusNotify) SeriusNotify.show('🕹️', 'Konami Code!', 'Kekuatan retro telah diaktifkan selama beberapa detik.');
  }

  /* ---------- Footer year + secret link ---------- */
  function initFooterMeta() {
    var y = document.getElementById('footerYear');
    if (y) y.textContent = new Date().getFullYear();
  }

  function init() {
    runLoadingBar();
    initTheme();
    initNav();
    initReveal();
    initGauge();
    initDashboard();
    initPanicButton();
    initDontClick();
    initFaq();
    initTestimonials();
    buildTicker();
    initFooterMeta();
  }

  return { init: init, triggerKonamiEffect: triggerKonamiEffect };
})();
