// routes/dokterRoutes.js
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
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
router.post('/', requireAuth(['admin']), upload.single('photo'), createDokter);
router.put('/:id', requireAuth(['admin']), updateDokter);
router.delete('/:id', requireAuth(['admin']), deleteDokter);

export default router;
