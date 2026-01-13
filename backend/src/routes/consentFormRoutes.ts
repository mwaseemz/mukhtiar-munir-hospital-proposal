import { Router } from 'express';
import consentFormController from '../controllers/consentFormController';
import { authenticate, authorize } from '../middleware/auth';
import { auditLog } from '../middleware/auditLog';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Check required forms for patient
router.get('/patient/:patientId/check', consentFormController.checkRequiredForms);

// Get patient consent forms
router.get('/patient/:patientId', consentFormController.getPatientConsentForms);

// CRUD operations
router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
  auditLog('CREATE', 'ConsentForm'),
  consentFormController.createConsentForm
);

router.get('/:id', consentFormController.getConsentForm);

router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
  auditLog('UPDATE', 'ConsentForm'),
  consentFormController.updateConsentForm
);

router.post(
  '/:id/complete',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
  auditLog('COMPLETE', 'ConsentForm'),
  consentFormController.completeConsentForm
);

router.post(
  '/:id/upload',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
  auditLog('UPLOAD_DOCUMENT', 'ConsentForm'),
  consentFormController.uploadDocument
);

export default router;
