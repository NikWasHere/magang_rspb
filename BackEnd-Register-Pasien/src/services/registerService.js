// services/authService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const registerUser = async (data) => {
  const { username, email, password } = data;

  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email sudah terdaftar');

  return await prisma.users.create({
    data: { username, email, password },
  });
};
