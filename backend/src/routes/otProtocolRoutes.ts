import express from 'express';
import * as otProtocolController from '../controllers/otProtocolController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Shifting to OT routes
router.post('/shifting-to-ot', otProtocolController.createShiftingToOT);
router.get('/shifting-to-ot/patient/:patientId', otProtocolController.getShiftingToOTByPatientId);
router.get('/shifting-to-ot/:id', otProtocolController.getShiftingToOTById);

// Receiving in OT routes
router.post('/receiving-in-ot', otProtocolController.createReceivingInOT);
router.get('/receiving-in-ot/patient/:patientId', otProtocolController.getReceivingInOTByPatientId);
router.get('/receiving-in-ot/:id', otProtocolController.getReceivingInOTById);

// Pre-op checklist routes
router.post('/pre-op-checklist', otProtocolController.createPreOpChecklist);
router.get('/pre-op-checklist/patient/:patientId', otProtocolController.getPreOpChecklistByPatientId);

export default router;
