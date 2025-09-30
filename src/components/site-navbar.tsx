"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/daftar", label: "Daftar" },
  { href: "/history", label: "History" },
  { href: "/cek-status", label: "Cek Status" },
]

export default function SiteNavbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo di sebelah kiri */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-20 w-20 flex items-center justify-center">
            <Image
              src="/IHC.svg"
              alt="IHC Logo"
              width={100}
              height={100}
              className="h-40 w-40"
            />
          </div>
          {/* <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900">IHC</span>
            <span className="text-xs text-gray-500">Hospital</span>
          </div> */}
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative",
                pathname === link.href && "text-gray-900"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-3">
          <Button 
            asChild 
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Hidden by default, you can add state management later */}
      <div className="md:hidden border-t bg-white/95 backdrop-blur">
        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2",
                pathname === link.href && "text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
