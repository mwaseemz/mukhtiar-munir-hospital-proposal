import { DischargeSummary } from '@prisma/client';
import prisma from '../config/database';

export class DischargeSummaryService {
  async createDischargeSummary(data: any, preparedById: string): Promise<DischargeSummary> {
    // Update patient status
    await prisma.patient.update({
      where: { id: data.patientId },
      data: {
        status: data.dischargeType,
        dischargeDate: data.dischargeDate,
      },
    });

    return prisma.dischargeSummary.create({
      data: {
        ...data,
        preparedById,
        dischargeMedications: data.dischargeMedications || [],
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
        preparedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getDischargeSummaryById(id: string): Promise<DischargeSummary | null> {
    return prisma.dischargeSummary.findUnique({
      where: { id },
      include: {
        patient: true,
        preparedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getPatientDischargeSummary(patientId: string): Promise<DischargeSummary | null> {
    return prisma.dischargeSummary.findFirst({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        preparedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async updateDischargeSummary(id: string, data: Partial<DischargeSummary>): Promise<DischargeSummary> {
    return prisma.dischargeSummary.update({
      where: { id },
      data,
      include: {
        patient: true,
        preparedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getRecentDischarges(limit: number = 20): Promise<DischargeSummary[]> {
    return prisma.dischargeSummary.findMany({
      include: {
        patient: {
          select: {
            mrNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        preparedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { dischargeDate: 'desc' },
      take: limit,
    });
  }
}

export default new DischargeSummaryService();
