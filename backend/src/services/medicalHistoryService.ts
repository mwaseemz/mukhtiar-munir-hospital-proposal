import { MedicalHistory } from '@prisma/client';
import prisma from '../config/database';

export class MedicalHistoryService {
  async createMedicalHistory(data: any, recordedById: string): Promise<MedicalHistory> {
    return prisma.medicalHistory.create({
      data: {
        ...data,
        recordedById,
        vitals: data.vitals || {},
        reviewOfSystems: data.reviewOfSystems || {},
      },
      include: {
        patient: {
          select: {
            id: true,
            mrNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        recordedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getMedicalHistoryById(id: string): Promise<MedicalHistory | null> {
    return prisma.medicalHistory.findUnique({
      where: { id },
      include: {
        patient: true,
        recordedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getPatientMedicalHistories(patientId: string): Promise<MedicalHistory[]> {
    return prisma.medicalHistory.findMany({
      where: { patientId },
      include: {
        recordedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async updateMedicalHistory(id: string, data: Partial<MedicalHistory>): Promise<MedicalHistory> {
    return prisma.medicalHistory.update({
      where: { id },
      data,
      include: {
        patient: true,
        recordedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getLatestMedicalHistory(patientId: string): Promise<MedicalHistory | null> {
    return prisma.medicalHistory.findFirst({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
      include: {
        recordedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }
}

export default new MedicalHistoryService();
