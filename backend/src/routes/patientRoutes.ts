import { Router } from 'express';
import patientController from '../controllers/patientController';
import { authenticate, authorize } from '../middleware/auth';
import { auditLog } from '../middleware/auditLog';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all patients
router.get('/', patientController.getAllPatients);

// Stats
router.get('/stats', patientController.getStats);

// Search patients
router.get('/search', patientController.searchPatients);

// Get patient by MR Number
router.get('/mr/:mrNumber', patientController.getPatientByMRNumber);

// CRUD operations
router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'),
  auditLog('CREATE', 'Patient'),
  patientController.createPatient
);

router.get('/:id', patientController.getPatient);

router.get('/:id/details', patientController.getPatientDetails);

router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'),
  auditLog('UPDATE', 'Patient'),
  patientController.updatePatient
);

router.post(
  '/:id/discharge',
  authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR'),
  auditLog('DISCHARGE', 'Patient'),
  patientController.dischargePatient
);

router.delete(
  '/:id',
  authorize('SUPER_ADMIN'),
  auditLog('DELETE', 'Patient'),
  patientController.deletePatient
);

export default router;
