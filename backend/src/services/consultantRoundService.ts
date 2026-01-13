import prisma from '../config/database';

export async function createConsultantRound(data: {
  patientId: string;
  consultantId: string;
  roundDate: Date;
  roundTime: string;
  clinicalStatus: string;
  vitals?: any;
  examination?: string;
  investigationsReview?: string;
  currentTreatmentReview?: string;
  newOrders?: string;
  modifications?: string;
  plan: string;
  expectedDischarge?: Date;
}) {
  return await prisma.consultantRound.create({
    data,
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      consultant: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getConsultantRoundsByPatientId(patientId: string) {
  return await prisma.consultantRound.findMany({
    where: { patientId },
    orderBy: { roundDate: 'desc' },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      consultant: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getConsultantRoundById(id: string) {
  return await prisma.consultantRound.findUnique({
    where: { id },
    include: {
      patient: true,
      consultant: true,
    },
  });
}
