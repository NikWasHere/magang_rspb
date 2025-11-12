import { Doctor, DoctorSchedule, DoctorSpecialization, DayOfWeek } from "@/types"

/**
 * Mock data for doctors - In real app this would come from database
 */
export const mockDoctors: Doctor[] = [
  // Poli Umum
  {
    id: "DOC-001",
    name: "Dr. Ahmad Fadli, Sp.PD",
    specialization: "Poli Umum",
    phone: "081234567001",
    email: "ahmad.fadli@hospital.com",
    photo: "/doctors/doctor-1.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "DOC-002",
    name: "Dr. Siti Nurhaliza, Sp.PD",
    specialization: "Poli Umum",
    phone: "081234567002",
    email: "siti.nurhaliza@hospital.com",
    photo: "/doctors/doctor-2.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli Jantung
  {
    id: "DOC-003",
    name: "Dr. Iqbal Ramadhan, Sp.JP",
    specialization: "Poli Jantung",
    phone: "081234567003",
    email: "iqbal.ramadhan@hospital.com",
    photo: "/doctors/doctor-3.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "DOC-004",
    name: "Dr. Kartika Sari, Sp.JP",
    specialization: "Poli Jantung",
    phone: "081234567004",
    email: "kartika.sari@hospital.com",
    photo: "/doctors/doctor-4.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli Anak
  {
    id: "DOC-005",
    name: "Dr. Ratna Dewi, Sp.A",
    specialization: "Poli Anak",
    phone: "081234567005",
    email: "ratna.dewi@hospital.com",
    photo: "/doctors/doctor-5.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "DOC-006",
    name: "Dr. Bambang Sutrisno, Sp.A",
    specialization: "Poli Anak",
    phone: "081234567006",
    email: "bambang.sutrisno@hospital.com",
    photo: "/doctors/doctor-6.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli Gigi
  {
    id: "DOC-007",
    name: "drg. Maya Anggraini",
    specialization: "Poli Gigi",
    phone: "081234567007",
    email: "maya.anggraini@hospital.com",
    photo: "/doctors/doctor-7.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "DOC-008",
    name: "drg. Rizki Pratama, Sp.KG",
    specialization: "Poli Gigi",
    phone: "081234567008",
    email: "rizki.pratama@hospital.com",
    photo: "/doctors/doctor-8.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli Mata
  {
    id: "DOC-009",
    name: "Dr. Dewi Lestari, Sp.M",
    specialization: "Poli Mata",
    phone: "081234567009",
    email: "dewi.lestari@hospital.com",
    photo: "/doctors/doctor-9.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli THT
  {
    id: "DOC-010",
    name: "Dr. Andi Wijaya, Sp.THT",
    specialization: "Poli THT",
    phone: "081234567010",
    email: "andi.wijaya@hospital.com",
    photo: "/doctors/doctor-10.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli Kandungan
  {
    id: "DOC-011",
    name: "Dr. Linda Permata, Sp.OG",
    specialization: "Poli Kandungan",
    phone: "081234567011",
    email: "linda.permata@hospital.com",
    photo: "/doctors/doctor-11.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Poli Penyakit Dalam
  {
    id: "DOC-012",
    name: "Dr. Budi Santoso, Sp.PD",
    specialization: "Poli Penyakit Dalam",
    phone: "081234567012",
    email: "budi.santoso@hospital.com",
    photo: "/doctors/doctor-12.jpg",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
]

/**
 * Mock data for doctor schedules
 */
export const mockSchedules: DoctorSchedule[] = [
  // Dr. Ahmad Fadli (Poli Umum) - Senin, Rabu, Jumat
  {
    id: "SCH-001",
    doctorId: "DOC-001",
    dayOfWeek: "Senin",
    startTime: "08:00",
    endTime: "12:00",
    quota: 20,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-002",
    doctorId: "DOC-001",
    dayOfWeek: "Rabu",
    startTime: "08:00",
    endTime: "12:00",
    quota: 20,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-003",
    doctorId: "DOC-001",
    dayOfWeek: "Jumat",
    startTime: "08:00",
    endTime: "12:00",
    quota: 20,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Dr. Siti Nurhaliza (Poli Umum) - Selasa, Kamis
  {
    id: "SCH-004",
    doctorId: "DOC-002",
    dayOfWeek: "Selasa",
    startTime: "13:00",
    endTime: "17:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-005",
    doctorId: "DOC-002",
    dayOfWeek: "Kamis",
    startTime: "13:00",
    endTime: "17:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Dr. Iqbal Ramadhan (Poli Jantung) - Senin, Rabu
  {
    id: "SCH-006",
    doctorId: "DOC-003",
    dayOfWeek: "Senin",
    startTime: "08:00",
    endTime: "10:00",
    quota: 10,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-007",
    doctorId: "DOC-003",
    dayOfWeek: "Rabu",
    startTime: "08:00",
    endTime: "10:00",
    quota: 10,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Dr. Kartika Sari (Poli Jantung) - Selasa, Kamis
  {
    id: "SCH-008",
    doctorId: "DOC-004",
    dayOfWeek: "Selasa",
    startTime: "14:00",
    endTime: "16:00",
    quota: 10,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-009",
    doctorId: "DOC-004",
    dayOfWeek: "Kamis",
    startTime: "14:00",
    endTime: "16:00",
    quota: 10,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // Dr. Ratna Dewi (Poli Anak) - Senin-Jumat
  {
    id: "SCH-010",
    doctorId: "DOC-005",
    dayOfWeek: "Senin",
    startTime: "09:00",
    endTime: "13:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-011",
    doctorId: "DOC-005",
    dayOfWeek: "Selasa",
    startTime: "09:00",
    endTime: "13:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-012",
    doctorId: "DOC-005",
    dayOfWeek: "Rabu",
    startTime: "09:00",
    endTime: "13:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-013",
    doctorId: "DOC-005",
    dayOfWeek: "Kamis",
    startTime: "09:00",
    endTime: "13:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-014",
    doctorId: "DOC-005",
    dayOfWeek: "Jumat",
    startTime: "09:00",
    endTime: "13:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  
  // drg. Maya Anggraini (Poli Gigi) - Senin, Rabu, Jumat
  {
    id: "SCH-015",
    doctorId: "DOC-007",
    dayOfWeek: "Senin",
    startTime: "10:00",
    endTime: "14:00",
    quota: 12,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-016",
    doctorId: "DOC-007",
    dayOfWeek: "Rabu",
    startTime: "10:00",
    endTime: "14:00",
    quota: 12,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-017",
    doctorId: "DOC-007",
    dayOfWeek: "Jumat",
    startTime: "10:00",
    endTime: "14:00",
    quota: 12,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
]

/**
 * Helper functions to get doctors and schedules
 */
export function getDoctorById(id: string): Doctor | undefined {
  return mockDoctors.find(d => d.id === id)
}

export function getDoctorsBySpecialization(specialization: DoctorSpecialization): Doctor[] {
  return mockDoctors.filter(d => d.specialization === specialization && d.isActive)
}

export function getSchedulesByDoctorId(doctorId: string): DoctorSchedule[] {
  return mockSchedules.filter(s => s.doctorId === doctorId && s.isActive)
}

export function getScheduleById(id: string): DoctorSchedule | undefined {
  return mockSchedules.find(s => s.id === id)
}

export function getDoctorSchedules(doctorId: string, dayOfWeek: DayOfWeek): DoctorSchedule[] {
  return mockSchedules.filter(
    s => s.doctorId === doctorId && s.dayOfWeek === dayOfWeek && s.isActive
  )
}

export function getAllSpecializations(): DoctorSpecialization[] {
  return Array.from(new Set(mockDoctors.map(d => d.specialization)))
}

/**
 * Get available dates for a doctor (next 30 days, excluding their off days)
 */
export function getAvailableDates(doctorId: string, daysAhead: number = 30): Date[] {
  const schedules = getSchedulesByDoctorId(doctorId)
  const workingDays = schedules.map(s => s.dayOfWeek)
  
  const availableDates: Date[] = []
  const today = new Date()
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayName = getDayName(date)
    if (workingDays.includes(dayName as DayOfWeek)) {
      availableDates.push(date)
    }
  }
  
  return availableDates
}

/**
 * Helper to get day name in Indonesian
 */
function getDayName(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[date.getDay()]
}
