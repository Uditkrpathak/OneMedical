import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  targetDate: { type: Date },
  achieved:   { type: Boolean, default: false },
  achievedAt: { type: Date },
}, { _id: false });

// Per-patient exercise override (therapist can customize for this patient)
const PatientExerciseOverrideSchema = new mongoose.Schema({
  exerciseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  sets:        { type: Number },
  reps:        { type: Number },
  durationSec: { type: Number },
  notes:       { type: String },
}, { _id: false });

const PatientProgramSchema = new mongoose.Schema({
  patientId:       { type: String, required: true, index: true },
  programId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  assignedBy:      { type: String, required: true }, // therapistId
  appointmentId:   { type: String },                 // linked appointment
  startDate:       { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  // Recovery score: 0–100
  // Formula: adherence×0.5 + painTrendScore×0.3 + milestoneScore×0.2
  recoveryScore:       { type: Number, default: 0 },
  adherencePercent:    { type: Number, default: 0 },
  painTrendScore:      { type: Number, default: 0 },   // 0–100: 100 = pain going to 0
  milestoneScore:      { type: Number, default: 0 },   // % milestones achieved
  milestones:          [MilestoneSchema],
  exerciseOverrides:   [PatientExerciseOverrideSchema],
  activityRestrictions: { type: String },
  patientGoals:        { type: String },
  isDeleted:           { type: Boolean, default: false },
}, { timestamps: true });

PatientProgramSchema.index({ patientId: 1, status: 1 });

const PatientProgram = mongoose.model('PatientProgram', PatientProgramSchema);
export default PatientProgram;
