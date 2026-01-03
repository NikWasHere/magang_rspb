// ===== SERVICE: registrationService.js =====
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllRegistrations = () =>
  prisma.registrations.findMany({
    include: {
      polis: {
        select: {
          id: true,
          name: true
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      dokters: {
        select: {
          id: true,
          name: true,
          specialization: true
        }
      }
    },
    orderBy: [
      { poli_id: 'asc' },
      { queue_number: 'asc' }
    ]
  });

export const getRegistrationById = (id) =>
  prisma.registrations.findUnique({
    where: { id },
    include: {
      polis: {
        select: {
          id: true,
          name: true
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      dokters: {
        select: {
          id: true,
          name: true,
          specialization: true
        }
      }
    }
  });

export const createRegistration = async (data) => {
  // Get next queue number for this poli today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const lastQueue = await prisma.registrations.findFirst({
    where: {
      poli_id: data.poli_id,
      created_at: {
        gte: today,
        lt: tomorrow
      }
    },
    orderBy: {
      queue_number: 'desc'
    }
  });

  const nextQueueNumber = (lastQueue?.queue_number || 0) + 1;

  return prisma.registrations.create({ 
    data: {
      ...data,
      queue_number: nextQueueNumber
    }
  });
};

export const getRegistrationsByPoli = (poliId) => {
  console.log('🏥 Searching for poli_id:', parseInt(poliId));

  return prisma.registrations.findMany({
    where: {
      poli_id: parseInt(poliId)
    },
    include: {
      polis: {
        select: {
          id: true,
          name: true
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      dokters: {
        select: {
          id: true,
          name: true,
          specialization: true
        }
      }
    },
    orderBy: {
      queue_number: 'asc'
    }
  });
};

export const getRegistrationsByUser = (userId) =>
  prisma.registrations.findMany({
    where: { user_id: userId },
    include: {
      polis: {
        select: {
          id: true,
          name: true
        }
      },
      dokters: {
        select: {
          id: true,
          name: true,
          specialization: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

export const updateRegistration = (id, data) =>
  prisma.registrations.update({ where: { id }, data });

export const deleteRegistration = (id) =>
  prisma.registrations.delete({ where: { id } });
