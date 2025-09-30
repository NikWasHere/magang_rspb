import Link from "next/link"
import UserStatusBanner from "@/components/UserStatusBanner"

export default function HistoryPage() {
  // Mock data for patient history
  const history = [
    {
      id: 1,
      date: "2025-09-30",
      time: "09:30",
      queueNumber: "001",
      poli: "Klinik Pratama Pertamina",
      complaint: "Sakit kepala",
      doctor: "Dr. Smith",
      status: "Completed",
      notes: "Pasien diberikan obat paracetamol"
    },
    {
      id: 2,
      date: "2025-09-25",
      time: "14:15",
      queueNumber: "045",
      poli: "Poliklinik Umum",
      complaint: "Demam tinggi",
      doctor: "Dr. Johnson",
      status: "Completed",
      notes: "Pasien perlu kontrol ulang dalam 1 minggu"
    },
    {
      id: 3,
      date: "2025-09-20",
      time: "11:00",
      queueNumber: "023",
      poli: "Poliklinik Gigi",
      complaint: "Sakit gigi",
      doctor: "Dr. Brown",
      status: "Completed",
      notes: "Cabut gigi dan resep antibiotik"
    }
  ]

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
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Semua Status</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Semua Poli</option>
                <option>Klinik Pratama Pertamina</option>
                <option>Poliklinik Umum</option>
                <option>Poliklinik Gigi</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Dari Tanggal"
              />
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Sampai Tanggal"
              />
            </div>
          </div>
        </div>

        {/* History Cards */}
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      #{record.queueNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {record.date} - {record.time}
                      </div>
                      <div className="text-sm text-gray-600">{record.poli}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    record.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Keluhan</div>
                    <div className="text-gray-600">{record.complaint}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Dokter</div>
                    <div className="text-gray-600">{record.doctor}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Catatan</div>
                    <div className="text-gray-600">{record.notes}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Lihat Detail
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Download Hasil
                  </button>
                  <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                    Daftar Ulang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {history.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border-0 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki riwayat pendaftaran.</p>
            <Link
              href="/daftar"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        )}

        {/* Pagination */}
        {history.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-l-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-green-600 text-white border border-green-600">
                1
              </button>
              <button className="px-3 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-r-lg hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}