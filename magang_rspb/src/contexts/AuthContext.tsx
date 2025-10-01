"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  image?: string | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// NOTE: Auth now talks to the backend API. Backend endpoint: POST {NEXT_PUBLIC_API_URL}/login
// Expected request body: { email, password }
// Expected response: { message, user }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        setIsLoading(false)
        return false
      }

      const data = await res.json()
      const u = data.user
      const userData: User = {
        id: String(u.id),
        email: u.email,
        name: u.name || '',
        role: (u.role === 'admin' || u.role === 'dokter') ? 'admin' : 'user',
        image: u.image || null,
      }
      setUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('login error', err)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}