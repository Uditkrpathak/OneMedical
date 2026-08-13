import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;

// ─── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));

// ─── Global Rate Limiter (100 req/min per IP) ────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests, slow down.' } },
});
app.use(globalLimiter);

// ─── Public Routes (no JWT required) ─────────────────────────────────────────
const PUBLIC_ROUTES = [
  { method: 'GET',  path: '/healthz' },
  { method: 'GET',  path: '/health' },
  { method: 'GET',  path: '/api/v1/health' },
  { method: 'POST', path: '/api/v1/auth/otp/request' },
  { method: 'POST', path: '/api/v1/auth/otp/verify' },
  { method: 'POST', path: '/api/v1/auth/login' },
  { method: 'POST', path: '/api/v1/auth/register' },
  { method: 'POST', path: '/api/v1/auth/refresh' },
  { method: 'GET',  path: '/api/v1/therapists' },
  { method: 'POST', path: '/api/v1/payments/webhook' }, // webhook uses its own signature check
];

const isPublicRoute = (method, path) =>
  PUBLIC_ROUTES.some(r => r.method === method && path.startsWith(r.path));

// ─── RBAC Config ─────────────────────────────────────────────────────────────
// Maps path prefixes to the minimum role(s) allowed (empty = any authenticated user)
const ROUTE_ROLES = {
  '/api/v1/analytics': ['clinic_admin', 'super_admin'],
  '/api/v1/payouts':   ['clinic_admin', 'super_admin'],
  '/api/v1/admin':     ['clinic_admin', 'super_admin'],
};

const ROLE_HIERARCHY = ['patient', 'therapist', 'clinic_admin', 'super_admin'];

const hasPermission = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};

// ─── JWT Authentication Middleware ───────────────────────────────────────────
const authenticate = (req, res, next) => {
  if (req.path === '/api/v1/internal/notify') return next();
  if (isPublicRoute(req.method, req.path)) return next();

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header.' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_secret');
    req.user = decoded; // { userId, role, phone/email }

    // RBAC check
    for (const [prefix, roles] of Object.entries(ROUTE_ROLES)) {
      if (req.path.startsWith(prefix) && !hasPermission(decoded.role, roles)) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } });
      }
    }

    // Forward user info to downstream services
    req.headers['x-user-id']   = decoded.userId;
    req.headers['x-user-role'] = decoded.role;

    next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({ success: false, error: { code, message: err.message } });
  }
};

app.use(authenticate);

// ─── Proxy Options Factory ────────────────────────────────────────────────────
const makeProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error(`[Gateway] Proxy error → ${target}: ${err.message}`);
        if (!res.headersSent) {
          res.setHeader('x-fallback-allowed', 'true');
          res.status(503).json({
            success: false,
            error: {
              code: 'SERVICE_UNAVAILABLE',
              message: 'Downstream microservice is temporarily unreachable.',
              target
            },
            fallback: true
          });
        }
      },
    },
  });

// ─── Route → Service Mapping (2 Core Microservices) ──────────────────────────
const IDENTITY_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:5001';
const CLINICAL_URL = process.env.CLINICAL_SERVICE_URL || 'http://localhost:5003';

// Service 1: Identity & Payment Service (Port 5001)
app.use('/api/v1/auth',          makeProxy(IDENTITY_URL));
app.use('/api/v1/users',         makeProxy(IDENTITY_URL));
app.use('/api/v1/patients',      makeProxy(IDENTITY_URL));
app.use('/api/v1/therapists',    makeProxy(IDENTITY_URL));
app.use('/api/v1/payments',      makeProxy(IDENTITY_URL));
app.use('/api/v1/invoices',      makeProxy(IDENTITY_URL));
app.use('/api/v1/refunds',       makeProxy(IDENTITY_URL));
app.use('/api/v1/payouts',       makeProxy(IDENTITY_URL));
app.use('/api/v1/admin/users',    makeProxy(IDENTITY_URL));

// Service 2: Clinical & Scheduling Service (Port 5002)
app.use('/api/v1/appointments',  makeProxy(CLINICAL_URL));
app.use('/api/v1/availability',  makeProxy(CLINICAL_URL));
app.use('/api/v1/services',      makeProxy(CLINICAL_URL));
app.use('/api/v1/programs',      makeProxy(CLINICAL_URL));
app.use('/api/v1/exercises',     makeProxy(CLINICAL_URL));
app.use('/api/v1/sessions',      makeProxy(CLINICAL_URL));
app.use('/api/v1/medical-records', makeProxy(CLINICAL_URL));

app.use('/api/v1/clinical',       makeProxy(CLINICAL_URL));
app.use('/api/clinical/programs',      makeProxy(CLINICAL_URL));
app.use('/api/clinical/exercises',     makeProxy(CLINICAL_URL));
app.use('/api/clinical/sessions',      makeProxy(CLINICAL_URL));
app.use('/api/clinical/medical-records', makeProxy(CLINICAL_URL));

app.use('/sessions',        makeProxy(CLINICAL_URL));
app.use('/programs',        makeProxy(CLINICAL_URL));
app.use('/exercises',       makeProxy(CLINICAL_URL));
app.use('/medical-records', makeProxy(CLINICAL_URL));
app.use('/api/v1/admin/patients', makeProxy(CLINICAL_URL));

// ─── Health Check & Aggregator ───────────────────────────────────────────────
app.get('/healthz', (req, res) => res.json({ status: 'ok', service: 'gateway', timestamp: new Date().toISOString() }));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway', timestamp: new Date().toISOString() }));

app.get('/api/v1/health', async (req, res) => {
  const services = [
    { name: 'identity-service', url: `${IDENTITY_URL}/health` },
    { name: 'clinical-service', url: `${CLINICAL_URL}/health` },
  ];

  const results = {};
  for (const s of services) {
    try {
      const resVal = await fetch(s.url, { timeout: 1500 });
      const data = await resVal.json();
      results[s.name] = { status: 'healthy', ...data };
    } catch (e) {
      results[s.name] = { 
        status: 'unreachable', 
        error: e.message, 
        cause: e.cause ? { message: e.cause.message, code: e.cause.code } : null 
      };
    }
  }

  res.json({
    status: 'ok',
    gateway: { 
      status: 'healthy', 
      port: PORT,
      urls: {
        identity: IDENTITY_URL,
        clinical: CLINICAL_URL
      }
    },
    services: results,
    timestamp: new Date().toISOString()
  });
});

// ─── Internal Notification API ────────────────────────────────────────────────
app.post('/api/v1/internal/notify', express.json(), (req, res) => {
  const secret = req.headers['x-internal-secret'];
  if (secret !== process.env.INTERNAL_SERVICE_SECRET) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
  }
  const { userId, event, payload } = req.body;
  io.to(`room:${userId}`).emit(event, payload);
  res.json({ success: true });
});

// ─── Socket.io Connection & Events ───────────────────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_secret');
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user.userId;
  const role = socket.user.role;
  console.log(`[Gateway Socket] Connected: ${userId} (${role})`);
  
  socket.join(`room:${userId}`);
  socket.join(`role:${role}`);
  
  socket.on('send_message', (data) => {
    const { recipientId, text, messageId } = data;
    console.log(`[Gateway Socket] Message: ${userId} -> ${recipientId}: "${text}"`);
    io.to(`room:${recipientId}`).emit('receive_message', {
      senderId: userId,
      senderRole: role,
      text,
      messageId,
      timestamp: new Date().toISOString()
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`[Gateway Socket] Disconnected: ${userId}`);
  });
});

// ─── 404 Catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `No route matches ${req.method} ${req.path}` } });
});

server.listen(PORT, () => console.log(`[Gateway] Running on port ${PORT}`));
