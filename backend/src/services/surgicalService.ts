import prisma from '../config/database';

// ===========================
// OPERATION NOTES
// ===========================

export async function createOperationNotes(data: {
  patientId: string;
  surgeonId: string;
  operationDate: Date;
  startTime: string;
  endTime: string;
  duration?: string;
  surgeon: string;
  assistant?: string;
  anesthetist: string;
  nurses?: string;
  diagnosis: string;
  procedure: string;
  operativeFindings: string;
  incision?: string;
  procedureDetails: string;
  specimens?: string;
  drains?: string;
  closure?: string;
  estimatedBloodLoss?: string;
  fluidsGiven?: any;
  bloodTransfusion?: any;
  complications?: string;
  postOpDiagnosis: string;
  postOpInstructions: string;
}) {
  return await prisma.operationNotes.create({
    data: {
      patientId: data.patientId,
      surgeonId: data.surgeonId,
      operationDate: data.operationDate,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      surgeon: data.surgeon,
      assistant: data.assistant,
      anesthetist: data.anesthetist,
      nurses: data.nurses,
      diagnosis: data.diagnosis,
      procedure: data.procedure,
      operativeFindings: data.operativeFindings,
      incision: data.incision,
      procedureDetails: data.procedureDetails,
      specimens: data.specimens,
      drains: data.drains,
      closure: data.closure,
      estimatedBloodLoss: data.estimatedBloodLoss,
      fluidsGiven: data.fluidsGiven,
      bloodTransfusion: data.bloodTransfusion,
      complications: data.complications,
      postOpDiagnosis: data.postOpDiagnosis,
      postOpInstructions: data.postOpInstructions,
    },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      surgeonUser: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getOperationNotesByPatientId(patientId: string) {
  return await prisma.operationNotes.findMany({
    where: { patientId },
    orderBy: { operationDate: 'desc' },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      surgeonUser: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getOperationNotesById(id: string) {
  return await prisma.operationNotes.findUnique({
    where: { id },
    include: {
      patient: true,
      surgeonUser: true,
    },
  });
}

// ===========================
// POST-OP NOTES
// ===========================

export async function createPostOpNotes(data: {
  patientId: string;
  postOpDay: number;
  date: Date;
  generalCondition: string;
  consciousness: string;
  vitals: any;
  painScore?: number;
  woundCondition?: string;
  drainOutput?: string;
  cardiovascular?: string;
  respiratory?: string;
  gastrointestinal?: string;
  genitourinary?: string;
  fluidsRunning?: string;
  medications?: string;
  plan: string;
  recordedBy: string;
  recordedAt: Date;
}) {
  return await prisma.postOpNotes.create({
    data: {
      patientId: data.patientId,
      postOpDay: data.postOpDay,
      date: data.date,
      generalCondition: data.generalCondition,
      consciousness: data.consciousness,
      vitals: data.vitals,
      painScore: data.painScore,
      woundCondition: data.woundCondition,
      drainOutput: data.drainOutput,
      cardiovascular: data.cardiovascular,
      respiratory: data.respiratory,
      gastrointestinal: data.gastrointestinal,
      genitourinary: data.genitourinary,
      fluidsRunning: data.fluidsRunning,
      medications: data.medications,
      plan: data.plan,
      recordedBy: data.recordedBy,
      recordedAt: data.recordedAt,
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

export async function getPostOpNotesByPatientId(patientId: string) {
  return await prisma.postOpNotes.findMany({
    where: { patientId },
    orderBy: { postOpDay: 'asc' },
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

export async function getPostOpNotesById(id: string) {
  return await prisma.postOpNotes.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}

// ===========================
// POST-OP ORDERS
// ===========================

export async function createPostOpOrders(data: {
  patientId: string;
  dietOrders?: string;
  activityOrders?: string;
  nursingOrders?: string;
  investigationOrders?: string;
  medicationOrders: any;
  ivFluidsOrders?: any;
  vitalsSigns?: string;
  intakeOutput?: boolean;
  orderedBy: string;
  orderedAt: Date;
}) {
  return await prisma.postOpOrders.create({
    data: {
      patientId: data.patientId,
      dietOrders: data.dietOrders,
      activityOrders: data.activityOrders,
      nursingOrders: data.nursingOrders,
      investigationOrders: data.investigationOrders,
      medicationOrders: data.medicationOrders,
      ivFluidsOrders: data.ivFluidsOrders,
      vitalsSigns: data.vitalsSigns,
      intakeOutput: data.intakeOutput !== undefined ? data.intakeOutput : true,
      orderedBy: data.orderedBy,
      orderedAt: data.orderedAt,
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

export async function getPostOpOrdersByPatientId(patientId: string) {
  return await prisma.postOpOrders.findMany({
    where: { patientId },
    orderBy: { orderedAt: 'desc' },
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

export async function getPostOpOrdersById(id: string) {
  return await prisma.postOpOrders.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}
