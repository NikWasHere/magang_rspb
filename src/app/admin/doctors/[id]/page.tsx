"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock data - in real app, fetch from API
const doctors = [
  {
    id: 1,
    name: "Dr. Ahmad Fadil, Sp.JP",
    specialization: "Spesialis Jantung dan Pembuluh Darah",
    poli: "Poliklinik Jantung",
    education: "Universitas Indonesia",
    experience: "15 tahun",
    description: "Dokter spesialis jantung dengan pengalaman luas dalam kardiologi intervensi dan elektrofisiologi jantung. Telah menangani ribuan kasus penyakit jantung dengan tingkat kesuksesan tinggi.",
    expertise: ["Kardiologi Intervensi", "Elektrofisiologi Jantung", "Ekokardiografi", "Kateterisasi Jantung"],
    awards: ["Best Doctor Award 2023", "Excellence in Patient Care 2022", "Outstanding Cardiac Surgeon 2021"],
    phone: "08123456789",
    email: "dr.ahmad@rspb.com",
    status: "Active",
    schedule: [
      { day: "Senin", time: "08:00 - 12:00" },
      { day: "Rabu", time: "13:00 - 17:00" },
      { day: "Jumat", time: "08:00 - 12:00" }
    ],
    lastActivity: "2024-01-15",
    totalPatients: 245,
    activeSchedules: 3
  }
]

function AdminDoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const doctorId = parseInt(params.id as string)
  
  // Find doctor by ID
  const doctor = doctors.find(d => d.id === doctorId)
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dokter Tidak Ditemukan</h1>
          <Link href="/admin/doctors">
            <Button>Kembali ke Daftar Dokter</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${doctor.name}?`)) {
      console.log("Delete doctor:", doctor.id)
      router.push("/admin/doctors")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/admin/doctors" 
            className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Manajemen Dokter
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
              <p className="text-green-600 font-medium text-lg">{doctor.specialization}</p>
              <p className="text-gray-600">{doctor.poli}</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/doctors/edit/${doctor.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Data
                </Button>
              </Link>
              <Button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil Dokter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{doctor.name}</h3>
                    <p className="text-green-600 font-medium">{doctor.specialization}</p>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.status === 'Active' ? 'bg-green-100 text-green-800' :
                        doctor.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doctor.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pengalaman</p>
                    <p className="text-lg font-semibold text-gray-800">{doctor.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Alumni</p>
                    <p className="text-lg font-semibold text-gray-800">{doctor.education}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Pasien</p>
                    <p className="text-lg font-semibold text-gray-800">{doctor.totalPatients}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Aktivitas Terakhir</p>
                    <p className="text-lg font-semibold text-gray-800">{doctor.lastActivity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Keahlian Khusus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {doctor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Awards */}
            <Card>
              <CardHeader>
                <CardTitle>Penghargaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doctor.awards.map((award, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-700">{award}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{doctor.phone}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{doctor.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Praktek</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctor.schedule.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-sm text-gray-600">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/admin/doctors/edit/${doctor.id}`} className="block">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Data Dokter
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                  </svg>
                  Lihat Pasien
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Statistik
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDoctorDetailPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDoctorDetailPage />
    </ProtectedRoute>
  )
}