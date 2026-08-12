import { resilientFetch } from '../../shared/apiClient';

export const clinicalApi = {
  getActiveProgram: async (token) => {
    const res = await resilientFetch(
      '/programs/my/active',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  getTodaysExercises: async (token) => {
    const res = await resilientFetch(
      '/programs/my/today',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  logSession: async (sessionData, token) => {
    const res = await resilientFetch(
      '/sessions',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(sessionData)
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

  getSessionHistory: async (token) => {
    const res = await resilientFetch(
      '/sessions',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  getPainTrend: async (patientProgramId, token) => {
    const res = await resilientFetch(
      `/sessions/pain-trend/${patientProgramId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  getAssignedPatients: async (token) => {
    const res = await resilientFetch(
      '/admin/patients',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  getExercises: async (token) => {
    const res = await resilientFetch(
      '/exercises',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: res.success, data: res.data, source: res.source, error: res.error };
  },

  prescribeProgram: async (prescriptionData, token) => {
    const res = await resilientFetch(
      `/programs/${prescriptionData.programId}/assign`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(prescriptionData)
      }
    );
    return { success: res.success, data: res.data, source: res.source, isOfflineQueued: res.isOfflineQueued, error: res.error };
  },

  submitEmergencyTriage: async (triageData, token) => {
    const res = await resilientFetch(
      '/clinical/emergency-triage',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(triageData)
      }
    );
    return { success: res.success, data: res.data, source: res.source, isOfflineQueued: res.isOfflineQueued, error: res.error };
  }
};

export default clinicalApi;
