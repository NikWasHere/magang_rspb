"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  dokters?: {
    name: string;
    specialization: string;
  };
};

const baseApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

const statusStyle = (status?: string | null) => {
  const normalized = (status || "menunggu").toLowerCase();
  if (normalized === "dipanggil") {
    return "bg-blue-100 text-blue-800";
  }
  if (normalized === "selesai") {
    return "bg-green-100 text-green-800";
  }
  return "bg-yellow-100 text-yellow-800";
};

const statusLabel = (status?: string | null) => {
  const normalized = (status || "menunggu").toLowerCase();
  if (normalized === "dipanggil") return "Dipanggil";
  if (normalized === "selesai") return "Selesai";
  return "Menunggu";
};

export default function CekStatusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("nik");
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    dipanggil: 0,
    selesai: 0,
  });
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);

  // Load all registrations on mount
  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const res = await fetch(`${baseApiUrl}/registrations`);
        if (!res.ok) throw new Error("Gagal mengambil data");

        const data = await res.json();
        const registrations: Registration[] = data || [];
        setAllRegistrations(registrations);

        // Update stats
        setStats({
          total: registrations.length,
          menunggu: registrations.filter(
            (r) => (r.status || "").toLowerCase() === "menunggu"
          ).length,
          dipanggil: registrations.filter(
            (r) => (r.status || "").toLowerCase() === "dipanggil"
          ).length,
          selesai: registrations.filter(
            (r) => (r.status || "").toLowerCase() === "selesai"
          ).length,
        });
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      setError(null);
      return;
    }

    setError(null);
    setSearchResult(null);

    // Search by queue number or NIK
    let found: Registration | undefined;
    if (searchType === "queue") {
      found = allRegistrations.find(
        (r) => String(r.queue_number) === searchQuery.trim()
      );
    } else if (searchType === "nik") {
      found = allRegistrations.find((r) => r.nik === searchQuery.trim());
    }

    if (!found) {
      setError(
        `Tidak ditemukan dengan ${
          searchType === "queue" ? "nomor antrian" : "NIK"
        } "${searchQuery}"`
      );
      return;
    }

    setSearchResult(found);
  };

  const currentTime = new Date().toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-0 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Cek Status Antrian
              </h1>
              <p className="text-gray-600">
                Periksa status antrian dan informasi pendaftaran Anda
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-800">Total Antrian</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.menunggu}
                </div>
                <div className="text-sm text-yellow-800">Menunggu</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.dipanggil}
                </div>
                <div className="text-sm text-blue-800">Dipanggil</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.selesai}
                </div>
                <div className="text-sm text-green-800">Selesai</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg border-0 mb-6 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Cari berdasarkan:
              </Label>
              <div className="flex gap-4">
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
              </div>
            </div>

            <div className="flex gap-3 items-end">
              <Input
                placeholder={
                  searchType === "nik"
                    ? "Masukkan NIK Anda"
                    : "Masukkan nomor antrian"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                Cek Status
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mt-4">
              {error}
            </div>
          )}
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="bg-white rounded-xl shadow-lg border-0 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Status Antrian Anda
                </h2>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  #{searchResult.queue_number || "-"}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Nama Pasien
                  </div>
                  <div className="text-gray-900 font-medium">
                    {searchResult.full_name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Poliklinik
                  </div>
                  <div className="text-gray-900">
                    {searchResult.polis?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Keluhan
                  </div>
                  <div className="text-gray-900">
                    {searchResult.keluhan || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    NIK
                  </div>
                  <div className="text-gray-900">{searchResult.nik}</div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {searchResult.queue_number || "-"}
                    </div>
                    <div className="text-sm text-gray-600">
                      No. Antrian Anda
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {searchResult.created_at
                        ? new Date(searchResult.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-600">Waktu Daftar</div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">
                    Status Saat Ini
                  </div>
                  <div className="text-sm text-gray-600">
                    Terdaftar pada:{" "}
                    {searchResult.created_at
                      ? new Date(searchResult.created_at).toLocaleString(
                          "id-ID"
                        )
                      : "-"}
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${statusStyle(
                    searchResult.status
                  )}`}
                >
                  {statusLabel(searchResult.status)}
                </span>
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {searchResult.status &&
                  searchResult.status.toLowerCase() === "dipanggil"
                    ? "✓ Anda sudah dipanggil. Silakan menuju ruangan yang ditentukan."
                    : searchResult.status &&
                      searchResult.status.toLowerCase() === "selesai"
                    ? "✓ Pemeriksaan Anda sudah selesai. Terima kasih telah berkunjung."
                    : "Anda masih dalam antrian. Tunggu sampai nomor Anda dipanggil."}
                </p>
              </div>

              {/* Doctor and Notes - shown when status is dipanggil or selesai */}
              {(searchResult.status === "dipanggil" ||
                searchResult.status === "selesai") && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="font-medium text-gray-800">
                    Informasi Pemeriksaan
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Dokter yang Merawat
                      </div>
                      <div className="text-gray-900">
                        {searchResult.dokters?.name || "Belum ditentukan"}
                        {searchResult.dokters?.specialization &&
                          ` (${searchResult.dokters.specialization})`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Catatan Medis
                      </div>
                      <div className="text-gray-900">
                        {searchResult.catatan || "Tidak ada catatan"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Queue List Table */}
        <div className="bg-white rounded-xl shadow-lg border-0">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Daftar Antrian Hari Ini
              </h2>
              {!isLoading && (
                <p className="text-sm text-gray-500">
                  Menampilkan {allRegistrations.length} pendaftaran
                </p>
              )}
            </div>
            {isLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading data antrian...</p>
            </div>
          ) : allRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">
                      No. Antrian
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Nama Pasien
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Keluhan
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Poli
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Waktu Daftar
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allRegistrations
                    .sort((a, b) => {
                      const aQueue =
                        typeof a.queue_number === "number"
                          ? a.queue_number
                          : Infinity;
                      const bQueue =
                        typeof b.queue_number === "number"
                          ? b.queue_number
                          : Infinity;
                      if (aQueue !== bQueue) return aQueue - bQueue;
                      const aDate = a.created_at
                        ? new Date(a.created_at).getTime()
                        : 0;
                      const bDate = b.created_at
                        ? new Date(b.created_at).getTime()
                        : 0;
                      return aDate - bDate;
                    })
                    .map((reg) => (
                      <tr
                        key={reg.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {reg.queue_number ?? "-"}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          {reg.full_name}
                        </td>
                        <td className="p-4 text-gray-600">
                          {reg.keluhan || "-"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {reg.polis?.name || "-"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {reg.created_at
                            ? new Date(reg.created_at).toLocaleString("id-ID", {
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle(
                              reg.status
                            )}`}
                          >
                            {statusLabel(reg.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p>Tidak ada antrian hari ini</p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Informasi Penting:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Status antrian diperbarui secara real-time</li>
              <li>
                • Pasien dapat melihat status: Menunggu, Dipanggil, atau Selesai
              </li>
              <li>
                • Harap datang 15 menit sebelum nomor antrian Anda dipanggil
              </li>
              <li>• Untuk pertanyaan lebih lanjut, hubungi bagian informasi</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
