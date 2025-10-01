"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"

export default function UserStatusBanner() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Card className="mb-6 border-l-4 border-l-green-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">
              Selamat datang, {user.name}!
            </p>
            <p className="text-sm text-gray-600">
              Anda login sebagai {user.role === "admin" ? "Administrator" : "Pasien"}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.role === "admin" 
              ? "bg-red-100 text-red-800" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {user.role === "admin" ? "Admin Access" : "User Access"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}