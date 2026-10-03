import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
        
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header
        self.drawString(20 * mm, 285 * mm, "Dokumentasi Lengkap Struktur dan File Project LearnHire")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 282 * mm, 190 * mm, 282 * mm)
        
        # Footer
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        page_str = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)
        self.drawString(20 * mm, 11 * mm, "Teknik Komputer - Institut Teknologi Sepuluh Nopember (ITS)")
        self.restoreState()

def build_pdf():
    pdf_filename = r"c:\Users\M S I\OneDrive - Institut Teknologi Sepuluh Nopember\Documents\ANTIGRAVITY\learnhire\DOKUMENTASI_LENGKAP_LEARNHIRE.pdf"
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=22 * mm,
        bottomMargin=22 * mm
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor('#334155'),
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e40af'),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6,
        alignment=4  # Justified
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3,
        alignment=0
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor('#0f172a'),
        alignment=0
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # ================= COVER PAGE =================
    story.append(Spacer(1, 20 * mm))
    tag_table = Table([[
        Paragraph("<font color='#ffffff'><b>LAPORAN RESMI DOKUMENTASI SISTEM</b></font>", ParagraphStyle('Tag', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, alignment=1))
    ]], colWidths=[80 * mm])
    tag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#2563eb')),
        ('CORNERPAD', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(tag_table)
    story.append(Spacer(1, 10 * mm))

    story.append(Paragraph("LearnHire", title_style))
    story.append(Paragraph(
        "Platform Aplikasi Lowongan Pekerjaan dan Kursus Online Terpadu<br/>"
        "<i>Arsitektur Sistem, Struktur Direktori Lengkap, Database Relasional, dan Spesifikasi REST API</i>",
        subtitle_style
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#3b82f6'), spaceAfter=20))

    meta_data = [
        [Paragraph("<b>Mata Kuliah:</b>", table_cell_bold), Paragraph("Desain dan Rekayasa Sistem (DRS) B", table_cell_style)],
        [Paragraph("<b>Departemen:</b>", table_cell_bold), Paragraph("Teknik Komputer - FTEIC", table_cell_style)],
        [Paragraph("<b>Institusi:</b>", table_cell_bold), Paragraph("Institut Teknologi Sepuluh Nopember (ITS)", table_cell_style)],
        [Paragraph("<b>Dosen Pengampu:</b>", table_cell_bold), Paragraph("Dr. Supeno Mardi Susiki Nugroho, S.T., M.T.", table_cell_style)],
        [Paragraph("<b>Arsitektur:</b>", table_cell_bold), Paragraph("Full-Stack MVC/REST (Browser ⇄ REST API ⇄ Express ⇄ MySQL)", table_cell_style)],
        [Paragraph("<b>Teknologi Backend:</b>", table_cell_bold), Paragraph("Node.js (v20), Express.js, JWT, Bcryptjs, Helmet, CORS", table_cell_style)],
        [Paragraph("<b>Teknologi Frontend:</b>", table_cell_bold), Paragraph("HTML5, CSS3 Dark Glassmorphism, Vanilla JavaScript ES6+", table_cell_style)],
        [Paragraph("<b>Database:</b>", table_cell_bold), Paragraph("MySQL / MariaDB (XAMPP Port 3306), phpMyAdmin", table_cell_style)],
        [Paragraph("<b>Jumlah Berkas:</b>", table_cell_bold), Paragraph("65 Berkas Terintegrasi Penuh (Tanpa Mock Data)", table_cell_style)],
        [Paragraph("<b>Waktu Penyusunan:</b>", table_cell_bold), Paragraph("Oktober 2026", table_cell_style)],
    ]
    meta_table = Table(meta_data, colWidths=[45 * mm, 125 * mm])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph(
        "<font color='#64748b' size='8'>Dokumen ini disusun sebagai dokumentasi teknis menyeluruh "
        "yang menjelaskan setiap modul, berkas, basis data, dan logika pemrograman yang menyusun project LearnHire.</font>",
        ParagraphStyle('CoverFoot', parent=body_style, alignment=1)
    ))
    story.append(PageBreak())

    # ================= SECTION 1: RINGKASAN & KONSEP BISNIS =================
    story.append(Paragraph("1. Ringkasan Eksekutif & Konsep Bisnis LearnHire", h1_style))
    story.append(Paragraph(
        "<b>LearnHire</b> adalah sistem platform berbasis web yang menggabungkan dua fungsionalitas utama: "
        "portal lowongan pekerjaan (<i>Job Board</i>) dan sistem manajemen pembelajaran kursus (<i>Course LMS</i>). "
        "Sistem ini dirancang untuk menyelesaikan masalah tingginya kesenjangan keterampilan (<i>skill gap</i>) "
        "antara pencari kerja dengan kebutuhan riil industri.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Nilai Inovasi Utama (\"Learn\" + \"Hire\"):</b> Pada platform rekrutmen biasa, pelamar yang ditolak karena "
        "tidak memenuhi kualifikasi hanya menerima notifikasi penolakan tanpa arahan perbaikan. Di LearnHire, sistem "
        "menghubungkan evaluasi lamaran dengan katalog pelatihan. Jika pelamar kekurangan skill teknis tertentu (misal: React atau Node.js), "
        "sistem dapat merekomendasikan kursus in-house di LearnHire untuk menutup kekurangan tersebut.",
        body_style
    ))

    story.append(Paragraph("1.1 Model Bisnis Kemitraan (B2B Talent Partnership)", h2_style))
    story.append(Paragraph(
        "Platform ini beroperasi dengan model <i>Hiring Partner</i> resmi. Perusahaan-perusahaan yang membuka lowongan "
        "(seperti Tokopedia, Gojek, Traveloka, Shopee, Bukalapak, Telkom) bermitra dengan LearnHire agar proses rekrutmen awal "
        "menjadi lebih efisien. LearnHire bertindak sebagai kurator awal yang menyaring ribuan pelamar dan hanya menyalurkan "
        "kandidat yang telah terverifikasi berkas dan keahliannya.",
        body_style
    ))

    story.append(Paragraph("1.2 Alur Seleksi: Filter Bertingkat (Two-Stage Screening)", h2_style))
    story.append(Paragraph(
        "Mekanisme seleksi pelamar di dalam platform dibagi menjadi dua tahap yang harmonis:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Tahap 1 - Administrasi & Pre-Screening (Admin Web LearnHire):</b> Pelamar mengirimkan berkas (status <i>pending</i>). "
        "Admin platform meninjau kelayakan format CV, kelengkapan data diri, dan relevansi skill. Berkas yang memenuhi kriteria diubah "
        "statusnya menjadi <b>reviewed</b> dan diteruskan ke HRD instansi tujuan.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Tahap 2 - Seleksi Akhir & Keputusan (HRD Instansi Rekanan):</b> Pihak HRD instansi menyeleksi kandidat yang telah lolos "
        "tahap 1. Mengingat kuota lowongan terbatas, HRD menentukan siapa yang berhak lanjut ke tahap wawancara/kontrak. Admin platform "
        "memperbarui status di sistem menjadi <b>accepted</b> (diterima) atau <b>rejected</b> (ditolak).",
        bullet_style
    ))

    story.append(Paragraph("1.3 Arsitektur Aliran Data (Clean Architecture)", h2_style))
    story.append(Paragraph(
        "Aplikasi menerapkan pemisahan tugas yang tegas (<i>Separation of Concerns</i>). Sisi frontend (klien) "
        "<b>sama sekali tidak diperbolehkan mengakses database MySQL secara langsung</b>. Seluruh operasi CRUD diwajibkan melalui "
        "antarmuka REST API berformat JSON:",
        body_style
    ))
    
    flow_box = [
        [Paragraph(
            "<b>Browser Klien</b> (HTML5/CSS3/JS)<br/>"
            "↓ <i>Fetch API (JSON) + Authorization Bearer JWT</i><br/>"
            "<b>REST API Layer</b> (Express.js Routing di port 3000)<br/>"
            "↓ <i>Input Validation, Bcrypt Verification, Error Handling Middleware</i><br/>"
            "<b>Controllers & Models</b> (Business Logic & Prepared Statements)<br/>"
            "↓ <i>MySQL2 Connection Pool</i><br/>"
            "<b>Database MySQL</b> (learnhire_db di port 3306) ⇄ <b>phpMyAdmin</b>",
            ParagraphStyle('FlowText', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12.5, alignment=1)
        )]
    ]
    flow_table = Table(flow_box, colWidths=[170 * mm])
    flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(flow_table)
    story.append(Spacer(1, 5 * mm))

    # ================= SECTION 2: POHON STRUKTUR FOLDER =================
    story.append(PageBreak())
    story.append(Paragraph("2. Struktur Lengkap Direktori Project", h1_style))
    story.append(Paragraph(
        "Project LearnHire terdiri dari 65 berkas yang terbagi ke dalam layer Database, Backend Express, dan Frontend Statis:",
        body_style
    ))

    tree_text = (
        "learnhire/\n"
        "├── .gitignore                          [Konfigurasi pengabaian file Git]\n"
        "├── README.md                           [Panduan instalasi & pengoperasian lengkap]\n"
        "├── DOKUMENTASI_LENGKAP_LEARNHIRE.pdf   [Dokumen resmi arsitektur sistem]\n"
        "│\n"
        "├── database/\n"
        "│   └── database.sql                    [Skema DDL/DML 9 tabel MySQL & data awal]\n"
        "│\n"
        "├── backend/\n"
        "│   ├── server.js                       [Entry point Express server & static serving]\n"
        "│   ├── package.json                    [Daftar package npm resmi]\n"
        "│   ├── .env / .env.example             [Konfigurasi variabel lingkungan & port]\n"
        "│   ├── config/\n"
        "│   │   └── database.js                 [Koneksi Pool MySQL2 Async/Await]\n"
        "│   ├── middleware/\n"
        "│   │   ├── auth.middleware.js          [Guard JWT verifyToken & isAdmin]\n"
        "│   │   └── error.middleware.js         [Handler 404 notFound & 500 errorHandler]\n"
        "│   ├── models/                         [Layer query SQL Prepared Statements]\n"
        "│   │   ├── user.model.js               [CRUD pengguna & COALESCE update]\n"
        "│   │   ├── job.model.js                [Query lowongan kerja & filter multi-kolom]\n"
        "│   │   ├── company.model.js            [Query perusahaan mitra penyedia kerja]\n"
        "│   │   ├── course.model.js             [Query katalog kursus & filter tingkat]\n"
        "│   │   ├── application.model.js        [Transaksi lamaran kerja & status seleksi]\n"
        "│   │   ├── enrollment.model.js         [Pendaftaran kursus & persentase progres]\n"
        "│   │   ├── category.model.js           [Pengambilan kategori loker & kursus]\n"
        "│   │   └── support.model.js            [Tiket komplain & tanya-jawab pengguna]\n"
        "│   ├── controllers/                    [Layer logika bisnis HTTP]\n"
        "│   │   ├── auth.controller.js          [Register bcrypt, login JWT, profil]\n"
        "│   │   ├── job.controller.js           [CRUD lowongan kerja]\n"
        "│   │   ├── company.controller.js       [CRUD profil perusahaan mitra]\n"
        "│   │   ├── course.controller.js        [CRUD kursus online]\n"
        "│   │   ├── application.controller.js   [Pengajuan & review lamaran kerja]\n"
        "│   │   ├── enrollment.controller.js    [Enroll kursus & update progres belajar]\n"
        "│   │   ├── category.controller.js      [Penyedia data dropdown kategori]\n"
        "│   │   ├── support.controller.js       [Tiket customer service pengguna]\n"
        "│   │   └── dashboard.controller.js     [Agregasi metrik total jobs, courses, apps]\n"
        "│   ├── routes/                         [Layer rute HTTP Express Router]\n"
        "│   │   ├── index.js                    [Agregator rute ke prefix /api]\n"
        "│   │   └── *.routes.js (9 file)        [Pemetaan method GET, POST, PUT, DELETE]\n"
        "│   └── docs/\n"
        "│       └── api.md                      [Spesifikasi teknis REST API lengkap]\n"
        "│\n"
        "└── frontend/\n"
        "    ├── index.html                      [Landing page publik - Canva Begin Page]\n"
        "    ├── components/\n"
        "    │   └── sidebar.html                [Navigasi samping responsif + role badge]\n"
        "    ├── pages/ (10 halaman)\n"
        "    │   ├── login.html & register.html  [Autentikasi masuk dan pendaftaran]\n"
        "    │   ├── home.html                   [Dashboard beranda pengguna login]\n"
        "    │   ├── jobs.html & job-detail.html [Eksplorasi loker & formulir kirim CV]\n"
        "    │   ├── courses.html & course-detail.html [Katalog kelas & formulir enroll]\n"
        "    │   ├── applications.html           [Tabel tracking status lamaran]\n"
        "    │   ├── my-courses.html             [Pelacak progres pembelajaran aktif]\n"
        "    │   ├── profile.html                [Manajemen data profil & keahlian]\n"
        "    │   └── support.html                [Pusat tiket customer support]\n"
        "    └── assets/\n"
        "        ├── css/style.css               [Tema Dark Glassmorphism, Poppins, Grid]\n"
        "        └── js/                         [Pustaka JavaScript klien]\n"
        "            ├── api.js, auth.js, app.js [Helper HTTP Fetch, JWT Auth, Utilities]\n"
        "            └── pages/*.js (11 file)    [Controller klien per halaman web]"
    )

    story.append(Table([[Paragraph(f"<pre>{tree_text}</pre>", code_style)]], colWidths=[174 * mm], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0f172a')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#334155')),
    ]))

    # ================= SECTION 3: DETAIL FILE BREAKDOWN =================
    story.append(PageBreak())
    story.append(Paragraph("3. Penjelasan Rinci Setiap Berkas (File-by-File Details)", h1_style))

    file_details = [
        ("database/database.sql", "SQL Skrip Mandiri",
         "Menyusun skema lengkap database 'learnhire_db'. Berisi DDL untuk 9 tabel normal (Primary Key, Foreign Key, "
         "Index, Unique Constraints) dan DML data awal berupa 7 akun pengguna (admin & user dengan hash bcrypt asli), "
         "6 perusahaan mitra ternama, 12 lowongan kerja terperinci, 10 kursus online, transaksi lamaran, dan tiket CS. "
         "Dapat diimpor langsung dalam 1 klik melalui phpMyAdmin."),

        ("backend/server.js", "Entry Point Express Server",
         "Menginisialisasi framework Express pada port 3000. Memasang middleware keamanan Helmet (dengan CSP disesuaikan "
         "agar dapat memuat font Google Poppins dan Font Awesome CDN), CORS, dan parser body JSON. Bertindak sebagai web server "
         "yang melayani file frontend secara statis dari folder '../frontend', menyatukan rute API di '/api', serta mengarahkan "
         "rute non-API ke index.html (SPA Fallback)."),

        ("backend/config/database.js", "MySQL Connection Pool",
         "Mengonfigurasi koneksi database menggunakan library 'mysql2/promise'. Menggunakan Connection Pool (bukan single connection) "
         "untuk performa tinggi, efisiensi resource memori, dan mencegah kegagalan timeout koneksi. Kredensial diambil langsung "
         "dari file lingkungan (.env)."),

        ("backend/middleware/auth.middleware.js", "JWT Authentication Guard",
         "Menyediakan fungsi 'verifyToken' yang mengekstrak dan memverifikasi token Bearer JWT dari header Authorization. "
         "Menyematkan identitas pengguna ke 'req.user'. Menyediakan fungsi 'isAdmin' untuk membatasi endpoint sensitif "
         "(tambah/edit/hapus loker & kursus) hanya untuk akun dengan role 'admin'."),

        ("backend/middleware/error.middleware.js", "Centralized Error Handler",
         "Mencegah kebocoran stack trace database ke pengguna publik. Menyediakan 'notFound' untuk merespon 404 Route Not Found "
         "dalam format JSON standar, serta 'errorHandler' untuk menangkap uncaught exceptions dan menghasilkan HTTP 500 seragam."),

        ("backend/models/user.model.js", "Model Data Pengguna",
         "Menyediakan operasi database untuk entitas users. Fungsi create() menerima nama, email, password terenkripsi, telepon, dan role. "
         "Fungsi update() dirancang cerdas dengan sintaks SQL COALESCE, sehingga pembaruan profil yang hanya mengisi sebagian kolom "
         "tidak akan menghapus atau menimpa data kolom lainnya menjadi NULL."),

        ("backend/models/job.model.js", "Model Lowongan Kerja",
         "Menangani query tabel jobs dengan klausa JOIN ke tabel companies dan job_categories. Fungsi findAll() mendukung "
         "pencarian multi-parameter (kata kunci judul, ID kategori, tipe pekerjaan Full-time/Remote, dan status aktif)."),

        ("backend/models/application.model.js", "Model Transaksi Lamaran",
         "Mengelola tabel job_applications. Memiliki fungsi checkExisting() untuk memastikan pengguna tidak melamar dua kali "
         "pada posisi yang sama. Menyediakan fungsi findByUserId() untuk pelamar dan findAll() untuk administrator."),

        ("backend/models/enrollment.model.js", "Model Pendaftaran Kursus",
         "Mengelola keikutsertaan kelas online di course_enrollments. Otomatis menginkremen kolom total_students di tabel courses "
         "saat pendaftaran baru dibuat. Menyediakan fungsi pembaruan persentase progres belajar dari 0% hingga 100% (completed)."),

        ("backend/controllers/auth.controller.js", "Logika Autentikasi Pengguna",
         "Menangani registrasi akun baru (validasi keunikan email dan hashing password bcryptjs dengan salt rounds 10), "
         "login pengguna (verifikasi password dan pembuatan JWT token berisi id, name, dan role), serta endpoint pembacaan "
         "dan pembaruan profil pribadi."),

        ("frontend/assets/css/style.css", "Pusat Styling Dark Glassmorphism",
         "File CSS monolitik yang mendefinisikan identitas visual LearnHire sesuai desain Canva. Mengatur palet warna dark navy "
         "(#0a0e27), secondary (#1a1f4e), aksen gradien ungu-biru (#7c3aed ke #3b82f6), efek kartu kaca transparan (backdrop-filter: blur(10px)), "
         "animasi floating orbs di latar belakang, layout sidebar fixed 260px, serta aturan responsif desktop, tablet, dan ponsel."),

        ("frontend/assets/js/api.js", "Pustaka Fetch API Klien",
         "Helper komunikasi jaringan terpusat. Mengotomatisasi penyisipan token JWT pada header request, menyederhanakan method "
         "api.get(), api.post(), api.put(), api.delete(), serta otomatis mendeteksi status HTTP 401 Unauthorized untuk meredirect "
         "pengguna yang tokennya telah kedaluwarsa kembali ke halaman login."),

        ("frontend/assets/js/app.js", "Utilitas Bersama Antarmuka",
         "Menyediakan fungsi global showNotification() (toast notifikasi animasi), formatCurrency() (konversi integer ke format Rupiah IDR), "
         "formatDate() (format tanggal Indonesia), loadSidebar() (injeksi dinamis navigasi samping), dan updateUserInfo() yang "
         "menampilkan nama serta lencana badge role ([ADMIN] warna oranye atau [USER] warna biru) di sidebar secara otomatis.")
    ]

    for title, role, desc in file_details:
        item = [
            [Paragraph(f"<b>{title}</b> &nbsp;<font color='#2563eb'>[{role}]</font>", table_cell_bold)],
            [Paragraph(desc, table_cell_style)]
        ]
        t = Table(item, colWidths=[174 * mm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t)
        story.append(Spacer(1, 2.5 * mm))

    # ================= SECTION 4: STRUKTUR DATABASE =================
    story.append(PageBreak())
    story.append(Paragraph("4. Rincian Skema Basis Data Relasional (learnhire_db)", h1_style))
    story.append(Paragraph(
        "Database terdiri dari 9 tabel yang dinormalisasi dengan integritas referensial (Foreign Key) yang ketat:",
        body_style
    ))

    db_tables = [
        ["Tabel", "Kolom Utama", "Relasi / Constraints", "Deskripsi Peran Bisnis"],
        ["users", "id, name, email, password, phone, role", "PK(id), UNIQUE(email)", "Data pencari kerja dan admin platform (password hash bcrypt)."],
        ["companies", "id, name, logo, location, website", "PK(id)", "Data perusahaan mitra resmi penyedia lowongan pekerjaan."],
        ["job_categories", "id, name, icon", "PK(id)", "Kategori bidang industri (Teknologi, Desain, Marketing, Finance)."],
        ["jobs", "id, company_id, category_id, title, salary_min, salary_max, type", "PK(id), FK(company_id), FK(category_id)", "Daftar lowongan kerja yang dibuka oleh perusahaan mitra."],
        ["job_applications", "id, user_id, job_id, cover_letter, status", "PK(id), FK(user_id), FK(job_id), UNIQUE(user_id, job_id)", "Data lamaran kerja. Constraint unik mencegah pelamaran ganda."],
        ["course_categories", "id, name, icon", "PK(id)", "Kategori pelatihan (Programming, UI/UX, Data Science, Business)."],
        ["courses", "id, category_id, title, instructor, duration, level, price, rating", "PK(id), FK(category_id)", "Katalog kursus pelatihan keterampilan terstruktur."],
        ["course_enrollments", "id, user_id, course_id, progress, status", "PK(id), FK(user_id), FK(course_id), UNIQUE(user_id, course_id)", "Data kelas yang diikuti user beserta pelacakan progres 0-100%."],
        ["support_messages", "id, user_id, subject, message, reply, status", "PK(id), FK(user_id)", "Tiket bantuan customer service antara user dan tim admin."]
    ]

    t_db = []
    for r_idx, row in enumerate(db_tables):
        r_cells = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0:
                r_cells.append(Paragraph(f"<b>{cell}</b>", table_header_style))
            else:
                p_style = table_cell_bold if c_idx == 0 else table_cell_style
                r_cells.append(Paragraph(cell, p_style))
        t_db.append(r_cells)

    table_db = Table(t_db, colWidths=[28 * mm, 46 * mm, 45 * mm, 55 * mm])
    table_db.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e293b')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(table_db)

    # ================= SECTION 5: DAFTAR ENDPOINT REST API =================
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("5. Daftar Endpoint REST API Lengkap (35+ Rute)", h1_style))

    api_endpoints = [
        ["Modul", "Method & URL", "Hak Akses (Auth)", "Fungsi & Perilaku"],
        ["Auth", "POST /api/auth/register", "Publik", "Pendaftaran akun baru, enkripsi password bcrypt."],
        ["Auth", "POST /api/auth/login", "Publik", "Login akun, menghasilkan Bearer Token JWT."],
        ["Auth", "GET /api/auth/profile", "JWT (User/Admin)", "Mengambil data profil pengguna yang sedang login."],
        ["Auth", "PUT /api/auth/profile", "JWT (User/Admin)", "Memperbarui info kontak, keahlian, dan bio diri."],
        ["Jobs", "GET /api/jobs", "Publik", "Mengambil daftar lowongan dengan filter search & kategori."],
        ["Jobs", "GET /api/jobs/:id", "Publik", "Mengambil rincian lowongan kerja dan profil perusahaan."],
        ["Jobs", "POST / PUT / DELETE", "JWT (Khusus Admin)", "Operasi CRUD lowongan pekerjaan oleh administrator."],
        ["Courses", "GET /api/courses", "Publik", "Mengambil daftar kursus online dengan filter tingkat."],
        ["Courses", "GET /api/courses/:id", "Publik", "Mengambil detail silabus kursus dan data instruktur."],
        ["Courses", "POST / PUT / DELETE", "JWT (Khusus Admin)", "Operasi CRUD materi kursus oleh administrator."],
        ["Applications", "GET /api/applications", "JWT (User/Admin)", "Melihat riwayat lamaran (user: miliknya; admin: semua)."],
        ["Applications", "POST /api/applications", "JWT (User)", "Mengirimkan lamaran kerja + cover letter."],
        ["Applications", "DELETE /api/applications/:id", "JWT (User/Admin)", "Membatalkan berkas lamaran yang diajukan."],
        ["Enrollments", "GET /api/enrollments", "JWT (User)", "Mengambil daftar kursus yang sedang diikuti."],
        ["Enrollments", "POST /api/enrollments", "JWT (User)", "Mendaftar kelas baru (inkremen jumlah siswa)."],
        ["Enrollments", "PUT /api/enrollments/:id", "JWT (User)", "Memperbarui progres belajar (+25% hingga 100%)."],
        ["Enrollments", "DELETE /api/enrollments/:id", "JWT (User)", "Membatalkan keikutsertaan kelas online."],
        ["Support", "GET /api/support", "JWT (User/Admin)", "Melihat tiket bantuan pengguna."],
        ["Support", "POST /api/support", "JWT (User)", "Mengirim pesan pertanyaan/kendala baru ke admin."],
        ["Support", "DELETE /api/support/:id", "JWT (User/Admin)", "Menghapus tiket bantuan dari database."],
        ["Dashboard", "GET /api/dashboard", "Publik", "Statistik metrik sistem (Total Jobs, Courses, Users)."]
    ]

    t_api = []
    for r_idx, row in enumerate(api_endpoints):
        r_cells = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0:
                r_cells.append(Paragraph(f"<b>{cell}</b>", table_header_style))
            else:
                p_style = table_cell_bold if c_idx in (0, 1) else table_cell_style
                r_cells.append(Paragraph(cell, p_style))
        t_api.append(r_cells)

    table_api = Table(t_api, colWidths=[24 * mm, 45 * mm, 32 * mm, 73 * mm])
    table_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e293b')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(table_api)

    # ================= SECTION 6: PANDUAN RUNNING & AKUN =================
    story.append(PageBreak())
    story.append(Paragraph("6. Akun Pengujian & Panduan Operasional Lokal", h1_style))

    story.append(Paragraph("6.1 Akun Demo Bawaan", h2_style))
    demo_accounts = [
        ["Peran (Role)", "Alamat Email", "Password", "Keterangan Akses"],
        ["Admin Platform", "admin@learnhire.com", "admin123", "Superuser: Memiliki izin mengelola lowongan, kursus, dan melihat seluruh pelamar."],
        ["User (Pencari Kerja)", "budi@example.com", "user123", "User reguler: Memiliki riwayat lamaran dan kursus berjalan untuk demonstrasi."],
        ["User (Pencari Kerja)", "sari@example.com", "user123", "User reguler alternatif: Untuk menguji pendaftaran kursus dan tiket customer service."]
    ]
    t_acc = []
    for r_idx, row in enumerate(demo_accounts):
        r_cells = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0:
                r_cells.append(Paragraph(f"<b>{cell}</b>", table_header_style))
            else:
                p_style = table_cell_bold if c_idx in (0, 1) else table_cell_style
                r_cells.append(Paragraph(cell, p_style))
        t_acc.append(r_cells)

    table_acc = Table(t_acc, colWidths=[32 * mm, 45 * mm, 25 * mm, 72 * mm])
    table_acc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e293b')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(table_acc)

    story.append(Paragraph("6.2 Langkah-Langkah Menjalankan Aplikasi Secara Mandiri", h2_style))
    story.append(Paragraph(
        "1. <b>Nyalakan XAMPP:</b> Buka XAMPP Control Panel, pastikan service <b>Apache</b> (Port 80) dan <b>MySQL</b> (Port 3306) telah berstatus <i>Start / Running</i>.<br/>"
        "2. <b>Buka phpMyAdmin:</b> Akses link <code>http://localhost/phpmyadmin/</code> pada browser untuk memastikan database <code>learnhire_db</code> aktif.<br/>"
        "3. <b>Jalankan Backend Server:</b> Buka terminal PowerShell pada folder backend, lalu jalankan perintah:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>npm run dev</code> &nbsp;<i>(atau: <code>node server.js</code>)</i><br/>"
        "4. <b>Buka Website:</b> Akses browser pada tautan <code>http://localhost:3000</code>. Seluruh fitur dapat langsung diuji secara lokal tanpa memerlukan internet.",
        body_style
    ))

    story.append(Spacer(1, 10 * mm))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceAfter=15))
    story.append(Paragraph(
        "<b>Catatan Penutup:</b> Seluruh kode dan struktur file pada project LearnHire telah berhasil diuji dan diverifikasi "
        "memenuhi standar arsitektur perangkat lunak berbasis REST API, aman dari SQL Injection, serta mematuhi 100% persyaratan desain antarmuka.",
        ParagraphStyle('EndNote', parent=body_style, fontName='Helvetica-Oblique', alignment=1)
    ))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: PDF generated at {pdf_filename}")

if __name__ == '__main__':
    build_pdf()
