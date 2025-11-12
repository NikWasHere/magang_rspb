"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { PatientProfile, Gender, MaritalStatus, PaymentMethod } from "@/types"

export default function RegisterPatientPage() {
  const router = useRouter()
  const { register, updateProfile, isLoading } = useAuth()
  const [step, setStep] = useState(1) // Multi-step form
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Step 1: Account Creation
  const [accountData, setAccountData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Step 2: Data Pribadi
  const [formData, setFormData] = useState({
    fullName: "",
    noKTP: "",
    jenisKelamin: "Laki-laki" as Gender,
    suku: "",
    tempatLahir: "",
    tanggalLahir: "",
    agama: "",
    statusKawin: "Belum Kawin" as MaritalStatus,
    pendidikan: "",
    pekerjaan: "",
    
    // Data Keluarga
    statusKeluarga: "Kepala Keluarga",
    namaKeluarga: "",
    
    // Data Alamat
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kabupatenKota: "",
    provinsi: "",
    kodePos: "",
    
    // Data Kontak
    noTelp: "",
    noHP: "",
    
    // Data Penjamin
    metodePembayaran: "Cash" as PaymentMethod,
    namaPenanggung: "",
    nomorAsuransi: ""
  })

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (accountData.password !== accountData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      return
    }

    if (accountData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    // Create account
    const success = await register(accountData.email, accountData.password, formData.fullName || "Pasien Baru")
    
    if (success) {
      setStep(2) // Move to profile form
    } else {
      setError("Email sudah terdaftar. Silakan gunakan email lain atau login.")
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.fullName || !formData.noKTP || !formData.tanggalLahir) {
      setError("Mohon isi semua field yang wajib (*)")
      return
    }

    // Create profile object
    const profile: Partial<PatientProfile> = {
      fullName: formData.fullName,
      noKTP: formData.noKTP,
      jenisKelamin: formData.jenisKelamin,
      suku: formData.suku,
      tempatLahir: formData.tempatLahir,
      tanggalLahir: new Date(formData.tanggalLahir),
      agama: formData.agama,
      statusKawin: formData.statusKawin,
      pendidikan: formData.pendidikan,
      pekerjaan: formData.pekerjaan,
      statusKeluarga: formData.statusKeluarga as any,
      namaKeluarga: formData.namaKeluarga,
      alamat: formData.alamat,
      rt: formData.rt,
      rw: formData.rw,
      kelurahan: formData.kelurahan,
      kecamatan: formData.kecamatan,
      kabupatenKota: formData.kabupatenKota,
      provinsi: formData.provinsi,
      kodePos: formData.kodePos,
      noTelp: formData.noTelp,
      noHP: formData.noHP,
      metodePembayaran: formData.metodePembayaran,
      namaPenanggung: formData.namaPenanggung,
      nomorAsuransi: formData.nomorAsuransi,
      isVerified: false
    }

    const updateSuccess = await updateProfile(profile)
    
    if (updateSuccess) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/patient/dashboard")
      }, 2000)
    } else {
      setError("Gagal menyimpan profil. Silakan coba lagi.")
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">Registrasi Berhasil!</CardTitle>
            <CardDescription className="text-base mt-2">
              Akun Anda telah dibuat. Anda akan diarahkan ke dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Buat Akun</span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Lengkapi Profil</span>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 1 ? "Registrasi Akun Pasien" : "Lengkapi Data Diri"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? "Buat akun untuk dapat melakukan reservasi online 24/7" 
                : "Isi data diri lengkap untuk verifikasi dan pembuatan rekam medis"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1: Account Creation */}
            {step === 1 && (
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                    required
                    placeholder="contoh@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={accountData.password}
                    onChange={(e) => setAccountData({...accountData, password: e.target.value})}
                    required
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                    required
                    placeholder="Ketik ulang password"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Membuat Akun..." : "Lanjut ke Profil"}
                </Button>

                <p className="text-sm text-center text-gray-600">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-green-600 hover:underline font-medium">
                    Login di sini
                  </Link>
                </p>
              </form>
            )}

            {/* STEP 2: Complete Profile Form */}
            {step === 2 && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Data Pribadi */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Data Pribadi</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="noKTP">No. KTP *</Label>
                      <Input
                        id="noKTP"
                        type="text"
                        value={formData.noKTP}
                        onChange={(e) => setFormData({...formData, noKTP: e.target.value})}
                        required
                        maxLength={16}
                        placeholder="16 digit"
                      />
                    </div>

                    <div>
                      <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                      <select
                        id="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value as Gender})}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
                      <Input
                        id="tempatLahir"
                        type="text"
                        value={formData.tempatLahir}
                        onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                      <Input
                        id="tanggalLahir"
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="suku">Suku</Label>
                      <Input
                        id="suku"
                        type="text"
                        value={formData.suku}
                        onChange={(e) => setFormData({...formData, suku: e.target.value})}
                        placeholder="Contoh: Jawa, Sunda, dll"
                      />
                    </div>

                    <div>
                      <Label htmlFor="agama">Agama *</Label>
                      <select
                        id="agama"
                        value={formData.agama}
                        onChange={(e) => setFormData({...formData, agama: e.target.value})}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Pilih Agama</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="statusKawin">Status Kawin *</Label>
                      <select
                        id="statusKawin"
                        value={formData.statusKawin}
                        onChange={(e) => setFormData({...formData, statusKawin: e.target.value as MaritalStatus})}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin">Kawin</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
                      <select
                        id="pendidikan"
                        value={formData.pendidikan}
                        onChange={(e) => setFormData({...formData, pendidikan: e.target.value})}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      >
                        <option value="">Pilih Pendidikan</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA</option>
                        <option value="D3">D3</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="pekerjaan">Pekerjaan</Label>
                      <Input
                        id="pekerjaan"
                        type="text"
                        value={formData.pekerjaan}
                        onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})}
                        placeholder="Contoh: Karyawan Swasta"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Keluarga */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Data Keluarga</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="statusKeluarga">Status dalam Keluarga</Label>
                      <select
                        id="statusKeluarga"
                        value={formData.statusKeluarga}
                        onChange={(e) => setFormData({...formData, statusKeluarga: e.target.value})}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                      >
                        <option value="Kepala Keluarga">Kepala Keluarga</option>
                        <option value="Istri">Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="namaKeluarga">Nama Istri/Suami/Orang Tua</Label>
                      <Input
                        id="namaKeluarga"
                        type="text"
                        value={formData.namaKeluarga}
                        onChange={(e) => setFormData({...formData, namaKeluarga: e.target.value})}
                        placeholder="Nama keluarga"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Alamat */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Data Alamat</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="alamat">Alamat Lengkap *</Label>
                      <Input
                        id="alamat"
                        type="text"
                        value={formData.alamat}
                        onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                        required
                        placeholder="Jalan, No. Rumah"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="rt">RT *</Label>
                        <Input
                          id="rt"
                          type="text"
                          value={formData.rt}
                          onChange={(e) => setFormData({...formData, rt: e.target.value})}
                          required
                          placeholder="001"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rw">RW *</Label>
                        <Input
                          id="rw"
                          type="text"
                          value={formData.rw}
                          onChange={(e) => setFormData({...formData, rw: e.target.value})}
                          required
                          placeholder="001"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="kodePos">Kode Pos</Label>
                        <Input
                          id="kodePos"
                          type="text"
                          value={formData.kodePos}
                          onChange={(e) => setFormData({...formData, kodePos: e.target.value})}
                          placeholder="12345"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kelurahan">Kelurahan/Desa *</Label>
                        <Input
                          id="kelurahan"
                          type="text"
                          value={formData.kelurahan}
                          onChange={(e) => setFormData({...formData, kelurahan: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="kecamatan">Kecamatan *</Label>
                        <Input
                          id="kecamatan"
                          type="text"
                          value={formData.kecamatan}
                          onChange={(e) => setFormData({...formData, kecamatan: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="kabupatenKota">Kabupaten/Kota *</Label>
                        <Input
                          id="kabupatenKota"
                          type="text"
                          value={formData.kabupatenKota}
                          onChange={(e) => setFormData({...formData, kabupatenKota: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="provinsi">Provinsi *</Label>
                        <Input
                          id="provinsi"
                          type="text"
                          value={formData.provinsi}
                          onChange={(e) => setFormData({...formData, provinsi: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Kontak */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Data Kontak</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="noHP">No. HP/WhatsApp *</Label>
                      <Input
                        id="noHP"
                        type="tel"
                        value={formData.noHP}
                        onChange={(e) => setFormData({...formData, noHP: e.target.value})}
                        required
                        placeholder="08xxxxxxxxxx"
                      />
                      <p className="text-xs text-gray-500 mt-1">Untuk notifikasi reservasi</p>
                    </div>

                    <div>
                      <Label htmlFor="noTelp">No. Telepon Rumah</Label>
                      <Input
                        id="noTelp"
                        type="tel"
                        value={formData.noTelp}
                        onChange={(e) => setFormData({...formData, noTelp: e.target.value})}
                        placeholder="021xxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Penjamin */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Data Penjamin</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="metodePembayaran">Metode Pembayaran *</Label>
                      <select
                        id="metodePembayaran"
                        value={formData.metodePembayaran}
                        onChange={(e) => setFormData({...formData, metodePembayaran: e.target.value as PaymentMethod})}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="Cash">Cash/Tunai</option>
                        <option value="BPJS">BPJS Kesehatan</option>
                        <option value="Asuransi Swasta">Asuransi Swasta</option>
                      </select>
                    </div>

                    {formData.metodePembayaran !== 'Cash' && (
                      <>
                        <div>
                          <Label htmlFor="namaPenanggung">Nama Perusahaan Asuransi</Label>
                          <Input
                            id="namaPenanggung"
                            type="text"
                            value={formData.namaPenanggung}
                            onChange={(e) => setFormData({...formData, namaPenanggung: e.target.value})}
                            placeholder="Contoh: BPJS, Prudential, dll"
                          />
                        </div>

                        <div>
                          <Label htmlFor="nomorAsuransi">Nomor Kartu Asuransi</Label>
                          <Input
                            id="nomorAsuransi"
                            type="text"
                            value={formData.nomorAsuransi}
                            onChange={(e) => setFormData({...formData, nomorAsuransi: e.target.value})}
                            placeholder="Nomor kartu"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    Kembali
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Menyimpan..." : "Selesai Registrasi"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  * Field wajib diisi. Data Anda akan diverifikasi oleh admin saat Anda datang ke RS.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
