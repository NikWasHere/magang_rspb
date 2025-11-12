"use client"

import { useState } from "react"
import { mockDoctors, mockSchedules, getSchedulesByDoctorId } from "@/data/mockData"
import { Doctor, DoctorSchedule } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function JadwalDokterPage() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique specializations
  const specializations = Array.from(new Set(mockDoctors.map(d => d.specialization)))

  // Filter doctors
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSpecialization = selectedSpecialization === "all" || doctor.specialization === selectedSpecialization
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSpecialization && matchesSearch
  })



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Jadwal Dokter</h1>
          <p className="text-gray-600">Temukan jadwal praktek dokter spesialis kami</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Dokter
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama dokter atau spesialisasi..."
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Specialization Filter */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Spesialisasi
                </label>
                <select
                  id="specialization"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Spesialisasi</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Tidak ada dokter yang ditemukan dengan kriteria tersebut</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => {
              const schedules = getSchedulesByDoctorId(doctor.id)
              
              return (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {/* Doctor Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {doctor.name.charAt(0)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {doctor.specialization}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* Schedules */}
                      {schedules.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Jadwal belum tersedia
                        </p>
                      ) : (
                        <>
                          <h4 className="font-medium text-sm text-gray-700">Jadwal Praktek:</h4>
                          <div className="space-y-2">
                            {schedules.map((schedule) => (
                              <div 
                                key={schedule.id}
                                className="bg-gray-50 rounded-md p-3 border border-gray-200"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">
                                      {schedule.dayOfWeek}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {schedule.startTime} - {schedule.endTime}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">Kuota</p>
                                    <p className="font-semibold text-sm text-blue-600">
                                      {schedule.quota}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Info */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-xs text-yellow-800">
                            💡 <strong>Untuk melakukan reservasi online,</strong> silakan{" "}
                            <a href="/register-patient" className="underline font-medium hover:text-yellow-900">
                              daftar sebagai pasien
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-blue-600 text-3xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Informasi Penting</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Jadwal praktek dapat berubah sewaktu-waktu</li>
                  <li>• Untuk reservasi online 24/7, harap mendaftar sebagai pasien terlebih dahulu</li>
                  <li>• Kuota yang ditampilkan adalah kuota maksimum per sesi</li>
                  <li>• Pasien dengan reservasi online mendapatkan nomor antrian yang terkunci</li>
                  <li>• Harap datang 15 menit sebelum jadwal untuk verifikasi di loket pendaftaran</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
