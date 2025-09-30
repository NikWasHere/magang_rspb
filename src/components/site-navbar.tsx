"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/daftar", label: "Daftar" },
  { href: "/history", label: "History" },
  { href: "/cek-status", label: "Cek Status" },
  { href: "/dashboard", label: "Dashboard" },
]

export default function SiteNavbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary" aria-hidden />
          <span className="text-xl font-semibold tracking-tight">IHC</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.slice(0, 4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                pathname === l.href && "text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
