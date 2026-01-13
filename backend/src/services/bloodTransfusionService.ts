import prisma from '../config/database';

export async function createBloodTransfusion(data: {
  patientId: string;
  orderedById: string;
  productType: string;
  bloodGroup: string;
  units: number;
  bagNumber: string;
  crossMatchDone: boolean;
  crossMatchResult?: string;
  startTime?: Date;
  endTime?: Date;
  preVitals?: any;
  monitoringChart?: any;
  postVitals?: any;
  reactions?: string;
  management?: string;
  status?: string;
  administeredBy?: string;
  witnessedBy?: string;
  notes?: string;
}) {
  return await prisma.bloodTransfusion.create({
    data: {
      ...data,
      status: (data.status as any) || 'ORDERED',
    },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      orderedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getBloodTransfusionsByPatientId(patientId: string) {
  return await prisma.bloodTransfusion.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      orderedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getBloodTransfusionById(id: string) {
  return await prisma.bloodTransfusion.findUnique({
    where: { id },
    include: {
      patient: true,
      orderedBy: true,
    },
  });
}

export async function updateBloodTransfusion(id: string, data: any) {
  return await prisma.bloodTransfusion.update({
    where: { id },
    data,
  });
}
