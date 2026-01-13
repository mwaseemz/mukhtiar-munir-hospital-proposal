import prisma from '../config/database';

export async function createInputOutputChart(data: {
  patientId: string;
  date: Date;
  time: string;
  oralIntake?: number;
  ivFluids?: number;
  bloodProducts?: number;
  otherIntake?: number;
  urineOutput?: number;
  drainOutput?: number;
  vomiting?: number;
  otherOutput?: number;
  recordedBy: string;
}) {
  const totalIntake = (data.oralIntake || 0) + (data.ivFluids || 0) + (data.bloodProducts || 0) + (data.otherIntake || 0);
  const totalOutput = (data.urineOutput || 0) + (data.drainOutput || 0) + (data.vomiting || 0) + (data.otherOutput || 0);
  const balance = totalIntake - totalOutput;

  return await prisma.inputOutputChart.create({
    data: {
      ...data,
      totalIntake,
      totalOutput,
      balance,
    },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getInputOutputByPatientId(patientId: string) {
  return await prisma.inputOutputChart.findMany({
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
    },
  });
}

export async function getInputOutputById(id: string) {
  return await prisma.inputOutputChart.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}
