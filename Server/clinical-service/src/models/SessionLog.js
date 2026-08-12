import mongoose from 'mongoose';

const ExerciseLogSchema = new mongoose.Schema({
  exerciseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  setsDone:    { type: Number, default: 0 },
  repsDone:    { type: Number, default: 0 },
  durationSec: { type: Number, default: 0 },
  completed:   { type: Boolean, default: false },
}, { _id: false });

const SessionLogSchema = new mongoose.Schema({
  patientId:        { type: String, required: true, index: true },
  patientProgramId: { type: mongoose.Schema.Types.Mixed, required: false },
  sessionLogId:     { type: String },  // client-generated idempotency key
  date:             { type: String, required: true }, // "YYYY-MM-DD"
  exercisesCompleted: { type: mongoose.Schema.Types.Mixed, default: [] },
  painLevel:        { type: Number, min: 0, max: 10, default: 2 },
  notes:            { type: String },
  completedOffline: { type: Boolean, default: false }, // logged while offline, synced later
}, { timestamps: true });

SessionLogSchema.index({ patientId: 1, date: -1 });
SessionLogSchema.index({ patientProgramId: 1 });

const SessionLog = mongoose.model('SessionLog', SessionLogSchema);
export default SessionLog;
