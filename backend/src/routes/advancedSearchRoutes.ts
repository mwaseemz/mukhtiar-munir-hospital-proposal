import express from 'express';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Advanced patient search
router.get('/patients/advanced-search', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mrNumber,
      cnic,
      phoneNumber,
      admissionLocation,
      patientType,
      status,
      admissionDateFrom,
      admissionDateTo,
      dischargeDateFrom,
      dischargeDateTo,
      ageFrom,
      ageTo,
      gender,
      antiHCV,
      hbsAg,
      hiv,
    } = req.query;

    // Build where clause dynamically
    const where: any = {};

    if (firstName) {
      where.firstName = { contains: firstName as string, mode: 'insensitive' };
    }

    if (lastName) {
      where.lastName = { contains: lastName as string, mode: 'insensitive' };
    }

    if (mrNumber) {
      where.mrNumber = { contains: mrNumber as string, mode: 'insensitive' };
    }

    if (cnic) {
      where.cnic = { contains: cnic as string };
    }

    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber as string };
    }

    if (admissionLocation) {
      where.admissionLocation = admissionLocation;
    }

    if (patientType) {
      where.patientType = patientType;
    }

    if (status) {
      where.status = status;
    }

    if (gender) {
      where.gender = gender;
    }

    if (antiHCV === 'true') {
      where.antiHCV = true;
    }

    if (hbsAg === 'true') {
      where.hbsAg = true;
    }

    if (hiv === 'true') {
      where.hiv = true;
    }

    // Age range
    if (ageFrom || ageTo) {
      where.age = {};
      if (ageFrom) where.age.gte = parseInt(ageFrom as string);
      if (ageTo) where.age.lte = parseInt(ageTo as string);
    }

    // Admission date range
    if (admissionDateFrom || admissionDateTo) {
      where.admissionDate = {};
      if (admissionDateFrom) where.admissionDate.gte = new Date(admissionDateFrom as string);
      if (admissionDateTo) where.admissionDate.lte = new Date(admissionDateTo as string);
    }

    // Discharge date range
    if (dischargeDateFrom || dischargeDateTo) {
      where.dischargeDate = {};
      if (dischargeDateFrom) where.dischargeDate.gte = new Date(dischargeDateFrom as string);
      if (dischargeDateTo) where.dischargeDate.lte = new Date(dischargeDateTo as string);
    }

    const patients = await prisma.patient.findMany({
      where,
      orderBy: {
        admissionDate: 'desc',
      },
      take: 100, // Limit to 100 results
    });

    res.json(patients);
  } catch (error: any) {
    console.error('Error in advanced search:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
