import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGO_ATLAS_BASE = process.env.MONGO_URI || 'mongodb+srv://uditpathak65_db_user:e2m2OqGfggD5kg5M@cluster0.yj7drql.mongodb.net';

const getDbUri = (dbName) => {
  if (MONGO_ATLAS_BASE.includes('mongodb+srv://')) {
    return `${MONGO_ATLAS_BASE}/${dbName}?retryWrites=true&w=majority`;
  }
  return `${MONGO_ATLAS_BASE}/${dbName}`;
};

// Schemas for Seeding
const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['patient', 'therapist', 'clinic_admin', 'super_admin'], required: true },
  name: String,
  email: String,
  phoneNumber: String,
  passwordHash: String,
  isPhoneVerified: Boolean,
  isEmailVerified: Boolean,
  isActive: Boolean
}, { timestamps: true });

const patientProfileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  dob: Date,
  gender: String,
  medicalConditions: [String],
  allergies: [String],
  emergencyContact: { name: String, phone: String, relation: String },
  address: String
}, { timestamps: true });

const therapistProfileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  specializations: [String],
  qualifications: [String],
  experienceYears: Number,
  languages: [String],
  clinicLocation: { address: String, lat: Number, lng: Number },
  consultationFee: Number,
  availabilityTemplate: Array,
  ratingAvg: Number,
  ratingCount: Number
}, { timestamps: true });

const appointmentSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  therapistId: mongoose.Schema.Types.ObjectId,
  serviceType: String,
  date: String,
  startTime: String,
  endTime: String,
  status: String,
  paymentTxnId: String,
  sessionSummary: String,
  createdBy: String
}, { timestamps: true });

const exerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  bodyPart: String,
  difficulty: String,
  mediaUrl: String,
  instructions: [String],
  mistakesToAvoid: [String],
  createdBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const programSchema = new mongoose.Schema({
  title: String,
  description: String,
  targetCondition: String,
  durationWeeks: Number,
  createdBy: mongoose.Schema.Types.ObjectId,
  exercises: Array
}, { timestamps: true });

const patientProgramSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  programId: mongoose.Schema.Types.ObjectId,
  assignedBy: mongoose.Schema.Types.ObjectId,
  startDate: Date,
  status: String,
  recoveryScore: Number,
  milestones: Array
}, { timestamps: true });

const sessionLogSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  patientProgramId: mongoose.Schema.Types.ObjectId,
  date: String,
  exercisesCompleted: Array,
  painLevel: Number,
  notes: String
}, { timestamps: true });

const medicalRecordSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  type: String,
  title: String,
  fileKey: String,
  uploadedBy: mongoose.Schema.Types.ObjectId,
  uploadedAt: Date,
  sizeBytes: Number,
  mimeType: String
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  appointmentId: mongoose.Schema.Types.ObjectId,
  patientId: mongoose.Schema.Types.ObjectId,
  amountPaise: Number,
  currency: String,
  gateway: String,
  gatewayOrderId: String,
  gatewayPaymentId: String,
  idempotencyKey: String,
  status: String,
  method: String
}, { timestamps: true });

const connOpts = {
  serverSelectionTimeoutMS: 15000,
  maxPoolSize: 10,
  tlsAllowInvalidCertificates: true
};
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function seed() {
  console.log('🌱 Starting One Medical Database Seeding Process...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Identity Service DB (identity_db)
  console.log('\n--- Seeding identity_db ---');
  const connIdentity = await mongoose.createConnection(getDbUri('identity_db'), connOpts).asPromise();
  const User = connIdentity.model('User', userSchema);
  const PatientProfile = connIdentity.model('PatientProfile', patientProfileSchema);
  const TherapistProfile = connIdentity.model('TherapistProfile', therapistProfileSchema);

  await User.deleteMany({});
  await PatientProfile.deleteMany({});
  await TherapistProfile.deleteMany({});

  const admin = await User.create({
    role: 'clinic_admin',
    name: 'Admin Desk',
    email: 'admin@onemedical.com',
    phoneNumber: '+919876543210',
    passwordHash: hashedPassword,
    isPhoneVerified: true,
    isEmailVerified: true,
    isActive: true
  });

  const therapist1 = await User.create({
    role: 'therapist',
    name: 'Dr. Ananya Iyer',
    email: 'ananya.iyer@onemedical.com',
    phoneNumber: '+919876543211',
    passwordHash: hashedPassword,
    isPhoneVerified: true,
    isEmailVerified: true,
    isActive: true
  });

  const therapist2 = await User.create({
    role: 'therapist',
    name: 'Dr. Arjun Mehta',
    email: 'arjun.mehta@onemedical.com',
    phoneNumber: '+919876543212',
    passwordHash: hashedPassword,
    isPhoneVerified: true,
    isEmailVerified: true,
    isActive: true
  });

  const patient1 = await User.create({
    role: 'patient',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phoneNumber: '+919876543213',
    passwordHash: hashedPassword,
    isPhoneVerified: true,
    isEmailVerified: true,
    isActive: true
  });

  const patient2 = await User.create({
    role: 'patient',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phoneNumber: '+919876543214',
    passwordHash: hashedPassword,
    isPhoneVerified: true,
    isEmailVerified: true,
    isActive: true
  });

  await TherapistProfile.create({
    userId: therapist1._id,
    specializations: ['Sports Injury', 'ACL Rehabilitation', 'Knee Joint Recovery'],
    qualifications: ['BPT', 'MPT Orthopedics', 'CSCS Certified'],
    experienceYears: 8,
    languages: ['English', 'Hindi', 'Spanish'],
    clinicLocation: { address: 'One Medical Downtown, Suite 401, Health Hub', lat: 28.6315, lng: 77.2167 },
    consultationFee: 120000,
    availabilityTemplate: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDurationMin: 45 },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', slotDurationMin: 45 },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', slotDurationMin: 45 },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', slotDurationMin: 45 },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', slotDurationMin: 45 }
    ],
    ratingAvg: 4.9,
    ratingCount: 42
  });

  await TherapistProfile.create({
    userId: therapist2._id,
    specializations: ['Spine & Lumbar Rehab', 'Post-Surgical Recovery', 'Sports Physiotherapy'],
    qualifications: ['BPT', 'MPT Neurology'],
    experienceYears: 12,
    languages: ['English', 'Hindi'],
    clinicLocation: { address: 'One Medical HQ Road, Wellness Avenue', lat: 12.9784, lng: 77.6408 },
    consultationFee: 150000,
    availabilityTemplate: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', slotDurationMin: 45 },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00', slotDurationMin: 45 },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00', slotDurationMin: 45 }
    ],
    ratingAvg: 4.9,
    ratingCount: 38
  });

  await PatientProfile.create({
    userId: patient1._id,
    dob: new Date('1994-06-15'),
    gender: 'male',
    medicalConditions: ['Right Knee ACL Reconstruction', 'Mild Meniscus Tear'],
    allergies: ['Penicillin'],
    emergencyContact: { name: 'Mark Johnson', phone: '+919811122233', relation: 'Brother' },
    address: 'B-12 Green Park Extension, New Delhi'
  });

  await PatientProfile.create({
    userId: patient2._id,
    dob: new Date('1988-11-20'),
    gender: 'female',
    medicalConditions: ['Lumbar Disc Herniation (L4-L5)', 'Sciatica'],
    allergies: [],
    emergencyContact: { name: 'David Davis', phone: '+919822233344', relation: 'Spouse' },
    address: '45 Lotus Boulevard, Sector 168, Noida'
  });

  console.log(`✅ Seeded ${await User.countDocuments()} users including 2 verified therapists.`);

  await connIdentity.close();
  await delay(1000);

  // 2. Clinical Service DB (clinical_db)
  console.log('\n--- Seeding clinical_db ---');
  const connClinical = await mongoose.createConnection(getDbUri('clinical_db'), connOpts).asPromise();
  const Exercise = connClinical.model('Exercise', exerciseSchema);
  const Program = connClinical.model('Program', programSchema);
  const PatientProgram = connClinical.model('PatientProgram', patientProgramSchema);
  const SessionLog = connClinical.model('SessionLog', sessionLogSchema);
  const MedicalRecord = connClinical.model('MedicalRecord', medicalRecordSchema);

  await Exercise.deleteMany({});
  await Program.deleteMany({});
  await PatientProgram.deleteMany({});
  await SessionLog.deleteMany({});
  await MedicalRecord.deleteMany({});

  const ex1 = await Exercise.create({
    name: 'Straight Leg Raise (SLR)',
    description: 'Strengthens quadriceps without putting stress on knee joint.',
    bodyPart: 'Knee',
    difficulty: 'beginner',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    instructions: ['Lie flat on back with one leg bent.', 'Keep target leg straight and lift 12 inches.', 'Hold for 5 seconds and slowly lower.'],
    mistakesToAvoid: ['Arching lower back', 'Bending knee during elevation'],
    createdBy: therapist1._id
  });

  const ex2 = await Exercise.create({
    name: 'Quad Setting / Iso Quad',
    description: 'Isometric contraction to re-activate VMO muscle post-knee surgery.',
    bodyPart: 'Knee',
    difficulty: 'beginner',
    mediaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    instructions: ['Sit with leg extended straight on flat surface.', 'Place small rolled towel under knee.', 'Push back of knee down into towel, tightening thigh muscle.'],
    mistakesToAvoid: ['Holding breath', 'Lifting heel off ground'],
    createdBy: therapist1._id
  });

  const ex3 = await Exercise.create({
    name: 'Cat-Cow Lumbar Mobilization',
    description: 'Improves spine flexiblity and relieves tension in lower back.',
    bodyPart: 'Spine',
    difficulty: 'beginner',
    mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    instructions: ['Start on hands and knees.', 'Inhale, arching back down and looking up (Cow).', 'Exhale, rounding spine up toward ceiling (Cat).'],
    mistakesToAvoid: ['Overextending neck', 'Rushing movement'],
    createdBy: therapist2._id
  });

  const prog1 = await Program.create({
    title: 'ACL Reconstruction Rehabilitation (Phase 1: W1-W4)',
    description: 'Focuses on patellar mobilization, quadriceps activation, and restoring full knee extension.',
    targetCondition: 'ACL Post-Op',
    durationWeeks: 4,
    createdBy: therapist1._id,
    exercises: [
      { exerciseId: ex1._id, dayOfWeek: 1, sets: 3, reps: 10, durationSec: 0 },
      { exerciseId: ex2._id, dayOfWeek: 1, sets: 3, reps: 15, durationSec: 10 },
      { exerciseId: ex1._id, dayOfWeek: 3, sets: 3, reps: 12, durationSec: 0 }
    ]
  });

  const patProg1 = await PatientProgram.create({
    patientId: patient1._id,
    programId: prog1._id,
    assignedBy: therapist1._id,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    recoveryScore: 82,
    milestones: [
      { title: 'Full Knee Extension (0°)', targetDate: new Date(), achieved: true }
    ]
  });

  await SessionLog.create({
    patientId: patient1._id,
    patientProgramId: patProg1._id,
    date: new Date().toISOString().split('T')[0],
    exercisesCompleted: [
      { exerciseId: ex1._id, setsDone: 3, repsDone: 10 },
      { exerciseId: ex2._id, setsDone: 3, repsDone: 15 }
    ],
    painLevel: 2,
    notes: 'Knee felt stable today during SLR.'
  });

  console.log(`✅ Seeded clinical exercises & programs.`);

  await connClinical.close();
  await delay(1000);

  // 3. Scheduling Service DB (scheduling_db)
  console.log('\n--- Seeding scheduling_db ---');
  const connScheduling = await mongoose.createConnection(getDbUri('scheduling_db'), connOpts).asPromise();
  const Appointment = connScheduling.model('Appointment', appointmentSchema);
  await Appointment.deleteMany({});

  const todayStr = new Date().toISOString().split('T')[0];

  const appt1 = await Appointment.create({
    patientId: patient1._id,
    therapistId: therapist1._id,
    serviceType: 'ACL Rehabilitation Review',
    date: todayStr,
    startTime: '10:00',
    endTime: '10:45',
    status: 'confirmed',
    paymentTxnId: 'TXN_' + Date.now(),
    sessionSummary: 'Patient showed steady progress in VMO quad activation.',
    createdBy: 'patient'
  });

  console.log(`✅ Seeded ${await Appointment.countDocuments()} appointments.`);
  await connScheduling.close();

  console.log('\n🎉 Database Seeding Completed Successfully!\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
