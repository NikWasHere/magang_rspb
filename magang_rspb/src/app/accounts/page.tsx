"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

type UserItem = {
  id: number
  name?: string | null
  email: string
  role?: string | null
}

export default function AccountsPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/users`)
        if (!res.ok) throw new Error('Gagal mengambil users')
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('fetch users error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Accounts</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Daftar akun yang terdaftar di sistem. Gunakan akun ini untuk login sesuai peran.
          </p>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {loading ? (
            <div>Loading...</div>
          ) : users.length === 0 ? (
            <div>Tidak ada pengguna terdaftar.</div>
          ) : (
            users.map((u) => (
              <Card key={u.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{u.name || '—'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role && u.role.includes('admin') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role || 'user'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{u.email}</p>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Aksi:</h4>
                    <Button asChild className="w-full">
                      <Link href="/login">Login sebagai {u.name || u.email}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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