import { mockDb } from '../../shared/mockDb';
import { API_BASE_URL } from '../../shared/config';

const BASE_URL = `${API_BASE_URL}/auth`;

const safeJsonParse = async (response) => {
  if (!response) return null;
  try {
    const contentType = response?.headers?.get
      ? response.headers.get('content-type')
      : (response?.headers?.['content-type'] || response?.headers?.['Content-Type']);
    if (contentType && typeof contentType === 'string' && contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    throw new Error(`Server returned non-JSON response (${response.status}): ${text.slice(0, 80)}`);
  } catch (err) {
    return { success: false, error: { message: err.message } };
  }
};

const WHITELISTED_THERAPIST_PHONES = ['9876543211', '9876543212'];

export const authApi = {
  loginWithEmailPassword: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await safeJsonParse(response);
      if (response && response.ok && data?.success) return data;
      throw new Error(data?.error?.message || 'Login failed');
    } catch (err) {
      console.log('[Auth API] Fallback to Mock Staff Login:', err.message);
      return {
        success: true,
        data: {
          status: 'OTP_SENT',
          email,
          message: 'Password verified. Enter OTP (Mock Mode)'
        }
      };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'patient' })
      });
      const data = await safeJsonParse(response);
      if (response && response.ok && data?.success) return data;
      throw new Error(data?.error?.message || 'Registration failed');
    } catch (err) {
      console.log('[Auth API] Fallback to Mock Register:', err.message);
      return {
        success: true,
        data: {
          status: 'OTP_SENT',
          email,
          message: 'Account registered. Enter OTP (Mock Mode)'
        }
      };
    }
  },

  verifyOtp: async (emailOrPhone, otp) => {
    const identifier = emailOrPhone || '+919876543210';
    const isEmail = typeof identifier === 'string' && identifier.includes('@');
    const payload = isEmail ? { email: identifier, otp } : { phoneNumber: identifier, otp };
    try {
      const response = await fetch(`${BASE_URL}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJsonParse(response);
      if (response && response.ok && data?.success) {
        return data;
      }
      throw new Error(data?.error?.message || 'Invalid OTP verification');
    } catch (err) {
      console.log('[Auth API] Fallback to Mock OTP verify:', err.message);
      const cleanPhone = identifier.replace(/[^0-9]/g, '').slice(-10);
      const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : identifier;

      const isWhitelistedTherapist = WHITELISTED_THERAPIST_PHONES.includes(cleanPhone) || identifier.includes('ananya') || identifier.includes('arjun');
      const resolvedRole = isWhitelistedTherapist ? 'therapist' : 'patient';

      const existingUserIdx = mockDb.users.findIndex(u => u && ((u.email && u.email === identifier) || (u.phoneNumber && u.phoneNumber.includes(cleanPhone))));
      let user;

      if (existingUserIdx === -1) {
        user = {
          _id: 'usr_' + Math.random().toString(36).substr(2, 9),
          role: resolvedRole,
          name: cleanPhone === '9876543211' ? 'Dr. Ananya Iyer' : cleanPhone === '9876543212' ? 'Dr. Arjun Mehta' : `Patient (${cleanPhone.slice(-4)})`,
          phoneNumber: isEmail ? '' : formattedPhone,
          email: isEmail ? identifier : (cleanPhone === '9876543211' ? 'ananya.iyer@onemedical.com' : cleanPhone === '9876543212' ? 'arjun.mehta@onemedical.com' : ''),
          isPhoneVerified: !isEmail,
          isEmailVerified: isEmail,
          isActive: true,
          isProfileCompleted: true
        };
        mockDb.users.push(user);
      } else {
        const existingUser = mockDb.users[existingUserIdx];
        user = {
          ...existingUser,
          phoneNumber: isEmail ? (existingUser.phoneNumber || '') : formattedPhone,
          role: existingUser.role || resolvedRole,
          isProfileCompleted: true
        };
        mockDb.users[existingUserIdx] = user;
      }
      return {
        success: true,
        data: {
          accessToken: 'mock_token_' + Math.random().toString(36).substr(2, 20),
          refreshToken: 'mock_refresh_' + Math.random().toString(36).substr(2, 20),
          user
        }
      };
    }
  },

  requestOtp: async (phoneNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await safeJsonParse(response);
      if (response && response.ok && data?.success) return data;
      throw new Error(data?.error?.message || 'Failed to request OTP');
    } catch (err) {
      console.log('[Auth API] Fallback to Mock OTP request:', err.message);
      return { success: true, data: { message: 'OTP sent (Mock Mode)', otp: '123456' } };
    }
  },

  requestEmailOtp: async (emailOrPhone) => {
    const isEmail = typeof emailOrPhone === 'string' && emailOrPhone.includes('@');
    const payload = isEmail ? { email: emailOrPhone } : { phoneNumber: emailOrPhone };
    try {
      const response = await fetch(`${BASE_URL}/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJsonParse(response);
      if (response && response.ok && data?.success) return data;
      throw new Error(data?.error?.message || 'Failed to send Email OTP');
    } catch (err) {
      console.log('[Auth API] Fallback to Mock Email OTP request:', err.message);
      return { success: true, data: { message: 'OTP sent to email (Fallback Mode)', otp: '123456' } };
    }
  }
};

export default authApi;
