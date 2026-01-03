"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const baseApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

const toAbsoluteUrl = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${baseApiUrl}${url}`;
};

interface Dokter {
  id: number;
  name: string;
  specialization: string;
  phone: string;
}

interface Registration {
  id: number;
  full_name: string;
  nik: string;
  no_kk: string;
  keluhan: string;
  queue_number: number;
  status: string;
  polis?: {
    name: string;
  };
  dokter_id?: number;
  catatan?: string;
  photo_ktp?: string;
  photo_kk?: string;
  photo_profile?: string;
  more_document?: string;
  dokters?: {
    name: string;
    specialization: string;
  };
}

interface PatientDetailModalProps {
  registrationId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    dokter_id: number | null;
    catatan: string;
  }) => Promise<void>;
}

export default function PatientDetailModal({
  registrationId,
  isOpen,
  onClose,
  onSave,
}: PatientDetailModalProps) {
  const { token } = useAuth();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [selectedDokterId, setSelectedDokterId] = useState<number | null>(null);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && registrationId) {
      loadRegistration();
      loadDokters();
    }
  }, [isOpen, registrationId]);

  const loadRegistration = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/registrations/${registrationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRegistration(data);
        setSelectedDokterId(data.dokter_id || null);
        setCatatan(data.catatan || "");
      }
    } catch (error) {
      console.error("Error loading registration:", error);
    }
    setLoading(false);
  };

  const loadDokters = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dokters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDokters(data);
      }
    } catch (error) {
      console.error("Error loading dokters:", error);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave({
        dokter_id: selectedDokterId,
        catatan,
      });
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Detail Pasien</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : registration ? (
            <div className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Informasi Pasien</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nama
                    </label>
                    <p className="text-gray-900">{registration.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      NIK
                    </label>
                    <p className="text-gray-900">{registration.nik}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      No. KK
                    </label>
                    <p className="text-gray-900">{registration.no_kk}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Poli
                    </label>
                    <p className="text-gray-900">{registration.polis?.name}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Keluhan
                    </label>
                    <p className="text-gray-900">{registration.keluhan}</p>
                  </div>
                </div>
              </div>

              {/* Queue and Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Status Antrian</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      No. Antrian
                    </label>
                    <p className="text-gray-900 font-semibold text-lg">
                      {registration.queue_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <p className="text-gray-900">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          registration.status === "menunggu"
                            ? "bg-yellow-100 text-yellow-800"
                            : registration.status === "dipanggil"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {registration.status === "menunggu"
                          ? "Menunggu"
                          : registration.status === "dipanggil"
                          ? "Dipanggil"
                          : "Selesai"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Doctor and Notes Section */}
              {(registration.status === "dipanggil" ||
                registration.status === "selesai") && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Data Pemeriksaan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dokter yang Merawat
                      </label>
                      {registration.status === "selesai" ? (
                        <p className="text-gray-900">
                          {registration.dokters?.name || "Belum ditentukan"}
                        </p>
                      ) : (
                        <select
                          id="dokter-modal"
                          value={selectedDokterId || ""}
                          onChange={(e) =>
                            setSelectedDokterId(
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Pilih Dokter --</option>
                          {dokters.map((dok) => (
                            <option key={dok.id} value={dok.id}>
                              {dok.name} ({dok.specialization})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan Medis
                      </label>
                      {registration.status === "selesai" ? (
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">
                          {registration.catatan || "Tidak ada catatan"}
                        </p>
                      ) : (
                        <textarea
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          placeholder="Masukkan catatan medis..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                          rows={4}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {(registration.photo_ktp ||
                registration.photo_kk ||
                registration.photo_profile ||
                registration.more_document) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dokumen</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {registration.photo_ktp && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">📄 Foto KTP</p>
                        <img 
                          src={toAbsoluteUrl(registration.photo_ktp)} 
                          alt="KTP" 
                          className="w-full h-32 object-cover rounded cursor-pointer"
                          onClick={() => window.open(toAbsoluteUrl(registration.photo_ktp), '_blank')}
                        />
                      </div>
                    )}
                    {registration.photo_kk && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">📄 Foto KK</p>
                        <img 
                          src={toAbsoluteUrl(registration.photo_kk)} 
                          alt="KK" 
                          className="w-full h-32 object-cover rounded cursor-pointer"
                          onClick={() => window.open(toAbsoluteUrl(registration.photo_kk), '_blank')}
                        />
                      </div>
                    )}
                    {registration.photo_profile && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">👤 Foto Profil</p>
                        <img 
                          src={toAbsoluteUrl(registration.photo_profile)} 
                          alt="Profile" 
                          className="w-full h-32 object-cover rounded cursor-pointer"
                          onClick={() => window.open(toAbsoluteUrl(registration.photo_profile), '_blank')}
                        />
                      </div>
                    )}
                    {registration.more_document && (
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">📎 Dokumen Tambahan</p>
                        <img 
                          src={toAbsoluteUrl(registration.more_document)} 
                          alt="Document" 
                          className="w-full h-32 object-cover rounded cursor-pointer"
                          onClick={() => window.open(toAbsoluteUrl(registration.more_document), '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Gagal memuat data
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {registration && registration.status === "dipanggil" && onSave && (
          <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? "Menyimpan..." : "Simpan Data Pemeriksaan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
