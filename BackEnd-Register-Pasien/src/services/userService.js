import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllUsers = () => prisma.users.findMany();

export const getUserById = (id) =>
  prisma.users.findUnique({ where: { id } });

export const createUser = (data) =>
  prisma.users.create({ data });

export const updateUser = (id, data) =>
  prisma.users.update({ where: { id }, data });

export const deleteUser = (id) =>
  prisma.users.delete({ where: { id } });
