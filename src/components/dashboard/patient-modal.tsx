"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function PatientModal() {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/20 p-6">
      <Card className="w-full max-w-5xl rounded-2xl border-none bg-muted shadow">
        <CardContent className="p-10">
          <div className="mb-6 grid place-items-center">
            <div className="grid place-items-center">
              <Image
                src={"/placeholder.svg?height=64&width=64&query=headshot"}
                alt="Foto Pasien"
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="mt-2 text-xs text-green-600">Lihat</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <Input defaultValue="Niko Afandi Saputro" />
            </div>

            <div className="grid gap-2">
              <Label>KTP</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="KTP_Niko.jpg" />
                <Button variant="secondary" className="text-xs">
                  Lihat
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>No KTP</Label>
              <Input defaultValue="640000000001" />
            </div>

            <div className="grid gap-2">
              <Label>KK</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="KK_Niko.jpg" />
                <Button variant="secondary" className="text-xs">
                  Lihat
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>No KK</Label>
              <Input defaultValue="640000200101" />
            </div>

            <div className="grid gap-2">
              <Label>Dokumen Tambahan (Opsional)</Label>
              <Input defaultValue="Tidak ada dokumen tambahan" />
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button className="h-11 w-40 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
