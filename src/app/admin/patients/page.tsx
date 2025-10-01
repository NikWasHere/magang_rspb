"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"
import UserStatusBanner from "@/components/UserStatusBanner"

// Mock data - in real app, fetch from API
const mockPatients = [
  {
    id: 1,
    queueNumber: "001",
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    birthDate: "1985-05-15",
    gender: "Laki-laki",
    address: "Jl. Sudirman No. 123, Jakarta",
    complaint: "Sakit kepala berkepanjangan",
    poli: "Poliklinik Saraf",
    doctor: "Dr. Sarah Wijaya, Sp.S",
    registeredAt: "2024-10-01 09:30",
    status: "Waiting",
    priority: "Normal"
  },
  {
    id: 2,
    queueNumber: "002", 
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "08234567890",
    birthDate: "1992-08-22",
    gender: "Perempuan",
    address: "Jl. Thamrin No. 456, Jakarta",
    complaint: "Demam tinggi dan batuk",
    poli: "Poliklinik Umum",
    doctor: "Dr. Ahmad Fadil, Sp.PD",
    registeredAt: "2024-10-01 10:15",
    status: "In Progress",
    priority: "Urgent"
  },
  {
    id: 3,
    queueNumber: "003",
    name: "Bob Johnson", 
    email: "bob@example.com",
    phone: "08345678901",
    birthDate: "1978-12-10",
    gender: "Laki-laki",
    address: "Jl. Gatot Subroto No. 789, Jakarta",
    complaint: "Sakit gigi berlubang",
    poli: "Poliklinik Gigi",
    doctor: "Dr. Lisa Sari, Sp.KG",
    registeredAt: "2024-10-01 11:00",
    status: "Completed",
    priority: "Normal"
  },
  {
    id: 4,
    queueNumber: "004",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "08456789012",
    birthDate: "1990-03-25",
    gender: "Perempuan",
    address: "Jl. Kuningan No. 321, Jakarta",
    complaint: "Pemeriksaan kehamilan rutin",
    poli: "Poliklinik Kandungan",
    doctor: "Dr. Budi Hartono, Sp.OG",
    registeredAt: "2024-10-01 13:45",
    status: "Waiting",
    priority: "Normal"
  }
]

function AdminPatientsPage() {
  const [patients, setPatients] = useState(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Filter patients based on search term and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.queueNumber.includes(searchTerm) ||
                         patient.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.poli.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || patient.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (patientId: number, newStatus: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    ))
  }

  const handleDeletePatient = (patientId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
      setPatients(prev => prev.filter(patient => patient.id !== patientId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'  
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
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
              <h1 className="text-2xl font-bold text-gray-800">Kelola Pasien</h1>
              <p className="text-gray-600">Kelola data dan status pasien</p>
            </div>
            <Link href="/daftar">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Daftar Pasien Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pasien Hari Ini</p>
                  <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {patients.filter(p => p.status === 'Waiting').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-sm font-medium text-gray-600">Sedang Dilayani</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {patients.filter(p => p.status === 'In Progress').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
                    {patients.filter(p => p.status === 'Completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                  placeholder="Cari pasien (nama, nomor antrian, keluhan, poli)..."
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
                <option value="Waiting">Menunggu</option>
                <option value="In Progress">Sedang Dilayani</option>
                <option value="Completed">Selesai</option>
                <option value="Cancelled">Dibatalkan</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pasien ({filteredPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">No. Antrian</th>
                    <th className="text-left p-3 font-medium text-gray-700">Pasien</th>
                    <th className="text-left p-3 font-medium text-gray-700">Keluhan</th>
                    <th className="text-left p-3 font-medium text-gray-700">Poli & Dokter</th>
                    <th className="text-left p-3 font-medium text-gray-700">Waktu Daftar</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Prioritas</th>
                    <th className="text-left p-3 font-medium text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {patient.queueNumber}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-gray-800">{patient.name}</div>
                          <div className="text-sm text-gray-600">{patient.phone}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {patient.complaint}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{patient.poli}</div>
                          <div className="text-sm text-gray-600">{patient.doctor}</div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {patient.registeredAt}
                      </td>
                      <td className="p-3">
                        <select
                          value={patient.status}
                          onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-green-500 ${getStatusColor(patient.status)}`}
                        >
                          <option value="Waiting">Menunggu</option>
                          <option value="In Progress">Sedang Dilayani</option>
                          <option value="Completed">Selesai</option>
                          <option value="Cancelled">Dibatalkan</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/patients/${patient.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Detail
                          </Link>
                          <Link 
                            href={`/admin/patients/edit/${patient.id}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeletePatient(patient.id)}
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

            {filteredPatients.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p>Tidak ada pasien yang ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Coba ubah kata kunci pencarian" : "Belum ada pasien terdaftar"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminPatientsPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPatientsPage />
    </ProtectedRoute>
  )
}