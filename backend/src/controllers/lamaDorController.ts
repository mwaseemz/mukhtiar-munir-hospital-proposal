import { Request, Response } from 'express';
import { lamaDorService } from '../services/lamaDorService';

export class LAMADORController {
  async createForm(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const data = {
        ...req.body,
        createdById: userId,
      };

      const form = await lamaDorService.createForm(data);
      
      res.status(201).json({
        message: 'LAMA/DOR form created successfully',
        data: form,
      });
    } catch (error: any) {
      console.error('Error creating LAMA/DOR form:', error);
      res.status(500).json({
        message: 'Failed to create LAMA/DOR form',
        error: error.message,
      });
    }
  }

  async getFormsByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      
      const forms = await lamaDorService.getFormsByPatient(patientId);
      
      res.status(200).json({
        message: 'LAMA/DOR forms retrieved successfully',
        data: forms,
      });
    } catch (error: any) {
      console.error('Error retrieving LAMA/DOR forms:', error);
      res.status(500).json({
        message: 'Failed to retrieve LAMA/DOR forms',
        error: error.message,
      });
    }
  }

  async getFormById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const form = await lamaDorService.getFormById(id);
      
      if (!form) {
        res.status(404).json({ message: 'LAMA/DOR form not found' });
        return;
      }
      
      res.status(200).json({
        message: 'LAMA/DOR form retrieved successfully',
        data: form,
      });
    } catch (error: any) {
      console.error('Error retrieving LAMA/DOR form:', error);
      res.status(500).json({
        message: 'Failed to retrieve LAMA/DOR form',
        error: error.message,
      });
    }
  }

  async updateForm(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const form = await lamaDorService.updateForm(id, req.body);
      
      res.status(200).json({
        message: 'LAMA/DOR form updated successfully',
        data: form,
      });
    } catch (error: any) {
      console.error('Error updating LAMA/DOR form:', error);
      res.status(500).json({
        message: 'Failed to update LAMA/DOR form',
        error: error.message,
      });
    }
  }

  async deleteForm(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await lamaDorService.deleteForm(id);
      
      res.status(200).json({
        message: 'LAMA/DOR form deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting LAMA/DOR form:', error);
      res.status(500).json({
        message: 'Failed to delete LAMA/DOR form',
        error: error.message,
      });
    }
  }
}

export const lamaDorController = new LAMADORController();
