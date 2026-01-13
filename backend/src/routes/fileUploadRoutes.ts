import express from 'express';
import * as fileUploadService from '../services/fileUploadService';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();
router.use(authenticate);

// Upload consent form document
router.post('/consent-form/:consentFormId', upload.single('document'), async (req, res) => {
  try {
    const { consentFormId } = req.params;
    const file = req.file;
    const userId = (req as any).user.userId;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await fileUploadService.uploadConsentFormDocument(consentFormId, file, userId);
    res.status(200).json({ message: 'Consent form document uploaded successfully' });
  } catch (error: any) {
    console.error('Error uploading consent form document:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload prescription
router.post('/prescription/:patientId', upload.single('document'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { notes } = req.body;
    const file = req.file;
    const userId = (req as any).user.userId;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await fileUploadService.uploadPrescription(patientId, file, userId, notes);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error uploading prescription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload investigation report
router.post('/investigation/:patientId', upload.single('document'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { reportType, reportDate } = req.body;
    const file = req.file;
    const userId = (req as any).user.userId;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!reportType || !reportDate) {
      return res.status(400).json({ error: 'Report type and date are required' });
    }

    const result = await fileUploadService.uploadInvestigationReport(
      patientId,
      file,
      userId,
      reportType,
      new Date(reportDate)
    );
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error uploading investigation report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all documents for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const documents = await fileUploadService.getPatientDocuments(patientId);
    res.status(200).json(documents);
  } catch (error: any) {
    console.error('Error fetching patient documents:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
