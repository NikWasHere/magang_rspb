import { DoctorSpecialization } from "@/types"

interface DiagnosisResult {
  recommendedPoli: DoctorSpecialization
  confidence: number // 0-100
  reason: string
  alternativePoli?: DoctorSpecialization[]
}

/**
 * AI-based diagnosis system to recommend appropriate poli based on symptoms
 * This is a rule-based system that can be replaced with actual AI/ML model
 */
export class DiagnoseService {
  
  // Keywords mapping untuk setiap poli
  private static poliKeywords: Record<DoctorSpecialization, string[]> = {
    'Poli Umum': [
      'demam', 'flu', 'batuk', 'pilek', 'pusing', 'mual', 'muntah', 'diare',
      'sakit kepala', 'lemas', 'letih', 'kurang enak badan', 'masuk angin',
      'meriang', 'hidung tersumbat', 'bersin', 'tenggorokan gatal'
    ],
    'Poli Jantung': [
      'nyeri dada', 'sesak nafas', 'jantung berdebar', 'detak jantung',
      'tekanan darah', 'hipertensi', 'kolesterol', 'serangan jantung',
      'angina', 'aritmia', 'gagal jantung', 'dada terasa berat',
      'nafas pendek', 'kaki bengkak', 'lemah jantung'
    ],
    'Poli Anak': [
      'anak', 'bayi', 'balita', 'imunisasi', 'tumbuh kembang',
      'asi', 'mpasi', 'diare anak', 'demam anak', 'batuk anak',
      'campak', 'rubella', 'vaksin', 'stunting', 'berat badan anak'
    ],
    'Poli Gigi': [
      'sakit gigi', 'gigi berlubang', 'gusi berdarah', 'cabut gigi',
      'tambal gigi', 'karang gigi', 'gigi goyang', 'gigi sensitif',
      'bau mulut', 'sariawan', 'gigi bungsu', 'behel', 'kawat gigi',
      'gusi bengkak', 'gigi ngilu'
    ],
    'Poli Mata': [
      'mata', 'penglihatan kabur', 'rabun', 'minus', 'plus', 'silinder',
      'katarak', 'glaukoma', 'mata merah', 'mata gatal', 'mata perih',
      'belekan', 'mata berair', 'mata kering', 'floaters', 'kebutaan'
    ],
    'Poli THT': [
      'telinga', 'hidung', 'tenggorokan', 'pendengaran', 'tuli',
      'sinusitis', 'amandel', 'polip', 'telinga berdenging', 'mimisan',
      'suara serak', 'radang tenggorokan', 'hidung tersumbat kronis',
      'penciuman hilang', 'vertigo', 'pusing berputar'
    ],
    'Poli Kandungan': [
      'hamil', 'kehamilan', 'mens', 'menstruasi', 'haid', 'kb',
      'kontrasepsi', 'keguguran', 'persalinan', 'usg', 'janin',
      'keputihan', 'nyeri haid', 'menopause', 'kista', 'miom',
      'kandungan', 'rahim', 'ovarium', 'pendarahan', 'ibu hamil'
    ],
    'Poli Penyakit Dalam': [
      'diabetes', 'gula darah', 'kencing manis', 'asam lambung', 'maag',
      'gerd', 'tifus', 'hepatitis', 'liver', 'hati', 'ginjal',
      'hipertensi', 'kolesterol tinggi', 'asam urat', 'rematik',
      'anemia', 'kurang darah', 'lemah', 'pucat', 'penyakit kronis'
    ],
    'Poli Bedah': [
      'luka', 'benjolan', 'tumor', 'kista', 'operasi', 'jahit luka',
      'hernia', 'wasir', 'ambeien', 'bisul', 'abses', 'lipoma',
      'trauma', 'patah tulang', 'kecelakaan', 'luka bakar',
      'kanker', 'batu empedu', 'usus buntu', 'apendisitis'
    ],
    'Poli Kulit': [
      'gatal', 'kulit', 'eksim', 'alergi', 'biduran', 'jerawat',
      'flek hitam', 'bintik merah', 'ruam', 'kurap', 'jamur',
      'kadas', 'kudis', 'scabies', 'vitiligo', 'psoriasis',
      'kulit kering', 'kulit berminyak', 'bekas luka', 'keloid'
    ],
    'Poli Saraf': [
      'stroke', 'lumpuh', 'kejang', 'epilepsi', 'migrain', 'vertigo',
      'parkinson', 'tremor', 'gemetar', 'kesemutan', 'kebas',
      'saraf terjepit', 'neuropati', 'alzheimer', 'demensia',
      'sakit kepala hebat', 'pingsan', 'tidak sadarkan diri'
    ],
    'Poli Jiwa': [
      'depresi', 'cemas', 'stress', 'gangguan tidur', 'insomnia',
      'trauma', 'ptsd', 'panik', 'fobia', 'schizophrenia',
      'bipolar', 'halusinasi', 'delusi', 'bunuh diri', 'self harm',
      'gangguan makan', 'anorexia', 'bulimia', 'kecanduan', 'adiksi'
    ]
  }

  /**
   * Analyze symptoms and recommend appropriate poli
   */
  static async analyzeSymptoms(symptoms: string): Promise<DiagnosisResult> {
    // Normalize input
    const normalizedSymptoms = symptoms.toLowerCase().trim()
    
    if (!normalizedSymptoms || normalizedSymptoms.length < 3) {
      return {
        recommendedPoli: 'Poli Umum',
        confidence: 50,
        reason: 'Gejala tidak cukup spesifik. Silakan konsultasi di Poli Umum terlebih dahulu.',
        alternativePoli: []
      }
    }

    // Score each poli based on keyword matching
    const scores: Array<{ poli: DoctorSpecialization; score: number; matchedKeywords: string[] }> = []

    for (const [poli, keywords] of Object.entries(this.poliKeywords)) {
      const matchedKeywords: string[] = []
      let score = 0

      for (const keyword of keywords) {
        if (normalizedSymptoms.includes(keyword)) {
          matchedKeywords.push(keyword)
          // Weight longer keywords more heavily (more specific)
          score += keyword.split(' ').length
        }
      }

      if (score > 0) {
        scores.push({
          poli: poli as DoctorSpecialization,
          score,
          matchedKeywords
        })
      }
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score)

    // If no match found, default to Poli Umum
    if (scores.length === 0) {
      return {
        recommendedPoli: 'Poli Umum',
        confidence: 60,
        reason: 'Gejala yang disebutkan cocok untuk pemeriksaan umum. Dokter umum akan mengarahkan jika perlu spesialis.',
        alternativePoli: []
      }
    }

    // Get top recommendation
    const topMatch = scores[0]
    const alternatives = scores.slice(1, 3).map(s => s.poli)

    // Calculate confidence based on score difference and number of matches
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
    const confidence = Math.min(95, Math.round((topMatch.score / totalScore) * 100))

    // Generate reason
    const reason = this.generateReason(topMatch.poli, topMatch.matchedKeywords)

    return {
      recommendedPoli: topMatch.poli,
      confidence,
      reason,
      alternativePoli: alternatives.length > 0 ? alternatives : undefined
    }
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private static generateReason(poli: DoctorSpecialization, keywords: string[]): string {
    const keywordList = keywords.slice(0, 3).join(', ')
    
    const reasons: Record<DoctorSpecialization, string> = {
      'Poli Umum': `Gejala "${keywordList}" cocok untuk pemeriksaan umum. Dokter umum dapat memberikan penanganan awal atau merujuk ke spesialis jika diperlukan.`,
      'Poli Jantung': `Gejala "${keywordList}" berkaitan dengan kesehatan jantung dan pembuluh darah. Disarankan untuk konsultasi dengan dokter spesialis jantung.`,
      'Poli Anak': `Gejala "${keywordList}" berkaitan dengan kesehatan anak. Dokter spesialis anak akan memberikan penanganan yang tepat.`,
      'Poli Gigi': `Keluhan "${keywordList}" berkaitan dengan kesehatan gigi dan mulut. Silakan konsultasi dengan dokter gigi.`,
      'Poli Mata': `Gejala "${keywordList}" berkaitan dengan kesehatan mata. Dokter spesialis mata akan melakukan pemeriksaan lebih lanjut.`,
      'Poli THT': `Keluhan "${keywordList}" berkaitan dengan telinga, hidung, dan tenggorokan. Disarankan konsultasi dengan dokter spesialis THT.`,
      'Poli Kandungan': `Gejala "${keywordList}" berkaitan dengan kesehatan reproduksi wanita. Silakan konsultasi dengan dokter spesialis kandungan.`,
      'Poli Penyakit Dalam': `Gejala "${keywordList}" berkaitan dengan penyakit dalam. Dokter spesialis penyakit dalam akan memberikan diagnosis lebih lanjut.`,
      'Poli Bedah': `Kondisi "${keywordList}" mungkin memerlukan tindakan bedah atau konsultasi dengan dokter bedah.`,
      'Poli Kulit': `Keluhan "${keywordList}" berkaitan dengan kesehatan kulit. Dokter spesialis kulit akan memberikan penanganan yang tepat.`,
      'Poli Saraf': `Gejala "${keywordList}" berkaitan dengan sistem saraf. Disarankan untuk konsultasi dengan dokter spesialis saraf.`,
      'Poli Jiwa': `Keluhan "${keywordList}" berkaitan dengan kesehatan mental. Dokter spesialis jiwa/psikiater akan membantu menangani kondisi Anda.`
    }

    return reasons[poli] || 'Silakan konsultasi dengan dokter untuk diagnosis yang tepat.'
  }

  /**
   * Get all available poli with descriptions
   */
  static getAllPoli(): Array<{ name: DoctorSpecialization; description: string }> {
    return [
      { name: 'Poli Umum', description: 'Pemeriksaan kesehatan umum dan konsultasi awal' },
      { name: 'Poli Jantung', description: 'Spesialis jantung dan pembuluh darah' },
      { name: 'Poli Anak', description: 'Kesehatan anak, bayi, dan tumbuh kembang' },
      { name: 'Poli Gigi', description: 'Kesehatan gigi dan mulut' },
      { name: 'Poli Mata', description: 'Kesehatan mata dan penglihatan' },
      { name: 'Poli THT', description: 'Telinga, Hidung, dan Tenggorokan' },
      { name: 'Poli Kandungan', description: 'Kesehatan reproduksi wanita dan kehamilan' },
      { name: 'Poli Penyakit Dalam', description: 'Penyakit dalam dan kronis' },
      { name: 'Poli Bedah', description: 'Tindakan bedah dan operasi' },
      { name: 'Poli Kulit', description: 'Kesehatan kulit dan kelamin' },
      { name: 'Poli Saraf', description: 'Sistem saraf dan neurologis' },
      { name: 'Poli Jiwa', description: 'Kesehatan mental dan psikiatri' }
    ]
  }
}
