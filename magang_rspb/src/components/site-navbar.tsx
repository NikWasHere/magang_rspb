"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useRef, useEffect } from 'react'

export default function SiteNavbar() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()
  // while auth state is loading, treat user as null to keep server/client HTML consistent
  const effectiveUser = isLoading ? null : user
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (!(e.target instanceof Node)) return
      if (!menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])
  
  // Check if current page is auth page (login, register, forgot-password)
  const isAuthPage = pathname === '/login' || pathname === '/daftar' || pathname === '/buat-akun' || pathname === '/forgot-password'

  // Navigation links based on user role
  const getNavigationLinks = () => {
    const baseLinks = [
      { href: "/", label: "Home" },
      { href: "/daftar", label: "Daftar" },
    ]

    if (effectiveUser) {
      if (effectiveUser.role === "admin") {
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
          {effectiveUser ? (
            <>
              <div className="flex items-center gap-3">
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} className="inline-flex items-center gap-3 focus:outline-none">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {effectiveUser.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={effectiveUser.image} alt={`${effectiveUser.name || 'User'}'s avatar`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-gray-600">{(effectiveUser.name || '').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</span>
                      )}
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <div>
                        <div className="font-medium text-gray-800">{effectiveUser.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{effectiveUser.role}</div>
                      </div>
                      <svg className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md py-1 z-50">
                      <Link href="/profile/edit" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit Profile</Link>
                      <button onClick={() => { setMenuOpen(false); logout() }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                    </div>
                  )}
                </div>
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={`${user.name || 'User'}'s avatar`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-gray-600">{(user.name || '').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <button onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} className="block text-sm font-medium text-gray-800 flex items-center gap-2">{user.name}
                        <svg className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  {menuOpen && (
                    <div className="mt-2 space-y-1">
                      <Link href="/profile/edit" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit Profile</Link>
                      <button onClick={() => { setMenuOpen(false); logout() }} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                    </div>
                  )}
                </div>
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
