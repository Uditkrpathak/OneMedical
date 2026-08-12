import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientId:    { type: String, required: true, index: true },
  therapistId:  { type: String, required: true },
  therapistProfileId: { type: String },
  serviceType:  { type: String, required: true },  // dynamic: e.g. "Back Pain", "Neck Pain"
  appointmentPlace: { type: String, enum: ['clinic', 'home', 'online'], default: 'clinic' },
  date:         { type: String, required: true },  // "YYYY-MM-DD"
  startTime:    { type: String, required: true },  // "09:30"
  endTime:      { type: String, required: true },  // "10:00"
  durationMin:  { type: Number, default: 30 },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending_payment',
    index: true,
  },
  cancelReason:   { type: String },
  paymentTxnId:   { type: String },
  sessionSummary: { type: String },
  createdBy:      { type: String, enum: ['self', 'admin', 'therapist'], default: 'self' },
  holdExpiresAt:  { type: Date },  // for TTL auto-cancel
  isDeleted:      { type: Boolean, default: false },
}, { timestamps: true });

// Compound index to prevent double booking
AppointmentSchema.index({ therapistId: 1, date: 1, startTime: 1 });

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
