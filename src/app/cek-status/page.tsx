"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CekStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("queue")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    queueNumber: string
    name: string
    poli: string
    complaint: string
    status: string
    estimatedTime: string
    currentQueue: string
    registeredAt: string
    doctor: string
  } | null>(null)

  const handleSearch = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Mock search result
      if (searchQuery) {
        setSearchResult({
          queueNumber: searchType === "queue" ? searchQuery : "001",
          name: "John Doe",
          poli: "Klinik Pratama Pertamina",
          complaint: "Sakit kepala",
          status: "Waiting",
          estimatedTime: "30-45 menit",
          currentQueue: "003",
          registeredAt: "2025-09-30 09:30",
          doctor: "Dr. Smith"
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const currentTime = new Date().toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Cek Status Antrian</h1>
          <p className="text-gray-600">
            Periksa status antrian dan estimasi waktu pelayanan Anda
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Terakhir diperbarui: {currentTime}
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cari Status Antrian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Cari berdasarkan:</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="queue"
                    checked={searchType === "queue"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  No. Antrian
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="nik"
                    checked={searchType === "nik"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  NIK
                </label>
                {/* <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="phone"
                    checked={searchType === "phone"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  No. Telepon
                </label> */}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Input
                placeholder={
                  searchType === "queue" ? "Masukkan no. antrian (contoh: 001)" :
                  searchType === "nik" ? "Masukkan NIK" :
                  "Masukkan no. telepon"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={!searchQuery || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Mencari..." : "Cek Status"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Result */}
        {searchResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Status Antrian</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  #{searchResult.queueNumber}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Nama Pasien</div>
                  <div className="text-gray-900 font-medium">{searchResult.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Poliklinik</div>
                  <div className="text-gray-900">{searchResult.poli}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Keluhan</div>
                  <div className="text-gray-900">{searchResult.complaint}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Dokter</div>
                  <div className="text-gray-900">{searchResult.doctor}</div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">#{searchResult.queueNumber}</div>
                    <div className="text-sm text-gray-600">No. Antrian Anda</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">#{searchResult.currentQueue}</div>
                    <div className="text-sm text-gray-600">Sedang Dilayani</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{searchResult.estimatedTime}</div>
                    <div className="text-sm text-gray-600">Estimasi Waktu</div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Status Saat Ini</div>
                  <div className="text-sm text-gray-600">Terdaftar pada: {searchResult.registeredAt}</div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  searchResult.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                  searchResult.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {searchResult.status === 'Waiting' ? 'Menunggu' :
                   searchResult.status === 'In Progress' ? 'Sedang Dilayani' :
                   'Selesai'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Refresh Status
                </Button>
                <Button variant="outline" className="flex-1">
                  Print Antrian
                </Button>
                {searchResult.status === 'Waiting' && (
                  <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                    Batalkan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Queue Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Total Antrian Hari Ini</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Sedang Dilayani</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Masih Menunggu</div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Informasi Penting:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Status antrian diperbarui secara real-time</li>
              <li>• Harap datang 15 menit sebelum nomor antrian Anda dipanggil</li>
              <li>• Jika terlambat lebih dari 30 menit, antrian akan dibatalkan otomatis</li>
              <li>• Untuk pertanyaan lebih lanjut, hubungi bagian informasi di 021-123-4567</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}