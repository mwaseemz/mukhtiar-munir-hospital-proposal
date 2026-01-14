# Supabase Database Setup Guide

## Step 1: Run Schema Migration

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select project: `edppcvnrldrdjjuyqrtn`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `backend/setup-database.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)

## Step 2: Seed Initial Users

After running the schema, run this SQL to create initial users:

```sql
-- Insert initial users with hashed passwords
INSERT INTO users (id, username, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'superadmin', 'admin@hospital.com', '$2b$10$YourHashedPasswordHere', 'Super', 'Admin', 'SUPER_ADMIN', true, NOW(), NOW()),
  (gen_random_uuid(), 'doctor1', 'doctor@hospital.com', '$2b$10$YourHashedPasswordHere', 'Dr.', 'Smith', 'DOCTOR', true, NOW(), NOW()),
  (gen_random_uuid(), 'nurse1', 'nurse@hospital.com', '$2b$10$YourHashedPasswordHere', 'Nurse', 'Johnson', 'NURSE', true, NOW(), NOW()),
  (gen_random_uuid(), 'receptionist1', 'receptionist@hospital.com', '$2b$10$YourHashedPasswordHere', 'Front', 'Desk', 'RECEPTIONIST', true, NOW(), NOW());
```

## Step 3: Update Railway DATABASE_URL

Use the **Session Pooler** URL in Railway:

```
postgresql://postgres.edppcvnrldrdjjuyqrtn:Q4x44pjAuC8kp5v6@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

## Login Credentials

After setup, you can login with:
- **Email:** `admin@hospital.com`
- **Password:** `Admin@123`
