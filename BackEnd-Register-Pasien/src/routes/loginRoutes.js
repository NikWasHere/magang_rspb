// routes/authRoutes.js
import express from 'express';
import { loginUser } from '../controllers/loginController.js';

const router = express.Router();

router.post('/', loginUser);       // login

export default router;