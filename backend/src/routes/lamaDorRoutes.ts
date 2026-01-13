import express from 'express';
import { lamaDorController } from '../controllers/lamaDorController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create LAMA/DOR form
router.post('/patients/:patientId/lama-dor', 
  lamaDorController.createForm.bind(lamaDorController)
);

// Get all forms for a patient
router.get('/patients/:patientId/lama-dor-forms', 
  lamaDorController.getFormsByPatient.bind(lamaDorController)
);

// Get single form by ID
router.get('/lama-dor/:id', 
  lamaDorController.getFormById.bind(lamaDorController)
);

// Update form
router.put('/lama-dor/:id', 
  lamaDorController.updateForm.bind(lamaDorController)
);

// Delete form
router.delete('/lama-dor/:id', 
  lamaDorController.deleteForm.bind(lamaDorController)
);

export default router;
