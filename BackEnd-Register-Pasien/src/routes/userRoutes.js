import express from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Profile routes (protected) - HARUS DI ATAS /:id
router.get('/profile/me', requireAuth(), userController.getProfile);
router.put('/profile/me', requireAuth(), userController.updateProfile);

// Handle multiple possible field names for photo upload
router.post('/profile/photo/upload', requireAuth(), (req, res, next) => {
  // Create multer middleware that accepts multiple field names
  const uploadMiddleware = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    // Normalize the file to req.file for controller compatibility
    if (req.files) {
      req.file = req.files.photo?.[0] || req.files.image?.[0] || req.files.file?.[0];
    }
    
    next();
  });
}, userController.uploadPhoto);

router.put('/profile/photo', requireAuth(), userController.updatePhoto);
router.put('/profile/password', requireAuth(), userController.changePassword);

// General user routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
