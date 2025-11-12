"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QueueService } from "@/services/queueService"
import { mockDoctors } from "@/data/mockData"
import { Reservation } from "@/types"

export default function KelolaAntrianPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedPoli, setSelectedPoli] = useState("all")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [currentNumber, setCurrentNumber] = useState<number | null>(null)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      router.push('/login')
      return
    }
    loadReservations()
  }, [user, router, selectedDate, selectedPoli])

  const loadReservations = () => {
    const confirmed = QueueService.getAllReservations('confirmed')
    const completed = QueueService.getAllReservations('completed')
    const allReservations = [...confirmed, ...completed]
    
    let filtered = allReservations.filter(r => {
      const reservationDate = new Date(r.reservationDate).toISOString().split('T')[0]
      return reservationDate === selectedDate
    })

    if (selectedPoli !== "all") {
      filtered = filtered.filter(r => r.specialization === selectedPoli)
    }

    filtered.sort((a, b) => a.queueNumber - b.queueNumber)
    setReservations(filtered)
  }

  const handleCallNext = () => {
    const waiting = reservations.filter(r => r.status === 'confirmed')
    if (waiting.length > 0) {
      setCurrentNumber(waiting[0].queueNumber)
      alert(`Memanggil Nomor Antrian: ${waiting[0].queueNumber}\nPasien: ${waiting[0].patientName}`)
    } else {
      alert("Tidak ada pasien yang menunggu")
    }
  }

  const handleComplete = (reservationId: string) => {
    if (confirm("Tandai pasien ini sebagai selesai?")) {
      // In real app, call API to update status
      const updatedReservations = reservations.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'completed' as any }
          : r
      )
      setReservations(updatedReservations)
      alert("Status berhasil diupdate!")
    }
  }

  const handleSkip = (queueNumber: number) => {
    alert(`Melewati nomor antrian ${queueNumber}`)
    const nextWaiting = reservations.filter(r => 
      r.status === 'confirmed' && r.queueNumber > queueNumber
    )
    if (nextWaiting.length > 0) {
      setCurrentNumber(nextWaiting[0].queueNumber)
    }
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null
  }

  const poliList = Array.from(new Set(mockDoctors.map(d => d.specialization)))
  const waitingCount = reservations.filter(r => r.status === 'confirmed').length
  const completedCount = reservations.filter(r => r.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Kelola Antrian</h1>
          <p className="text-gray-600 mt-2">Pantau dan kelola antrian pasien</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-700">Menunggu</CardDescription>
              <CardTitle className="text-4xl text-yellow-900">{waitingCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-700">Selesai Hari Ini</CardDescription>
              <CardTitle className="text-4xl text-green-900">{completedCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-700">Total Hari Ini</CardDescription>
              <CardTitle className="text-4xl text-blue-900">{reservations.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-700">Sedang Dipanggil</CardDescription>
              <CardTitle className="text-4xl text-purple-900">
                {currentNumber ? `#${currentNumber}` : '-'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Poli</label>
                <select
                  value={selectedPoli}
                  onChange={(e) => setSelectedPoli(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                >
                  <option value="all">Semua Poli</option>
                  {poliList.map(poli => (
                    <option key={poli} value={poli}>{poli}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleCallNext}
                className="bg-green-600 hover:bg-green-700 h-10"
                disabled={waitingCount === 0}
              >
                📢 Panggil Pasien Berikutnya
              </Button>

              <Button
                onClick={loadReservations}
                variant="outline"
                className="h-10"
              >
                🔄 Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Queue List */}
        <div className="grid grid-cols-1 gap-4">
          {reservations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                Tidak ada antrian untuk tanggal dan poli yang dipilih
              </CardContent>
            </Card>
          ) : (
            reservations.map((reservation) => {
              const doctor = mockDoctors.find(d => d.id === reservation.doctorId)
              const isActive = currentNumber === reservation.queueNumber
              const isCompleted = reservation.status === 'completed'
              
              return (
                <Card 
                  key={reservation.id}
                  className={`${
                    isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 
                    isCompleted ? 'opacity-60 bg-gray-50' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Queue Number */}
                      <div className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center ${
                        isActive ? 'bg-blue-600 text-white' :
                        isCompleted ? 'bg-gray-400 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        <div className="text-sm font-medium">Nomor</div>
                        <div className="text-3xl font-bold">{reservation.queueNumber}</div>
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nama Pasien</p>
                          <p className="font-semibold text-lg">{reservation.patientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Poli</p>
                          <p className="font-semibold">{reservation.specialization}</p>
                          <p className="text-sm text-gray-600">{doctor?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Booking Code</p>
                          <p className="font-mono font-semibold">{reservation.bookingCodePendaftaran}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isCompleted ? (
                          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            ✓ Selesai
                          </span>
                        ) : isActive ? (
                          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            🔊 Sedang Dipanggil
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            ⏳ Menunggu
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      {!isCompleted && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleComplete(reservation.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓ Selesai
                          </Button>
                          <Button
                            onClick={() => handleSkip(reservation.queueNumber)}
                            variant="outline"
                          >
                            ⏭️ Lewati
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
