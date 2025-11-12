"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QueueService } from "@/services/queueService"
import { mockDoctors } from "@/data/mockData"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [stats, setStats] = useState({
    totalPending: 0,
    totalConfirmed: 0,
    totalCompleted: 0,
    totalCancelled: 0,
    todayReservations: 0,
    activeQueues: 0
  })

  const [recentReservations, setRecentReservations] = useState<any[]>([])

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      router.push('/login')
      return
    }

    // Load stats
    const pending = QueueService.getAllReservations('pending')
    const confirmed = QueueService.getAllReservations('confirmed')
    const completed = QueueService.getAllReservations('completed')
    const cancelled = QueueService.getAllReservations('cancelled')
    
    const today = new Date().toDateString()
    const todayCount = confirmed.filter(r => 
      new Date(r.reservationDate).toDateString() === today
    ).length

    setStats({
      totalPending: pending.length,
      totalConfirmed: confirmed.length,
      totalCompleted: completed.length,
      totalCancelled: cancelled.length,
      todayReservations: todayCount,
      activeQueues: confirmed.length + pending.length
    })

    // Load recent reservations (last 10)
    const allReservations = [...pending, ...confirmed]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    setRecentReservations(allReservations)
  }, [user, router])

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null
  }

  const quickActions = [
    {
      title: "Verifikasi Pasien",
      description: "Verifikasi pasien di loket pendaftaran",
      icon: "✓",
      href: "/admin/verifikasi-pasien",
      color: "bg-green-500"
    },
    {
      title: "Kelola Jadwal",
      description: "Atur jadwal praktek dokter",
      icon: "📅",
      href: "/admin/jadwal-dokter",
      color: "bg-blue-500"
    },
    {
      title: "Kelola Antrian",
      description: "Pantau dan kelola antrian pasien",
      icon: "🔢",
      href: "/admin/kelola-antrian",
      color: "bg-purple-500"
    },
    {
      title: "Validasi Asuransi",
      description: "Validasi kartu asuransi pasien",
      icon: "🏥",
      href: "/admin/validasi-asuransi",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-700">Menunggu Verifikasi</CardDescription>
              <CardTitle className="text-4xl text-yellow-900">{stats.totalPending}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-700">Terverifikasi</CardDescription>
              <CardTitle className="text-4xl text-green-900">{stats.totalConfirmed}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-700">Selesai</CardDescription>
              <CardTitle className="text-4xl text-blue-900">{stats.totalCompleted}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-red-700">Dibatalkan</CardDescription>
              <CardTitle className="text-4xl text-red-900">{stats.totalCancelled}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-700">Reservasi Hari Ini</CardDescription>
              <CardTitle className="text-4xl text-purple-900">{stats.todayReservations}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-indigo-700">Antrian Aktif</CardDescription>
              <CardTitle className="text-4xl text-indigo-900">{stats.activeQueues}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.href}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Reservasi Terbaru</CardTitle>
            <CardDescription>10 reservasi terakhir yang masuk</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReservations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada reservasi</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="pb-3 px-4 font-semibold text-gray-700">Kode Booking</th>
                      <th className="pb-3 px-4 font-semibold text-gray-700">Nama Pasien</th>
                      <th className="pb-3 px-4 font-semibold text-gray-700">Poli</th>
                      <th className="pb-3 px-4 font-semibold text-gray-700">Tanggal</th>
                      <th className="pb-3 px-4 font-semibold text-gray-700">Antrian</th>
                      <th className="pb-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((reservation) => {
                      const doctor = mockDoctors.find(d => d.id === reservation.doctorId)
                      const statusColors: Record<string, string> = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        confirmed: 'bg-green-100 text-green-800',
                        completed: 'bg-blue-100 text-blue-800',
                        cancelled: 'bg-red-100 text-red-800'
                      }

                      return (
                        <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{reservation.bookingCodePendaftaran}</td>
                          <td className="py-3 px-4">{reservation.patientName}</td>
                          <td className="py-3 px-4 text-sm">{reservation.specialization}</td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(reservation.reservationDate).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4 font-bold text-green-600">#{reservation.queueNumber}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status] || 'bg-gray-100 text-gray-800'}`}>
                              {reservation.status === 'pending' ? 'Menunggu' : 
                               reservation.status === 'confirmed' ? 'Terverifikasi' :
                               reservation.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctor Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Dokter</CardTitle>
            <CardDescription>Total {mockDoctors.length} dokter terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from(new Set(mockDoctors.map(d => d.specialization))).map((spec) => {
                const count = mockDoctors.filter(d => d.specialization === spec).length
                return (
                  <div key={spec} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-xs text-gray-600 mt-1">{spec}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
