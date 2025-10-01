"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"

function AddDoctorPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
    poli: "Poliklinik Umum",
    education: "",
    experience: "",
    description: "",
    expertise: "",
    awards: "",
    phone: "",
    email: "",
    status: "Active",
    schedule: [
      { day: "Senin", time: "08:00 - 12:00", enabled: false },
      { day: "Selasa", time: "08:00 - 12:00", enabled: false },
      { day: "Rabu", time: "08:00 - 12:00", enabled: false },
      { day: "Kamis", time: "08:00 - 12:00", enabled: false },
      { day: "Jumat", time: "08:00 - 12:00", enabled: false },
      { day: "Sabtu", time: "08:00 - 12:00", enabled: false },
      { day: "Minggu", time: "08:00 - 12:00", enabled: false }
    ]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDoctorData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleScheduleChange = (index: number, field: string, value: any) => {
    setDoctorData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("New doctor data:", doctorData)
      setIsSubmitting(false)
      router.push("/admin/doctors")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-4xl px-4">
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
          <h1 className="text-2xl font-bold text-gray-800">Tambah Dokter Baru</h1>
          <p className="text-gray-600">Masukkan informasi dokter baru dan jadwal praktek</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={doctorData.name}
                    onChange={handleInputChange}
                    placeholder="Dr. Nama Lengkap, Sp.XX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Spesialisasi *</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={doctorData.specialization}
                    onChange={handleInputChange}
                    placeholder="Spesialis Jantung dan Pembuluh Darah"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="poli">Poliklinik *</Label>
                  <select
                    id="poli"
                    name="poli"
                    value={doctorData.poli}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Poliklinik Umum">Poliklinik Umum</option>
                    <option value="Poliklinik Jantung">Poliklinik Jantung</option>
                    <option value="Poliklinik Anak">Poliklinik Anak</option>
                    <option value="Poliklinik Kandungan">Poliklinik Kandungan</option>
                    <option value="Poliklinik Mata">Poliklinik Mata</option>
                    <option value="Poliklinik Penyakit Dalam">Poliklinik Penyakit Dalam</option>
                    <option value="Poliklinik THT">Poliklinik THT</option>
                    <option value="Poliklinik Saraf">Poliklinik Saraf</option>
                    <option value="Poliklinik Kulit">Poliklinik Kulit</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="education">Pendidikan *</Label>
                  <Input
                    id="education"
                    name="education"
                    value={doctorData.education}
                    onChange={handleInputChange}
                    placeholder="Universitas Indonesia"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Pengalaman (tahun) *</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    value={doctorData.experience}
                    onChange={handleInputChange}
                    placeholder="15"
                    min="1"
                    max="50"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={doctorData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={doctorData.phone}
                    onChange={handleInputChange}
                    placeholder="08123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={doctorData.email}
                    onChange={handleInputChange}
                    placeholder="dokter@rspb.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                  id="description"
                  name="description"
                  value={doctorData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsikan background, pengalaman, dan keahlian khusus dokter..."
                />
              </div>
              <div>
                <Label htmlFor="expertise">Keahlian (pisahkan dengan koma)</Label>
                <textarea
                  id="expertise"
                  name="expertise"
                  value={doctorData.expertise}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Kardiologi Intervensi, Elektrofisiologi Jantung, Ekokardiografi..."
                />
              </div>
              <div>
                <Label htmlFor="awards">Penghargaan (pisahkan dengan koma)</Label>
                <textarea
                  id="awards"
                  name="awards"
                  value={doctorData.awards}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Best Doctor Award 2023, Excellence in Patient Care 2022..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Praktek</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Pilih hari praktek dan atur jam praktek untuk masing-masing hari
              </p>
              <div className="space-y-3">
                {doctorData.schedule.map((schedule, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => handleScheduleChange(index, 'enabled', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="w-20 font-medium text-gray-700">{schedule.day}</span>
                    </div>
                    <Input
                      type="time"
                      value={schedule.time.split(' - ')[0]}
                      onChange={(e) => {
                        const endTime = schedule.time.split(' - ')[1]
                        handleScheduleChange(index, 'time', `${e.target.value} - ${endTime}`)
                      }}
                      disabled={!schedule.enabled}
                      className="w-32"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="time"
                      value={schedule.time.split(' - ')[1]}
                      onChange={(e) => {
                        const startTime = schedule.time.split(' - ')[0]
                        handleScheduleChange(index, 'time', `${startTime} - ${e.target.value}`)
                      }}
                      disabled={!schedule.enabled}
                      className="w-32"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{doctorData.name || "Nama Dokter"}</h3>
                    <p className="text-green-600 font-medium">{doctorData.specialization || "Spesialisasi"}</p>
                    <p className="text-gray-600 text-sm">{doctorData.poli}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Pengalaman: {doctorData.experience || "0"} tahun</p>
                  <p>Alumni: {doctorData.education || "Universitas"}</p>
                  <p>Jadwal: {doctorData.schedule.filter(s => s.enabled).length} hari praktek</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !doctorData.name || !doctorData.specialization}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              {isSubmitting ? "Menyimpan..." : "Tambah Dokter"}
            </Button>
            <Link href="/admin/doctors">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AddDoctorPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AddDoctorPage />
    </ProtectedRoute>
  )
}