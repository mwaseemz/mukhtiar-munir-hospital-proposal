import prisma from '../config/database';

export async function createBabyReceiving(data: {
  patientId: string;
  babyName?: string;
  gender: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  birthWeight: number;
  length?: number;
  headCircumference?: number;
  deliveryType: string;
  gestationalAge: string;
  apgarScore1Min: number;
  apgarScore5Min: number;
  resuscitationRequired: boolean;
  resuscitationDetails?: string;
  generalAppearance: string;
  cryingStatus: string;
  activityLevel: string;
  skinColor: string;
  feedingInitiated: boolean;
  feedingType?: string;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  congenitalAbnormalities?: string;
  status?: string;
  notes?: string;
}) {
  return await prisma.babyReceiving.create({
    data: {
      ...data,
      gender: data.gender as any,
      deliveryType: data.deliveryType as any,
      status: (data.status as any) || 'WITH_MOTHER',
    },
    include: {
      mother: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getBabyReceivingByPatientId(patientId: string) {
  return await prisma.babyReceiving.findMany({
    where: { patientId },
    orderBy: { dateOfBirth: 'desc' },
    include: {
      mother: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getBabyReceivingById(id: string) {
  return await prisma.babyReceiving.findUnique({
    where: { id },
    include: {
      mother: true,
    },
  });
}

export async function updateBabyReceiving(id: string, data: any) {
  return await prisma.babyReceiving.update({
    where: { id },
    data,
  });
}
