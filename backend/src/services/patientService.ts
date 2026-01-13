import { Patient, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { generateMRNumber } from '../utils/mrNumber';
import { getCached, setCached, deleteCached, clearCachePattern } from '../config/redis';

export class PatientService {
  async createPatient(data: Omit<Patient, 'id' | 'mrNumber' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    // Generate MR Number with admission type and location
    const mrNumber = await generateMRNumber(data.admissionType, data.admissionLocation);

    // Check for viral markers and set alert
    const viralMarkersAlert = !!(data.antiHCV || data.hbsAg || data.hiv);

    // Convert viralMarkersDate string to Date object if provided, or null if empty
    const patientData: any = { ...data };
    if (patientData.viralMarkersDate) {
      if (typeof patientData.viralMarkersDate === 'string') {
        // If empty string, set to null; otherwise convert to Date
        patientData.viralMarkersDate = patientData.viralMarkersDate.trim() 
          ? new Date(patientData.viralMarkersDate) 
          : null;
      }
    } else {
      // If undefined or falsy, set to null
      patientData.viralMarkersDate = null;
    }

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        mrNumber,
        viralMarkersAlert,
      },
      include: {
        admittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    // Cache the patient
    await setCached(`patient:${patient.id}`, patient, 3600);
    await setCached(`patient:mr:${patient.mrNumber}`, patient, 3600);

    return patient;
  }

  async getPatientById(id: string): Promise<Patient | null> {
    // Try cache first
    const cached = await getCached<Patient>(`patient:${id}`);
    if (cached) return cached;

    // Get from database
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        admittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (patient) {
      await setCached(`patient:${id}`, patient, 3600);
    }

    return patient;
  }

  async getPatientByMRNumber(mrNumber: string): Promise<Patient | null> {
    // Try cache first
    const cached = await getCached<Patient>(`patient:mr:${mrNumber}`);
    if (cached) return cached;

    // Get from database
    const patient = await prisma.patient.findUnique({
      where: { mrNumber },
      include: {
        admittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (patient) {
      await setCached(`patient:mr:${mrNumber}`, patient, 3600);
      await setCached(`patient:${patient.id}`, patient, 3600);
    }

    return patient;
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const patient = await prisma.patient.update({
      where: { id },
      data,
      include: {
        admittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    // Update cache
    await setCached(`patient:${id}`, patient, 3600);
    await setCached(`patient:mr:${patient.mrNumber}`, patient, 3600);

    return patient;
  }

  async searchPatients(params: {
    query?: string;
    status?: string;
    department?: string;
    admissionType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ patients: Patient[]; total: number; page: number; totalPages: number }> {
    const { query, status, department, admissionType, dateFrom, dateTo, page = 1, limit = 20 } = params;

    const where: Prisma.PatientWhereInput = {};

    // Search query (MR Number, Name, Phone, CNIC)
    if (query) {
      where.OR = [
        { mrNumber: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { phoneNumber: { contains: query } },
        { cnic: { contains: query } },
      ];
    }

    // Filters
    if (status) where.status = status as any;
    if (department) where.department = { contains: department, mode: 'insensitive' };
    if (admissionType) where.admissionType = admissionType as any;
    if (dateFrom || dateTo) {
      where.admissionDate = {};
      if (dateFrom) where.admissionDate.gte = dateFrom;
      if (dateTo) where.admissionDate.lte = dateTo;
    }

    // Get total count
    const total = await prisma.patient.count({ where });

    // Get patients
    const patients = await prisma.patient.findMany({
      where,
      include: {
        admittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { admissionDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      patients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPatientDetails(id: string): Promise<any> {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        admittedBy: true,
        consentForms: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        medicalHistories: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
          include: { recordedBy: { select: { firstName: true, lastName: true } } },
        },
        treatmentOrders: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          include: { orderedBy: { select: { firstName: true, lastName: true } } },
        },
        dailyProgressNotes: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
          include: { recordedBy: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    return patient;
  }

  async dischargePatient(id: string, dischargeType: string): Promise<Patient> {
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        status: dischargeType as any,
        dischargeDate: new Date(),
      },
    });

    // Clear cache
    await deleteCached(`patient:${id}`);
    await deleteCached(`patient:mr:${patient.mrNumber}`);

    return patient;
  }

  async getAllPatients(): Promise<any> {
    return await prisma.patient.findMany({
      orderBy: {
        admissionDate: 'desc',
      },
      include: {
        admittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async deletePatient(id: string): Promise<void> {
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Delete all related records first (cascading delete)
    await prisma.$transaction([
      // Delete medical history
      prisma.medicalHistory.deleteMany({ where: { patientId: id } }),
      // Delete consents
      prisma.generalConsent.deleteMany({ where: { patientId: id } }),
      prisma.operationConsent.deleteMany({ where: { patientId: id } }),
      prisma.anesthesiaConsent.deleteMany({ where: { patientId: id } }),
      // Delete treatment records
      prisma.treatmentOrder.deleteMany({ where: { patientId: id } }),
      // Delete progress notes
      prisma.dailyProgressNote.deleteMany({ where: { patientId: id } }),
      // Delete IO charts
      prisma.inputOutputChart.deleteMany({ where: { patientId: id } }),
      // Delete anesthesia records
      prisma.anesthesiaRecord.deleteMany({ where: { patientId: id } }),
      // Delete operation notes
      prisma.operationNotes.deleteMany({ where: { patientId: id } }),
      // Delete consultant rounds
      prisma.consultantRound.deleteMany({ where: { patientId: id } }),
      // Delete discharge summary
      prisma.dischargeSummary.deleteMany({ where: { patientId: id } }),
      // Delete investigation profiles
      prisma.investigationProfile.deleteMany({ where: { patientId: id } }),
      // Delete physical examinations
      prisma.physicalExamination.deleteMany({ where: { patientId: id } }),
      // Delete LAMA/DOR forms
      prisma.lAMADORForm.deleteMany({ where: { patientId: id } }),
      // Finally, delete the patient
      prisma.patient.delete({ where: { id } }),
    ]);
  }

  async getPatientStats(): Promise<any> {
    const [
      totalPatients,
      admittedPatients,
      inOTPatients,
      dischargedToday,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { status: 'ADMITTED' } }),
      prisma.patient.count({ where: { status: 'IN_OT' } }),
      prisma.patient.count({
        where: {
          status: 'DISCHARGED',
          dischargeDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      totalPatients,
      admittedPatients,
      inOTPatients,
      dischargedToday,
    };
  }
}

export default new PatientService();
