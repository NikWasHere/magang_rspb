// ===== ROUTES: poliRoutes.js =====
import express from 'express';
import * as poliController from '../controllers/poliController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

// Public endpoint - no auth required for viewing polis (needed for registration form)
router.get('/', poliController.getAllPolis);
router.get('/:id', poliController.getPoliById);

// Admin only endpoints
router.post('/', requireAuth(['admin']), poliController.createPoli);
router.put('/:id', requireAuth(['admin']), poliController.updatePoli);
router.delete('/:id', requireAuth(['admin']), poliController.deletePoli);

export default router;
