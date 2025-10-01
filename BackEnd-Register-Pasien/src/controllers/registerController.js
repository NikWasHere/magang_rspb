// controllers/authController.js
import * as registerService from '../services/registerService.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerService.registerUser({ username, email, password });

    res.status(201).json({
      message: 'Registrasi berhasil',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

