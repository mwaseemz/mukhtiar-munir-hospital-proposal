import { ConsentForm, ConsentFormType } from '@prisma/client';
import prisma from '../config/database';

export class ConsentFormService {
  async createConsentForm(data: any): Promise<ConsentForm> {
    const consentForm = await prisma.consentForm.create({
      data: {
        ...data,
        formData: data.formData || {},
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
        signature: true,
      },
    });

    return consentForm;
  }

  async getConsentFormById(id: string): Promise<ConsentForm | null> {
    return prisma.consentForm.findUnique({
      where: { id },
      include: {
        patient: true,
        completedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        signature: true,
      },
    });
  }

  async getConsentFormsByPatient(patientId: string): Promise<ConsentForm[]> {
    return prisma.consentForm.findMany({
      where: { patientId },
      include: {
        signature: true,
        completedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateConsentForm(id: string, data: Partial<ConsentForm>): Promise<ConsentForm> {
    return prisma.consentForm.update({
      where: { id },
      data,
      include: {
        patient: true,
        signature: true,
      },
    });
  }

  async completeConsentForm(
    id: string,
    completedById: string,
    signatureId?: string
  ): Promise<ConsentForm> {
    return prisma.consentForm.update({
      where: { id },
      data: {
        isCompleted: true,
        completedById,
        completedAt: new Date(),
        signatureId,
        signatureDate: new Date(),
      },
      include: {
        patient: true,
        signature: true,
      },
    });
  }

  async checkRequiredForms(patientId: string): Promise<{
    generalAdmission: boolean;
    operationUrdu: boolean;
    anesthesiaUrdu: boolean;
    allCompleted: boolean;
  }> {
    const forms = await prisma.consentForm.findMany({
      where: { patientId },
      select: { formType: true, isCompleted: true },
    });

    const generalAdmission = forms.some(
      (f) => f.formType === 'GENERAL_ADMISSION' && f.isCompleted
    );
    const operationUrdu = forms.some(
      (f) => f.formType === 'OPERATION_URDU' && f.isCompleted
    );
    const anesthesiaUrdu = forms.some(
      (f) => f.formType === 'ANESTHESIA_URDU' && f.isCompleted
    );

    return {
      generalAdmission,
      operationUrdu,
      anesthesiaUrdu,
      allCompleted: generalAdmission && operationUrdu && anesthesiaUrdu,
    };
  }

  async uploadConsentDocument(id: string, documentUrl: string): Promise<ConsentForm> {
    return prisma.consentForm.update({
      where: { id },
      data: { uploadedDocUrl: documentUrl },
    });
  }
}

export default new ConsentFormService();
