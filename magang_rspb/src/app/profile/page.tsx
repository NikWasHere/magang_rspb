"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type UserItem = {
  id: number
  name?: string | null
  email: string
  phone?: string | null
  address?: string | null
  username?: string | null
  image?: string | null
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return setLoading(false)
    const fetchProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/users/${user.id}`)
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="mb-4">Anda belum login.</p>
            <Button asChild>
              <Link href="/login">Login</Link>
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
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                      {profile.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.image} alt={profile.name ? `${profile.name} avatar` : (profile.username ? `${profile.username} avatar` : 'avatar')} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                      )}
                    </div>
                  <div>
                    <h3 className="text-lg font-medium">{profile.name || '—'}</h3>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    <p className="text-sm text-gray-600">{profile.username || ''}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Contact</h4>
                  <p className="text-sm text-gray-700">Phone: {profile.phone || '-'}</p>
                  <p className="text-sm text-gray-700">Address: {profile.address || '-'}</p>
                </div>

                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div>Tidak dapat memuat profil.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
