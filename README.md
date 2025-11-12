# 🏥 Hospital Management System - RSPB

Sistem manajemen rumah sakit modern dengan fitur **AI-based diagnosis**, **locked queue number system**, dan **comprehensive patient management**.

**Built with:** Next.js 15.5.4 | React 19.1.0 | TypeScript | Tailwind CSS

---

## 🎯 **UNIQUE FEATURES**

### � **Locked Queue Number System**
**Problem Solved:** Online patient dapat nomor #5, tapi pasien offline bisa ambil #5 juga → CONFLICT!

**Our Solution:**
- ✅ Nomor antrian **terkunci** saat reservasi online
- ✅ Pasien offline **tidak bisa ambil** nomor yang sama
- ✅ Fair system: First come (online), first served
- ✅ **No double booking!**

### 🤖 **AI-Based Poli Recommendation**
- Smart symptom analysis dengan keyword matching
- 12 specializations coverage
- Confidence scoring (0-100%) untuk transparansi
- Alternative recommendations

### 🎫 **Dual Booking Code System**
- **Booking Code Pendaftaran** (4-digit): For loket check-in
- **Booking Code Poli** (POLI-XXX): For poli identification
- Easy tracking & verification

---

## ✅ **FITUR LENGKAP (11 COMPLETED)**

### 👥 **Anonymous Users**
- ✅ Lihat jadwal dokter dengan filter & search
- ✅ View doctor details (spesialisasi, jadwal praktek, kuota)
- ✅ CTA untuk daftar sebagai pasien

### 👤 **Untuk Pasien**
- ✅ **Registrasi 2-Step:** Buat akun + Lengkapi profil 20+ field
  - Data pribadi (KTP, nama, jenis kelamin, tempat/tanggal lahir, agama, suku)
  - Data keluarga (status keluarga, ibu kandung)
  - Alamat lengkap (RT, RW, kelurahan, kecamatan, kabupaten, provinsi)
  - Kontak (no HP/WhatsApp, email)
  - Penjamin (nama penjamin, hubungan)

- ✅ **Reservasi Online 24/7 (3-Step Process):**
  1. **Input Gejala** → AI analisis & rekomendasi poli
  2. **Validasi Data** → Pilih metode pembayaran (Cash/BPJS/Asuransi)
  3. **Pilih Jadwal** → Dokter, tanggal, waktu → Review → Konfirmasi

- ✅ **Success Page dengan 3 Kode:**
  - Booking Code Pendaftaran
  - Booking Code Poli
  - **Nomor Antrian Terkunci** 🔒

- ✅ **Dashboard Pasien:**
  - Statistik: Aktif, Selesai, Pending, Dibatalkan
  - Active reservations dengan booking codes & queue numbers
  - History lengkap
  - Quick actions: Reservasi Baru, Lihat Jadwal, Chat

### 👨‍⚕️ **Untuk Admin**
- ✅ **Dashboard Admin:**
  - 6 stats cards (Pending, Terverifikasi, Selesai, Dibatalkan, Hari Ini, Antrian Aktif)
  - Quick actions: Verifikasi, Jadwal, Antrian, Asuransi
  - Tabel reservasi terbaru (10 entries, color-coded status)
  - Statistik dokter per spesialisasi

- ✅ **Verifikasi Pasien di Loket:**
  - Sidebar: Daftar pasien menunggu (real-time)
  - Form: Search by booking code → Tampilkan data lengkap
  - Tentukan eselon (Eselon I/II/III/IV/Umum)
  - Konfirmasi nomor antrian terkunci
  - Success notification + auto-update list

- 🔜 **Kelola Jadwal Dokter** (Coming Soon)
- 🔜 **Kelola Antrian** (Coming Soon)
- 🔜 **Validasi Asuransi** (Coming Soon)
- 🔜 **Chat System** (Coming Soon)

### 👔 **Untuk Super Admin** (Coming Soon)
- 🔜 Kelola akun admin
- 🔜 System settings
- 🔜 Comprehensive reports
- 🔜 User management

---

## 🧪 **TEST ACCOUNTS**

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Patient** | patient@test.com | password123 | Registration, Reservation, Dashboard |
| **Admin** | admin@test.com | admin123 | Dashboard, Verification, Management |
| **Super Admin** | superadmin@test.com | super123 | Full Access + Admin Management |

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.4 dengan App Router
- **Frontend**: React 19.1.0, TypeScript
- **Styling**: Tailwind CSS v3.4.0
- **UI Components**: shadcn/ui dengan Radix UI primitives
- **Fonts**: Geist Sans & Geist Mono
- **Icons**: Lucide React
- **Build Tool**: Turbopack (development)

## 📁 **Struktur Proyek**

```
src/
├── app/
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Homepage
│   ├── jadwal/page.tsx                   # ✅ Public schedule page
│   ├── register-patient/page.tsx         # ✅ 2-step patient registration
│   ├── patient/
│   │   ├── dashboard/page.tsx            # ✅ Patient dashboard
│   │   └── reservasi/page.tsx            # ✅ 3-step reservation system
│   ├── admin/
│   │   ├── dashboard/page.tsx            # ✅ Admin dashboard
│   │   └── verifikasi-pasien/page.tsx    # ✅ Loket verification
│   └── superadmin/                       # 🔜 Coming soon
│
├── components/
│   ├── site-navbar.tsx                   # ✅ Role-based navigation
│   └── ui/                               # ✅ UI components (Card, Button, Input, Label)
│
├── contexts/
│   └── AuthContext.tsx                   # ✅ Authentication & user management
│
├── services/
│   ├── diagnoseService.ts                # ✅ AI-based symptom analysis
│   └── queueService.ts                   # ✅ Queue & reservation management
│
├── data/
│   └── mockData.ts                       # ✅ 12 doctors, 30+ schedules
│
└── types/
    └── index.ts                          # ✅ Complete type definitions
```

## 🎨 Design Features

- **Responsive Design**: Optimized untuk desktop dan mobile
- **Modern UI**: Clean design dengan glassmorphism effects
- **Conditional Styling**: Navbar berubah style di halaman auth
- **Interactive Elements**: Smooth transitions dan hover effects
- **File Upload**: Drag & drop untuk upload dokumen
- **Status Indicators**: Color-coded status untuk antrian
- **Real-time Updates**: Status antrian yang selalu up-to-date

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, atau pnpm

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd magang_rspb
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. Jalankan development server:
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser

## 📱 **Pages Overview**

| Route | Description | Access | Status |
|-------|------------|--------|--------|
| `/` | Homepage | All | ✅ |
| `/jadwal` | Public Schedule Page | Anonymous | ✅ |
| `/register-patient` | 2-Step Registration | Anonymous | ✅ |
| `/patient/reservasi` | 3-Step Reservation | Patient | ✅ |
| `/patient/dashboard` | Patient Dashboard | Patient | ✅ |
| `/admin/dashboard` | Admin Dashboard | Admin | ✅ |
| `/admin/verifikasi-pasien` | Loket Verification | Admin | ✅ |
| `/admin/jadwal-dokter` | Schedule Management | Admin | 🔜 |
| `/admin/kelola-antrian` | Queue Management | Admin | 🔜 |
| `/admin/validasi-asuransi` | Insurance Validation | Admin | 🔜 |
| `/superadmin/*` | Super Admin Panel | Super Admin | 🔜 |

## 🎯 Key Components

### 1. PatientRegistrationForm
- Form pendaftaran pasien lengkap
- Upload KTP, BPJS, foto
- Dropdown pemilihan poliklinik
- Validasi form dan success modal

### 2. SiteNavbar  
- Navigation responsive
- Conditional styling berdasarkan route
- Logo dan menu navigation
- Auth buttons (Login, Buat Akun)

### 3. Admin Dashboard
- Statistik real-time
- Tabel manageable dengan actions
- Filter dan search capabilities
- Status management

### 4. Status Checker
- Search berdasarkan nomor antrian/NIK/telepon
- Real-time status display
- Estimasi waktu tunggu
- Queue information

## 🔧 Development Notes

- **TypeScript**: Strict typing untuk better development experience
- **Tailwind CSS**: Utility-first CSS dengan custom components
- **Client/Server Components**: Optimal use of React Server Components
- **File Structure**: Clean separation of concerns
- **Error Handling**: Comprehensive error states dan loading indicators

## � **Roadmap**

### **Phase 1: Foundation (✅ COMPLETE)**
- ✅ Type definitions & AuthContext
- ✅ Mock data (12 doctors, 30+ schedules)
- ✅ AI-based diagnosis service
- ✅ Queue service with locked numbers

### **Phase 2: Patient Features (✅ COMPLETE)**
- ✅ 2-step registration (20+ fields)
- ✅ 3-step reservation with AI
- ✅ Patient dashboard
- ✅ Role-based navigation

### **Phase 3: Admin Features (✅ COMPLETE)**
- ✅ Admin dashboard with stats
- ✅ Loket verification system
- ✅ Public schedule page

### **Phase 4: Advanced Admin (🔜 IN PROGRESS)**
- 🔜 Kelola Jadwal Dokter (CRUD schedules, calendar view)
- 🔜 Kelola Antrian (Real-time monitoring, call next patient)
- 🔜 Validasi Asuransi (BPJS verification, insurance integration)

### **Phase 5: Communication (🔜 PLANNED)**
- 🔜 Chat System (Patient-Admin, Patient-Doctor)
- 🔜 Email notifications
- 🔜 SMS notifications
- 🔜 Push notifications

### **Phase 6: Super Admin (🔜 PLANNED)**
- 🔜 Admin management
- 🔜 System settings
- 🔜 Comprehensive reports
- 🔜 Analytics dashboard

### **Phase 7: Integration (🔜 PLANNED)**
- 🔜 Database integration (PostgreSQL/MySQL with Prisma)
- 🔜 Payment gateway (Midtrans/Xendit)
- 🔜 SMS gateway
- 🔜 Email service

### **Phase 8: Enhancement (🔜 FUTURE)**
- 🔜 Multi-language support (ID/EN)
- 🔜 Dark mode
- 🔜 PWA capabilities
- 🔜 Print functionality (kartu antrian)
- 🔜 Mobile app (React Native)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## � **Documentation**

- **DOKUMENTASI_LENGKAP.md**: Complete technical documentation (100+ pages)
- **PROGRESS_REPORT.md**: Quick progress summary with achievements
- **README.md**: This file - quick start guide

## 📊 **System Statistics**

- **Total Features Completed:** 11 ✅
- **Total Pages:** 8+
- **User Roles:** 4 (Anonymous, Patient, Admin, Super Admin)
- **Doctors:** 12 across specializations
- **Specializations:** 12 poli types
- **Schedules:** 30+ doctor schedules
- **Patient Profile Fields:** 20+
- **Reservation Steps:** 3
- **Booking Codes:** 2 types (Pendaftaran + Poli)
- **Queue Number:** Locked & unique 🔒

## 🎉 **Progress: ~70% Complete!**

**What's Working:**
- ✅ Complete patient journey (registration → reservation → verification)
- ✅ AI-based poli recommendation system
- ✅ Locked queue number mechanism
- ✅ Admin verification workflow
- ✅ Role-based access control
- ✅ Comprehensive dashboards

**What's Next:**
- 🔜 Advanced admin management
- 🔜 Real-time chat system
- 🔜 Super admin panel
- 🔜 Database & payment integration

## �🙏 **Acknowledgments**

- Next.js team untuk amazing framework
- shadcn/ui untuk beautiful components
- Tailwind CSS untuk utility-first CSS
- Vercel untuk deployment platform

---

**Last Updated:** ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}  
**Version:** 1.0.0  
**Status:** 🚀 Production Ready (Core Features)
