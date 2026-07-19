/* fakeadmin.js — the hidden "Secret Admin Panel". Reachable through
   the console egg, the footer secret link, or by typing "admin" as
   a Konami-style word. Renders fake employees, fake stats and a
   scrolling fake server log entirely client-side. */

var SeriusFakeAdmin = (function () {
  var logLines = [
    'Menyinkronkan sinergi lintas divisi...',
    'Menghitung ulang KPI yang tidak terukur...',
    'Mengoptimalkan buzzword ke level maksimum...',
    'Server utama melaporkan status: baik-baik saja...',
    'Menjalankan backup kenangan mantan pengguna...',
    'Fake AI sedang berpikir sangat keras...',
    'Deploy ke production tanpa testing, seperti biasa...',
    'Mengganti nama fitur agar terdengar lebih canggih...',
    'Menghapus bug dengan cara menyembunyikannya...',
    'Mengirim laporan mingguan yang tidak dibaca siapa pun...'
  ];

  function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function buildEmployeeRows(users) {
    return users.map(function (u) {
      return '<div class="employee-row">' +
        '<span class="e-avatar">' + u.avatar + '</span>' +
        '<div><div class="e-name">' + u.name + '</div><div class="e-role">' + u.role + '</div></div>' +
        '<span class="e-status">' + u.status + '</span>' +
      '</div>';
    }).join('');
  }

  function open() {
    fetch('data/fake-users.json')
      .then(function (r) { return r.json(); })
      .then(function (users) {
        SeriusModal.open(
          '<div class="admin-badge" style="margin-bottom:16px;display:inline-block;">🔓 AKSES DIBERIKAN</div>' +
          '<h3>Secret Admin Panel</h3>' +
          '<p class="modal-sub">Anda menemukan panel admin tersembunyi. Semua data di bawah ini 100% fiktif.</p>' +
          '<div class="admin-grid">' +
            '<div class="metric-card"><div class="m-label">Total Pengguna</div><div class="m-value">' + randomInt(48000, 52000) + '</div><div class="m-delta up">▲ ' + randomInt(1, 9) + '% minggu ini</div></div>' +
            '<div class="metric-card"><div class="m-label">Keseriusan Rata-rata</div><div class="m-value">' + randomInt(60, 99) + '%</div><div class="m-delta down">▼ fluktuatif</div></div>' +
          '</div>' +
          '<h4 style="font-size:0.85rem;margin-bottom:8px;color:var(--color-text-dim);">Tim Fiktif</h4>' +
          '<div style="max-height:160px;overflow-y:auto;margin-bottom:16px;">' + buildEmployeeRows(users) + '</div>' +
          '<h4 style="font-size:0.85rem;margin-bottom:8px;color:var(--color-text-dim);">Server Log</h4>' +
          '<div class="server-log" id="adminServerLog"></div>' +
          '<button class="btn btn-primary btn-block mt-6" data-close-admin>Tutup Panel</button>'
        );
        var btn = document.querySelector('[data-close-admin]');
        if (btn) btn.addEventListener('click', SeriusModal.close);
        startLog();
        if (window.SeriusAchievement) SeriusAchievement.unlock('admin_found');
      });
  }

  function startLog() {
    var el = document.getElementById('adminServerLog');
    if (!el) return;
    var count = 0;
    var timer = setInterval(function () {
      if (!document.getElementById('adminServerLog')) { clearInterval(timer); return; }
      var line = document.createElement('div');
      var time = new Date().toLocaleTimeString('id-ID');
      line.textContent = '[' + time + '] ' + logLines[randomInt(0, logLines.length - 1)];
      el.appendChild(line);
      el.scrollTop = el.scrollHeight;
      count++;
      if (count > 30) el.removeChild(el.firstChild);
    }, 1400);
  }

  function watchSecretWord() {
    var buffer = '';
    document.addEventListener('keydown', function (e) {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key).slice(-5).toLowerCase();
      if (buffer === 'admin') open();
    });
  }

  function init() {
    watchSecretWord();
    var link = document.querySelector('[data-admin-link]');
    if (link) link.addEventListener('click', function (e) { e.preventDefault(); open(); });
  }

  return { init: init, open: open };
})();
