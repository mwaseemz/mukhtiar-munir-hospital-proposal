import express from 'express';
import * as treatmentOrderService from '../services/treatmentOrderService';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Treatment Orders routes
router.post('/orders', async (req, res) => {
  try {
    const data = req.body;
    const order = await treatmentOrderService.createTreatmentOrder(data);
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating treatment order:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const orders = await treatmentOrderService.getTreatmentOrdersByPatientId(patientId);
    res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching treatment orders:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await treatmentOrderService.getTreatmentOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Treatment order not found' });
    }
    res.status(200).json(order);
  } catch (error: any) {
    console.error('Error fetching treatment order:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const order = await treatmentOrderService.updateTreatmentOrder(id, data);
    res.status(200).json(order);
  } catch (error: any) {
    console.error('Error updating treatment order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Treatment Administration routes
router.post('/administration', async (req, res) => {
  try {
    const data = req.body;
    const administration = await treatmentOrderService.createTreatmentAdministration(data);
    res.status(201).json(administration);
  } catch (error: any) {
    console.error('Error creating treatment administration:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/administration/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const administrations = await treatmentOrderService.getAdministrationsByOrderId(orderId);
    res.status(200).json(administrations);
  } catch (error: any) {
    console.error('Error fetching administrations:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/administration/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const administrations = await treatmentOrderService.getAdministrationsByPatientId(patientId);
    res.status(200).json(administrations);
  } catch (error: any) {
    console.error('Error fetching administrations:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/administration/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const administration = await treatmentOrderService.updateTreatmentAdministration(id, data);
    res.status(200).json(administration);
  } catch (error: any) {
    console.error('Error updating administration:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
