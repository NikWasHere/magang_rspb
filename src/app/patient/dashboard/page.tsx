"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QueueService } from "@/services/queueService"
import { getDoctorById } from "@/data/mockData"
import Link from "next/link"
import { Reservation } from "@/types"

export default function PatientDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login')
      return
    }

    // Load patient reservations
    const loadReservations = async () => {
      setLoading(true)
      try {
        const data = QueueService.getPatientReservations(user.id)
        setReservations(data)
      } catch (error) {
        console.error("Error loading reservations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReservations()
  }, [user, router])

  if (!user || user.role !== 'patient') {
    return null
  }

  const activeReservations = reservations.filter(r => r.status === 'pending' || r.status === 'confirmed')
  const completedReservations = reservations.filter(r => r.status === 'completed')
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Pasien</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700">{activeReservations.length}</p>
                <p className="text-sm text-blue-600 mt-1">Reservasi Aktif</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">{completedReservations.length}</p>
                <p className="text-sm text-green-600 mt-1">Kunjungan Selesai</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-700">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-sm text-yellow-600 mt-1">Menunggu Verifikasi</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">{cancelledReservations.length}</p>
                <p className="text-sm text-red-600 mt-1">Dibatalkan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/patient/reservasi">
                <Button className="w-full bg-green-600 hover:bg-green-700 h-20 flex flex-col gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Reservasi Baru
                </Button>
              </Link>

              <Link href="/jadwal">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Lihat Jadwal Dokter
                </Button>
              </Link>

              <Link href="/patient/chat">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat dengan Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Active Reservations */}
        {activeReservations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reservasi Aktif</CardTitle>
              <CardDescription>Reservasi yang sedang berlangsung atau menunggu verifikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeReservations.map((reservation) => {
                  const doctor = getDoctorById(reservation.doctorId)
                  const isToday = new Date(reservation.reservationDate).toDateString() === new Date().toDateString()
                  
                  return (
                    <div key={reservation.id} className={`border rounded-lg p-4 ${isToday ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reservation.status === 'confirmed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {reservation.status === 'confirmed' ? '✓ Sudah Verifikasi' : '⏳ Menunggu Verifikasi'}
                            </span>
                            {isToday && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                📅 Hari Ini
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-semibold text-lg">{reservation.specialization}</h3>
                          <p className="text-gray-600">{doctor?.name || "Dokter tidak ditemukan"}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                            <div>
                              <p className="text-gray-500">Tanggal</p>
                              <p className="font-medium">
                                {new Date(reservation.reservationDate).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-500">Kode Booking</p>
                              <p className="font-bold text-blue-600">{reservation.bookingCodePendaftaran}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-500">Nomor Antrian</p>
                              <p className="font-bold text-green-600 text-xl">{reservation.queueNumber}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-500">Jaminan</p>
                              <p className="font-medium">{reservation.paymentMethod}</p>
                            </div>
                          </div>

                          {reservation.status === 'pending' && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                              <strong>Perhatian:</strong> Silakan datang ke loket pendaftaran untuk verifikasi data dan dokumen Anda.
                            </div>
                          )}

                          {reservation.status === 'confirmed' && reservation.queueLocked && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                              ✅ Nomor antrian Anda <strong>#{reservation.queueNumber}</strong> sudah terkunci dan siap dipanggil.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Active Reservations */}
        {activeReservations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Reservasi Aktif</h3>
              <p className="text-gray-500 mb-6">Buat reservasi sekarang untuk mendapatkan nomor antrian</p>
              <Link href="/patient/reservasi">
                <Button className="bg-green-600 hover:bg-green-700">
                  Buat Reservasi Baru
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* History */}
        {completedReservations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Kunjungan</CardTitle>
              <CardDescription>Daftar kunjungan yang telah selesai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedReservations.slice(0, 5).map((reservation) => {
                  const doctor = getDoctorById(reservation.doctorId)
                  
                  return (
                    <div key={reservation.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                              ✓ Selesai
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(reservation.reservationDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h4 className="font-semibold">{reservation.specialization}</h4>
                          <p className="text-sm text-gray-600">{doctor?.name || "Dokter tidak ditemukan"}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
