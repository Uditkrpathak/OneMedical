import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  description:     { type: String },
  bodyPart:        { type: String, required: true }, // e.g. "Lower Back", "Knee" — populated from DB
  difficulty:      { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  mediaUrl:        { type: String },   // S3 image/video URL
  thumbnailUrl:    { type: String },
  instructions:    [{ type: String }],
  mistakesToAvoid: [{ type: String }],
  defaultSets:     { type: Number, default: 3 },
  defaultReps:     { type: Number, default: 10 },
  defaultDurationSec: { type: Number, default: 30 },
  createdBy:       { type: String, required: true }, // therapistId
  isPublic:        { type: Boolean, default: false }, // visible to all therapists if true
  isDeleted:       { type: Boolean, default: false },
}, { timestamps: true });

ExerciseSchema.index({ bodyPart: 1 });
ExerciseSchema.index({ difficulty: 1 });
ExerciseSchema.index({ createdBy: 1 });

const Exercise = mongoose.model('Exercise', ExerciseSchema);
export default Exercise;
