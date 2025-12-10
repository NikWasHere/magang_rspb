import express from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Profile routes (protected) - HARUS DI ATAS /:id
router.get('/profile/me', requireAuth(), userController.getProfile);
router.put('/profile/me', requireAuth(), userController.updateProfile);
router.post('/profile/photo/upload', requireAuth(), upload.single('photo'), userController.uploadPhoto);
router.put('/profile/photo', requireAuth(), userController.updatePhoto);
router.put('/profile/password', requireAuth(), userController.changePassword);

// General user routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
