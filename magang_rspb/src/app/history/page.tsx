"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import UserStatusBanner from "@/components/UserStatusBanner"
import { useAuth } from "@/contexts/AuthContext"

type Registration = {
  id: number
  full_name: string
  nik: string
  keluhan?: string | null
  queue_number?: number | null
  status?: string | null
  created_at?: string | null
  polis?: { name?: string | null }
  dokter_id?: number | null
  catatan?: string | null
  dokters?: {
    name: string
    specialization: string
  }
}

const baseApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "")

export default function HistoryPage() {
  const { token, user } = useAuth()
  const [history, setHistory] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredHistory, setFilteredHistory] = useState<Registration[]>([])
  const [selectedPoli, setSelectedPoli] = useState("all")
  const [polis, setPolis] = useState<Array<{ id: number; name: string }>>([])
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null)

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseApiUrl}/registrations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Gagal memuat riwayat")
      const data = await res.json()
      
      // Filter for current user's completed registrations
      // Admin should not see history, this is for patients only
      const userId = user?.id ? parseInt(user.id, 10) : null
      const completed = data.filter(
        (r: any) => r.status === "selesai" && userId !== null && r.user_id === userId
      )
      
      // Sort by created_at descending (newest first)
      completed.sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
      
      setHistory(completed)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPolis = async () => {
    try {
      const res = await fetch(`${baseApiUrl}/polis`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) return
      const data = await res.json()
      setPolis(data)
    } catch (error) {
      console.error(error)
    }
  }

  const filterHistory = () => {
    if (selectedPoli === "all") {
      setFilteredHistory(history)
    } else {
      setFilteredHistory(
        history.filter((r) => r.polis?.name === selectedPoli)
      )
    }
  }

  useEffect(() => {
    fetchHistory()
    fetchPolis()
  }, [token, user])

  useEffect(() => {
    filterHistory()
  }, [history, selectedPoli])

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* User Status */}
        <UserStatusBanner />
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-0 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Pendaftaran</h1>
            <p className="text-gray-600">Lihat riwayat kunjungan dan perawatan Anda</p>
          </div>

          {/* Filter Options */}
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <select 
                value={selectedPoli}
                onChange={(e) => setSelectedPoli(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Semua Poli</option>
                {polis.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* History Cards */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg border-0 p-12 text-center">
            <p>Memuat riwayat...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((record) => (
              <div key={record.id} className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{record.queue_number || "-"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {record.created_at
                            ? new Date(record.created_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "-"}{" "}
                          {record.created_at
                            ? new Date(record.created_at).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </div>
                        <div className="text-sm text-gray-600">{record.polis?.name || "-"}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Selesai
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Keluhan</div>
                      <div className="text-gray-600">{record.keluhan || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Dokter</div>
                      <div className="text-gray-600">
                        {record.dokters?.name || "Belum ditentukan"}
                        {record.dokters?.specialization && ` (${record.dokters.specialization})`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Catatan</div>
                      <div className="text-gray-600">{record.catatan || "Tidak ada catatan"}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Lihat Detail
                    </button>
                    <Link
                      href="/daftar"
                      className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                      Daftar Ulang
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border-0 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki riwayat pendaftaran yang selesai.</p>
            <Link
              href="/daftar"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Detail Riwayat Kunjungan</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Pasien</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama</label>
                      <p className="text-gray-900">{selectedRecord.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">NIK</label>
                      <p className="text-gray-900">{selectedRecord.nik}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Poli</label>
                      <p className="text-gray-900">{selectedRecord.polis?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tanggal Kunjungan</label>
                      <p className="text-gray-900">
                        {selectedRecord.created_at
                          ? new Date(selectedRecord.created_at).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Keluhan</label>
                      <p className="text-gray-900">{selectedRecord.keluhan}</p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hasil Pemeriksaan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Dokter yang Merawat</label>
                      <p className="text-gray-900">
                        {selectedRecord.dokters?.name || "Belum ditentukan"}
                        {selectedRecord.dokters?.specialization && ` (${selectedRecord.dokters.specialization})`}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Catatan Medis</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedRecord.catatan || "Tidak ada catatan"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t px-6 py-4 flex justify-end bg-gray-50">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}