"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockDoctors, mockSchedules } from "@/data/mockData"
import { DoctorSchedule } from "@/types"

export default function JadwalDokterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([...mockSchedules])
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(null)
  
  const [formData, setFormData] = useState({
    doctorId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    quota: 20
  })

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      router.push('/login')
      return
    }
  }, [user, router])

  const filteredSchedules = selectedDoctor === "all" 
    ? schedules 
    : schedules.filter(s => s.doctorId === selectedDoctor)

  const handleAddSchedule = () => {
    if (!formData.doctorId || !formData.dayOfWeek || !formData.startTime || !formData.endTime) {
      alert("Mohon lengkapi semua field!")
      return
    }

    const newSchedule: DoctorSchedule = {
      id: `SCH-${Date.now()}`,
      doctorId: formData.doctorId,
      dayOfWeek: formData.dayOfWeek as any,
      startTime: formData.startTime,
      endTime: formData.endTime,
      quota: formData.quota,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setSchedules([...schedules, newSchedule])
    setShowAddModal(false)
    resetForm()
    alert("Jadwal berhasil ditambahkan!")
  }

  const handleEditSchedule = () => {
    if (!editingSchedule) return

    const updatedSchedules = schedules.map(s => 
      s.id === editingSchedule.id 
        ? { 
            ...s, 
            dayOfWeek: formData.dayOfWeek as any,
            startTime: formData.startTime,
            endTime: formData.endTime,
            quota: formData.quota,
            updatedAt: new Date()
          }
        : s
    )

    setSchedules(updatedSchedules)
    setEditingSchedule(null)
    resetForm()
    alert("Jadwal berhasil diupdate!")
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm("Yakin ingin menghapus jadwal ini?")) {
      setSchedules(schedules.filter(s => s.id !== scheduleId))
      alert("Jadwal berhasil dihapus!")
    }
  }

  const handleToggleActive = (scheduleId: string) => {
    const updatedSchedules = schedules.map(s => 
      s.id === scheduleId 
        ? { ...s, isActive: !s.isActive, updatedAt: new Date() }
        : s
    )
    setSchedules(updatedSchedules)
  }

  const startEdit = (schedule: DoctorSchedule) => {
    setEditingSchedule(schedule)
    setFormData({
      doctorId: schedule.doctorId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      quota: schedule.quota
    })
  }

  const resetForm = () => {
    setFormData({
      doctorId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      quota: 20
    })
  }

  const getDoctorName = (doctorId: string) => {
    return mockDoctors.find(d => d.id === doctorId)?.name || "Unknown"
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null
  }

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Kelola Jadwal Dokter</h1>
            <p className="text-gray-600 mt-2">Atur jadwal praktek dokter</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Tambah Jadwal Baru
          </Button>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Filter Dokter</Label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                >
                  <option value="all">Semua Dokter</option>
                  {mockDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-gray-600">
                Total: <strong>{filteredSchedules.length}</strong> jadwal
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => {
            const doctor = mockDoctors.find(d => d.id === schedule.doctorId)
            return (
              <Card key={schedule.id} className={`${!schedule.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doctor?.name}</CardTitle>
                      <CardDescription>{doctor?.specialization}</CardDescription>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {schedule.isActive ? 'Aktif' : 'Nonaktif'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hari:</span>
                      <span className="font-semibold">{schedule.dayOfWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Jam:</span>
                      <span className="font-semibold">{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Kuota:</span>
                      <span className="font-semibold text-blue-600">{schedule.quota} pasien</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(schedule)}
                      variant="outline"
                      className="flex-1"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(schedule.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      {schedule.isActive ? '⏸️ Nonaktif' : '▶️ Aktifkan'}
                    </Button>
                    <Button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      🗑️
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || editingSchedule) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Dokter *</Label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    disabled={!!editingSchedule}
                  >
                    <option value="">-- Pilih Dokter --</option>
                    {mockDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Hari *</Label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Pilih Hari --</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Jam Mulai *</Label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Jam Selesai *</Label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Kuota Pasien *</Label>
                  <Input
                    type="number"
                    value={formData.quota}
                    onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingSchedule(null)
                      resetForm()
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={editingSchedule ? handleEditSchedule : handleAddSchedule}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {editingSchedule ? 'Update' : 'Tambah'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
