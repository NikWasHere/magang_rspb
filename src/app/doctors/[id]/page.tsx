"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoctorDetailPage() {
  const params = useParams()
  const doctorId = params.id

  // Mock data - in real app this would come from API
  const doctors = [
    {
      id: "1",
      name: "Dr. Ahmad Susanto, Sp.JP",
      specialization: "Spesialis Jantung dan Pembuluh Darah",
      poli: "Poliklinik Jantung",
      image: "/doctor1.jpg",
      schedule: [
        { day: "Senin", time: "08:00 - 12:00" },
        { day: "Rabu", time: "13:00 - 17:00" },
        { day: "Jumat", time: "08:00 - 12:00" }
      ],
      education: "Universitas Indonesia",
      experience: "15 tahun",
      description: "Dr. Ahmad Susanto adalah spesialis jantung dan pembuluh darah yang berpengalaman dengan keahlian khusus dalam kardiologi intervensi dan elektrofisiologi. Beliau telah menangani ribuan kasus penyakit jantung dengan tingkat keberhasilan yang tinggi.",
      expertise: [
        "Kardiologi Intervensi",
        "Elektrofisiologi Jantung", 
        "Ekokardiografi",
        "Kateterisasi Jantung",
        "Pemasangan Stent Koroner"
      ],
      awards: [
        "Best Cardiologist Award 2023",
        "Excellence in Patient Care 2022",
        "Research Innovation Award 2021"
      ]
    },
    {
      id: "2", 
      name: "Dr. Sari Dewi, Sp.A",
      specialization: "Spesialis Anak",
      poli: "Poliklinik Anak",
      image: "/doctor2.jpg",
      schedule: [
        { day: "Selasa", time: "09:00 - 14:00" },
        { day: "Kamis", time: "09:00 - 14:00" },
        { day: "Sabtu", time: "08:00 - 12:00" }
      ],
      education: "Universitas Gadjah Mada",
      experience: "12 tahun",
      description: "Dr. Sari Dewi adalah dokter spesialis anak yang berpengalaman dalam menangani berbagai kondisi kesehatan anak dan bayi. Beliau dikenal karena pendekatannya yang ramah dan sabar terhadap pasien anak.",
      expertise: [
        "Pediatri Umum",
        "Neonatologi",
        "Imunisasi Anak",
        "Tumbuh Kembang Anak",
        "Nutrisi Pediatrik"
      ],
      awards: [
        "Child-Friendly Doctor Award 2023",
        "Pediatric Excellence Award 2022"
      ]
    },
    {
      id: "3",
      name: "Dr. Budi Hartono, Sp.OG",
      specialization: "Spesialis Kandungan dan Kebidanan",
      poli: "Poliklinik Kandungan",
      image: "/doctor3.jpg",
      schedule: [
        { day: "Senin", time: "13:00 - 17:00" },
        { day: "Selasa", time: "08:00 - 12:00" },
        { day: "Kamis", time: "13:00 - 17:00" }
      ],
      education: "Universitas Airlangga",
      experience: "18 tahun",
      description: "Dr. Budi Hartono adalah ahli kebidanan dan kandungan dengan spesialisasi dalam kehamilan risiko tinggi. Beliau telah membantu ribuan persalinan dengan aman dan menangani berbagai komplikasi kehamilan.",
      expertise: [
        "Kehamilan Risiko Tinggi",
        "Bedah Ginekologi",
        "Fertilitas dan Infertilitas",
        "Operasi Caesar",
        "USG 4D"
      ],
      awards: [
        "Excellence in Maternal Care 2023",
        "Safe Delivery Champion 2022"
      ]
    },
    {
      id: "4",
      name: "Dr. Maya Kusuma, Sp.M",
      specialization: "Spesialis Mata",
      poli: "Poliklinik Mata",
      image: "/doctor4.jpg",
      schedule: [
        { day: "Rabu", time: "08:00 - 15:00" },
        { day: "Jumat", time: "13:00 - 17:00" },
        { day: "Sabtu", time: "08:00 - 12:00" }
      ],
      education: "Universitas Padjadjaran",
      experience: "10 tahun",
      description: "Dr. Maya Kusuma adalah spesialis mata dengan keahlian dalam bedah katarak dan glaukoma. Beliau menggunakan teknologi terkini untuk memberikan hasil terbaik bagi pasien.",
      expertise: [
        "Bedah Katarak",
        "Pengobatan Glaukoma",
        "Retina dan Vitreous",
        "Laser Mata",
        "Refraksi dan Orthokeratology"
      ],
      awards: [
        "Vision Excellence Award 2023",
        "Innovation in Eye Surgery 2022"
      ]
    },
    {
      id: "5",
      name: "Dr. Rizki Pratama, Sp.PD",
      specialization: "Spesialis Penyakit Dalam",
      poli: "Poliklinik Penyakit Dalam",
      image: "/doctor5.jpg",
      schedule: [
        { day: "Senin", time: "08:00 - 12:00" },
        { day: "Rabu", time: "08:00 - 12:00" },
        { day: "Jumat", time: "08:00 - 12:00" }
      ],
      education: "Universitas Indonesia",
      experience: "14 tahun",
      description: "Dr. Rizki Pratama adalah dokter spesialis penyakit dalam dengan fokus khusus pada penanganan diabetes dan hipertensi. Beliau aktif dalam edukasi pasien tentang gaya hidup sehat.",
      expertise: [
        "Diabetes Mellitus",
        "Hipertensi",
        "Penyakit Ginjal",
        "Gangguan Tiroid",
        "Geriatri"
      ],
      awards: [
        "Diabetes Care Excellence 2023",
        "Internal Medicine Award 2022"
      ]
    },
    {
      id: "6",
      name: "Dr. Indira Sari, Sp.THT",
      specialization: "Spesialis THT-KL",
      poli: "Poliklinik THT",
      image: "/doctor6.jpg",
      schedule: [
        { day: "Selasa", time: "13:00 - 17:00" },
        { day: "Kamis", time: "08:00 - 12:00" },
        { day: "Sabtu", time: "13:00 - 17:00" }
      ],
      education: "Universitas Diponegoro",
      experience: "11 tahun",
      description: "Dr. Indira Sari adalah spesialis THT dengan keahlian dalam bedah sinus dan gangguan pendengaran. Beliau menggunakan teknik endoskopi terkini untuk hasil optimal.",
      expertise: [
        "Bedah Sinus Endoskopi",
        "Gangguan Pendengaran",
        "Bedah Amandel",
        "Rinoplasti",
        "Audiologi"
      ],
      awards: [
        "ENT Surgery Excellence 2023",
        "Hearing Care Award 2022"
      ]
    }
  ]

  const doctor = doctors.find(d => d.id === doctorId)

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dokter Tidak Ditemukan</h1>
          <Link href="/doctors">
            <Button>Kembali ke Daftar Dokter</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/doctors" 
            className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Dokter
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Profile */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Doctor Details */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
                    <p className="text-lg text-green-600 font-medium mb-2">{doctor.specialization}</p>
                    <p className="text-gray-600 mb-4">{doctor.poli}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Pengalaman: {doctor.experience}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                        Alumni: {doctor.education}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Dokter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Keahlian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctor.expertise.map((skill, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Awards */}
            <Card>
              <CardHeader>
                <CardTitle>Penghargaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doctor.awards.map((award, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {award}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Schedule & Actions */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Praktek</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctor.schedule.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{schedule.day}</span>
                      <span className="text-green-600 font-medium">{schedule.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Catatan:</strong> Jadwal dapat berubah sewaktu-waktu. Silakan hubungi rumah sakit untuk konfirmasi.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Konsultasi dengan Dokter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/daftar">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Daftar Konsultasi
                  </Button>
                </Link>
                <Link href="/cek-status">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    Cek Status Antrian
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Hubungi Rumah Sakit
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (021) 123-4567
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  IHC Hospital, Jakarta
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Buka 24 Jam
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}