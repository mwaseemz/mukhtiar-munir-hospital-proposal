import { Request, Response } from 'express';
import * as anesthesiaService from '../services/anesthesiaService';

// ===========================
// ANESTHESIA RECORD
// ===========================

export async function createAnesthesiaRecord(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await anesthesiaService.createAnesthesiaRecord(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating anesthesia record:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAnesthesiaRecordsByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await anesthesiaService.getAnesthesiaRecordsByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching anesthesia records:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAnesthesiaRecordById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await anesthesiaService.getAnesthesiaRecordById(id);
    if (!record) {
      return res.status(404).json({ error: 'Anesthesia record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching anesthesia record:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateAnesthesiaRecord(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const record = await anesthesiaService.updateAnesthesiaRecord(id, data);
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error updating anesthesia record:', error);
    res.status(500).json({ error: error.message });
  }
}

// ===========================
// POST-ANESTHESIA RECOVERY
// ===========================

export async function createPostAnesthesiaRecovery(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await anesthesiaService.createPostAnesthesiaRecovery(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating post-anesthesia recovery:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPostAnesthesiaRecoveryByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await anesthesiaService.getPostAnesthesiaRecoveryByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching post-anesthesia recovery records:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPostAnesthesiaRecoveryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await anesthesiaService.getPostAnesthesiaRecoveryById(id);
    if (!record) {
      return res.status(404).json({ error: 'Post-anesthesia recovery record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching post-anesthesia recovery record:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updatePostAnesthesiaRecovery(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const record = await anesthesiaService.updatePostAnesthesiaRecovery(id, data);
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error updating post-anesthesia recovery:', error);
    res.status(500).json({ error: error.message });
  }
}
