import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import TherapistProfile from '../models/TherapistProfile.js';

// ─── GET MY PROFILE ───────────────────────────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ userId }).lean();
    } else if (user.role === 'therapist') {
      profile = await TherapistProfile.findOne({ userId }).lean();
    }

    const { passwordHash, otp, refreshTokens, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, profile } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── UPDATE PATIENT PROFILE ───────────────────────────────────────────────────
export const updatePatientProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const allowed = ['dob', 'gender', 'height', 'weight', 'primaryConcern', 'medicalConditions', 'allergies', 'emergencyContact', 'address', 'consultationPreferences'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    // Update base user details including isProfileCompleted
    const userUpdates = { isProfileCompleted: true };
    if (req.body.name) userUpdates.name = req.body.name;
    const updatedUser = await User.findByIdAndUpdate(userId, userUpdates, { new: true });

    const profile = await PatientProfile.findOneAndUpdate({ userId }, updates, { new: true, upsert: true });
    res.json({ success: true, data: { user: updatedUser ? updatedUser.toSafeObject() : null, profile } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── UPDATE THERAPIST PROFILE ─────────────────────────────────────────────────
export const updateTherapistProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const allowed = ['specializations', 'qualifications', 'experienceYears', 'languages', 'bio', 'profileImageUrl', 'clinicName', 'clinicLocation', 'consultationFee', 'availabilityTemplate', 'leaveExceptions', 'appointmentBuffer'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    if (req.body.name) await User.findByIdAndUpdate(userId, { name: req.body.name });

    const profile = await TherapistProfile.findOneAndUpdate({ userId }, updates, { new: true, upsert: true });
    res.json({ success: true, data: { profile } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── LIST THERAPISTS (public search) ─────────────────────────────────────────
export const listTherapists = async (req, res) => {
  try {
    const { specialization, language, page = 1, limit = 10 } = req.query;
    const filter = { isVerified: true, isDeleted: false };
    if (specialization) filter.specializations = { $in: [new RegExp(specialization, 'i')] };
    if (language) filter.languages = { $in: [new RegExp(language, 'i')] };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [profiles, total] = await Promise.all([
      TherapistProfile.find(filter).skip(skip).limit(parseInt(limit)).lean(),
      TherapistProfile.countDocuments(filter),
    ]);

    // Enrich with user name
    const userIds = profiles.map(p => p.userId);
    const users = await User.find({ _id: { $in: userIds } }, 'name email phoneNumber').lean();
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u; });

    const enriched = profiles.map(p => ({ ...p, user: userMap[p.userId.toString()] || null }));
    res.json({ success: true, data: enriched, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET THERAPIST BY ID ──────────────────────────────────────────────────────
export const getTherapistById = async (req, res) => {
  try {
    const profile = await TherapistProfile.findById(req.params.id).lean();
    if (!profile) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Therapist not found.' } });

    const user = await User.findById(profile.userId, 'name email phoneNumber').lean();
    res.json({ success: true, data: { ...profile, user } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── ADMIN: LIST ALL USERS (paginated) ───────────────────────────────────────
export const adminListUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = { isDeleted: false };
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { phoneNumber: new RegExp(search, 'i') }];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter, '-passwordHash -otp -refreshTokens').skip(skip).limit(parseInt(limit)).lean(),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: users, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── INTERNAL: GET USERS BY IDS ────────────────────────────────────────────────
export const internalGetUsersByIds = async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    const users = await User.find({ _id: { $in: ids } }, 'name phoneNumber email').lean();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── SAVED THERAPISTS ─────────────────────────────────────────────────────────
export const getSavedTherapists = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId).populate('savedTherapists', 'name email phoneNumber').lean();
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    
    // Fetch profiles for saved therapists
    const therapistIds = user.savedTherapists ? user.savedTherapists.map(t => t._id) : [];
    const profiles = await TherapistProfile.find({ userId: { $in: therapistIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.userId.toString()] = p; });

    const result = (user.savedTherapists || []).map(t => ({
      _id: t._id,
      name: t.name,
      email: t.email,
      phoneNumber: t.phoneNumber,
      ...(profileMap[t._id.toString()] || {})
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

export const saveTherapist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { therapistId } = req.params;
    await User.findByIdAndUpdate(userId, { $addToSet: { savedTherapists: therapistId } });
    res.json({ success: true, message: 'Specialist saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

export const removeSavedTherapist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { therapistId } = req.params;
    await User.findByIdAndUpdate(userId, { $pull: { savedTherapists: therapistId } });
    res.json({ success: true, message: 'Specialist removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── NOTIFICATION PREFERENCES ────────────────────────────────────────────────
export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const prefs = req.body;
    const user = await User.findByIdAndUpdate(userId, { $set: { notificationPreferences: prefs } }, { new: true });
    res.json({ success: true, data: user.notificationPreferences });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── ACCOUNT DELETION REQUEST ────────────────────────────────────────────────
export const requestAccountDeletion = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { reason } = req.body;
    await User.findByIdAndUpdate(userId, {
      $set: {
        'deletionRequest.requestedAt': new Date(),
        'deletionRequest.reason': reason || 'User requested deletion',
        'deletionRequest.status': 'pending',
        isActive: false,
        refreshTokens: []
      }
    });
    res.json({ success: true, message: 'Account deletion request submitted. Your account will be anonymized within 30 days.' });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
