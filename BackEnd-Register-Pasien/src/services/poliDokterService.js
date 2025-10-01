// ===== SERVICE: poliDokterService.js =====
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllPoliDokter = () => prisma.poli_dokter.findMany();

export const getPoliDokterById = (id) => prisma.poli_dokter.findUnique({ where: { id } });

export const createPoliDokter = (data) => prisma.poli_dokter.create({ data });

export const updatePoliDokter = (id, data) => prisma.poli_dokter.update({ where: { id }, data });

export const deletePoliDokter = (id) => prisma.poli_dokter.delete({ where: { id } });