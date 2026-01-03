// ===== ROUTES: registrationRoutes.js =====
import express from 'express';
import * as registrationController from '../controllers/registrationController.js';

const router = express.Router();

router.get('/', registrationController.getAllRegistrations);
router.get('/by-poli/:poliId', registrationController.getRegistrationsByPoli);
router.get('/user/:userId', registrationController.getRegistrationsByUser);
router.get('/:id', registrationController.getRegistrationById);
router.post('/', (req, res, next) => {
  registrationController.upload(req, res, (err) => {
    if (err) {
      console.log('❌ Upload error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    console.log('✅ Files uploaded successfully');
    registrationController.createRegistration(req, res, next);
  });
});
router.put('/:id', registrationController.upload, registrationController.updateRegistration);
router.delete('/:id', registrationController.deleteRegistration);

export default router;
