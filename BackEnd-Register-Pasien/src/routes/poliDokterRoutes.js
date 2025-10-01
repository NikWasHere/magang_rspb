// ===== ROUTES: poliDokterRoutes.js =====
import express from 'express';
import * as poliDokterController from '../controllers/poliDokterController.js';
const router = express.Router();

router.get('/', poliDokterController.getAllPoliDokter);
router.get('/:id', poliDokterController.getPoliDokterById);
router.post('/', poliDokterController.createPoliDokter);
router.put('/:id', poliDokterController.updatePoliDokter);
router.delete('/:id', poliDokterController.deletePoliDokter);

export default router;
