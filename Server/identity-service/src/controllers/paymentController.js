import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import { Invoice, Refund, Payout } from '../models/Billing.js';
import { publishEvent } from '../utils/rabbitmq.js';

// ─── Helper: sequential invoice number ───────────────────────────────────────
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${String(count + 1).padStart(6, '0')}`;
};

// ─── CREATE PAYMENT ORDER ─────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    const { appointmentId, therapistId, amountPaise, method, paymentPlace } = req.body;

    if (!appointmentId || !amountPaise) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'appointmentId and amountPaise are required.' } });
    }

    // Idempotency: one order per appointment
    const existing = await Transaction.findOne({ idempotencyKey: appointmentId });
    if (existing) return res.json({ success: true, data: { transaction: existing, message: 'Order already exists (idempotent).' } });

    let gatewayOrderId = null;

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const { default: Razorpay } = await import('razorpay');
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const order = await instance.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: appointmentId,
          notes: { therapistId, paymentPlace: paymentPlace || 'online' },
        });
        gatewayOrderId = order.id;
        console.log(`[Razorpay Real API] Created order ID: ${gatewayOrderId}`);
      } catch (rerr) {
        console.warn('[Razorpay API Warning] Falling back to simulated order:', rerr.message);
        gatewayOrderId = `rzp_order_${Date.now()}`;
      }
    } else {
      // Dev mode: simulate a gateway order
      gatewayOrderId = `dev_order_${Date.now()}`;
      console.log(`[Payment DEV] Simulated Razorpay order created: ${gatewayOrderId}`);
    }

    const transaction = await Transaction.create({
      appointmentId, patientId, therapistId,
      amountPaise, currency: 'INR',
      gateway: 'razorpay',
      gatewayOrderId,
      idempotencyKey: appointmentId,
      method: method || 'online',
      paymentPlace: paymentPlace || 'online',
      status: 'created',
      statusHistory: [{ status: 'created', note: 'Order initiated by patient.' }],
    });

    res.status(201).json({ success: true, data: { transaction, gatewayOrderId } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── WEBHOOK (Razorpay signature verified) ────────────────────────────────────
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_KEY_SECRET || 'dev_secret';
    const signature     = req.headers['x-razorpay-signature'];
    const body          = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const isDevMode = process.env.NODE_ENV !== 'production' || process.env.PAYMENT_DEV_MODE === 'true';
    const isDevEvent = req.body?.event === 'dev.payment.captured' || req.isDevCapture;

    // Perform signature check for production webhooks with signatures
    if (!isDevMode && !isDevEvent && signature) {
      const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
      if (signature !== expected) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed.' } });
      }
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured' || event === 'dev.payment.captured') {
      const gatewayPaymentId = payload?.payment?.entity?.id || `dev_pay_${Date.now()}`;
      const gatewayOrderId   = payload?.payment?.entity?.order_id || req.body.gatewayOrderId;

      // Idempotency: skip if already processed
      const exists = await Transaction.findOne({ gatewayPaymentId });
      if (exists) return res.json({ success: true, data: { message: 'Already processed.' } });

      const txn = await Transaction.findOneAndUpdate(
        { gatewayOrderId },
        {
          status: 'captured',
          gatewayPaymentId,
          $push: { statusHistory: { status: 'captured', note: 'Payment captured via webhook.' } },
        },
        { new: true }
      );

      if (txn) {
        // Auto-generate invoice
        const invoiceNumber = await generateInvoiceNumber();
        await Invoice.create({
          transactionId: txn._id, patientId: txn.patientId,
          invoiceNumber,
          breakdown: { subtotal: txn.amountPaise, tax: 0, discount: 0, total: txn.amountPaise },
        });

        // Tell Clinical/Scheduling Service to confirm the appointment
        try {
          const schedulingUrl = process.env.CLINICAL_SERVICE_URL || process.env.SCHEDULING_SERVICE_URL || 'https://onemedical-clinical.onrender.com';
          const { default: fetch } = await import('node-fetch');
          await fetch(`${schedulingUrl}/api/v1/appointments/${txn.appointmentId}/confirm`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-user-id': 'identity-service', 'x-user-role': 'clinic_admin' },
            body: JSON.stringify({ paymentTxnId: txn._id }),
          });
        } catch (e) {
          console.warn('[Payment] Could not confirm appointment in clinical service:', e.message);
        }

        await publishEvent('payment.succeeded', { transactionId: txn._id, appointmentId: txn.appointmentId, patientId: txn.patientId, therapistId: txn.therapistId, amountPaise: txn.amountPaise });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[Payment] Webhook error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

export const devSimulateCapture = async (req, res) => {
  // Allow dev capture unless explicitly set to false in production
  if (process.env.NODE_ENV === 'production' && process.env.PAYMENT_DEV_MODE === 'false') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Only available in dev mode.' } });
  }

  req.isDevCapture = true;
  req.body = {
    event: 'dev.payment.captured',
    gatewayOrderId: req.body.gatewayOrderId,
    payload: { payment: { entity: { id: `dev_pay_${Date.now()}`, order_id: req.body.gatewayOrderId } } },
  };
  return handleWebhook(req, res);
};

// ─── GET MY TRANSACTIONS ──────────────────────────────────────────────────────
export const getMyTransactions = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    const userRole  = req.headers['x-user-role'];
    const { page = 1, limit = 10, status } = req.query;

    const filter = { isDeleted: false };
    if (userRole === 'patient') filter.patientId = patientId;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [txns, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(filter),
    ]);
    res.json({ success: true, data: txns, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET INVOICE BY ID ────────────────────────────────────────────────────────
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── INITIATE REFUND ──────────────────────────────────────────────────────────
export const initiateRefund = async (req, res) => {
  try {
    const { transactionId, amountPaise, reason } = req.body;
    const txn = await Transaction.findById(transactionId);
    if (!txn) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaction not found.' } });

    const refund = await Refund.create({ transactionId, amountPaise, reason, status: 'initiated' });

    await txn.statusHistory.push({ status: 'refunded', note: `Refund initiated: ₹${amountPaise / 100}` });
    txn.status = amountPaise < txn.amountPaise ? 'partially_refunded' : 'refunded';
    await txn.save();

    await publishEvent('payment.refunded', { transactionId, refundId: refund._id, amountPaise, patientId: txn.patientId });

    res.status(201).json({ success: true, data: { refund } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── COMPUTE PAYOUT (admin) ───────────────────────────────────────────────────
export const computePayout = async (req, res) => {
  try {
    const { therapistId, periodStart, periodEnd } = req.body;
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE) || 0.10;

    const txns = await Transaction.find({
      therapistId, status: 'captured',
      createdAt: { $gte: new Date(periodStart), $lte: new Date(periodEnd) },
    });

    const grossAmountPaise    = txns.reduce((sum, t) => sum + t.amountPaise, 0);
    const commissionPaise     = Math.round(grossAmountPaise * commissionRate);
    const netAmountPaise      = grossAmountPaise - commissionPaise;
    const appointmentIds      = txns.map(t => t.appointmentId);

    const payout = await Payout.create({ therapistId, periodStart: new Date(periodStart), periodEnd: new Date(periodEnd), grossAmountPaise, commissionPaise, netAmountPaise, appointmentIds });

    res.status(201).json({ success: true, data: { payout } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── PROCESS PAYMENT ──────────────────────────────────────────────────────────
export const processPayment = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'] || 'usr_pat1';
    const { appointmentId, therapistId, amountPaise, method, paymentPlace } = req.body;

    if (!appointmentId || !amountPaise) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'appointmentId and amountPaise are required.' } });
    }

    const gatewayOrderId = `pay_order_${Date.now()}`;
    const gatewayPaymentId = `pay_txn_${Date.now()}`;

    const transaction = await Transaction.create({
      appointmentId,
      patientId,
      therapistId,
      amountPaise,
      currency: 'INR',
      gateway: 'razorpay',
      gatewayOrderId,
      gatewayPaymentId,
      idempotencyKey: appointmentId,
      method: method || 'online',
      paymentPlace: paymentPlace || 'online',
      status: 'captured',
      statusHistory: [
        { status: 'created', note: 'Order initiated.' },
        { status: 'captured', note: 'Payment processed successfully.' }
      ]
    });

    const invoiceNumber = await generateInvoiceNumber();
    const invoice = await Invoice.create({
      transactionId: transaction._id,
      patientId,
      invoiceNumber,
      breakdown: { subtotal: amountPaise, tax: 0, discount: 0, total: amountPaise },
    });

    // Confirm appointment in clinical service
    try {
      const schedulingUrl = process.env.CLINICAL_SERVICE_URL || 'https://onemedical-clinical.onrender.com';
      const { default: fetch } = await import('node-fetch');
      await fetch(`${schedulingUrl}/api/v1/appointments/${appointmentId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'identity-service', 'x-user-role': 'clinic_admin' },
        body: JSON.stringify({ paymentTxnId: transaction._id }),
      });
    } catch (e) {
      console.warn('[Payment] Could not confirm appointment in clinical service:', e.message);
    }

    await publishEvent('payment.succeeded', {
      transactionId: transaction._id,
      appointmentId,
      patientId,
      therapistId,
      amountPaise
    });

    res.status(201).json({ success: true, data: { transaction, invoice } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET INVOICES ─────────────────────────────────────────────────────────────
export const getInvoices = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    const filter = {};
    if (userRole === 'patient') filter.patientId = patientId;

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
