import { DailyProgressNote } from '@prisma/client';
import prisma from '../config/database';

export class DailyProgressNoteService {
  async createProgressNote(data: any, recordedById: string): Promise<DailyProgressNote> {
    return prisma.dailyProgressNote.create({
      data: {
        ...data,
        recordedById,
        vitals: data.vitals || {},
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

  async getProgressNoteById(id: string): Promise<DailyProgressNote | null> {
    return prisma.dailyProgressNote.findUnique({
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

  async getPatientProgressNotes(patientId: string): Promise<DailyProgressNote[]> {
    return prisma.dailyProgressNote.findMany({
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

  async updateProgressNote(id: string, data: Partial<DailyProgressNote>): Promise<DailyProgressNote> {
    return prisma.dailyProgressNote.update({
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

  async getTodaysNotes(patientId: string): Promise<DailyProgressNote[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.dailyProgressNote.findMany({
      where: {
        patientId,
        recordedAt: {
          gte: today,
        },
      },
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
}

export default new DailyProgressNoteService();
