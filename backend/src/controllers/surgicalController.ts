import { Request, Response } from 'express';
import * as surgicalService from '../services/surgicalService';

// ===========================
// OPERATION NOTES
// ===========================

export async function createOperationNotes(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await surgicalService.createOperationNotes(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating operation notes:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getOperationNotesByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await surgicalService.getOperationNotesByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching operation notes:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getOperationNotesById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await surgicalService.getOperationNotesById(id);
    if (!record) {
      return res.status(404).json({ error: 'Operation notes not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching operation notes:', error);
    res.status(500).json({ error: error.message });
  }
}

// ===========================
// POST-OP NOTES
// ===========================

export async function createPostOpNotes(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await surgicalService.createPostOpNotes(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating post-op notes:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPostOpNotesByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await surgicalService.getPostOpNotesByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching post-op notes:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPostOpNotesById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await surgicalService.getPostOpNotesById(id);
    if (!record) {
      return res.status(404).json({ error: 'Post-op notes not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching post-op notes:', error);
    res.status(500).json({ error: error.message });
  }
}

// ===========================
// POST-OP ORDERS
// ===========================

export async function createPostOpOrders(req: Request, res: Response) {
  try {
    const data = req.body;
    const record = await surgicalService.createPostOpOrders(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating post-op orders:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPostOpOrdersByPatientId(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const records = await surgicalService.getPostOpOrdersByPatientId(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    console.error('Error fetching post-op orders:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getPostOpOrdersById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const record = await surgicalService.getPostOpOrdersById(id);
    if (!record) {
      return res.status(404).json({ error: 'Post-op orders not found' });
    }
    res.status(200).json(record);
  } catch (error: any) {
    console.error('Error fetching post-op orders:', error);
    res.status(500).json({ error: error.message });
  }
}
