import express from 'express';
import * as blockingService from '../services/blockingService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Check consent blocking
router.get('/check/consent/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await blockingService.checkConsentBlocking(patientId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error checking consent blocking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check treatment administration blocking
router.get('/check/treatment/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const forDate = req.query.date ? new Date(req.query.date as string) : undefined;
    const result = await blockingService.checkTreatmentAdministrationBlocking(patientId, forDate);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error checking treatment blocking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check daily progress note blocking
router.get('/check/dpn/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const forDate = req.query.date ? new Date(req.query.date as string) : undefined;
    const result = await blockingService.checkDailyProgressNoteBlocking(patientId, forDate);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error checking DPN blocking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check consultant order acknowledgement
router.get('/check/consultant-orders/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await blockingService.checkConsultantOrderAcknowledgement(patientId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error checking consultant order acknowledgement:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check all blocking rules for an action
router.get('/check/all/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const action = (req.query.action as any) || 'TREATMENT';
    const result = await blockingService.checkAllBlockingRules(patientId, action);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error checking all blocking rules:', error);
    res.status(500).json({ error: error.message });
  }
});

// Validate form signature
router.post('/validate/signature', async (req, res) => {
  try {
    const formData = req.body;
    const result = blockingService.validateFormSignature(formData);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error validating form signature:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
