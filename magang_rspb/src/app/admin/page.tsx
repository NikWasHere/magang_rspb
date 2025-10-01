import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import UserStatusBanner from "@/components/UserStatusBanner"

function AdminDashboard() {
  // Mock data for registered patients
  const patients = [
    {
      id: 1,
      queueNumber: "001",
      name: "John Doe",
      complaint: "Sakit kepala",
      poli: "Klinik Pratama Pertamina",
      registeredAt: "2025-09-30 09:30",
      status: "Waiting"
    },
    {
      id: 2,
      queueNumber: "002", 
      name: "Jane Smith",
      complaint: "Demam tinggi",
      poli: "Poliklinik Umum",
      registeredAt: "2025-09-30 10:15",
      status: "In Progress"
    },
    {
      id: 3,
      queueNumber: "003",
      name: "Bob Johnson", 
      complaint: "Sakit gigi",
      poli: "Poliklinik Gigi",
      registeredAt: "2025-09-30 11:00",
      status: "Completed"
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Pendaftaran</h1>
                <p className="text-gray-600">Kelola pendaftaran pasien hari ini</p>
              </div>
              <Link
                href="/daftar"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                + Daftar Pasien Baru
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-800">Total Hari Ini</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">5</div>
                <div className="text-sm text-yellow-800">Menunggu</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-green-800">Sedang Dilayani</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">3</div>
                <div className="text-sm text-gray-800">Selesai</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-lg border-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Pasien Terdaftar</h2>
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
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {patient.queueNumber}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{patient.name}</td>
                    <td className="p-4 text-gray-600">{patient.complaint}</td>
                    <td className="p-4 text-gray-600">{patient.poli}</td>
                    <td className="p-4 text-gray-600">{patient.registeredAt}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                        patient.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/patient/${patient.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Detail
                        </Link>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Panggil
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {patients.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p>Belum ada pasien yang terdaftar hari ini</p>
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