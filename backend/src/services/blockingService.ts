import prisma from '../config/database';

/**
 * Blocking Service - Implements workflow control mechanisms
 * 
 * Blocking Rules:
 * 1. Cannot proceed without consent upload
 * 2. If today's medicine not given → tomorrow blocked
 * 3. If DPN not entered → next day medications blocked
 * 4. Consultant orders must be acknowledged by MO
 * 5. All forms need: Signature + Stamp + Date + Time
 */

// ===========================
// CONSENT BLOCKING
// ===========================

export async function checkConsentBlocking(patientId: string): Promise<{
  isBlocked: boolean;
  reason?: string;
  missingConsents?: string[];
}> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      consentForms: true,
    },
  });

  if (!patient) {
    return { isBlocked: true, reason: 'Patient not found' };
  }

  const requiredConsents = ['GENERAL_ADMISSION'];
  
  // If surgery patient, require operation and anesthesia consents
  if (patient.patientType === 'SURGERY') {
    requiredConsents.push('OPERATION_URDU', 'ANESTHESIA_URDU');
  }

  const completedConsents = patient.consentForms
    .filter(c => c.isCompleted)
    .map(c => c.formType);

  const missingConsents = requiredConsents.filter(
    required => !completedConsents.includes(required as any)
  );

  if (missingConsents.length > 0) {
    return {
      isBlocked: true,
      reason: 'Required consent forms not completed',
      missingConsents,
    };
  }

  return { isBlocked: false };
}

// ===========================
// TREATMENT ADMINISTRATION BLOCKING
// ===========================

export async function checkTreatmentAdministrationBlocking(
  patientId: string,
  forDate?: Date
): Promise<{
  isBlocked: boolean;
  reason?: string;
  missedAdministrations?: any[];
}> {
  const targetDate = forDate || new Date();
  const yesterday = new Date(targetDate);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const todayStart = new Date(targetDate);
  todayStart.setHours(0, 0, 0, 0);

  // Get all scheduled administrations from yesterday that were not given
  const missedAdministrations = await prisma.treatmentAdministration.findMany({
    where: {
      patientId,
      scheduledTime: {
        gte: yesterday,
        lt: todayStart,
      },
      status: {
        in: ['PENDING', 'MISSED'],
      },
    },
    include: {
      order: true,
    },
  });

  if (missedAdministrations.length > 0) {
    return {
      isBlocked: true,
      reason: "Yesterday's medications not administered. Must complete before proceeding.",
      missedAdministrations,
    };
  }

  return { isBlocked: false };
}

// ===========================
// DAILY PROGRESS NOTE BLOCKING
// ===========================

export async function checkDailyProgressNoteBlocking(
  patientId: string,
  forDate?: Date
): Promise<{
  isBlocked: boolean;
  reason?: string;
  lastDPNDate?: Date;
}> {
  const targetDate = forDate || new Date();
  const yesterday = new Date(targetDate);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const todayStart = new Date(targetDate);
  todayStart.setHours(0, 0, 0, 0);

  // Check if yesterday's DPN exists
  const yesterdayDPN = await prisma.dailyProgressNote.findFirst({
    where: {
      patientId,
      date: {
        gte: yesterday,
        lt: todayStart,
      },
    },
    orderBy: { date: 'desc' },
  });

  // Get patient admission date
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { admissionDate: true },
  });

  if (!patient) {
    return { isBlocked: true, reason: 'Patient not found' };
  }

  // Only block if patient has been admitted for more than 1 day
  const daysSinceAdmission = Math.floor(
    (targetDate.getTime() - patient.admissionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceAdmission > 0 && !yesterdayDPN) {
    const lastDPN = await prisma.dailyProgressNote.findFirst({
      where: { patientId },
      orderBy: { date: 'desc' },
    });

    return {
      isBlocked: true,
      reason: "Yesterday's Daily Progress Note not entered. Must complete before proceeding.",
      lastDPNDate: lastDPN?.date,
    };
  }

  return { isBlocked: false };
}

// ===========================
// CONSULTANT ORDER ACKNOWLEDGEMENT
// ===========================

export async function checkConsultantOrderAcknowledgement(
  patientId: string
): Promise<{
  isBlocked: boolean;
  reason?: string;
  unacknowledgedOrders?: any[];
}> {
  // Get latest consultant round with new orders
  const recentRounds = await prisma.consultantRound.findMany({
    where: {
      patientId,
      newOrders: {
        not: null,
      },
    },
    orderBy: { roundDate: 'desc' },
    take: 5,
  });

  // Check if these orders have been converted to treatment orders
  // This is a simplified check - in production, you'd have a proper acknowledgement field
  const unacknowledgedOrders = recentRounds.filter(async (round) => {
    const ordersExist = await prisma.treatmentOrder.findFirst({
      where: {
        patientId,
        createdAt: {
          gte: round.roundDate,
        },
      },
    });
    return !ordersExist;
  });

  if (unacknowledgedOrders.length > 0) {
    return {
      isBlocked: true,
      reason: 'Consultant orders pending acknowledgement by Medical Officer',
      unacknowledgedOrders,
    };
  }

  return { isBlocked: false };
}

// ===========================
// COMPREHENSIVE BLOCKING CHECK
// ===========================

export async function checkAllBlockingRules(
  patientId: string,
  action: 'TREATMENT' | 'DISCHARGE' | 'PROCEDURE' | 'OT_SHIFT'
): Promise<{
  isBlocked: boolean;
  blockingReasons: string[];
  details: any;
}> {
  const blockingReasons: string[] = [];
  const details: any = {};

  // Check consent blocking (applies to all actions)
  const consentCheck = await checkConsentBlocking(patientId);
  if (consentCheck.isBlocked) {
    blockingReasons.push(consentCheck.reason!);
    details.consentCheck = consentCheck;
  }

  // Check DPN blocking (applies to treatment and discharge)
  if (['TREATMENT', 'DISCHARGE'].includes(action)) {
    const dpnCheck = await checkDailyProgressNoteBlocking(patientId);
    if (dpnCheck.isBlocked) {
      blockingReasons.push(dpnCheck.reason!);
      details.dpnCheck = dpnCheck;
    }
  }

  // Check treatment administration blocking (applies to treatment)
  if (action === 'TREATMENT') {
    const treatmentCheck = await checkTreatmentAdministrationBlocking(patientId);
    if (treatmentCheck.isBlocked) {
      blockingReasons.push(treatmentCheck.reason!);
      details.treatmentCheck = treatmentCheck;
    }
  }

  // Check consultant order acknowledgement (applies to discharge)
  if (action === 'DISCHARGE') {
    const consultantCheck = await checkConsultantOrderAcknowledgement(patientId);
    if (consultantCheck.isBlocked) {
      blockingReasons.push(consultantCheck.reason!);
      details.consultantCheck = consultantCheck;
    }
  }

  return {
    isBlocked: blockingReasons.length > 0,
    blockingReasons,
    details,
  };
}

// ===========================
// SIGNATURE VALIDATION
// ===========================

export function validateFormSignature(formData: {
  signatureId?: string;
  signatureDate?: Date;
  witnessName?: string;
  witnessSignature?: string;
}): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (!formData.signatureId) {
    missingFields.push('Signature');
  }

  if (!formData.signatureDate) {
    missingFields.push('Date');
  }

  // Witness might not be required for all forms
  // Add validation as needed

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
