import express from 'express';
import * as babyReceivingService from '../services/babyReceivingService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const record = await babyReceivingService.createBabyReceiving(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating baby receiving record:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await babyReceivingService.getBabyReceivingByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching baby receiving records:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await babyReceivingService.getBabyReceivingById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching baby receiving record:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const record = await babyReceivingService.updateBabyReceiving(id, data);
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error updating baby receiving record:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
