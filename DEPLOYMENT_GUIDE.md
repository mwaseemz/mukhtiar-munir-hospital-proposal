# 🚀 Hospital Management System - Deployment Guide

This guide will help you deploy your Hospital Management System to production.

## 📋 Prerequisites

1. **GitHub Account** (for code hosting)
2. **Vercel Account** (for frontend deployment - free)
3. **Railway Account** (for backend deployment - free)
4. **Supabase Account** (for PostgreSQL database - free)

---

## 🗄️ Step 1: Set Up Production Database (Supabase)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: hospital-management
   - **Database Password**: (Create a strong password and save it!)
   - **Region**: Choose closest to your location
5. Wait for project to be created (~2 minutes)

### 1.2 Get Database Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. **Save this connection string** - you'll need it later!

### 1.3 Run Database Migration

On your local machine, update your backend `.env` file temporarily:

```bash
cd /Users/waseemzaheer/Desktop/Specials/proposal/backend
```

Edit `.env` and update:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

Then run:
```bash
npx prisma db push
npx prisma db seed
```

This will create all tables and seed initial data (demo users) in your production database.

---

## 🔧 Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository

```bash
cd /Users/waseemzaheer/Desktop/Specials/proposal

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Hospital Management System"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"**
3. Name it: `hospital-management-system`
4. Make it **Private** (recommended for hospital data)
5. Click **"Create repository"**

### 2.3 Push to GitHub

```bash
# Add GitHub as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/hospital-management-system.git

# Push code
git branch -M main
git push -u origin main
```

---

## 🚂 Step 3: Deploy Backend to Railway

### 3.1 Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Connect your GitHub account
6. Select the `hospital-management-system` repository

### 3.2 Configure Backend Service

1. Railway will auto-detect your project
2. Click on the service
3. Go to **Settings** → **Root Directory**
4. Set root directory to: `backend`
5. Save changes

### 3.3 Set Environment Variables

1. Go to **Variables** tab
2. Click **"New Variable"** and add each of these:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app-name.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
REDIS_URL=
```

**Important Notes:**
- For `DATABASE_URL`: Use your Supabase connection string from Step 1.2
- For `FRONTEND_URL`: You'll update this after deploying frontend (Step 4)
- For `SUPABASE_URL` and `SUPABASE_ANON_KEY`: Get from Supabase Dashboard → Settings → API
- `REDIS_URL`: Leave empty (optional feature)

### 3.4 Generate Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy your backend URL (e.g., `https://hospital-management-backend-production.up.railway.app`)
4. **Save this URL** - you'll need it for frontend!

### 3.5 Verify Deployment

1. Wait for deployment to complete (~2-3 minutes)
2. Check logs for any errors
3. Test API: Open `https://your-backend-url.railway.app/api/health` (should return 200 OK)

---

## ⚡ Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `hospital-management-system` repository

### 4.2 Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click **"Edit"** and set to `frontend`
3. **Build Command**: `npm run build` (default)
4. **Install Command**: `npm install` (default)

### 4.3 Set Environment Variables

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_ENV=production
```

**Replace** `your-backend-url.railway.app` with your actual Railway backend URL from Step 3.4!

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (~2-3 minutes)
3. Once done, you'll get a URL like: `https://hospital-management-system.vercel.app`
4. **Save this URL!**

### 4.5 Update Backend CORS

1. Go back to **Railway**
2. Go to your backend service → **Variables**
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://hospital-management-system.vercel.app
   ```
4. Redeploy backend (Railway will auto-redeploy)

---

## ✅ Step 5: Verify Everything Works

### 5.1 Test Frontend

1. Open your Vercel URL: `https://your-app.vercel.app`
2. You should see the login page

### 5.2 Test Backend Connection

1. Try logging in with demo credentials:
   - **Email**: admin@hospital.com
   - **Password**: Admin@123
2. If login succeeds and you see the dashboard, you're all set! 🎉

### 5.3 Test Full Flow

1. Navigate to **Register New Patient**
2. Fill in patient details
3. Submit
4. Patient should appear in dashboard
5. Click on patient to view profile
6. Verify all forms are accessible

---

## 🔒 Step 6: Security Checklist

Before going live with real patient data:

- [ ] Change `JWT_SECRET` to a strong random string (use https://randomkeygen.com)
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Set up Supabase backups (automatic daily backups)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates (Vercel & Railway do this automatically)
- [ ] Review and restrict API access in Railway
- [ ] Enable 2FA on Supabase, GitHub, Vercel, and Railway accounts
- [ ] Create regular database backups

---

## 📝 Step 7: Custom Domain (Optional)

### For Frontend (Vercel):

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `hms.yourhospital.com`)
3. Follow DNS configuration instructions
4. Vercel will auto-provision SSL certificate

### For Backend (Railway):

1. In Railway, go to **Settings** → **Networking**
2. Add custom domain (e.g., `api.yourhospital.com`)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_API_URL` in Vercel to point to new domain

---

## 🐛 Troubleshooting

### Frontend shows "Network Error" or "Failed to fetch"

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` in Vercel is correct
2. Check `FRONTEND_URL` in Railway matches your Vercel URL
3. Check Railway backend is running (View Logs)
4. Check Railway backend domain is accessible

### Login fails with "Invalid credentials"

**Problem**: Database not seeded

**Solution**:
```bash
# Locally, with DATABASE_URL pointing to Supabase
cd backend
npx prisma db seed
```

### 500 Internal Server Error

**Problem**: Backend environment variables missing

**Solution**:
1. Check all environment variables are set in Railway
2. Especially `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
3. Check Railway logs for specific error

### Database Connection Error

**Problem**: Invalid `DATABASE_URL`

**Solution**:
1. Verify Supabase database password is correct
2. Check connection string format
3. Test connection: `psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"`

---

## 🔄 Future Deployments

### Push Updates:

```bash
# Make your changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel and Railway will auto-deploy!
```

### Rollback (if needed):

**Vercel**:
1. Go to Deployments
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

**Railway**:
1. Go to Deployments
2. Click on previous deployment
3. Click **"Redeploy"**

---

## 📊 Monitoring & Logs

### Vercel Logs:
- Go to your project → **"Deployments"** → Click on deployment → **"View Function Logs"**

### Railway Logs:
- Go to your service → **"Deployments"** → Click on deployment → **"View Logs"**

### Supabase Logs:
- Go to **"Database"** → **"Logs"** to see all queries and errors

---

## 💰 Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Upgrade Needed When |
|---------|-----------|---------------------|
| **Vercel** | Unlimited deploys, 100GB bandwidth/month | >100GB bandwidth or need more team members |
| **Railway** | $5 credit/month (~500 hours) | App runs 24/7 (720 hours) |
| **Supabase** | 500MB database, 1GB file storage | >500MB data or >1GB files |

### If You Exceed Free Tier:

**Railway** (~$5-10/month):
- Pay-as-you-go after free credit
- ~$5/month for small backend

**Alternatives**:
- **Render** (free tier, but slower)
- **Fly.io** (free tier, 3 VMs)
- **Heroku** ($7/month hobby tier)

---

## 🎉 You're Live!

Your Hospital Management System is now accessible worldwide at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.railway.app

Share the frontend URL with your hospital staff and they can access it from anywhere!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs
3. Verify all environment variables are correct
4. Test locally first to ensure code works

**Demo Credentials** (change these in production!):
- Admin: admin@hospital.com / Admin@123
- Doctor: doctor@hospital.com / Admin@123
- Nurse: nurse@hospital.com / Admin@123
- Receptionist: reception@hospital.com / Admin@123

---

**Last Updated**: January 14, 2026
**Version**: 1.0
