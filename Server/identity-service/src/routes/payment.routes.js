import express from 'express';
import { createOrder, handleWebhook, devSimulateCapture, getMyTransactions, initiateRefund, computePayout, getInvoiceById, processPayment, getInvoices } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/payments/orders',            createOrder);
router.post('/payments/process',           processPayment);
router.post('/payments/webhook',           handleWebhook);         // raw signature-verified
router.post('/payments/dev/capture',       devSimulateCapture);    // dev mode only
router.get('/payments',                    getMyTransactions);
router.get('/payments/history',            getMyTransactions);
router.get('/payments/invoices',           getInvoices);
router.get('/invoices',                    getInvoices);
router.get('/invoices/:id',                getInvoiceById);
router.post('/refunds',                    initiateRefund);
router.post('/payouts/compute',            computePayout);

export default router;
