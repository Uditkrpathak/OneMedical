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

export const authApi = {
  loginWithEmailPassword: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await safeJsonParse(response);
    if (response && response.ok && data?.success) return data;
    throw new Error(data?.error?.message || data?.message || 'Login failed');
  },

  register: async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'patient' })
    });
    const data = await safeJsonParse(response);
    if (response && response.ok && data?.success) return data;
    throw new Error(data?.error?.message || data?.message || 'Registration failed');
  },

  verifyOtp: async (emailOrPhone, otp) => {
    const identifier = emailOrPhone || '+919876543210';
    const isEmail = typeof identifier === 'string' && identifier.includes('@');
    const payload = isEmail ? { email: identifier, otp } : { phoneNumber: identifier, otp };

    const response = await fetch(`${BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await safeJsonParse(response);
    if (response && response.ok && data?.success) {
      return data;
    }
    throw new Error(data?.error?.message || data?.message || 'Invalid OTP verification');
  },

  requestOtp: async (phoneNumber) => {
    const response = await fetch(`${BASE_URL}/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    const data = await safeJsonParse(response);
    if (response && response.ok && data?.success) return data;
    throw new Error(data?.error?.message || data?.message || 'Failed to request OTP');
  },

  requestEmailOtp: async (emailOrPhone) => {
    const isEmail = typeof emailOrPhone === 'string' && emailOrPhone.includes('@');
    const payload = isEmail ? { email: emailOrPhone } : { phoneNumber: emailOrPhone };

    const response = await fetch(`${BASE_URL}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await safeJsonParse(response);
    if (response && response.ok && data?.success) return data;
    throw new Error(data?.error?.message || data?.message || 'Failed to send Email OTP');
  }
};

export default authApi;
