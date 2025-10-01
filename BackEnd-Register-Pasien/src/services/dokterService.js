import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllDokters = async () => {
  const dokters = await prisma.dokters.findMany();

  return dokters.map(dokter => ({
    ...dokter,
    photoUrl: dokter.photo 
      ? `http://localhost:3000/${dokter.photo.replace(/\\/g, '/')}` 
      : null
  }));
};


export const getDokterById = (id) => prisma.dokters.findUnique({ where: { id } });

export const createDokter = (data) => prisma.dokters.create({ data });

export const updateDokter = (id, data) => prisma.dokters.update({ where: { id }, data });

export const deleteDokter = (id) => prisma.dokters.delete({ where: { id } });
