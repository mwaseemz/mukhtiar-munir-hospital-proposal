# 📘 **HOSPITAL MANAGEMENT SYSTEM - USER GUIDE**

**Version:** 1.0  
**Date:** January 8, 2026  
**For:** Mukhtiar Munir Hospital

---

## 📚 **TABLE OF CONTENTS**

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Patient Registration](#patient-registration)
5. [Consent Forms](#consent-forms)
6. [Clinical Documentation](#clinical-documentation)
7. [Treatment Management](#treatment-management)
8. [Discharge Process](#discharge-process)
9. [File Management](#file-management)
10. [Advanced Search](#advanced-search)
11. [Troubleshooting](#troubleshooting)

---

## 🏥 **SYSTEM OVERVIEW**

The Hospital Management System is a comprehensive digital solution for managing patient care, clinical documentation, and hospital workflows. It includes:

- ✅ Patient registration with unique MR numbers
- ✅ Three types of consent forms (English & Urdu)
- ✅ Complete clinical documentation (25+ forms)
- ✅ Treatment tracking & medication administration
- ✅ Digital signatures & document uploads
- ✅ PDF generation for all forms
- ✅ Advanced patient search
- ✅ Workflow blocking for safety

---

## 🚀 **GETTING STARTED**

### **1. Accessing the System**

1. Open your web browser
2. Navigate to: `http://your-hospital-domain.com`
3. You will see the login page

### **2. Logging In**

1. Enter your **username/email**
2. Enter your **password**
3. Click **"Login"**
4. You will be directed to the dashboard

### **3. Navigation**

The main navigation bar appears at the top of every page:

- **Dashboard**: Overview & quick stats
- **Patients**: Search and view patients
- **Register**: Register new patients
- **Consents**: Consent form management
- **History**: Medical history forms
- **Treatment**: Treatment orders
- **DPN**: Daily Progress Notes
- **Discharge**: Discharge summaries

---

## 👥 **USER ROLES & PERMISSIONS**

### **SUPER_ADMIN**
- Full system access
- User management
- All clinical functions

### **ADMIN**
- All clinical functions
- Patient management
- Cannot manage users

### **DOCTOR**
- Patient registration
- All clinical documentation
- Prescriptions & orders
- Discharge summaries

### **NURSE**
- Patient vital signs
- Medication administration
- I/O charts
- Ward admission protocols

---

## 📝 **PATIENT REGISTRATION**

### **Step-by-Step Guide**

1. **Navigate** to "Register" in the top menu
2. **Fill in Patient Demographics:**
   - First Name (required)
   - Last Name (required)
   - Father's Name (required)
   - Age (required)
   - Gender (required)
   - Phone Number
   - CNIC (optional)
   - Address

3. **Select Admission Details:**
   - **Admission Location:** Ward, Private, Nursery, or ICU
   - **Patient Type:** Surgery or Medicine
   - **Admission Date:** Auto-filled with today's date

4. **Viral Markers Screening:**
   - Check boxes if positive: HCV, HBsAg, HIV

5. **Click "Register Patient"**

6. **MR Number Generated Automatically:**
   - Format: `MR001/26/W/S`
   - MR001 = Sequential number
   - 26 = Year (2026)
   - W = Ward (W/P/N/I)
   - S = Surgery (S/M)

### **Important Notes**

- MR number is unique and auto-generated
- Cannot be changed after creation
- Used for all patient records

---

## 📋 **CONSENT FORMS**

### **Types of Consent Forms**

1. **General Admission Consent** (English)
2. **Operation Consent** (Urdu)
3. **Anesthesia Consent** (Urdu)

### **How to Complete a Consent Form**

1. **Navigate** to "Consents" menu
2. **Select** form type
3. **Enter Patient MR Number**
   - Patient information will auto-populate
4. **Fill in Form-Specific Fields:**
   - Operation details (for operation consent)
   - Anesthesia type (for anesthesia consent)
   - Risks and complications
5. **Add Digital Signature:**
   - Type your name
   - Select signature style
   - Click "Apply Signature"
6. **Add Witness Information**
7. **Click "Save Consent Form"**

### **Digital Signature Process**

1. Type your full name in the signature field
2. Select from 4 signature fonts:
   - Dancing Script
   - Great Vibes
   - Tangerine
   - Pacifico
3. Preview appears automatically
4. Digital stamp is auto-generated with:
   - Your name
   - Date & time
   - Hospital name

### **Uploading Signed Physical Forms**

1. Complete consent form digitally first
2. Print the consent form
3. Get physical signature from patient/guardian
4. Scan the signed document
5. Go to form and click "Upload Scanned Copy"
6. Select file (PDF, JPG, PNG accepted)
7. Maximum file size: 10MB

---

## 🩺 **CLINICAL DOCUMENTATION**

### **Medical History**

**When to Use:** At admission for every new patient

**Steps:**
1. Navigate to "History"
2. Enter patient MR number
3. Fill in:
   - Chief complaint
   - History of present illness
   - Duration, onset, severity
   - Past medical/surgical history
   - Allergies
   - Current medications
   - Family & social history
   - Provisional diagnosis
   - Treatment plan
4. Click "Save Medical History"

### **Daily Progress Note (DPN) - SOAP Format**

**When to Use:** Daily for all admitted patients

**SOAP Format:**
- **S**ubjective: What patient says/complains
- **O**bjective: Vital signs, examination findings
- **A**ssessment: Your clinical diagnosis
- **P**lan: Treatment plan & next steps

**Steps:**
1. Navigate to "DPN"
2. Enter patient MR number
3. Record current vital signs
4. Write SOAP note:
   - Subjective findings
   - Objective findings
   - Assessment
   - Plan
5. Add investigations ordered
6. Click "Save Daily Progress Note"

**⚠️ Important:** DPN must be entered daily before giving medications. System will block medication administration if yesterday's DPN is missing!

### **Treatment Orders**

**Steps:**
1. Navigate to "Treatment"
2. Enter patient MR number
3. Add medication order:
   - Medication name
   - Dosage (e.g., 500mg)
   - Route (Oral, IV, IM, etc.)
   - Frequency (e.g., TDS = 3 times daily)
   - Start date
   - Duration
4. Mark if PRN (as needed)
5. Add special instructions
6. Click "Create Treatment Order"

**Common Frequencies:**
- OD = Once daily
- BD = Twice daily
- TDS = Three times daily
- QID = Four times daily
- PRN = As needed
- STAT = Immediately

### **Input/Output (I/O) Chart**

**When to Use:** For patients on fluid monitoring

**Steps:**
1. Navigate to "I/O Chart"
2. Enter patient MR number
3. Record INPUT:
   - Type: Oral, IV, Enteral
   - Amount in mL
   - Details (e.g., Normal Saline)
4. Record OUTPUT:
   - Type: Urine, Stool, Vomit, Drain
   - Amount in mL
   - Details (e.g., Color, consistency)
5. Add notes
6. Click "Record I/O Entry"

**Daily Summary Auto-Calculates:**
- Total Input
- Total Output
- Net Balance (Input - Output)

### **Anesthesia Record**

**When to Use:** For all surgeries

**Steps:**
1. Navigate to "Anesthesia"
2. Enter patient MR number & surgery ID
3. Select anesthesia type
4. Assign ASA classification
5. Document:
   - Pre-anesthesia assessment
   - Induction details
   - Maintenance agents
   - IV access & fluids given
   - Any complications
   - Recovery notes
6. Click "Save Anesthesia Record"

### **Operation Notes**

**When to Use:** Immediately after surgery

**Steps:**
1. Navigate to "Operation Notes"
2. Enter patient MR number
3. Record operation date & time
4. Fill surgical team details
5. Document:
   - Pre-operative diagnosis
   - Procedure performed
   - Operative findings
   - Operative technique (step-by-step)
   - Complications
   - Blood loss
   - Specimens sent
   - Post-operative diagnosis
   - Post-op instructions
6. Click "Save Operation Notes"

### **Blood Transfusion**

**When to Use:** For any blood product transfusion

**Pre-transfusion Checklist:**
1. ✅ Consent obtained
2. ✅ Crossmatch completed
3. ✅ Patient identity verified
4. ✅ Blood product label matches

**Steps:**
1. Navigate to "Blood Transfusion"
2. Enter patient MR number
3. Select blood product (PRBC, FFP, etc.)
4. Enter unit number
5. Record pre-transfusion vitals
6. Check consent & crossmatch boxes
7. Enter start time
8. Monitor during transfusion
9. If reaction occurs:
   - Check "Reaction" box
   - Document details immediately
   - Stop transfusion
10. Record end time & post-vitals
11. Click "Save Blood Transfusion Record"

### **Consultant Rounds**

**When to Use:** During consultant visits

**Steps:**
1. Navigate to "Consultant Rounds"
2. Enter patient MR number
3. Record date & time of round
4. Document:
   - Clinical assessment
   - Current status
   - Management plan
   - Special instructions
   - Next review date
5. Review and acknowledge pending orders
6. Click "Record Consultant Round"

---

## 🏠 **DISCHARGE PROCESS**

### **Types of Discharge**

1. **Regular Discharge**: Normal discharge after treatment
2. **LAMA**: Left Against Medical Advice
3. **DOR**: Discharged On Request
4. **Absconded**: Patient left without informing
5. **Referred**: Transferred to another facility

### **Regular Discharge Process**

1. Navigate to "Discharge"
2. Enter patient MR number
3. Select "Regular Discharge"
4. Fill in:
   - Admission & discharge dates
   - Admission diagnosis
   - Hospital course (summary of stay)
   - Final diagnosis
   - Condition at discharge
   - Discharge medications
   - Follow-up instructions
   - Follow-up date
5. Click "Create Discharge Summary"
6. Generate PDF for patient

### **LAMA/DOR Process**

1. Select discharge type: LAMA or DOR
2. **Document reason** in detail
3. **⚠️ Important**: Get signed LAMA/DOR form
4. Complete discharge summary
5. Upload signed LAMA/DOR form

---

## 📁 **FILE MANAGEMENT**

### **Uploading Documents**

The system supports:
- ✅ Images: JPG, PNG, GIF
- ✅ PDFs
- ✅ Word documents
- ✅ Maximum size: 10MB per file

**Upload Process:**
1. Navigate to relevant form/record
2. Click "Upload Document"
3. Select file from computer
4. Add notes (optional)
5. Click "Upload"

**Scanner Integration:**
- Connect scanner to computer
- Scan document as PDF or image
- Upload using steps above

### **Document Categories**

- Consent forms (signed)
- Prescriptions
- Lab reports
- Investigation reports
- Imaging reports
- External documents

### **Viewing Documents**

1. Go to patient detail page
2. Click "Documents" tab
3. All uploaded documents listed
4. Click to view or download

---

## 🔍 **ADVANCED SEARCH**

### **Searching for Patients**

**Basic Search:**
- Use "Patients" menu
- Enter MR number or name
- Click search

**Advanced Search:**
1. Navigate to "Advanced Search"
2. Use multiple filters:
   - Demographics (name, MR#, CNIC, phone)
   - Age range
   - Gender
   - Admission location
   - Patient type (Surgery/Medicine)
   - Status (Admitted/Discharged)
   - Date ranges
   - Viral markers
3. Click "Search"
4. Results appear on right side
5. Click any patient to view details

### **Search Tips**

- Use specific MR number for fastest results
- Combine multiple filters for precise search
- Date ranges help find historical patients
- Check viral markers for infection control

---

## 🔐 **SYSTEM SAFETY FEATURES**

### **Workflow Blocking**

The system automatically blocks certain actions for patient safety:

1. **Consent Blocking:**
   - Cannot proceed to surgery without signed consent
   - System will alert if consent missing

2. **Daily Progress Note Blocking:**
   - Cannot give medications if yesterday's DPN is missing
   - Ensures daily patient assessment

3. **Treatment Administration Blocking:**
   - Cannot give next day's medication if today's not given
   - Prevents medication errors

4. **Consultant Order Acknowledgement:**
   - All consultant orders must be acknowledged
   - Ensures orders are seen and actioned

5. **Signature Validation:**
   - All forms require signature before completion
   - Digital stamp auto-generated

### **What to Do When Blocked**

If system blocks an action:
1. Read the block message carefully
2. Complete the required step (e.g., enter DPN)
3. Try again
4. Contact supervisor if still blocked

---

## 🖨️ **PRINTING & PDF GENERATION**

### **Generating PDFs**

Most forms can be exported as PDF:

1. Complete the form
2. Save the form
3. Click "Download PDF" or "Generate PDF"
4. PDF opens in browser
5. Print or save to computer

**Available PDFs:**
- Consent forms
- Discharge summaries
- Estimate forms
- Medical history
- Complete patient file

### **Printing Tips**

- Use A4 paper size
- Portrait orientation for most forms
- Check preview before printing
- Save PDF copies for records

---

## ❓ **TROUBLESHOOTING**

### **Login Issues**

**Problem:** Cannot login
- Check username/password spelling
- Ensure Caps Lock is off
- Contact IT if password forgotten
- Verify account is active

**Problem:** Logged out automatically
- Session timeout after 30 minutes inactivity
- Log in again
- System saves your work

### **Form Issues**

**Problem:** Form validation errors
- Red error messages show missing fields
- Fill all required fields (marked with *)
- Correct invalid data (e.g., phone format)
- Try submitting again

**Problem:** Patient MR number not found
- Verify MR number spelling
- Check spaces and slashes
- Search patient first
- Contact registration if truly missing

### **File Upload Issues**

**Problem:** Upload fails
- Check file size (max 10MB)
- Verify file type (PDF, JPG, PNG, DOC)
- Try smaller file
- Compress image if too large
- Contact IT if persists

### **Printing/PDF Issues**

**Problem:** PDF won't generate
- Check form is saved first
- Refresh page and try again
- Allow pop-ups in browser
- Check printer is connected

### **Performance Issues**

**Problem:** System is slow
- Check internet connection
- Close other browser tabs
- Refresh the page
- Clear browser cache
- Contact IT if persistent

---

## 📞 **SUPPORT**

### **Getting Help**

**For Technical Issues:**
- Email: support@mukhtiarmunirhospital.com
- Phone: [Hospital IT Department]
- Hours: 24/7 support

**For Training:**
- Contact: Training Department
- Schedule: [Training Schedule]

**Emergency:**
- For critical system issues affecting patient care
- Call: [Emergency IT Hotline]

---

## 🎓 **BEST PRACTICES**

### **General Guidelines**

1. **Always save your work** - Click save regularly
2. **Use correct patient MR number** - Double-check
3. **Complete forms fully** - Don't leave fields blank
4. **Be detailed** - More information is better
5. **Review before saving** - Check for errors
6. **Print backup copies** - Keep PDF records
7. **Maintain patient privacy** - Log out when done
8. **Report errors immediately** - Don't ignore system issues

### **Clinical Documentation**

1. **Be timely** - Enter notes same day
2. **Be accurate** - Verify all data
3. **Be complete** - Fill all sections
4. **Be professional** - Use medical terminology
5. **Be legible** - If typing name for signature, spell correctly
6. **Be consistent** - Follow hospital protocols

### **Data Security**

1. **Never share passwords**
2. **Lock computer when leaving**
3. **Log out after each session**
4. **Don't access from public computers**
5. **Report suspicious activity**
6. **Keep patient information confidential**

---

## 📈 **UPDATES & NEW FEATURES**

This system receives regular updates. New features are announced via:
- Email notifications
- Dashboard announcements
- Staff meetings
- Training sessions

Stay informed about new capabilities!

---

**END OF USER GUIDE**

*For detailed technical documentation, see `DEVELOPER_GUIDE.md`*  
*For API documentation, see `API_DOCUMENTATION.md`*  
*For deployment guide, see `DEPLOYMENT_GUIDE.md`*
