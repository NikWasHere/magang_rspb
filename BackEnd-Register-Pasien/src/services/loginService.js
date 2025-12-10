// services/authService.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const TOKEN_TTL = '7d'; // Token expiry if remember=true

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET belum dikonfigurasi');
  return jwt.sign(payload, secret, { expiresIn: TOKEN_TTL });
};

// ✅ LOGIN: verify password, issue token, optionally save if remember=true
export const loginUser = async ({ email, password, remember = false }) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('Email tidak ditemukan');

  // Simple password comparison (no hashing for learning purposes)
  if (user.password !== password) throw new Error('Password salah');

  const token = signToken({ sub: user.id, role: user.role });

  // If remember=true, save token to database
  if (remember) {
    await prisma.users.update({ 
      where: { id: user.id }, 
      data: { token, remember: true } 
    });
  } else {
    await prisma.users.update({ 
      where: { id: user.id }, 
      data: { token: null, remember: false } 
    });
  }

  return { user, token };
};

// ✅ LOGOUT: clear token
export const logout = async ({ userId }) => {
  await prisma.users.update({ 
    where: { id: userId }, 
    data: { token: null, remember: false } 
  });
  return { success: true };
};