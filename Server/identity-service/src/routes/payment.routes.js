import express from 'express';
import { createOrder, handleWebhook, devSimulateCapture, getMyTransactions, initiateRefund, computePayout, getInvoiceById, processPayment, getInvoices } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/orders',               createOrder);
router.post('/payments/orders',      createOrder);

router.post('/process',              processPayment);
router.post('/payments/process',     processPayment);

router.post('/webhook',              handleWebhook);
router.post('/payments/webhook',     handleWebhook);

router.post('/dev/capture',          devSimulateCapture);
router.post('/payments/dev/capture', devSimulateCapture);

router.get('/',                       getMyTransactions);
router.get('/payments',               getMyTransactions);
router.get('/history',                getMyTransactions);
router.get('/payments/history',       getMyTransactions);
router.get('/invoices',               getInvoices);
router.get('/payments/invoices',     getInvoices);
router.get('/invoices/:id',           getInvoiceById);

router.post('/refunds',               initiateRefund);
router.post('/payouts/compute',       computePayout);

export default router;
