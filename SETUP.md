# Hospital Management System - Setup Guide

## 🚀 Quick Start

This is a comprehensive Hospital Management System built with:
- **Frontend:** Next.js 14, TypeScript, TailwindCSS, Shadcn/ui
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL (via Supabase)
- **Cache:** Redis (via Upstash)

## 📋 Prerequisites

- Node.js 20 LTS or higher
- npm or yarn
- A Supabase account (free tier)
- An Upstash Redis account (free tier)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project
cd /Users/waseemzaheer/Desktop/Specials/proposal

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### 2. Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (URI format)
5. Go to Project Settings > API
6. Copy the URL, anon key, and service_role key

### 3. Set Up Upstash Redis (Cache)

1. Go to [upstash.com](https://upstash.com) and create a free account
2. Create a new Redis database (choose free tier)
3. Copy the REST URL and REST TOKEN from the dashboard

### 4. Configure Backend Environment

Create `/backend/.env` file:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://[name].upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# JWT Secret (change this!)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
JWT_EXPIRY="24h"
JWT_REFRESH_EXPIRY="7d"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE="10485760"
UPLOAD_DIR="./uploads"

# MR Number Configuration
MR_NUMBER_PREFIX="MR"
MR_NUMBER_START=1000
MR_NUMBER_PADDING=6
```

### 5. Configure Frontend Environment

Create `/frontend/.env.local` file:

```env
# API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Supabase (same as backend)
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# App
NEXT_PUBLIC_APP_NAME="Hospital Management System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 6. Initialize Database

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (creates admin, doctor, nurse, receptionist)
npm run db:seed
```

### 7. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 8. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/health

## 👤 Default Login Credentials

After running the seed script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@hospital.com | Admin@123 |
| Doctor | doctor@hospital.com | Admin@123 |
| Nurse | nurse@hospital.com | Admin@123 |
| Receptionist | reception@hospital.com | Admin@123 |

## 📁 Project Structure

```
proposal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── config/            # Database, Redis config
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, error handling
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities (JWT, password, MR number)
│   │   └── server.ts          # Express server
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Login page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (redirects)
│   │   └── providers.tsx      # React Query provider
│   ├── components/
│   │   └── ui/                # Shadcn UI components
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── store.ts           # Zustand store
│   │   └── utils.ts           # Utilities
│   └── package.json
└── 1.pdf                       # Forms reference with images
```

## 🎯 Features Implemented

### ✅ Phase 1: Foundation & Authentication (COMPLETED)
- ✅ User authentication (JWT-based)
- ✅ Role-based access control (RBAC)
- ✅ User management
- ✅ Session management
- ✅ Audit logging
- ✅ Database schema (all models)
- ✅ Redis caching
- ✅ API structure

### ✅ Phase 2: Patient Registration (Backend Ready)
- ✅ Auto-generated MR numbers
- ✅ Patient CRUD operations
- ✅ Advanced search & filtering
- ✅ Patient details view

### ✅ Phase 3: Consent Forms (Backend Ready)
- ✅ Three consent form types (General, Operation Urdu, Anesthesia Urdu)
- ✅ Form completion tracking
- ✅ Blocking mechanism
- ✅ Document upload support

### ✅ Phase 4: Digital Signatures (Backend Ready)
- ✅ Type-to-generate signatures
- ✅ Multiple signature styles
- ✅ Digital stamp generation
- ✅ One-click application

### 🚧 Remaining Phases (Backend Models Ready, Frontend Pending)
- Medical History & Examination
- OT Protocols
- Anesthesia Records
- Operation Notes
- Treatment Orders & Administration
- Input/Output Charts
- Daily Progress Notes (SOAP)
- Consultant Rounds
- Blood Transfusion
- Critical Notes
- Baby Receiving
- Discharge Management
- Reporting & PDF Generation

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Patients
- `POST /api/patients` - Register new patient
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/mr/:mrNumber` - Get patient by MR number
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/search` - Search patients
- `GET /api/patients/:id/details` - Get patient full details
- `POST /api/patients/:id/discharge` - Discharge patient
- `GET /api/patients/stats` - Get statistics

### Consent Forms
- `POST /api/consent-forms` - Create consent form
- `GET /api/consent-forms/:id` - Get consent form
- `GET /api/consent-forms/patient/:patientId` - Get patient consent forms
- `PUT /api/consent-forms/:id` - Update consent form
- `POST /api/consent-forms/:id/complete` - Complete consent form
- `GET /api/consent-forms/patient/:patientId/check` - Check required forms
- `POST /api/consent-forms/:id/upload` - Upload scanned document

### Digital Signatures
- `POST /api/signatures` - Create signature
- `GET /api/signatures/:id` - Get signature
- `GET /api/signatures/my-signatures` - Get user signatures
- `GET /api/signatures/default` - Get default signature
- `PUT /api/signatures/:id/set-default` - Set default signature
- `DELETE /api/signatures/:id` - Delete signature
- `GET /api/signatures/styles` - Get available signature styles

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your Supabase DATABASE_URL is correct
- Check if your IP is allowed in Supabase (Settings > Database > Connection Pooling)
- Make sure you're using the connection pooler URL for better performance

### Redis Connection Issues
- Verify Upstash Redis credentials
- Check if the REST URL includes `https://`
- Ensure you're using the REST token, not the password

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Issues
```bash
cd backend
npm run db:generate
```

## 📊 Database Management

```bash
# Open Prisma Studio (GUI for database)
cd backend
npm run db:studio

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Re-seed database
npm run db:seed
```

## 🔒 Security Notes

1. **Change JWT_SECRET** in production to a strong random string (min 32 characters)
2. **Never commit** `.env` files to version control
3. **Use HTTPS** in production
4. **Enable rate limiting** for production (already configured in code)
5. **Regular backups** of Supabase database

## 📈 Monitoring & Logs

- Backend logs appear in the terminal running `npm run dev`
- Check Supabase dashboard for database metrics
- Check Upstash dashboard for Redis metrics
- All API requests are logged with Morgan

## 🚀 Next Steps

1. Complete frontend pages for all clinical forms
2. Implement PDF generation for forms
3. Add file upload for scanner integration
4. Implement notification system
5. Add comprehensive testing
6. Deploy to production (Vercel + Supabase + Upstash)

## 💰 Cost Estimate

With free tiers:
- **Supabase:** Free (500MB database, 2GB bandwidth)
- **Upstash Redis:** Free (10,000 commands/day)
- **Vercel:** Free (100GB bandwidth)

**Total: $0/month** for small to medium hospital usage!

## 📞 Support

For issues or questions, refer to:
- `requirement.md` - Detailed requirements
- `meetingwithclient.md` - Original meeting notes
- `1.pdf` - Form layouts with images

## 📝 License

Proprietary - All rights reserved
