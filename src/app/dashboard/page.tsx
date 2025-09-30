"use client"

import SiteNavbar from "@/components/site-navbar"
import Sidebar from "@/components/dashboard/sidebar"
import PatientModal from "@/components/dashboard/patient-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export default function DashboardPage() {
  const [open, setOpen] = useState(true)

  return (
    <main className="min-h-screen bg-[oklch(0.97_0_0)]">
      <SiteNavbar />
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <Sidebar />
        <Card className="rounded-2xl border-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pasien</h2>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Tambah</Button>
            </div>
            <div className="mt-4 h-64 rounded-xl bg-muted" />
          </CardContent>
        </Card>
      </section>

      {open && <PatientModal />}
    </main>
  )
}
