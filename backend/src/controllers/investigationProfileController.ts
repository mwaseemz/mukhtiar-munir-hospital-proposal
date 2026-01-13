import { Request, Response } from 'express';
import { investigationProfileService } from '../services/investigationProfileService';

export class InvestigationProfileController {
  async createProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const data = {
        ...req.body,
        recordedById: userId,
      };

      const profile = await investigationProfileService.createProfile(data);
      
      res.status(201).json({
        message: 'Investigation profile created successfully',
        data: profile,
      });
    } catch (error: any) {
      console.error('Error creating investigation profile:', error);
      res.status(500).json({
        message: 'Failed to create investigation profile',
        error: error.message,
      });
    }
  }

  async getProfilesByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      
      const profiles = await investigationProfileService.getProfileByPatient(patientId);
      
      res.status(200).json({
        message: 'Investigation profiles retrieved successfully',
        data: profiles,
      });
    } catch (error: any) {
      console.error('Error retrieving investigation profiles:', error);
      res.status(500).json({
        message: 'Failed to retrieve investigation profiles',
        error: error.message,
      });
    }
  }

  async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const profile = await investigationProfileService.getProfileById(id);
      
      if (!profile) {
        res.status(404).json({ message: 'Investigation profile not found' });
        return;
      }
      
      res.status(200).json({
        message: 'Investigation profile retrieved successfully',
        data: profile,
      });
    } catch (error: any) {
      console.error('Error retrieving investigation profile:', error);
      res.status(500).json({
        message: 'Failed to retrieve investigation profile',
        error: error.message,
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const profile = await investigationProfileService.updateProfile(id, req.body);
      
      res.status(200).json({
        message: 'Investigation profile updated successfully',
        data: profile,
      });
    } catch (error: any) {
      console.error('Error updating investigation profile:', error);
      res.status(500).json({
        message: 'Failed to update investigation profile',
        error: error.message,
      });
    }
  }

  async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await investigationProfileService.deleteProfile(id);
      
      res.status(200).json({
        message: 'Investigation profile deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting investigation profile:', error);
      res.status(500).json({
        message: 'Failed to delete investigation profile',
        error: error.message,
      });
    }
  }
}

export const investigationProfileController = new InvestigationProfileController();
