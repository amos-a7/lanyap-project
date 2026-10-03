# LearnHire 🎓💼
**Aplikasi Lowongan Pekerjaan dan Kursus Online**

LearnHire adalah platform web full-stack yang menghubungkan pencari kerja dengan lowongan pekerjaan berkualitas sekaligus menyediakan kursus online untuk meningkatkan keterampilan teknis dan profesional.

---

## 📋 Fitur Utama
- 🔐 **Autentikasi:** Register, Login, & Protected Routes dengan JSON Web Token (JWT) serta hashing password menggunakan bcryptjs.
- 💼 **Manajemen Lowongan Pekerjaan:** Telusuri (browse), pencarian (search), filter berdasarkan kategori & tipe pekerjaan, serta pengiriman lamaran (apply).
- 📚 **Kursus Online:** Akses katalog kursus, pendaftaran (enroll), dan pemantauan progres pembelajaran interaktif.
- 👤 **Profil Pengguna:** Manajemen profil pribadi, kontak, keahlian (skills), tautan CV/resume, dan biodata.
- 📋 **Tracking Lamaran Pekerjaan:** Pantau status berkas lamaran secara berkala (Pending, Reviewed, Accepted, Rejected).
- 🎓 **Tracking Kursus yang Diikuti:** Pantau riwayat kursus terdaftar beserta status kelulusan (Enrolled, Completed, Dropped).
- 💬 **Customer Service / Support:** Sistem pelaporan bantuan dan tiket layanan kendala pengguna dengan admin.
- 📊 **Dashboard dengan Statistik:** Metrik real-time jumlah lowongan aktif, kursus tersedia, user terdaftar, dan perusahaan mitra.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 Modern (Custom Variables, Flexbox, CSS Grid), JavaScript (Vanilla ES6+)
- **Backend:** Node.js, Express.js RESTful API
- **Database:** MySQL (Relational DB dengan Connection Pool `mysql2`)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Security:** `helmet` (HTTP Headers Security), `cors` (Cross-Origin Resource Sharing)
- **Icons & Font:** Font Awesome 6.5, Poppins Font (Google Fonts)

---

## 📁 Struktur Project

```text
learnhire/
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── application.controller.js
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── company.controller.js
│   │   ├── course.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── enrollment.controller.js
│   │   ├── job.controller.js
│   │   └── support.controller.js
│   ├── docs/
│   │   └── api.md
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── application.model.js
│   │   ├── category.model.js
│   │   ├── company.model.js
│   │   ├── course.model.js
│   │   ├── enrollment.model.js
│   │   ├── job.model.js
│   │   ├── support.model.js
│   │   └── user.model.js
│   └── routes/
│       ├── application.routes.js
│       ├── auth.routes.js
│       ├── category.routes.js
│       ├── company.routes.js
│       ├── course.routes.js
│       ├── dashboard.routes.js
│       ├── enrollment.routes.js
│       ├── index.js
│       ├── job.routes.js
│       └── support.routes.js
├── database/
│   └── database.sql
└── frontend/
    ├── index.html
    ├── assets/
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       ├── api.js
    │       ├── app.js
    │       ├── auth.js
    │       └── pages/
    │           ├── applications.js
    │           ├── courses.js
    │           ├── home.js
    │           ├── jobs.js
    │           ├── login.js
    │           ├── my-courses.js
    │           ├── profile.js
    │           ├── register.js
    │           └── support.js
    ├── components/
    │   └── sidebar.html
    └── pages/
        ├── applications.html
        ├── courses.html
        ├── home.html
        ├── jobs.html
        ├── login.html
        ├── my-courses.html
        ├── profile.html
        ├── register.html
        └── support.html
```

---

## ⚙️ Requirements
- **Node.js:** v18.0.0 atau lebih baru
- **npm:** v9.0.0 atau lebih baru
- **XAMPP:** Apache & MySQL (termasuk phpMyAdmin)
- **Browser Modern:** Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari

---

## 🚀 Instalasi & Setup

### 1. Clone/Download Project
Arahkan direktori terminal ke lokasi project LearnHire:
```bash
cd path/to/learnhire
```

### 2. Setup Database
1. Jalankan aplikasi **XAMPP Control Panel**.
2. Klik tombol **Start** pada modul **MySQL**.
3. Buka browser dan akses phpMyAdmin di `http://localhost/phpmyadmin/`.
4. Pilih tab **Import** pada menu navigasi atas.
5. Klik **Choose File** dan pilih file `database/database.sql`.
6. Klik tombol **Go** di bagian bawah.
7. Database `learnhire_db` beserta tabel-tabel relasional dan data dummy awal akan dibuat secara otomatis.

### 3. Setup Backend
Masuk ke direktori backend dan instal seluruh dependensi:
```bash
cd backend
npm install
```

### 4. Konfigurasi Environment
Salin template konfigurasi `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan parameter database dan port di dalam file `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=learnhire_db
JWT_SECRET=learnhire_jwt_secret_key_2024_change_this
JWT_EXPIRES_IN=24h
```

### 5. Jalankan Backend
Jalankan server pengembangan dengan Nodemon:
```bash
npm run dev
```
Atau jalankan dalam mode production:
```bash
npm start
```

### 6. Buka Aplikasi
- **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
- **API Base URL:** [http://localhost:3000/api](http://localhost:3000/api)
- **Database Management (phpMyAdmin):** [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)

---

## 👤 Akun Demo

| Role | Email | Password | Keterangan |
|------|-------|----------|------------|
| Admin | `admin1@learnhire.com` | `admin123` | Akses penuh dashboard, kelola lowongan, kursus, perusahaan, & respon tiket support |
| Admin | `admin2@learnhire.com` | `admin123` | Administrator cadangan |
| User | `budi@example.com` | `user123` | Akun demo pencari kerja & peserta kursus |
| User | `sari@example.com` | `user123` | Akun demo pencari kerja & peserta kursus |
| User (Seeded) | `user1@test.com` | `password` | User bawaan dengan riwayat lamaran & kursus aktif |

---

## 🔗 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Header
Untuk endpoint yang membutuhkan autentikasi (Auth = ✅), lampirkan token pada HTTP Request Header:
```http
Authorization: Bearer <token_jwt>
```

---

### Endpoints Overview

#### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user baru | ❌ |
| POST | `/api/auth/login` | Login user & dapatkan token JWT | ❌ |
| GET | `/api/auth/profile` | Dapatkan profil user yang sedang login | ✅ |
| PUT | `/api/auth/profile` | Perbarui data profil user | ✅ |

##### POST `/api/auth/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 8,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

##### POST `/api/auth/login`
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 8,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### 2. Jobs (`/api/jobs`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | Dapatkan semua lowongan pekerjaan | ❌ |
| GET | `/api/jobs/:id` | Dapatkan detail lowongan pekerjaan | ❌ |
| POST | `/api/jobs` | Tambah lowongan baru | ✅ Admin |
| PUT | `/api/jobs/:id` | Update data lowongan | ✅ Admin |
| DELETE | `/api/jobs/:id` | Hapus lowongan | ✅ Admin |

**Query Parameters untuk `GET /api/jobs`:**
- `search` *(string)* - Pencarian berdasarkan judul lowongan pekerjaan
- `category_id` *(number)* - Filter berdasarkan ID kategori
- `type` *(string)* - Filter tipe pekerjaan (`Full-time`, `Part-time`, `Contract`, `Internship`)
- `limit` *(number)* - Batasi jumlah baris hasil data

##### GET `/api/jobs`
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Jobs fetched",
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "category_id": 1,
      "title": "Frontend Developer",
      "company_name": "Tokopedia",
      "company_logo": "default-company.png",
      "location": "Jakarta",
      "salary_min": "10000000.00",
      "salary_max": "15000000.00",
      "type": "Full-time",
      "category_name": "Technology",
      "created_at": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

---

#### 3. Courses (`/api/courses`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | Dapatkan semua kursus | ❌ |
| GET | `/api/courses/:id` | Dapatkan detail kursus | ❌ |
| POST | `/api/courses` | Tambah kursus baru | ✅ Admin |
| PUT | `/api/courses/:id` | Update data kursus | ✅ Admin |
| DELETE | `/api/courses/:id` | Hapus kursus | ✅ Admin |

**Query Parameters untuk `GET /api/courses`:**
- `search` *(string)* - Pencarian judul atau deskripsi kursus
- `category_id` *(number)* - Filter berdasarkan ID kategori
- `level` *(string)* - Filter level (`Beginner`, `Intermediate`, `Advanced`)
- `limit` *(number)* - Batasi jumlah hasil data

---

#### 4. Applications (`/api/applications`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/applications` | Dapatkan riwayat lamaran user (atau semua jika admin) | ✅ |
| POST | `/api/applications` | Kirim formulir lamaran kerja | ✅ |
| PUT | `/api/applications/:id` | Update status lamaran | ✅ Admin |
| DELETE | `/api/applications/:id` | Batalkan / hapus berkas lamaran | ✅ |

##### POST `/api/applications`
**Request Body:**
```json
{
  "job_id": 1,
  "cover_letter": "Saya sangat tertarik dengan posisi Frontend Developer dan memiliki pengalaman 2 tahun di bidang ini.",
  "cv_url": "https://example.com/my-cv.pdf"
}
```

---

#### 5. Enrollments (`/api/enrollments`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/enrollments` | Dapatkan daftar kursus yang didaftarkan user | ✅ |
| POST | `/api/enrollments` | Mendaftar pada suatu kursus online | ✅ |
| PUT | `/api/enrollments/:id` | Perbarui progres pembelajaran (0-100%) | ✅ |
| DELETE | `/api/enrollments/:id` | Membatalkan pendaftaran kursus | ✅ |

##### POST `/api/enrollments`
**Request Body:**
```json
{
  "course_id": 1
}
```

---

#### 6. Categories (`/api/categories`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories/jobs` | Dapatkan seluruh kategori lowongan kerja | ❌ |
| GET | `/api/categories/courses` | Dapatkan seluruh kategori kursus online | ❌ |

---

#### 7. Companies (`/api/companies`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/companies` | Dapatkan daftar seluruh perusahaan mitra | ❌ |
| GET | `/api/companies/:id` | Dapatkan detail data perusahaan mitra | ❌ |
| POST | `/api/companies` | Daftarkan perusahaan baru | ✅ Admin |
| PUT | `/api/companies/:id` | Perbarui data perusahaan | ✅ Admin |
| DELETE | `/api/companies/:id` | Hapus data perusahaan | ✅ Admin |

---

#### 8. Customer Support (`/api/support`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/support` | Dapatkan tiket bantuan (milik user, atau semua tiket jika admin) | ✅ |
| POST | `/api/support` | Buat tiket bantuan / pertanyaan baru | ✅ |
| PUT | `/api/support/:id` | Perbarui status atau berikan balasan tiket | ✅ Admin |
| DELETE | `/api/support/:id` | Hapus riwayat tiket bantuan | ✅ |

---

#### 9. Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard` | Dapatkan statistik agregat platform | ❌ |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalJobs": 12,
    "totalCourses": 10,
    "totalUsers": 7,
    "totalApplications": 5
  }
}
```

---

### Format Respons Error
Seluruh respon galat menggunakan format JSON terstandarisasi:
```json
{
  "success": false,
  "message": "Deskripsi rincian error yang terjadi"
}
```

### Kode Status HTTP
| Kode | Nama Status | Penjelasan |
|------|-------------|------------|
| **200** | OK | Permintaan berhasil diproses dan dikembalikan |
| **201** | Created | Sumber daya data baru berhasil dibuat |
| **400** | Bad Request | Parameter atau data body input tidak valid |
| **401** | Unauthorized | Token autentikasi tidak disertakan atau telah kadaluarsa |
| **403** | Forbidden | Token valid namun peran (role) tidak memiliki wewenang akses |
| **404** | Not Found | Entitas atau route yang diminta tidak ditemukan |
| **500** | Internal Server Error | Kesalahan pada server database atau logika backend |

---

## 🧪 Testing API

Anda dapat menggunakan **Postman**, **Thunder Client** (VS Code extension), atau **cURL** untuk menguji API LearnHire:

### 1. Register User Baru
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@test.com",
    "password": "user123",
    "phone": "081298765432"
  }
  ```

### 2. Login User
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "admin1@learnhire.com",
    "password": "admin123"
  }
  ```
- *Simpan atribut `data.token` untuk request berikutnya.*

### 3. Mengambil Katalog Lowongan Kerja
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/jobs?limit=5`

### 4. Melamar Pekerjaan (Perlu Token)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/applications`
- **Headers:**
  - `Authorization`: `Bearer <token_anda>`
  - `Content-Type`: `application/json`
- **Body (JSON):**
  ```json
  {
    "job_id": 1,
    "cover_letter": "Saya tertarik bergabung sebagai Frontend Developer di Tokopedia.",
    "cv_url": "https://drive.google.com/file/d/sample-cv"
  }
  ```

---

## 🔧 Troubleshooting

### 1. MySQL Tidak Terkoneksi (`ECONNREFUSED` / Access Denied)
- Pastikan modul MySQL pada **XAMPP Control Panel** berstatus hijau/running.
- Periksa port aktif MySQL (standar: `3306`). Jika menggunakan port lain (seperti `3307`), sesuaikan nilai `DB_PORT` di file `.env`.
- Periksa kredensial `DB_USER` (default XAMPP: `root`) dan `DB_PASSWORD` (default XAMPP: kosong).

### 2. Port 3000 Sudah Digunakan (`EADDRINUSE`)
- Ubah konfigurasi `PORT=3000` di `.env` menjadi port lain, misalnya `PORT=5000`.
- Atau matikan proses yang menggunakan port 3000 melalui terminal:
  ```powershell
  # Di Windows PowerShell:
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
  ```

### 3. Error 'Cannot find module'
- Terjadi ketika paket dependensi npm belum diinstal secara sempurna.
- Buka terminal di folder `backend/`, hapus folder `node_modules` jika ada, lalu jalankan:
  ```bash
  npm install
  ```

### 4. Database Belum Ada / Tabel Tidak Ditemukan (`ER_NO_SUCH_TABLE`)
- Buka phpMyAdmin di browser (`http://localhost/phpmyadmin/`).
- Import ulang file `database/database.sql` dengan memilih tab **Import** lalu klik **Go**.

---

## 📄 Lisensi
Project ini dikembangkan untuk keperluan akademik - Mata Kuliah Desain dan Rekayasa Sistem Informasi, Teknik Komputer.

---
Dibuat dengan ❤️ oleh **Tim LearnHire**
