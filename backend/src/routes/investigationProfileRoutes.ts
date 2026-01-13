import express from 'express';
import { investigationProfileController } from '../controllers/investigationProfileController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create investigation profile
router.post('/patients/:patientId/investigation-profile', 
  investigationProfileController.createProfile.bind(investigationProfileController)
);

// Get all profiles for a patient
router.get('/patients/:patientId/investigation-profiles', 
  investigationProfileController.getProfilesByPatient.bind(investigationProfileController)
);

// Get single profile by ID
router.get('/investigation-profile/:id', 
  investigationProfileController.getProfileById.bind(investigationProfileController)
);

// Update profile
router.put('/investigation-profile/:id', 
  investigationProfileController.updateProfile.bind(investigationProfileController)
);

// Delete profile
router.delete('/investigation-profile/:id', 
  investigationProfileController.deleteProfile.bind(investigationProfileController)
);

export default router;
