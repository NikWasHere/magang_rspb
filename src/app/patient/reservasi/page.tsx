"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DiagnoseService } from "@/services/diagnoseService"
import { QueueService } from "@/services/queueService"
import { getDoctorsBySpecialization, getAvailableDates, getDoctorSchedules, getDoctorById } from "@/data/mockData"
import { DoctorSpecialization, Gender, PaymentMethod, Reservation } from "@/types"
import Link from "next/link"

export default function ReservasiPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [reservation, setReservation] = useState<Reservation | null>(null)

  // Step 1: Symptoms & AI Recommendation
  const [symptoms, setSymptoms] = useState("")
  const [diagnosis, setDiagnosis] = useState<any>(null)
  const [analyzingSymptoms, setAnalyzingSymptoms] = useState(false)

  // Step 2: Patient Data
  const [patientData, setPatientData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    ktp: "",
    gender: "Laki-laki" as Gender,
    birthPlace: "",
    birthDate: ""
  })

  // Step 3: Doctor & Schedule Selection
  const [selectedPoli, setSelectedPoli] = useState<DoctorSpecialization | "">("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSchedule, setSelectedSchedule] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash")
  const [insuranceName, setInsuranceName] = useState("")
  const [insuranceNumber, setInsuranceNumber] = useState("")

  // Data for selections
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([])
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([])

  // Analyze symptoms
  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Mohon masukkan gejala yang Anda alami")
      return
    }

    setAnalyzingSymptoms(true)
    setError("")

    try {
      const result = await DiagnoseService.analyzeSymptoms(symptoms)
      setDiagnosis(result)
      setSelectedPoli(result.recommendedPoli)
    } catch (err) {
      setError("Gagal menganalisa gejala. Silakan coba lagi.")
    } finally {
      setAnalyzingSymptoms(false)
    }
  }

  // Load doctors when poli selected
  useEffect(() => {
    if (selectedPoli) {
      const doctors = getDoctorsBySpecialization(selectedPoli)
      setAvailableDoctors(doctors)
      setSelectedDoctor("") // Reset selection
      setAvailableDates([])
      setSelectedDate("")
    }
  }, [selectedPoli])

  // Load available dates when doctor selected
  useEffect(() => {
    if (selectedDoctor) {
      const dates = getAvailableDates(selectedDoctor, 30)
      setAvailableDates(dates)
      setSelectedDate("") // Reset selection
    }
  }, [selectedDoctor])

  // Load schedules when date selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const date = new Date(selectedDate)
      const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()]
      const schedules = getDoctorSchedules(selectedDoctor, dayName as any)
      setAvailableSchedules(schedules)
      setSelectedSchedule("") // Reset selection
    }
  }, [selectedDate])

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!diagnosis) {
      setError("Mohon analisa gejala terlebih dahulu")
      return
    }
    setStep(2)
    setError("")
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientData.fullName || !patientData.email || !patientData.phone || !patientData.ktp) {
      setError("Mohon lengkapi semua data yang wajib (*)")
      return
    }
    setStep(3)
    setError("")
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDoctor || !selectedDate || !selectedSchedule) {
      setError("Mohon pilih dokter, tanggal, dan jadwal")
      return
    }

    if (paymentMethod !== 'Cash' && (!insuranceName || !insuranceNumber)) {
      setError("Mohon lengkapi data asuransi")
      return
    }

    setLoading(true)
    setError("")

    try {
      const doctor = getDoctorById(selectedDoctor)
      
      const reservationData = {
        patientId: user?.id,
        patientName: patientData.fullName,
        patientEmail: patientData.email,
        patientPhone: patientData.phone,
        patientKTP: patientData.ktp,
        patientGender: patientData.gender,
        patientBirthPlace: patientData.birthPlace,
        patientBirthDate: new Date(patientData.birthDate),
        reservationDate: new Date(selectedDate),
        doctorId: selectedDoctor,
        scheduleId: selectedSchedule,
        specialization: selectedPoli as DoctorSpecialization,
        symptoms: symptoms,
        aiRecommendedPoli: diagnosis.recommendedPoli,
        aiConfidence: diagnosis.confidence,
        paymentMethod: paymentMethod,
        insuranceName: insuranceName || undefined,
        insuranceNumber: insuranceNumber || undefined
      }

      const result = await QueueService.createReservation(reservationData)
      setReservation(result)
      setStep(4) // Success page
    } catch (err) {
      setError("Gagal membuat reservasi. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  // Success Page
  if (step === 4 && reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-t-4 border-green-600">
            <CardHeader className="text-center bg-green-50">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-green-700">Reservasi Berhasil!</CardTitle>
              <CardDescription className="text-base mt-2">
                Reservasi Anda telah terdaftar dalam sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Booking Codes */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kode Booking Pendaftaran</p>
                  <p className="text-3xl font-bold text-blue-700 tracking-wider">{reservation.bookingCodePendaftaran}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kode Booking Poli</p>
                  <p className="text-2xl font-bold text-blue-600 tracking-wider">{reservation.bookingCodePoli}</p>
                </div>
                <div className="pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Nomor Antrian Poli (TERKUNCI)</p>
                  <p className="text-4xl font-bold text-green-600">{reservation.queueNumber}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    ✅ Nomor antrian ini sudah terkunci untuk Anda
                  </p>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Detail Reservasi</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nama Pasien</p>
                    <p className="font-medium">{reservation.patientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">No. KTP</p>
                    <p className="font-medium">{reservation.patientKTP}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal Berobat</p>
                    <p className="font-medium">
                      {new Date(reservation.reservationDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Poli</p>
                    <p className="font-medium">{reservation.specialization}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Dokter</p>
                    <p className="font-medium">{getDoctorById(reservation.doctorId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jaminan</p>
                    <p className="font-medium">{reservation.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Penting!</h4>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Simpan kode booking Anda dengan baik</li>
                  <li>Datang ke loket pendaftaran minimal 30 menit sebelum jadwal</li>
                  <li>Bawa KTP asli dan kartu asuransi (jika ada)</li>
                  <li>Nomor antrian Anda sudah terkunci dan tidak akan digunakan pasien lain</li>
                  <li>Setelah verifikasi di loket, Anda akan langsung masuk ke poli dengan nomor {reservation.queueNumber}</li>
                </ul>
              </div>

              {/* Notification Sent */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-center">
                <p className="text-green-700">
                  📧 Notifikasi telah dikirim ke <strong>{reservation.patientEmail}</strong>
                </p>
                <p className="text-green-700 mt-1">
                  📱 WhatsApp telah dikirim ke <strong>{reservation.patientPhone}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => router.push('/patient/dashboard')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Lihat Dashboard
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex-1"
                >
                  Cetak Bukti
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center ${step >= s ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                    {s}
                  </div>
                  <span className="ml-2 font-medium hidden sm:inline">
                    {s === 1 && "Gejala"}
                    {s === 2 && "Data Diri"}
                    {s === 3 && "Pilih Jadwal"}
                  </span>
                </div>
                {s < 3 && <div className={`w-16 h-1 ml-4 ${step > s ? 'bg-green-600' : 'bg-gray-300'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Keluhan & Gejala"}
              {step === 2 && "Data Diri Pasien"}
              {step === 3 && "Pilih Dokter & Jadwal"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ceritakan gejala Anda, sistem akan merekomendasikan poli yang sesuai"}
              {step === 2 && "Lengkapi data diri untuk reservasi"}
              {step === 3 && "Pilih dokter, tanggal, dan jam yang tersedia"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1: Symptoms & AI Recommendation */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div>
                  <Label htmlFor="symptoms">Ceritakan Gejala yang Anda Alami *</Label>
                  <textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: Saya merasa nyeri dada, sesak nafas, dan jantung berdebar-debar sejak 2 hari yang lalu..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jelaskan gejala dengan detail untuk rekomendasi yang lebih akurat
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleAnalyzeSymptoms}
                  disabled={analyzingSymptoms || !symptoms.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {analyzingSymptoms ? "Menganalisa..." : "🤖 Analisa Gejala dengan AI"}
                </Button>

                {/* AI Diagnosis Result */}
                {diagnosis && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-blue-900">Hasil Analisa AI</h3>
                        <p className="text-sm text-blue-700 mt-1">Confidence: {diagnosis.confidence}%</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Poli yang Direkomendasikan:</p>
                      <p className="text-2xl font-bold text-green-700">{diagnosis.recommendedPoli}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Alasan:</p>
                      <p className="text-sm text-gray-700">{diagnosis.reason}</p>
                    </div>

                    {diagnosis.alternativePoli && diagnosis.alternativePoli.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Alternatif Lain:</p>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.alternativePoli.map((poli: string) => (
                            <span key={poli} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-sm">
                              {poli}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-blue-200">
                      <Label htmlFor="poli">Pilih Poli *</Label>
                      <select
                        id="poli"
                        value={selectedPoli}
                        onChange={(e) => setSelectedPoli(e.target.value as DoctorSpecialization)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                        required
                      >
                        <option value={diagnosis.recommendedPoli}>{diagnosis.recommendedPoli} (Rekomendasi)</option>
                        {diagnosis.alternativePoli?.map((poli: string) => (
                          <option key={poli} value={poli}>{poli}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={!diagnosis}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Lanjut ke Data Diri
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: Patient Data */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input
                      id="fullName"
                      value={patientData.fullName}
                      onChange={(e) => setPatientData({...patientData, fullName: e.target.value})}
                      required
                      placeholder="Sesuai KTP"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientData.email}
                      onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                      required
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">No. HP/WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                      required
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ktp">No. KTP *</Label>
                    <Input
                      id="ktp"
                      value={patientData.ktp}
                      onChange={(e) => setPatientData({...patientData, ktp: e.target.value})}
                      required
                      maxLength={16}
                      placeholder="16 digit"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Jenis Kelamin *</Label>
                    <select
                      id="gender"
                      value={patientData.gender}
                      onChange={(e) => setPatientData({...patientData, gender: e.target.value as Gender})}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                    <Input
                      id="birthPlace"
                      value={patientData.birthPlace}
                      onChange={(e) => setPatientData({...patientData, birthPlace: e.target.value})}
                      required
                      placeholder="Kota kelahiran"
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={patientData.birthDate}
                      onChange={(e) => setPatientData({...patientData, birthDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Lanjut Pilih Jadwal
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: Doctor & Schedule Selection */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* Selected Poli */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Poli yang dipilih:</p>
                  <p className="text-xl font-bold text-blue-700">{selectedPoli}</p>
                </div>

                {/* Doctor Selection */}
                <div>
                  <Label htmlFor="doctor">Pilih Dokter *</Label>
                  <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">-- Pilih Dokter --</option>
                    {availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                {selectedDoctor && (
                  <div>
                    <Label htmlFor="date">Pilih Tanggal *</Label>
                    <select
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">-- Pilih Tanggal --</option>
                      {availableDates.map((date) => (
                        <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                          {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Schedule Selection */}
                {selectedDate && (
                  <div>
                    <Label htmlFor="schedule">Pilih Jam Praktik *</Label>
                    <select
                      id="schedule"
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">-- Pilih Jam --</option>
                      {availableSchedules.map((sch) => (
                        <option key={sch.id} value={sch.id}>
                          {sch.startTime} - {sch.endTime} (Kuota: {sch.quota} pasien)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Metode Pembayaran</h3>
                  
                  <div>
                    <Label htmlFor="payment">Jaminan *</Label>
                    <select
                      id="payment"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="Cash">Cash/Tunai</option>
                      <option value="BPJS">BPJS Kesehatan</option>
                      <option value="Asuransi Swasta">Asuransi Swasta</option>
                    </select>
                  </div>

                  {paymentMethod !== 'Cash' && (
                    <>
                      <div>
                        <Label htmlFor="insuranceName">Nama Perusahaan/BPJS *</Label>
                        <Input
                          id="insuranceName"
                          value={insuranceName}
                          onChange={(e) => setInsuranceName(e.target.value)}
                          required
                          placeholder="Contoh: BPJS, Prudential, Allianz, dll"
                        />
                      </div>

                      <div>
                        <Label htmlFor="insuranceNumber">Nomor Kartu Asuransi *</Label>
                        <Input
                          id="insuranceNumber"
                          value={insuranceNumber}
                          onChange={(e) => setInsuranceNumber(e.target.value)}
                          required
                          placeholder="Nomor kartu"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Memproses..." : "Konfirmasi Reservasi"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
