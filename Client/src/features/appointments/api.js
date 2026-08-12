import { resilientFetch } from '../../shared/apiClient';
import { mockDb } from '../../shared/mockDb';

export const appointmentApi = {
  getTherapists: async (token) => {
    const res = await resilientFetch(
      '/therapists',
      { headers: { Authorization: `Bearer ${token}` } },
      () => mockDb.therapists
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  getAvailability: async (therapistId, date, token) => {
    const defaultSlots = [
      { startTime: '09:00', endTime: '09:30', isAvailable: true },
      { startTime: '09:30', endTime: '10:00', isAvailable: true },
      { startTime: '10:00', endTime: '10:30', isAvailable: false },
      { startTime: '10:30', endTime: '11:00', isAvailable: true },
      { startTime: '11:00', endTime: '11:30', isAvailable: true },
      { startTime: '14:00', endTime: '14:30', isAvailable: true },
      { startTime: '14:30', endTime: '15:00', isAvailable: true }
    ];

    const res = await resilientFetch(
      `/availability?therapistId=${therapistId}&date=${date}`,
      { headers: { Authorization: `Bearer ${token}` } },
      () => defaultSlots
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  bookAppointment: async (appointmentData, token) => {
    const mockFn = () => {
      const therapist = mockDb.therapists.find(t => t.userId === appointmentData.therapistId) || mockDb.therapists[0];
      const newAppt = {
        _id: 'appt_' + Math.random().toString(36).substr(2, 9),
        appointmentId: 'appt_' + Math.random().toString(36).substr(2, 9),
        patientId: 'usr_pat1',
        therapistId: appointmentData.therapistId,
        therapistName: therapist?.name || 'Dr. Jane Smith',
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        serviceType: appointmentData.serviceType,
        status: 'held',
        paymentStatus: 'pending'
      };
      mockDb.appointments.unshift(newAppt);
      return { appointment: newAppt };
    };

    const res = await resilientFetch(
      '/appointments',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(appointmentData)
      },
      mockFn
    );

    return {
      success: res.success,
      data: res.data,
      source: res.source,
      isOfflineQueued: res.isOfflineQueued,
      message: res.message
    };
  },

  getAppointments: async (token) => {
    const res = await resilientFetch(
      '/appointments',
      { headers: { Authorization: `Bearer ${token}` } },
      () => mockDb.appointments
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  cancelAppointment: async (appointmentId, token) => {
    const mockFn = () => {
      const appt = mockDb.appointments.find(a => a._id === appointmentId || a.appointmentId === appointmentId);
      if (appt) appt.status = 'cancelled';
      return { cancelled: true, appointmentId };
    };

    const res = await resilientFetch(
      `/appointments/${appointmentId}/cancel`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      },
      mockFn
    );

    return { success: res.success, data: res.data, source: res.source };
  },

  rescheduleAppointment: async (appointmentId, newDate, newTime, token) => {
    const mockFn = () => {
      const appt = mockDb.appointments.find(a => a._id === appointmentId || a.appointmentId === appointmentId);
      if (appt) {
        appt.date = newDate;
        appt.startTime = newTime;
      }
      return { rescheduled: true, appointmentId, newDate, newTime };
    };

    const res = await resilientFetch(
      `/appointments/${appointmentId}/reschedule`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newDate, newTime })
      },
      mockFn
    );

    return { success: res.success, data: res.data, source: res.source };
  }
};

export default appointmentApi;
