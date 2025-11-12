import { Reservation, QueueEntry, DoctorSchedule } from "@/types"

/**
 * Queue Management Service
 * Handles locked queue numbers for online reservations
 */
export class QueueService {
  // In-memory storage (in real app, this would be in database)
  private static reservations: Map<string, Reservation> = new Map()
  private static queueEntries: Map<string, QueueEntry> = new Map()
  private static lockedNumbers: Map<string, Set<number>> = new Map() // key: "doctorId-date", value: locked numbers

  /**
   * Get next available queue number for a doctor on a specific date
   * Returns locked number that can't be used by others until verified
   */
  static getNextQueueNumber(doctorId: string, date: Date): number {
    const dateKey = this.getDateKey(doctorId, date)
    const locked = this.lockedNumbers.get(dateKey) || new Set()
    
    // Find next available number
    let queueNumber = 1
    while (locked.has(queueNumber)) {
      queueNumber++
    }
    
    return queueNumber
  }

  /**
   * Lock a queue number for online reservation
   * Number won't be available until patient comes to loket for verification
   */
  static lockQueueNumber(
    doctorId: string,
    date: Date,
    queueNumber: number,
    reservationId: string
  ): boolean {
    const dateKey = this.getDateKey(doctorId, date)
    
    if (!this.lockedNumbers.has(dateKey)) {
      this.lockedNumbers.set(dateKey, new Set())
    }
    
    const locked = this.lockedNumbers.get(dateKey)!
    
    // Check if already locked
    if (locked.has(queueNumber)) {
      return false
    }
    
    // Lock the number
    locked.add(queueNumber)
    
    return true
  }

  /**
   * Unlock queue number (when reservation cancelled or time expired)
   */
  static unlockQueueNumber(doctorId: string, date: Date, queueNumber: number): void {
    const dateKey = this.getDateKey(doctorId, date)
    const locked = this.lockedNumbers.get(dateKey)
    
    if (locked) {
      locked.delete(queueNumber)
    }
  }

  /**
   * Check if queue number is available
   */
  static isQueueNumberAvailable(doctorId: string, date: Date, queueNumber: number): boolean {
    const dateKey = this.getDateKey(doctorId, date)
    const locked = this.lockedNumbers.get(dateKey) || new Set()
    
    return !locked.has(queueNumber)
  }

  /**
   * Get all locked queue numbers for a doctor on specific date
   */
  static getLockedNumbers(doctorId: string, date: Date): number[] {
    const dateKey = this.getDateKey(doctorId, date)
    const locked = this.lockedNumbers.get(dateKey) || new Set()
    
    return Array.from(locked).sort((a, b) => a - b)
  }

  /**
   * Generate unique booking codes
   */
  static generateBookingCodes(
    poli: string,
    queueNumber: number
  ): { bookingCodePendaftaran: string; bookingCodePoli: string } {
    // Booking code pendaftaran: random 4 digits
    const bookingCodePendaftaran = Math.floor(1000 + Math.random() * 9000).toString()
    
    // Booking code poli: POLI-XXX format
    const poliCode = poli.substring(5, 8).toUpperCase() // "Poli Jantung" -> "JAN"
    const bookingCodePoli = `${poliCode}-${queueNumber.toString().padStart(3, '0')}`
    
    return {
      bookingCodePendaftaran,
      bookingCodePoli
    }
  }

  /**
   * Create reservation with locked queue number
   */
  static async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    // Get next queue number
    const queueNumber = this.getNextQueueNumber(
      data.doctorId!,
      data.reservationDate!
    )
    
    // Generate booking codes
    const { bookingCodePendaftaran, bookingCodePoli } = this.generateBookingCodes(
      data.specialization!,
      queueNumber
    )
    
    // Lock the queue number
    this.lockQueueNumber(
      data.doctorId!,
      data.reservationDate!,
      queueNumber,
      bookingCodePendaftaran
    )
    
    // Create reservation
    const reservation: Reservation = {
      id: `RES-${Date.now()}`,
      bookingCodePendaftaran,
      bookingCodePoli,
      queueNumber,
      queueLocked: true,
      patientId: data.patientId,
      patientName: data.patientName!,
      patientEmail: data.patientEmail!,
      patientPhone: data.patientPhone!,
      patientKTP: data.patientKTP!,
      patientGender: data.patientGender!,
      patientBirthPlace: data.patientBirthPlace!,
      patientBirthDate: data.patientBirthDate!,
      reservationDate: data.reservationDate!,
      doctorId: data.doctorId!,
      scheduleId: data.scheduleId!,
      specialization: data.specialization!,
      symptoms: data.symptoms!,
      aiRecommendedPoli: data.aiRecommendedPoli,
      aiConfidence: data.aiConfidence,
      paymentMethod: data.paymentMethod!,
      insuranceName: data.insuranceName,
      insuranceNumber: data.insuranceNumber,
      insuranceVerified: false,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Store reservation
    this.reservations.set(reservation.id, reservation)
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return reservation
  }

  /**
   * Verify reservation at loket (admin action)
   * Confirms the locked queue number
   */
  static async verifyReservation(
    reservationId: string,
    adminId: string,
    eselon?: string
  ): Promise<Reservation | null> {
    const reservation = this.reservations.get(reservationId)
    
    if (!reservation) {
      return null
    }
    
    // Update reservation status
    reservation.status = 'confirmed'
    reservation.verifiedAt = new Date()
    reservation.verifiedBy = adminId
    reservation.eselon = eselon
    reservation.checkedInAt = new Date()
    reservation.updatedAt = new Date()
    
    // Create queue entry
    const queueEntry: QueueEntry = {
      id: `QUEUE-${Date.now()}`,
      reservationId: reservation.id,
      patientId: reservation.patientId!,
      patientName: reservation.patientName,
      doctorId: reservation.doctorId,
      scheduleId: reservation.scheduleId,
      queueNumber: reservation.queueNumber,
      queueDate: reservation.reservationDate,
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.queueEntries.set(queueEntry.id, queueEntry)
    
    // Update storage
    this.reservations.set(reservation.id, reservation)
    
    return reservation
  }

  /**
   * Cancel reservation and unlock queue number
   */
  static async cancelReservation(reservationId: string): Promise<boolean> {
    const reservation = this.reservations.get(reservationId)
    
    if (!reservation) {
      return false
    }
    
    // Unlock queue number
    this.unlockQueueNumber(
      reservation.doctorId,
      reservation.reservationDate,
      reservation.queueNumber
    )
    
    // Update status
    reservation.status = 'cancelled'
    reservation.updatedAt = new Date()
    this.reservations.set(reservation.id, reservation)
    
    return true
  }

  /**
   * Get reservation by booking code
   */
  static getReservationByBookingCode(bookingCode: string): Reservation | null {
    for (const reservation of this.reservations.values()) {
      if (
        reservation.bookingCodePendaftaran === bookingCode ||
        reservation.bookingCodePoli === bookingCode
      ) {
        return reservation
      }
    }
    return null
  }

  /**
   * Get all reservations for a patient
   */
  static getPatientReservations(patientId: string): Reservation[] {
    return Array.from(this.reservations.values())
      .filter(r => r.patientId === patientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Get current queue for a doctor
   */
  static getCurrentQueue(doctorId: string, date: Date): QueueEntry[] {
    const dateStr = date.toISOString().split('T')[0]
    
    return Array.from(this.queueEntries.values())
      .filter(q => {
        const queueDateStr = q.queueDate.toISOString().split('T')[0]
        return q.doctorId === doctorId && queueDateStr === dateStr
      })
      .sort((a, b) => a.queueNumber - b.queueNumber)
  }

  /**
   * Calculate estimated wait time
   */
  static calculateWaitTime(queueNumber: number, currentNumber: number): number {
    const avgTimePerPatient = 15 // minutes
    const patientsAhead = Math.max(0, queueNumber - currentNumber)
    return patientsAhead * avgTimePerPatient
  }

  /**
   * Helper: Generate date key for map
   */
  private static getDateKey(doctorId: string, date: Date): string {
    const dateStr = date.toISOString().split('T')[0]
    return `${doctorId}-${dateStr}`
  }

  /**
   * Get all reservations (for admin)
   */
  static getAllReservations(status?: string): Reservation[] {
    let reservations = Array.from(this.reservations.values())
    
    if (status) {
      reservations = reservations.filter(r => r.status === status)
    }
    
    return reservations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Auto-expire old reservations (should run daily)
   */
  static expireOldReservations(): number {
    const now = new Date()
    let expiredCount = 0
    
    for (const reservation of this.reservations.values()) {
      // If reservation date has passed and still pending
      if (
        reservation.status === 'pending' &&
        reservation.reservationDate < now
      ) {
        this.cancelReservation(reservation.id)
        expiredCount++
      }
    }
    
    return expiredCount
  }
}

// Mock data helper (can be removed in production)
export async function initializeMockReservations() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  console.log('🔄 Initializing mock reservations...')

  // PENDING RESERVATIONS - Menunggu Verifikasi di Loket (5 pasien)
  
  // 1. Pending - Budi Santoso (BPJS)
  await QueueService.createReservation({
    patientId: "PAT-001",
    patientName: "Budi Santoso",
    patientEmail: "budi.santoso@email.com",
    patientPhone: "081234567890",
    patientKTP: "3201011990010001",
    patientGender: "Laki-laki",
    patientBirthPlace: "Jakarta",
    patientBirthDate: new Date("1990-01-15"),
    reservationDate: today,
    doctorId: "DOC-003",
    scheduleId: "SCH-001",
    specialization: "Poli Jantung",
    symptoms: "Nyeri dada sebelah kiri, sesak nafas saat beraktivitas",
    aiRecommendedPoli: "Poli Jantung",
    aiConfidence: 95,
    paymentMethod: "BPJS",
    insuranceName: "BPJS Kesehatan",
    insuranceNumber: "0001234567890"
  })

  // 2. Pending - Siti Rahmawati (Asuransi Swasta)
  await QueueService.createReservation({
    patientId: "PAT-002",
    patientName: "Siti Rahmawati",
    patientEmail: "siti.rahmawati@email.com",
    patientPhone: "082345678901",
    patientKTP: "3201011985050002",
    patientGender: "Perempuan",
    patientBirthPlace: "Bandung",
    patientBirthDate: new Date("1985-05-20"),
    reservationDate: today,
    doctorId: "DOC-005",
    scheduleId: "SCH-002",
    specialization: "Poli Anak",
    symptoms: "Anak demam tinggi 3 hari, batuk pilek",
    aiRecommendedPoli: "Poli Anak",
    aiConfidence: 88,
    paymentMethod: "Asuransi Swasta",
    insuranceName: "Prudential",
    insuranceNumber: "PRU-2023-12345"
  })

  // 3. Pending - Ahmad Wijaya (Cash)
  await QueueService.createReservation({
    patientId: "PAT-003",
    patientName: "Ahmad Wijaya",
    patientEmail: "ahmad.wijaya@email.com",
    patientPhone: "083456789012",
    patientKTP: "3201011988030003",
    patientGender: "Laki-laki",
    patientBirthPlace: "Surabaya",
    patientBirthDate: new Date("1988-03-10"),
    reservationDate: today,
    doctorId: "DOC-009",
    scheduleId: "SCH-003",
    specialization: "Poli Mata",
    symptoms: "Mata merah, gatal, berair sejak 2 hari",
    aiRecommendedPoli: "Poli Mata",
    aiConfidence: 92,
    paymentMethod: "Cash"
  })

  // 4. Pending - Dewi Lestari (BPJS) - Changed to Poli Gigi
  await QueueService.createReservation({
    patientId: "PAT-004",
    patientName: "Dewi Lestari",
    patientEmail: "dewi.lestari@email.com",
    patientPhone: "084567890123",
    patientKTP: "3201011992070004",
    patientGender: "Perempuan",
    patientBirthPlace: "Semarang",
    patientBirthDate: new Date("1992-07-25"),
    reservationDate: today,
    doctorId: "DOC-007",
    scheduleId: "SCH-004",
    specialization: "Poli Gigi",
    symptoms: "Gigi berlubang, sakit saat makan",
    aiRecommendedPoli: "Poli Gigi",
    aiConfidence: 90,
    paymentMethod: "BPJS",
    insuranceName: "BPJS Kesehatan",
    insuranceNumber: "0002345678901"
  })

  // 5. Pending - Riko Pratama (Cash)
  await QueueService.createReservation({
    patientId: "PAT-005",
    patientName: "Riko Pratama",
    patientEmail: "riko.pratama@email.com",
    patientPhone: "085678901234",
    patientKTP: "3201011995110005",
    patientGender: "Laki-laki",
    patientBirthPlace: "Medan",
    patientBirthDate: new Date("1995-11-08"),
    reservationDate: today,
    doctorId: "DOC-010",
    scheduleId: "SCH-005",
    specialization: "Poli THT",
    symptoms: "Telinga sakit, keluar cairan, pendengaran berkurang",
    aiRecommendedPoli: "Poli THT",
    aiConfidence: 94,
    paymentMethod: "Cash"
  })

  console.log('✅ Created 5 pending reservations')

  // CONFIRMED RESERVATIONS - Sudah Verifikasi, Menunggu Dipanggil (8 pasien)
  // Simulate already verified reservations for queue management

  // 6. Confirmed - Maya Kusuma (sudah verifikasi)
  const res6 = await QueueService.createReservation({
      patientId: "PAT-006",
      patientName: "Maya Kusuma",
      patientEmail: "maya.kusuma@email.com",
      patientPhone: "086789012345",
      patientKTP: "3201011987020006",
      patientGender: "Perempuan",
      patientBirthPlace: "Yogyakarta",
      patientBirthDate: new Date("1987-02-14"),
      reservationDate: today,
      doctorId: "DOC-003",
      scheduleId: "SCH-001",
      specialization: "Poli Jantung",
      symptoms: "Jantung berdebar, pusing",
      aiRecommendedPoli: "Poli Jantung",
      aiConfidence: 87,
      paymentMethod: "BPJS",
      insuranceName: "BPJS Kesehatan",
      insuranceNumber: "0003456789012"
    })
    await QueueService.verifyReservation(res6.id, "admin@rspb.com", "Eselon II")

    // 7. Confirmed - Hendro Gunawan
    const res7 = await QueueService.createReservation({
      patientId: "PAT-007",
      patientName: "Hendro Gunawan",
      patientEmail: "hendro.gunawan@email.com",
      patientPhone: "087890123456",
      patientKTP: "3201011983090007",
      patientGender: "Laki-laki",
      patientBirthPlace: "Malang",
      patientBirthDate: new Date("1983-09-30"),
      reservationDate: today,
      doctorId: "DOC-005",
      scheduleId: "SCH-002",
      specialization: "Poli Anak",
      symptoms: "Anak batuk berdahak, muntah",
      aiRecommendedPoli: "Poli Anak",
      aiConfidence: 85,
      paymentMethod: "Asuransi Swasta",
      insuranceName: "Allianz",
      insuranceNumber: "ALZ-2023-67890"
    })
    await QueueService.verifyReservation(res7.id, "admin@rspb.com", "Umum")

    // 8. Confirmed - Rina Permata
    const res8 = await QueueService.createReservation({
      patientId: "PAT-008",
      patientName: "Rina Permata",
      patientEmail: "rina.permata@email.com",
      patientPhone: "088901234567",
      patientKTP: "3201011991040008",
      patientGender: "Perempuan",
      patientBirthPlace: "Palembang",
      patientBirthDate: new Date("1991-04-18"),
      reservationDate: today,
      doctorId: "DOC-009",
      scheduleId: "SCH-003",
      specialization: "Poli Mata",
      symptoms: "Mata kabur, sulit melihat jauh",
      aiRecommendedPoli: "Poli Mata",
      aiConfidence: 91,
      paymentMethod: "Cash"
    })
    await QueueService.verifyReservation(res8.id, "admin@rspb.com", "Eselon III")

    // 9. Confirmed - Agus Setiawan
    const res9 = await QueueService.createReservation({
      patientId: "PAT-009",
      patientName: "Agus Setiawan",
      patientEmail: "agus.setiawan@email.com",
      patientPhone: "089012345678",
      patientKTP: "3201011989080009",
      patientGender: "Laki-laki",
      patientBirthPlace: "Makassar",
      patientBirthDate: new Date("1989-08-22"),
      reservationDate: today,
      doctorId: "DOC-007",
      scheduleId: "SCH-004",
      specialization: "Poli Gigi",
      symptoms: "Gigi berlubang, ngilu",
      aiRecommendedPoli: "Poli Gigi",
      aiConfidence: 89,
      paymentMethod: "BPJS",
      insuranceName: "BPJS Kesehatan",
      insuranceNumber: "0004567890123"
    })
    await QueueService.verifyReservation(res9.id, "admin@rspb.com", "Eselon IV")

    // 10. Confirmed - Lina Wati
    const res10 = await QueueService.createReservation({
      patientId: "PAT-010",
      patientName: "Lina Wati",
      patientEmail: "lina.wati@email.com",
      patientPhone: "081123456789",
      patientKTP: "3201011993060010",
      patientGender: "Perempuan",
      patientBirthPlace: "Denpasar",
      patientBirthDate: new Date("1993-06-12"),
      reservationDate: today,
      doctorId: "DOC-010",
      scheduleId: "SCH-005",
      specialization: "Poli THT",
      symptoms: "Hidung tersumbat, sulit bernafas",
      aiRecommendedPoli: "Poli THT",
      aiConfidence: 93,
      paymentMethod: "Cash"
    })
    await QueueService.verifyReservation(res10.id, "admin@rspb.com", "Umum")

    // 11. Confirmed - Bayu Saputra
    const res11 = await QueueService.createReservation({
      patientId: "PAT-011",
      patientName: "Bayu Saputra",
      patientEmail: "bayu.saputra@email.com",
      patientPhone: "082234567890",
      patientKTP: "3201011986120011",
      patientGender: "Laki-laki",
      patientBirthPlace: "Bogor",
      patientBirthDate: new Date("1986-12-05"),
      reservationDate: today,
      doctorId: "DOC-004",
      scheduleId: "SCH-001",
      specialization: "Poli Jantung",
      symptoms: "Nyeri dada menjalar ke lengan kiri",
      aiRecommendedPoli: "Poli Jantung",
      aiConfidence: 96,
      paymentMethod: "Asuransi Swasta",
      insuranceName: "AIA",
      insuranceNumber: "AIA-2023-11111"
    })
    await QueueService.verifyReservation(res11.id, "admin@rspb.com", "Eselon I")

    // 12. Confirmed - Fitri Handayani
    const res12 = await QueueService.createReservation({
      patientId: "PAT-012",
      patientName: "Fitri Handayani",
      patientEmail: "fitri.handayani@email.com",
      patientPhone: "083345678901",
      patientKTP: "3201011994010012",
      patientGender: "Perempuan",
      patientBirthPlace: "Depok",
      patientBirthDate: new Date("1994-01-28"),
      reservationDate: today,
      doctorId: "DOC-006",
      scheduleId: "SCH-002",
      specialization: "Poli Anak",
      symptoms: "Anak diare, lemas, tidak mau makan",
      aiRecommendedPoli: "Poli Anak",
      aiConfidence: 86,
      paymentMethod: "BPJS",
      insuranceName: "BPJS Kesehatan",
      insuranceNumber: "0005678901234"
    })
    await QueueService.verifyReservation(res12.id, "admin@rspb.com", "Eselon III")

    // 13. Confirmed - Doni Prasetyo
    const res13 = await QueueService.createReservation({
      patientId: "PAT-013",
      patientName: "Doni Prasetyo",
      patientEmail: "doni.prasetyo@email.com",
      patientPhone: "084456789012",
      patientKTP: "3201011984050013",
      patientGender: "Laki-laki",
      patientBirthPlace: "Bekasi",
      patientBirthDate: new Date("1984-05-16"),
      reservationDate: today,
      doctorId: "DOC-009",
      scheduleId: "SCH-003",
      specialization: "Poli Mata",
      symptoms: "Mata perih, sensitif terhadap cahaya",
      aiRecommendedPoli: "Poli Mata",
      aiConfidence: 88,
      paymentMethod: "Cash"
    })
    await QueueService.verifyReservation(res13.id, "admin@rspb.com", "Umum")

  console.log("✅ Mock reservations initialized successfully!")
  console.log(`Total reservations: ${QueueService.getAllReservations().length}`)
}
