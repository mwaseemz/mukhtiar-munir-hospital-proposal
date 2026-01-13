import { createClient } from '@supabase/supabase-js';
import prisma from '../config/database';

/**
 * File Upload Service
 * Handles document uploads, scanner integration, and file storage
 */

// Make Supabase optional for local development
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// Only initialize Supabase if credentials are provided
let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

const BUCKET_NAME = 'hospital-documents';

// ===========================
// FILE UPLOAD
// ===========================

export async function uploadFile(
  file: Express.Multer.File,
  metadata: {
    patientId: string;
    documentType: string;
    uploadedBy: string;
  }
): Promise<{
  fileUrl: string;
  filePath: string;
}> {
  try {
    // Generate unique file path
    const timestamp = Date.now();
    const fileName = `${metadata.patientId}/${metadata.documentType}/${timestamp}-${file.originalname}`;

    // If Supabase is not configured, return mock data for local development
    if (!supabase) {
      console.warn('Supabase not configured. Using mock file storage for local development.');
      return {
        fileUrl: `http://localhost:3001/uploads/${fileName}`,
        filePath: fileName,
      };
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      fileUrl: urlData.publicUrl,
      filePath: fileName,
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// ===========================
// UPLOAD CONSENT FORM DOCUMENT
// ===========================

export async function uploadConsentFormDocument(
  consentFormId: string,
  file: Express.Multer.File,
  uploadedBy: string
): Promise<void> {
  const consentForm = await prisma.consentForm.findUnique({
    where: { id: consentFormId },
    select: { patientId: true },
  });

  if (!consentForm) {
    throw new Error('Consent form not found');
  }

  const { fileUrl } = await uploadFile(file, {
    patientId: consentForm.patientId,
    documentType: 'consent-form',
    uploadedBy,
  });

  // Update consent form with uploaded document URL
  await prisma.consentForm.update({
    where: { id: consentFormId },
    data: {
      uploadedDocUrl: fileUrl,
      isCompleted: true,
      completedAt: new Date(),
      completedById: uploadedBy,
    },
  });
}

// ===========================
// UPLOAD PRESCRIPTION/EXTERNAL DOCUMENT
// ===========================

export async function uploadPrescription(
  patientId: string,
  file: Express.Multer.File,
  uploadedBy: string,
  notes?: string
): Promise<{
  fileUrl: string;
  filePath: string;
}> {
  const result = await uploadFile(file, {
    patientId,
    documentType: 'prescription',
    uploadedBy,
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: uploadedBy,
      action: 'UPLOAD',
      entity: 'PRESCRIPTION',
      entityId: patientId,
      changes: {
        fileUrl: result.fileUrl,
        notes,
      },
    },
  });

  return result;
}

// ===========================
// UPLOAD INVESTIGATION/LAB REPORT
// ===========================

export async function uploadInvestigationReport(
  patientId: string,
  file: Express.Multer.File,
  uploadedBy: string,
  reportType: string,
  reportDate: Date
): Promise<{
  fileUrl: string;
  filePath: string;
}> {
  const result = await uploadFile(file, {
    patientId,
    documentType: `investigation-${reportType}`,
    uploadedBy,
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: uploadedBy,
      action: 'UPLOAD',
      entity: 'INVESTIGATION_REPORT',
      entityId: patientId,
      changes: {
        fileUrl: result.fileUrl,
        reportType,
        reportDate,
      },
    },
  });

  return result;
}

// ===========================
// GET PATIENT DOCUMENTS
// ===========================

export async function getPatientDocuments(patientId: string): Promise<any[]> {
  // Get consent forms with uploaded documents
  const consentForms = await prisma.consentForm.findMany({
    where: {
      patientId,
      uploadedDocUrl: {
        not: null,
      },
    },
    select: {
      id: true,
      formType: true,
      uploadedDocUrl: true,
      createdAt: true,
    },
  });

  // Get audit logs for uploaded documents
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      entityId: patientId,
      action: 'UPLOAD',
      entity: {
        in: ['PRESCRIPTION', 'INVESTIGATION_REPORT'],
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  return [
    ...consentForms.map((form) => ({
      type: 'consent-form',
      subType: form.formType,
      url: form.uploadedDocUrl,
      uploadedAt: form.createdAt,
    })),
    ...auditLogs.map((log) => ({
      type: log.entity?.toLowerCase(),
      url: (log.changes as any)?.fileUrl,
      uploadedAt: log.timestamp,
      metadata: log.changes,
    })),
  ];
}

// ===========================
// DELETE DOCUMENT
// ===========================

export async function deleteDocument(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
}
