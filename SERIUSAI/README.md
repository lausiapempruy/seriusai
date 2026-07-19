# SeriusAI

**Solusi Serius. Hasilnya... Ya Gitu Deh.**

Website startup AI enterprise premium — 100% statis, 100% client-side, 100% tidak serius begitu Anda mulai mengklik sesuatu.

![status](https://img.shields.io/badge/status-final%20release-6C63FF)
![stack](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-33D6A6)
![hosting](https://img.shields.io/badge/hosting-GitHub%20Pages-181717)
![license](https://img.shields.io/badge/license-MIT-FFB020)

## Screenshot

> `assets/images/` sengaja tidak diisi screenshot biner di repo ini — ambil tangkapan layar Anda sendiri setelah deploy dan taruh di sana, lalu tempel di sini:
>
> `![Beranda SeriusAI](assets/images/screenshot-hero.png)`

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur](#fitur)
- [Struktur Folder](#struktur-folder)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Upload ke GitHub](#upload-ke-github)
- [Mengaktifkan GitHub Pages](#mengaktifkan-github-pages)
- [Catatan Teknis & Keputusan Desain](#catatan-teknis--keputusan-desain)
- [Lisensi](#lisensi)
- [Credit](#credit)

## Tentang Proyek

SeriusAI adalah proyek satir: sebuah landing page + mini web-app bergaya startup AI enterprise (terinspirasi Apple, Stripe, OpenAI, Vercel, Notion, Framer) dengan visual dark-glassmorphism premium, tapi seluruh kontennya adalah humor absurd. Tidak ada backend, tidak ada database, tidak ada AI sungguhan — semua "kecerdasan buatan" di sini adalah array JavaScript yang dipilih secara acak.

Proyek ini **final release**, siap dipublikasikan tanpa pengembangan ulang. Tinggal upload ke GitHub dan aktifkan GitHub Pages.

## Fitur

- 🎨 Desain dark-glassmorphism premium, responsif penuh dari mobile hingga desktop
- 📊 Dashboard dengan metrik dan grafik yang "hidup" (acak, tapi meyakinkan)
- 🛒 Marketplace dengan 12 produk absurd dan keranjang belanja (localStorage)
- 🤖 Chatbot "SIGMA-1" dengan sistem pencocokan kata kunci sederhana
- 🔐 Login/registrasi palsu — sesi disimpan di browser Anda sendiri
- 🗝️ Secret Admin Panel dengan tim karyawan fiktif, statistik fiktif, dan server log berjalan
- 🏆 Sistem Achievement dengan 31 pencapaian tersembunyi
- 🥚 30+ easter egg: Konami Code, klik logo berulang, diam 30 detik, buka jam 3 pagi, inspect element, dan banyak lagi (lihat `data/eastereggs.json`)
- 🌗 Dark mode / light mode dengan preferensi tersimpan
- 📜 Sertifikat digital yang bisa "diambil" setelah menjelajahi situs
- 🚨 Panic Button, tombol "Jangan Diklik", notifikasi acak, dan popup iklan absurd
- ♿ Aksesibilitas dasar: fokus keyboard terlihat, `prefers-reduced-motion` dihormati, skip-link

## Struktur Folder

```text
SERIUSAI/
│
├── index.html                 # Halaman utama (semua section)
├── 404.html                   # Halaman error kustom untuk GitHub Pages
├── style.css                  # Entry stylesheet (mengimpor semua layer css/)
├── script.js                  # Boot sequence — menginisialisasi semua modul JS
├── README.md
├── LICENSE
├── sitemap.xml
├── robots.txt
├── manifest.webmanifest
│
├── assets/
│   ├── logo.svg                # Logo navbar & footer
│   └── favicon.svg             # Favicon (SVG, didukung semua browser modern)
│
├── data/
│   ├── achievements.json        # 31 definisi achievement
│   ├── dialogs.json             # Pool balasan chatbot SIGMA-1
│   ├── eastereggs.json          # Metadata easter egg (dipakai admin panel)
│   ├── fake-products.json       # Katalog marketplace
│   ├── fake-users.json          # Tim karyawan fiktif (admin panel)
│   ├── fake-reviews.json        # Testimoni
│   └── notifications.json       # Feed notifikasi acak
│
├── css/
│   ├── variables.css            # Design tokens (warna, tipografi, spacing)
│   ├── animation.css            # Keyframes & utility animasi
│   ├── responsive.css           # Breakpoint mobile/tablet
│   └── components.css           # Semua komponen UI (nav, card, modal, dsb.)
│
├── js/
│   ├── ui.js                    # Nav, tema, reveal, gauge, dashboard, FAQ
│   ├── chatbot.js                # Widget chatbot SIGMA-1
│   ├── popup.js                  # Modal engine + popup iklan acak + sertifikat
│   ├── achievement.js            # Sistem achievement & progress
│   ├── easteregg.js              # Semua detektor easter egg
│   ├── notification.js           # Sistem toast notifikasi
│   ├── fakeadmin.js              # Panel admin rahasia
│   ├── marketplace.js            # Render produk & keranjang
│   ├── login.js                  # Login/registrasi palsu
│   └── storage.js                # Wrapper localStorage terpusat
│
└── .github/
    └── workflows/
        └── pages.yml             # Opsional: auto-deploy via GitHub Actions
```

## Menjalankan Secara Lokal

Karena situs ini murni statis, Anda cukup membuka `index.html` langsung di browser. Namun beberapa fitur (fetch data JSON di `data/`) membutuhkan server lokal agar tidak diblokir kebijakan CORS `file://` di sebagian browser:

```bash
# Python 3
python -m http.server 8080

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8080` di browser.

## Upload ke GitHub

1. Buat repository baru di GitHub, misalnya `SERIUSAI`.
2. Upload seluruh isi folder ini ke repository tersebut (via web upload, `git push`, atau GitHub Desktop).
3. Pastikan struktur folder tetap sama persis seperti di atas — jangan naikkan isi `SERIUSAI/` ke subfolder tambahan.

Contoh via command line:

```bash
git init
git add .
git commit -m "Final release: SeriusAI v1.0"
git branch -M main
git remote add origin https://github.com/USERNAME/SERIUSAI.git
git push -u origin main
```

## Mengaktifkan GitHub Pages

1. Masuk ke repository di GitHub → tab **Settings**.
2. Pilih menu **Pages** di sidebar kiri.
3. Pada **Source**, pilih **Deploy from a branch**.
4. Pilih **Branch: main**, folder **/(root)**.
5. Klik **Save**.
6. Tunggu 1–2 menit, lalu website akan tersedia di `https://USERNAME.github.io/SERIUSAI/`.

> Alternatif: repository ini sudah menyertakan `.github/workflows/pages.yml` yang otomatis melakukan deploy setiap kali Anda push ke branch `main`, jika Anda memilih Source **GitHub Actions** alih-alih **Deploy from a branch**.

Setelah live, ganti `YOUR-USERNAME` pada `sitemap.xml` dan `robots.txt` dengan username GitHub Anda yang sebenarnya agar URL-nya akurat.

## Catatan Teknis & Keputusan Desain

Beberapa penyesuaian sengaja dilakukan agar seluruh proyek benar-benar fungsional tanpa placeholder biner yang tidak bisa diverifikasi:

- **Font**: menggunakan Google Fonts (Space Grotesk, Inter, JetBrains Mono) via CDN di `style.css`, bukan file font lokal di `assets/fonts/` — menghindari file font kosong/placeholder dan tetap ringan untuk GitHub Pages.
- **Ikon**: favicon dan logo memakai SVG murni (`assets/favicon.svg`, `assets/logo.svg`) yang didukung penuh oleh browser modern, sehingga tidak diperlukan `favicon.ico` biner.
- **Audio**: tidak ada file audio statis; jika Anda ingin menambahkan efek suara notifikasi, gunakan Web Audio API langsung di `js/notification.js` (tidak memerlukan file eksternal).
- **Gambar**: bagian hero/about memakai emoji dan gradient sebagai elemen visual utama alih-alih foto stok, konsisten dengan nada absurd situs ini. Folder `assets/images/` bisa Anda isi sendiri jika ingin menambahkan tangkapan layar produk sungguhan.

Semua keputusan di atas menjaga agar tidak ada file kosong, rusak, atau placeholder yang beredar di repository — sesuai prinsip "final release, bukan prototype".

## Lisensi

Dirilis di bawah [Lisensi MIT](LICENSE).

## Credit

Dibuat sebagai proyek satir startup AI, dirancang untuk GitHub Pages tanpa dependensi build tool apa pun.
