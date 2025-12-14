"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface JadwalDokter {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface Dokter {
  id: number;
  nama: string;
  spesialisasi: string;
  telepon?: string;
  email?: string;
  photoUrl?: string;
  poli?: {
    id: number;
    nama: string;
  };
  jadwal?: JadwalDokter[];
}

export default function DokterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dokter, setDokter] = useState<Dokter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    const fetchDokter = async () => {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        // Fetch from detail endpoint
        const detailRes = await fetch(
          `${baseUrl.replace(/\/$/, "")}/dokters/${id}`
        );
        if (detailRes.ok) {
          const detailData = await detailRes.json();

          // Also fetch from list endpoint to get photoUrl
          const listRes = await fetch(`${baseUrl.replace(/\/$/, "")}/dokters`);
          if (listRes.ok) {
            const listData = await listRes.json();
            const dokterWithPhoto = listData.find(
              (d: any) => d.id === parseInt(id)
            );
            if (dokterWithPhoto?.photoUrl) {
              detailData.photoUrl = dokterWithPhoto.photoUrl;
            }
          }

          setDokter(detailData);
        } else {
          setError("Dokter tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching dokter:", err);
        setError("Gagal memuat data dokter");
      } finally {
        setLoading(false);
      }
    };
    fetchDokter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !dokter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button asChild>
              <Link href="/dokters">Kembali ke Daftar Dokter</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-24">
        {/* Header */}
        <Link
          href="/dokters"
          className="text-sm text-green-600 hover:text-green-700 mb-4 inline-block"
        >
          ← Kembali ke Daftar Dokter
        </Link>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Photo Sidebar */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden top-20">
              <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                {dokter.photoUrl && imageLoaded ? (
                  <Image
                    src={
                      dokter.photoUrl.startsWith("/")
                        ? `http://localhost:3001${dokter.photoUrl}`
                        : dokter.photoUrl
                    }
                    alt={`Foto dokter ${dokter.nama}`}
                    fill
                    className="object-cover object-top"
                    unoptimized
                    onError={() => setImageLoaded(false)}
                  />
                ) : null}
                {(!dokter.photoUrl || !imageLoaded) && (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-blue-600">
                        {(dokter.nama || "")
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word.charAt(0).toUpperCase())
                          .join("")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Dokter Info */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{dokter.nama}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Poli */}
                {dokter.poli && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Poli
                    </p>
                    <p className="text-lg">{dokter.poli.nama}</p>
                  </div>
                )}

                {/* Kontak */}
                <div className="border-t pt-6">
                  <p className="text-sm font-medium mb-4">Informasi Kontak</p>
                  <div className="space-y-2">
                    {dokter.telepon && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-600">Telepon:</span>
                        <span>{dokter.telepon}</span>
                      </div>
                    )}
                    {dokter.email && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-600">Email:</span>
                        <span>{dokter.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Jadwal */}
                {dokter.jadwal && dokter.jadwal.length > 0 && (
                  <div className="border-t pt-6">
                    <p className="text-sm font-medium mb-4">Jadwal Praktik</p>
                    <div className="space-y-2">
                      {dokter.jadwal.map((j, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <span className="font-medium">{j.hari}</span>
                          <span className="text-gray-600">
                            {j.jam_mulai} - {j.jam_selesai}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Action */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Buat Janji</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Link href={`/daftar?dokter=${dokter.id}`}>
                    Daftar Sekarang
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dokters">Lihat Dokter Lain</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Silakan mendaftar untuk membuat janji dengan dokter ini. Anda
                  dapat memilih tanggal dan waktu yang sesuai dengan jadwal
                  Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
