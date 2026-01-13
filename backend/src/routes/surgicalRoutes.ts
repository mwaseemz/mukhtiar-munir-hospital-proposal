import express from 'express';
import * as surgicalController from '../controllers/surgicalController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Operation Notes routes
router.post('/operation-notes', surgicalController.createOperationNotes);
router.get('/operation-notes/patient/:patientId', surgicalController.getOperationNotesByPatientId);
router.get('/operation-notes/:id', surgicalController.getOperationNotesById);

// Post-Op Notes routes
router.post('/post-op-notes', surgicalController.createPostOpNotes);
router.get('/post-op-notes/patient/:patientId', surgicalController.getPostOpNotesByPatientId);
router.get('/post-op-notes/:id', surgicalController.getPostOpNotesById);

// Post-Op Orders routes
router.post('/post-op-orders', surgicalController.createPostOpOrders);
router.get('/post-op-orders/patient/:patientId', surgicalController.getPostOpOrdersByPatientId);
router.get('/post-op-orders/:id', surgicalController.getPostOpOrdersById);

export default router;
