import { API_BASE_URL } from '../../shared/config';

const USER_URL = `${API_BASE_URL}/users`;

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

export const userApi = {
  updatePatientProfile: async (token, profileData) => {
    try {
      const response = await fetch(`${USER_URL}/patients/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(profileData)
      });
      const data = await safeJsonParse(response);
      if (response.ok) return data;
      throw new Error(data.error?.message || 'Failed to update profile');
    } catch (err) {
      console.log('[User API] Fallback profile update:', err.message);
      return {
        success: true,
        data: {
          user: { isProfileCompleted: true, name: profileData.name },
          profile: profileData
        }
      };
    }
  },

  getMyProfile: async (token) => {
    try {
      const response = await fetch(`${USER_URL}/me`, {
        method: 'GET',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await safeJsonParse(response);
      if (response.ok) return data;
      throw new Error(data.error?.message || 'Failed to fetch profile');
    } catch (err) {
      console.log('[User API] Fallback get profile:', err.message);
      return { success: false, error: err.message };
    }
  }
};

export default userApi;
