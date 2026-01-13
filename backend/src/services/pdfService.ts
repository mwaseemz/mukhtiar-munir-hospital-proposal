import PDFDocument from 'pdfkit';
import prisma from '../config/database';

/**
 * PDF Generation Service
 * Generates PDF documents for all forms and records
 */

// ===========================
// CONSENT FORM PDF
// ===========================

export async function generateConsentFormPDF(consentFormId: string): Promise<Buffer> {
  const consentForm = await prisma.consentForm.findUnique({
    where: { id: consentFormId },
    include: {
      patient: true,
      completedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      signature: true,
    },
  });

  if (!consentForm) {
    throw new Error('Consent form not found');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Mukhtiar Munir Hospital', { align: 'center' });
    doc.fontSize(14).text('CONSENT FORM', { align: 'center' });
    doc.moveDown();

    // Form Type
    const formTypeMap: any = {
      GENERAL_ADMISSION: 'General Admission Consent',
      OPERATION_URDU: 'Operation Consent (Urdu)',
      ANESTHESIA_URDU: 'Anesthesia Consent (Urdu)',
    };
    doc.fontSize(16).text(formTypeMap[consentForm.formType] || consentForm.formType);
    doc.moveDown();

    // Patient Information
    doc.fontSize(12).text(`Patient Name: ${consentForm.patientName}`);
    doc.text(`MR Number: ${consentForm.patient.mrNumber}`);
    doc.text(`Age: ${consentForm.age} years`);
    doc.text(`Gender: ${consentForm.gender}`);
    doc.text(`Guardian: ${consentForm.guardianName} (${consentForm.guardianRelation})`);
    if (consentForm.cnic) {
      doc.text(`CNIC: ${consentForm.cnic}`);
    }
    doc.text(`Address: ${consentForm.address}`);
    doc.moveDown();

    // Form Data
    doc.fontSize(12).text('Form Details:', { underline: true });
    doc.moveDown(0.5);
    
    if (consentForm.formData) {
      const formData = consentForm.formData as any;
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          doc.text(`${key}: ${value}`);
        }
      }
    }
    doc.moveDown();

    // Signatures
    doc.fontSize(12).text('Signatures:', { underline: true });
    doc.moveDown(0.5);
    
    if (consentForm.completedBy) {
      doc.text(`Completed By: ${consentForm.completedBy.firstName} ${consentForm.completedBy.lastName}`);
    }
    
    if (consentForm.signatureDate) {
      doc.text(`Date: ${new Date(consentForm.signatureDate).toLocaleDateString()}`);
    }
    
    if (consentForm.witnessName) {
      doc.text(`Witness: ${consentForm.witnessName}`);
    }

    // Digital Stamp
    doc.moveDown(2);
    doc.fontSize(10).text('Mukhtiar Munir Hospital', { align: 'center' });
    doc.text('Digital Stamp & Signature', { align: 'center' });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text(
      `Generated on: ${new Date().toLocaleString()}`,
      { align: 'center' }
    );

    doc.end();
  });
}

// ===========================
// DISCHARGE SUMMARY PDF
// ===========================

export async function generateDischargeSummaryPDF(summaryId: string): Promise<Buffer> {
  const summary = await prisma.dischargeSummary.findUnique({
    where: { id: summaryId },
    include: {
      patient: true,
      preparedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!summary) {
    throw new Error('Discharge summary not found');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Mukhtiar Munir Hospital', { align: 'center' });
    doc.fontSize(14).text('DISCHARGE SUMMARY', { align: 'center' });
    doc.moveDown();

    // Patient Information
    doc.fontSize(12).text(`Patient Name: ${summary.patient.firstName} ${summary.patient.lastName}`);
    doc.text(`MR Number: ${summary.patient.mrNumber}`);
    doc.text(`Admission Date: ${new Date(summary.admissionDate).toLocaleDateString()}`);
    doc.text(`Discharge Date: ${new Date(summary.dischargeDate).toLocaleDateString()}`);
    doc.text(`Discharge Time: ${summary.dischargeTime}`);
    doc.text(`Discharge Type: ${summary.dischargeType}`);
    doc.moveDown();

    // Admission Diagnosis
    doc.fontSize(12).text('Admission Diagnosis:', { underline: true });
    doc.text(summary.admissionDiagnosis);
    doc.moveDown();

    // Hospital Course
    doc.fontSize(12).text('Hospital Course:', { underline: true });
    doc.text(summary.hospitalCourse, { align: 'justify' });
    doc.moveDown();

    // Final Diagnosis
    doc.fontSize(12).text('Final Diagnosis:', { underline: true });
    doc.text(summary.finalDiagnosis);
    doc.moveDown();

    // Condition at Discharge
    doc.fontSize(12).text('Condition at Discharge:', { underline: true });
    doc.text(summary.conditionAtDischarge);
    doc.moveDown();

    // Discharge Medications
    doc.fontSize(12).text('Discharge Medications:', { underline: true });
    const medications = summary.dischargeMedications as any[];
    if (medications && medications.length > 0) {
      medications.forEach((med: any, index: number) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage} - ${med.instructions}`);
      });
    }
    doc.moveDown();

    // Follow-up Instructions
    doc.fontSize(12).text('Follow-up Instructions:', { underline: true });
    doc.text(summary.followUpInstructions, { align: 'justify' });
    doc.moveDown();

    if (summary.followUpDate) {
      doc.text(`Follow-up Date: ${new Date(summary.followUpDate).toLocaleDateString()}`);
      if (summary.followUpWith) {
        doc.text(`Follow-up With: ${summary.followUpWith}`);
      }
    }

    // Prepared By
    doc.moveDown(2);
    doc.text(`Prepared By: Dr. ${summary.preparedBy.firstName} ${summary.preparedBy.lastName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text(
      `Generated on: ${new Date().toLocaleString()}`,
      { align: 'center' }
    );

    doc.end();
  });
}

// ===========================
// ESTIMATE FORM PDF
// ===========================

export async function generateEstimateFormPDF(estimateId: string): Promise<Buffer> {
  const estimate = await prisma.estimateForm.findUnique({
    where: { id: estimateId },
    include: {
      patient: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!estimate) {
    throw new Error('Estimate form not found');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Mukhtiar Munir Hospital', { align: 'center' });
    doc.fontSize(14).text('COST ESTIMATE', { align: 'center' });
    doc.moveDown();

    // Patient Information
    doc.fontSize(12).text(`Patient Name: ${estimate.patient.firstName} ${estimate.patient.lastName}`);
    doc.text(`MR Number: ${estimate.patient.mrNumber}`);
    doc.text(`Procedure: ${estimate.procedureName}`);
    doc.text(`Surgeon: ${estimate.surgeonName}`);
    doc.text(`Anesthetist: ${estimate.anesthetistName}`);
    doc.text(`Estimated Date: ${new Date(estimate.estimatedDate).toLocaleDateString()}`);
    doc.moveDown();

    // Cost Breakdown
    doc.fontSize(12).text('Cost Breakdown:', { underline: true });
    doc.moveDown(0.5);

    const items = estimate.items as any[];
    if (items && items.length > 0) {
      // Table header
      doc.text('Description', 50, doc.y, { width: 200, continued: true });
      doc.text('Qty', 250, doc.y, { width: 50, continued: true });
      doc.text('Rate', 300, doc.y, { width: 100, continued: true });
      doc.text('Amount', 400, doc.y, { width: 100 });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // Table rows
      items.forEach((item: any) => {
        doc.text(item.description, 50, doc.y, { width: 200, continued: true });
        doc.text(item.quantity.toString(), 250, doc.y, { width: 50, continued: true });
        doc.text(`Rs. ${item.rate}`, 300, doc.y, { width: 100, continued: true });
        doc.text(`Rs. ${item.amount}`, 400, doc.y, { width: 100 });
        doc.moveDown();
      });
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Totals
    doc.text(`Subtotal: Rs. ${estimate.subtotal}`, { align: 'right' });
    doc.text(`Discount: Rs. ${estimate.discount}`, { align: 'right' });
    doc.text(`Tax: Rs. ${estimate.tax}`, { align: 'right' });
    doc.fontSize(14).text(`Grand Total: Rs. ${estimate.grandTotal}`, { align: 'right', underline: true });

    // Payment Policy
    doc.moveDown(2);
    doc.fontSize(10).text('Payment Policy:', { underline: true });
    doc.text('100% payment will be received at time of admission');

    // Notes
    if (estimate.notes) {
      doc.moveDown();
      doc.text('Notes:', { underline: true });
      doc.text(estimate.notes, { align: 'justify' });
    }

    // Signatures
    doc.moveDown(2);
    doc.text(`Prepared By: ${estimate.createdBy.firstName} ${estimate.createdBy.lastName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text(
      `Generated on: ${new Date().toLocaleString()}`,
      { align: 'center' }
    );

    doc.end();
  });
}

// ===========================
// MEDICAL HISTORY PDF
// ===========================

export async function generateMedicalHistoryPDF(historyId: string): Promise<Buffer> {
  const history = await prisma.medicalHistory.findUnique({
    where: { id: historyId },
    include: {
      patient: true,
      recordedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!history) {
    throw new Error('Medical history not found');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Mukhtiar Munir Hospital', { align: 'center' });
    doc.fontSize(14).text('MEDICAL HISTORY', { align: 'center' });
    doc.moveDown();

    // Patient Information
    doc.fontSize(12).text(`Patient Name: ${history.patient.firstName} ${history.patient.lastName}`);
    doc.text(`MR Number: ${history.patient.mrNumber}`);
    doc.text(`Date: ${new Date(history.recordedAt).toLocaleDateString()}`);
    doc.moveDown();

    // Chief Complaint
    doc.fontSize(12).text('Chief Complaint:', { underline: true });
    doc.text(history.chiefComplaint);
    doc.moveDown();

    // History of Present Illness
    doc.fontSize(12).text('History of Present Illness:', { underline: true });
    doc.text(history.presentIllness);
    doc.text(`Duration: ${history.duration}`);
    doc.text(`Onset: ${history.onset}`);
    doc.text(`Severity: ${history.severity}`);
    doc.moveDown();

    // Past Medical History
    if (history.pastMedicalHistory) {
      doc.fontSize(12).text('Past Medical History:', { underline: true });
      doc.text(history.pastMedicalHistory);
      doc.moveDown();
    }

    // Allergies
    if (history.allergies) {
      doc.fontSize(12).text('Allergies:', { underline: true });
      doc.text(history.allergies);
      doc.moveDown();
    }

    // Provisional Diagnosis
    doc.fontSize(12).text('Provisional Diagnosis:', { underline: true });
    doc.text(history.provisionalDiagnosis);
    doc.moveDown();

    // Treatment Plan
    if (history.treatmentPlan) {
      doc.fontSize(12).text('Treatment Plan:', { underline: true });
      doc.text(history.treatmentPlan);
      doc.moveDown();
    }

    // Recorded By
    doc.moveDown(2);
    doc.text(`Recorded By: Dr. ${history.recordedBy.firstName} ${history.recordedBy.lastName}`);
    doc.text(`Date: ${new Date(history.recordedAt).toLocaleDateString()}`);

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text(
      `Generated on: ${new Date().toLocaleString()}`,
      { align: 'center' }
    );

    doc.end();
  });
}

// ===========================
// GENERIC PATIENT FILE PDF
// ===========================

export async function generatePatientFilePDF(patientId: string): Promise<Buffer> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      consentForms: true,
      medicalHistories: true,
      dischargeSummaries: true,
    },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Mukhtiar Munir Hospital', { align: 'center' });
    doc.fontSize(14).text('PATIENT FILE', { align: 'center' });
    doc.moveDown();

    // Patient Information
    doc.fontSize(12).text(`Patient Name: ${patient.firstName} ${patient.lastName}`);
    doc.text(`MR Number: ${patient.mrNumber}`);
    doc.text(`Father Name: ${patient.fatherName}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Age: ${patient.age} years`);
    doc.text(`Phone: ${patient.phoneNumber}`);
    doc.text(`Address: ${patient.address}`);
    doc.text(`Admission Date: ${new Date(patient.admissionDate).toLocaleDateString()}`);
    doc.text(`Admission Location: ${patient.admissionLocation}`);
    doc.text(`Patient Type: ${patient.patientType}`);
    doc.text(`Status: ${patient.status}`);
    doc.moveDown();

    // Viral Markers
    doc.fontSize(12).text('Viral Markers:', { underline: true });
    doc.text(`Anti-HCV: ${patient.antiHCV ? 'Positive' : 'Negative'}`);
    doc.text(`HBsAg: ${patient.hbsAg ? 'Positive' : 'Negative'}`);
    doc.text(`HIV: ${patient.hiv ? 'Positive' : 'Negative'}`);
    doc.moveDown();

    // Summary of Records
    doc.fontSize(12).text('Records Summary:', { underline: true });
    doc.text(`Consent Forms: ${patient.consentForms.length}`);
    doc.text(`Medical Histories: ${patient.medicalHistories.length}`);
    doc.text(`Discharge Summaries: ${patient.dischargeSummaries.length}`);

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text(
      `Generated on: ${new Date().toLocaleString()}`,
      { align: 'center' }
    );

    doc.end();
  });
}
