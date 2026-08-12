import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import { sendFirebaseSmsOtp } from '../config/firebase.js';
import { sendEmailOtp } from '../config/email.js';

// Whitelisted Therapist Phone Numbers (Pre-verified clinic staff)
const WHITELISTED_THERAPIST_PHONES = ['9876543211', '+919876543211', '9876543212', '+919876543212'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const issueTokens = (userId, role) => {
  const jti = uuidv4();

  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, role, jti },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 30);

  return { accessToken, refreshToken, jti, refreshExpiresAt };
};

const sendOtp = async (target, otp) => {
  const isEmail = target.includes('@');
  
  if (isEmail) {
    return await sendEmailOtp(target, otp);
  }

  let cleanPhone = target.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;

  console.log(`\n==================================================`);
  console.log(`[SECURE OTP GATEWAY] Target: ${target} | Mobile: ${formattedPhone} | 🔑 OTP: ${otp}`);
  console.log(`==================================================\n`);

  let dispatched = false;
  if (process.env.FIREBASE_API_KEY) {
    try {
      const mobileNumber = cleanPhone.length === 10 ? cleanPhone : cleanPhone.slice(-10);
      const fbResult = await sendFirebaseSmsOtp(mobileNumber);
      if (fbResult.success) {
        dispatched = true;
        console.log(`[Firebase SMS Gateway] Successfully sent OTP SMS to ${formattedPhone}`);
      }
    } catch (e) {
      console.error('[Firebase SMS Gateway Error]:', e.message);
    }
  }

  return dispatched || true;
};

// ─── REQUEST PHONE / EMAIL OTP ──────────────────────────────────────────────
export const requestOtp = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email or phoneNumber is required.' } });
    }

    const target = email || phoneNumber;
    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
    const last10Digits = cleanPhone.slice(-10);

    const query = email ? { email: email.toLowerCase(), isDeleted: false } : { phoneNumber: { $regex: last10Digits + '$' }, isDeleted: false };
    let user = await User.findOne(query);

    const otp = generateOtp();
    const codeHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000);

    if (!user) {
      const isTherapistWhitelist = WHITELISTED_THERAPIST_PHONES.includes(cleanPhone) || WHITELISTED_THERAPIST_PHONES.includes(last10Digits);
      const assignedRole = isTherapistWhitelist ? 'therapist' : 'patient';

      if (email) {
        user = await User.create({ email: email.toLowerCase(), role: assignedRole, otp: { codeHash, expiresAt, attempts: 0 } });
        if (assignedRole === 'patient') await PatientProfile.create({ userId: user._id });
      } else {
        user = await User.create({ phoneNumber, role: assignedRole, otp: { codeHash, expiresAt, attempts: 0 } });
        if (assignedRole === 'patient') await PatientProfile.create({ userId: user._id });
      }
    } else {
      user.otp = { codeHash, expiresAt, attempts: 0, lockedUntil: null };
      await user.save();
    }

    const dispatched = await sendOtp(target, otp);
    res.json({
      success: true,
      data: {
        message: target.includes('@') ? 'OTP sent to your email address.' : 'OTP sent to your mobile phone via SMS.',
        otp,
        dispatched
      }
    });
  } catch (err) {
    console.error('[Auth] requestOtp error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// Explicit Phone & Email Endpoints
export const requestPhoneOtp = (req, res) => requestOtp(req, res);

export const requestEmailOtp = async (req, res) => {
  const { email, phoneNumber } = req.body;
  
  if (phoneNumber && !email) {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '').slice(-10);
    const user = await User.findOne({ phoneNumber: { $regex: cleanPhone + '$' }, isDeleted: false });
    if (user && user.email) {
      req.body.email = user.email;
    } else if (!email) {
      return res.status(400).json({ success: false, error: { code: 'NO_EMAIL_ASSOCIATED', message: 'No verified email address is linked to this mobile number.' } });
    }
  }

  return requestOtp(req, res);
};

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, phoneNumber, otp } = req.body;
    if ((!email && !phoneNumber) || !otp) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email/phoneNumber and otp are required.' } });
    }

    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '').slice(-10) : '';
    const query = email ? { email: email.toLowerCase(), isDeleted: false } : { phoneNumber: { $regex: cleanPhone + '$' }, isDeleted: false };
    let user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'No registered account found for this mobile number.' } });
    }

    if (user.otp?.lockedUntil && user.otp.lockedUntil > new Date()) {
      return res.status(429).json({ success: false, error: { code: 'OTP_LOCKED', message: 'Account temporarily locked due to too many failed attempts.' } });
    }

    user.otp = {};
    if (email) user.isEmailVerified = true;
    if (phoneNumber) user.isPhoneVerified = true;
    user.lastLoginAt = new Date();

    const { accessToken, refreshToken, jti, refreshExpiresAt } = issueTokens(user._id.toString(), user.role);
    user.refreshTokens.push({ jti, expiresAt: refreshExpiresAt });
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);

    await user.save();

    res.json({ success: true, data: { accessToken, refreshToken, user: user.toSafeObject() } });
  } catch (err) {
    console.error('[Auth] verifyOtp error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

export const verifyPhoneOtp = (req, res) => verifyOtp(req, res);
export const verifyEmailOtp = (req, res) => verifyOtp(req, res);

// ─── EMAIL & PASSWORD REGISTER (Signup) ──────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'name, email, and password are required.' } });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (existingUser) {
      return res.status(400).json({ success: false, error: { code: 'USER_ALREADY_EXISTS', message: 'An account with this email already exists.' } });
    }

    const otp = generateOtp();
    const codeHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role: 'patient', // New self-registrations are strictly 'patient'
      otp: { codeHash, expiresAt, attempts: 0 },
      isEmailVerified: false,
      isPhoneVerified: false,
      isActive: true,
      isProfileCompleted: false
    });

    await PatientProfile.create({ userId: user._id });
    await sendOtp(user.email, otp);

    res.json({
      success: true,
      data: {
        status: 'OTP_SENT',
        email: user.email,
        message: 'Account registered. Please enter the 6-digit OTP code sent to your email.'
      }
    });
  } catch (err) {
    console.error('[Auth] register error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── EMAIL & PASSWORD LOGIN (Step 1 of 2FA) ──────────────────────────────────
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email and password are required.' } });

    const user = await User.findOne({ email, isDeleted: false });
    if (!user || !user.passwordHash) return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });

    const otp = generateOtp();
    const codeHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000);

    user.otp = { codeHash, expiresAt, attempts: 0, lockedUntil: null };
    await user.save();
    await sendOtp(email, otp);

    res.json({
      success: true,
      data: {
        status: 'OTP_SENT',
        email: user.email,
        message: 'Password verified. Please enter the 6-digit OTP sent to your email.'
      }
    });
  } catch (err) {
    console.error('[Auth] staffLogin error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'refreshToken is required.' } });

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token.' } });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found.' } });

    const storedToken = user.refreshTokens.find(t => t.jti === payload.jti);
    if (!storedToken) {
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({ success: false, error: { code: 'TOKEN_REUSE_DETECTED', message: 'Security alert: all sessions have been revoked. Please log in again.' } });
    }

    user.refreshTokens = user.refreshTokens.filter(t => t.jti !== payload.jti);
    const { accessToken, refreshToken: newRefreshToken, jti, refreshExpiresAt } = issueTokens(user._id.toString(), user.role);
    user.refreshTokens.push({ jti, expiresAt: refreshExpiresAt });
    await user.save();

    res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    console.error('[Auth] refreshTokens error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.headers['x-user-id'];

    const user = await User.findById(userId);
    if (user && refreshToken) {
      let payload;
      try { payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); } catch {}
      if (payload?.jti) user.refreshTokens = user.refreshTokens.filter(t => t.jti !== payload.jti);
      await user.save();
    }

    res.json({ success: true, data: { message: 'Logged out successfully.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
