"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Add styles for scrollbar hiding
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const images = [
  {
    src: "/Lobby.jpg",
    alt: "Lobby Rumah Sakit - Ruang tunggu yang nyaman dan modern",
  },
  {
    src: "/Lobby2.jpg",
    alt: "Fasilitas Medis Modern - Peralatan medis terkini",
  },
  {
    src: "/Lobby3.jpg",
    alt: "Pelayanan Kesehatan Terpercaya - Tim medis profesional",
  },
];

interface Dokter {
  id: number;
  name: string;
  specialization: string;
  photoUrl?: string;
  poli?: { name: string };
}

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fetch dokter list
  useEffect(() => {
    const fetchDokters = async () => {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${baseUrl.replace(/\/$/, "")}/dokters`);
        if (res.ok) {
          const data = await res.json();
          // Filter dokters with photos and limit to 10 for carousel
          const doktorsWithPhotos = data
            .filter(
              (d: Dokter) => d.photoUrl && d.photoUrl.startsWith("/uploads")
            )
            .slice(0, 10);
          setDokters(doktorsWithPhotos);
        }
      } catch (err) {
        console.error("Error fetching dokters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDokters();
  }, []);

  return (
    <>
      <style>{scrollbarHideStyle}</style>
      <div className="bg-gray-50">
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-16 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-pretty text-4xl font-bold leading-tight md:text-5xl">
              Ayo lakukan pendaftran online
            </h1>
            <p className="mt-4 text-muted-foreground">Cukup dengan klik ini</p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/daftar"
                className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>

          <div className="grid place-items-center">
            <div className="relative w-full max-w-[480px] h-[360px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                width={480}
                height={360}
                className="h-full w-full object-cover transition-opacity duration-500"
                priority
              />

              {/* Indicator dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === 0
                      ? images.length - 1
                      : currentImageIndex - 1
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-300"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === images.length - 1
                      ? 0
                      : currentImageIndex + 1
                  )
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-300"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Daftar Dokter Section */}
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Daftar Dokter Kami
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tim medis profesional siap melayani Anda
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Loading dokter...</p>
            </div>
          ) : dokters.length > 0 ? (
            <>
              {/* Carousel */}
              <div className="relative mb-8">
                {/* Scroll Container */}
                <div
                  ref={carouselRef}
                  className="overflow-x-auto pb-4 scrollbar-hide"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="flex gap-6 min-w-full">
                    {dokters.map((dokter) => (
                      <div key={dokter.id} className="flex-shrink-0 w-80">
                        <Card className="hover:shadow-lg transition-shadow h-full overflow-hidden flex flex-col">
                          {/* Photo */}
                          <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {dokter.photoUrl ? (
                              <Image
                                src={
                                  dokter.photoUrl.startsWith("/")
                                    ? `http://localhost:3001${dokter.photoUrl}`
                                    : dokter.photoUrl
                                }
                                alt={`Foto dokter ${dokter.name || "Unknown"}`}
                                fill
                                className="object-cover object-top"
                                unoptimized
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <div className="text-center">
                                  <div className="text-5xl font-bold text-blue-600 mb-2">
                                    {(dokter.name || "")
                                      .split(" ")
                                      .slice(0, 2)
                                      .map((word) =>
                                        word.charAt(0).toUpperCase()
                                      )
                                      .join("")}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {dokter.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 flex-grow">
                            {dokter.poli && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Poli
                                </p>
                                <p className="text-sm">{dokter.poli.name}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll Buttons */}
                <button
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollLeft -= 400;
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Scroll left"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollLeft += 400;
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Scroll right"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-8 text-center">
                <Button asChild>
                  <Link href="/dokters">Lihat Semua Dokter</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada dokter tersedia</p>
            </div>
          )}
        </section>

        {/* Hidden design reference images to keep assets referenced in code */}
        <div className="hidden">
          <img src="/images/ref-hero.png" alt="reference hero" />
          <img src="/images/ref-register.png" alt="reference register" />
          <img
            src="/images/ref-register-success.png"
            alt="reference register success"
          />
          <img src="/images/ref-dashboard.png" alt="reference dashboard" />
          <img
            src="/images/ref-login-required.png"
            alt="reference login required"
          />
        </div>
      </div>
    </>
  );
}
