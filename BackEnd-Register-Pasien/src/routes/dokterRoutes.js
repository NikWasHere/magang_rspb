// routes/dokterRoutes.js
import express from 'express';
import { 
  getAllDokters, 
  getDokterById, 
  createDokter, 
  updateDokter, 
  deleteDokter, 
  upload 
} from '../controllers/dokterController.js';

const router = express.Router();

router.get('/', getAllDokters);
router.get('/:id', getDokterById);
router.post('/', upload.single('photo'), createDokter);
router.put('/:id', updateDokter);
router.delete('/:id', deleteDokter);

export default router;
