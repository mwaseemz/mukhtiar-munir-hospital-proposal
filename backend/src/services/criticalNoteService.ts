import prisma from '../config/database';

export async function createCriticalNote(data: {
  patientId: string;
  recordedById: string;
  date: Date;
  time: string;
  eventType: string;
  description: string;
  vitals: any;
  consciousness: string;
  actionsTaken: string;
  medications?: any;
  procedures?: any;
  outcome?: string;
  relativesInformed?: boolean;
  consultantInformed?: boolean;
}) {
  return await prisma.criticalNote.create({
    data: {
      ...data,
      eventType: data.eventType as any,
    },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      recordedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getCriticalNotesByPatientId(patientId: string) {
  return await prisma.criticalNote.findMany({
    where: { patientId },
    orderBy: [{ date: 'desc' }, { time: 'desc' }],
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      recordedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getCriticalNoteById(id: string) {
  return await prisma.criticalNote.findUnique({
    where: { id },
    include: {
      patient: true,
      recordedBy: true,
    },
  });
}
