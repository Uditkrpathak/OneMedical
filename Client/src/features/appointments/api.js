import { resilientFetch } from '../../shared/apiClient';

export const appointmentApi = {
  getTherapists: async (token) => {
    const res = await resilientFetch(
      '/therapists',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  getAvailability: async (therapistId, date, token) => {
    const res = await resilientFetch(
      `/availability?therapistId=${therapistId}&date=${date}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  bookAppointment: async (appointmentData, token) => {
    const res = await resilientFetch(
      '/appointments',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(appointmentData)
      }
    );

    return {
      success: res.success,
      data: res.data,
      source: res.source,
      isOfflineQueued: res.isOfflineQueued,
      message: res.message,
      error: res.error
    };
  },

  getAppointments: async (token) => {
    const res = await resilientFetch(
      '/appointments',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  cancelAppointment: async (appointmentId, token) => {
    const res = await resilientFetch(
      `/appointments/${appointmentId}/cancel`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  rescheduleAppointment: async (appointmentId, newDate, newTime, token) => {
    const res = await resilientFetch(
      `/appointments/${appointmentId}/reschedule`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newDate, newTime })
      }
    );

    return { success: res.success, data: res.data, source: res.source, error: res.error };
  }
};

export default appointmentApi;
