import { Response, NextFunction } from 'express';
import consentFormService from '../services/consentFormService';
import { AuthenticatedRequest } from '../types';

export class ConsentFormController {
  async createConsentForm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const consentForm = await consentFormService.createConsentForm(req.body);
      res.status(201).json({
        success: true,
        data: consentForm,
        message: 'Consent form created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getConsentForm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const consentForm = await consentFormService.getConsentFormById(req.params.id);
      if (!consentForm) {
        res.status(404).json({ success: false, error: 'Consent form not found' });
        return;
      }
      res.json({ success: true, data: consentForm });
    } catch (error) {
      next(error);
    }
  }

  async getPatientConsentForms(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const forms = await consentFormService.getConsentFormsByPatient(req.params.patientId);
      res.json({ success: true, data: forms });
    } catch (error) {
      next(error);
    }
  }

  async updateConsentForm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const consentForm = await consentFormService.updateConsentForm(req.params.id, req.body);
      res.json({
        success: true,
        data: consentForm,
        message: 'Consent form updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async completeConsentForm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { signatureId } = req.body;
      const consentForm = await consentFormService.completeConsentForm(
        req.params.id,
        req.user!.id,
        signatureId
      );
      res.json({
        success: true,
        data: consentForm,
        message: 'Consent form completed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async checkRequiredForms(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await consentFormService.checkRequiredForms(req.params.patientId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // File upload will be handled by multer middleware
      const file = (req as any).file;
      if (!file) {
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }

      const consentForm = await consentFormService.uploadConsentDocument(
        req.params.id,
        file.path
      );
      res.json({
        success: true,
        data: consentForm,
        message: 'Document uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ConsentFormController();
