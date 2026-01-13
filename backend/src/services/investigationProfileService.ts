import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InvestigationProfileService {
  async createProfile(data: any): Promise<any> {
    const profile = await prisma.investigationProfile.create({
      data: {
        patientId: data.patientId,
        recordedById: data.recordedById,
        
        // Hematology
        cbc: data.cbc || false,
        hemoglobin: data.hemoglobin || false,
        tlc: data.tlc || false,
        plateletCount: data.plateletCount || false,
        esr: data.esr || false,
        
        // Blood Chemistry
        bloodSugarRandom: data.bloodSugarRandom || false,
        bloodSugarFasting: data.bloodSugarFasting || false,
        hba1c: data.hba1c || false,
        renalFunctionTest: data.renalFunctionTest || false,
        liverFunctionTest: data.liverFunctionTest || false,
        
        // Viral Markers
        hbsAg: data.hbsAg || false,
        antiHCV: data.antiHCV || false,
        hiv: data.hiv || false,
        
        // Coagulation Profile
        pt: data.pt || false,
        aptt: data.aptt || false,
        inr: data.inr || false,
        
        // Imaging
        xrayChest: data.xrayChest || false,
        xrayAbdomen: data.xrayAbdomen || false,
        ultrasound: data.ultrasound || false,
        ctScan: data.ctScan || false,
        mri: data.mri || false,
        ecg: data.ecg || false,
        echo: data.echo || false,
        
        // Urine Analysis
        urineRE: data.urineRE || false,
        urineCulture: data.urineCulture || false,
        
        // Blood Bank
        bloodGrouping: data.bloodGrouping || false,
        crossMatching: data.crossMatching || false,
        
        additionalTests: data.additionalTests,
        notes: data.notes,
      },
      include: {
        patient: true,
        recordedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return profile;
  }

  async getProfileByPatient(patientId: string): Promise<any[]> {
    return await prisma.investigationProfile.findMany({
      where: { patientId },
      include: {
        recordedBy: {
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

  async getProfileById(id: string): Promise<any | null> {
    return await prisma.investigationProfile.findUnique({
      where: { id },
      include: {
        patient: true,
        recordedBy: {
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

  async updateProfile(id: string, data: any): Promise<any> {
    return await prisma.investigationProfile.update({
      where: { id },
      data,
      include: {
        patient: true,
        recordedBy: {
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

  async deleteProfile(id: string): Promise<void> {
    await prisma.investigationProfile.delete({
      where: { id },
    });
  }
}

export const investigationProfileService = new InvestigationProfileService();
