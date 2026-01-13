import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import consentFormRoutes from './routes/consentFormRoutes';
import digitalSignatureRoutes from './routes/digitalSignatureRoutes';
import otProtocolRoutes from './routes/otProtocolRoutes';
import anesthesiaRoutes from './routes/anesthesiaRoutes';
import surgicalRoutes from './routes/surgicalRoutes';
import treatmentRoutes from './routes/treatmentRoutes';
import inputOutputRoutes from './routes/inputOutputRoutes';
import consultantRoundRoutes from './routes/consultantRoundRoutes';
import bloodTransfusionRoutes from './routes/bloodTransfusionRoutes';
import babyReceivingRoutes from './routes/babyReceivingRoutes';
import dischargeSummaryRoutes from './routes/dischargeSummaryRoutes';
import blockingRoutes from './routes/blockingRoutes';
import pdfRoutes from './routes/pdfRoutes';
import fileUploadRoutes from './routes/fileUploadRoutes';
import advancedSearchRoutes from './routes/advancedSearchRoutes';
import investigationProfileRoutes from './routes/investigationProfileRoutes';
import physicalExaminationRoutes from './routes/physicalExaminationRoutes';
import lamaDorRoutes from './routes/lamaDorRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consent-forms', consentFormRoutes);
app.use('/api/signatures', digitalSignatureRoutes);
app.use('/api/ot-protocols', otProtocolRoutes);
app.use('/api/anesthesia', anesthesiaRoutes);
app.use('/api/surgical', surgicalRoutes);
app.use('/api/treatment', treatmentRoutes);
app.use('/api/input-output', inputOutputRoutes);
app.use('/api/consultant-rounds', consultantRoundRoutes);
app.use('/api/clinical', bloodTransfusionRoutes);
app.use('/api/baby-receiving', babyReceivingRoutes);
app.use('/api/discharge', dischargeSummaryRoutes);
app.use('/api/blocking', blockingRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/upload', fileUploadRoutes);
app.use('/api', advancedSearchRoutes);
app.use('/api', investigationProfileRoutes);
app.use('/api', physicalExaminationRoutes);
app.use('/api', lamaDorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

export default app;
