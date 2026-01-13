import prisma from '../config/database';

// ===========================
// SHIFTING TO OT
// ===========================

export async function createShiftingToOT(data: {
  patientId: string;
  shiftingDate: Date;
  shiftingTime: string;
  shiftedBy: string;
  consentVerified: boolean;
  nbmStatus: boolean;
  preOpMedication: boolean;
  investigationsAttached: boolean;
  ivLineSecured: boolean;
  identificationVerified: boolean;
  vitals: {
    bp: string;
    pulse: number;
    temp: number;
    respiration: number;
    spo2: number;
  };
  notes?: string;
}) {
  const shiftingRecord = await prisma.shiftingToOT.create({
    data: {
      patientId: data.patientId,
      shiftingDate: data.shiftingDate,
      shiftingTime: data.shiftingTime,
      shiftedBy: data.shiftedBy,
      consentVerified: data.consentVerified,
      nbmStatus: data.nbmStatus,
      preOpMedication: data.preOpMedication,
      investigationsAttached: data.investigationsAttached,
      ivLineSecured: data.ivLineSecured,
      identificationVerified: data.identificationVerified,
      vitals: data.vitals,
      notes: data.notes,
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

  // Update patient status to IN_OT
  await prisma.patient.update({
    where: { id: data.patientId },
    data: { status: 'IN_OT' },
  });

  return shiftingRecord;
}

export async function getShiftingToOTByPatientId(patientId: string) {
  return await prisma.shiftingToOT.findMany({
    where: { patientId },
    orderBy: { shiftingDate: 'desc' },
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

export async function getShiftingToOTById(id: string) {
  return await prisma.shiftingToOT.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}

// ===========================
// RECEIVING IN OT
// ===========================

export async function createReceivingInOT(data: {
  patientId: string;
  receivingDate: Date;
  receivingTime: string;
  receivedBy: string;
  handedOverBy: string;
  identityVerified: boolean;
  procedureVerified: boolean;
  consentVerified: boolean;
  siteMarked: boolean;
  investigationsChecked: boolean;
  consciousness: string;
  vitals: {
    bp: string;
    pulse: number;
    temp: number;
    respiration: number;
    spo2: number;
  };
  notes?: string;
}) {
  const receivingRecord = await prisma.receivingInOT.create({
    data: {
      patientId: data.patientId,
      receivingDate: data.receivingDate,
      receivingTime: data.receivingTime,
      receivedBy: data.receivedBy,
      handedOverBy: data.handedOverBy,
      identityVerified: data.identityVerified,
      procedureVerified: data.procedureVerified,
      consentVerified: data.consentVerified,
      siteMarked: data.siteMarked,
      investigationsChecked: data.investigationsChecked,
      consciousness: data.consciousness,
      vitals: data.vitals,
      notes: data.notes,
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

  return receivingRecord;
}

export async function getReceivingInOTByPatientId(patientId: string) {
  return await prisma.receivingInOT.findMany({
    where: { patientId },
    orderBy: { receivingDate: 'desc' },
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

export async function getReceivingInOTById(id: string) {
  return await prisma.receivingInOT.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}

// ===========================
// PRE-OP CHECKLIST
// ===========================

export async function createPreOpChecklist(data: {
  patientId: string;
  patientIdentified: boolean;
  wristbandChecked: boolean;
  consentSigned: boolean;
  procedureSiteMarked: boolean;
  nbmVerified: boolean;
  allergiesDocumented: boolean;
  investigationsReviewed: boolean;
  bloodArranged?: boolean;
  checklistItems: any;
  completedBy: string;
  completedAt: Date;
}) {
  return await prisma.preOpChecklist.create({
    data: {
      patientId: data.patientId,
      patientIdentified: data.patientIdentified,
      wristbandChecked: data.wristbandChecked,
      consentSigned: data.consentSigned,
      procedureSiteMarked: data.procedureSiteMarked,
      nbmVerified: data.nbmVerified,
      allergiesDocumented: data.allergiesDocumented,
      investigationsReviewed: data.investigationsReviewed,
      bloodArranged: data.bloodArranged,
      checklistItems: data.checklistItems,
      completedBy: data.completedBy,
      completedAt: data.completedAt,
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

export async function getPreOpChecklistByPatientId(patientId: string) {
  return await prisma.preOpChecklist.findMany({
    where: { patientId },
    orderBy: { completedAt: 'desc' },
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
