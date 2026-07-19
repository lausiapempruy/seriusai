/* popup.js — a single reusable modal overlay (SeriusModal) used by
   login, certificate and random-popup features, plus the "random
   popup" absurd-ad generator that fires a few times per session. */

var SeriusModal = (function () {
  var overlay = null;
  var box = null;

  function ensure() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    box = document.createElement('div');
    box.className = 'modal-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function open(innerHTML) {
    ensure();
    box.innerHTML = '<button class="modal-close" aria-label="Tutup">&times;</button>' + innerHTML;
    box.querySelector('.modal-close').addEventListener('click', close);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  return { open: open, close: close };
})();

var SeriusPopup = (function () {
  var randomAds = [
    { title: '🎉 Penawaran Spesial!', body: 'Upgrade ke SeriusAI Ultra Plus Pro Max sekarang dan dapatkan fitur yang sama seperti sebelumnya, hanya dengan harga lebih mahal.' },
    { title: '📦 Update Tersedia', body: 'Versi baru SeriusAI telah dirilis. Perubahan: tidak ada. Tapi nomor versinya lebih keren.' },
    { title: '🔥 Jangan Lewatkan!', body: 'Slot Panic Button gratis tersisa: tidak terbatas, karena memang selalu gratis.' },
    { title: '🏆 Kamu Terpilih!', body: 'Sistem kami mendeteksi Anda sebagai pengguna paling serius hari ini. Selamat, hadiahnya adalah popup ini.' },
    { title: '⚠️ Peringatan Penting', body: 'Skor keseriusan Anda sedang dipantau secara real-time. Tetap tenang dan lanjutkan scrolling.' }
  ];
  var shownCount = 0;
  var maxPerSession = 3;

  function showRandomAd() {
    if (shownCount >= maxPerSession) return;
    if (document.querySelector('.modal-overlay.is-open')) return;
    var ad = randomAds[Math.floor(Math.random() * randomAds.length)];
    shownCount++;
    SeriusModal.open(
      '<h3>' + ad.title + '</h3>' +
      '<p class="modal-sub">' + ad.body + '</p>' +
      '<button class="btn btn-primary btn-block" data-close-ad>Tutup dengan Serius</button>'
    );
    var btn = document.querySelector('[data-close-ad]');
    if (btn) btn.addEventListener('click', SeriusModal.close);
  }

  function scheduleAds() {
    setTimeout(showRandomAd, 25000);
    setInterval(function () {
      if (Math.random() < 0.6) showRandomAd();
    }, 70000);
  }

  function openCertificate() {
    var state = SeriusStore.get();
    var name = (state.session && state.session.name) ? state.session.name : 'Pengunjung Terhormat';
    var dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    SeriusModal.open(
      '<div class="certificate">' +
        '<div class="c-seal">🏅</div>' +
        '<div class="c-title">Sertifikat Keseriusan Digital</div>' +
        '<div class="c-name">' + name + '</div>' +
        '<p style="color:var(--color-text-dim);font-size:0.85rem;">telah dinyatakan resmi serius dalam menjelajahi SeriusAI</p>' +
        '<div class="c-line"></div>' +
        '<p style="font-family:var(--font-mono);font-size:0.72rem;color:var(--color-text-faint);">Diterbitkan ' + dateStr + ' · Tidak berlaku secara hukum</p>' +
      '</div>' +
      '<button class="btn btn-primary btn-block" data-close-cert>Tutup Sertifikat</button>'
    );
    var btn = document.querySelector('[data-close-cert]');
    if (btn) btn.addEventListener('click', SeriusModal.close);
    if (window.SeriusAchievement) SeriusAchievement.unlock('certificate');
  }

  function init() {
    scheduleAds();
    var certBtn = document.getElementById('certificateBtn');
    if (certBtn) certBtn.addEventListener('click', openCertificate);
  }

  return { init: init, showRandomAd: showRandomAd, openCertificate: openCertificate };
})();
