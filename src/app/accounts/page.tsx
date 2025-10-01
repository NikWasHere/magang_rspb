import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AccountsPage() {
  const adminAccounts = [
    {
      role: "Administrator Utama",
      email: "admin@rspb.com",
      password: "admin123",
      description: "Akses penuh ke semua fitur - dapat mengedit dokter, pasien, janji temu, dan semua data sistem",
      features: ["Dashboard Admin", "Kelola Dokter (CRUD)", "Kelola Pasien (CRUD)", "Kelola Janji Temu (CRUD)", "Laporan & Statistik"],
      color: "red"
    },
    {
      role: "Super Administrator",
      email: "superadmin@rspb.com",
      password: "super123",
      description: "Level tertinggi - kontrol penuh atas seluruh sistem rumah sakit",
      features: ["Semua Fitur Admin", "Kelola Sistem", "Backup Data", "Konfigurasi", "User Management"],
      color: "red"
    },
    {
      role: "Dr. Ahmad Fadil (Admin)",
      email: "dokter@rspb.com",
      password: "dokter123", 
      description: "Admin dengan perspektif dokter - akses lengkap untuk mengelola pasien dan jadwal",
      features: ["Dashboard Admin", "Kelola Dokter", "Kelola Pasien", "Jadwal Praktek", "Rekam Medis"],
      color: "red"
    },
    {
      role: "Kepala Rumah Sakit",
      email: "kepala.rs@rspb.com",
      password: "kepala123",
      description: "Akses manajerial - dapat melihat dan mengedit semua data operasional",
      features: ["Dashboard Admin", "Kelola Semua Data", "Laporan Manajemen", "Statistik Lengkap", "Oversight"],
      color: "red"
    },
    {
      role: "Manager Operasional",
      email: "manager@rspb.com",
      password: "manager123",
      description: "Mengelola operasi harian - akses edit untuk dokter, pasien, dan penjadwalan",
      features: ["Dashboard Admin", "Kelola Operasional", "Scheduling", "Patient Flow", "Staff Management"],
      color: "red"
    }
  ]

  const userAccounts = [
    {
      role: "User/Pasien",
      email: "user@rspb.com", 
      password: "user123",
      description: "Akses untuk pasien - pendaftaran, cek status, riwayat kunjungan",
      features: ["Pendaftaran Online", "Cek Status Antrian", "Riwayat Kunjungan", "Direktori Dokter"],
      color: "blue"
    },
    {
      role: "Pasien Reguler",
      email: "pasien@rspb.com",
      password: "pasien123",
      description: "Akun pasien biasa dengan akses terbatas ke fitur publik",
      features: ["Pendaftaran", "Cek Status", "Riwayat", "Profile Pasien"],
      color: "blue"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Demo Accounts</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gunakan akun demo berikut untuk mencoba sistem. Setiap role memiliki akses dan fitur yang berbeda.
          </p>
        </div>

        {/* Admin Accounts */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12a11.955 11.955 0 01-1.382 5.618m0 0l-.618-.618A10.989 10.989 0 0019 12a10.989 10.989 0 00-.018-1.382l.618-.618m0 0A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-4.382m0 0l.618-.618A10.989 10.989 0 015 12a10.989 10.989 0 00.018 1.382l-.618.618m0 0A11.955 11.955 0 0112 3a11.955 11.955 0 019.618 4.382m0 0l-.618.618A10.989 10.989 0 0119 12a10.989 10.989 0 00-.018-1.382l.618-.618" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Accounts</h2>
              <p className="text-gray-600">Akses penuh - dapat mengedit semua fitur sistem</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminAccounts.map((account, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-red-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{account.role}</CardTitle>
                        <span className="text-sm text-red-600 font-medium">ADMIN</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{account.description}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-800 font-mono">{account.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Password:</span>
                      <span className="text-sm text-gray-800 font-mono">{account.password}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Akses Admin:</p>
                    <div className="flex flex-wrap gap-1">
                      {account.features.map((feature, idx) => (
                        <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{feature}</span>
                      ))}
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Link href="/login">Login sebagai Admin</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Accounts */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Accounts</h2>
              <p className="text-gray-600">Akses terbatas - untuk pasien dan pengguna umum</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userAccounts.map((account, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{account.role}</CardTitle>
                        <span className="text-sm text-blue-600 font-medium">USER</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{account.description}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-800 font-mono">{account.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Password:</span>
                      <span className="text-sm text-gray-800 font-mono">{account.password}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Akses User:</p>
                    <div className="flex flex-wrap gap-1">
                      {account.features.map((feature, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{feature}</span>
                      ))}
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/login">Login sebagai User</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Perbandingan Fitur Admin vs User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-700">Fitur</th>
                    <th className="text-center p-3 font-medium text-red-700">Admin</th>
                    <th className="text-center p-3 font-medium text-blue-700">User</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Dashboard Admin", admin: true, user: false },
                    { feature: "Kelola Dokter (CRUD)", admin: true, user: false },
                    { feature: "Kelola Pasien (CRUD)", admin: true, user: false },
                    { feature: "Kelola Janji Temu (CRUD)", admin: true, user: false },
                    { feature: "Tambah/Edit/Hapus Data", admin: true, user: false },
                    { feature: "Lihat Direktori Dokter", admin: true, user: true },
                    { feature: "Pendaftaran Pasien", admin: true, user: true },
                    { feature: "History Kunjungan", admin: true, user: true },
                    { feature: "Cek Status Antrian", admin: true, user: true }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-3 text-gray-800">{row.feature}</td>
                      <td className="p-3 text-center">
                        {row.admin ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.user ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Petunjuk Penggunaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-red-800 mb-2">🔑 Untuk Admin:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Login menggunakan salah satu akun admin</li>
                  <li>Akses "Dashboard Admin", "Kelola Dokter", "Kelola Pasien", "Kelola Janji Temu"</li>
                  <li>Dapat menambah, edit, hapus dokter dan data lainnya</li>
                  <li>Lihat statistik lengkap dan laporan sistem</li>
                  <li>Kelola status pasien dan janji temu</li>
                  <li>Akses penuh ke semua fitur sistem</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">👤 Untuk User/Pasien:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Login menggunakan akun user atau pasien</li>
                  <li>Daftar ke poliklinik melalui menu "Daftar"</li>
                  <li>Lihat direktori dokter di "Our Doctors"</li>
                  <li>Cek status antrian di menu "Cek Status"</li>
                  <li>Lihat riwayat kunjungan di menu "History"</li>
                  <li>Menu admin tidak akan terlihat</li>
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">💡 Fitur Khusus Admin:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• ✅ Tambah, edit, hapus dokter dengan jadwal lengkap</li>
                  <li>• ✅ Kelola data pasien dan ubah status antrian</li>
                  <li>• ✅ Buat dan kelola janji temu dengan prioritas</li>
                  <li>• ✅ Dashboard dengan statistik real-time</li>
                </ul>
                <ul className="space-y-1">
                  <li>• ✅ Akses ke semua menu navigasi admin</li>
                  <li>• ✅ Filter dan pencarian data lengkap</li>
                  <li>• ✅ Kontrol penuh atas operasional rumah sakit</li>
                  <li>• ✅ Role-based access control yang ketat</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}