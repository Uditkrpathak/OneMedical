import mongoose from 'mongoose';

const EmergencyContactSchema = new mongoose.Schema({
  name:     { type: String },
  phone:    { type: String },
  relation: { type: String },
}, { _id: false });

const PatientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  dob:               { type: Date },
  gender:            { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  height:            { type: Number },
  weight:            { type: Number },
  primaryConcern:    { type: String },
  medicalConditions: [{ type: String }],
  allergies:         [{ type: String }],
  emergencyContact:  { type: EmergencyContactSchema, default: {} },
  address:           { type: String },
  consultationPreferences: {
    preferredLanguage: { type: String, default: 'English' },
    preferOnlineConsult: { type: Boolean, default: false },
    preferHomeVisit:     { type: Boolean, default: false },
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// userId is unique: true so index is automatically generated

const PatientProfile = mongoose.model('PatientProfile', PatientProfileSchema);
export default PatientProfile;
