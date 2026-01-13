import { Request, Response } from 'express';
import * as otProtocolService from '../services/otProtocolService';

// ===========================
// SHIFTING TO OT
// ===========================

export async function createShiftingToOT(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await otProtocolService.createShiftingToOT(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating shifting to OT:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getShiftingToOTByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await otProtocolService.getShiftingToOTByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching shifting to OT records:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getShiftingToOTById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await otProtocolService.getShiftingToOTById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching shifting to OT record:', error);
    res.status(500).json({ error: error.message });
  }
}

// ===========================
// RECEIVING IN OT
// ===========================

export async function createReceivingInOT(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await otProtocolService.createReceivingInOT(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating receiving in OT:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getReceivingInOTByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await otProtocolService.getReceivingInOTByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching receiving in OT records:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getReceivingInOTById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await otProtocolService.getReceivingInOTById(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching receiving in OT record:', error);
    res.status(500).json({ error: error.message });
  }
}

// ===========================
// PRE-OP CHECKLIST
// ===========================

export async function createPreOpChecklist(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await otProtocolService.createPreOpChecklist(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating pre-op checklist:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPreOpChecklistByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await otProtocolService.getPreOpChecklistByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching pre-op checklist records:', error);
    res.status(500).json({ error: error.message });
  }
}
