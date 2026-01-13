import express from 'express';
import * as dischargeSummaryService from '../services/dischargeSummaryService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const record = await dischargeSummaryService.createDischargeSummary(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating discharge summary:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await dischargeSummaryService.getDischargeSummariesByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching discharge summaries:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await dischargeSummaryService.getDischargeSummaryById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching discharge summary:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const record = await dischargeSummaryService.updateDischargeSummary(id, data);
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error updating discharge summary:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
