# LearnHire API Reference Documentation 📖🚀

Dokumentasi lengkap antarmuka pemrograman aplikasi (REST API) untuk platform **LearnHire** (Aplikasi Lowongan Pekerjaan dan Kursus Online).

---

## 📌 Ringkasan Umum (Overview)

- **Base URL:** `http://localhost:3000/api`
- **Format Pertukaran Data:** JSON (`Content-Type: application/json; charset=utf-8`)
- **Skema Autentikasi:** JSON Web Token (JWT) dikirim melalui Header `Authorization`
- **Format Header Autentikasi:**
  ```http
  Authorization: Bearer <token_jwt>
  ```
- **Tingkatan Peran Pengguna (Roles):**
  - `user`: Pengguna umum yang dapat melihat katalog lowongan & kursus, melamar pekerjaan, mendaftar kursus, memperbarui profil, dan membuat tiket bantuan.
  - `admin`: Pengelola sistem yang memiliki hak istimewa untuk mengelola data lowongan, kursus, perusahaan, meninjau status lamaran, dan merespon tiket support.

---

## 🔒 Konvensi Respon Standar

### Respon Berhasil (Success Format)
```json
{
  "success": true,
  "message": "Deskripsi pesan status operasi",
  "data": {} // Objek atau array data hasil query
}
```

### Respon Galat (Error Format)
```json
{
  "success": false,
  "message": "Deskripsi alasan kegagalan permintaan"
}
```

### Daftar Kode Status HTTP
| Kode HTTP | Status | Keterangan |
|-----------|--------|------------|
| `200` | OK | Permintaan berhasil diproses dan dikembalikan data yang diminta. |
| `201` | Created | Sumber daya (resource) baru berhasil disimpan ke dalam basis data. |
| `400` | Bad Request | Parameter, format payload JSON, atau kelengkapan data tidak valid. |
| `401` | Unauthorized | Token autentikasi tidak disertakan, format salah, atau telah kadaluarsa. |
| `403` | Forbidden | Autentikasi berhasil, namun peran pengguna (role) tidak memiliki hak akses ke endpoint ini. |
| `404` | Not Found | Entitas atau rute endpoint tidak ditemukan di server. |
| `500` | Internal Server Error | Kesalahan tak terduga pada server atau kegagalan query SQL. |

---

## 📚 Indeks Endpoint API

1. [Autentikasi & Akun (`/auth`)](#1-autentikasi--akun-apiauth)
2. [Lowongan Pekerjaan (`/jobs`)](#2-lowongan-pekerjaan-apijobs)
3. [Kursus Online (`/courses`)](#3-kursus-online-apicourses)
4. [Lamaran Pekerjaan (`/applications`)](#4-lamaran-pekerjaan-apiapplications)
5. [Pendaftaran Kursus (`/enrollments`)](#5-pendaftaran-kursus-apienrollments)
6. [Kategori (`/categories`)](#6-kategori-apicategories)
7. [Perusahaan Mitra (`/companies`)](#7-perusahaan-mitra-apicompanies)
8. [Layanan Bantuan / Customer Support (`/support`)](#8-layanan-bantuan--tiket-support-apisupport)
9. [Dashboard Statistik (`/dashboard`)](#9-dashboard-statistik-apidashboard)

---

## 1. Autentikasi & Akun (`/api/auth`)

### 1.1 Register Pengguna Baru
Mendaftarkan akun pengguna baru (`role: 'user'`).

- **Endpoint:** `POST /api/auth/register`
- **Autentikasi:** Bebas (Publik)
- **Request Body:**
  ```json
  {
    "name": "Ahmad Fauzi",
    "email": "ahmad.fauzi@example.com",
    "password": "passwordAman123",
    "phone": "081234567890"
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 8,
        "name": "Ahmad Fauzi",
        "email": "ahmad.fauzi@example.com",
        "role": "user"
      }
    }
  }
  ```
- **Edge Cases & Error Handling:**
  - *Data tidak lengkap (400 Bad Request):*
    ```json
    { "success": false, "message": "All fields are required" }
    ```
  - *Email sudah pernah digunakan (400 Bad Request):*
    ```json
    { "success": false, "message": "Email already registered" }
    ```

---

### 1.2 Login Pengguna
Verifikasi kredensial email & password dan mendapatkan token JWT.

- **Endpoint:** `POST /api/auth/login`
- **Autentikasi:** Bebas (Publik)
- **Request Body:**
  ```json
  {
    "email": "ahmad.fauzi@example.com",
    "password": "passwordAman123"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 8,
        "name": "Ahmad Fauzi",
        "email": "ahmad.fauzi@example.com",
        "role": "user"
      }
    }
  }
  ```
- **Edge Cases & Error Handling:**
  - *Email atau password salah (401 Unauthorized):*
    ```json
    { "success": false, "message": "Invalid email or password" }
    ```
  - *Body kosong / parameter kurang (400 Bad Request):*
    ```json
    { "success": false, "message": "Email and password required" }
    ```

---

### 1.3 Mendapatkan Profil Pengguna Login
Mengambil data detail pengguna yang sedang terautentikasi berdasarkan token Bearer.

- **Endpoint:** `GET /api/auth/profile`
- **Autentikasi:** Diperlukan (User / Admin)
- **Header:** `Authorization: Bearer <token>`
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile fetched",
    "data": {
      "id": 8,
      "name": "Ahmad Fauzi",
      "email": "ahmad.fauzi@example.com",
      "phone": "081234567890",
      "address": "Jl. Teknik Komputer No. 10, Surabaya",
      "avatar": "default-avatar.png",
      "bio": "Web developer antusias dengan minat pada ekosistem JavaScript & MySQL.",
      "skills": "JavaScript, Node.js, Express, MySQL, HTML, CSS",
      "cv_url": "https://example.com/cv-ahmad.pdf",
      "role": "user",
      "created_at": "2026-10-02T04:00:00.000Z",
      "updated_at": "2026-10-02T04:10:00.000Z"
    }
  }
  ```
- **Edge Cases & Error Handling:**
  - *Token tidak disertakan (401 Unauthorized):*
    ```json
    { "success": false, "message": "Access denied. No token provided." }
    ```
  - *Token tidak valid / expired (403 Forbidden):*
    ```json
    { "success": false, "message": "Invalid or expired token." }
    ```

---

### 1.4 Memperbarui Data Profil Pengguna
Mengubah informasi profil pengguna yang sedang login.

- **Endpoint:** `PUT /api/auth/profile`
- **Autentikasi:** Diperlukan (User / Admin)
- **Header:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Ahmad Fauzi, S.Kom.",
    "phone": "081299998888",
    "address": "Surabaya, Jawa Timur",
    "avatar": "avatar-user-8.png",
    "bio": "Full-stack developer fokus pada performa web.",
    "skills": "React.js, Node.js, Express, MySQL, Docker",
    "cv_url": "https://storage.example.com/cv/ahmad-updated.pdf"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully"
  }
  ```

---

## 2. Lowongan Pekerjaan (`/api/jobs`)

### 2.1 Mendapatkan Daftar Semua Lowongan
Mendapatkan katalog lowongan kerja aktif dengan dukungan pencarian dan penyaringan data.

- **Endpoint:** `GET /api/jobs`
- **Autentikasi:** Bebas (Publik)
- **Query Parameters:**
  | Parameter | Tipe | Default | Penjelasan | Contoh |
  |-----------|------|---------|------------|--------|
  | `search` | String | - | Mencari kata kunci pada judul lowongan | `search=developer` |
  | `category_id` | Integer | - | Filter menurut ID kategori lowongan | `category_id=1` |
  | `type` | String | - | Filter tipe kontrak kerja | `type=Full-time` |
  | `limit` | Integer | - | Membatasi jumlah record data | `limit=10` |
- **Respon Berhasil (200 OK):**
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
        "description": "Looking for experienced frontend developer with React/Vue knowledge.",
        "requirements": "Minimal 2 tahun pengalaman, menguasai HTML, CSS, JavaScript modern.",
        "salary_min": "10000000.00",
        "salary_max": "15000000.00",
        "location": "Jakarta",
        "type": "Full-time",
        "status": "active",
        "created_at": "2024-01-15T00:00:00.000Z",
        "company_name": "Tokopedia",
        "company_logo": "default-company.png",
        "category_name": "Technology"
      }
    ]
  }
  ```

---

### 2.2 Mendapatkan Detail Lowongan Spesifik
Mengambil rincian lowongan kerja berdasarkan ID.

- **Endpoint:** `GET /api/jobs/:id`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Job fetched",
    "data": {
      "id": 1,
      "company_id": 1,
      "category_id": 1,
      "title": "Frontend Developer",
      "description": "Looking for experienced frontend developer.",
      "requirements": "Menguasai JavaScript, CSS modern, dan responsive design.",
      "salary_min": "10000000.00",
      "salary_max": "15000000.00",
      "location": "Jakarta",
      "type": "Full-time",
      "status": "active",
      "created_at": "2024-01-15T00:00:00.000Z",
      "company_name": "Tokopedia",
      "company_logo": "default-company.png",
      "company_location": "Jakarta",
      "company_website": "https://tokopedia.com",
      "category_name": "Technology"
    }
  }
  ```
- **Edge Cases & Error Handling:**
  - *ID tidak ditemukan (404 Not Found):*
    ```json
    { "success": false, "message": "Job not found" }
    ```

---

### 2.3 Menambah Lowongan Baru (Admin)
- **Endpoint:** `POST /api/jobs`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Header:** `Authorization: Bearer <admin_token>`
- **Request Body:**
  ```json
  {
    "company_id": 1,
    "category_id": 1,
    "title": "Senior Backend Architect",
    "description": "Membangun sistem microservices skala tinggi.",
    "requirements": "Pengalaman 5+ tahun arsitektur cloud, Node.js, Go, Kubernetes.",
    "salary_min": 25000000,
    "salary_max": 40000000,
    "location": "Jakarta / Hybrid",
    "type": "Full-time",
    "status": "active"
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "Job created",
    "data": { "id": 13 }
  }
  ```
- **Error Hak Akses (403 Forbidden):**
  ```json
  { "success": false, "message": "Admin access required" }
  ```

---

### 2.4 Mengubah Data Lowongan (Admin)
- **Endpoint:** `PUT /api/jobs/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Header:** `Authorization: Bearer <admin_token>`
- **Request Body:**
  ```json
  {
    "title": "Senior Frontend Specialist",
    "salary_min": 15000000,
    "salary_max": 22000000,
    "status": "active"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Job updated" }
  ```

---

### 2.5 Menghapus Lowongan (Admin)
- **Endpoint:** `DELETE /api/jobs/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Header:** `Authorization: Bearer <admin_token>`
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Job deleted" }
  ```

---

## 3. Kursus Online (`/api/courses`)

### 3.1 Mendapatkan Daftar Semua Kursus
Melihat daftar katalog kursus online beserta filter level dan pencarian.

- **Endpoint:** `GET /api/courses`
- **Autentikasi:** Bebas (Publik)
- **Query Parameters:**
  | Parameter | Tipe | Keterangan | Contoh |
  |-----------|------|------------|--------|
  | `search` | String | Mencari judul atau instruktur | `search=react` |
  | `category_id` | Integer | ID kategori kursus | `category_id=1` |
  | `level` | String | `Beginner`, `Intermediate`, `Advanced` | `level=Beginner` |
  | `limit` | Integer | Membatasi jumlah kursus yang ditampilkan | `limit=6` |
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Courses fetched",
    "data": [
      {
        "id": 1,
        "category_id": 1,
        "title": "Complete Web Development",
        "description": "Learn HTML, CSS, JS, Node.",
        "instructor": "John Doe",
        "duration": "20 hours",
        "level": "Beginner",
        "price": "500000.00",
        "image": "default-course.png",
        "rating": "4.80",
        "total_students": 150,
        "status": "active",
        "category_name": "Programming"
      }
    ]
  }
  ```

---

### 3.2 Mendapatkan Detail Kursus
- **Endpoint:** `GET /api/courses/:id`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Course fetched",
    "data": {
      "id": 1,
      "category_id": 1,
      "title": "Complete Web Development",
      "description": "Kurikulum komprehensif mulai dari dasar web hingga full-stack.",
      "instructor": "John Doe",
      "duration": "20 hours",
      "level": "Beginner",
      "price": "500000.00",
      "image": "default-course.png",
      "rating": "4.80",
      "total_students": 150,
      "status": "active",
      "category_name": "Programming"
    }
  }
  ```
- **Error (404 Not Found):**
  ```json
  { "success": false, "message": "Course not found" }
  ```

---

### 3.3 Menambah Kursus Baru (Admin)
- **Endpoint:** `POST /api/courses`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Request Body:**
  ```json
  {
    "category_id": 1,
    "title": "Mastering TypeScript & GraphQL",
    "description": "Panduan profesional pengembangan backend modern type-safe.",
    "instructor": "Dr. Alex Johnson",
    "duration": "16 hours",
    "level": "Intermediate",
    "price": 450000,
    "image": "ts-graphql.png",
    "rating": 5.0,
    "total_students": 0,
    "status": "active"
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "Course created",
    "data": { "id": 11 }
  }
  ```

---

### 3.4 Mengubah Kursus (Admin)
- **Endpoint:** `PUT /api/courses/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Request Body:**
  ```json
  {
    "price": 399000,
    "duration": "18 hours"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Course updated" }
  ```

---

### 3.5 Menghapus Kursus (Admin)
- **Endpoint:** `DELETE /api/courses/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Course deleted" }
  ```

---

## 4. Lamaran Pekerjaan (`/api/applications`)

### 4.1 Mendapatkan Lamaran
Jika diakses oleh akun `user`, endpoint mengembalikan seluruh lamaran milik user tersebut. Jika diakses oleh `admin`, endpoint mengembalikan seluruh berkas lamaran dari semua pelamar.

- **Endpoint:** `GET /api/applications`
- **Autentikasi:** Diperlukan (User / Admin)
- **Header:** `Authorization: Bearer <token>`
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Applications fetched",
    "data": [
      {
        "id": 1,
        "user_id": 3,
        "job_id": 1,
        "cover_letter": "I am a good fit.",
        "cv_url": "https://example.com/cv.pdf",
        "status": "pending",
        "created_at": "2026-10-02T02:00:00.000Z",
        "job_title": "Frontend Developer",
        "company_name": "Tokopedia",
        "applicant_name": "User One",
        "applicant_email": "user1@test.com"
      }
    ]
  }
  ```

---

### 4.2 Mengirimkan Lamaran Baru
Mengajukan surat lamaran kerja pada lowongan tertentu. Backend mencegah duplikasi lamaran pada lowongan yang sama untuk user yang bersangkutan.

- **Endpoint:** `POST /api/applications`
- **Autentikasi:** Diperlukan (User)
- **Header:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "job_id": 2,
    "cover_letter": "Saya tertarik dengan posisi Data Analyst dan siap memberikan kontribusi maksimal.",
    "cv_url": "https://example.com/files/cv-2026.pdf"
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "Application submitted",
    "data": { "id": 6 }
  }
  ```
- **Edge Cases & Error Handling:**
  - *Sudah pernah melamar lowongan ini sebelumnya (400 Bad Request):*
    ```json
    { "success": false, "message": "You have already applied for this job" }
    ```

---

### 4.3 Mengubah Status Lamaran (Admin)
Mengubah status proses seleksi (`pending`, `reviewed`, `accepted`, `rejected`).

- **Endpoint:** `PUT /api/applications/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Header:** `Authorization: Bearer <admin_token>`
- **Request Body:**
  ```json
  {
    "status": "accepted"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Application updated" }
  ```
- **Error Hak Akses (403 Forbidden):**
  ```json
  { "success": false, "message": "Forbidden" }
  ```

---

### 4.4 Menghapus / Membatalkan Lamaran
Pengguna hanya dapat menghapus lamarannya sendiri; admin dapat menghapus lamaran mana pun.

- **Endpoint:** `DELETE /api/applications/:id`
- **Autentikasi:** Diperlukan (Pemilik berkas atau Admin)
- **Header:** `Authorization: Bearer <token>`
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Application deleted" }
  ```
- **Error Otorisasi (403 Forbidden):**
  ```json
  { "success": false, "message": "Forbidden" }
  ```

---

## 5. Pendaftaran Kursus (`/api/enrollments`)

### 5.1 Mendapatkan Daftar Kursus Pengguna
Mengambil daftar kursus yang sedang atau telah diikuti oleh user yang login.

- **Endpoint:** `GET /api/enrollments`
- **Autentikasi:** Diperlukan (User / Admin)
- **Header:** `Authorization: Bearer <token>`
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Enrollments fetched",
    "data": [
      {
        "id": 1,
        "user_id": 3,
        "course_id": 1,
        "progress": 45,
        "status": "enrolled",
        "enrolled_at": "2026-10-01T10:00:00.000Z",
        "completed_at": null,
        "course_title": "Complete Web Development",
        "instructor": "John Doe",
        "duration": "20 hours",
        "course_image": "default-course.png"
      }
    ]
  }
  ```

---

### 5.2 Mendaftar ke Kursus (Enroll)
Mendaftarkan akun ke sebuah kursus online. Backend mencegah pendaftaran ganda pada kursus yang sama.

- **Endpoint:** `POST /api/enrollments`
- **Autentikasi:** Diperlukan (User)
- **Header:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "course_id": 3
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "Enrolled successfully",
    "data": { "id": 6 }
  }
  ```
- **Edge Cases & Error Handling:**
  - *Sudah terdaftar pada kursus ini (400 Bad Request):*
    ```json
    { "success": false, "message": "Already enrolled in this course" }
    ```

---

### 5.3 Memperbarui Progres Belajar Kursus
Mengupdate persentase materi kursus yang telah diselesaikan (0-100%) dan status (`enrolled`, `completed`, `dropped`).

- **Endpoint:** `PUT /api/enrollments/:id`
- **Autentikasi:** Diperlukan (Hanya pemilik pendaftaran)
- **Header:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "progress": 100,
    "status": "completed"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Enrollment updated" }
  ```

---

### 5.4 Membatalkan Pendaftaran Kursus
- **Endpoint:** `DELETE /api/enrollments/:id`
- **Autentikasi:** Diperlukan (Hanya pemilik pendaftaran)
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Enrollment deleted" }
  ```

---

## 6. Kategori (`/api/categories`)

### 6.1 Kategori Lowongan Pekerjaan
- **Endpoint:** `GET /api/categories/jobs`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Job categories fetched",
    "data": [
      { "id": 1, "name": "Technology", "icon": "fa-code" },
      { "id": 2, "name": "Design", "icon": "fa-palette" },
      { "id": 3, "name": "Marketing", "icon": "fa-bullhorn" },
      { "id": 4, "name": "Finance", "icon": "fa-chart-line" },
      { "id": 5, "name": "Engineering", "icon": "fa-cogs" },
      { "id": 6, "name": "Data Science", "icon": "fa-database" }
    ]
  }
  ```

---

### 6.2 Kategori Kursus Online
- **Endpoint:** `GET /api/categories/courses`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Course categories fetched",
    "data": [
      { "id": 1, "name": "Programming", "icon": "fa-laptop-code" },
      { "id": 2, "name": "UI/UX Design", "icon": "fa-paint-brush" },
      { "id": 3, "name": "Data Science", "icon": "fa-chart-pie" },
      { "id": 4, "name": "Digital Marketing", "icon": "fa-ad" },
      { "id": 5, "name": "Business", "icon": "fa-briefcase" },
      { "id": 6, "name": "Language", "icon": "fa-language" }
    ]
  }
  ```

---

## 7. Perusahaan Mitra (`/api/companies`)

### 7.1 Mendapatkan Semua Perusahaan Mitra
- **Endpoint:** `GET /api/companies`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Companies fetched",
    "data": [
      {
        "id": 1,
        "name": "Tokopedia",
        "logo": "default-company.png",
        "description": "Perusahaan teknologi e-commerce terkemuka di Indonesia.",
        "location": "Jakarta",
        "website": "https://tokopedia.com",
        "industry": "Technology"
      }
    ]
  }
  ```

---

### 7.2 Mendapatkan Detail Perusahaan
- **Endpoint:** `GET /api/companies/:id`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Company fetched",
    "data": {
      "id": 1,
      "name": "Tokopedia",
      "logo": "default-company.png",
      "description": "Perusahaan teknologi e-commerce terkemuka di Indonesia.",
      "location": "Jakarta",
      "website": "https://tokopedia.com",
      "industry": "Technology"
    }
  }
  ```

---

### 7.3 Menambah Perusahaan Baru (Admin)
- **Endpoint:** `POST /api/companies`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Request Body:**
  ```json
  {
    "name": "Nusantara AI Labs",
    "logo": "nusantara-ai.png",
    "description": "Riset dan rekayasa kecerdasan buatan enterprise.",
    "location": "Bandung",
    "website": "https://nusantara.ai",
    "industry": "Artificial Intelligence"
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "Company created",
    "data": { "id": 7 }
  }
  ```

---

### 7.4 Mengubah Data Perusahaan (Admin)
- **Endpoint:** `PUT /api/companies/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Company updated" }
  ```

---

### 7.5 Menghapus Perusahaan (Admin)
- **Endpoint:** `DELETE /api/companies/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Company deleted" }
  ```

---

## 8. Layanan Bantuan / Tiket Support (`/api/support`)

### 8.1 Mendapatkan Tiket Bantuan
User melihat tiket kendala yang diajukannya sendiri; admin dapat melihat seluruh antrian tiket bantuan dari semua pengguna.

- **Endpoint:** `GET /api/support`
- **Autentikasi:** Diperlukan (User / Admin)
- **Header:** `Authorization: Bearer <token>`
- **Respon Berhasil (200 OK):**
  ```json
  {
    "success": true,
    "message": "Messages fetched",
    "data": [
      {
        "id": 1,
        "user_id": 3,
        "user_name": "User One",
        "user_email": "user1@test.com",
        "subject": "Kendala Sertifikat Kursus",
        "message": "Saya telah menyelesaikan progres 100% pada kursus Web Development namun sertifikat belum terbit.",
        "reply": "Halo, sertifikat Anda sedang kami validasi dan akan diterbitkan dalam 1x24 jam kerja.",
        "status": "in_progress",
        "created_at": "2026-10-01T14:30:00.000Z",
        "updated_at": "2026-10-02T08:00:00.000Z"
      }
    ]
  }
  ```

---

### 8.2 Mengirimkan Tiket Bantuan Baru
- **Endpoint:** `POST /api/support`
- **Autentikasi:** Diperlukan (User)
- **Header:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "subject": "Pertanyaan Mengenai Portofolio Lamaran",
    "message": "Apakah format lampiran CV hanya diperbolehkan PDF atau bisa menyertakan link GitHub?"
  }
  ```
- **Respon Berhasil (201 Created):**
  ```json
  {
    "success": true,
    "message": "Message sent",
    "data": { "id": 4 }
  }
  ```

---

### 8.3 Merespon & Mengubah Status Tiket (Admin)
- **Endpoint:** `PUT /api/support/:id`
- **Autentikasi:** Diperlukan (Khusus Admin)
- **Header:** `Authorization: Bearer <admin_token>`
- **Request Body:**
  ```json
  {
    "reply": "Anda dapat menyertakan link URL portofolio atau GitHub pada kolom pesan lamaran maupun cover letter.",
    "status": "resolved"
  }
  ```
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Message updated" }
  ```

---

### 8.4 Menghapus Riwayat Tiket
- **Endpoint:** `DELETE /api/support/:id`
- **Autentikasi:** Diperlukan (Pembuat tiket atau Admin)
- **Respon Berhasil (200 OK):**
  ```json
  { "success": true, "message": "Message deleted" }
  ```

---

## 9. Dashboard Statistik (`/api/dashboard`)

### 9.1 Mengambil Statistik Agregat Platform
Mengembalikan indikator performa utama platform (jumlah pekerjaan aktif, kursus aktif, total pengguna, dan total lamaran).

- **Endpoint:** `GET /api/dashboard`
- **Autentikasi:** Bebas (Publik)
- **Respon Berhasil (200 OK):**
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

## 🛡️ Keamanan & Penanganan Edge Cases

1. **Proteksi Password:**
   - Password pengguna di-hash satu arah menggunakan `bcryptjs` dengan 10 salt rounds sebelum disimpan ke database.
   - Password mentah tidak pernah disimpan ataupun dikembalikan pada payload respon API mana pun.

2. **Validasi Duplikasi Database:**
   - Tabel `users` memiliki unique key pada kolom `email`. Pendaftaran dengan email yang sama akan ditolak secara eksplisit dengan status 400.
   - Tabel `job_applications` memiliki unique constraint pada pasangan `(user_id, job_id)` untuk mencegah spam lamaran berulang.
   - Tabel `course_enrollments` memiliki unique constraint pada pasangan `(user_id, course_id)` guna memastikan seorang pengguna hanya terdaftar satu kali per kursus.

3. **Verifikasi Token JWT:**
   - Token JWT ditandatangani menggunakan `process.env.JWT_SECRET` dengan masa aktif `24h`.
   - Jika token kadaluarsa atau tanda tangan tidak valid, middleware otomatis mengembalikan `403 Forbidden` atau `401 Unauthorized`.

4. **Kontrol Akses Peran Pengguna (Role-based Access Control):**
   - Middleware `isAdmin` memeriksa klaim `req.user.role === 'admin'`. Jika pengguna biasa mencoba mengakses rute CRUD manajerial, request ditolak dengan `403 Forbidden`.

5. **Sanitasi Header & CORS:**
   - Paket `helmet` digunakan untuk menyetel header HTTP yang aman (mencegah XSS, MIME sniff, dan clickjacking).
   - Paket `cors` diaktifkan untuk melayani permintaan lintas domain antara backend dan antarmuka web.
