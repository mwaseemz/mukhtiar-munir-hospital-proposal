-- Seed Initial Users for Hospital Management System
-- Password for all users: Admin@123

INSERT INTO users (id, username, email, password, "firstName", "lastName", role, department, "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'superadmin', 'admin@hospital.com', '$2b$10$0bEreUnl4apTxVLOqUQqg.KgpFIMfgeREA7i1MV/ECAb2VU4d7q/q', 'Super', 'Admin', 'SUPER_ADMIN', 'Administration', true, NOW(), NOW()),
  (gen_random_uuid(), 'doctor1', 'doctor@hospital.com', '$2b$10$0bEreUnl4apTxVLOqUQqg.KgpFIMfgeREA7i1MV/ECAb2VU4d7q/q', 'Dr. Ahmed', 'Khan', 'DOCTOR', 'General Surgery', true, NOW(), NOW()),
  (gen_random_uuid(), 'nurse1', 'nurse@hospital.com', '$2b$10$0bEreUnl4apTxVLOqUQqg.KgpFIMfgeREA7i1MV/ECAb2VU4d7q/q', 'Fatima', 'Ali', 'NURSE', 'General Ward', true, NOW(), NOW()),
  (gen_random_uuid(), 'receptionist1', 'receptionist@hospital.com', '$2b$10$0bEreUnl4apTxVLOqUQqg.KgpFIMfgeREA7i1MV/ECAb2VU4d7q/q', 'Sarah', 'Hassan', 'RECEPTIONIST', 'Reception', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert system configurations
INSERT INTO system_configs (id, key, value, description, "isPublic", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'hospital_name', 'Mukhtiar Munir Hospital', 'Hospital name for documents and reports', true, NOW(), NOW()),
  (gen_random_uuid(), 'hospital_address', 'Main Street, City', 'Hospital address', true, NOW(), NOW()),
  (gen_random_uuid(), 'hospital_phone', '+92-XXX-XXXXXXX', 'Hospital contact number', true, NOW(), NOW()),
  (gen_random_uuid(), 'dpn_required_for_medication', 'true', 'Require DPN before medication administration', false, NOW(), NOW()),
  (gen_random_uuid(), 'viral_marker_tracking', 'true', 'Track viral markers for patient safety', false, NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

SELECT 'Database seeded successfully!' as message;
