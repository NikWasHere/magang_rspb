"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CardFooter } from "@/components/ui/card";

interface Dokter {
  id: number;
  nama: string;
  spesialisasi: string;
  telepon?: string;
  photoUrl?: string;
  poli?: {
    id: number;
    nama: string;
  };
}

export default function DoktersPage() {
  const router = useRouter();
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPoli, setFilterPoli] = useState("");
  const [poliList, setPoliList] = useState<{ id: number; nama: string }[]>([]);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchDokters = async () => {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${baseUrl.replace(/\/$/, "")}/dokters`);
        if (res.ok) {
          const data = await res.json();
          setDokters(data);

          // Extract unique polis with id
          const poliMap = new Map<number, string>();
          data.forEach((d: Dokter) => {
            if (d.poli?.id && d.poli?.nama) {
              poliMap.set(d.poli.id, d.poli.nama);
            }
          });
          const polis = Array.from(poliMap.entries()).map(([id, nama]) => ({
            id,
            nama,
          }));
          setPoliList(polis);
        }
      } catch (err) {
        console.error("Error fetching dokters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDokters();
  }, []);

  // Filter dokters
  const filteredDokters = dokters.filter((dokter) => {
    const matchesSearch = dokter.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = !filterPoli || String(dokter.poli?.id) === filterPoli;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: dokters.length,
    byPoli: poliList.map((p) => ({
      ...p,
      count: dokters.filter((d) => d.poli?.id === p.id).length,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-0 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Daftar Dokter
                </h1>
                <p className="text-gray-600">
                  Pilih dokter spesialis sesuai kebutuhan Anda
                </p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Kembali ke Home
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-800">Total Dokter</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.byPoli.length}
                </div>
                <div className="text-sm text-green-800">Total Poli</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg border-0 mb-6 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Cari Dokter
              </label>
              <Input
                placeholder="Nama dokter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filter Poli
              </label>
              <select
                value={filterPoli}
                onChange={(e) => setFilterPoli(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500"
              >
                <option value="">Semua Poli</option>
                {poliList.map((poli) => (
                  <option key={poli.id} value={String(poli.id)}>
                    {poli.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dokter List */}
        <div className="bg-white rounded-xl shadow-lg border-0">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Daftar Dokter
              </h2>
              {!loading && (
                <p className="text-sm text-gray-500">
                  Menampilkan {filteredDokters.length} dari {dokters.length} dokter
                </p>
              )}
            </div>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading dokter...</p>
            </div>
          ) : filteredDokters.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">Foto</th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Nama Dokter
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">Poli</th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Telepon
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDokters.map((dokter) => (
                    <tr
                      key={dokter.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {/* Foto */}
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                          {dokter.photoUrl && !failedImages.has(dokter.id) ? (
                            <Image
                              src={
                                dokter.photoUrl.startsWith("/")
                                  ? `http://localhost:3001${dokter.photoUrl}`
                                  : dokter.photoUrl
                              }
                              alt={dokter.nama}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                              onError={() => {
                                setFailedImages((prev) =>
                                  new Set(prev).add(dokter.id)
                                );
                              }}
                            />
                          ) : (
                            <div className="text-xs font-bold text-blue-600">
                              {dokter.nama
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word.charAt(0).toUpperCase())
                                .join("")}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nama */}
                      <td className="p-4 font-medium text-gray-800">
                        {dokter.nama}
                      </td>

                      {/* Poli */}
                      <td className="p-4 text-gray-600">
                        {dokter.poli?.nama || "-"}
                      </td>

                      {/* Telepon */}
                      <td className="p-4 text-gray-600">
                        {dokter.telepon || "-"}
                      </td>

                      {/* Aksi */}
                      <td className="p-4">
                        <Link
                          href={`/dokters/${dokter.id}`}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Lihat Detail
                        </Link>
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
              <p>Tidak ada dokter ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
