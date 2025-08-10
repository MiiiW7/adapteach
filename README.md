# AdaptEach

AdaptEach adalah platform pembelajaran adaptif yang dirancang untuk menyesuaikan materi pembelajaran dengan gaya belajar unik setiap siswa. Proyek ini dibuat dengan [Next.js](https://nextjs.org).

## Memulai

Untuk menjalankan server pengembangan secara lokal, ikuti langkah-langkah berikut:

1.  **Instal dependensi:**
    Pastikan Anda memiliki Node.js dan npm (atau yarn/pnpm/bun) terinstal. Buka terminal Anda di direktori proyek dan jalankan:
    ```bash
    npm install
    ```

2.  **Siapkan database:**
    Proyek ini menggunakan Prisma sebagai ORM.
    *   Salin file `.env.example` menjadi `.env`.
    *   Sesuaikan `DATABASE_URL` di file `.env` Anda dengan string koneksi database Anda.
    *   Jalankan migrasi database:
        ```bash
        npx prisma migrate dev
        ```

3.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```

4.  Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Pengaturan Alur Kerja n8n

Proyek ini menyertakan alur kerja n8n (`adapteachv1.json`) yang secara otomatis menghasilkan konten pembelajaran yang disesuaikan ketika seorang guru menambahkan materi baru.

### Cara Kerja Alur Kerja

1.  **Pemicu (Trigger):** Alur kerja dipicu oleh permintaan `POST` ke webhook. Permintaan ini dikirim dari aplikasi AdaptEach saat seorang guru membuat materi baru, dengan mengirimkan topik materi.
2.  **Pembuatan Konten AI:** Topik tersebut kemudian dikirim ke AI (menggunakan Google Gemini atau OpenAI) dengan prompt untuk menghasilkan tiga jenis konten berdasarkan gaya belajar:
    *   **Visual:** Tautan ke gambar atau ilustrasi yang relevan.
    *   **Auditori:** Tautan ke video atau penjelasan audio.
    *   **Kinestetik:** Langkah-langkah atau kegiatan praktik.
    *   **Penjelasan:** Penjelasan mendalam mengenai topik tersebut.
3.  **Pencarian Internet:** Jika diperlukan, alur kerja dapat menggunakan SerpApi untuk mencari informasi tambahan di internet.
4.  **Penyimpanan & Respon:** Konten yang dihasilkan diformat sebagai JSON dan dikirim kembali sebagai respons webhook, yang kemudian disimpan dalam database aplikasi.

### Cara Mengatur Alur Kerja n8n

1.  **Impor Alur Kerja:**
    *   Buka instance n8n Anda.
    *   Impor file `adapteachv1.json` ke n8n.

2.  **Konfigurasi Kredensial:**
    Alur kerja ini memerlukan kredensial untuk layanan berikut:
    *   Google Gemini (atau OpenAI)
    *   SerpApi (opsional, untuk pencarian internet)
    Pastikan Anda telah menambahkan kredensial ini di pengaturan n8n Anda dan memilihnya di node yang sesuai dalam alur kerja.

3.  **Aktifkan Alur Kerja:**
    *   Setelah kredensial diatur, aktifkan alur kerja di n8n.

4.  **Perbarui URL Webhook di Aplikasi:**
    *   Salin URL webhook dari node "Webhook" di alur kerja n8n Anda.
    *   Di dalam kode aplikasi AdaptEach, temukan bagian di mana permintaan `POST` dibuat saat menambahkan materi baru (kemungkinan besar di `app/(dashboard)/guru/tambah-materi/page.jsx`).
    *   Ganti URL placeholder dengan URL webhook n8n Anda.

Setelah langkah-langkah ini selesai, setiap kali seorang guru menambahkan materi baru, alur kerja n8n akan secara otomatis menghasilkan dan menyediakan konten pembelajaran yang disesuaikan.
