import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import clinicalRoutes from './src/routes/clinical.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import connectDB from './src/utils/db.js';
import { connectRabbitMQ } from './src/utils/rabbitmq.js';
import { startNotificationWorker } from './src/utils/notificationWorker.js';
import { expireHeldAppointments } from './src/controllers/bookingController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTE REGISTRATION
app.use('/api/v1', appointmentRoutes);
app.use('/api/v1', clinicalRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/scheduling', appointmentRoutes);
app.use('/', appointmentRoutes);
app.use('/', clinicalRoutes);

// Health checks
app.get('/health', (req, res) => {
  res.json({ service: 'clinical-service', status: 'healthy', port: PORT, dbConnected: mongoose.connection.readyState === 1, timestamp: new Date().toISOString() });
});

app.get('/health/ready', (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    service: 'clinical-service',
    status: ready ? 'ready' : 'not ready',
    database: ready ? 'connected' : 'disconnected',
  });
});

app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'clinical-service', timestamp: new Date().toISOString() }));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Clinical] Unhandled error:', err);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
});

const start = async () => {
  await connectDB();
  await connectRabbitMQ();
  await startNotificationWorker();

  // Auto-expire held appointments every 60 seconds
  setInterval(expireHeldAppointments, 60 * 1000);

  app.listen(PORT, () => console.log(`🚀 [Clinical Service] Running on port ${PORT}`));
};

start().catch(err => { console.error(err); process.exit(1); });
