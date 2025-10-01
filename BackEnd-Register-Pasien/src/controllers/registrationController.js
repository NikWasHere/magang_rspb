// ===== CONTROLLER: registrationController.js =====
import * as registrationService from '../services/registrationService.js';
import multer from 'multer';
import path from 'path';

// Konfigurasi Multer (multi upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/registrations');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname));
  }
});

// Upload field: ktp, kk, dokumen tambahan
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
}).fields([
  { name: 'photo_ktp', maxCount: 1 },
  { name: 'photo_kk', maxCount: 1 },
  { name: 'more_document', maxCount: 1 }
]);

export const getAllRegistrations = async (req, res) => {
  try {
    const regs = await registrationService.getAllRegistrations();
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get registrations', error });
  }
};

export const getRegistrationById = async (req, res) => {
  try {
    const reg = await registrationService.getRegistrationById(+req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json(reg);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get registration', error });
  }
};

export const createRegistration = async (req, res) => {
  try {
    const { user_id, poli_id, full_name, nik, no_kk, keluhan } = req.body;

    const newReg = await registrationService.createRegistration({
      user_id: parseInt(user_id),
      poli_id: parseInt(poli_id),
      full_name,
      nik,
      no_kk,
      keluhan,
      photo_ktp: req.files.photo_ktp
        ? `/uploads/registrations/${req.files.photo_ktp[0].filename}`
        : null,
      photo_kk: req.files.photo_kk
        ? `/uploads/registrations/${req.files.photo_kk[0].filename}`
        : null,
      more_document: req.files.more_document
        ? `/uploads/registrations/${req.files.more_document[0].filename}`
        : null
    });

    res.status(201).json(newReg);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create registration', error: error.message });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };

    if (req.files.photo_ktp) {
      dataToUpdate.photo_ktp = `/uploads/registrations/${req.files.photo_ktp[0].filename}`;
    }
    if (req.files.photo_kk) {
      dataToUpdate.photo_kk = `/uploads/registrations/${req.files.photo_kk[0].filename}`;
    }
    if (req.files.more_document) {
      dataToUpdate.more_document = `/uploads/registrations/${req.files.more_document[0].filename}`;
    }

    const updated = await registrationService.updateRegistration(+req.params.id, dataToUpdate);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update registration', error: error.message });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    await registrationService.deleteRegistration(+req.params.id);
    res.json({ message: 'Registration deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete registration', error });
  }
};
