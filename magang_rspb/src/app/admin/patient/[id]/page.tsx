"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = dynamic(() => import("@/components/ProtectedRoute"), {
  ssr: false,
});

type Registration = {
  id: number;
  user_id: number;
  poli_id: number;
  full_name: string;
  nik: string;
  no_kk: string;
  keluhan?: string | null;
  queue_number?: number | null;
  status?: string | null;
  created_at?: string | null;
  polis?: { name?: string | null };
  dokter_id?: number | null;
  catatan?: string | null;
  photo_ktp?: string | null;
  photo_kk?: string | null;
  photo_profile?: string | null;
  more_document?: string | null;
  dokters?: {
    id: number;
    name: string;
    specialization: string;
    phone: string;
  };
};

type Dokter = {
  id: number;
  name: string;
  specialization: string;
  phone: string;
};

const baseApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");
const toAbsoluteUrl = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${baseApiUrl}${url}`;
};

function PatientDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const registrationId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState<Registration | null>(null);
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [selectedDokterId, setSelectedDokterId] = useState<number | null>(null);
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchPatient();
    fetchDokters();
  }, [registrationId]);

  async function fetchPatient() {
    try {
      setLoading(true);
      const res = await fetch(`${baseApiUrl}/registrations/${registrationId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Gagal memuat data pasien");
      const data = await res.json();
      console.log("Patient data:", data); // Debug log
      setPatient(data);
      setSelectedDokterId(data.dokter_id || null);
      setCatatan(data.catatan || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDokters() {
    try {
      const res = await fetch(`${baseApiUrl}/dokters`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) return;
      const data = await res.json();
      setDokters(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!patient) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("status", newStatus);
      if (patient.queue_number !== null && patient.queue_number !== undefined) {
        formData.append("queue_number", String(patient.queue_number));
      }
      const res = await fetch(`${baseApiUrl}/registrations/${patient.id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal memperbarui status");
      const updated = await res.json();
      setPatient(updated);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui status");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDoctorAndNotes = async () => {
    if (!patient) return;
    try {
      setSaving(true);
      const formData = new FormData();
      if (selectedDokterId !== null && selectedDokterId !== undefined) {
        formData.append("dokter_id", String(selectedDokterId));
      }
      formData.append("catatan", catatan);
      const res = await fetch(`${baseApiUrl}/registrations/${patient.id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      const updated = await res.json();
      setPatient(updated);
      alert("Data pemeriksaan berhasil disimpan");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteExamination = async () => {
    if (!patient) return;
    try {
      setSaving(true);
      const formData = new FormData();
      if (selectedDokterId !== null && selectedDokterId !== undefined) {
        formData.append("dokter_id", String(selectedDokterId));
      }
      formData.append("catatan", catatan);
      formData.append("status", "selesai");
      if (patient.queue_number !== null && patient.queue_number !== undefined) {
        formData.append("queue_number", String(patient.queue_number));
      }
      const res = await fetch(`${baseApiUrl}/registrations/${patient.id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal menyelesaikan pemeriksaan");
      const updated = await res.json();
      setPatient(updated);
      alert("Pemeriksaan berhasil diselesaikan");
    } catch (error) {
      console.error(error);
      alert("Gagal menyelesaikan pemeriksaan");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p>Data pasien tidak ditemukan</p>
          <Link
            href="/admin"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Keep for now but not used
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-green-600 hover:text-green-700 text-sm font-medium mb-2 inline-block"
          >
            ← Kembali ke Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Detail Pasien
              </h1>
              <p className="text-gray-600">
                No. Antrian: {patient.queue_number ?? "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pasien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Photo Section */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {patient.photo_profile ? (
                      <img
                        src={toAbsoluteUrl(patient.photo_profile)}
                        alt={patient.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {patient.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {patient.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">NIK: {patient.nik}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>No. KK</Label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {patient.no_kk}
                    </p>
                  </div>
                  <div>
                    <Label>Poli</Label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                      {patient.polis?.name || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Keluhan</Label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {patient.keluhan || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Doctor and Notes */}
            {(patient.status === "dipanggil" ||
              patient.status === "selesai") && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Pemeriksaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="dokter"
                      className="text-gray-700 font-medium"
                    >
                      Dokter yang Merawat
                    </Label>
                    {selectedDokterId && patient.dokter_id && (
                      <div className="mt-2 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-xs text-blue-700">
                            Dokter ini sudah dipilih saat pendaftaran
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="relative mt-2">
                      <select
                        id="dokter"
                        value={selectedDokterId || ""}
                        onChange={(e) =>
                          setSelectedDokterId(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          patient.status === "selesai" || dokters.length === 0
                        }
                      >
                        <option value="">-- Pilih Dokter --</option>
                        {dokters.map((dok) => (
                          <option key={dok.id} value={dok.id}>
                            {dok.name} - {dok.specialization}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="catatan">Catatan Medis</Label>
                    {patient.status === "selesai" ? (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 min-h-24">
                        {patient.catatan || "Tidak ada catatan"}
                      </p>
                    ) : (
                      <textarea
                        id="catatan"
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Masukkan catatan medis..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    )}
                  </div>

                  {patient.status === "dipanggil" && (
                    <div className="pt-4">
                      <Button
                        onClick={handleCompleteExamination}
                        disabled={saving}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {saving
                          ? "Menyimpan..."
                          : "Simpan & Selesaikan Pemeriksaan"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {(patient.photo_ktp ||
              patient.photo_kk ||
              patient.photo_profile ||
              patient.more_document) && (
              <Card>
                <CardHeader>
                  <CardTitle>Dokumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {patient.photo_ktp && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          📄 Foto KTP
                        </p>
                        <img
                          src={toAbsoluteUrl(patient.photo_ktp)}
                          alt="KTP"
                          className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() =>
                            window.open(
                              toAbsoluteUrl(patient.photo_ktp),
                              "_blank"
                            )
                          }
                        />
                      </div>
                    )}
                    {patient.photo_kk && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          📄 Foto KK
                        </p>
                        <img
                          src={toAbsoluteUrl(patient.photo_kk)}
                          alt="KK"
                          className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() =>
                            window.open(
                              toAbsoluteUrl(patient.photo_kk),
                              "_blank"
                            )
                          }
                        />
                      </div>
                    )}
                    {patient.photo_profile && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          👤 Foto Profil
                        </p>
                        <img
                          src={toAbsoluteUrl(patient.photo_profile)}
                          alt="Profile"
                          className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() =>
                            window.open(
                              toAbsoluteUrl(patient.photo_profile),
                              "_blank"
                            )
                          }
                        />
                      </div>
                    )}
                    {patient.more_document && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          📎 Dokumen Tambahan
                        </p>
                        <img
                          src={toAbsoluteUrl(patient.more_document)}
                          alt="Document"
                          className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() =>
                            window.open(
                              toAbsoluteUrl(patient.more_document),
                              "_blank"
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Antrian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {patient.queue_number ?? "-"}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      patient.status === "menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : patient.status === "dipanggil"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {patient.status === "menunggu"
                      ? "Menunggu"
                      : patient.status === "dipanggil"
                      ? "Dipanggil"
                      : "Selesai"}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleStatusUpdate("menunggu")}
                    variant="outline"
                    className="w-full"
                    disabled={saving || patient.status === "menunggu"}
                  >
                    Set Menunggu
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("dipanggil")}
                    variant="outline"
                    className="w-full"
                    disabled={saving || patient.status === "dipanggil"}
                  >
                    Set Dipanggil
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("selesai")}
                    variant="outline"
                    className="w-full"
                    disabled={saving || patient.status === "selesai"}
                  >
                    Set Selesai
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Waktu Daftar:
                    </span>
                    <div className="text-gray-600">
                      {patient.created_at
                        ? new Date(patient.created_at).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User ID:</span>
                    <div className="text-gray-600">{patient.user_id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientDetailPageWrapper() {
  return (
    <ProtectedRoute requiredRole="admin">
      <PatientDetailPage />
    </ProtectedRoute>
  );
}
