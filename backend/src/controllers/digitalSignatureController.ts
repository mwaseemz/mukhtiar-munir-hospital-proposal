import { Response, NextFunction } from 'express';
import digitalSignatureService from '../services/digitalSignatureService';
import { AuthenticatedRequest } from '../types';

export class DigitalSignatureController {
  async createSignature(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = await digitalSignatureService.createSignature({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json({
        success: true,
        data: signature,
        message: 'Digital signature created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSignature(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = await digitalSignatureService.getSignatureById(req.params.id);
      if (!signature) {
        res.status(404).json({ success: false, error: 'Signature not found' });
        return;
      }
      res.json({ success: true, data: signature });
    } catch (error) {
      next(error);
    }
  }

  async getUserSignatures(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signatures = await digitalSignatureService.getUserSignatures(req.user!.id);
      res.json({ success: true, data: signatures });
    } catch (error) {
      next(error);
    }
  }

  async getDefaultSignature(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = await digitalSignatureService.getDefaultSignature(req.user!.id);
      res.json({ success: true, data: signature });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultSignature(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = await digitalSignatureService.setDefaultSignature(
        req.user!.id,
        req.params.id
      );
      res.json({
        success: true,
        data: signature,
        message: 'Default signature set successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSignature(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await digitalSignatureService.deleteSignature(req.params.id, req.user!.id);
      res.json({
        success: true,
        message: 'Signature deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSignatureStyles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const styles = digitalSignatureService.getSignatureStyles();
      res.json({ success: true, data: styles });
    } catch (error) {
      next(error);
    }
  }
}

export default new DigitalSignatureController();
