import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllDokters = async () => {
  try {
    console.log('🔍 Querying dokters with poli_dokter include...')
    const dokters = await prisma.dokters.findMany({
      include: {
        poli_dokter: {
          include: {
            polis: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    console.log(`✅ Query returned ${dokters.length} dokters`)

    return dokters.map(dokter => {
      let photoUrl = null;
      if (dokter.photo) {
        // Handle malformed URLs like: http://localhost:3001/https://rspb.ihc.id/...
        // Extract the actual URL after localhost:3001/
        let photoStr = dokter.photo;
        if (photoStr.includes('http://localhost:3001/http')) {
          // Remove the localhost:3001 prefix
          photoStr = photoStr.replace('http://localhost:3001/', '');
        }
        photoUrl = photoStr;
      }
      return {
        ...dokter,
        photoUrl
      };
    });
  } catch (err) {
    console.error('❌ Error in getAllDokters service:', err)
    throw err
  }
};


export const getDoktersByPoli = async (poliId) => {
  return prisma.dokters.findMany({
    where: {
      poli_dokter: {
        some: {
          poli_id: poliId
        }
      }
    },
    include: {
      poli_dokter: {
        where: {
          poli_id: poliId
        },
        include: {
          polis: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};

export const getDokterById = (id) => prisma.dokters.findUnique({ 
  where: { id },
  include: {
    poli_dokter: {
      include: {
        polis: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }
  }
});

export const createDokter = (data) => prisma.dokters.create({ data });

export const updateDokter = (id, data) => prisma.dokters.update({ where: { id }, data });

export const deleteDokter = (id) => prisma.dokters.delete({ where: { id } });
