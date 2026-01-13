import { Request, Response } from 'express';
import { physicalExaminationService } from '../services/physicalExaminationService';

export class PhysicalExaminationController {
  async createExamination(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const data = {
        ...req.body,
        examinedById: userId,
      };

      const examination = await physicalExaminationService.createExamination(data);
      
      res.status(201).json({
        message: 'Physical examination created successfully',
        data: examination,
      });
    } catch (error: any) {
      console.error('Error creating physical examination:', error);
      res.status(500).json({
        message: 'Failed to create physical examination',
        error: error.message,
      });
    }
  }

  async getExaminationsByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      
      const examinations = await physicalExaminationService.getExaminationsByPatient(patientId);
      
      res.status(200).json({
        message: 'Physical examinations retrieved successfully',
        data: examinations,
      });
    } catch (error: any) {
      console.error('Error retrieving physical examinations:', error);
      res.status(500).json({
        message: 'Failed to retrieve physical examinations',
        error: error.message,
      });
    }
  }

  async getExaminationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const examination = await physicalExaminationService.getExaminationById(id);
      
      if (!examination) {
        res.status(404).json({ message: 'Physical examination not found' });
        return;
      }
      
      res.status(200).json({
        message: 'Physical examination retrieved successfully',
        data: examination,
      });
    } catch (error: any) {
      console.error('Error retrieving physical examination:', error);
      res.status(500).json({
        message: 'Failed to retrieve physical examination',
        error: error.message,
      });
    }
  }

  async updateExamination(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const examination = await physicalExaminationService.updateExamination(id, req.body);
      
      res.status(200).json({
        message: 'Physical examination updated successfully',
        data: examination,
      });
    } catch (error: any) {
      console.error('Error updating physical examination:', error);
      res.status(500).json({
        message: 'Failed to update physical examination',
        error: error.message,
      });
    }
  }

  async deleteExamination(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await physicalExaminationService.deleteExamination(id);
      
      res.status(200).json({
        message: 'Physical examination deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting physical examination:', error);
      res.status(500).json({
        message: 'Failed to delete physical examination',
        error: error.message,
      });
    }
  }
}

export const physicalExaminationController = new PhysicalExaminationController();
