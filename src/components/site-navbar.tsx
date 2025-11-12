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
      { href: "/jadwal", label: "Jadwal Dokter" },
    ]

    // Show loading state during SSR or while auth is loading
    if (!isMounted || isLoading) {
      return [
        ...baseLinks,
        { href: "/accounts", label: "Demo Accounts" },
      ]
    }

    // Anonymous user (not logged in) - can only view schedule
    if (!user) {
      return [
        ...baseLinks,
        { href: "/accounts", label: "Demo Accounts" },
      ]
    }

    // Patient role
    if (user.role === "patient") {
      return [
        ...baseLinks,
        { href: "/patient/reservasi", label: "Reservasi Online" },
        { href: "/patient/dashboard", label: "Dashboard Saya" },
        { href: "/patient/chat", label: "Chat Admin" },
      ]
    }

    // Admin role
    if (user.role === "admin") {
      return [
        ...baseLinks,
        { href: "/admin/dashboard", label: "Dashboard Admin" },
      ]
    }

    // Super Admin role
    if (user.role === "superadmin") {
      return [
        ...baseLinks,
        { href: "/superadmin", label: "Dashboard Super Admin" },
      ]
    }

    // Default fallback
    return baseLinks
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
                {/* Admin & Super Admin Quick Access Dropdown */}
                {(user.role === "admin" || user.role === "superadmin") && (
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
                      {user.role === "superadmin" ? "Super Admin" : "Admin"}
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
                            href="/admin/verifikasi-pasien" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verifikasi Pasien
                          </Link>
                          <Link 
                            href="/admin/jadwal-dokter" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Jadwal Dokter
                          </Link>
                          <Link 
                            href="/admin/kelola-antrian" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Kelola Antrian
                          </Link>
                          <Link 
                            href="/admin/validasi-asuransi" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Validasi Asuransi
                          </Link>
                          <Link 
                            href="/admin/chat" 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat Pasien
                          </Link>
                          
                          {user.role === "superadmin" && (
                            <>
                              <div className="border-t border-gray-100 my-2"></div>
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Super Admin
                              </div>
                              <Link 
                                href="/superadmin/kelola-admin" 
                                className="flex items-center px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 hover:text-purple-800 rounded-md transition-colors"
                                onClick={() => setShowAdminDropdown(false)}
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Kelola Admin
                              </Link>
                              <Link 
                                href="/superadmin/settings" 
                                className="flex items-center px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 hover:text-purple-800 rounded-md transition-colors"
                                onClick={() => setShowAdminDropdown(false)}
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                System Settings
                              </Link>
                            </>
                          )}
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
                <Link href="/register-patient">Daftar Pasien</Link>
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
                  href="/register-patient"
                  className="block text-sm font-medium text-green-600 hover:text-green-700 transition-colors py-2"
                >
                  Daftar Pasien
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
