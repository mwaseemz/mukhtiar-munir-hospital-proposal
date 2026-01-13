import express from 'express';
import { physicalExaminationController } from '../controllers/physicalExaminationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create physical examination
router.post('/patients/:patientId/physical-exam', 
  physicalExaminationController.createExamination.bind(physicalExaminationController)
);

// Get all examinations for a patient
router.get('/patients/:patientId/physical-exams', 
  physicalExaminationController.getExaminationsByPatient.bind(physicalExaminationController)
);

// Get single examination by ID
router.get('/physical-exam/:id', 
  physicalExaminationController.getExaminationById.bind(physicalExaminationController)
);

// Update examination
router.put('/physical-exam/:id', 
  physicalExaminationController.updateExamination.bind(physicalExaminationController)
);

// Delete examination
router.delete('/physical-exam/:id', 
  physicalExaminationController.deleteExamination.bind(physicalExaminationController)
);

export default router;
