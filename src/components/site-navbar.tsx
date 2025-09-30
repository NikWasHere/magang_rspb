"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export default function SiteNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  // Check if current page is auth page (login, register, forgot-password)
  const isAuthPage = pathname === '/login' || pathname === '/daftar' || pathname === '/buat-akun' || pathname === '/forgot-password'

  // Navigation links based on user role
  const getNavigationLinks = () => {
    const baseLinks = [
      { href: "/", label: "Home" },
      { href: "/daftar", label: "Daftar" },
    ]

    if (user) {
      if (user.role === "admin") {
        return [
          ...baseLinks,
          { href: "/admin", label: "Dashboard Admin" },
          { href: "/history", label: "History" },
          { href: "/cek-status", label: "Cek Status" },
        ]
      } else {
        return [
          ...baseLinks,
          { href: "/history", label: "History" },
          { href: "/cek-status", label: "Cek Status" },
        ]
      }
    }

    return [
      ...baseLinks,
      { href: "/accounts", label: "Demo Accounts" },
      { href: "/history", label: "History" },
      { href: "/cek-status", label: "Cek Status" },
    ]
  }

  const links = getNavigationLinks()
  
  return (
    <header className={cn(
      "absolute top-0 left-0 right-0 z-40 w-full",
      isAuthPage 
        ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg" 
        : "sticky bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm"
    )}>
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

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                </div>
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 font-medium px-4"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button 
                asChild 
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 font-medium px-6"
              >
                <Link href="/buat-akun">Buat Akun</Link>
              </Button>
              <Button 
                asChild 
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
              >
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
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
      <div className={cn(
        "md:hidden border-t",
        isAuthPage 
          ? "bg-white/98 backdrop-blur-lg border-gray-200/50" 
          : "bg-white/95 backdrop-blur"
      )}>
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
          <div className="border-t pt-2 mt-2 space-y-2">
            {user ? (
              <>
                <div className="py-2">
                  <div className="text-sm font-medium text-gray-800">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/buat-akun"
                  className="block text-sm font-medium text-green-600 hover:text-green-700 transition-colors py-2"
                >
                  Buat Akun
                </Link>
                <Link
                  href="/login"
                  className="block text-sm font-medium text-green-600 hover:text-green-700 transition-colors py-2"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
