/* notification.js — toast stack in the bottom-right corner.
   Used both for the periodic "fake notification feed" and for
   ad-hoc messages fired by other modules (marketplace, login, etc). */

var SeriusNotify = (function () {
  var stack = null;
  var pool = [];
  var timerId = null;

  function ensureStack() {
    if (stack) return stack;
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
    return stack;
  }

  function show(icon, title, body, duration) {
    var el = ensureStack();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML =
      '<div class="toast-icon">' + icon + '</div>' +
      '<div><div class="toast-title">' + title + '</div>' +
      '<div class="toast-body">' + body + '</div></div>' +
      '<button class="toast-close" aria-label="Tutup notifikasi">&times;</button>';
    el.appendChild(toast);

    var closeBtn = toast.querySelector('.toast-close');
    function remove() {
      toast.style.transition = 'opacity .25s, transform .25s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 260);
    }
    closeBtn.addEventListener('click', remove);
    setTimeout(remove, duration || 6000);
  }

  function loadPool() {
    fetch('data/notifications.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { pool = data; })
      .catch(function () { pool = []; });
  }

  function fireRandomFromPool() {
    if (!pool.length) return;
    var item = pool[Math.floor(Math.random() * pool.length)];
    show(item.icon, item.title, item.body);
  }

  function startFeed(intervalMs) {
    loadPool();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(function () {
      if (document.hidden) return;
      fireRandomFromPool();
    }, intervalMs || 45000);
  }

  return {
    show: show,
    startFeed: startFeed,
    fireRandomFromPool: fireRandomFromPool
  };
})();
