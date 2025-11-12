"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QueueService } from "@/services/queueService"
import { getDoctorById } from "@/data/mockData"
import { Reservation } from "@/types"

export default function VerifikasiPasienPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [bookingCode, setBookingCode] = useState("")
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Verification form
  const [eselon, setEselon] = useState("")
  const [notes, setNotes] = useState("")

  // Pending reservations list
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([])

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      router.push('/login')
      return
    }

    // Load pending reservations
    const loadPending = () => {
      const pending = QueueService.getAllReservations('pending')
      setPendingReservations(pending)
    }

    loadPending()
  }, [user, router])

  const handleSearchReservation = () => {
    setError("")
    setSuccess(false)
    
    if (!bookingCode.trim()) {
      setError("Mohon masukkan kode booking")
      return
    }

    const found = QueueService.getReservationByBookingCode(bookingCode)
    
    if (!found) {
      setError("Kode booking tidak ditemukan")
      setReservation(null)
      return
    }

    if (found.status === 'confirmed') {
      setError("Reservasi ini sudah diverifikasi sebelumnya")
      setReservation(found)
      return
    }

    if (found.status === 'cancelled') {
      setError("Reservasi ini sudah dibatalkan")
      setReservation(found)
      return
    }

    setReservation(found)
  }

  const handleVerifyReservation = async () => {
    if (!reservation || !user) return

    if (!eselon.trim()) {
      setError("Mohon tentukan eselon pasien")
      return
    }

    setLoading(true)
    setError("")

    try {
      const verified = await QueueService.verifyReservation(
        reservation.id,
        user.id,
        eselon
      )

      if (verified) {
        setSuccess(true)
        setReservation(verified)
        
        // Reload pending list
        const pending = QueueService.getAllReservations('pending')
        setPendingReservations(pending)
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setBookingCode("")
          setReservation(null)
          setEselon("")
          setNotes("")
          setSuccess(false)
        }, 3000)
      } else {
        setError("Gagal memverifikasi reservasi")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat verifikasi")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPending = (res: Reservation) => {
    setBookingCode(res.bookingCodePendaftaran)
    setReservation(res)
    setError("")
    setSuccess(false)
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null
  }

  const doctor = reservation ? getDoctorById(reservation.doctorId) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Verifikasi Pasien di Loket</h1>
          <p className="text-gray-600 mt-2">Verifikasi data pasien yang datang ke rumah sakit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Pending Reservations */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Menunggu Verifikasi</CardTitle>
                <CardDescription>
                  {pendingReservations.length} pasien menunggu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReservations.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Tidak ada pasien yang menunggu verifikasi
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {pendingReservations.map((res) => {
                      const doc = getDoctorById(res.doctorId)
                      const isToday = new Date(res.reservationDate).toDateString() === new Date().toDateString()
                      
                      return (
                        <button
                          key={res.id}
                          onClick={() => handleSelectPending(res)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            reservation?.id === res.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          } ${isToday ? 'bg-yellow-50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{res.patientName}</p>
                              <p className="text-xs text-gray-600 truncate">{doc?.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  {res.bookingCodePendaftaran}
                                </span>
                                {isToday && (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                    Hari Ini
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">#{res.queueNumber}</p>
                              <p className="text-xs text-gray-500">Antrian</p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Verification Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Form Verifikasi</CardTitle>
                <CardDescription>Masukkan kode booking untuk memulai verifikasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="bookingCode">Kode Booking Pendaftaran</Label>
                    <Input
                      id="bookingCode"
                      value={bookingCode}
                      onChange={(e) => setBookingCode(e.target.value)}
                      placeholder="Contoh: 2023"
                      className="text-lg font-mono"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchReservation()
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleSearchReservation} className="bg-blue-600 hover:bg-blue-700">
                      Cari
                    </Button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    ✓ Verifikasi berhasil! Pasien dapat menuju ke poli dengan nomor antrian #{reservation?.queueNumber}
                  </div>
                )}

                {/* Reservation Details */}
                {reservation && reservation.status === 'pending' && (
                  <>
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-lg">Data Pasien</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nama Lengkap</p>
                          <p className="font-medium">{reservation.patientName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">No. KTP</p>
                          <p className="font-medium font-mono">{reservation.patientKTP}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Jenis Kelamin</p>
                          <p className="font-medium">{reservation.patientGender}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Tempat, Tanggal Lahir</p>
                          <p className="font-medium">
                            {reservation.patientBirthPlace}, {new Date(reservation.patientBirthDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">No. HP/WhatsApp</p>
                          <p className="font-medium">{reservation.patientPhone}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{reservation.patientEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <h3 className="font-semibold text-lg">Detail Reservasi</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Tanggal Berobat</p>
                          <p className="font-medium">
                            {new Date(reservation.reservationDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Poli</p>
                          <p className="font-medium">{reservation.specialization}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Dokter</p>
                          <p className="font-medium">{doctor?.name || "Tidak ditemukan"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Nomor Antrian Terkunci</p>
                          <p className="text-3xl font-bold text-green-600">#{reservation.queueNumber}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                          <strong>Gejala:</strong> {reservation.symptoms}
                        </p>
                        {reservation.aiRecommendedPoli && (
                          <p className="text-sm text-blue-600 mt-2">
                            <strong>AI Rekomendasi:</strong> {reservation.aiRecommendedPoli} ({reservation.aiConfidence}% confidence)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <h3 className="font-semibold text-lg">Jaminan Pembayaran</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Metode Pembayaran</p>
                          <p className="font-medium">{reservation.paymentMethod}</p>
                        </div>
                        
                        {reservation.paymentMethod !== 'Cash' && (
                          <>
                            <div>
                              <p className="text-sm text-gray-500">Nama Perusahaan/BPJS</p>
                              <p className="font-medium">{reservation.insuranceName || "-"}</p>
                            </div>
                            
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500">Nomor Kartu Asuransi</p>
                              <p className="font-medium font-mono">{reservation.insuranceNumber || "-"}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <h3 className="font-semibold text-lg">Verifikasi</h3>
                      
                      <div>
                        <Label htmlFor="eselon">Tentukan Eselon *</Label>
                        <select
                          id="eselon"
                          value={eselon}
                          onChange={(e) => setEselon(e.target.value)}
                          className="w-full h-10 px-3 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">-- Pilih Eselon --</option>
                          <option value="Eselon I">Eselon I</option>
                          <option value="Eselon II">Eselon II</option>
                          <option value="Eselon III">Eselon III</option>
                          <option value="Eselon IV">Eselon IV</option>
                          <option value="Umum">Umum</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="notes">Catatan Admin (Opsional)</Label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Catatan tambahan..."
                        />
                      </div>

                      <Button
                        onClick={handleVerifyReservation}
                        disabled={loading || !eselon}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg h-12"
                      >
                        {loading ? "Memproses..." : "✓ Verifikasi & Konfirmasi Antrian"}
                      </Button>
                    </div>
                  </>
                )}

                {/* Already Verified */}
                {reservation && reservation.status === 'confirmed' && (
                  <div className="border-t pt-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Sudah Diverifikasi</h3>
                      <p className="text-green-700">
                        Reservasi ini sudah diverifikasi pada {new Date(reservation.verifiedAt!).toLocaleString('id-ID')}
                      </p>
                      <p className="text-green-700 mt-2">
                        Nomor Antrian: <strong>#{reservation.queueNumber}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
