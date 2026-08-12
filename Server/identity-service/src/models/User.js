import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const OtpSchema = new mongoose.Schema({
  codeHash:  { type: String },
  expiresAt: { type: Date },
  attempts:  { type: Number, default: 0 },
  lockedUntil: { type: Date },
}, { _id: false });

const RefreshTokenSchema = new mongoose.Schema({
  jti:       { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['patient', 'therapist', 'clinic_admin', 'super_admin'],
    required: true,
  },
  name:          { type: String, trim: true },
  email:         { type: String, trim: true, lowercase: true, sparse: true },
  phoneNumber:   { type: String, trim: true, unique: true, sparse: true },
  passwordHash:  { type: String },          // staff/therapist/admin only
  otp:           { type: OtpSchema, default: {} },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
  isProfileCompleted: { type: Boolean, default: false },
  savedTherapists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notificationPreferences: {
    upcomingAppointment: { type: Boolean, default: true },
    appointmentConfirmation: { type: Boolean, default: true },
    appointmentRescheduled: { type: Boolean, default: true },
    appointmentCancelled: { type: Boolean, default: true },
    todayExercise: { type: Boolean, default: true },
    recoveryProgramUpdates: { type: Boolean, default: true },
    weeklyProgressSummary: { type: Boolean, default: true },
    achievementNotifications: { type: Boolean, default: true },
    newMedicalReports: { type: Boolean, default: true },
    paymentConfirmation: { type: Boolean, default: true },
    invoiceAvailable: { type: Boolean, default: true },
    healthTips: { type: Boolean, default: false },
    newFeatures: { type: Boolean, default: false },
    promotions: { type: Boolean, default: false },
  },
  deletionRequest: {
    requestedAt: { type: Date },
    reason: { type: String },
    status: { type: String, enum: ['none', 'pending', 'processed'], default: 'none' },
  },
  refreshTokens: { type: [RefreshTokenSchema], default: [] },
  lastLoginAt:   { type: Date },
  isDeleted:     { type: Boolean, default: false },
  deletedAt:     { type: Date },
}, { timestamps: true });

// Explicit schema indexes (unique/sparse fields already create default indexes)

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash') && this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Never return sensitive fields
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.otp;
  delete obj.refreshTokens;
  return obj;
};

const User = mongoose.model('User', UserSchema);
export default User;
