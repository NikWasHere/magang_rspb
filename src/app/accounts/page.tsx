import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AccountsPage() {
  const accounts = [
    {
      role: "Administrator",
      email: "admin@rspb.com",
      password: "admin123",
      description: "Akses penuh ke dashboard admin, manajemen pasien, dan semua fitur sistem",
      features: ["Dashboard Admin", "Kelola Pasien", "Statistik", "Laporan"],
      color: "red"
    },
    {
      role: "User/Pasien",
      email: "user@rspb.com", 
      password: "user123",
      description: "Akses untuk pasien - pendaftaran, cek status, riwayat kunjungan",
      features: ["Pendaftaran Online", "Cek Status Antrian", "Riwayat Kunjungan", "Profile"],
      color: "blue"
    },
    {
      role: "Dokter",
      email: "dokter@rspb.com",
      password: "dokter123", 
      description: "Akses khusus dokter dengan fitur admin untuk manajemen pasien",
      features: ["Dashboard Admin", "Kelola Pasien", "Jadwal Praktek", "Rekam Medis"],
      color: "green"
    },
    {
      role: "Pasien",
      email: "pasien@rspb.com",
      password: "pasien123",
      description: "Akun pasien biasa dengan akses terbatas ke fitur publik",
      features: ["Pendaftaran", "Cek Status", "Riwayat", "Profile"],
      color: "purple"
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

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {accounts.map((account, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{account.role}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    account.color === 'red' ? 'bg-red-100 text-red-800' :
                    account.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    account.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {account.role === 'Administrator' || account.role === 'Dokter' ? 'Admin Access' : 'User Access'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{account.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Email:</span> {account.email}</div>
                    <div><span className="font-medium">Password:</span> {account.password}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Fitur yang Tersedia:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {account.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="w-full">
                  <Link href="/login">Login sebagai {account.role}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Petunjuk Penggunaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Untuk Admin/Dokter:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Login menggunakan akun admin atau dokter</li>
                  <li>Akses menu "Dashboard Admin" di navbar</li>
                  <li>Kelola pendaftaran pasien dan status antrian</li>
                  <li>Lihat statistik dan laporan</li>
                  <li>Edit data pasien dan update status</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Untuk User/Pasien:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Login menggunakan akun user atau pasien</li>
                  <li>Daftar ke poliklinik melalui menu "Daftar"</li>
                  <li>Cek status antrian di menu "Cek Status"</li>
                  <li>Lihat riwayat kunjungan di menu "History"</li>
                  <li>Menu "Dashboard Admin" tidak akan terlihat</li>
                </ol>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tips:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Coba login dengan role yang berbeda untuk melihat perbedaan akses</li>
                <li>• Admin dapat melihat dan mengelola semua data pasien</li>
                <li>• User hanya dapat mengakses fitur yang diperlukan untuk pasien</li>
                <li>• Navbar akan berubah secara dinamis berdasarkan role user</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}