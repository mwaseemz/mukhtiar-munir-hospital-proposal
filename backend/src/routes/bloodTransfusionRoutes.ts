import express from 'express';
import * as bloodTransfusionService from '../services/bloodTransfusionService';
import * as criticalNoteService from '../services/criticalNoteService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Blood Transfusion routes
router.post('/transfusions', async (req, res) => {
  try {
    const data = req.body;
    const record = await bloodTransfusionService.createBloodTransfusion(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating blood transfusion:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/transfusions/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await bloodTransfusionService.getBloodTransfusionsByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching blood transfusions:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/transfusions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await bloodTransfusionService.getBloodTransfusionById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching blood transfusion:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/transfusions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const record = await bloodTransfusionService.updateBloodTransfusion(id, data);
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error updating blood transfusion:', error);
    res.status(500).json({ error: error.message });
  }
});

// Critical Notes routes
router.post('/critical-notes', async (req, res) => {
  try {
    const data = req.body;
    const record = await criticalNoteService.createCriticalNote(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating critical note:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/critical-notes/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await criticalNoteService.getCriticalNotesByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching critical notes:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/critical-notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await criticalNoteService.getCriticalNoteById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching critical note:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
