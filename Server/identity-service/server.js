import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/utils/db.js';
import { connectRabbitMQ } from './src/utils/rabbitmq.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// Raw body needed for webhook signature verification
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', userRoutes);
app.use('/api/v1/therapists', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', userRoutes);
app.use('/users', userRoutes);
app.use('/patients', userRoutes);
app.use('/therapists', userRoutes);
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', paymentRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'identity-service', port: PORT, dbConnected: true, timestamp: new Date().toISOString() }));
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'identity-service', timestamp: new Date().toISOString() }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Identity] Unhandled error:', err);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  await connectRabbitMQ();
  app.listen(PORT, () => console.log(`🚀 [Identity Service] Running on port ${PORT}`));
};

start().catch(err => { console.error(err); process.exit(1); });
