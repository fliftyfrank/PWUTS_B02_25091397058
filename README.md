# PinjamAlat – Admin Lab

UTS Pemrograman Web, D4 Manajemen Informatika 2025B, Universitas Negeri Surabaya (UNESA).

- **Nama:** Muhammad Richard Esa R
- **NIM:** 25091397058
- **Kelompok:** 2
- **Judul Proyek:** Sistem Peminjaman Alat Pendukung Praktikum dan Mata Kuliah
- **Peran:** Admin Lab
- **Dosen:** Ari Kurniawan, S.Kom., M.T.

## Pembagian pekerjaan (item 2.d)

Pengerjaan proyek dibagi berdasarkan modul. Modul pengguna dikerjakan oleh anggota lain, sedangkan modul admin dikerjakan oleh saya, sesuai pembagian tugas kelompok.

| Item | Bagian saya (modul admin) |
|---|---|
| 2.a | **Layout utama** `index.html`: sidebar, topbar, dashboard, kartu statistik, komposisi status, dan daftar alat terbaru. |
| 2.b | **Pengajuan peminjaman** `pages/pengajuan.html`: review pengajuan, persetujuan atau penolakan, pemeriksaan alat, pencatatan pengambilan dan pengembalian, pencarian, filter, serta simulasi stok. |
| 2.c | **Data alat** `pages/data-alat.html`: pengelolaan data alat, validasi form menggunakan jQuery, dan pengiriman data menggunakan AJAX ke server. |
| – | **Laporan** `pages/laporan.html`: laporan berdasarkan periode, cetak atau simpan PDF, dan ekspor CSV. |
| 2.e | **Dokumentasi** `README.md`: petunjuk penggunaan, struktur file, fitur, dan batasan sistem. |

## Struktur proyek

```text
PinjamAlat/
├── index.html
├── server.py
├── jalankan.bat
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── pages.js
├── img/
└── pages/
    ├── pengajuan.html
    ├── data-alat.html
    └── laporan.html
```

## Fitur Admin Lab sesuai SRS

1. **Dashboard admin** — menampilkan statistik peminjaman, status pengajuan, dan informasi alat.
2. **Review pengajuan** — menyetujui atau menolak pengajuan dengan catatan.
3. **Pemeriksaan alat** — mengecek ketersediaan dan kondisi fisik alat sebelum dipinjamkan.
4. **Pengambilan alat** — mencatat pengambilan dan mengurangi stok tersedia.
5. **Pengembalian alat** — mencatat pengembalian, memperbarui stok, dan merekam kondisi alat.
6. **Status keterlambatan** — menandai peminjaman yang melewati batas waktu.
7. **Kelola data alat** — menambah dan mengelola informasi alat praktikum.
8. **Laporan** — melihat laporan berdasarkan periode, mencetak laporan atau menyimpannya sebagai PDF, serta mengekspor data ke CSV.

Data awal sistem terdiri dari 5 alat dan 5 pengajuan contoh.

## Menjalankan aplikasi

1. Buka folder proyek `PinjamAlat` di VS Code.
2. Jalankan terminal pada folder tersebut.
3. Jalankan perintah berikut:

   ```bash
   python server.py
   ```

   Alternatifnya, klik file `jalankan.bat` jika tersedia dan telah dikonfigurasi dengan benar.

4. Buka browser dan akses:

   http://localhost:8000

**Catatan:** Koneksi internet diperlukan untuk memuat jQuery melalui CDN.

## Validasi form data alat (item 2.c)

- Kode alat harus mengikuti format `PP-001` dan tidak boleh duplikat.
- Nama alat minimal 3 karakter.
- Kategori, kondisi, dan ikon wajib diisi.
- Stok harus berada pada rentang 1–200 dan tidak boleh lebih kecil daripada jumlah alat yang sedang dipinjam.
- Durasi peminjaman dibatasi 1–3 hari.
- Khusus proyektor, durasi peminjaman maksimal 1 hari.

## Teknologi yang digunakan

- HTML5
- CSS3
- JavaScript
- jQuery dan AJAX
- Python untuk server lokal
- LocalStorage untuk penyimpanan data pada browser

## Batasan sistem

- Login serta peran Mahasiswa dan Admin Sistem tidak termasuk dalam cakupan modul ini.
- Data aplikasi menggunakan `localStorage`, bukan database.
- Jika `index.html` dibuka langsung melalui `file://`, permintaan AJAX dapat diblokir oleh browser. Halaman menggunakan cadangan `js/pages.js`, tetapi penyimpanan data hanya berlaku di browser tersebut.
- Fitur server untuk data alat menggunakan endpoint `POST /api/alat`.

## Penutup

Proyek PinjamAlat – Admin Lab dibuat untuk membantu pengelolaan peminjaman alat praktikum dan mata kuliah, mulai dari pemeriksaan pengajuan, pengelolaan inventaris, pencatatan pengambilan dan pengembalian, hingga penyusunan laporan.

