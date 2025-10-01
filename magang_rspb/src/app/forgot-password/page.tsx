"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password submission here
    console.log("Reset password for:", email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 p-4 pt-20">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Terkirim!</h1>
            <p className="text-gray-600 mb-6">
              Kami telah mengirimkan instruksi reset password ke email <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Silakan periksa kotak masuk dan folder spam Anda.
            </p>

            <Link href="/login">
              <Button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200">
                Kembali ke Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-0">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Lupa Password?</h1>
            <p className="text-gray-600 text-sm">
              Masukkan email Anda untuk menerima instruksi reset password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email:
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contoh@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 transition-all duration-200"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Kirim Instruksi Reset
            </Button>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link 
                href="/login" 
                className="text-green-600 font-medium hover:underline text-sm"
              >
                ← Kembali ke Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}