import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  transactionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  patientId:      { type: String, required: true },
  invoiceNumber:  { type: String, unique: true, required: true },
  breakdown: {
    subtotal:  { type: Number, default: 0 },  // in paise
    tax:       { type: Number, default: 0 },
    discount:  { type: Number, default: 0 },
    total:     { type: Number, default: 0 },
  },
  pdfKey:       { type: String },  // S3 key
  generatedAt:  { type: Date, default: Date.now },
}, { timestamps: true });

const RefundSchema = new mongoose.Schema({
  transactionId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  amountPaise:      { type: Number, required: true },
  reason:           { type: String },
  status:           { type: String, enum: ['initiated', 'processed', 'failed'], default: 'initiated' },
  gatewayRefundId:  { type: String },
  isManualReview:   { type: Boolean, default: false },  // flagged if gateway refund window closed
}, { timestamps: true });

const PayoutSchema = new mongoose.Schema({
  therapistId:      { type: String, required: true, index: true },
  periodStart:      { type: Date, required: true },
  periodEnd:        { type: Date, required: true },
  grossAmountPaise: { type: Number, default: 0 },
  commissionPaise:  { type: Number, default: 0 },
  netAmountPaise:   { type: Number, default: 0 },
  status:           { type: String, enum: ['pending', 'processed'], default: 'pending' },
  processedAt:      { type: Date },
  appointmentIds:   [{ type: String }],
}, { timestamps: true });

export const Invoice = mongoose.model('Invoice', InvoiceSchema);
export const Refund  = mongoose.model('Refund',  RefundSchema);
export const Payout  = mongoose.model('Payout',  PayoutSchema);
