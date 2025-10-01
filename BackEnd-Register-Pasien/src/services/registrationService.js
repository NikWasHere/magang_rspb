// ===== SERVICE: registrationService.js =====
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllRegistrations = () =>
  prisma.registrations.findMany({
    include: {
      polis: true,
      users: true
    }
  });

export const getRegistrationById = (id) =>
  prisma.registrations.findUnique({
    where: { id },
    include: {
      polis: true,
      users: true
    }
  });

export const createRegistration = (data) =>
  prisma.registrations.create({ data });

export const updateRegistration = (id, data) =>
  prisma.registrations.update({ where: { id }, data });

export const deleteRegistration = (id) =>
  prisma.registrations.delete({ where: { id } });
