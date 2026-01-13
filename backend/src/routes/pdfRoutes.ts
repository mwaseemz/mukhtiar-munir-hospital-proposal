import express from 'express';
import * as pdfService from '../services/pdfService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Generate PDF for consent form
router.get('/consent-form/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await pdfService.generateConsentFormPDF(id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=consent-form-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating consent form PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF for discharge summary
router.get('/discharge-summary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await pdfService.generateDischargeSummaryPDF(id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=discharge-summary-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating discharge summary PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF for estimate form
router.get('/estimate-form/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await pdfService.generateEstimateFormPDF(id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=estimate-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating estimate form PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF for medical history
router.get('/medical-history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await pdfService.generateMedicalHistoryPDF(id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=medical-history-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating medical history PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate complete patient file PDF
router.get('/patient-file/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const pdfBuffer = await pdfService.generatePatientFilePDF(patientId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=patient-file-${patientId}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating patient file PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
