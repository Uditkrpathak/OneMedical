import mongoose from 'mongoose';

const ProgramExerciseSchema = new mongoose.Schema({
  exerciseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  dayOfWeek:   { type: Number, min: 0, max: 6, required: true }, // 0=Sun
  weekNumber:  { type: Number, default: 1 },
  sets:        { type: Number, default: 3 },
  reps:        { type: Number, default: 10 },
  durationSec: { type: Number, default: 30 },
  restSec:     { type: Number, default: 60 },
  notes:       { type: String },
}, { _id: false });

const ProgramSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  description:     { type: String },
  targetCondition: { type: String, required: true }, // "Lower Back Pain", "Knee Rehab" etc.
  durationWeeks:   { type: Number, required: true, default: 4 },
  difficulty:      { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  createdBy:       { type: String, required: true }, // therapistId
  exercises:       [ProgramExerciseSchema],
  isTemplate:      { type: Boolean, default: false }, // reusable template
  isDeleted:       { type: Boolean, default: false },
}, { timestamps: true });

ProgramSchema.index({ createdBy: 1 });
ProgramSchema.index({ targetCondition: 1 });

const Program = mongoose.model('Program', ProgramSchema);
export default Program;
