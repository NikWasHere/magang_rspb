const baseApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

interface Poli {
  id: number;
  name: string;
}

interface DiagnosisResult {
  recommendedPoli: Poli | null;
  confidence: number; // 0-100
  reason: string;
  alternativePoli?: Poli[];
}

/**
 * AI-based diagnosis system to recommend appropriate poli based on symptoms
 * This is a rule-based system that can be replaced with actual AI/ML model
 * Now connects to real Poli API from database
 */
export class DiagnoseService {
  
  private static poliCache: Poli[] | null = null;
  
  // Keywords mapping untuk poli di RSPB (31 poli aktif dengan dokter)
  // Format: keyword kategori yang match dengan nama poli database
  private static poliKeywords: Record<string, string[]> = {
    // BEDAH (8 poli)
    'bedah tulang': ['patah tulang', 'tulang', 'retak tulang', 'ortopedi', 'sendi', 'ligamen', 'fraktur', 'keseleo', 'persendian'],
    'urologi': ['kencing', 'saluran kemih', 'prostat', 'ginjal', 'batu ginjal', 'kandung kemih', 'infeksi saluran kemih', 'kencing batu'],
    'bedah umum': ['operasi', 'luka', 'jahit luka', 'hernia', 'usus buntu', 'apendisitis', 'benjolan', 'lipoma', 'abses', 'bisul'],
    'onkologi': ['kanker', 'tumor ganas', 'kemoterapi', 'radiasi', 'keganasan', 'metastasis'],
    'bedah digestive': ['lambung', 'usus', 'pencernaan operasi', 'tukak lambung', 'wasir', 'ambeien', 'batu empedu', 'hemoroid'],
    'bedah saraf': ['trauma kepala', 'tumor otak', 'operasi otak', 'cedera kepala berat'],
    'bedah thorax': ['operasi dada', 'operasi jantung', 'operasi paru', 'btkv', 'kardiovaskuler'],
    'bedah plastik': ['luka bakar', 'rekonstruksi', 'bibir sumbing', 'keloid besar', 'bedah estetik'],
    
    // KANDUNGAN (2 poli)
    'kandungan': ['hamil', 'kehamilan', 'melahirkan', 'persalinan', 'mens', 'haid', 'kb', 'keputihan', 'kista', 'miom', 'rahim', 'obsgyn'],
    'fertilitas': ['sulit hamil', 'infertilitas', 'program hamil', 'kesuburan', 'inseminasi', 'ivf', 'bayi tabung', 'tidak bisa hamil'],
    
    // KULIT (1 poli)
    'kulit': ['gatal', 'ruam', 'eksim', 'alergi kulit', 'biduran', 'jerawat', 'flek', 'jamur kulit', 'kurap', 'kelamin', 'penyakit kulit'],
    
    // THT (1 poli)
    'tht': ['telinga', 'hidung', 'tenggorokan', 'sinusitis', 'amandel', 'mimisan', 'tuli', 'berdenging', 'radang tenggorokan', 'polip hidung'],
    
    // MATA (1 poli)
    'mata': ['mata', 'penglihatan', 'kabur', 'minus', 'plus', 'silinder', 'katarak', 'glaukoma', 'mata merah', 'belekan', 'mata perih'],
    
    // SARAF (2 poli)
    'saraf': ['stroke', 'lumpuh', 'kesemutan', 'kebas', 'saraf terjepit', 'neuropati', 'epilepsi', 'kejang', 'migrain hebat'],
    'nyeri': ['nyeri kronis', 'nyeri persisten', 'nyeri berulang', 'sakit tidak hilang'],
    
    // ANAK (3 poli)
    'anak': ['anak', 'bayi', 'balita', 'demam anak', 'batuk anak', 'diare anak', 'anak sakit', 'pediatri'],
    'tumbuh kembang': ['tumbuh kembang', 'stunting', 'gizi anak', 'pertumbuhan anak', 'perkembangan anak', 'terlambat bicara'],
    'imunisasi': ['vaksin', 'imunisasi', 'suntik', 'campak', 'rubella', 'dpt', 'polio', 'vaksinasi', 'imunisasi anak', 'imunisasi dewasa'],
    
    // PENYAKIT DALAM (3 poli)
    'penyakit dalam': ['demam tinggi', 'lemas', 'pusing', 'mual', 'muntah', 'tifus', 'hepatitis', 'anemia', 'asam urat', 'rematik', 'liver'],
    'diabetes': ['diabetes', 'gula darah', 'kencing manis', 'insulin', 'gula darah tinggi', 'diabetes terpadu'],
    'gizi': ['obesitas', 'kegemukan', 'diet', 'gizi', 'berat badan berlebih', 'kurus', 'malnutrisi'],
    
    // PSIKIATRI (1 poli)
    'psikiatri': ['depresi', 'cemas', 'stress berat', 'gangguan tidur', 'insomnia', 'panik', 'trauma', 'bunuh diri', 'bipolar', 'gangguan mental'],
    
    // PARU (1 poli)
    'paru': ['batuk lama', 'sesak nafas', 'asma', 'tbc', 'bronkitis', 'napas pendek', 'dada sesak', 'batuk berdarah', 'batuk tidak sembuh'],
    
    // JANTUNG (1 poli)
    'jantung': ['nyeri dada', 'jantung berdebar', 'hipertensi', 'darah tinggi', 'kolesterol tinggi', 'lemah jantung', 'serangan jantung'],
    
    // GIGI (6 poli)
    'gigi': ['gigi', 'sakit gigi', 'gigi berlubang', 'tambal gigi', 'cabut gigi', 'gusi', 'gigi mulut'],
    'konservasi gigi': ['gigi berlubang', 'tambal gigi', 'saluran akar', 'gigi sensitif', 'gigi ngilu'],
    'bedah mulut': ['cabut gigi', 'gigi bungsu', 'operasi gigi', 'gigi impaksi', 'gigi terpendam'],
    'gigi anak': ['gigi anak', 'gigi susu', 'gigi berlubang anak', 'kesehatan gigi anak'],
    'orthodonti': ['behel', 'kawat gigi', 'gigi tidak rata', 'merapikan gigi', 'gigi maju'],
    'periodonti': ['gusi berdarah', 'gusi bengkak', 'karang gigi', 'periodontitis', 'gusi sakit'],
    
    // UMUM (2 poli)
    'umum': ['demam', 'flu', 'pilek', 'batuk ringan', 'pusing ringan', 'masuk angin', 'sakit kepala', 'lemas', 'check up'],
    'kapitasi': ['pensiunan', 'pensiunan pertamina', 'peserta kapitasi'],
    
    // REHAB MEDIK (1 poli)
    'rehab': ['fisioterapi', 'terapi fisik', 'rehabilitasi', 'pemulihan', 'stroke recovery', 'cedera olahraga'],
    
    // LAKTASI (1 poli)
    'laktasi': ['asi', 'menyusui', 'payudara bengkak', 'asi sedikit', 'puting lecet', 'asi tidak keluar', 'konsultasi menyusui']
  }

  /**
   * Fetch poli data from API (with caching)
   */
  private static async fetchPolis(token?: string): Promise<Poli[]> {
    if (this.poliCache) {
      return this.poliCache;
    }

    if (!token) {
      throw new Error('Unauthorized: token required');
    }

    try {
      const headers: HeadersInit = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${baseApiUrl}/polis`, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch polis');
      }
      const data = await response.json();
      this.poliCache = data;
      return data;
    } catch (error) {
      console.error('Error fetching polis:', error);
      // Return empty array on auth failure to prevent fallback misuse
      return [];
    }
  }

  /**
   * Match poli name from database with keyword category
   */
  private static matchPoliToKeywords(poliName: string): string | null {
    const normalized = poliName.toLowerCase();
    
    // Direct keyword match
    for (const keyword of Object.keys(this.poliKeywords)) {
      if (normalized.includes(keyword)) {
        return keyword;
      }
    }
    
    return null;
  }

  /**
   * Select best poli for a category with preference rules
   * - Prioritize nama yang mengandung "reguler"
   * - Deprioritize "kapitasi" / "pensiunan"
   */
  private static selectPoliByCategory(polis: Poli[], category: string): Poli | undefined {
    const candidates = polis.filter(p => this.matchPoliToKeywords(p.name) === category);
    if (candidates.length === 0) return undefined;

    const scoreName = (name: string) => {
      const n = name.toLowerCase();
      let score = 0;
      if (n.includes('reguler')) score += 3;
      if (n.includes('umum') && !n.includes('kapitasi')) score += 2;
      if (n.includes('kapitasi') || n.includes('pensiunan')) score -= 3;
      return score;
    };

    return [...candidates].sort((a, b) => scoreName(b.name) - scoreName(a.name))[0];
  }

  /**
   * Analyze symptoms and recommend appropriate poli
   */
  static async analyzeSymptoms(symptoms: string, token?: string): Promise<DiagnosisResult> {
    // Fetch real poli data from API
    const polis = await this.fetchPolis(token);
    const poliUmum = this.selectPoliByCategory(polis, 'umum') || polis[0];
    
    // Normalize input
    const normalizedSymptoms = symptoms.toLowerCase().trim();
    
    if (!normalizedSymptoms || normalizedSymptoms.length < 3) {
      return {
        recommendedPoli: poliUmum,
        confidence: 50,
        reason: 'Gejala tidak cukup spesifik. Silakan konsultasi di Poli Umum terlebih dahulu.',
        alternativePoli: []
      };
    }

    // Score each keyword category based on symptom matching
    const categoryScores: Array<{ category: string; score: number; matchedKeywords: string[] }> = [];

    for (const [category, keywords] of Object.entries(this.poliKeywords)) {
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
        categoryScores.push({
          category,
          score,
          matchedKeywords
        });
      }
    }

    // Sort by score
    categoryScores.sort((a, b) => b.score - a.score);

    // If no match found, default to Poli Umum
    if (categoryScores.length === 0) {
      return {
        recommendedPoli: poliUmum,
        confidence: 60,
        reason: 'Gejala yang disebutkan cocok untuk pemeriksaan umum. Dokter umum akan mengarahkan jika perlu spesialis.',
        alternativePoli: []
      };
    }

    // Map top categories to actual poli from database
    const topCategory = categoryScores[0];
    const matchedPoli = this.selectPoliByCategory(polis, topCategory.category) || this.selectPoliByCategory(polis, 'umum');
    
    if (!matchedPoli) {
      return {
        recommendedPoli: poliUmum,
        confidence: 60,
        reason: `Gejala "${topCategory.matchedKeywords.slice(0, 2).join(', ')}" terdeteksi, namun akan lebih baik konsultasi di Poli Umum terlebih dahulu.`,
        alternativePoli: []
      };
    }

    // Find alternative polis
    const alternatives: Poli[] = [];
    for (let i = 1; i < Math.min(categoryScores.length, 3); i++) {
      const altPoli = this.selectPoliByCategory(polis, categoryScores[i].category);
      if (altPoli && altPoli.id !== matchedPoli.id) {
        alternatives.push(altPoli);
      }
    }

    // Calculate confidence with calibrated factors (avoid flat 95%)
    const totalScore = categoryScores.reduce((sum, s) => sum + s.score, 0);
    const nextScore = categoryScores[1]?.score ?? 0;
    const matchCount = topCategory.matchedKeywords.length;

    // Separation: how much top beats runner-up (range ~0.6 - 1)
    const separationRatio = nextScore > 0
      ? (topCategory.score - nextScore) / (topCategory.score + nextScore)
      : 0.9; // single category matched
    const separationFactor = 0.6 + 0.4 * Math.max(0, Math.min(1, separationRatio));

    // Specificity: more distinct keywords → higher confidence
    const specificityFactor = matchCount >= 3
      ? 1
      : matchCount === 2
        ? 0.9
        : 0.78; // 1 keyword => lower confidence

    const base = (topCategory.score / totalScore) * 100;
    const confidenceRaw = base * separationFactor * specificityFactor;
    const confidence = Math.max(50, Math.min(90, Math.round(confidenceRaw)));

    // Generate reason
    const reason = this.generateReason(matchedPoli.name, topCategory.matchedKeywords);

    return {
      recommendedPoli: matchedPoli,
      confidence,
      reason,
      alternativePoli: alternatives.length > 0 ? alternatives : undefined
    };
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private static generateReason(poliName: string, keywords: string[]): string {
    const keywordList = keywords.slice(0, 3).join(', ');
    const normalized = poliName.toLowerCase();
    
    // Generate dynamic reason based on poli type
    if (normalized.includes('umum')) {
      return `Gejala "${keywordList}" cocok untuk pemeriksaan umum. Dokter umum dapat memberikan penanganan awal atau merujuk ke spesialis jika diperlukan.`;
    } else if (normalized.includes('jantung') || normalized.includes('kardio')) {
      return `Gejala "${keywordList}" berkaitan dengan kesehatan jantung dan pembuluh darah. Disarankan konsultasi dengan dokter spesialis jantung.`;
    } else if (normalized.includes('anak') || normalized.includes('pediatri')) {
      return `Gejala "${keywordList}" berkaitan dengan kesehatan anak. Dokter spesialis anak akan memberikan penanganan yang tepat.`;
    } else if (normalized.includes('tumbuh kembang')) {
      return `Keluhan "${keywordList}" berkaitan dengan pertumbuhan dan perkembangan anak. Konsultasi dengan ahli tumbuh kembang diperlukan.`;
    } else if (normalized.includes('imunisasi')) {
      return `Untuk keperluan "${keywordList}". Silakan kunjungi poli imunisasi untuk mendapatkan vaksinasi.`;
    } else if (normalized.includes('gigi') || normalized.includes('mulut') || normalized.includes('orthodonti') || normalized.includes('prosthodonsi') || normalized.includes('periodonti') || normalized.includes('konservasi')) {
      return `Keluhan "${keywordList}" berkaitan dengan kesehatan gigi dan mulut. Silakan konsultasi dengan dokter gigi spesialis.`;
    } else if (normalized.includes('mata') || normalized.includes('oftalmologi')) {
      return `Gejala "${keywordList}" berkaitan dengan kesehatan mata. Dokter spesialis mata akan melakukan pemeriksaan lebih lanjut.`;
    } else if (normalized.includes('tht')) {
      return `Keluhan "${keywordList}" berkaitan dengan telinga, hidung, dan tenggorokan. Disarankan konsultasi dengan dokter spesialis THT.`;
    } else if (normalized.includes('kandungan') || normalized.includes('obgyn') || normalized.includes('obsgy')) {
      return `Gejala "${keywordList}" berkaitan dengan kesehatan reproduksi wanita. Silakan konsultasi dengan dokter spesialis kandungan.`;
    } else if (normalized.includes('fertilitas')) {
      return `Keluhan "${keywordList}" berkaitan dengan program kehamilan. Konsultasi dengan dokter fertilitas akan membantu Anda.`;
    } else if (normalized.includes('penyakit dalam') || normalized.includes('dalam')) {
      return `Gejala "${keywordList}" berkaitan dengan penyakit dalam. Dokter spesialis penyakit dalam akan memberikan diagnosis lebih lanjut.`;
    } else if (normalized.includes('diabetes')) {
      return `Keluhan "${keywordList}" berkaitan dengan diabetes atau gula darah. Konsultasi dengan dokter spesialis diabetes terpadu diperlukan.`;
    } else if (normalized.includes('gizi') || normalized.includes('obesitas')) {
      return `Keluhan "${keywordList}" berkaitan dengan gizi dan berat badan. Konsultasi dengan ahli gizi akan membantu Anda.`;
    } else if (normalized.includes('bedah')) {
      return `Kondisi "${keywordList}" mungkin memerlukan tindakan bedah. Silakan konsultasi dengan dokter bedah spesialis.`;
    } else if (normalized.includes('urologi')) {
      return `Keluhan "${keywordList}" berkaitan dengan saluran kemih. Konsultasi dengan dokter urologi diperlukan.`;
    } else if (normalized.includes('onkologi')) {
      return `Kondisi "${keywordList}" memerlukan penanganan khusus. Dokter onkologi akan memberikan evaluasi dan penanganan terbaik.`;
    } else if (normalized.includes('kulit') || normalized.includes('kelamin')) {
      return `Keluhan "${keywordList}" berkaitan dengan kesehatan kulit. Dokter spesialis kulit akan memberikan penanganan yang tepat.`;
    } else if (normalized.includes('saraf') || normalized.includes('neuro')) {
      return `Gejala "${keywordList}" berkaitan dengan sistem saraf. Disarankan konsultasi dengan dokter spesialis saraf.`;
    } else if (normalized.includes('nyeri')) {
      return `Keluhan "${keywordList}" berkaitan dengan manajemen nyeri. Dokter spesialis nyeri akan membantu menangani kondisi Anda.`;
    } else if (normalized.includes('psikiatri') || normalized.includes('jiwa')) {
      return `Keluhan "${keywordList}" berkaitan dengan kesehatan mental. Dokter psikiater akan membantu menangani kondisi Anda.`;
    } else if (normalized.includes('paru')) {
      return `Gejala "${keywordList}" berkaitan dengan sistem pernapasan. Konsultasi dengan dokter spesialis paru diperlukan.`;
    } else if (normalized.includes('rehab') || normalized.includes('fisioterapi') || normalized.includes('medik')) {
      return `Kondisi "${keywordList}" memerlukan rehabilitasi medik. Terapis akan membantu pemulihan Anda.`;
    } else if (normalized.includes('laktasi')) {
      return `Keluhan "${keywordList}" berkaitan dengan menyusui. Konsultan laktasi akan membantu Anda.`;
    } else if (normalized.includes('kapitasi')) {
      return `Untuk peserta kapitasi/pensiunan Pertamina. Silakan konsultasi di Poli Umum Kapitasi.`;
    }

    return `Berdasarkan gejala "${keywordList}", sistem merekomendasikan ${poliName}. Silakan konsultasi dengan dokter untuk diagnosis yang tepat.`;
  }

  /**
   * Get all available poli from API
   */
  static async getAllPoli(token?: string): Promise<Poli[]> {
    return this.fetchPolis(token);
  }
}
