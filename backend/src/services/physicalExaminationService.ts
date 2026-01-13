import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PhysicalExaminationService {
  async createExamination(data: any): Promise<any> {
    const examination = await prisma.physicalExamination.create({
      data: {
        patientId: data.patientId,
        examinedById: data.examinedById,
        
        // General Appearance
        generalAppearance: data.generalAppearance,
        consciousness: data.consciousness,
        
        // Vital Signs
        bloodPressure: data.bloodPressure,
        pulse: data.pulse,
        temperature: data.temperature,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        
        // Physical Findings
        pallor: data.pallor || false,
        jaundice: data.jaundice || false,
        cyanosis: data.cyanosis || false,
        clubbing: data.clubbing || false,
        edema: data.edema || false,
        lymphadenopathy: data.lymphadenopathy || false,
        
        // Systemic Examination
        cardiovascularSystem: data.cardiovascularSystem,
        respiratorySystem: data.respiratorySystem,
        gastrointestinalSystem: data.gastrointestinalSystem,
        centralNervousSystem: data.centralNervousSystem,
        musculoskeletalSystem: data.musculoskeletalSystem,
        
        otherFindings: data.otherFindings,
        notes: data.notes,
      },
      include: {
        patient: true,
        examinedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return examination;
  }

  async getExaminationsByPatient(patientId: string): Promise<any[]> {
    return await prisma.physicalExamination.findMany({
      where: { patientId },
      include: {
        examinedBy: {
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

  async getExaminationById(id: string): Promise<any | null> {
    return await prisma.physicalExamination.findUnique({
      where: { id },
      include: {
        patient: true,
        examinedBy: {
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

  async updateExamination(id: string, data: any): Promise<any> {
    return await prisma.physicalExamination.update({
      where: { id },
      data,
      include: {
        patient: true,
        examinedBy: {
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

  async deleteExamination(id: string): Promise<void> {
    await prisma.physicalExamination.delete({
      where: { id },
    });
  }
}

export const physicalExaminationService = new PhysicalExaminationService();
