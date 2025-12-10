"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import UserStatusBanner from "@/components/UserStatusBanner"
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
}

type Poli = {
  id: number
  name: string
}

const baseApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "")

const statusStyle = (status?: string | null) => {
  const normalized = (status || "menunggu").toLowerCase()
  if (normalized === "dipanggil" || normalized === "in progress") {
    return "bg-blue-100 text-blue-800"
  }
  if (normalized === "selesai" || normalized === "completed") {
    return "bg-gray-100 text-gray-800"
  }
  return "bg-yellow-100 text-yellow-800"
}

function AdminDashboard() {
  const { token } = useAuth()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [polis, setPolis] = useState<Poli[]>([])
  const [selectedPoli, setSelectedPoli] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [callingId, setCallingId] = useState<number | null>(null)

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${baseApiUrl}/registrations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`)
      const data = await res.json()
      const normalized: Registration[] = (data || []).map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        poli_id: r.poli_id,
        full_name: r.full_name,
        nik: r.nik,
        no_kk: r.no_kk,
        keluhan: r.keluhan,
        queue_number: r.queue_number,
        status: r.status || "menunggu",
        created_at: r.created_at,
        polis: r.polis,
      }))
      setRegistrations(normalized)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
    const fetchPolis = async () => {
      try {
        const res = await fetch(`${baseApiUrl}/polis`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) return
        const data = await res.json()
        const normalized: Poli[] = (data || []).map((p: any) => ({ id: p.id, name: p.name }))
        setPolis(normalized)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPolis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const poliOptions = useMemo(() => {
    const names = new Set<string>()
    polis.forEach((p) => names.add(p.name))
    registrations.forEach((r) => {
      if (r.polis?.name) names.add(r.polis.name)
    })
    return ["all", ...Array.from(names)]
  }, [polis, registrations])

  const filtered = useMemo(() => {
    if (selectedPoli === "all") return registrations
    return registrations.filter((r) => (r.polis?.name || "") === selectedPoli)
  }, [registrations, selectedPoli])

  const stats = useMemo(() => {
    const total = registrations.length
    const menunggu = registrations.filter((r) => (r.status || "").toLowerCase() === "menunggu").length
    const dipanggil = registrations.filter((r) => (r.status || "").toLowerCase() === "dipanggil").length
    const selesai = registrations.filter((r) => (r.status || "").toLowerCase() === "selesai").length
    return { total, menunggu, dipanggil, selesai }
  }, [registrations])

  const sortedByQueue = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aHasQueue = typeof a.queue_number === "number"
      const bHasQueue = typeof b.queue_number === "number"
      if (aHasQueue && bHasQueue) return (a.queue_number as number) - (b.queue_number as number)
      if (aHasQueue) return -1
      if (bHasQueue) return 1
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
      return aDate - bDate
    })
  }, [filtered])

  const nextQueueNumber = (poliId: number) => {
    const max = registrations
      .filter((r) => r.poli_id === poliId && typeof r.queue_number === "number")
      .reduce((acc, r) => Math.max(acc, r.queue_number || 0), 0)
    return max + 1
  }

  const updateRegistration = async (id: number, body: Partial<Registration>) => {
    const res = await fetch(`${baseApiUrl}/registrations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error("Gagal memperbarui status")
    const updated = await res.json()
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    )
  }

  const callPatient = async (patient: Registration) => {
    try {
      setCallingId(patient.id)
      const queue = patient.queue_number ?? nextQueueNumber(patient.poli_id)
      await updateRegistration(patient.id, { status: "dipanggil", queue_number: queue })
    } catch (err: any) {
      console.error(err)
      alert(err?.message || "Gagal memanggil pasien")
    } finally {
      setCallingId(null)
    }
  }

  const callNextPatient = async () => {
    const candidates = sortedByQueue.filter((r) => (r.status || "").toLowerCase() === "menunggu")
    if (candidates.length === 0) {
      alert("Tidak ada pasien menunggu untuk dipanggil")
      return
    }
    await callPatient(candidates[0])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        <UserStatusBanner />

        <div className="bg-white rounded-xl shadow-lg border-0 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Pendaftaran</h1>
                <p className="text-gray-600">Kelola pendaftaran pasien dari tabel registrations</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Filter Poli</label>
                  <select
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={selectedPoli}
                    onChange={(e) => setSelectedPoli(e.target.value)}
                    disabled={loading}
                  >
                    {poliOptions.map((p) => (
                      <option key={p} value={p}>
                        {p === "all" ? "Semua Poli" : p}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={callNextPatient}
                  disabled={loading || callingId !== null || filtered.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Panggil Berikutnya
                </button>
                <Link
                  href="/daftar"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  + Daftar Pasien Baru
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-800">Total Pasien</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.menunggu}</div>
                <div className="text-sm text-yellow-800">Menunggu</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.dipanggil}</div>
                <div className="text-sm text-blue-800">Dipanggil</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{stats.selesai}</div>
                <div className="text-sm text-gray-800">Selesai</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0">
          <div className="p-6 border-b border-gray-200 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Daftar Pasien Terdaftar</h2>
              <p className="text-sm text-gray-500">Data langsung dari tabel registrations</p>
            </div>
            {loading && <span className="text-sm text-gray-500">Memuat...</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">No. Antrian</th>
                  <th className="text-left p-4 font-medium text-gray-700">Nama Pasien</th>
                  <th className="text-left p-4 font-medium text-gray-700">Keluhan</th>
                  <th className="text-left p-4 font-medium text-gray-700">Poli</th>
                  <th className="text-left p-4 font-medium text-gray-700">Waktu Daftar</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedByQueue.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {patient.queue_number ?? "-"}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{patient.full_name}</td>
                    <td className="p-4 text-gray-600">{patient.keluhan || "-"}</td>
                    <td className="p-4 text-gray-600">{patient.polis?.name || "-"}</td>
                    <td className="p-4 text-gray-600">
                      {patient.created_at
                        ? new Date(patient.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle(patient.status)}`}>
                        {patient.status || "menunggu"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        <Link 
                          href={`/admin/patient/${patient.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Detail
                        </Link>
                        {(patient.status || "").toLowerCase() !== "selesai" && (
                          <button
                            onClick={() => callPatient(patient)}
                            disabled={callingId === patient.id || (patient.status || "").toLowerCase() === "dipanggil"}
                            className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                          >
                            {callingId === patient.id ? "Memanggil..." : "Panggil"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedByQueue.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0zM7 10a2 2 0 11-4 0 2 2 0z" />
                </svg>
              </div>
              <p>Tidak ada pendaftaran untuk filter ini</p>
              <Link
                href="/daftar"
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Daftar Pasien Pertama
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}