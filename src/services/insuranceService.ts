// Insurance validation service with dummy data

export interface InsuranceValidation {
  id: string
  patientName: string
  patientKTP: string
  insuranceType: 'BPJS' | 'Asuransi Swasta'
  insuranceNumber: string
  insuranceProvider: string
  policyStatus: 'active' | 'expired' | 'suspended'
  coverageType: string
  validUntil: Date
  claimLimit: number
  claimUsed: number
  reservationId?: string
  requestDate: Date
  validatedBy?: string
  validatedAt?: Date
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  notes?: string
}

// Dummy insurance validation data
let insuranceValidations: InsuranceValidation[] = [
  {
    id: "INS-001",
    patientName: "Budi Santoso",
    patientKTP: "3201234567890001",
    insuranceType: "BPJS",
    insuranceNumber: "0001234567890",
    insuranceProvider: "BPJS Kesehatan",
    policyStatus: "active",
    coverageType: "Kelas 1",
    validUntil: new Date("2025-12-31"),
    claimLimit: 50000000,
    claimUsed: 15000000,
    reservationId: "RES-001",
    requestDate: new Date("2025-01-10"),
    status: "pending",
    notes: "Pasien datang untuk pemeriksaan jantung"
  },
  {
    id: "INS-002",
    patientName: "Siti Nurhaliza",
    patientKTP: "3201234567890002",
    insuranceType: "Asuransi Swasta",
    insuranceNumber: "PRU-9876543210",
    insuranceProvider: "Prudential",
    policyStatus: "active",
    coverageType: "Premium Plan",
    validUntil: new Date("2026-03-15"),
    claimLimit: 100000000,
    claimUsed: 25000000,
    reservationId: "RES-002",
    requestDate: new Date("2025-01-10"),
    status: "pending",
    notes: "Rawat inap 3 hari"
  },
  {
    id: "INS-003",
    patientName: "Ahmad Wijaya",
    patientKTP: "3201234567890003",
    insuranceType: "BPJS",
    insuranceNumber: "0009876543210",
    insuranceProvider: "BPJS Kesehatan",
    policyStatus: "active",
    coverageType: "Kelas 2",
    validUntil: new Date("2025-11-30"),
    claimLimit: 40000000,
    claimUsed: 8000000,
    reservationId: "RES-003",
    requestDate: new Date("2025-01-09"),
    status: "approved",
    validatedBy: "ADM-001",
    validatedAt: new Date("2025-01-09"),
    notes: "Pemeriksaan rutin diabetes"
  },
  {
    id: "INS-004",
    patientName: "Dewi Lestari",
    patientKTP: "3201234567890004",
    insuranceType: "Asuransi Swasta",
    insuranceNumber: "AIA-1122334455",
    insuranceProvider: "AIA",
    policyStatus: "expired",
    coverageType: "Basic Plan",
    validUntil: new Date("2024-12-31"),
    claimLimit: 50000000,
    claimUsed: 45000000,
    reservationId: "RES-004",
    requestDate: new Date("2025-01-09"),
    status: "rejected",
    validatedBy: "ADM-001",
    validatedAt: new Date("2025-01-09"),
    rejectionReason: "Polis sudah expired sejak 31 Desember 2024",
    notes: "Pasien diminta untuk perpanjang polis terlebih dahulu"
  },
  {
    id: "INS-005",
    patientName: "Rina Kartika",
    patientKTP: "3201234567890005",
    insuranceType: "BPJS",
    insuranceNumber: "0005566778899",
    insuranceProvider: "BPJS Kesehatan",
    policyStatus: "active",
    coverageType: "Kelas 3",
    validUntil: new Date("2025-12-31"),
    claimLimit: 30000000,
    claimUsed: 5000000,
    reservationId: "RES-005",
    requestDate: new Date("2025-01-10"),
    status: "pending",
    notes: "Pemeriksaan mata"
  },
  {
    id: "INS-006",
    patientName: "Hendra Gunawan",
    patientKTP: "3201234567890006",
    insuranceType: "Asuransi Swasta",
    insuranceNumber: "MAN-7788990011",
    insuranceProvider: "Manulife",
    policyStatus: "suspended",
    coverageType: "Gold Plan",
    validUntil: new Date("2025-06-30"),
    claimLimit: 75000000,
    claimUsed: 60000000,
    reservationId: "RES-006",
    requestDate: new Date("2025-01-10"),
    status: "pending",
    notes: "Operasi hernia - menunggu approval provider"
  },
  {
    id: "INS-007",
    patientName: "Maya Putri",
    patientKTP: "3201234567890007",
    insuranceType: "BPJS",
    insuranceNumber: "0002233445566",
    insuranceProvider: "BPJS Kesehatan",
    policyStatus: "active",
    coverageType: "Kelas 1",
    validUntil: new Date("2025-12-31"),
    claimLimit: 50000000,
    claimUsed: 12000000,
    reservationId: "RES-007",
    requestDate: new Date("2025-01-08"),
    status: "approved",
    validatedBy: "ADM-002",
    validatedAt: new Date("2025-01-08"),
    notes: "Pemeriksaan THT"
  }
]

export class InsuranceService {
  static getAllValidations(): InsuranceValidation[] {
    return insuranceValidations.sort((a, b) => 
      b.requestDate.getTime() - a.requestDate.getTime()
    )
  }

  static getValidationById(id: string): InsuranceValidation | undefined {
    return insuranceValidations.find(v => v.id === id)
  }

  static getPendingValidations(): InsuranceValidation[] {
    return insuranceValidations.filter(v => v.status === 'pending')
  }

  static validateInsurance(
    id: string,
    adminId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
    notes?: string
  ): InsuranceValidation | null {
    const validation = insuranceValidations.find(v => v.id === id)
    if (!validation) return null

    validation.status = status
    validation.validatedBy = adminId
    validation.validatedAt = new Date()
    if (rejectionReason) validation.rejectionReason = rejectionReason
    if (notes) validation.notes = notes

    return validation
  }

  static checkInsuranceStatus(insuranceNumber: string): {
    isValid: boolean
    message: string
    data?: InsuranceValidation
  } {
    const validation = insuranceValidations.find(v => v.insuranceNumber === insuranceNumber)
    
    if (!validation) {
      return {
        isValid: false,
        message: "Nomor asuransi tidak ditemukan dalam sistem"
      }
    }

    if (validation.policyStatus === 'expired') {
      return {
        isValid: false,
        message: "Polis asuransi sudah expired",
        data: validation
      }
    }

    if (validation.policyStatus === 'suspended') {
      return {
        isValid: false,
        message: "Polis asuransi sedang suspended",
        data: validation
      }
    }

    const today = new Date()
    if (validation.validUntil < today) {
      return {
        isValid: false,
        message: "Polis asuransi sudah melewati masa berlaku",
        data: validation
      }
    }

    const remainingClaim = validation.claimLimit - validation.claimUsed
    if (remainingClaim <= 0) {
      return {
        isValid: false,
        message: "Limit klaim sudah habis",
        data: validation
      }
    }

    return {
      isValid: true,
      message: "Asuransi valid dan aktif",
      data: validation
    }
  }

  static getStatistics() {
    const total = insuranceValidations.length
    const pending = insuranceValidations.filter(v => v.status === 'pending').length
    const approved = insuranceValidations.filter(v => v.status === 'approved').length
    const rejected = insuranceValidations.filter(v => v.status === 'rejected').length
    
    const bpjs = insuranceValidations.filter(v => v.insuranceType === 'BPJS').length
    const swasta = insuranceValidations.filter(v => v.insuranceType === 'Asuransi Swasta').length

    const active = insuranceValidations.filter(v => v.policyStatus === 'active').length
    const expired = insuranceValidations.filter(v => v.policyStatus === 'expired').length
    const suspended = insuranceValidations.filter(v => v.policyStatus === 'suspended').length

    return {
      total,
      pending,
      approved,
      rejected,
      bpjs,
      swasta,
      active,
      expired,
      suspended
    }
  }
}
