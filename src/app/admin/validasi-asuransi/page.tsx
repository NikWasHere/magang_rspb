"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InsuranceService, InsuranceValidation } from "@/services/insuranceService"

export default function ValidasiAsuransiPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [validations, setValidations] = useState<InsuranceValidation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedValidation, setSelectedValidation] = useState<InsuranceValidation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      router.push('/login')
      return
    }

    loadValidations()
  }, [user, router])

  const loadValidations = () => {
    const allValidations = InsuranceService.getAllValidations()
    setValidations(allValidations)
  }

  const filteredValidations = validations.filter(v => {
    const matchesSearch = 
      v.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.insuranceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.patientKTP.includes(searchQuery)
    
    const matchesFilter = 
      filterStatus === "all" || v.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleApprove = (validation: InsuranceValidation) => {
    if (!user) return
    
    InsuranceService.validateInsurance(
      validation.id,
      user.id,
      'approved',
      undefined,
      notes || undefined
    )
    
    alert(`✓ Asuransi ${validation.patientName} telah disetujui`)
    loadValidations()
    setShowDetailModal(false)
    setNotes("")
  }

  const handleReject = (validation: InsuranceValidation) => {
    if (!user) return
    
    if (!rejectionReason.trim()) {
      alert("Mohon berikan alasan penolakan!")
      return
    }
    
    InsuranceService.validateInsurance(
      validation.id,
      user.id,
      'rejected',
      rejectionReason,
      notes || undefined
    )
    
    alert(`✗ Asuransi ${validation.patientName} ditolak`)
    loadValidations()
    setShowDetailModal(false)
    setRejectionReason("")
    setNotes("")
  }

  const openDetail = (validation: InsuranceValidation) => {
    setSelectedValidation(validation)
    setNotes(validation.notes || "")
    setRejectionReason(validation.rejectionReason || "")
    setShowDetailModal(true)
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null
  }

  const stats = InsuranceService.getStatistics()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Validasi Asuransi Pasien</h1>
          <p className="text-gray-600 mt-2">Verifikasi dan validasi kartu asuransi pasien</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-100">Total</CardDescription>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-yellow-100">Pending</CardDescription>
              <CardTitle className="text-4xl">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-100">Disetujui</CardDescription>
              <CardTitle className="text-4xl">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-red-100">Ditolak</CardDescription>
              <CardTitle className="text-4xl">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-100">BPJS</CardDescription>
              <CardTitle className="text-4xl">{stats.bpjs}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Cari Pasien</Label>
                <Input
                  type="text"
                  placeholder="Cari nama, nomor asuransi, atau KTP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Label>Filter Status</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Validasi Asuransi</CardTitle>
            <CardDescription>{filteredValidations.length} data ditemukan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Pasien</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Asuransi</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Nomor</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Status Polis</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Berlaku Hingga</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredValidations.map((validation) => {
                    const statusColors = {
                      pending: 'bg-yellow-100 text-yellow-800',
                      approved: 'bg-green-100 text-green-800',
                      rejected: 'bg-red-100 text-red-800'
                    }

                    const policyStatusColors = {
                      active: 'bg-green-100 text-green-800',
                      expired: 'bg-red-100 text-red-800',
                      suspended: 'bg-orange-100 text-orange-800'
                    }

                    return (
                      <tr key={validation.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{validation.patientName}</p>
                            <p className="text-sm text-gray-500">{validation.patientKTP}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-sm">{validation.insuranceProvider}</p>
                            <p className="text-xs text-gray-500">{validation.insuranceType}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {validation.insuranceNumber}
                          </code>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${policyStatusColors[validation.policyStatus]}`}>
                            {validation.policyStatus === 'active' ? 'Aktif' : 
                             validation.policyStatus === 'expired' ? 'Expired' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(validation.validUntil).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[validation.status]}`}>
                            {validation.status === 'pending' ? 'Pending' :
                             validation.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            onClick={() => openDetail(validation)}
                            variant="outline"
                            size="sm"
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredValidations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada data ditemukan</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Informasi Validasi</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Cek status polis (Active/Expired/Suspended)</li>
                  <li>• Verifikasi masa berlaku asuransi</li>
                  <li>• Periksa limit klaim tersisa</li>
                  <li>• Berikan approval atau rejection dengan alasan yang jelas</li>
                  <li>• Data BPJS dapat dicek melalui sistem Pcare</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedValidation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Detail Validasi Asuransi</CardTitle>
              <CardDescription>
                Request #{selectedValidation.id} - {selectedValidation.patientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Data Pasien</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{selectedValidation.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No. KTP</p>
                    <p className="font-medium">{selectedValidation.patientKTP}</p>
                  </div>
                </div>
              </div>

              {/* Insurance Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Data Asuransi</h3>
                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Jenis Asuransi</p>
                    <p className="font-medium">{selectedValidation.insuranceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="font-medium">{selectedValidation.insuranceProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nomor Polis</p>
                    <p className="font-medium font-mono">{selectedValidation.insuranceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipe Coverage</p>
                    <p className="font-medium">{selectedValidation.coverageType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status Polis</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedValidation.policyStatus === 'active' ? 'bg-green-100 text-green-800' :
                      selectedValidation.policyStatus === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedValidation.policyStatus === 'active' ? 'Aktif' :
                       selectedValidation.policyStatus === 'expired' ? 'Expired' : 'Suspended'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Berlaku Hingga</p>
                    <p className="font-medium">
                      {new Date(selectedValidation.validUntil).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informasi Klaim</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Limit Total</p>
                      <p className="font-bold text-purple-900">
                        Rp {selectedValidation.claimLimit.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sudah Dipakai</p>
                      <p className="font-bold text-orange-900">
                        Rp {selectedValidation.claimUsed.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sisa Limit</p>
                      <p className="font-bold text-green-900">
                        Rp {(selectedValidation.claimLimit - selectedValidation.claimUsed).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full"
                        style={{ width: `${(selectedValidation.claimUsed / selectedValidation.claimLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      {((selectedValidation.claimUsed / selectedValidation.claimLimit) * 100).toFixed(1)}% terpakai
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedValidation.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Catatan</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">{selectedValidation.notes}</p>
                  </div>
                </div>
              )}

              {/* Validation Form */}
              {selectedValidation.status === 'pending' && (
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Validasi Asuransi</h3>
                  
                  <div>
                    <Label>Catatan Tambahan (Opsional)</Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Tambahkan catatan..."
                    />
                  </div>

                  <div>
                    <Label>Alasan Penolakan (Jika ditolak)</Label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Isi hanya jika akan menolak..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(selectedValidation)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      ✓ Setujui
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedValidation)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      ✗ Tolak
                    </Button>
                  </div>
                </div>
              )}

              {/* Already Validated */}
              {selectedValidation.status !== 'pending' && (
                <div className={`border-t pt-6 ${
                  selectedValidation.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                } rounded-lg p-4`}>
                  <h3 className="font-semibold mb-2">
                    {selectedValidation.status === 'approved' ? '✓ Sudah Disetujui' : '✗ Sudah Ditolak'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Divalidasi oleh: {selectedValidation.validatedBy}
                  </p>
                  <p className="text-sm text-gray-600">
                    Pada: {selectedValidation.validatedAt && new Date(selectedValidation.validatedAt).toLocaleString('id-ID')}
                  </p>
                  {selectedValidation.rejectionReason && (
                    <div className="mt-3 bg-red-100 border border-red-200 rounded p-3">
                      <p className="text-sm font-medium text-red-900">Alasan Penolakan:</p>
                      <p className="text-sm text-red-800 mt-1">{selectedValidation.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={() => setShowDetailModal(false)}
                  variant="outline"
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
