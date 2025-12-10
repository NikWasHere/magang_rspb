// services/authService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const registerUser = async (data) => {
  const { username, email, password } = data;

  const existingEmail = await prisma.users.findUnique({ where: { email } });
  if (existingEmail) throw new Error('Email sudah terdaftar');

  if (!password || password.length < 6) throw new Error('Password minimal 6 karakter');

  return await prisma.users.create({
    data: { username, email, password, role: 'pasien' },
    select: { id: true, username: true, email: true, role: true }
  });
};
