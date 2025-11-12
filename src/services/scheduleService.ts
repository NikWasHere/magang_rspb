import { DoctorSchedule } from "@/types"

// Mock doctor schedules data
let schedules: DoctorSchedule[] = [
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
    doctorId: "DOC-002",
    dayOfWeek: "Selasa",
    startTime: "09:00",
    endTime: "14:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-004",
    doctorId: "DOC-002",
    dayOfWeek: "Kamis",
    startTime: "09:00",
    endTime: "14:00",
    quota: 15,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "SCH-005",
    doctorId: "DOC-003",
    dayOfWeek: "Senin",
    startTime: "13:00",
    endTime: "17:00",
    quota: 12,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
]

export class ScheduleService {
  static getAllSchedules(): DoctorSchedule[] {
    return schedules
  }

  static getScheduleById(id: string): DoctorSchedule | undefined {
    return schedules.find(s => s.id === id)
  }

  static getSchedulesByDoctor(doctorId: string): DoctorSchedule[] {
    return schedules.filter(s => s.doctorId === doctorId)
  }

  static createSchedule(data: Omit<DoctorSchedule, 'id' | 'createdAt' | 'updatedAt'>): DoctorSchedule {
    const newSchedule: DoctorSchedule = {
      ...data,
      id: `SCH-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    schedules.push(newSchedule)
    return newSchedule
  }

  static updateSchedule(id: string, data: Partial<DoctorSchedule>): DoctorSchedule | null {
    const index = schedules.findIndex(s => s.id === id)
    if (index === -1) return null

    schedules[index] = {
      ...schedules[index],
      ...data,
      updatedAt: new Date()
    }
    return schedules[index]
  }

  static deleteSchedule(id: string): boolean {
    const index = schedules.findIndex(s => s.id === id)
    if (index === -1) return false

    schedules.splice(index, 1)
    return true
  }

  static toggleScheduleStatus(id: string): DoctorSchedule | null {
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) return null

    schedule.isActive = !schedule.isActive
    schedule.updatedAt = new Date()
    return schedule
  }
}
