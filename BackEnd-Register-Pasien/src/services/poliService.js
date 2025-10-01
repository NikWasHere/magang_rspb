// ===== SERVICE: poliService.js =====
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllPolis = () => prisma.polis.findMany();

export const getPoliById = (id) => prisma.polis.findUnique({ where: { id } });

export const createPoli = (data) => prisma.polis.create({ data });

export const updatePoli = (id, data) => prisma.polis.update({ where: { id }, data });

export const deletePoli = (id) => prisma.polis.delete({ where: { id } });
