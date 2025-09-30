# Hospital Management System - RSPB

Sistem manajemen rumah sakit berbasis web yang dibangun menggunakan Next.js 15, React 19, dan Tailwind CSS.

## 🚀 Fitur Utama

### 🔐 Sistem Authentication & Role-Based Access Control:
- **Role-Based Navigation**: Menu berbeda berdasarkan role user
- **Protected Routes**: Halaman admin hanya dapat diakses oleh admin
- **Demo Accounts**: 4 akun demo dengan role berbeda untuk testing
- **Session Management**: Login state persisten menggunakan localStorage

### 👤 Untuk Pasien/User:
- **Pendaftaran Online**: Daftar ke poliklinik dengan formulir yang mudah digunakan
- **Cek Status Antrian**: Lihat status antrian real-time berdasarkan nomor antrian, NIK, atau nomor telepon
- **Riwayat Kunjungan**: Lihat riwayat kunjungan dan hasil pemeriksaan
- **Upload Dokumen**: Upload KTP, BPJS, dan foto saat pendaftaran

### 👨‍⚕️ Untuk Admin/Dokter:
- **Dashboard Admin**: Monitor pendaftaran pasien hari ini dengan statistik real-time
- **Manajemen Pasien**: Lihat detail, edit data, dan kelola status antrian pasien
- **System Antrian**: Panggil pasien, update status (Menunggu → Sedang Dilayani → Selesai)
- **User Management**: Akses penuh ke semua fitur sistem

### 🔑 Demo Accounts:
| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@rspb.com | admin123 | Full Admin Access |
| **Dokter** | dokter@rspb.com | dokter123 | Admin Access |
| **User** | user@rspb.com | user123 | Patient Access |
| **Pasien** | pasien@rspb.com | pasien123 | Patient Access |

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.4 dengan App Router
- **Frontend**: React 19.1.0, TypeScript
- **Styling**: Tailwind CSS v3.4.0
- **UI Components**: shadcn/ui dengan Radix UI primitives
- **Fonts**: Geist Sans & Geist Mono
- **Icons**: Lucide React
- **Build Tool**: Turbopack (development)

## 📁 Struktur Proyek

```
src/
├── app/                          # App Router pages
│   ├── layout.tsx               # Root layout dengan navbar & footer
│   ├── page.tsx                 # Homepage dengan carousel
│   ├── admin/
│   │   ├── page.tsx            # Dashboard admin
│   │   └── patient/[id]/
│   │       └── page.tsx        # Detail pasien
│   ├── daftar/
│   │   └── page.tsx            # Form pendaftaran pasien
│   ├── buat-akun/
│   │   └── page.tsx            # Form registrasi akun
│   ├── login/
│   │   └── page.tsx            # Form login
│   ├── forgot-password/
│   │   └── page.tsx            # Form reset password
│   ├── history/
│   │   └── page.tsx            # Riwayat kunjungan
│   └── cek-status/
│       └── page.tsx            # Cek status antrian
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── site-navbar.tsx         # Navigation bar
│   ├── site-footer.tsx         # Footer
│   ├── patient-registration-form.tsx  # Form pendaftaran
│   └── create-account-form.tsx # Form buat akun
└── lib/
    └── utils.ts                # Utility functions
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

## 📱 Pages Overview

| Route | Description | Features |
|-------|------------|----------|
| `/` | Homepage | Carousel gambar, info rumah sakit |
| `/daftar` | Pendaftaran Pasien | Form lengkap dengan upload file |
| `/admin` | Dashboard Admin | Statistik, tabel pasien, manajemen |
| `/admin/patient/[id]` | Detail Pasien | Edit data, update status |
| `/history` | Riwayat Kunjungan | Filter, pagination, download |
| `/cek-status` | Cek Status Antrian | Real-time status, estimasi waktu |
| `/login` | Login | Autentikasi pengguna |
| `/buat-akun` | Registrasi | Buat akun baru |
| `/forgot-password` | Reset Password | Lupa password |

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

## 📝 Todo / Future Enhancements

- [ ] Integrasi dengan database (PostgreSQL/MySQL)
- [ ] Real-time notifications dengan WebSocket
- [ ] Email notifications untuk status changes
- [ ] Print functionality untuk kartu antrian
- [ ] Multi-language support (ID/EN)
- [ ] Dark mode toggle
- [ ] PWA capabilities
- [ ] Analytics dashboard
- [ ] Appointment scheduling system
- [ ] Payment integration

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team untuk amazing framework
- shadcn/ui untuk beautiful components
- Tailwind CSS untuk utility-first CSS
- Vercel untuk deployment platform
