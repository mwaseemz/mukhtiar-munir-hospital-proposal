import { PrismaClient, LAMADORType } from '@prisma/client';

const prisma = new PrismaClient();

export class LAMADORService {
  async createForm(data: any): Promise<any> {
    const form = await prisma.lAMADORForm.create({
      data: {
        patientId: data.patientId,
        createdById: data.createdById,
        type: data.type as LAMADORType,
        reason: data.reason,
        doctorStatement: data.doctorStatement,
        risksExplained: data.risksExplained,
        patientOrRelativeStatement: data.patientOrRelativeStatement,
        witnessName: data.witnessName,
        witnessRelation: data.witnessRelation,
        notes: data.notes,
      },
      include: {
        patient: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    // Update patient status based on LAMA/DOR type
    await prisma.patient.update({
      where: { id: data.patientId },
      data: {
        status: data.type === 'LAMA' ? 'LAMA' : 'DOR',
      },
    });

    return form;
  }

  async getFormsByPatient(patientId: string): Promise<any[]> {
    return await prisma.lAMADORForm.findMany({
      where: { patientId },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getFormById(id: string): Promise<any | null> {
    return await prisma.lAMADORForm.findUnique({
      where: { id },
      include: {
        patient: true,
        createdBy: {
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

  async updateForm(id: string, data: any): Promise<any> {
    return await prisma.lAMADORForm.update({
      where: { id },
      data,
      include: {
        patient: true,
        createdBy: {
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

  async deleteForm(id: string): Promise<void> {
    await prisma.lAMADORForm.delete({
      where: { id },
    });
  }
}

export const lamaDorService = new LAMADORService();
