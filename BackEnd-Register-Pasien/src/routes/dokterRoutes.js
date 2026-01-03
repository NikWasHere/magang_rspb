// routes/dokterRoutes.js
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { dokterUpload } from '../middleware/upload.js';
import { 
  getAllDokters, 
  getDokterById, 
  getDoktersByPoli,
  createDokter, 
  updateDokter, 
  deleteDokter
} from '../controllers/dokterController.js';

const router = express.Router();

router.get('/', getAllDokters);
router.get('/by-poli/:poliId', getDoktersByPoli);
router.get('/:id', getDokterById);
router.post('/', requireAuth(['admin']), dokterUpload.single('photo'), createDokter);
router.put('/:id', requireAuth(['admin']), updateDokter);
router.delete('/:id', requireAuth(['admin']), deleteDokter);

export default router;
