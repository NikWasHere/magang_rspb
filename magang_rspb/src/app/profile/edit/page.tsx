"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', address: '', username: '', image: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return setLoading(false)
    const fetchProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/users/${user.id}`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          username: data.username || '',
          image: data.image || ''
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      // Prepare payload but avoid sending large data-URL images (they exceed DB varchar(255))
      const payload: any = { ...form }
      const isDataUrl = typeof payload.image === 'string' && payload.image.startsWith('data:')
      if (isDataUrl) {
        // remove image so Prisma won't attempt to write an oversized string
        delete payload.image
      }

      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to update')
      // success
      router.push('/profile')
      if (isDataUrl) {
        // Inform user the image preview wasn't uploaded; recommend server-side upload
        // Keep this non-blocking — profile fields were saved
        alert('Profil disimpan. Catatan: gambar tidak diunggah karena ukuran/format pratinjau lokal. Saya bisa menambahkan upload server-side untuk menyimpan foto.')
      }
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="mb-4">Anda belum login.</p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="mx-auto max-w-3xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {/* Centered avatar upload like daftar-online */}
                <div className="flex justify-center mb-6">
                  <label htmlFor="image-upload" className="group relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer flex items-center justify-center">
                    {form.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image} alt={form.name ? `${form.name} avatar` : `${form.username || 'avatar'}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                    )}
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          const result = reader.result as string | ArrayBuffer | null
                          if (typeof result === 'string') {
                            setForm(prev => ({ ...prev, image: result }))
                          }
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                </div>
                <div className="text-center mt-2 text-sm text-green-600">Edit Foto Profile</div>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={form.username} onChange={handleChange} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
