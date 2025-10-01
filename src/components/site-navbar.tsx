"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect, useRef } from "react"

export default function SiteNavbar() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()
  const [showAdminDropdown, setShowAdminDropdown] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Check if current page is auth page (login, register, forgot-password)
  const isAuthPage = pathname === '/login' || pathname === '/daftar' || pathname === '/buat-akun' || pathname === '/forgot-password'

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close dropdown when clicking outside - ALWAYS call this hook
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAdminDropdown(false)
      }
    }
    
    if (showAdminDropdown && isMounted) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showAdminDropdown, isMounted])

  // Prevent hydration mismatch by showing consistent initial state
  if (!isMounted) {
    return (
      <header className={cn(
        "absolute top-0 left-0 right-0 z-40 w-full",
        isAuthPage 
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg" 
          : "sticky bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm"
      )}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
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
          </Link>

          {/* Loading Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Daftar", "Our Doctors", "Demo Accounts", "History", "Cek Status"].map((label, index) => (
              <div key={index} className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </nav>

          {/* Loading User Actions */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  // Navigation links based on user role
  const getNavigationLinks = () => {
    const baseLinks = [
      { href: "/", label: "Home" },
      { href: "/daftar", label: "Daftar" },
      { href: "/doctors", label: "Our Doctors" },
    ]

    // Show loading state during SSR or while auth is loading
    if (!isMounted || isLoading) {
      return [
        ...baseLinks,
        { href: "/accounts", label: "Demo Accounts" },
        { href: "/history", label: "History" },
        { href: "/cek-status", label: "Cek Status" },
      ]
    }

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
        <nav className="hidden md:flex items-center gap-8" suppressHydrationWarning>
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
        <div className="flex items-center gap-3" suppressHydrationWarning>
          {!isMounted || isLoading ? (
            // Loading state to prevent hydration mismatch
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3">
                {/* Admin Quick Access */}
                {user.role === "admin" && (
                  <div className="relative" ref={dropdownRef} suppressHydrationWarning>
                    <Button
                      onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin
                      <svg className={`w-4 h-4 transition-transform ${showAdminDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                    
                    {showAdminDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-2">
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Management
                          </div>
                          <Link 
                            href="/admin/doctors" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Kelola Dokter
                          </Link>
                          <Link 
                            href="/admin/patients" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Kelola Pasien
                          </Link>
                          <Link 
                            href="/admin/appointments" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                            </svg>
                            Kelola Janji Temu
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                          <Link 
                            href="/admin/doctors/add" 
                            className="flex items-center px-3 py-2 text-sm text-green-700 hover:bg-green-50 hover:text-green-800 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Dokter
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
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
        <nav className="flex flex-col gap-2 p-4" suppressHydrationWarning>
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
          <div className="border-t pt-2 mt-2 space-y-2" suppressHydrationWarning>
            {!isMounted || isLoading ? (
              // Loading state for mobile
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
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
