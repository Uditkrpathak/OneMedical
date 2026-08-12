import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
  patientId:    { type: String, required: true, index: true },
  type:         { type: String, enum: ['report', 'scan', 'note', 'prescription'], required: true },
  title:        { type: String, required: true },
  fileKey:      { type: String },          // S3 object key
  fileUrl:      { type: String },          // presigned URL (ephemeral, not stored permanently)
  mimeType:     { type: String },
  sizeBytes:    { type: Number },
  uploadedBy:   { type: String, required: true }, // userId
  uploaderRole: { type: String, enum: ['patient', 'therapist', 'clinic_admin'] },
  visibleToPatient: { type: Boolean, default: true },
  notes:        { type: String },
  isDeleted:    { type: Boolean, default: false },
}, { timestamps: true });

MedicalRecordSchema.index({ patientId: 1, type: 1 });

const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);
export default MedicalRecord;
