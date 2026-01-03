import * as dokterService from '../services/dokterService.js';

export const getAllDokters = async (req, res) => {
  try {
    console.log('📋 Fetching all dokters...')
    const dokters = await dokterService.getAllDokters();
    console.log(`✅ Raw data from service:`, JSON.stringify(dokters.slice(0, 1), null, 2))
    
    // If no dokters, return empty array (don't error)
    if (!dokters || dokters.length === 0) {
      console.log('⚠️ No dokters found in database')
      return res.json([])
    }
    
    // Map field names to match frontend expectations
    const mappedDokters = dokters.map(d => {
      return {
        id: d.id,
        name: d.name || '',
        specialization: d.specialization || '',
        phone: d.phone || '',
        poli: d.poli_dokter && d.poli_dokter.length > 0 ? {
          id: d.poli_dokter[0]?.polis?.id,
          name: d.poli_dokter[0]?.polis?.name
        } : null,
        photoUrl: d.photoUrl || null
      }
    });
    
    console.log('📤 Sending mapped dokters:', JSON.stringify(mappedDokters.slice(0, 1)))
    res.json(mappedDokters);
  } catch (error) {
    console.error('❌ Error in getAllDokters:', error)
    res.status(500).json({ message: 'Failed to get dokters', error: error.message });
  }
};

export const getDokterById = async (req, res) => {
  try {
    const dokter = await dokterService.getDokterById(+req.params.id);
    if (!dokter) return res.status(404).json({ message: 'Dokter not found' });
    
    // Map field names
    const mappedDokter = {
      id: dokter.id,
      nama: dokter.name,
      spesialisasi: dokter.specialization,
      telepon: dokter.phone,
      poli: dokter.poli_dokter && dokter.poli_dokter.length > 0 ? {
        id: dokter.poli_dokter[0]?.polis?.id,
        nama: dokter.poli_dokter[0]?.polis?.name
      } : null,
      jadwal: dokter.poli_dokter && dokter.poli_dokter.length > 0 ? [
        { hari: 'Senin', jam_mulai: dokter.poli_dokter[0]?.jadwal_senin, jam_selesai: '' },
        { hari: 'Selasa', jam_mulai: dokter.poli_dokter[0]?.jadwal_selasa, jam_selesai: '' },
        { hari: 'Rabu', jam_mulai: dokter.poli_dokter[0]?.jadwal_rabu, jam_selesai: '' },
        { hari: 'Kamis', jam_mulai: dokter.poli_dokter[0]?.jadwal_kamis, jam_selesai: '' },
        { hari: 'Jumat', jam_mulai: dokter.poli_dokter[0]?.jadwal_jumat, jam_selesai: '' },
        { hari: 'Sabtu', jam_mulai: dokter.poli_dokter[0]?.jadwal_sabtu, jam_selesai: '' },
        { hari: 'Minggu', jam_mulai: dokter.poli_dokter[0]?.jadwal_minggu, jam_selesai: '' }
      ].filter(j => j.jam_mulai) : [],
      photoUrl: dokter.photoUrl
    };
    
    res.json(mappedDokter);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get dokter', error });
  }
};

export const createDokter = async (req, res) => {
  try {
    const { name, shift, specialization, phone } = req.body;
    
    const newDokter = await dokterService.createDokter({
      name,
      shift,
      specialization,
      phone,
      photo: req.file ? `/uploads/dokter/${req.file.filename}` : null
    });

    res.status(201).json(newDokter);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menambah dokter', error: error.message });
  }
};


export const updateDokter = async (req, res) => {
  try {
    const updated = await dokterService.updateDokter(+req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update dokter', error });
  }
};

export const deleteDokter = async (req, res) => {
  try {
    await dokterService.deleteDokter(+req.params.id);
    res.json({ message: 'Dokter deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete dokter', error });
  }
};
