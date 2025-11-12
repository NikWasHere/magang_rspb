"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { User, UserRole, PatientProfile } from "@/types"

interface AuthUser extends User {
  patientProfile?: PatientProfile // for patients who have registered
  hasCompletedProfile: boolean // true if patient filled registration form
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
  updateProfile: (profile: Partial<PatientProfile>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users - in real app this would come from database
const mockUsers = [
  // Super Admin accounts
  {
    id: "1",
    email: "superadmin@test.com", 
    password: "super123",
    name: "Super Administrator",
    role: "superadmin" as UserRole,
    hasCompletedProfile: true
  },
  {
    id: "2",
    email: "superadmin@hospital.com", 
    password: "super123",
    name: "Super Admin Hospital",
    role: "superadmin" as UserRole,
    hasCompletedProfile: true
  },
  
  // Admin accounts
  {
    id: "3",
    email: "admin@test.com",
    password: "admin123", 
    name: "Admin IHC",
    role: "admin" as UserRole,
    hasCompletedProfile: true
  },
  {
    id: "4",
    email: "admin@hospital.com",
    password: "admin123", 
    name: "Admin Loket",
    role: "admin" as UserRole,
    hasCompletedProfile: true
  },
  {
    id: "5",
    email: "admin@rspb.com",
    password: "admin123",
    name: "Admin RSPB",
    role: "admin" as UserRole,
    hasCompletedProfile: true
  },
  {
    id: "6",
    email: "dokter@rspb.com",
    password: "dokter123",
    name: "Dr. Dokter RSPB",
    role: "admin" as UserRole,
    hasCompletedProfile: true
  },
  
  // Patient accounts
  {
    id: "7",
    email: "patient@test.com",
    password: "password123",
    name: "Pasien Test", 
    role: "patient" as UserRole,
    hasCompletedProfile: false // belum isi form lengkap
  },
  {
    id: "8",
    email: "patient@hospital.com",
    password: "patient123",
    name: "John Doe", 
    role: "patient" as UserRole,
    hasCompletedProfile: true
  },
  {
    id: "9",
    email: "user@rspb.com",
    password: "user123",
    name: "User RSPB",
    role: "patient" as UserRole,
    hasCompletedProfile: false
  },
  {
    id: "10",
    email: "pasien@rspb.com",
    password: "pasien123",
    name: "Pasien RSPB",
    role: "patient" as UserRole,
    hasCompletedProfile: true
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize mock reservations data (only once)
    if (typeof window !== 'undefined') {
      const { initializeMockReservations } = require('@/services/queueService')
      const hasInitialized = sessionStorage.getItem('mockDataInitialized')
      
      if (!hasInitialized) {
        // Call async function
        initializeMockReservations().then(() => {
          sessionStorage.setItem('mockDataInitialized', 'true')
          console.log('✅ Mock reservations data loaded!')
        }).catch((err: Error) => {
          console.error('❌ Failed to load mock data:', err)
        })
      }
    }

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
      const userData: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        createdAt: new Date(),
        hasCompletedProfile: foundUser.hasCompletedProfile
      }
      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === email)) {
      setIsLoading(false)
      return false
    }
    
    // Create new patient account
    const newUser: AuthUser = {
      id: `patient-${Date.now()}`,
      email,
      name,
      role: 'patient',
      createdAt: new Date(),
      hasCompletedProfile: false // belum isi form lengkap
    }
    
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const updateProfile = async (profile: Partial<PatientProfile>): Promise<boolean> => {
    if (!user || user.role !== 'patient') return false
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user with completed profile
    const updatedUser: AuthUser = {
      ...user,
      hasCompletedProfile: true,
      patientProfile: profile as PatientProfile
    }
    
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, isLoading }}>
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