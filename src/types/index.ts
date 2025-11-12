// ==========================================
// USER & AUTHENTICATION TYPES
// ==========================================

export type UserRole = 'patient' | 'admin' | 'superadmin' | 'anonymous'

export type Gender = 'Laki-laki' | 'Perempuan'

export type MaritalStatus = 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati'

export type PaymentMethod = 'Cash' | 'BPJS' | 'Asuransi Swasta'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  createdAt: Date
  lastLogin?: Date
}

// ==========================================
// PATIENT DATA TYPES (Complete Registration)
// ==========================================

export interface PatientProfile {
  id: string
  userId: string
  
  // Data Pribadi
  fullName: string
  noKTP: string
  jenisKelamin: Gender
  suku: string
  tempatLahir: string
  tanggalLahir: Date
  agama: string
  statusKawin: MaritalStatus
  pendidikan: string
  pekerjaan: string
  
  // Data Keluarga
  statusKeluarga: 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Orang Tua' | 'Lainnya'
  namaKeluarga: string // nama istri/suami/orangtua
  
  // Data Alamat
  alamat: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kabupatenKota: string
  provinsi: string
  kodePos?: string
  
  // Data Kontak
  noTelp: string
  noHP: string
  
  // Data Penjamin
  metodePembayaran: PaymentMethod
  namaPenanggung?: string // untuk asuransi
  nomorAsuransi?: string
  
  // Status & Verification
  isVerified: boolean
  verifiedAt?: Date
  verifiedBy?: string // admin ID
  eselon?: string
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// DOCTOR & SCHEDULE TYPES
// ==========================================

export type DoctorSpecialization = 
  | 'Poli Umum'
  | 'Poli Jantung'
  | 'Poli Anak'
  | 'Poli Gigi'
  | 'Poli Mata'
  | 'Poli THT'
  | 'Poli Kandungan'
  | 'Poli Penyakit Dalam'
  | 'Poli Bedah'
  | 'Poli Kulit'
  | 'Poli Saraf'
  | 'Poli Jiwa'

export interface Doctor {
  id: string
  name: string
  specialization: DoctorSpecialization
  phone: string
  email: string
  photo?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'

export interface DoctorSchedule {
  id: string
  doctorId: string
  doctor?: Doctor
  dayOfWeek: DayOfWeek
  startTime: string // "08:00"
  endTime: string // "10:00"
  quota: number // max patients per session
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DoctorLeave {
  id: string
  doctorId: string
  doctor?: Doctor
  leaveDate: Date
  reason: string
  createdBy: string // admin ID
  createdAt: Date
}

// ==========================================
// RESERVATION & QUEUE TYPES
// ==========================================

export type ReservationStatus = 
  | 'pending' // baru reservasi online
  | 'confirmed' // sudah verifikasi di loket
  | 'cancelled' // dibatalkan
  | 'completed' // selesai berobat
  | 'no-show' // tidak datang

export interface Reservation {
  id: string
  
  // Booking Codes
  bookingCodePendaftaran: string // e.g., "2023"
  bookingCodePoli: string // e.g., "JANTUNG-001"
  queueNumber: number // nomor antrian yang terkunci
  
  // Patient Info (for reservation, before registration)
  patientId?: string // null jika belum terdaftar
  patientName: string
  patientEmail: string
  patientPhone: string
  patientKTP: string
  patientGender: Gender
  patientBirthPlace: string
  patientBirthDate: Date
  
  // Reservation Details
  reservationDate: Date // tanggal rencana berobat
  doctorId: string
  doctor?: Doctor
  scheduleId: string
  schedule?: DoctorSchedule
  specialization: DoctorSpecialization
  
  // Symptoms & AI Recommendation
  symptoms: string // free text gejala
  aiRecommendedPoli?: DoctorSpecialization
  aiConfidence?: number // 0-100%
  
  // Payment
  paymentMethod: PaymentMethod
  insuranceName?: string
  insuranceNumber?: string
  insuranceVerified: boolean
  
  // Status & Verification
  status: ReservationStatus
  verifiedAt?: Date
  verifiedBy?: string // admin ID
  eselon?: string
  checkedInAt?: Date
  completedAt?: Date
  
  // Queue Management
  queueLocked: boolean // true = nomor terkunci, false = bisa dipakai orang lain
  estimatedWaitTime?: number // in minutes
  
  // Notes
  adminNotes?: string
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// QUEUE MANAGEMENT TYPES
// ==========================================

export type QueueStatus = 'waiting' | 'called' | 'serving' | 'completed' | 'skipped' | 'cancelled'

export interface QueueEntry {
  id: string
  reservationId?: string
  patientId: string
  patientName: string
  doctorId: string
  scheduleId: string
  queueNumber: number
  queueDate: Date
  status: QueueStatus
  calledAt?: Date
  servedAt?: Date
  completedAt?: Date
  estimatedWaitTime?: number
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export type NotificationType = 
  | 'reservation_success'
  | 'reservation_confirmed'
  | 'queue_update'
  | 'schedule_change'
  | 'new_message'
  | 'new_patient'
  | 'verification_needed'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any // additional data
  isRead: boolean
  createdAt: Date
  
  // For sending via Email/WhatsApp
  sentViaEmail: boolean
  sentViaWhatsApp: boolean
  emailSentAt?: Date
  whatsappSentAt?: Date
}

// ==========================================
// CHAT TYPES
// ==========================================

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: UserRole
  recipientId: string
  recipientName: string
  message: string
  isRead: boolean
  createdAt: Date
}

export interface ChatRoom {
  id: string
  patientId: string
  patientName: string
  adminId?: string
  adminName?: string
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// MEDICAL HISTORY TYPES
// ==========================================

export interface MedicalHistory {
  id: string
  patientId: string
  reservationId: string
  visitDate: Date
  doctorId: string
  doctor?: Doctor
  specialization: DoctorSpecialization
  diagnosis: string
  treatment: string
  prescription?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// INSURANCE TYPES
// ==========================================

export type InsuranceStatus = 'pending' | 'verified' | 'rejected'

export interface InsuranceVerification {
  id: string
  patientId: string
  reservationId?: string
  insuranceType: PaymentMethod
  insuranceName: string
  insuranceNumber: string
  policyHolderName: string
  validUntil?: Date
  status: InsuranceStatus
  verifiedBy?: string // admin ID
  verifiedAt?: Date
  rejectionReason?: string
  documents?: string[] // URLs to uploaded documents
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// SYSTEM SETTINGS (Super Admin)
// ==========================================

export interface SystemSettings {
  id: string
  hospitalName: string
  hospitalAddress: string
  hospitalPhone: string
  hospitalEmail: string
  workingHoursStart: string
  workingHoursEnd: string
  maxReservationDaysAhead: number // e.g., 30 days
  enableAIRecommendation: boolean
  enableEmailNotification: boolean
  enableWhatsAppNotification: boolean
  maintenanceMode: boolean
  updatedAt: Date
  updatedBy: string // admin ID
}

// ==========================================
// ADMIN MANAGEMENT TYPES
// ==========================================

export interface AdminProfile {
  id: string
  userId: string
  fullName: string
  phone: string
  email: string
  role: 'admin' | 'superadmin'
  isActive: boolean
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}
