# Hospital Management System - Comprehensive Testing Guide

## 🚀 Getting Started

### System Access
- **Frontend URL**: http://localhost:3000
- **Backend URL**: http://localhost:3001

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@hospital.com | Admin@123 |
| **Doctor** | doctor@hospital.com | Admin@123 |
| **Nurse** | nurse@hospital.com | Admin@123 |
| **Receptionist** | reception@hospital.com | Admin@123 |

---

## 📋 Phase 1: Authentication & User Management

### Test 1.1: Login Functionality
1. Navigate to http://localhost:3000/login
2. Try logging in with **Admin** credentials
3. **Expected Result**: 
   - Successfully redirected to `/dashboard`
   - Dashboard shows user profile with role "SUPER_ADMIN"
   - Navigation menu shows all available modules

### Test 1.2: Dashboard Access
1. After successful login, verify dashboard displays:
   - User statistics (Total Users, Active Users, Inactive Users, Recent Logins)
   - Patient statistics (Total Patients, Active Patients, Admitted Patients, Discharged Today)
   - Quick action cards
2. **Expected Result**: All statistics display correctly with real-time data

### Test 1.3: User Management (Admin Only)
1. Navigate to **Users** from the sidebar
2. Click "Add New User" button
3. Fill in user details:
   ```
   Username: testdoctor
   Email: testdoctor@hospital.com
   First Name: Test
   Last Name: Doctor
   Role: DOCTOR
   Phone: +92-300-1234444
   Department: Surgery
   ```
4. Submit the form
5. **Expected Result**:
   - User created successfully
   - New user appears in the users list
   - Password is automatically generated and displayed (Admin@123)

---

## 📋 Phase 2: Patient Registration & Admission (Patient-Centric Workflow)

### Test 2.1: Patient Registration
1. Log in as **Receptionist**
2. Navigate to **Patients** → **Register New Patient**
3. Fill in the General Consent Form:
   ```
   MR Number: Auto-generated (e.g., 1/26/I)
   Patient Type: Indoor (I)
   Full Name: Ahmed Khan
   Father's Name: Muhammad Khan
   Age: 35
   Gender: Male
   CNIC: 42301-1234567-1
   Contact: +92-300-9876543
   Emergency Contact: +92-300-1111111
   Address: 123 Main Street, Lahore
   
   Viral Markers:
   - Anti-HEV: Negative
   - Hepatitis C: Negative
   - HBsAg: Negative
   - Hepatitis B: Negative
   - HIV: Negative
   - Test Date: [Current Date]
   ```
4. Submit the form
5. **Expected Result**:
   - Patient registered successfully
   - Unique MR number generated in format `[number]/[year]/[type]`
   - Redirected to Patient Profile page at `/patients/[id]`
   - Patient status shows "ADMITTED"

### Test 2.2: Patient Profile Dashboard
1. After registration, verify the Patient Profile page displays:
   - **Patient Header**: MR number, name, age, gender, admission date
   - **Status Indicators**: Current status (Admitted, In Surgery, Discharged, etc.)
   - **Quick Actions Grid**: Cards for all patient-related forms and actions
   - **Tabbed Interface**: 
     - Overview
     - Medical Records
     - Forms & Documents
     - Timeline
     - Billing
2. **Expected Result**: All sections display correctly with patient data

### Test 2.3: Medical History Form
1. From Patient Profile, click **Medical History** quick action
2. Fill in the Medical History form:
   ```
   Consultant Doctor: Dr. John Smith
   Presenting Complaint: Abdominal pain for 2 days
   Past Illness: Diabetes (controlled)
   Family History: Father had hypertension
   Drug History: 
     - Allergies: Penicillin
     - Current Medications: Metformin 500mg BD
   History of Presenting Complaint: Patient reports sharp pain in lower right abdomen...
   
   Physical Examination:
   - Blood Pressure: 120/80 mmHg
   - Temperature: 98.6°F
   - Pulse: 75 bpm
   - Respiratory Rate: 16/min
   - Weight: 75 kg
   - Height: 170 cm
   ```
3. Add digital signature and timestamp
4. **Expected Result**:
   - Form saved successfully
   - Form appears in Medical Records tab
   - Timeline updated with new entry

---

## 📋 Phase 3: Pre-Operative Workflow

### Test 3.1: Consent for Operation
1. From Patient Profile, click **Operation Consent** quick action
2. Fill in the consent form:
   ```
   Procedure Name: Appendectomy
   Surgeon: Dr. John Smith
   Anesthetist: Dr. Sarah Williams
   Scheduled Date: [Select date/time]
   Special Instructions: Patient has penicillin allergy
   ```
3. Upload doctor's prescription (PDF/image)
4. Get patient/relative signature (in real scenario, print → sign → scan → upload)
5. **Expected Result**:
   - Consent form created
   - **Blocking Check**: Cannot proceed to OT without this consent
   - Form available for surgeon's later signature

### Test 3.2: Consent for Anesthesia
1. From Patient Profile, click **Anesthesia Consent** quick action
2. Fill in the anesthesia consent:
   ```
   Operation Type: Appendectomy
   Anesthesia Method: General
   Anesthetist: Dr. Sarah Williams
   Pre-Anesthetic Assessment: Patient fit for general anesthesia
   ```
3. **Expected Result**:
   - Anesthesia consent created
   - **Blocking Check**: Cannot proceed to OT without anesthesia consent
   - Form available for anesthetist's later signature

### Test 3.3: Estimate Form
1. From Patient Profile, click **Estimate Form** quick action
2. Fill in the estimate:
   ```
   Room Category: VIP Room
   Room Charges: 5,000 PKR/day
   Surgery Charges: 50,000 PKR
   Anesthesia Charges: 15,000 PKR
   Consultant Charges: 20,000 PKR
   Medicine Charges (Estimated): 10,000 PKR
   Additional Comments: Total package 70,000 PKR (X-ray separate)
   
   Payment Status: Full Payment Received at Admission
   ```
3. **Expected Result**:
   - Estimate created and saved
   - Available for director's signature at month-end
   - Printable for patient/relative

### Test 3.4: Investigation Profile
1. From Patient Profile, click **Investigation Profile** quick action
2. Select investigations performed:
   ```
   Hematology:
   - [x] CBC
   - [x] Hemoglobin
   - [x] TLC
   - [x] Platelet Count
   
   Biochemistry:
   - [x] Blood Sugar (Random)
   - [x] Urea
   - [x] Creatinine
   
   Serology:
   - [x] Hepatitis C
   - [x] HIV
   ```
3. **Expected Result**:
   - Investigation profile saved
   - Checklist available for medical officer's review

### Test 3.5: Prescription Upload
1. From Patient Profile, click **Prescription Upload** quick action
2. Upload external doctor's prescription (PDF/image)
3. Add notes: "Pre-operative prescription from consultant"
4. **Expected Result**:
   - Prescription uploaded successfully
   - Available in Forms & Documents tab
   - Viewable by all medical staff

### Test 3.6: Physical Examination
1. From Patient Profile, click **Physical Exam** quick action
2. Fill in detailed physical examination:
   ```
   General Examination:
   - General Appearance: Well-nourished, appears in mild distress
   - Vitals: BP 120/80, Pulse 75, Temp 98.6°F, RR 16
   - Pallor: Absent
   - Jaundice: Absent
   - Cyanosis: Absent
   - Edema: Absent
   
   Systemic Examination:
   - Cardiovascular: S1 S2 normal, no murmurs
   - Respiratory: Bilateral air entry equal, no wheeze
   - Abdominal: Tenderness in RIF, guarding present
   - Nervous System: Conscious, oriented to time/place/person
   ```
3. **Expected Result**:
   - Physical examination saved
   - Available for review by consultant
   - Not printed for patient (internal medical record)

---

## 📋 Phase 4: Ward Care & Monitoring

### Test 4.1: Protocol of Receiving Patient in Ward
1. From Patient Profile, click **Receive in Ward** (under OT & Procedures → Ward Protocols)
2. Fill in receiving protocol:
   ```
   Receiving Staff: Nurse Mary Johnson
   Receiving Date/Time: [Auto-generated, adjustable by admin]
   
   Patient Status:
   - Vitals: BP 120/80, Pulse 75, Temp 98.6°F
   - Hospital Dress Provided: Yes
   - Hair Cleaned (Pre-op): Yes
   - NPO (Nil Per Oral): Yes, since midnight
   - Blood Arrangement: Type O+ arranged, 2 units
   - Investigations Available: Yes, all reports available
   - Premedication Given: Yes, as per protocol
   ```
3. **Expected Result**:
   - Receiving protocol saved
   - Patient status updated to "IN_WARD"
   - Timeline updated

### Test 4.2: Protocol of Shifting Patient to OT
1. From Patient Profile, click **Shift to OT** (under OT & Procedures → Ward Protocols)
2. Fill in shifting protocol:
   ```
   Shifting Staff: Nurse Mary Johnson
   Shifting Date/Time: [Current time]
   
   Shifting Vitals:
   - BP: 118/78
   - Pulse: 70
   - Temp: 98.4°F
   - RR: 15
   
   Medical Records Sent:
   - [x] X-ray films
   - [x] Blood investigation bottles
   - [x] Consent forms
   - [x] Medical history
   ```
3. **Expected Result**:
   - Shifting protocol saved
   - Patient status updated to "IN_SURGERY"
   - **Blocking Check**: Ensures all required documents are with patient

### Test 4.3: Receiving Notes in OT
1. From Patient Profile, click **Receive in OT** (under OT & Procedures → OT Protocols)
2. OT staff confirms receipt:
   ```
   Receiving Staff: OTA Ahmed
   Patient Condition: Stable, pre-medicated
   All Documents Received: Yes
   Patient Identity Verified: Yes
   Surgical Site Marked: Yes
   ```
3. **Expected Result**:
   - OT receiving notes saved
   - **Blocking Check**: Cannot start surgery without proper receiving documentation

---

## 📋 Phase 5: Anesthesia & Surgery

### Test 5.1: Anesthesia Record
1. Log in as **Doctor** (anesthetist)
2. Navigate to patient's profile
3. Click **Anesthesia Record** (under OT & Procedures)
4. Fill in anesthesia record:
   ```
   Pre-Operative Assessment:
   - Consent Verified: Yes
   - CT Scan Reviewed: N/A
   - Blood Pressure: 120/80
   - Blood Sugar: 110 mg/dL
   - Airway Assessment: Mallampati Class I
   
   Anesthesia Details:
   - Type: General Anesthesia
   - Induction: Propofol 120mg IV
   - Maintenance: Sevoflurane 2% + O2
   - Muscle Relaxant: Atracurium 30mg
   - Intubation: ETT 7.5mm, smooth intubation
   
   Intra-Operative Monitoring:
   - BP: 110-125/70-80 mmHg
   - HR: 65-75 bpm
   - SpO2: 98-100%
   - EtCO2: 35-38 mmHg
   ```
5. Add anesthetist's digital signature and stamp
6. **Expected Result**:
   - Anesthesia record saved
   - Printable for medical records
   - Available for audit

### Test 5.2: Pre-Op Checklist (Anesthesia)
1. From patient profile, click **Pre-Op Checklist**
2. Verify equipment and medications:
   ```
   Equipment Check:
   - [x] Laryngoscope (working)
   - [x] Endotracheal tube (appropriate size)
   - [x] Oxygen supply (adequate)
   - [x] Suction (functional)
   - [x] Monitoring equipment (calibrated)
   
   Medications Available:
   - [x] Propofol
   - [x] Muscle relaxant
   - [x] Emergency drugs (Atropine, Epinephrine)
   ```
3. **Expected Result**:
   - Checklist completed and saved
   - **Blocking Check**: Surgery cannot proceed without completed checklist
   - This is a security measure, not for patient signature

### Test 5.3: Operation Notes
1. Log in as **Doctor** (surgeon)
2. Navigate to patient's profile
3. Click **Operation Notes** (under OT & Procedures)
4. Fill in operation notes (immediately after surgery):
   ```
   Surgeon: Dr. John Smith
   Assistant: Dr. Ahmed Ali
   Anesthetist: Dr. Sarah Williams
   OT Staff: OTA Ahmed, Nurse Fatima
   
   Operation Performed: Laparoscopic Appendectomy
   Date/Time: [Current date/time]
   
   Pre-Operative Diagnosis: Acute Appendicitis
   Post-Operative Diagnosis: Acute Appendicitis with Perforation
   
   Operative Findings:
   - Inflamed appendix with perforation
   - Minimal peritoneal contamination
   - No other abnormalities noted
   
   Procedure Details:
   - Three-port laparoscopic approach
   - Appendix identified and mobilized
   - Appendicular artery ligated
   - Appendix removed in endobag
   - Peritoneal lavage done
   - Hemostasis achieved
   
   Specimens: Appendix sent for histopathology
   Blood Loss: ~50 ml
   Duration: 45 minutes
   ```
5. Add surgeon's digital signature and stamp
6. **Expected Result**:
   - Operation notes saved
   - Patient status updated to "POST_OP"
   - Timeline updated with surgery completion

### Test 5.4: Post-Op Orders
1. From patient profile, click **Post-Op Orders**
2. Fill in post-operative orders:
   ```
   Monitoring:
   - Vitals: Every 15 minutes for 1 hour, then hourly
   - Intake/Output: Strict monitoring
   - Drain Output: Record amount and character
   
   Position: Head end elevated 30 degrees
   
   Diet: 
   - NPO for 6 hours
   - Then clear liquids if bowel sounds present
   
   IV Fluids:
   - Normal Saline 1000ml over 8 hours
   - Then Ringer Lactate 1000ml over 8 hours
   
   Medications:
   - Inj. Ceftriaxone 1g IV BD
   - Inj. Metronidazole 500mg IV TDS
   - Inj. Nalbuphine 10mg IV SOS for pain
   - Inj. Ondansetron 4mg IV SOS for nausea
   
   Drain Care: Remove drain when output <50ml/24hr
   
   Wound Care: Keep dressing dry and intact
   
   Lab/Imaging:
   - CBC in morning
   - Chest X-ray if respiratory symptoms
   ```
3. **Expected Result**:
   - Post-op orders saved
   - Available for nursing staff to follow
   - Forms basis for treatment tickets

### Test 5.5: Post-Anesthesia Recovery Form
1. Log in as **Doctor** (anesthetist)
2. Navigate to patient's profile
3. Click **Post-Anesthesia Recovery** (under OT & Procedures)
4. Fill in recovery assessment:
   ```
   Recovery Room Admission Time: [Immediate post-op]
   
   Aldrete Score Assessment:
   - Activity: 2 (moves all extremities)
   - Respiration: 2 (breathes deeply, coughs)
   - Circulation: 2 (BP ±20% of pre-op)
   - Consciousness: 2 (fully awake)
   - Color: 2 (pink, well oxygenated)
   Total Score: 10/10
   
   Vitals in Recovery:
   - BP: 120/75
   - Pulse: 70
   - Temp: 98.2°F
   - SpO2: 99% on room air
   
   Pain Score: 3/10
   Nausea/Vomiting: None
   
   Time to Discharge from Recovery: 1 hour post-op
   Condition on Discharge: Stable, fully awake, pain controlled
   ```
5. **Expected Result**:
   - Recovery form saved
   - Patient ready for ward transfer
   - Anesthetist signs off on recovery

### Test 5.6: Protocol of Shifting Patient from OT to Ward
1. From patient profile, click **Shift from OT to Ward**
2. Fill in shifting protocol:
   ```
   Shifting Staff: OTA Ahmed
   Receiving Ward: General Surgery Ward
   Shifting Date/Time: [Current time]
   
   Patient Condition:
   - Fully awake: Yes
   - Hemodynamically stable: Yes
   - Pain controlled: Yes
   - Vitals: BP 120/75, Pulse 70, Temp 98.2°F, SpO2 99%
   
   Items Sent with Patient:
   - [x] Post-op orders
   - [x] Anesthesia record
   - [x] Operation notes
   - [x] IV line in situ (right hand)
   - [x] Urinary catheter in situ
   - [x] Surgical drain in place
   ```
3. **Expected Result**:
   - Shifting protocol saved
   - Patient status updated to "IN_WARD"
   - Timeline updated

### Test 5.7: Protocol of Receiving Patient from OT
1. Log in as **Nurse**
2. Navigate to patient's profile
3. Click **Receive from OT in Ward**
4. Fill in receiving protocol:
   ```
   Receiving Nurse: Nurse Mary Johnson
   Receiving Date/Time: [Current time]
   
   Patient Assessment:
   - Conscious and oriented: Yes
   - Vitals: BP 118/72, Pulse 68, Temp 98.4°F, SpO2 98%
   - Pain Score: 3/10
   - Dressing: Clean and dry
   - Drain: In place, minimal output
   - IV line: Patent, infusing well
   - Catheter: In situ, clear urine draining
   
   Post-Op Orders Received and Verified: Yes
   All Documents Received: Yes
   Patient Placed in Bed: Yes, comfortable position
   Call Bell Within Reach: Yes
   Relatives Informed: Yes
   ```
5. **Expected Result**:
   - Receiving protocol saved
   - Post-operative care initiated
   - **Blocking Check**: Ensures continuity of care from OT to ward

---

## 📋 Phase 6: Post-Operative Care & Treatment

### Test 6.1: Treatment Tickets (Medication Administration)
1. Log in as **Nurse**
2. Navigate to patient's profile
3. Click **Treatment Tickets**
4. **Critical Test - DPN Blocking Mechanism**:
   ```
   Try to administer morning medications (8 AM dose)
   WITHOUT entering morning Daily Progress Notes (DPN)
   
   Expected Result: 
   - System should BLOCK medication administration
   - Error message: "Cannot administer medication. Daily Progress Notes for this shift not yet entered."
   - This forces doctors to enter DPN on time
   ```

5. Now, properly administer medications:
   ```
   First, doctor must enter morning DPN (see Test 6.3)
   
   Then, nurse can administer:
   
   Medication 1:
   - Name: Inj. Ceftriaxone
   - Dosage: 1g
   - Route: IV
   - Frequency: BD (Twice daily)
   - Dilution: Mixed in 100ml Normal Saline
   - Time Administered: 08:00 AM
   - Nurse Signature: [Digital signature]
   - Nurse Stamp: [Auto-generated with name and designation]
   - Date/Time: [Auto-recorded]
   
   Medication 2:
   - Name: Inj. Metronidazole
   - Dosage: 500mg
   - Route: IV
   - Frequency: TDS (Three times daily)
   - Dilution: Ready-to-use infusion
   - Time Administered: 08:00 AM
   - Nurse Signature: [Digital signature]
   - Nurse Stamp: [Auto-generated]
   - Date/Time: [Auto-recorded]
   ```

6. **Test Medication Discontinuation**:
   ```
   After 3 days, discontinue Metronidazole:
   - Click "Discontinue" on medication
   - System should require:
     - Reason for discontinuation
     - Nurse signature
     - Nurse stamp
     - Date/Time
   ```

7. **Expected Result**:
   - All medication administrations logged with complete audit trail
   - **Strict blocking mechanism enforces DPN before medication**
   - Discontinuation properly documented
   - Available for inspection by PSC (Punjab Healthcare Commission)

### Test 6.2: Input/Output Chart
1. From patient profile, click **I/O Chart**
2. Record hourly fluid intake and output:
   ```
   Input (Hourly):
   09:00 AM:
   - Oral: 100 ml water
   - IV: 125 ml Normal Saline
   - Total: 225 ml
   
   10:00 AM:
   - Oral: 50 ml juice
   - IV: 125 ml Normal Saline
   - Total: 175 ml
   
   Output (Hourly):
   09:00 AM:
   - Urine: 80 ml (clear yellow)
   - Drain: 5 ml (serosanguinous)
   - Total: 85 ml
   
   10:00 AM:
   - Urine: 100 ml (clear yellow)
   - Drain: 3 ml (serous)
   - Total: 103 ml
   ```
3. **Expected Result**:
   - Hourly I/O recorded
   - Running totals calculated automatically
   - 24-hour balance calculated
   - Available for doctor's review

### Test 6.3: Daily Progress Notes (DPN) - Doctor's Part
1. Log in as **Doctor**
2. Navigate to patient's profile
3. Click **Daily Progress Notes**
4. Fill in morning DPN (Post-Op Day 1):
   ```
   Date: [Current date]
   Time: 08:00 AM (Adjustable by admin if needed for emergency cases)
   Shift: Morning
   
   Subjective (S):
   - Patient comfortable, pain controlled
   - No nausea or vomiting
   - Passing flatus
   
   Objective (O):
   - Vitals: BP 118/70, Pulse 72, Temp 98.6°F, RR 16
   - Abdomen: Soft, non-tender, bowel sounds present
   - Wound: Clean, dry, no signs of infection
   - Drain: Minimal output (~10ml/24hr, serous)
   
   Assessment (A):
   - Post-op Day 1, Laparoscopic Appendectomy
   - Patient recovering well
   - No complications
   
   Plan (P):
   - Continue antibiotics (Ceftriaxone + Metronidazole)
   - Start oral clear liquids
   - Mobilize patient
   - Remove drain if output remains minimal
   - Plan discharge tomorrow if stable
   
   Doctor Signature: [Digital signature]
   Doctor Stamp: [Auto-generated]
   Date/Time: [Auto-recorded - NO RELAXATION]
   ```
5. **Expected Result**:
   - DPN saved successfully
   - **This DPN entry now ALLOWS morning medication administration**
   - Available for consultant's review
   - If DPN not entered, subsequent doses are BLOCKED

### Test 6.4: Daily Progress Notes (DPN) - Nurse's Part
1. Log in as **Nurse**
2. Navigate to patient's profile
3. Click **Daily Progress Notes**
4. Fill in nursing notes:
   ```
   Date: [Current date]
   Time: 09:00 AM
   Shift: Morning
   
   General Condition: Comfortable, pain score 2/10
   Vitals: Stable as recorded
   
   Nursing Care Provided:
   - Vital signs monitored hourly
   - IV antibiotics administered as per prescription
   - Oral hygiene care given
   - Position changed, back care given
   - Patient mobilized to chair for 30 minutes
   
   Intake/Output: As per I/O chart
   Wound/Drain: Dressing clean and dry, drain output minimal
   
   Patient Education:
   - Breathing exercises taught
   - Encouraged to drink fluids
   - Pain management explained
   
   Nurse Signature: [Digital signature]
   Nurse Stamp: [Auto-generated]
   ```
5. **Expected Result**:
   - Nursing DPN saved
   - Multiple notes possible per shift
   - Available for handover to next shift

### Test 6.5: Consultant Round Orders
1. Log in as **Doctor** (consultant)
2. Navigate to patient's profile
3. Click **Consultant Rounds**
4. Fill in consultant's orders:
   ```
   Round Date/Time: [Current date, 2:00 PM]
   Consultant: Dr. John Smith
   
   Problems:
   1. Post-op Day 1, Laparoscopic Appendectomy
   2. Recovering well, no complications
   
   Actions Taken:
   - Reviewed all investigation reports
   - Examined patient, wound healing well
   - Reviewed I/O chart, adequate hydration
   
   Plan:
   - Continue current management
   - Remove drain today if output <20ml
   - Start soft diet
   - Plan discharge tomorrow with oral antibiotics
   
   Remarks:
   - Patient counseled regarding wound care
   - Advised follow-up in OPD after 1 week
   - Advised stitch removal after 7 days
   
   Consultant Signature: [Digital signature]
   ```
5. **Test Vetting Requirement**:
   ```
   After consultant enters orders:
   - System should require REGISTRAR (on-duty doctor) to "vet" (acknowledge)
   - Registrar must sign/stamp to confirm they've read and will implement orders
   - This creates accountability
   ```
6. **Expected Result**:
   - Consultant orders saved
   - Pending vetting by registrar
   - **Vetting requirement ensures orders are communicated**
   - Can be multiple entries per day based on patient condition

---

## 📋 Phase 7: Special Events & Documentation

### Test 7.1: Blood Transfusion Form
1. From patient profile, click **Blood Transfusion**
2. Fill in transfusion details:
   ```
   Date/Time: [Current date/time]
   Indication: Post-operative anemia (Hb 7.5 g/dL)
   
   Blood Product: Packed Red Cells
   Blood Group: O Positive
   Unit Number: RBC-2026-0123
   Volume: 350 ml
   Batch Number: PKR-2026-Jan-15
   
   Pre-Transfusion:
   - Vitals: BP 110/70, Pulse 85, Temp 98.4°F
   - Cross-match: Compatible
   - Patient ID verified: Yes
   - Blood unit verified: Yes
   
   During Transfusion:
   - Start Time: 10:00 AM
   - Rate: 60 drops/min (slow for first 15 min)
   - Patient monitored: Every 15 minutes
   - Vitals: Stable throughout
   - Adverse Reactions: None
   
   Post-Transfusion:
   - End Time: 12:30 PM
   - Total Volume: 350 ml transfused
   - Vitals: BP 118/72, Pulse 75, Temp 98.6°F
   - Patient Condition: Stable, no reactions
   
   Administered By: Nurse Mary Johnson
   Verified By: Dr. Ahmed Ali
   ```
3. **Expected Result**:
   - Transfusion form saved with complete audit trail
   - Available for review and compliance
   - Timeline updated

### Test 7.2: Critical Notes
1. From patient profile, click **Critical Notes**
2. Document a critical event:
   ```
   Date/Time: [Hypothetical - 2:00 AM]
   Shift: Night
   
   Critical Event: Patient complained of sudden shortness of breath
   
   Initial Observations:
   - Vitals: BP 140/90, Pulse 110, Temp 99.2°F, SpO2 92% on room air, RR 24
   - Patient anxious, sweating
   - Chest auscultation: Bilateral basal crackles
   
   Actions Taken:
   - Oxygen started at 4L/min via nasal prongs
   - SpO2 improved to 96%
   - On-call doctor informed immediately
   - ECG done - shows sinus tachycardia
   - Chest X-ray done - mild pulmonary edema
   
   Doctor's Assessment:
   - Likely fluid overload
   - IV fluids stopped
   - Inj. Furosemide 20mg IV given
   
   Outcome:
   - Patient improved within 1 hour
   - Vitals stabilized: BP 120/75, Pulse 80, SpO2 98%, RR 18
   - Urine output increased (300ml in 2 hours)
   - Patient comfortable
   
   Documented By: Nurse Sarah Williams
   Verified By: Dr. On-Call Ahmed Ali
   ```
3. **Expected Result**:
   - Critical event documented comprehensively
   - Available for review and learning
   - Demonstrates proper response to emergency
   - Can be entered by nurses

### Test 7.3: Baby Receiving Notes (For Maternity Cases)
1. From patient profile (maternity patient), click **Baby Receiving Notes**
2. Fill in newborn assessment:
   ```
   Baby Details:
   - Date/Time of Birth: [Current date/time]
   - Gender: Male
   - Weight: 3.2 kg
   - Length: 50 cm
   - Head Circumference: 34 cm
   
   Apgar Score:
   - 1 minute: 8/10
   - 5 minutes: 9/10
   
   Initial Assessment:
   - Cry: Good, vigorous
   - Color: Pink, well perfused
   - Activity: Active movements
   - Breathing: Regular, no distress
   - Heart Rate: 140 bpm
   
   Immediate Care:
   - Airway suctioned: Yes
   - Dried and wrapped: Yes
   - Vitamin K administered: Yes (1mg IM)
   - Eye prophylaxis: Yes (Erythromycin ointment)
   - Identification bands applied: Yes
   
   Physical Examination:
   - Head: Moulding present, no caput/cephalohematoma
   - Eyes: Normal, red reflex present
   - Oral cavity: Intact palate, no cleft
   - Heart: S1 S2 normal, no murmur
   - Abdomen: Soft, umbilical cord clamped
   - Genitalia: Normal male genitalia, testes descended
   - Spine: Normal, no defects
   - Limbs: Normal, moves all limbs
   - Anus: Patent
   
   Congenital Abnormalities: None detected
   
   Foot Print: [Upload scanned foot print]
   Baby Photo: [Upload photo]
   
   Guardian's Signature: [In real scenario, print → sign → scan → upload]
   Receiving Staff: Nurse Mary Johnson
   ```
3. **Expected Result**:
   - Baby receiving notes saved
   - Foot print and photo uploaded
   - Available for birth certificate processing
   - Required for discharge

### Test 7.4: LAMA/DOR Form (Leave Against Medical Advice / Discharge On Request)
1. From patient profile, click **LAMA/DOR**
2. Fill in the form:
   ```
   Form Type: LAMA (Leave Against Medical Advice)
   Date/Time: [Current date/time]
   
   Doctor's Statement:
   "Patient Ahmed Khan (MR 1/26/I) wishes to leave the hospital against medical advice on Day 2 post-appendectomy. I have explained to the patient and relatives that:
   
   1. Patient is still on IV antibiotics and requires at least 2 more days of hospital care
   2. Early discharge increases risk of wound infection and complications
   3. Patient should return immediately if fever, increased pain, or wound discharge occurs
   4. Patient will need to continue oral antibiotics at home
   5. Follow-up in OPD is mandatory after 3 days
   
   Despite these warnings, patient insists on discharge due to personal reasons. All risks explained in presence of witness."
   
   Doctor Name: Dr. John Smith
   Doctor Signature: [Digital signature]
   Doctor Stamp: [Auto-generated]
   
   Patient/Relative Statement:
   "I understand the risks explained by the doctor. I am taking discharge on my own responsibility for personal reasons. I will follow up as advised."
   
   Patient/Relative Name: Ahmed Khan (Patient)
   Relation: Self
   CNIC: 42301-1234567-1
   Contact: +92-300-9876543
   
   Witness:
   - Name: Muhammad Khan (Father)
   - CNIC: 42301-7654321-9
   - Contact: +92-300-1111111
   
   [In real scenario: Print form → Patient/relative signs → Thumb impression → Scan → Upload]
   ```
3. **Expected Result**:
   - LAMA/DOR form created
   - Patient status updated to "DISCHARGED"
   - Form uploaded after signatures obtained
   - Legal documentation for hospital protection

---

## 📋 Phase 8: Discharge Process

### Test 8.1: Discharge Summary
1. From patient profile, click **Discharge Summary**
2. Fill in comprehensive discharge summary:
   ```
   Discharge Date: [Current date]
   Duration of Stay: 3 days
   
   Admission Diagnosis: Acute Appendicitis
   Final Diagnosis: Acute Appendicitis with Perforation
   
   Procedures Performed:
   - Laparoscopic Appendectomy on [Date]
   
   Hospital Course:
   "Patient was admitted with complaints of abdominal pain for 2 days. Clinical examination and investigations confirmed acute appendicitis. Patient underwent laparoscopic appendectomy under general anesthesia. Post-operative recovery was uneventful. Patient tolerated oral diet, mobilized well, and wound healing satisfactory. Patient is being discharged in stable condition."
   
   Investigations Summary:
   - Pre-op: CBC (WBC 14,000), Viral markers (all negative)
   - Post-op: CBC (WBC 10,000, Hb 11.5)
   
   Treatment Given:
   - Inj. Ceftriaxone 1g IV BD for 3 days
   - Inj. Metronidazole 500mg IV TDS for 3 days
   - Inj. Nalbuphine 10mg IV SOS for pain
   
   Condition at Discharge: Stable, afebrile, pain controlled
   
   Discharge Medications:
   1. Tab. Cefixime 200mg PO BD for 5 days
   2. Tab. Metronidazole 400mg PO TDS for 5 days
   3. Tab. Ibuprofen 400mg PO TDS for 3 days (after meals)
   
   Follow-up Instructions:
   - Follow-up in Surgical OPD after 1 week
   - Suture removal after 7 days
   - Return immediately if fever, wound discharge, or severe pain
   - Wound care: Keep dry, no wetting for 5 days
   
   Activity:
   - Rest for 1 week
   - No heavy lifting for 2 weeks
   - Gradual return to normal activities
   
   Diet:
   - Normal diet as tolerated
   - Avoid spicy and fatty foods for 1 week
   
   Sick Leave: 2 weeks
   
   Discharged By: Dr. John Smith
   Signature: [Digital signature]
   Date/Time: [Current date/time]
   ```
3. **Expected Result**:
   - Discharge summary created
   - Patient status updated to "DISCHARGED"
   - Printable for patient
   - Available for future reference
   - Timeline shows complete patient journey

---

## 📋 Phase 9: Blocking Mechanisms (Critical Tests)

### Test 9.1: OT Blocking Without Consents
1. Register a new patient
2. Try to shift patient to OT WITHOUT:
   - Operation consent
   - Anesthesia consent
3. **Expected Result**: 
   - System should BLOCK the action
   - Error message: "Cannot proceed to OT. Missing required consents."

### Test 9.2: Medication Blocking Without DPN
1. Patient in post-op care
2. Try to administer morning medications WITHOUT entering morning DPN
3. **Expected Result**:
   - System should BLOCK medication administration
   - Error message: "Cannot administer medication. Daily Progress Notes not entered for this shift."

### Test 9.3: Discharge Blocking Without Complete Documentation
1. Try to discharge a patient WITHOUT:
   - Post-op notes
   - Daily progress notes
   - Consultant round orders
3. **Expected Result**:
   - System should WARN (not block, as LAMA is possible)
   - Warning message: "Some documentation is incomplete. Proceed with caution."

### Test 9.4: Viral Markers Alert
1. Register a new patient with POSITIVE viral markers:
   ```
   Hepatitis C: Positive
   ```
2. **Expected Result**:
   - System should trigger an ALERT
   - Red warning banner: "⚠️ POSITIVE VIRAL MARKERS - HEPATITIS C. Take appropriate precautions."
   - Alert visible to all staff accessing the patient

---

## 📋 Phase 10: PDF Generation & Printing

### Test 10.1: Generate Patient Consent Forms
1. From patient profile, navigate to any completed form
2. Click "Print/Export PDF" button
3. **Expected Result**:
   - PDF generated with hospital letterhead
   - All form data populated correctly
   - Includes signature placeholders for manual signatures
   - Ready to print, sign, scan, and upload back

### Test 10.2: Generate Treatment Summary
1. From patient profile, click "Generate Treatment Summary"
2. **Expected Result**:
   - Comprehensive PDF with:
     - Patient demographics
     - All vital signs over time
     - All medications administered
     - All procedures performed
     - All progress notes
   - Suitable for transfer to another facility or insurance

### Test 10.3: Generate Discharge Summary PDF
1. After completing discharge summary, click "Print Discharge Summary"
2. **Expected Result**:
   - Professional discharge summary PDF
   - Includes hospital logo and contact details
   - Ready for patient to take home

---

## 📋 Phase 11: Digital Signatures & Stamps

### Test 11.1: Auto-Generated Stamps
1. Log in as **Nurse** (Mary Johnson)
2. Fill any form (e.g., Daily Progress Notes)
3. Click "Sign & Save"
4. **Expected Result**:
   - Digital signature applied
   - Auto-generated stamp shows:
     ```
     Mary Johnson
     Staff Nurse
     License #: [If applicable]
     Date: [Current date]
     Time: [Current time]
     ```

### Test 11.2: Doctor's Signature on Multiple Forms
1. Log in as **Doctor**
2. Sign multiple forms:
   - Daily Progress Notes
   - Consultant Round Orders
   - Operation Notes
   - Discharge Summary
3. **Expected Result**:
   - Consistent signature across all forms
   - Stamp includes doctor's name, designation, and credentials
   - All signatures timestamped accurately

---

## 📋 Phase 12: File Upload & Scanner Integration

### Test 12.1: Upload Scanned Documents
1. From patient profile, navigate to **Documents** tab
2. Upload various documents:
   - Scanned signed consent forms (PDF)
   - External prescriptions (PDF/Image)
   - Lab reports (PDF)
   - X-ray images (JPEG/PNG)
3. **Expected Result**:
   - All documents uploaded successfully
   - Viewable in Documents tab
   - Categorized by type
   - Downloadable by authorized users

### Test 12.2: Scanner Integration (If Available)
1. Connect scanner to system
2. From any form that requires physical signature, click "Scan Document"
3. **Expected Result**:
   - Scanner interface opens
   - Scan document directly into system
   - No need to save to computer first

---

## 📋 Phase 13: Audit Trail & Compliance

### Test 13.1: View Audit Logs
1. Log in as **Admin**
2. Navigate to **Audit Logs**
3. Filter by:
   - User: Dr. John Smith
   - Date Range: Today
   - Action Type: All
4. **Expected Result**:
   - Complete log of all actions performed by Dr. Smith
   - Includes: Login time, forms accessed, forms edited, signatures applied
   - Timestamp for each action
   - IP address recorded

### Test 13.2: PSC Compliance Check
1. For any patient, generate "PSC Compliance Report"
2. **Expected Result**:
   - Report shows:
     - ✅ All required forms completed
     - ✅ All signatures present with timestamp
     - ✅ All medications logged with signature/stamp
     - ✅ All critical events documented
     - ❌ Any missing documentation (highlighted in red)

---

## 📋 Phase 14: Role-Based Access Control (RBAC)

### Test 14.1: Receptionist Access
1. Log in as **Receptionist**
2. **Should Have Access To**:
   - Patient registration
   - Patient search
   - Consent forms (view/create)
   - Estimate forms
   - Prescription upload
3. **Should NOT Have Access To**:
   - User management
   - Medical history (detailed)
   - Operation notes
   - Medication administration
   - System settings

### Test 14.2: Nurse Access
1. Log in as **Nurse**
2. **Should Have Access To**:
   - Patient list (assigned patients)
   - Medication administration
   - I/O chart
   - Daily progress notes (nursing part)
   - Vital signs recording
   - Treatment tickets
   - Critical notes
3. **Should NOT Have Access To**:
   - User management
   - Operation notes (surgeon's part)
   - Discharge summary
   - Consultant round orders (can view, cannot edit)

### Test 14.3: Doctor Access
1. Log in as **Doctor**
2. **Should Have Access To**:
   - All patient records
   - Medical history
   - Daily progress notes
   - Consultant round orders
   - Operation notes
   - Anesthesia records
   - Discharge summary
   - All forms (view)
3. **Should NOT Have Access To**:
   - User management (unless admin)
   - System settings (unless admin)
   - Medication administration (nurses do this)

### Test 14.4: Admin Access
1. Log in as **Admin**
2. **Should Have Access To**:
   - Everything (full system access)
   - User management
   - System settings
   - Audit logs
   - All patient records
   - Time/date editing rights (for emergency cases)

---

## 📋 Phase 15: Notification System (If Implemented)

### Test 15.1: Critical Alerts
1. Register patient with positive viral markers
2. **Expected Notifications**:
   - Alert to all staff accessing the patient
   - Email/SMS to infection control team (if configured)

### Test 15.2: DPN Reminder
1. Morning shift starts (8:00 AM)
2. If morning DPN not entered by 9:00 AM
3. **Expected Notifications**:
   - Reminder notification to assigned doctor
   - Escalation to consultant if not entered by 10:00 AM

### Test 15.3: Discharge Pending
1. Patient ready for discharge
2. Consultant has approved discharge
3. **Expected Notifications**:
   - Notification to billing department to prepare final bill
   - Notification to pharmacy to prepare discharge medications
   - Notification to medical records to prepare discharge summary

---

## 📋 Phase 16: Reporting & Analytics

### Test 16.1: Patient Statistics
1. Navigate to **Reports** → **Patient Statistics**
2. Select date range: Last 30 days
3. **Expected Report**:
   - Total admissions: [Number]
   - Total discharges: [Number]
   - Average length of stay: [Days]
   - Department-wise breakdown
   - Diagnosis-wise breakdown

### Test 16.2: Occupancy Report
1. Navigate to **Reports** → **Occupancy Report**
2. **Expected Report**:
   - Total beds: [Number]
   - Occupied beds: [Number]
   - Vacancy rate: [Percentage]
   - Room-wise occupancy
   - Department-wise occupancy

### Test 16.3: Medication Usage Report
1. Navigate to **Reports** → **Medication Usage**
2. Select date range: Last month
3. **Expected Report**:
   - Most frequently used medications
   - Quantity consumed
   - Cost analysis
   - Antibiotic usage tracking

---

## 🎯 Critical Success Criteria

### ✅ Must Pass Tests
1. **Patient Registration**: Smooth registration with unique MR number generation
2. **Patient-Centric Workflow**: All forms accessible from patient profile
3. **Blocking Mechanisms**: 
   - OT blocked without consents ✅
   - Medication blocked without DPN ✅
4. **Digital Signatures**: All forms have proper signature/stamp/timestamp
5. **Audit Trail**: Complete logging of all actions
6. **RBAC**: Each role has appropriate access
7. **PDF Generation**: All forms printable with proper formatting

### ⚠️ Should Pass Tests
1. **Notification System**: Timely alerts for critical events
2. **Scanner Integration**: Direct scanning of documents
3. **Reports**: Comprehensive analytics and statistics
4. **Mobile Responsiveness**: System usable on tablets in wards

### 💡 Nice to Have
1. **Offline Mode**: Critical forms accessible offline
2. **Barcode Scanning**: Patient wristband scanning for safety
3. **E-Prescribing**: Integration with pharmacy for medication orders

---

## 🐛 Bug Reporting Template

If you encounter any issues during testing, please report using this format:

```
**Bug Title**: [Concise description]
**Severity**: [Critical / High / Medium / Low]
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3
**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Screenshots**: [If applicable]
**Browser/Device**: [Chrome/Safari/Firefox on Windows/Mac/iPad]
**User Role**: [Admin/Doctor/Nurse/Receptionist]
```

---

## 📞 Support & Questions

For any questions or clarifications during testing, please contact:
- **System Developer**: [Your contact]
- **Technical Support**: [Support email]

---

## ✅ Testing Checklist

Use this checklist to track your testing progress:

- [ ] Phase 1: Authentication & User Management
- [ ] Phase 2: Patient Registration & Admission
- [ ] Phase 3: Pre-Operative Workflow
- [ ] Phase 4: Ward Care & Monitoring
- [ ] Phase 5: Anesthesia & Surgery
- [ ] Phase 6: Post-Operative Care & Treatment
- [ ] Phase 7: Special Events & Documentation
- [ ] Phase 8: Discharge Process
- [ ] Phase 9: Blocking Mechanisms
- [ ] Phase 10: PDF Generation & Printing
- [ ] Phase 11: Digital Signatures & Stamps
- [ ] Phase 12: File Upload & Scanner Integration
- [ ] Phase 13: Audit Trail & Compliance
- [ ] Phase 14: Role-Based Access Control
- [ ] Phase 15: Notification System
- [ ] Phase 16: Reporting & Analytics

---

## 🎉 Congratulations!

If all critical tests pass, the Hospital Management System is ready for production deployment! 🚀

**Next Steps**:
1. Address any bugs found during testing
2. Conduct user training sessions
3. Prepare for go-live
4. Plan for post-deployment support

---

**Last Updated**: January 14, 2026
**Version**: 1.0
**Tested By**: _______________
**Date**: _______________
**Sign-off**: _______________
