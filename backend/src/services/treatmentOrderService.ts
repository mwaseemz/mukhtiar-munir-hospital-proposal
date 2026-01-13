import { TreatmentOrder, OrderStatus } from '@prisma/client';
import prisma from '../config/database';

export class TreatmentOrderService {
  async createTreatmentOrder(data: any, orderedById: string): Promise<TreatmentOrder> {
    return prisma.treatmentOrder.create({
      data: {
        ...data,
        orderedById,
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
        orderedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getTreatmentOrderById(id: string): Promise<TreatmentOrder | null> {
    return prisma.treatmentOrder.findUnique({
      where: { id },
      include: {
        patient: true,
        orderedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        administrations: {
          orderBy: { scheduledTime: 'asc' },
        },
      },
    });
  }

  async getPatientActiveOrders(patientId: string): Promise<TreatmentOrder[]> {
    return prisma.treatmentOrder.findMany({
      where: {
        patientId,
        status: 'ACTIVE',
      },
      include: {
        orderedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        administrations: {
          where: {
            scheduledTime: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          orderBy: { scheduledTime: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPatientOrders(patientId: string): Promise<TreatmentOrder[]> {
    return prisma.treatmentOrder.findMany({
      where: { patientId },
      include: {
        orderedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTreatmentOrder(id: string, data: Partial<TreatmentOrder>): Promise<TreatmentOrder> {
    return prisma.treatmentOrder.update({
      where: { id },
      data,
      include: {
        patient: true,
        orderedBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async discontinueOrder(id: string): Promise<TreatmentOrder> {
    return prisma.treatmentOrder.update({
      where: { id },
      data: { status: 'DISCONTINUED' },
    });
  }

  async completeOrder(id: string): Promise<TreatmentOrder> {
    return prisma.treatmentOrder.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  async recordAdministration(data: any): Promise<any> {
    return prisma.treatmentAdministration.create({
      data: {
        ...data,
        actualTime: new Date(),
      },
      include: {
        order: {
          include: {
            patient: {
              select: {
                mrNumber: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async getPendingAdministrations(patientId?: string): Promise<any[]> {
    const where: any = {
      status: 'PENDING',
      scheduledTime: {
        lte: new Date(Date.now() + 30 * 60 * 1000), // Next 30 minutes
      },
    };

    if (patientId) {
      where.patientId = patientId;
    }

    return prisma.treatmentAdministration.findMany({
      where,
      include: {
        order: {
          include: {
            patient: {
              select: {
                mrNumber: true,
                firstName: true,
                lastName: true,
                wardNumber: true,
                bedNumber: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledTime: 'asc' },
    });
  }
}

export default new TreatmentOrderService();
