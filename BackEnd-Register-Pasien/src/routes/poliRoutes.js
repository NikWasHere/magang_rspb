// ===== ROUTES: poliRoutes.js =====
import express from 'express';
import * as poliController from '../controllers/poliController.js';
const router = express.Router();

router.get('/', poliController.getAllPolis);
router.get('/:id', poliController.getPoliById);
router.post('/', poliController.createPoli);
router.put('/:id', poliController.updatePoli);
router.delete('/:id', poliController.deletePoli);

export default router;
