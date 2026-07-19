/* easteregg.js — every hidden trigger described in the brief lives
   here. Each detector calls SeriusAchievement.unlock(id) once its
   condition is met. Detectors are intentionally independent so one
   failing silently (e.g. no logo on a page) never blocks the rest. */

var SeriusEgg = (function () {

  function unlock(id) {
    if (window.SeriusAchievement) SeriusAchievement.unlock(id);
  }

  /* ---- Logo click + logo click x10 ---- */
  function watchLogoClicks() {
    var logo = document.querySelector('[data-egg="logo"]');
    if (!logo) return;
    var count = 0;
    var resetTimer = null;
    logo.addEventListener('click', function () {
      unlock('logo_click');
      count++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () { count = 0; }, 4000);
      if (count >= 10) { unlock('logo_click_10'); count = 0; }
    });
  }

  /* ---- Konami code ---- */
  function watchKonami() {
    var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var pos = 0;
    document.addEventListener('keydown', function (e) {
      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          unlock('konami');
          pos = 0;
          if (window.SeriusUI && window.SeriusUI.triggerKonamiEffect) window.SeriusUI.triggerKonamiEffect();
        }
      } else {
        pos = (key === seq[0]) ? 1 : 0;
      }
    });
  }

  /* ---- Idle 30s ---- */
  function watchIdle() {
    var idleTimer = null;
    function reset() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { unlock('idle_30'); }, 30000);
    }
    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, reset, { passive: true });
    });
    reset();
  }

  /* ---- Midnight window (03:00 - 03:59) ---- */
  function watchMidnight() {
    var h = new Date().getHours();
    if (h === 3) unlock('midnight');
  }

  /* ---- DevTools open heuristic ---- */
  function watchDevtools() {
    var threshold = 160;
    var triggered = false;
    setInterval(function () {
      var widthGap = window.outerWidth - window.innerWidth > threshold;
      var heightGap = window.outerHeight - window.innerHeight > threshold;
      if ((widthGap || heightGap) && !triggered) {
        triggered = true;
        unlock('inspect');
      }
    }, 1200);
  }

  /* ---- Resize window ---- */
  function watchResize() {
    var startW = window.innerWidth;
    var fired = false;
    window.addEventListener('resize', function () {
      if (fired) return;
      if (Math.abs(window.innerWidth - startW) > 120) {
        fired = true;
        unlock('resize');
      }
    });
  }

  /* ---- Spam click (15x in 3s on any single element) ---- */
  function watchSpamClick() {
    var timestamps = [];
    document.addEventListener('click', function () {
      var now = Date.now();
      timestamps.push(now);
      timestamps = timestamps.filter(function (t) { return now - t < 3000; });
      if (timestamps.length >= 15) {
        unlock('spam_click');
        timestamps = [];
      }
    });
  }

  /* ---- Right click ---- */
  function watchRightClick() {
    document.addEventListener('contextmenu', function () { unlock('right_click'); });
  }

  /* ---- Scroll to bottom / back to top fast ---- */
  function watchScrollExtremes() {
    var reachedBottomAt = null;
    window.addEventListener('scroll', function () {
      var scrolledToBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 40;
      if (scrolledToBottom) {
        unlock('scroll_bottom');
        reachedBottomAt = Date.now();
      }
      if (window.scrollY < 30 && reachedBottomAt && Date.now() - reachedBottomAt < 4000) {
        unlock('scroll_top');
      }
    }, { passive: true });
  }

  /* ---- Double / triple click on hero title ---- */
  function watchMultiClick() {
    var target = document.querySelector('[data-egg="multiclick"]');
    if (!target) return;
    var clicks = 0;
    var timer = null;
    target.addEventListener('click', function () {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(function () { clicks = 0; }, 600);
      if (clicks === 2) unlock('double_click');
      if (clicks === 3) unlock('triple_click');
    });
  }

  /* ---- Keyboard mash (20 keys quickly) ---- */
  function watchKeyboardMash() {
    var presses = [];
    document.addEventListener('keydown', function () {
      var now = Date.now();
      presses.push(now);
      presses = presses.filter(function (t) { return now - t < 4000; });
      if (presses.length >= 20) {
        unlock('keyboard_mash');
        presses = [];
      }
    });
  }

  /* ---- Hover secret (footer badge, 3s dwell) ---- */
  function watchHoverSecret() {
    var el = document.querySelector('[data-egg="hover-secret"]');
    if (!el) return;
    var timer = null;
    el.addEventListener('mouseenter', function () {
      timer = setTimeout(function () { unlock('hover_secret'); }, 3000);
    });
    el.addEventListener('mouseleave', function () { clearTimeout(timer); });
  }

  /* ---- Visit all sections ---- */
  function watchSectionVisits() {
    var sections = document.querySelectorAll('main section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var state = SeriusStore.get();
    var visited = {};
    (state.visitedSections || []).forEach(function (id) { visited[id] = true; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visited[entry.target.id] = true;
          var arr = Object.keys(visited);
          SeriusStore.set('visitedSections', arr);
          if (arr.length >= sections.length) unlock('all_sections');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- Console secret message ---- */
  function printConsoleSecret() {
    var style = 'color:#6C63FF;font-weight:bold;font-size:14px;';
    console.log('%cSIGMA-1 SYSTEM LOG', style);
    console.log('%cKamu benar-benar membuka console. Serius sekali.', 'color:#33D6A6');
    console.log('Ketik SeriusAI.unlockConsoleEgg() untuk membuka achievement rahasia.');
    window.SeriusAI = window.SeriusAI || {};
    window.SeriusAI.unlockConsoleEgg = function () {
      unlock('console_secret');
      return 'Achievement "Pembaca Console" terbuka. Selamat, kamu resmi kepo.';
    };
  }

  function init() {
    watchLogoClicks();
    watchKonami();
    watchIdle();
    watchMidnight();
    watchDevtools();
    watchResize();
    watchSpamClick();
    watchRightClick();
    watchScrollExtremes();
    watchMultiClick();
    watchKeyboardMash();
    watchHoverSecret();
    watchSectionVisits();
    printConsoleSecret();
  }

  return { init: init };
})();
