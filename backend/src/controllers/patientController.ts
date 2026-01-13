import { Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { AuthenticatedRequest } from '../types';

export class PatientController {
  async createPatient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Convert dateOfBirth string to Date object
      const patientData = {
        ...req.body,
        dateOfBirth: new Date(req.body.dateOfBirth),
        admittedById: req.user!.id,
      };
      
      const patient = await patientService.createPatient(patientData);
      res.status(201).json({
        success: true,
        data: patient,
        message: 'Patient registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPatient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      if (!patient) {
        res.status(404).json({ success: false, error: 'Patient not found' });
        return;
      }
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  async getPatientByMRNumber(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.getPatientByMRNumber(req.params.mrNumber);
      if (!patient) {
        res.status(404).json({ success: false, error: 'Patient not found' });
        return;
      }
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      res.json({
        success: true,
        data: patient,
        message: 'Patient updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async searchPatients(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await patientService.searchPatients({
        query: req.query.q as string,
        status: req.query.status as string,
        department: req.query.department as string,
        admissionType: req.query.admissionType as string,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      });
      res.json({
        success: true,
        data: result.patients,
        pagination: {
          page: result.page,
          limit: 20,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPatientDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.getPatientDetails(req.params.id);
      if (!patient) {
        res.status(404).json({ success: false, error: 'Patient not found' });
        return;
      }
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  async dischargePatient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dischargeType } = req.body;
      const patient = await patientService.dischargePatient(req.params.id, dischargeType);
      res.json({
        success: true,
        data: patient,
        message: 'Patient discharged successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPatients(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const patients = await patientService.getAllPatients();
      res.json({ success: true, data: patients });
    } catch (error) {
      next(error);
    }
  }

  async deletePatient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await patientService.deletePatient(req.params.id);
      res.json({
        success: true,
        message: 'Patient and all related records deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await patientService.getPatientStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

export default new PatientController();
