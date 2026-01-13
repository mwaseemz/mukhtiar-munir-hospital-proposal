# Quick Start Guide - Get Running in 15 Minutes

## Step 1: Set Up Supabase Database (5 min)

1. Go to https://supabase.com
2. Click "Start your project" (sign up with GitHub/email - FREE)
3. Create a new project:
   - Name: `hospital-management`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project" (takes 2-3 minutes)

4. Once created, go to **Project Settings** (gear icon) → **Database**
5. Scroll down to **Connection String** → **URI**
6. Copy the connection string (looks like: `postgresql://postgres:[password]@...`)
7. **IMPORTANT:** Replace `[YOUR-PASSWORD]` in the URL with your actual password!

## Step 2: Set Up Upstash Redis (3 min)

1. Go to https://upstash.com
2. Sign up (FREE - no credit card needed)
3. Click "Create Database"
   - Name: `hospital-cache`
   - Type: Regional
   - Region: Choose closest to you
4. Once created, click on your database
5. Go to "REST API" tab
6. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 3: Configure Backend (2 min)

Create file: `/backend/.env`

```env
# Paste your Supabase connection string here
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Paste your Upstash credentials here
UPSTASH_REDIS_REST_URL="https://[name]-[id].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[your-token]"

# JWT Secret - change this to any random string (min 32 characters)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-random-min-32-chars"
JWT_EXPIRY="24h"
JWT_REFRESH_EXPIRY="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE="10485760"
UPLOAD_DIR="./uploads"

# MR Number Configuration
MR_NUMBER_PREFIX="MR"
MR_NUMBER_START=1000
MR_NUMBER_PADDING=6
```

## Step 4: Configure Frontend (1 min)

Create file: `/frontend/.env.local`

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_NAME="Hospital Management System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## Step 5: Start Backend (2 min)

Open Terminal 1:

```bash
cd /Users/waseemzaheer/Desktop/Specials/proposal/backend

# Install dependencies (if not done already)
npm install

# Generate Prisma Client
npm run db:generate

# Push database schema (creates all tables)
npm run db:push

# Seed with demo users
npm run db:seed

# Start backend server
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📝 Environment: development
🔗 API URL: http://localhost:3001
```

## Step 6: Start Frontend (2 min)

Open Terminal 2 (keep Terminal 1 running):

```bash
cd /Users/waseemzaheer/Desktop/Specials/proposal/frontend

# Install dependencies (if not done already)
npm install --legacy-peer-deps

# Start frontend
npm run dev
```

You should see:
```
✓ Ready in 3.5s
○ Local:   http://localhost:3000
```

## Step 7: Open Browser & Login

1. Open: **http://localhost:3000**
2. You'll be redirected to the login page
3. Login with:
   - **Email:** `admin@hospital.com`
   - **Password:** `Admin@123`

4. You'll see the dashboard with:
   - Patient statistics
   - Quick action buttons
   - System status

## ✅ What You Can Do Now

1. **Dashboard** - View statistics
2. **Register New Patient** - Click "Register New Patient" button
   - Fill the form
   - Get auto-generated MR Number (e.g., MR001000)
3. **Search Patients** - Search by name, MR number, phone
4. **View Patient Details** - See complete patient records

## 🔍 Testing the API Directly

Backend API is running at: **http://localhost:3001**

Test endpoints:
- Health Check: http://localhost:3001/health
- Should return: `{"status":"OK","timestamp":"..."}`

## 🐛 Troubleshooting

### "Port 3001 already in use"
```bash
lsof -ti:3001 | xargs kill -9
```

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
```

### "Database connection failed"
- Check your DATABASE_URL in `/backend/.env`
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check if Supabase project is running (green indicator in dashboard)

### "Redis connection failed"
- Check UPSTASH_REDIS_REST_URL and TOKEN in `/backend/.env`
- Make sure they're from the "REST API" tab (not the connection string tab)

### "Prisma Client not generated"
```bash
cd backend
npm run db:generate
```

### Frontend shows "Network Error"
- Make sure backend is running on port 3001
- Check Terminal 1 for any errors
- Verify NEXT_PUBLIC_API_URL in `/frontend/.env.local`

## 📊 View Your Database

**Option 1: Prisma Studio (Recommended)**
```bash
cd backend
npm run db:studio
```
Opens a GUI at http://localhost:5555 to view/edit data

**Option 2: Supabase Dashboard**
- Go to https://supabase.com
- Open your project
- Click "Table Editor" in sidebar
- You'll see all your tables (users, patients, consent_forms, etc.)

## 🎉 You're All Set!

The system is now running with:
- ✅ Backend API (Express + Prisma)
- ✅ Frontend (Next.js)
- ✅ Database (PostgreSQL via Supabase)
- ✅ Cache (Redis via Upstash)
- ✅ Sample data loaded

## 📹 What You'll See

1. **Login Page** - Clean, modern login form
2. **Dashboard** - Statistics cards showing:
   - Total Patients: 0 (initially)
   - Admitted: 0
   - In OT: 0
   - Discharged Today: 0
3. **Quick Actions** - Buttons to:
   - Register New Patient
   - Search Patients
   - Consent Forms

## 🔄 Next Time You Want to Run

Just start both servers:

**Terminal 1:**
```bash
cd /Users/waseemzaheer/Desktop/Specials/proposal/backend
npm run dev
```

**Terminal 2:**
```bash
cd /Users/waseemzaheer/Desktop/Specials/proposal/frontend
npm run dev
```

Then open: http://localhost:3000

---

**Need help?** All detailed documentation is in [SETUP.md](./SETUP.md)
