"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"
import UserStatusBanner from "@/components/UserStatusBanner"

function AdminDoctorsPage() {
  // Mock data - in real app this would come from database/API
  const doctors = [
    {
      id: 1,
      name: "Dr. Ahmad Susanto, Sp.JP",
      specialization: "Spesialis Jantung dan Pembuluh Darah",
      poli: "Poliklinik Jantung",
      education: "Universitas Indonesia",
      experience: "15 tahun",
      status: "Active",
      schedule: [
        { day: "Senin", time: "08:00 - 12:00" },
        { day: "Rabu", time: "13:00 - 17:00" },
        { day: "Jumat", time: "08:00 - 12:00" }
      ]
    },
    {
      id: 2,
      name: "Dr. Sari Dewi, Sp.A",
      specialization: "Spesialis Anak",
      poli: "Poliklinik Anak",
      education: "Universitas Gadjah Mada",
      experience: "12 tahun",
      status: "Active",
      schedule: [
        { day: "Selasa", time: "09:00 - 14:00" },
        { day: "Kamis", time: "09:00 - 14:00" },
        { day: "Sabtu", time: "08:00 - 12:00" }
      ]
    },
    {
      id: 3,
      name: "Dr. Budi Hartono, Sp.OG",
      specialization: "Spesialis Kandungan dan Kebidanan",
      poli: "Poliklinik Kandungan",
      education: "Universitas Airlangga",
      experience: "18 tahun",
      status: "Active",
      schedule: [
        { day: "Senin", time: "13:00 - 17:00" },
        { day: "Selasa", time: "08:00 - 12:00" },
        { day: "Kamis", time: "13:00 - 17:00" }
      ]
    },
    {
      id: 4,
      name: "Dr. Maya Kusuma, Sp.M",
      specialization: "Spesialis Mata",
      poli: "Poliklinik Mata",
      education: "Universitas Padjadjaran",
      experience: "10 tahun",
      status: "Active",
      schedule: [
        { day: "Rabu", time: "08:00 - 15:00" },
        { day: "Jumat", time: "13:00 - 17:00" },
        { day: "Sabtu", time: "08:00 - 12:00" }
      ]
    },
    {
      id: 5,
      name: "Dr. Rizki Pratama, Sp.PD",
      specialization: "Spesialis Penyakit Dalam",
      poli: "Poliklinik Penyakit Dalam",
      education: "Universitas Indonesia",
      experience: "14 tahun",
      status: "Active",
      schedule: [
        { day: "Senin", time: "08:00 - 12:00" },
        { day: "Rabu", time: "08:00 - 12:00" },
        { day: "Jumat", time: "08:00 - 12:00" }
      ]
    },
    {
      id: 6,
      name: "Dr. Indira Sari, Sp.THT",
      specialization: "Spesialis THT-KL",
      poli: "Poliklinik THT",
      education: "Universitas Diponegoro",
      experience: "11 tahun",
      status: "Active",
      schedule: [
        { day: "Selasa", time: "13:00 - 17:00" },
        { day: "Kamis", time: "08:00 - 12:00" },
        { day: "Sabtu", time: "13:00 - 17:00" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* User Status */}
        <UserStatusBanner />

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-0 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Dokter</h1>
                <p className="text-gray-600">Kelola data dokter dan jadwal praktek</p>
              </div>
              <Link href="/admin/doctors/add">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6">
                  + Tambah Dokter Baru
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
                <div className="text-sm text-blue-800">Total Dokter</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{doctors.filter(d => d.status === 'Active').length}</div>
                <div className="text-sm text-green-800">Dokter Aktif</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">6</div>
                <div className="text-sm text-yellow-800">Spesialisasi</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">25</div>
                <div className="text-sm text-purple-800">Jam Praktek/Minggu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-xl shadow-lg border-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Dokter</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">Dokter</th>
                  <th className="text-left p-4 font-medium text-gray-700">Spesialisasi</th>
                  <th className="text-left p-4 font-medium text-gray-700">Poliklinik</th>
                  <th className="text-left p-4 font-medium text-gray-700">Pengalaman</th>
                  <th className="text-left p-4 font-medium text-gray-700">Jadwal</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.education}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{doctor.specialization}</td>
                    <td className="p-4 text-gray-600">{doctor.poli}</td>
                    <td className="p-4 text-gray-600">{doctor.experience}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">{doctor.schedule.length} hari</div>
                        <div className="text-gray-500">
                          {doctor.schedule.map(s => s.day).join(", ")}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/doctors/edit/${doctor.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <Link 
                          href={`/admin/doctors/${doctor.id}`}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus ${doctor.name}?`)) {
                              console.log("Delete doctor:", doctor.id)
                              // In real app, call API to delete doctor
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jadwal Dokter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Kelola jadwal praktek semua dokter</p>
              <Button variant="outline" className="w-full">
                Kelola Jadwal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spesialisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Tambah atau edit spesialisasi dokter</p>
              <Button variant="outline" className="w-full">
                Kelola Spesialisasi
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Lihat laporan aktivitas dokter</p>
              <Button variant="outline" className="w-full">
                Lihat Laporan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminDoctorsPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDoctorsPage />
    </ProtectedRoute>
  )
}