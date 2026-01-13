import express from 'express';
import * as anesthesiaController from '../controllers/anesthesiaController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Anesthesia Record routes
router.post('/records', anesthesiaController.createAnesthesiaRecord);
router.get('/records/patient/:patientId', anesthesiaController.getAnesthesiaRecordsByPatientId);
router.get('/records/:id', anesthesiaController.getAnesthesiaRecordById);
router.put('/records/:id', anesthesiaController.updateAnesthesiaRecord);

// Post-Anesthesia Recovery routes
router.post('/recovery', anesthesiaController.createPostAnesthesiaRecovery);
router.get('/recovery/patient/:patientId', anesthesiaController.getPostAnesthesiaRecoveryByPatientId);
router.get('/recovery/:id', anesthesiaController.getPostAnesthesiaRecoveryById);
router.put('/recovery/:id', anesthesiaController.updatePostAnesthesiaRecovery);

export default router;
