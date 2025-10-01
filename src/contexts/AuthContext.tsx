"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users - in real app this would come from database
const mockUsers = [
  {
    id: "1",
    email: "admin@rspb.com", 
    password: "admin123",
    name: "Administrator Utama",
    role: "admin" as const
  },
  {
    id: "2",
    email: "user@rspb.com",
    password: "user123", 
    name: "John Doe",
    role: "user" as const
  },
  {
    id: "3",
    email: "dokter@rspb.com",
    password: "dokter123",
    name: "Dr. Ahmad Fadil",
    role: "admin" as const
  },
  {
    id: "4",
    email: "pasien@rspb.com",
    password: "pasien123",
    name: "Jane Doe", 
    role: "user" as const
  },
  {
    id: "5",
    email: "superadmin@rspb.com",
    password: "super123",
    name: "Super Administrator",
    role: "admin" as const
  },
  {
    id: "6",
    email: "admin.sistem@rspb.com",
    password: "sistem123",
    name: "Admin Sistem",
    role: "admin" as const
  },
  {
    id: "7",
    email: "kepala.rs@rspb.com",
    password: "kepala123",
    name: "Kepala Rumah Sakit",
    role: "admin" as const
  },
  {
    id: "8",
    email: "manager@rspb.com",
    password: "manager123",
    name: "Manager Operasional",
    role: "admin" as const
  }
]

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      }
      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
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