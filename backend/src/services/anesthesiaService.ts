import prisma from '../config/database';

// ===========================
// ANESTHESIA RECORD
// ===========================

export async function createAnesthesiaRecord(data: {
  patientId: string;
  anesthetistId: string;
  asaClass: string;
  airwayAssessment: string;
  dentitionStatus?: string;
  neckMovement?: string;
  previousAnesthesia?: string;
  anesthesiaType: string;
  technique: string;
  drugs: any[];
  fluidsGiven: any[];
  bloodProducts?: any[];
  vitalsChart: any;
  oxygenSaturation: any;
  etco2?: any;
  airwayMethod?: string;
  tubeSize?: string;
  cuffPressure?: string;
  complications?: string;
  management?: string;
  emergenceTime?: string;
  recoveryNotes?: string;
  postOpOrders?: string;
}) {
  return await prisma.anesthesiaRecord.create({
    data: {
      patientId: data.patientId,
      anesthetistId: data.anesthetistId,
      asaClass: data.asaClass,
      airwayAssessment: data.airwayAssessment,
      dentitionStatus: data.dentitionStatus,
      neckMovement: data.neckMovement,
      previousAnesthesia: data.previousAnesthesia,
      anesthesiaType: data.anesthesiaType as any,
      technique: data.technique,
      drugs: data.drugs,
      fluidsGiven: data.fluidsGiven,
      bloodProducts: data.bloodProducts,
      vitalsChart: data.vitalsChart,
      oxygenSaturation: data.oxygenSaturation,
      etco2: data.etco2,
      airwayMethod: data.airwayMethod,
      tubeSize: data.tubeSize,
      cuffPressure: data.cuffPressure,
      complications: data.complications,
      management: data.management,
      emergenceTime: data.emergenceTime,
      recoveryNotes: data.recoveryNotes,
      postOpOrders: data.postOpOrders,
    },
    include: {
      patient: {
        select: {
          mrNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      anesthetist: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getAnesthesiaRecordsByPatientId(patientId: string) {
  return await prisma.anesthesiaRecord.findMany({
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
      anesthetist: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getAnesthesiaRecordById(id: string) {
  return await prisma.anesthesiaRecord.findUnique({
    where: { id },
    include: {
      patient: true,
      anesthetist: true,
    },
  });
}

export async function updateAnesthesiaRecord(
  id: string,
  data: {
    emergenceTime?: string;
    recoveryNotes?: string;
    postOpOrders?: string;
    complications?: string;
    management?: string;
  }
) {
  return await prisma.anesthesiaRecord.update({
    where: { id },
    data,
  });
}

// ===========================
// POST-ANESTHESIA RECOVERY
// ===========================

export async function createPostAnesthesiaRecovery(data: {
  patientId: string;
  admissionTime: Date;
  dischargeTime?: Date;
  aldreteScores: any;
  vitalsChart: any;
  consciousness: string;
  airway: string;
  breathing: string;
  circulation: string;
  painScore?: number;
  nauseaVomiting: boolean;
  oxygenGiven?: string;
  fluidsGiven?: any;
  medicationsGiven?: any;
  dischargeCriteriaMet?: boolean;
  dischargedTo?: string;
  dischargedBy?: string;
  notes?: string;
}) {
  return await prisma.postAnesthesiaRecovery.create({
    data: {
      patientId: data.patientId,
      admissionTime: data.admissionTime,
      dischargeTime: data.dischargeTime,
      aldreteScores: data.aldreteScores,
      vitalsChart: data.vitalsChart,
      consciousness: data.consciousness,
      airway: data.airway,
      breathing: data.breathing,
      circulation: data.circulation,
      painScore: data.painScore,
      nauseaVomiting: data.nauseaVomiting,
      oxygenGiven: data.oxygenGiven,
      fluidsGiven: data.fluidsGiven,
      medicationsGiven: data.medicationsGiven,
      dischargeCriteriaMet: data.dischargeCriteriaMet || false,
      dischargedTo: data.dischargedTo,
      dischargedBy: data.dischargedBy,
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
}

export async function getPostAnesthesiaRecoveryByPatientId(patientId: string) {
  return await prisma.postAnesthesiaRecovery.findMany({
    where: { patientId },
    orderBy: { admissionTime: 'desc' },
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

export async function getPostAnesthesiaRecoveryById(id: string) {
  return await prisma.postAnesthesiaRecovery.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}

export async function updatePostAnesthesiaRecovery(
  id: string,
  data: {
    dischargeTime?: Date;
    dischargeCriteriaMet?: boolean;
    dischargedTo?: string;
    dischargedBy?: string;
    notes?: string;
  }
) {
  const record = await prisma.postAnesthesiaRecovery.update({
    where: { id },
    data,
  });

  // If discharged from recovery, update patient status
  if (data.dischargeCriteriaMet && data.dischargeTime) {
    await prisma.patient.update({
      where: { id: record.patientId },
      data: { status: 'IN_RECOVERY' }, // Or back to ADMITTED depending on workflow
    });
  }

  return record;
}
