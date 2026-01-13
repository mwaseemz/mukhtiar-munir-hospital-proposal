import express from 'express';
import * as consultantRoundService from '../services/consultantRoundService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const record = await consultantRoundService.createConsultantRound(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating consultant round:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await consultantRoundService.getConsultantRoundsByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching consultant rounds:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await consultantRoundService.getConsultantRoundById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching consultant round:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
