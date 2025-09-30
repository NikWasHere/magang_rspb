"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ToastBanner from "./toast-banner"
import { cn } from "@/lib/utils"

export default function RegisterForm() {
  const [openSuccess, setOpenSuccess] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOpenSuccess(true)
  }

  return (
    <>
      <ToastBanner
        open={openSuccess}
        title="Pendaftaran berhasil"
        description="No Antrian anda : 001"
        primaryAction={{ label: "Cek Status", onClick: () => setOpenSuccess(false) }}
      />
      <Card className="mx-auto w-full max-w-5xl border-none bg-card shadow-sm">
        <CardContent className="p-8">
          <div className="mb-6 grid place-items-center">
            <div className="grid place-items-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                <span className="text-muted-foreground">📷</span>
              </div>
              <button type="button" className="mt-2 text-sm text-green-600 hover:underline">
                Upload Foto Diri
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" placeholder="Enter your full name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keluhan">Keluhan</Label>
              <Input id="keluhan" placeholder="Enter your complain" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ktp">No KTP</Label>
              <Input id="ktp" placeholder="Enter your KTP number" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="upload-ktp">Upload KTP</Label>
              <div className="flex items-center gap-2">
                <Input id="upload-ktp" placeholder="Upload Kartu Tanda Penduduk" />
                <Button type="button" variant="secondary" className="text-xs">
                  Select file
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kk">No KK</Label>
              <Input id="kk" placeholder="Enter your KK Number" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="upload-kk">Upload KK</Label>
              <div className="flex items-center gap-2">
                <Input id="upload-kk" placeholder="Upload Kartu Keluarga" />
                <Button type="button" variant="secondary" className="text-xs">
                  Select file
                </Button>
              </div>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="dok">Dokumen Tambahan (Opsional)</Label>
              <div className="flex items-center gap-2">
                <Input id="dok" placeholder="Upload Dokumen Tambahan" />
                <Button type="button" variant="secondary" className="text-xs">
                  Select file
                </Button>
              </div>
            </div>

            <div className={cn("md:col-span-2 flex justify-center pt-4")}>
              <Button
                type="submit"
                className="h-11 w-40 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Daftar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
