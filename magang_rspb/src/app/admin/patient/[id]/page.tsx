"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

type Registration = {
  id: number
  user_id: number
  poli_id: number
  full_name: string
  nik: string
  no_kk: string
  keluhan?: string | null
  queue_number?: number | null
  status?: string | null
  created_at?: string | null
  polis?: { name?: string | null }
  dokter_id?: number | null
  catatan?: string | null
  photo_ktp?: string | null
  photo_kk?: string | null
  more_document?: string | null
  dokters?: {
    id: number
    name: string
    specialization: string
    phone: string
  }
}

type Dokter = {
  id: number
  name: string
  specialization: string
  phone: string
}

const baseApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "")
const toAbsoluteUrl = (url?: string | null) => {
  if (!url) return ""
  return url.startsWith("http") ? url : `${baseApiUrl}${url}`
}

function PatientDetailPage() {
  const params = useParams()
  const { token } = useAuth()
  const registrationId = params.id as string
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [patient, setPatient] = useState<Registration | null>(null)
  const [dokters, setDokters] = useState<Dokter[]>([])
  const [selectedDokterId, setSelectedDokterId] = useState<number | null>(null)
  const [catatan, setCatatan] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPatient()
      fetchDokters()
    }
  }, [mounted, registrationId])

  async function fetchPatient() {
    try {
      setLoading(true)
      const res = await fetch(`${baseApiUrl}/registrations/${registrationId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Gagal memuat data pasien")
      const data = await res.json()
      setPatient(data)
      setSelectedDokterId(data.dokter_id || null)
      setCatatan(data.catatan || "")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchDokters() {
    try {
      const res = await fetch(`${baseApiUrl}/dokters`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) return
      const data = await res.json()
      setDokters(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!patient) return
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("status", newStatus)
      if (patient.queue_number !== null && patient.queue_number !== undefined) {
        formData.append("queue_number", String(patient.queue_number))
      }
      const res = await fetch(`${baseApiUrl}/registrations/${patient.id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })
      if (!res.ok) throw new Error("Gagal memperbarui status")
      const updated = await res.json()
      setPatient(updated)
    } catch (error) {
      console.error(error)
      alert("Gagal memperbarui status")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDoctorAndNotes = async () => {
    if (!patient) return
    try {
      setSaving(true)
      const formData = new FormData()
      if (selectedDokterId !== null && selectedDokterId !== undefined) {
        formData.append("dokter_id", String(selectedDokterId))
      }
      formData.append("catatan", catatan)
      const res = await fetch(`${baseApiUrl}/registrations/${patient.id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })
      if (!res.ok) throw new Error("Gagal menyimpan data")
      const updated = await res.json()
      setPatient(updated)
      alert("Data pemeriksaan berhasil disimpan")
    } catch (error) {
      console.error(error)
      alert("Gagal menyimpan data")
    } finally {
      setSaving(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p>Memuat...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p>Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p>Data pasien tidak ditemukan</p>
          <Link href="/admin" className="text-blue-600 hover:underline mt-4 inline-block">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    // Keep for now but not used
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
              <p className="text-gray-600">No. Antrian: {patient.queue_number ?? "-"}</p>
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
                    <Label>Nama Lengkap</Label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {patient.full_name}
                    </p>
                  </div>
                  <div>
                    <Label>NIK</Label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {patient.nik}
                    </p>
                  </div>
                  <div>
                    <Label>No. KK</Label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {patient.no_kk}
                    </p>
                  </div>
                  <div>
                    <Label>Poli</Label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {patient.polis?.name || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Keluhan</Label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {patient.keluhan || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Doctor and Notes */}
            {(patient.status === "dipanggil" || patient.status === "selesai") && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Pemeriksaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dokter">Dokter yang Merawat</Label>
                    {patient.status === "selesai" ? (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                        {patient.dokters?.name || "Belum ditentukan"}
                        {patient.dokters?.specialization && ` (${patient.dokters.specialization})`}
                      </p>
                    ) : (
                      <select
                        id="dokter"
                        value={selectedDokterId || ""}
                        onChange={(e) =>
                          setSelectedDokterId(e.target.value ? parseInt(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Pilih Dokter --</option>
                        {dokters.map((dok) => (
                          <option key={dok.id} value={dok.id}>
                            {dok.name} ({dok.specialization})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="catatan">Catatan Medis</Label>
                    {patient.status === "selesai" ? (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 min-h-24">
                        {patient.catatan || "Tidak ada catatan"}
                      </p>
                    ) : (
                      <textarea
                        id="catatan"
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Masukkan catatan medis..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    )}
                  </div>

                  {patient.status === "dipanggil" && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveDoctorAndNotes}
                        disabled={saving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? "Menyimpan..." : "Simpan Data Pemeriksaan"}
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("selesai")}
                        disabled={saving}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {saving ? "Mengupdate..." : "Selesaikan Pemeriksaan"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {(patient.photo_ktp || patient.photo_kk || patient.more_document) && (
              <Card>
                <CardHeader>
                  <CardTitle>Dokumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patient.photo_ktp && (
                      <a
                        href={toAbsoluteUrl(patient.photo_ktp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        📄 Foto KTP
                      </a>
                    )}
                    {patient.photo_kk && (
                      <a
                        href={toAbsoluteUrl(patient.photo_kk)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        📄 Foto KK
                      </a>
                    )}
                    {patient.more_document && (
                      <a
                        href={toAbsoluteUrl(patient.more_document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        📄 Dokumen Tambahan
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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
                    {patient.queue_number ?? "-"}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    patient.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                    patient.status === 'dipanggil' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.status === 'menunggu' ? 'Menunggu' :
                     patient.status === 'dipanggil' ? 'Dipanggil' : 'Selesai'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => handleStatusUpdate("menunggu")}
                    variant="outline"
                    className="w-full"
                    disabled={saving || patient.status === "menunggu"}
                  >
                    Set Menunggu
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("dipanggil")}
                    variant="outline"
                    className="w-full"
                    disabled={saving || patient.status === "dipanggil"}
                  >
                    Set Dipanggil
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("selesai")}
                    variant="outline"
                    className="w-full"
                    disabled={saving || patient.status === "selesai"}
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
                    <div className="text-gray-600">
                      {patient.created_at ? new Date(patient.created_at).toLocaleString() : "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User ID:</span>
                    <div className="text-gray-600">{patient.user_id}</div>
                  </div>
                </div>
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