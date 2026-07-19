/* login.js — a fully client-side "login" that never talks to a
   server (there is none). Submitting the form just stores a fake
   session object in localStorage and updates the navbar. Honest
   about being fake, but the interaction itself is fully functional. */

var SeriusLogin = (function () {
  function renderNavState() {
    var state = SeriusStore.get();
    var slot = document.getElementById('authSlot');
    if (!slot) return;
    if (state.session) {
      slot.innerHTML =
        '<button class="btn btn-ghost btn-sm" id="logoutBtn">Keluar (' + state.session.name + ')</button>';
      var logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.addEventListener('click', logout);
    } else {
      slot.innerHTML = '<button class="btn btn-primary btn-sm" id="loginOpenBtn">Masuk</button>';
      var loginBtn = document.getElementById('loginOpenBtn');
      if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
    }
  }

  function logout() {
    SeriusStore.set('session', null);
    renderNavState();
    if (window.SeriusNotify) SeriusNotify.show('👋', 'Keluar Berhasil', 'Sesi palsu Anda telah diakhiri. Terima kasih sudah tidak melakukan apa-apa.');
  }

  function openLoginModal() {
    SeriusModal.open(
      '<div class="login-tabs">' +
        '<div class="login-tab active" data-tab="login">Masuk</div>' +
        '<div class="login-tab" data-tab="register">Daftar</div>' +
      '</div>' +
      '<h3 id="loginTitle">Masuk ke SeriusAI</h3>' +
      '<p class="modal-sub">100% aman. 0% nyata.</p>' +
      '<form id="loginForm" class="contact-form">' +
        '<div class="field"><label for="loginName">Nama</label><input id="loginName" type="text" placeholder="Nama Anda" required /></div>' +
        '<div class="field"><label for="loginEmail">Email</label><input id="loginEmail" type="email" placeholder="anda@contoh.com" required /></div>' +
        '<button type="submit" class="btn btn-primary btn-block">Masuk Sekarang</button>' +
        '<p class="form-note">Kami tidak menyimpan data ini di server manapun, karena memang tidak ada server.</p>' +
      '</form>'
    );

    var tabs = document.querySelectorAll('.login-tab');
    var title = document.getElementById('loginTitle');
    var submitBtn = document.querySelector('#loginForm button[type="submit"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var mode = tab.getAttribute('data-tab');
        title.textContent = mode === 'login' ? 'Masuk ke SeriusAI' : 'Daftar ke SeriusAI';
        submitBtn.textContent = mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang';
      });
    });

    var form = document.getElementById('loginForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('loginName').value.trim() || 'Pengguna Serius';
      var email = document.getElementById('loginEmail').value.trim() || 'tanpa@email.com';
      SeriusStore.set('session', { name: name, email: email, loggedAt: Date.now() });
      SeriusModal.close();
      renderNavState();
      if (window.SeriusAchievement) SeriusAchievement.unlock('login_fake');
      if (window.SeriusNotify) SeriusNotify.show('🔐', 'Login Berhasil', 'Selamat datang, ' + name + '. Tidak ada yang berubah, tapi selamat.');
    });
  }

  function init() {
    renderNavState();
  }

  return { init: init, openLoginModal: openLoginModal };
})();
