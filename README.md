# 🎬 CinePulse - Real-Time Movie Finder & Explorer

Aplikasi pencari dan penjelajah film modern berbasis **React + Vite + Tailwind CSS** yang terhubung langsung ke **The Movie Database (TMDb) API** secara **real-time** saat ini (2026).

---

## 🌟 Fitur Utama

1. **📡 Real-Time Live Data dari TMDb API**
   - Mengambil data langsung dari server TMDb tanpa jeda/statis.
   - Kategori film:
     - 🔥 **Trending Hari Ini & Pekan Ini**
     - 🎬 **Sedang Tayang di Bioskop (Now Playing)**
     - ⭐ **Paling Populer (Popular)**
     - 🏆 **Rating Tertinggi (Top Rated)**
     - 📅 **Segera Hadir di Bioskop (Upcoming)**

2. **🔍 Pencarian Instan (Real-Time Search & Debounce)**
   - Ketik judul film apa saja dan dapatkan hasil secara instan.
   - Dilengkapi *quick-suggestion tags* populer (*Spider-Man*, *Oppenheimer*, *Dune*, *Avatar*, dll.).

3. **🎯 Filter & Pengurutan Lengkap**
   - Filter berdasarkan **Genre** (Action, Adventure, Sci-Fi, Horror, Animation, Drama, dll.).
   - Filter berdasarkan **Tahun Rilis** (2026, 2025, 2024, 2023, dst.).
   - Pengurutan berdasarkan **Popularitas, Rating Tertinggi, Rilis Terbaru, dan Vote Terbanyak**.

4. **🎞️ Hero Spotlight Banner Dinamis**
   - Menampilkan film trending teratas dengan visual resolusi tinggi, sinopsis singkat, rating, dan auto-rotasi carousel.
   - Tombol cepat untuk memutar trailer dan menambah ke watchlist.

5. **🍿 Modal Detail Film Interaktif**
   - Sinopsis lengkap dalam Bahasa Indonesia (atau English).
   - Rating skor bintang, durasi film (jam & menit), tanggal rilis.
   - Data anggaran (*budget*) dan pendapatan (*revenue*) box office.
   - Daftar **Pemeran Utama (Cast)** lengkap dengan foto profil & nama karakter.
   - Data **Sutradara** & Penulis Skenario.
   - Rekomendasi film terkait (*Similar Movies*) yang bisa langsung diklik.

6. **▶️ Pemutar Trailer Resmi (YouTube Embedded)**
   - Tonton trailer resmi langsung di dalam aplikasi tanpa harus berpindah tab.

7. **🔖 Watchlist & Favorit (Penyimpanan Lokal)**
   - Simpan film yang ingin ditonton ke watchlist dengan satu klik.
   - Data tersimpan otomatis di `localStorage` peramban Anda.

8. **⚙️ Pengaturan API & Bahasa**
   - Sudah terkonfigurasi dengan kunci API bawaan yang aktif dan siap pakai.
   - Pengguna juga dapat memasukkan kunci API TMDb pribadi jika diinginkan.
   - Fitur **Tes Ping Koneksi Server Real-Time**.
   - Pilihan bahasa data (Bahasa Indonesia `id-ID` atau English `en-US`).

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Node.js sudah terpasang di komputer Anda.

1. **Buka terminal di direktori proyek:**
   ```bash
   cd d:\testProject\MovieFinder
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```

3. **Buka browser:**
   Akses alamat yang tertera di terminal, biasanya:
   ```
   http://localhost:5173/
   ```

4. **Build untuk Produksi:**
   ```bash
   npm run build
   ```

---

## 🛠️ Teknologi yang Digunakan

- **React 18 / 19** - Library UI komponen modern
- **Vite** - Bundler secepat kilat
- **Tailwind CSS** - Styling responsif dan modern cinematic dark theme
- **Lucide React** - Ikon grafis modern
- **TMDb (The Movie Database) API v3** - Sumber data film real-time global
