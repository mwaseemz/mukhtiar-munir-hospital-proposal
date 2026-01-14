-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN', 'RADIOLOGIST', 'ACCOUNTS', 'VIEWER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AdmissionType" AS ENUM ('EMERGENCY', 'PLANNED', 'OPD');

-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('ADMITTED', 'IN_OT', 'IN_RECOVERY', 'DISCHARGED', 'LAMA', 'DOR', 'EXPIRED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "AdmissionLocation" AS ENUM ('WARD', 'PRIVATE_ROOM', 'NURSERY', 'ICU');

-- CreateEnum
CREATE TYPE "PatientType" AS ENUM ('SURGERY', 'MEDICINE');

-- CreateEnum
CREATE TYPE "ConsentFormType" AS ENUM ('GENERAL_ADMISSION', 'OPERATION_URDU', 'ANESTHESIA_URDU');

-- CreateEnum
CREATE TYPE "SignatureType" AS ENUM ('ELECTRONIC', 'SCANNED', 'TYPED');

-- CreateEnum
CREATE TYPE "EstimateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'PARTIALLY_PAID');

-- CreateEnum
CREATE TYPE "AnesthesiaType" AS ENUM ('GENERAL', 'SPINAL', 'EPIDURAL', 'LOCAL', 'REGIONAL', 'SEDATION');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('MEDICATION', 'IV_FLUID', 'INVESTIGATION', 'PROCEDURE', 'DIET', 'ACTIVITY', 'NURSING_CARE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DISCONTINUED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('STAT', 'URGENT', 'ROUTINE');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('PENDING', 'GIVEN', 'MISSED', 'REFUSED', 'HELD');

-- CreateEnum
CREATE TYPE "TransfusionStatus" AS ENUM ('ORDERED', 'READY', 'IN_PROGRESS', 'COMPLETED', 'STOPPED');

-- CreateEnum
CREATE TYPE "CriticalEventType" AS ENUM ('CARDIAC_ARREST', 'RESPIRATORY_DISTRESS', 'SHOCK', 'HEMORRHAGE', 'SEIZURE', 'ALTERED_CONSCIOUSNESS', 'ANAPHYLAXIS', 'OTHER');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('NORMAL_VAGINAL', 'CESAREAN', 'ASSISTED_VAGINAL', 'FORCEPS', 'VACUUM');

-- CreateEnum
CREATE TYPE "BabyStatus" AS ENUM ('WITH_MOTHER', 'NICU', 'TRANSFERRED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DischargeType" AS ENUM ('ROUTINE', 'LAMA', 'DOR', 'TRANSFERRED', 'ABSCONDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'ALERT', 'REMINDER', 'APPROVAL', 'TASK');

-- CreateEnum
CREATE TYPE "LAMADORType" AS ENUM ('LAMA', 'DOR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'NURSE',
    "department" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "mrNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "cnic" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "alternatePhone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admissionType" "AdmissionType" NOT NULL,
    "admissionLocation" "AdmissionLocation" NOT NULL DEFAULT 'WARD',
    "patientType" "PatientType" NOT NULL DEFAULT 'MEDICINE',
    "admittedById" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "wardNumber" TEXT,
    "bedNumber" TEXT,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "previousSurgeries" TEXT,
    "chronicDiseases" TEXT,
    "antiHCV" BOOLEAN,
    "hbsAg" BOOLEAN,
    "hiv" BOOLEAN,
    "viralMarkersDate" TIMESTAMP(3),
    "viralMarkersAlert" BOOLEAN NOT NULL DEFAULT false,
    "status" "PatientStatus" NOT NULL DEFAULT 'ADMITTED',
    "dischargeDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_forms" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "formType" "ConsentFormType" NOT NULL,
    "patientName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianRelation" TEXT NOT NULL,
    "cnic" TEXT,
    "address" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "signatureId" TEXT,
    "signatureDate" TIMESTAMP(3),
    "witnessName" TEXT,
    "witnessSignature" TEXT,
    "uploadedDocUrl" TEXT,
    "isBlocking" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedById" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_signatures" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "signatureType" "SignatureType" NOT NULL,
    "signatureText" TEXT NOT NULL,
    "signatureStyle" TEXT NOT NULL,
    "signatureDataUrl" TEXT NOT NULL,
    "stampDataUrl" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimate_forms" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "procedureName" TEXT NOT NULL,
    "surgeonName" TEXT NOT NULL,
    "anesthetistName" TEXT NOT NULL,
    "estimatedDate" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "termsConditions" TEXT,
    "status" "EstimateStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimate_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_receiving_ward" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "receivingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivingTime" TEXT NOT NULL,
    "receivedBy" TEXT NOT NULL,
    "handedOverBy" TEXT NOT NULL,
    "consciousness" TEXT NOT NULL,
    "vitals" JSONB NOT NULL,
    "ivLines" TEXT,
    "drains" TEXT,
    "catheters" TEXT,
    "consentReceived" BOOLEAN NOT NULL,
    "investigationsReceived" BOOLEAN NOT NULL,
    "xraysReceived" BOOLEAN NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocol_receiving_ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_history" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "chiefComplaint" TEXT NOT NULL,
    "presentIllness" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "onset" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "pastMedicalHistory" TEXT,
    "pastSurgicalHistory" TEXT,
    "medicationHistory" TEXT,
    "allergies" TEXT,
    "familyHistory" TEXT,
    "socialHistory" TEXT,
    "reviewOfSystems" JSONB,
    "generalAppearance" TEXT,
    "vitals" JSONB NOT NULL,
    "systemicExamination" JSONB,
    "provisionalDiagnosis" TEXT NOT NULL,
    "investigationsAdvised" TEXT,
    "treatmentPlan" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifting_to_ot" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "shiftingDate" TIMESTAMP(3) NOT NULL,
    "shiftingTime" TEXT NOT NULL,
    "shiftedBy" TEXT NOT NULL,
    "consentVerified" BOOLEAN NOT NULL,
    "nbmStatus" BOOLEAN NOT NULL,
    "preOpMedication" BOOLEAN NOT NULL,
    "investigationsAttached" BOOLEAN NOT NULL,
    "ivLineSecured" BOOLEAN NOT NULL,
    "identificationVerified" BOOLEAN NOT NULL,
    "vitals" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shifting_to_ot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receiving_in_ot" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "receivingDate" TIMESTAMP(3) NOT NULL,
    "receivingTime" TEXT NOT NULL,
    "receivedBy" TEXT NOT NULL,
    "handedOverBy" TEXT NOT NULL,
    "identityVerified" BOOLEAN NOT NULL,
    "procedureVerified" BOOLEAN NOT NULL,
    "consentVerified" BOOLEAN NOT NULL,
    "siteMarked" BOOLEAN NOT NULL,
    "investigationsChecked" BOOLEAN NOT NULL,
    "consciousness" TEXT NOT NULL,
    "vitals" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receiving_in_ot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anesthesia_records" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "anesthetistId" TEXT NOT NULL,
    "asaClass" TEXT NOT NULL,
    "airwayAssessment" TEXT NOT NULL,
    "dentitionStatus" TEXT,
    "neckMovement" TEXT,
    "previousAnesthesia" TEXT,
    "anesthesiaType" "AnesthesiaType" NOT NULL,
    "technique" TEXT NOT NULL,
    "drugs" JSONB NOT NULL,
    "fluidsGiven" JSONB NOT NULL,
    "bloodProducts" JSONB,
    "vitalsChart" JSONB NOT NULL,
    "oxygenSaturation" JSONB NOT NULL,
    "etco2" JSONB,
    "airwayMethod" TEXT,
    "tubeSize" TEXT,
    "cuffPressure" TEXT,
    "complications" TEXT,
    "management" TEXT,
    "emergenceTime" TEXT,
    "recoveryNotes" TEXT,
    "postOpOrders" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anesthesia_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_op_checklist" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "patientIdentified" BOOLEAN NOT NULL,
    "wristbandChecked" BOOLEAN NOT NULL,
    "consentSigned" BOOLEAN NOT NULL,
    "procedureSiteMarked" BOOLEAN NOT NULL,
    "nbmVerified" BOOLEAN NOT NULL,
    "allergiesDocumented" BOOLEAN NOT NULL,
    "investigationsReviewed" BOOLEAN NOT NULL,
    "bloodArranged" BOOLEAN,
    "checklistItems" JSONB NOT NULL,
    "completedBy" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_op_checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_anesthesia_recovery" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "admissionTime" TIMESTAMP(3) NOT NULL,
    "dischargeTime" TIMESTAMP(3),
    "aldreteScores" JSONB NOT NULL,
    "vitalsChart" JSONB NOT NULL,
    "consciousness" TEXT NOT NULL,
    "airway" TEXT NOT NULL,
    "breathing" TEXT NOT NULL,
    "circulation" TEXT NOT NULL,
    "painScore" INTEGER,
    "nauseaVomiting" BOOLEAN NOT NULL,
    "oxygenGiven" TEXT,
    "fluidsGiven" JSONB,
    "medicationsGiven" JSONB,
    "dischargeCriteriaMet" BOOLEAN NOT NULL DEFAULT false,
    "dischargedTo" TEXT,
    "dischargedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_anesthesia_recovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_notes" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "surgeonId" TEXT NOT NULL,
    "operationDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" TEXT,
    "surgeon" TEXT NOT NULL,
    "assistant" TEXT,
    "anesthetist" TEXT NOT NULL,
    "nurses" TEXT,
    "diagnosis" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "operativeFindings" TEXT NOT NULL,
    "incision" TEXT,
    "procedureDetails" TEXT NOT NULL,
    "specimens" TEXT,
    "drains" TEXT,
    "closure" TEXT,
    "estimatedBloodLoss" TEXT,
    "fluidsGiven" JSONB,
    "bloodTransfusion" JSONB,
    "complications" TEXT,
    "postOpDiagnosis" TEXT NOT NULL,
    "postOpInstructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operation_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_op_notes" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "postOpDay" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "generalCondition" TEXT NOT NULL,
    "consciousness" TEXT NOT NULL,
    "vitals" JSONB NOT NULL,
    "painScore" INTEGER,
    "woundCondition" TEXT,
    "drainOutput" TEXT,
    "cardiovascular" TEXT,
    "respiratory" TEXT,
    "gastrointestinal" TEXT,
    "genitourinary" TEXT,
    "fluidsRunning" TEXT,
    "medications" TEXT,
    "plan" TEXT NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_op_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_op_orders" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dietOrders" TEXT,
    "activityOrders" TEXT,
    "nursingOrders" TEXT,
    "investigationOrders" TEXT,
    "medicationOrders" JSONB NOT NULL,
    "ivFluidsOrders" JSONB,
    "vitalsSigns" TEXT,
    "intakeOutput" BOOLEAN NOT NULL DEFAULT true,
    "orderedBy" TEXT NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_op_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_orders" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "orderedById" TEXT NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "medicationName" TEXT,
    "dosage" TEXT,
    "route" TEXT,
    "frequency" TEXT,
    "duration" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "investigationType" TEXT,
    "investigationName" TEXT,
    "orderDetails" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "Priority" NOT NULL DEFAULT 'ROUTINE',
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treatment_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treatment_administration" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "actualTime" TIMESTAMP(3),
    "doseGiven" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "site" TEXT,
    "status" "AdminStatus" NOT NULL DEFAULT 'PENDING',
    "administeredBy" TEXT,
    "witnessedBy" TEXT,
    "notes" TEXT,
    "reasonNotGiven" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treatment_administration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "input_output_chart" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "oralIntake" DOUBLE PRECISION,
    "ivFluids" DOUBLE PRECISION,
    "bloodProducts" DOUBLE PRECISION,
    "otherIntake" DOUBLE PRECISION,
    "totalIntake" DOUBLE PRECISION NOT NULL,
    "urineOutput" DOUBLE PRECISION,
    "drainOutput" DOUBLE PRECISION,
    "vomiting" DOUBLE PRECISION,
    "otherOutput" DOUBLE PRECISION,
    "totalOutput" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "cumulativeBalance" DOUBLE PRECISION,
    "recordedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "input_output_chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_progress_notes" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "subjective" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "assessment" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "vitals" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_progress_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultant_rounds" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "consultantId" TEXT NOT NULL,
    "roundDate" TIMESTAMP(3) NOT NULL,
    "roundTime" TEXT NOT NULL,
    "clinicalStatus" TEXT NOT NULL,
    "vitals" JSONB,
    "examination" TEXT,
    "investigationsReview" TEXT,
    "currentTreatmentReview" TEXT,
    "newOrders" TEXT,
    "modifications" TEXT,
    "plan" TEXT NOT NULL,
    "expectedDischarge" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultant_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_transfusions" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "orderedById" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "bagNumber" TEXT NOT NULL,
    "crossMatchDone" BOOLEAN NOT NULL,
    "crossMatchResult" TEXT,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "preVitals" JSONB,
    "monitoringChart" JSONB,
    "postVitals" JSONB,
    "reactions" TEXT,
    "management" TEXT,
    "status" "TransfusionStatus" NOT NULL DEFAULT 'ORDERED',
    "administeredBy" TEXT,
    "witnessedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_transfusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "critical_notes" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "eventType" "CriticalEventType" NOT NULL,
    "description" TEXT NOT NULL,
    "vitals" JSONB NOT NULL,
    "consciousness" TEXT NOT NULL,
    "actionsTaken" TEXT NOT NULL,
    "medications" JSONB,
    "procedures" JSONB,
    "outcome" TEXT,
    "relativesInformed" BOOLEAN NOT NULL DEFAULT false,
    "consultantInformed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "critical_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baby_receiving" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "babyName" TEXT,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "timeOfBirth" TEXT NOT NULL,
    "birthWeight" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION,
    "headCircumference" DOUBLE PRECISION,
    "deliveryType" "DeliveryType" NOT NULL,
    "gestationalAge" TEXT NOT NULL,
    "apgarScore1Min" INTEGER NOT NULL,
    "apgarScore5Min" INTEGER NOT NULL,
    "resuscitationRequired" BOOLEAN NOT NULL,
    "resuscitationDetails" TEXT,
    "generalAppearance" TEXT NOT NULL,
    "cryingStatus" TEXT NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "skinColor" TEXT NOT NULL,
    "feedingInitiated" BOOLEAN NOT NULL,
    "feedingType" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "respiratoryRate" INTEGER NOT NULL,
    "congenitalAbnormalities" TEXT,
    "status" "BabyStatus" NOT NULL DEFAULT 'WITH_MOTHER',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "baby_receiving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discharge_summaries" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "preparedById" TEXT NOT NULL,
    "dischargeDate" TIMESTAMP(3) NOT NULL,
    "dischargeTime" TEXT NOT NULL,
    "dischargeType" "DischargeType" NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL,
    "admissionDiagnosis" TEXT NOT NULL,
    "hospitalCourse" TEXT NOT NULL,
    "investigationsSummary" TEXT,
    "proceduresDone" TEXT,
    "finalDiagnosis" TEXT NOT NULL,
    "conditionAtDischarge" TEXT NOT NULL,
    "dischargeMedications" JSONB NOT NULL,
    "followUpInstructions" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3),
    "followUpWith" TEXT,
    "activityRestrictions" TEXT,
    "dietaryAdvice" TEXT,
    "lamaReason" TEXT,
    "lamaAcknowledgement" BOOLEAN,
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discharge_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'ROUTINE',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigation_profiles" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "cbc" BOOLEAN NOT NULL DEFAULT false,
    "hemoglobin" BOOLEAN NOT NULL DEFAULT false,
    "tlc" BOOLEAN NOT NULL DEFAULT false,
    "plateletCount" BOOLEAN NOT NULL DEFAULT false,
    "esr" BOOLEAN NOT NULL DEFAULT false,
    "bloodSugarRandom" BOOLEAN NOT NULL DEFAULT false,
    "bloodSugarFasting" BOOLEAN NOT NULL DEFAULT false,
    "hba1c" BOOLEAN NOT NULL DEFAULT false,
    "renalFunctionTest" BOOLEAN NOT NULL DEFAULT false,
    "liverFunctionTest" BOOLEAN NOT NULL DEFAULT false,
    "hbsAg" BOOLEAN NOT NULL DEFAULT false,
    "antiHCV" BOOLEAN NOT NULL DEFAULT false,
    "hiv" BOOLEAN NOT NULL DEFAULT false,
    "pt" BOOLEAN NOT NULL DEFAULT false,
    "aptt" BOOLEAN NOT NULL DEFAULT false,
    "inr" BOOLEAN NOT NULL DEFAULT false,
    "xrayChest" BOOLEAN NOT NULL DEFAULT false,
    "xrayAbdomen" BOOLEAN NOT NULL DEFAULT false,
    "ultrasound" BOOLEAN NOT NULL DEFAULT false,
    "ctScan" BOOLEAN NOT NULL DEFAULT false,
    "mri" BOOLEAN NOT NULL DEFAULT false,
    "ecg" BOOLEAN NOT NULL DEFAULT false,
    "echo" BOOLEAN NOT NULL DEFAULT false,
    "urineRE" BOOLEAN NOT NULL DEFAULT false,
    "urineCulture" BOOLEAN NOT NULL DEFAULT false,
    "bloodGrouping" BOOLEAN NOT NULL DEFAULT false,
    "crossMatching" BOOLEAN NOT NULL DEFAULT false,
    "additionalTests" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investigation_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_examinations" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "examinedById" TEXT NOT NULL,
    "generalAppearance" TEXT,
    "consciousness" TEXT,
    "bloodPressure" TEXT NOT NULL,
    "pulse" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "respiratoryRate" TEXT NOT NULL,
    "oxygenSaturation" TEXT,
    "pallor" BOOLEAN NOT NULL DEFAULT false,
    "jaundice" BOOLEAN NOT NULL DEFAULT false,
    "cyanosis" BOOLEAN NOT NULL DEFAULT false,
    "clubbing" BOOLEAN NOT NULL DEFAULT false,
    "edema" BOOLEAN NOT NULL DEFAULT false,
    "lymphadenopathy" BOOLEAN NOT NULL DEFAULT false,
    "cardiovascularSystem" TEXT,
    "respiratorySystem" TEXT,
    "gastrointestinalSystem" TEXT,
    "centralNervousSystem" TEXT,
    "musculoskeletalSystem" TEXT,
    "otherFindings" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physical_examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lama_dor_forms" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "type" "LAMADORType" NOT NULL,
    "reason" TEXT NOT NULL,
    "doctorStatement" TEXT NOT NULL,
    "risksExplained" BOOLEAN NOT NULL,
    "patientOrRelativeStatement" TEXT,
    "witnessName" TEXT,
    "witnessRelation" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lama_dor_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "patients_mrNumber_key" ON "patients"("mrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_admittedById_fkey" FOREIGN KEY ("admittedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_forms" ADD CONSTRAINT "consent_forms_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_forms" ADD CONSTRAINT "consent_forms_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_forms" ADD CONSTRAINT "consent_forms_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "digital_signatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate_forms" ADD CONSTRAINT "estimate_forms_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate_forms" ADD CONSTRAINT "estimate_forms_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_receiving_ward" ADD CONSTRAINT "protocol_receiving_ward_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_history" ADD CONSTRAINT "medical_history_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifting_to_ot" ADD CONSTRAINT "shifting_to_ot_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_in_ot" ADD CONSTRAINT "receiving_in_ot_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anesthesia_records" ADD CONSTRAINT "anesthesia_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anesthesia_records" ADD CONSTRAINT "anesthesia_records_anesthetistId_fkey" FOREIGN KEY ("anesthetistId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_op_checklist" ADD CONSTRAINT "pre_op_checklist_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_anesthesia_recovery" ADD CONSTRAINT "post_anesthesia_recovery_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_notes" ADD CONSTRAINT "operation_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_notes" ADD CONSTRAINT "operation_notes_surgeonId_fkey" FOREIGN KEY ("surgeonId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_op_notes" ADD CONSTRAINT "post_op_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_op_orders" ADD CONSTRAINT "post_op_orders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_orders" ADD CONSTRAINT "treatment_orders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_orders" ADD CONSTRAINT "treatment_orders_orderedById_fkey" FOREIGN KEY ("orderedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_administration" ADD CONSTRAINT "treatment_administration_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "treatment_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_administration" ADD CONSTRAINT "treatment_administration_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "input_output_chart" ADD CONSTRAINT "input_output_chart_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_progress_notes" ADD CONSTRAINT "daily_progress_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_progress_notes" ADD CONSTRAINT "daily_progress_notes_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultant_rounds" ADD CONSTRAINT "consultant_rounds_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultant_rounds" ADD CONSTRAINT "consultant_rounds_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_transfusions" ADD CONSTRAINT "blood_transfusions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_transfusions" ADD CONSTRAINT "blood_transfusions_orderedById_fkey" FOREIGN KEY ("orderedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_notes" ADD CONSTRAINT "critical_notes_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_notes" ADD CONSTRAINT "critical_notes_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baby_receiving" ADD CONSTRAINT "baby_receiving_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discharge_summaries" ADD CONSTRAINT "discharge_summaries_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discharge_summaries" ADD CONSTRAINT "discharge_summaries_preparedById_fkey" FOREIGN KEY ("preparedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_profiles" ADD CONSTRAINT "investigation_profiles_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_profiles" ADD CONSTRAINT "investigation_profiles_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_examinations" ADD CONSTRAINT "physical_examinations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_examinations" ADD CONSTRAINT "physical_examinations_examinedById_fkey" FOREIGN KEY ("examinedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lama_dor_forms" ADD CONSTRAINT "lama_dor_forms_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lama_dor_forms" ADD CONSTRAINT "lama_dor_forms_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

