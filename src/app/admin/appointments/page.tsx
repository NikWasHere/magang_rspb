"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"
import UserStatusBanner from "@/components/UserStatusBanner"

// Mock data - in real app, fetch from API
const mockAppointments = [
  {
    id: 1,
    appointmentNumber: "APT-001",
    patientName: "John Doe",
    patientPhone: "08123456789",
    doctorName: "Dr. Ahmad Fadil, Sp.JP",
    poli: "Poliklinik Jantung",
    appointmentDate: "2024-10-02",
    appointmentTime: "09:00",
    complaint: "Kontrol rutin jantung",
    status: "Confirmed",
    priority: "Normal",
    createdAt: "2024-10-01 14:30",
    notes: "Pasien sudah konfirmasi kehadiran"
  },
  {
    id: 2,
    appointmentNumber: "APT-002",
    patientName: "Jane Smith",
    patientPhone: "08234567890",
    doctorName: "Dr. Budi Hartono, Sp.OG",
    poli: "Poliklinik Kandungan",
    appointmentDate: "2024-10-02",
    appointmentTime: "10:30",
    complaint: "Pemeriksaan kehamilan trimester 2",
    status: "Pending",
    priority: "High",
    createdAt: "2024-10-01 15:45",
    notes: "Menunggu konfirmasi pasien"
  },
  {
    id: 3,
    appointmentNumber: "APT-003",
    patientName: "Bob Johnson",
    patientPhone: "08345678901",
    doctorName: "Dr. Sarah Wijaya, Sp.S",
    poli: "Poliklinik Saraf",
    appointmentDate: "2024-10-03",
    appointmentTime: "14:00",
    complaint: "Konsultasi hasil MRI kepala",
    status: "Confirmed",
    priority: "Urgent",
    createdAt: "2024-10-01 16:20",
    notes: "Hasil MRI sudah tersedia"
  },
  {
    id: 4,
    appointmentNumber: "APT-004",
    patientName: "Alice Brown",
    patientPhone: "08456789012",
    doctorName: "Dr. Maya Kusuma, Sp.M",
    poli: "Poliklinik Mata",
    appointmentDate: "2024-10-04",
    appointmentTime: "11:15",
    complaint: "Operasi katarak",
    status: "Cancelled",
    priority: "Normal",
    createdAt: "2024-10-01 12:10",
    notes: "Dibatalkan oleh pasien karena sakit"
  },
  {
    id: 5,
    appointmentNumber: "APT-005",
    patientName: "Charlie Wilson",
    patientPhone: "08567890123",
    doctorName: "Dr. Rini Astuti, Sp.A",
    poli: "Poliklinik Anak",
    appointmentDate: "2024-10-02",
    appointmentTime: "15:30",
    complaint: "Imunisasi rutin anak",
    status: "Completed",
    priority: "Normal",
    createdAt: "2024-09-30 09:15",
    notes: "Imunisasi berhasil dilakukan"
  }
]

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("")

  // Filter appointments based on search term, status, and date
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.appointmentNumber.includes(searchTerm) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.poli.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.complaint.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || appointment.status === statusFilter
    const matchesDate = !dateFilter || appointment.appointmentDate === dateFilter
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    ))
  }

  const handleDeleteAppointment = (appointmentId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus janji temu ini?")) {
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Confirmed': return 'bg-blue-100 text-blue-800'  
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'No Show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Normal': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* User Status */}
        <UserStatusBanner />

        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/admin" 
            className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Dashboard Admin
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kelola Janji Temu</h1>
              <p className="text-gray-600">Kelola jadwal dan status janji temu pasien</p>
            </div>
            <Link href="/admin/appointments/add">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Buat Janji Temu Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Janji Temu</p>
                  <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu Konfirmasi</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {appointments.filter(p => p.status === 'Pending').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terkonfirmasi</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {appointments.filter(p => p.status === 'Confirmed').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">
                    {appointments.filter(p => p.status === 'Completed').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
                  <p className="text-2xl font-bold text-red-600">
                    {appointments.filter(p => p.status === 'Cancelled').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari janji temu (pasien, nomor, dokter, poli, keluhan)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">Semua Status</option>
                <option value="Pending">Menunggu Konfirmasi</option>
                <option value="Confirmed">Terkonfirmasi</option>
                <option value="Completed">Selesai</option>
                <option value="Cancelled">Dibatalkan</option>
                <option value="No Show">Tidak Hadir</option>
              </select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
                placeholder="Filter tanggal"
              />
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("All")
                  setDateFilter("")
                }}
                variant="outline"
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Janji Temu ({filteredAppointments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">No. Janji Temu</th>
                    <th className="text-left p-3 font-medium text-gray-700">Pasien</th>
                    <th className="text-left p-3 font-medium text-gray-700">Dokter & Poli</th>
                    <th className="text-left p-3 font-medium text-gray-700">Jadwal</th>
                    <th className="text-left p-3 font-medium text-gray-700">Keluhan</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Prioritas</th>
                    <th className="text-left p-3 font-medium text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {appointment.appointmentNumber}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-gray-800">{appointment.patientName}</div>
                          <div className="text-sm text-gray-600">{appointment.patientPhone}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{appointment.doctorName}</div>
                          <div className="text-sm text-gray-600">{appointment.poli}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{appointment.appointmentDate}</div>
                          <div className="text-sm text-gray-600">{appointment.appointmentTime}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {appointment.complaint}
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-green-500 ${getStatusColor(appointment.status)}`}
                        >
                          <option value="Pending">Menunggu</option>
                          <option value="Confirmed">Terkonfirmasi</option>
                          <option value="Completed">Selesai</option>
                          <option value="Cancelled">Dibatalkan</option>
                          <option value="No Show">Tidak Hadir</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                          {appointment.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/appointments/${appointment.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Detail
                          </Link>
                          <Link 
                            href={`/admin/appointments/edit/${appointment.id}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAppointments.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                  </svg>
                </div>
                <p>Tidak ada janji temu yang ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || dateFilter ? "Coba ubah filter pencarian" : "Belum ada janji temu terjadwal"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminAppointmentsPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminAppointmentsPage />
    </ProtectedRoute>
  )
}