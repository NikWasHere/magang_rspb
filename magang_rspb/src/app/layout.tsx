import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import SiteNavbar from "@/components/site-navbar"
import SiteFooter from "@/components/site-footer"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "IHC Hospital - Pelayanan Kesehatan Terpercaya",
  description: "IHC Hospital menyediakan layanan kesehatan terpercaya dengan fasilitas modern dan tenaga medis profesional. Daftar online sekarang!",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <SiteNavbar />
            <main className="min-h-screen">
              {children}
            </main>
            <SiteFooter />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
