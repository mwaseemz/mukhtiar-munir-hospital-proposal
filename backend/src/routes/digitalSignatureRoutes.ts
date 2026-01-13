import { Router } from 'express';
import digitalSignatureController from '../controllers/digitalSignatureController';
import { authenticate } from '../middleware/auth';
import { auditLog } from '../middleware/auditLog';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get signature styles
router.get('/styles', digitalSignatureController.getSignatureStyles);

// Get user's signatures
router.get('/my-signatures', digitalSignatureController.getUserSignatures);

// Get default signature
router.get('/default', digitalSignatureController.getDefaultSignature);

// Set default signature
router.put(
  '/:id/set-default',
  auditLog('SET_DEFAULT', 'DigitalSignature'),
  digitalSignatureController.setDefaultSignature
);

// CRUD operations
router.post(
  '/',
  auditLog('CREATE', 'DigitalSignature'),
  digitalSignatureController.createSignature
);

router.get('/:id', digitalSignatureController.getSignature);

router.delete(
  '/:id',
  auditLog('DELETE', 'DigitalSignature'),
  digitalSignatureController.deleteSignature
);

export default router;
