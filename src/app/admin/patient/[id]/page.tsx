"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"

function PatientDetailPage() {
  const [isEditing, setIsEditing] = useState(false)
  
  // Mock patient data - in real app this would come from URL params and API
  const [patient, setPatient] = useState({
    queueNumber: "001",
    name: "John Doe",
    nik: "1234567890123456",
    phone: "08123456789",
    email: "john@example.com",
    birthDate: "1990-01-15",
    address: "Jl. Merdeka No. 123, Jakarta",
    complaint: "Sakit kepala dan pusing",
    poli: "Klinik Pratama Pertamina",
    registeredAt: "2025-09-30 09:30",
    status: "Waiting"
  })

  const handleSave = () => {
    // In real app, this would make an API call
    setIsEditing(false)
    // Show success message
  }

  const handleStatusUpdate = (newStatus: string) => {
    setPatient(prev => ({ ...prev, status: newStatus }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/admin" 
            className="text-green-600 hover:text-green-700 text-sm font-medium mb-2 inline-block"
          >
            ← Kembali ke Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Detail Pasien</h1>
              <p className="text-gray-600">No. Antrian: {patient.queueNumber}</p>
            </div>
            <div className="flex gap-3">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Edit Data
                </Button>
              )}
              {isEditing && (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Simpan
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pasien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={patient.name}
                      onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nik">NIK</Label>
                    <Input
                      id="nik"
                      value={patient.nik}
                      onChange={(e) => setPatient(prev => ({ ...prev, nik: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={patient.phone}
                      onChange={(e) => setPatient(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patient.email}
                      onChange={(e) => setPatient(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Tanggal Lahir</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={patient.birthDate}
                      onChange={(e) => setPatient(prev => ({ ...prev, birthDate: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="poli">Poliklinik</Label>
                    <Input
                      id="poli"
                      value={patient.poli}
                      onChange={(e) => setPatient(prev => ({ ...prev, poli: e.target.value }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={patient.address}
                    onChange={(e) => setPatient(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="complaint">Keluhan</Label>
                  <textarea
                    id="complaint"
                    value={patient.complaint}
                    onChange={(e) => setPatient(prev => ({ ...prev, complaint: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border rounded-md ${
                      !isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Antrian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {patient.queueNumber}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                    patient.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => handleStatusUpdate('Waiting')}
                    variant="outline"
                    className="w-full"
                    disabled={patient.status === 'Waiting'}
                  >
                    Set Menunggu
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('In Progress')}
                    variant="outline"
                    className="w-full"
                    disabled={patient.status === 'In Progress'}
                  >
                    Set Sedang Dilayani
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('Completed')}
                    variant="outline"
                    className="w-full"
                    disabled={patient.status === 'Completed'}
                  >
                    Set Selesai
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Waktu Daftar:</span>
                    <div className="text-gray-600">{patient.registeredAt}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estimasi Waktu:</span>
                    <div className="text-gray-600">30-45 menit</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Panggil Pasien
                </Button>
                <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                  Print Kartu Antrian
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                  Hapus Pendaftaran
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PatientDetailPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <PatientDetailPage />
    </ProtectedRoute>
  )
}