// services/authService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// ✅ LOGIN
export const loginUser = async ({ email, password }) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('Email tidak ditemukan');

  if (user.password !== password) {
    throw new Error('Password salah');
  }

  return user;
};