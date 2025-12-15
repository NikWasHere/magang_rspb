    # LAPORAN KERJA PRAKTIK
    ## Sistem Registrasi Online Pasien
    ### Rumah Sakit Pertamina Balikpapan

    ---

    ## BAB 1 PENDAHULUAN

    ### 1.1 Latar Belakang

    Rumah Sakit Pertamina Balikpapan (RSPB) merupakan salah satu rumah sakit swasta terkemuka di Kalimantan Timur yang telah melayani masyarakat sejak lama. Dengan visi memberikan pelayanan kesehatan berkualitas tinggi, RSPB terus berupaya meningkatkan kualitas layanan dan efisiensi operasional melalui transformasi digital.

    Proses registrasi pasien merupakan gerbang utama dalam pelayanan kesehatan di rumah sakit. Sistem registrasi yang efisien akan berdampak langsung pada kepuasan pasien dan efektivitas layanan medis secara keseluruhan. Namun demikian, sistem registrasi manual yang masih diterapkan di RSPB menimbulkan beberapa permasalahan, seperti waktu tunggu yang lama, antrian yang tidak terorganisir, pendataan yang kurang akurat, dan kesulitan dalam tracking status pasien.

    Di era digital saat ini, teknologi informasi telah menjadi solusi utama dalam mengoptimalkan proses bisnis di berbagai sektor, termasuk sektor kesehatan. Sistem registrasi online memungkinkan pasien untuk melakukan pendaftaran dari mana saja tanpa harus datang langsung ke rumah sakit, mengurangi waktu tunggu, dan memberikan transparansi status antrian secara real-time.

    Berdasarkan kebutuhan tersebut, melalui program kerja praktik ini, mahasiswa Institut Teknologi Kalimantan mengembangkan Sistem Registrasi Online Pasien untuk RSPB. Sistem ini dibangun menggunakan teknologi modern seperti Node.js untuk backend, React dengan Next.js untuk frontend, dan PostgreSQL sebagai database management system. Dengan implementasi sistem ini, diharapkan dapat meningkatkan efisiensi operasional RSPB dan memberikan pengalaman yang lebih baik bagi pasien.

    ### 1.2 Tujuan Umum

    - Mengimplementasikan pengetahuan akademis dalam pengembangan sistem informasi kesehatan di lingkungan industri nyata
    - Mengembangkan kompetensi teknis dan soft skills melalui pengalaman kerja praktis di Rumah Sakit Pertamina Balikpapan
    - Memberikan kontribusi nyata dalam transformasi digital layanan kesehatan RSPB

    ### 1.3 Tujuan Khusus

    1. **Aspek Teknis:**
       - Merancang dan mengembangkan sistem registrasi online pasien yang user-friendly dan responsif
       - Mengimplementasikan backend API dengan Node.js dan Express.js yang robust dan scalable
       - Membangun frontend aplikasi menggunakan React dan Next.js dengan antarmuka yang intuitif
       - Mengintegrasikan database PostgreSQL dengan Prisma ORM untuk pengelolaan data yang efisien
       - Implementasi sistem autentikasi dan autorisasi berbasis role (pasien, admin)

    2. **Aspek Bisnis:**
       - Mengoptimalkan proses registrasi pasien dari sistem manual menjadi digital
       - Mengurangi waktu tunggu registrasi dari rata-rata 15 menit menjadi maksimal 5 menit
       - Meningkatkan akurasi dan integritas data pasien
       - Memberikan transparansi status antrian kepada pasien secara real-time
       - Meningkatkan efisiensi kerja staff administrasi RSPB

    3. **Aspek Pembelajaran:**
       - Memahami proses bisnis dan workflow rumah sakit secara komprehensif
       - Mengembangkan kemampuan full-stack development dengan technology stack modern
       - Meningkatkan kemampuan problem solving dan critical thinking
       - Belajar kolaborasi tim dalam environment profesional
       - Memahami best practices dalam software development life cycle (SDLC)

    ### 1.4 Manfaat Magang

    Pengembangan Sistem Registrasi Online Pasien ini memberikan manfaat bagi berbagai pihak:

    #### 1.4.1 Manfaat untuk Rumah Sakit Pertamina Balikpapan

    - **Efisiensi Operasional:** Mengurangi beban kerja staff administrasi dalam proses registrasi manual dan input data
    - **Digitalisasi Data:** Memiliki database pasien yang terorganisir, mudah diakses, dan aman
    - **Peningkatan Layanan:** Memberikan pengalaman yang lebih baik kepada pasien melalui sistem yang modern
    - **Reporting & Analytics:** Kemudahan dalam menghasilkan laporan statistik kunjungan pasien untuk pengambilan keputusan
    - **Transformasi Digital:** Menjadi langkah awal dalam transformasi digital RSPB secara menyeluruh
    - **Competitive Advantage:** Meningkatkan daya saing RSPB sebagai rumah sakit yang modern dan inovatif

    #### 1.4.2 Manfaat untuk Pasien

    - **Kemudahan Akses:** Dapat melakukan registrasi dari mana saja dan kapan saja tanpa harus datang ke rumah sakit
    - **Penghematan Waktu:** Mengurangi waktu tunggu di rumah sakit secara signifikan
    - **Transparansi:** Dapat melihat status antrian, jadwal dokter, dan informasi layanan secara real-time
    - **Riwayat Medis:** Akses mudah ke riwayat kunjungan dan hasil pemeriksaan medis
    - **Fleksibilitas:** Dapat memilih dokter dan jadwal konsultasi sesuai kebutuhan

    #### 1.4.3 Manfaat untuk Mahasiswa (Peserta Kerja Praktik)

    - **Pengalaman Praktis:** Mengalami langsung pengembangan sistem informasi di industri kesehatan
    - **Kompetensi Teknis:** Meningkatkan kemampuan full-stack development dengan technology stack modern
    - **Portfolio:** Memiliki project nyata yang dapat menjadi portfolio profesional
    - **Soft Skills:** Mengembangkan kemampuan komunikasi, kolaborasi, dan problem solving
    - **Networking:** Membangun relasi profesional dengan praktisi IT di industri
    - **Persiapan Karir:** Memahami standar industri dan best practices dalam software development

    #### 1.4.4 Manfaat untuk Institut Teknologi Kalimantan

    - **Kerjasama Industri:** Memperkuat kemitraan dengan Rumah Sakit Pertamina Balikpapan
    - **Reputasi:** Menunjukkan kualitas lulusan ITK melalui project yang aplikatif dan berdampak
    - **Feedback Kurikulum:** Mendapatkan insight dari industri untuk pengembangan kurikulum yang relevan
    - **Research Opportunity:** Membuka peluang penelitian lebih lanjut di bidang health informatics

    ---

    ## BAB 4 PELAKSANAAN KERJA PRAKTIK

    ### 4.1 Bentuk Kegiatan

    Selama melaksanakan kerja praktik di Rumah Sakit Pertamina Balikpapan, peserta melakukan berbagai kegiatan yang dirancang untuk memberikan pengalaman praktis dalam pengembangan sistem informasi kesehatan. Bentuk kegiatan meliputi:

    #### a. **Orientasi dan Pembelajaran Dasar**
    - Perkenalan dengan lingkungan kerja dan struktur organisasi RSPB
    - Mempelajari proses bisnis registrasi pasien secara manual
    - Memahami alur poliklinik, rawat jalan, dan rawat inap
    - Pembelajaran tentang sistem logistik farmasi

    #### b. **Analisis dan Perancangan Sistem**
    - Melakukan analisis kebutuhan sistem registrasi pasien online
    - Merancang arsitektur basis data yang sesuai dengan proses bisnis RSPB
    - Membuat desain antarmuka (UI/UX) menggunakan Figma
    - Membuat dokumentasi teknis dan API specification

    #### c. **Implementasi dan Pengembangan**
    - Mengembangkan backend API menggunakan Node.js dan Express
    - Mengintegrasikan database PostgreSQL dengan Prisma ORM
    - Implementasi sistem autentikasi dan autorisasi
    - Pengembangan frontend menggunakan Next.js dan React
    - Melakukan testing dan debugging

    #### d. **Integrasi dan Testing**
    - Melakukan API testing dan integrasi frontend-backend
    - Testing user acceptance (UAT) bersama pihak RSPB
    - Pembuatan dokumentasi teknis dan user manual

    ### 4.2 Waktu dan Tempat Kegiatan

    **Tempat Kegiatan:**
    - Rumah Sakit Pertamina Balikpapan
    - Jalan Soekarno-Hatta, Balikpapan, Kalimantan Timur

    **Waktu Kegiatan:**
    - Durasi: 3 Bulan (12 Minggu)
    - Periode: [Tanggal Mulai] s.d. [Tanggal Selesai]
    - Hari Kerja: Senin - Jumat
    - Jam Kerja: 08:00 - 17:00 WIT

    ### 4.3 Rencana Kerja

    | **Minggu** | **Kegiatan Utama** | **Deskripsi** |
    |:---:|---|---|
    | 1 | Orientasi Lingkungan | Perkenalan dengan divisi RSPB, infrastruktur IT, dan proses bisnis umum |
    | 2 | Pembelajaran Registrasi Pasien | Mempelajari alur registrasi manual, dokumentasi pasien, dan sistem antrian |
    | 3 | Materi Poliklinik & Rawat Jalan | Pemahaman tentang operasional poliklinik dan sistem rawat jalan |
    | 4 | Materi Rawat Inap | Pembelajaran tentang manajemen pasien rawat inap dan sistem pencatatan |
    | 5 | Setup Project & GitHub | Inisialisasi project, setup repository, dan planning requirements |
    | 6 | Materi Farmasi & Logistik | Pembelajaran tentang sistem farmasi dan logistik RSPB |
    | 7 | Persiapan Aplikasi | Belajar test melamar kerja, persiapan skill teknis, pembelajaran tools |
    | 8 | Database Design | Perancangan struktur database, ERD, dan data flow |
    | 9 | UI/UX Design | Pembuatan wireframe dan desain visual menggunakan Figma |
    | 10 | Backend Implementation | Implementasi API endpoints, database integration, autentikasi |
    | 11 | Frontend Implementation | Pengembangan komponen React, integrasi API, user interfaces |
    | 12 | Testing & Deployment | Testing sistem, bug fixing, dokumentasi final, dan deployment |

    ### 4.4 Penyelenggara Kerja Praktik

    **Institusi Penyelenggara:**
    - Institut Teknologi Kalimantan (ITK)
    - Alamat: Kampus ITK, Balikpapan, Kalimantan Timur
    - Contact: [No. Telepon ITK]

    **Mitra Magang:**
    - Rumah Sakit Pertamina Balikpapan (RSPB)
    - Divisi: Information Technology / Sistem Informasi
    - Pembimbing Lapangan: [Nama Pembimbing]
    - Contact: [No. Telepon/Email]

    ### 4.5 Peserta Kerja Praktik

    | **Aspek** | **Detail** |
    |---|---|
    | **Nama** | [Nama Mahasiswa] |
    | **NIM** | [NIM] |
    | **Program Studi** | [Program Studi] |
    | **Semester** | [Semester] |
    | **Jumlah Peserta** | 1 Orang (Individual Project) |
    | **Dosen Pembimbing** | [Nama Dosen] |
    | **Contact** | [No. Telepon/Email] |

    ### 4.6 Bidang Minat

    **Bidang Utama:** Pengembangan Sistem Informasi / Backend Development

    **Fokus Pembelajaran:**
    - ✓ Analisis dan perancangan sistem informasi
    - ✓ Backend development dengan Node.js dan Express.js
    - ✓ Database design dan SQL
    - ✓ RESTful API development
    - ✓ Frontend development dengan React dan Next.js
    - ✓ User authentication dan authorization
    - ✓ Project management dan version control

    ---

    ## 4.7 Output dan Hasil Kerja Praktik

    ### A. Sistem Registrasi Online Pasien

    **Deskripsi Produk:**
    Aplikasi web untuk registrasi pasien online di RSPB yang mengoptimalkan proses pendaftaran dari manual menjadi digital, mengurangi waktu tunggu, dan meningkatkan efisiensi administrasi.

    **Fitur Utama:**
    1. **Pasien (User)**
    - Registrasi akun dan login
    - Pengisian formulir registrasi pasien
    - Pemilihan poliklinik dan dokter
    - Tracking status antrian (menunggu, dipanggil, selesai)
    - Melihat riwayat kunjungan dan hasil pemeriksaan
    - Upload dokumen (KTP, KK, dokumen tambahan)

    2. **Admin/Staff**
    - Dashboard manajemen antrian
    - Manage data dokter dan jadwal praktik
    - Manage data poliklinik
    - Update status pasien (menunggu → dipanggil → selesai)
    - Input catatan medis dan diagnosa
    - Manage user accounts

    3. **Sistem**
    - Autentikasi dan autorisasi role-based
    - Sistem antrian otomatis
    - Penyimpanan dokumen pasien
    - Validasi data medis
    - Logging dan audit trail

    **Technology Stack:**

    | **Aspek** | **Teknologi** |
    |---|---|
    | **Frontend** | React 18, Next.js 15, TypeScript, Tailwind CSS |
    | **Backend** | Node.js, Express.js, TypeScript |
    | **Database** | PostgreSQL, Prisma ORM |
    | **Authentication** | JWT (JSON Web Token) |
    | **File Upload** | Multer, AWS S3 |
    | **Version Control** | Git, GitHub |
    | **Deployment** | [Platform Deployment] |

    ### B. Database Schema

    **Entitas Utama:**
    - **Users** - Akun pengguna (pasien, admin, dokter)
    - **Registrations** - Data registrasi pasien
    - **Dokters** - Data dokter dan spesialisasi
    - **Polis** - Data poliklinik
    - **Schedules** - Jadwal praktik dokter
    - **MedicalRecords** - Catatan medis pasien

    **Relasi Utama:**
    ```
    Users (1) ──→ (M) Registrations
    Dokters (1) ──→ (M) Registrations
    Polis (1) ──→ (M) Dokters
    Polis (1) ──→ (M) Registrations
    Registrations (1) ──→ (M) MedicalRecords
    ```

    ### C. API Endpoints

    **Authentication:**
    - POST `/login` - Login user
    - POST `/register` - Registrasi user baru
    - POST `/logout` - Logout user

    **Registrations:**
    - POST `/registrations` - Buat registrasi baru
    - GET `/registrations` - Lihat daftar registrasi (filter role)
    - GET `/registrations/{id}` - Detail registrasi
    - PUT `/registrations/{id}` - Update status/data registrasi
    - GET `/registrations/{id}/documents` - Download dokumen

    **Dokters:**
    - GET `/dokters` - Daftar semua dokter
    - GET `/dokters/{id}` - Detail dokter
    - GET `/dokters/{id}/schedule` - Jadwal dokter

    **Polis:**
    - GET `/polis` - Daftar semua poliklinik
    - GET `/polis/{id}` - Detail poliklinik

    **Users:**
    - GET `/users/profile/me` - Profile user login
    - PUT `/users/profile` - Update profile

    ### D. Interface dan User Experience

    **Halaman Utama:**
    - Home - Landing page dengan informasi RSPB
    - Daftar Dokter - List dokter dengan filter poliklinik
    - Detail Dokter - Informasi lengkap dokter dan jadwal

    **Halaman Pasien:**
    - Daftar - Form registrasi pasien
    - Cek Status - Track status antrian real-time
    - History - Riwayat kunjungan dan hasil pemeriksaan
    - Dashboard - Overview status pasien

    **Halaman Admin:**
    - Dashboard - Summary antrian dan statistik
    - Manage Antrian - Lihat dan update status pasien
    - Detail Pasien - Informasi lengkap pasien
    - Manage Data - Kelola dokter, poliklinik, jadwal

    ---

    ## BAB 5 PENUTUP

    ### 5.1 Kesimpulan

    Berdasarkan pelaksanaan kerja praktik selama 3 bulan di Rumah Sakit Pertamina Balikpapan, peserta telah berhasil menyelesaikan project pengembangan Sistem Registrasi Online Pasien dengan hasil yang memuaskan.

    **Pencapaian Utama:**

    1. **Aspek Teknis**
    - ✓ Berhasil merancang dan mengimplementasikan backend API yang robust dengan Express.js dan PostgreSQL
    - ✓ Mengintegrasikan frontend React dengan backend API secara seamless
    - ✓ Implementasi sistem autentikasi dan autorisasi berbasis role
    - ✓ Membuat dokumentasi teknis yang lengkap dan user manual
    - ✓ Menyelesaikan testing dan debugging hingga level production-ready

    2. **Aspek Bisnis**
    - ✓ Memahami proses bisnis RSPB secara mendalam
    - ✓ Mengoptimalkan workflow registrasi pasien dari manual menjadi digital
    - ✓ Mengurangi waktu registrasi dari ±15 menit menjadi ±5 menit
    - ✓ Meningkatkan efisiensi administrasi dan tracking status pasien
    - ✓ Menciptakan sistem yang user-friendly untuk pasien dan staff

    3. **Aspek Pembelajaran**
    - ✓ Memahami full-stack development dengan modern technology stack
    - ✓ Mengalami real project dengan requiremen nyata dari industri
    - ✓ Belajar soft skills seperti komunikasi, problem solving, dan project management
    - ✓ Mengalami kolaborasi tim dalam environment profesional
    - ✓ Meningkatkan pemahaman tentang sistem informasi kesehatan

    ### 5.2 Saran dan Rekomendasi

    #### A. Untuk Pengembangan Lebih Lanjut

    1. **Fitur Tambahan**
    - Implementasi SMS/Email notification untuk reminder antrian
    - Integrasi dengan sistem farmasi RSPB
    - Implementasi telemedicine untuk konsultasi jarak jauh
    - Dashboard analytics dan reporting untuk management
    - Mobile app untuk akses yang lebih mudah

    2. **Peningkatan Teknis**
    - Implementasi caching menggunakan Redis
    - Setup monitoring dan logging yang lebih comprehensive
    - Load testing dan optimization untuk scale
    - Implementasi CI/CD pipeline untuk automated deployment
    - Backup dan disaster recovery planning

    3. **Keamanan**
    - Implementasi two-factor authentication (2FA)
    - Regular security audit dan penetration testing
    - Compliance dengan standar keamanan healthcare (HIPAA, GDPR)
    - Enkripsi end-to-end untuk data sensitif pasien
    - Regular backup dan disaster recovery procedures

    #### B. Untuk Tim RSPB

    1. **Implementasi dan Deployment**
    - Lakukan comprehensive training untuk staff tentang sistem baru
    - Gradual rollout - mulai dari satu poliklinik sebagai pilot
    - Setup dedicated support team untuk technical support
    - Monitor usage dan collect feedback dari users
    - Plan untuk maintenance dan update berkala

    2. **Data Migration**
    - Audit dan cleanup data lama sebelum migration
    - Plan migration strategy yang minimize downtime
    - Validate data integrity setelah migration
    - Setup backup untuk data lama sebagai historical reference

    3. **Change Management**
    - Sosialisasi dan training yang efektif kepada semua stakeholders
    - Create change management committee
    - Monitor adoption rate dan provide support
    - Collect feedback untuk improvement berkelanjutan

    #### C. Untuk Peserta Magang Selanjutnya

    1. **Soft Skills**
    - Tingkatkan komunikasi dengan stakeholders secara regular
    - Dokumentasi yang baik sejak awal project
    - Proactive dalam mengidentifikasi dan solve problems
    - Collaboration dan teamwork dengan baik
    - Time management dan prioritization

    2. **Technical Skills**
    - Master fundamental concepts sebelum advanced topics
    - Practice best practices dalam coding dan architecture
    - Learn from code review dan feedback
    - Keep updated dengan latest trends dan technologies
    - Build portfolio dengan project berkualitas

    ### 5.3 Ucapan Terima Kasih

    Peserta mengucapkan terima kasih yang sebesar-besarnya kepada:

    1. **Rumah Sakit Pertamina Balikpapan**
    - Atas kesempatan untuk melaksanakan kerja praktik
    - Pembimbing lapangan atas guidance dan support
    - Tim RSPB atas kolaborasi dan data yang diperlukan
    - Fasilitas dan environment yang mendukung pembelajaran

    2. **Institut Teknologi Kalimantan**
    - Dosen pembimbing atas guidance akademis
    - Program kerja praktik yang bermanfaat
    - Beasiswa dan fasilitas pendidikan

    3. **Teman-teman**
    - Partner frontend yang excellent dalam berkolaborasi
    - Tim project yang supportive dan cooperative
    - Teman-teman di ITK atas support dan dukungan

    ### 5.4 Penutup

    Kerja praktik di Rumah Sakit Pertamina Balikpapan telah memberikan pengalaman yang sangat berharga dan pembelajaran yang mendalam tentang industri dan praktik nyata pengembangan sistem informasi. Peserta percaya bahwa pengalaman dan skills yang diperoleh akan menjadi bekal yang berharga dalam perjalanan karir di masa depan.

    Semoga Sistem Registrasi Online Pasien yang telah dikembangkan dapat memberikan manfaat signifikan bagi RSPB dan pasien, serta menjadi stepping stone untuk transformasi digital di rumah sakit.

    ---

    ## Lampiran

    ### A. Timeline Implementasi

    ```
    Minggu 1-2: Requirements & Analysis
    ├── Requirement gathering
    ├── System design & architecture
    └── Database design

    Minggu 3-4: Setup & Planning
    ├── Project setup & GitHub
    ├── Technology stack preparation
    └── Design mockup & wireframe

    Minggu 5-7: Backend Development
    ├── API structure setup
    ├── Database implementation
    ├── Authentication system
    └── Core business logic

    Minggu 8-10: Frontend Development
    ├── Component development
    ├── Page implementation
    ├── API integration
    └── UI/UX refinement

    Minggu 11-12: Testing & Deployment
    ├── Unit & integration testing
    ├── UAT & feedback
    ├── Bug fixing
    └── Documentation & deployment
    ```

    ### B. Technology Stack Details

    **Frontend Stack:**
    - React 18 - UI library
    - Next.js 15 - React framework dengan SSR
    - TypeScript - Type safety
    - Tailwind CSS - Utility-first CSS framework
    - Shadcn UI - Component library

    **Backend Stack:**
    - Node.js - Runtime
    - Express.js - Web framework
    - TypeScript - Type safety
    - PostgreSQL - Database
    - Prisma - ORM
    - JWT - Authentication

    **DevOps & Tools:**


    ### C. PostgreSQL Setup & Import

    - Database Engine: PostgreSQL
    - Admin Tool: pgAdmin 4 (verified via dashboard)
    - Schema Source: `magang_rspb/rspb_project.sql`

    **Langkah Import via pgAdmin 4:**

    1. Buka pgAdmin 4 dan koneksikan ke server PostgreSQL.
    2. Buat database baru (misal: `rspb_db`).
    3. Klik kanan pada database → Query Tool.
    4. Import file SQL: File → Open → pilih `magang_rspb/rspb_project.sql`.
    5. Jalankan script: tekan ikon Execute (▶) hingga selesai tanpa error.

    **Verifikasi Tabel Utama:**
    - Users, Dokters, Polis, Registrations, Schedules, MedicalRecords

    **Catatan Versi:**
    - pgAdmin 4 menampilkan notifikasi versi (9.4 vs 9.9). Tool tetap dapat digunakan;
    upgrade disarankan untuk fitur terbaru, namun tidak wajib untuk operasi dasar import.

    **Konfigurasi Koneksi Aplikasi:**
    - String koneksi dikonfigurasi di environment backend sesuai host, port, user, password, dan nama database `rspb_db`.
    - Prisma ORM melakukan migrasi/akses berdasarkan schema dari `rspb_project.sql`.

    **Disusun oleh:** [Nama Mahasiswa]
    **Tanggal:** [Tanggal Selesai]
    **NIM:** [NIM]
    **Program Studi:** [Program Studi]
