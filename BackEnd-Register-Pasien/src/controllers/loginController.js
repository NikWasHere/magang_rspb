// ✅ LOGIN
import * as loginService from '../services/loginService.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password, remember = false } = req.body;
    const { user, token } = await loginService.loginUser({
      email,
      password,
      remember,
    });

    res.status(200).json({
      message: 'Login berhasil',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user?.id; // from authMiddleware
    if (!userId) throw new Error('User tidak terautentikasi');
    await loginService.logout({ userId });
    res.status(200).json({ message: 'Logout berhasil' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
