// ===== ROUTES: poliRoutes.js =====
import express from 'express';
import * as poliController from '../controllers/poliController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', requireAuth(), poliController.getAllPolis);
router.get('/:id', requireAuth(), poliController.getPoliById);
router.post('/', requireAuth(['admin']), poliController.createPoli);
router.put('/:id', requireAuth(['admin']), poliController.updatePoli);
router.delete('/:id', requireAuth(['admin']), poliController.deletePoli);

export default router;
