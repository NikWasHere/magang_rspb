// ✅ LOGIN
import * as loginService from '../services/loginService.js';
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginService.loginUser({ email, password });

    res.status(200).json({
      message: 'Login berhasil',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
