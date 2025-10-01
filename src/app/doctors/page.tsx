import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function OurDoctorsPage() {
  const doctors = [
    {
      id: 1,
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
      description: "Spesialis jantung berpengalaman dengan keahlian dalam kardiologi intervensi dan elektrofisiologi."
    },
    {
      id: 2,
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
      description: "Dokter anak yang berpengalaman dalam menangani berbagai kondisi kesehatan anak dan bayi."
    },
    {
      id: 3,
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
      description: "Ahli kebidanan dan kandungan dengan spesialisasi dalam kehamilan risiko tinggi."
    },
    {
      id: 4,
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
      description: "Spesialis mata dengan keahlian dalam bedah katarak dan glaukoma."
    },
    {
      id: 5,
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
      description: "Dokter spesialis penyakit dalam dengan fokus pada diabetes dan hipertensi."
    },
    {
      id: 6,
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
      description: "Spesialis THT dengan keahlian dalam bedah sinus dan gangguan pendengaran."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tim Dokter Kami</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bertemu dengan tim dokter spesialis berpengalaman yang siap memberikan pelayanan kesehatan terbaik untuk Anda dan keluarga
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Doctor Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  {/* Placeholder for doctor image - in real app you'd use actual images */}
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-green-700 text-xs font-semibold rounded-full">
                    DOKTER
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Doctor Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-500">
                    {doctor.poli}
                  </p>
                </div>

                {/* Quick Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Pengalaman: {doctor.experience}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {doctor.schedule.length} hari praktek
                  </div>
                </div>

                {/* Read Detail Button */}
                <Link href={`/doctors/${doctor.id}`}>
                  <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500 hover:text-green-600 transition-all duration-200">
                    Read Detail
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Butuh Konsultasi dengan Dokter?
          </h2>
          <p className="text-gray-600 mb-6">
            Daftar sekarang untuk mendapatkan pelayanan kesehatan terbaik dari tim dokter spesialis kami
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/daftar">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/cek-status">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                Cek Status Antrian
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}