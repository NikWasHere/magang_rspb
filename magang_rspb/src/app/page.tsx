"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const images = [
  {
    src: "/Lobby.jpg",
    alt: "Lobby Rumah Sakit - Ruang tunggu yang nyaman dan modern"
  },
  {
    src: "/Lobby2.jpg",
    alt: "Fasilitas Medis Modern - Peralatan medis terkini"
  },
  {
    src: "/Lobby3.jpg", 
    alt: "Pelayanan Kesehatan Terpercaya - Tim medis profesional"
  }
  // Anda bisa menambahkan lebih banyak gambar di sini
]

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // 5000ms = 5 detik

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return (
    <div className="bg-gray-50">{/* Menggunakan bg-gray-50 untuk konsistensi */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-16 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-pretty text-4xl font-bold leading-tight md:text-5xl">Ayo lakukan pendaftran online</h1>
          <p className="mt-4 text-muted-foreground">Cukup dengan klik ini</p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/daftar"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/accounts"
              className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Demo Accounts
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
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setCurrentImageIndex(
                currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
              )}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-300"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentImageIndex(
                currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
              )}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-300"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Hidden design reference images to keep assets referenced in code */}
      <div className="hidden">
        <img src="/images/ref-hero.png" alt="reference hero" />
        <img src="/images/ref-register.png" alt="reference register" />
        <img src="/images/ref-register-success.png" alt="reference register success" />
        <img src="/images/ref-dashboard.png" alt="reference dashboard" />
        <img src="/images/ref-login-required.png" alt="reference login required" />
      </div>
    </div>
  )
}
