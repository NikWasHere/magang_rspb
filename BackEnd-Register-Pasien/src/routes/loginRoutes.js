// routes/authRoutes.js
import express from 'express';
import { loginUser, logout } from '../controllers/loginController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', loginUser);            // login with remember option
router.post('/logout', requireAuth(), logout);  // logout (clear token)

export default router;