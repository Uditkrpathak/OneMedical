import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  appointmentId:    { type: String, required: true, index: true },
  patientId:        { type: String, required: true, index: true },
  therapistId:      { type: String },
  amountPaise:      { type: Number, required: true },  // smallest INR unit
  currency:         { type: String, default: 'INR' },
  gateway:          { type: String, default: 'razorpay' },
  gatewayOrderId:   { type: String },
  gatewayPaymentId: { type: String, unique: true, sparse: true },
  idempotencyKey:   { type: String, unique: true, required: true },  // = appointmentId hold ID
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'],
    default: 'created',
  },
  method:      { type: String },   // 'upi', 'card', 'netbanking', 'wallet', 'pay_at_clinic'
  paymentPlace:{ type: String, enum: ['online', 'clinic'], default: 'online' },
  statusHistory: [{
    status:    { type: String },
    timestamp: { type: Date, default: Date.now },
    note:      { type: String },
  }],
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

TransactionSchema.index({ idempotencyKey: 1 });
TransactionSchema.index({ gatewayPaymentId: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
