import express from 'express';
import * as inputOutputService from '../services/inputOutputService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const record = await inputOutputService.createInputOutputChart(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating input/output chart:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await inputOutputService.getInputOutputByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching input/output charts:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await inputOutputService.getInputOutputById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching input/output chart:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
