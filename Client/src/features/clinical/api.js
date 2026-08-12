import { resilientFetch } from '../../shared/apiClient';
import { mockDb } from '../../shared/mockDb';

export const clinicalApi = {
  getActiveProgram: async (token) => {
    const res = await resilientFetch(
      '/programs/my/active',
      { headers: { Authorization: `Bearer ${token}` } },
      () => mockDb.activePrograms?.['usr_pat1'] || null
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  getTodaysExercises: async (token) => {
    const mockFn = () => {
      const activeProg = mockDb.activePrograms?.['usr_pat1'];
      return activeProg ? activeProg.exerciseOverrides : [];
    };

    const res = await resilientFetch(
      '/programs/my/today',
      { headers: { Authorization: `Bearer ${token}` } },
      mockFn
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  logSession: async (sessionData, token) => {
    const mockFn = () => {
      const newLog = {
        _id: 'log_' + Math.random().toString(36).substr(2, 9),
        patientId: 'usr_pat1',
        patientProgramId: sessionData.patientProgramId,
        sessionLogId: sessionData.sessionLogId || 'key_' + Math.random().toString(36).substr(2, 9),
        date: sessionData.date,
        painLevel: sessionData.painLevel,
        exercisesCompleted: sessionData.exercisesCompleted,
        completedOffline: sessionData.completedOffline || false,
        createdAt: new Date().toISOString()
      };
      if (mockDb.sessionLogs) mockDb.sessionLogs.unshift(newLog);

      const activeProg = mockDb.activePrograms?.['usr_pat1'];
      if (activeProg && mockDb.activePrograms) {
        const adherenceInc = Math.min(100, (activeProg.adherencePercent || 80) + 2);
        const painScore = Math.max(0, 100 - sessionData.painLevel * 10);
        const newPainTrendScore = Math.round(((activeProg.painTrendScore || 70) + painScore) / 2);
        const newRecoveryScore = Math.round(
          adherenceInc * 0.5 +
          newPainTrendScore * 0.3 +
          (activeProg.milestoneScore || 80) * 0.2
        );
        mockDb.activePrograms['usr_pat1'] = {
          ...activeProg,
          adherencePercent: adherenceInc,
          painTrendScore: newPainTrendScore,
          recoveryScore: newRecoveryScore
        };
      }
      return newLog;
    };

    const res = await resilientFetch(
      '/sessions',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(sessionData)
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

  getSessionHistory: async (token) => {
    const res = await resilientFetch(
      '/sessions',
      { headers: { Authorization: `Bearer ${token}` } },
      () => mockDb.sessionLogs
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  getPainTrend: async (patientProgramId, token) => {
    const mockFn = () =>
      mockDb.sessionLogs
        .filter(log => log.patientProgramId === patientProgramId)
        .map(log => ({ date: log.date, painLevel: log.painLevel }))
        .reverse();

    const res = await resilientFetch(
      `/sessions/pain-trend/${patientProgramId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      mockFn
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  getAssignedPatients: async (token) => {
    const mockFn = () => [
      {
        userId: 'usr_pat1',
        name: 'John Doe',
        phoneNumber: '+919999999999',
        activeProgramName: 'Lumbar Spine Rehab',
        recoveryScore: 78,
        painLevelCurrent: 6,
        lastSessionDate: '2026-08-05'
      },
      {
        userId: 'usr_pat2',
        name: 'Alice Johnson',
        phoneNumber: '+919999999988',
        activeProgramName: 'Knee Osteoarthritis Rehab',
        recoveryScore: 54,
        painLevelCurrent: 8,
        lastSessionDate: '2026-08-06'
      }
    ];

    const res = await resilientFetch(
      '/admin/patients',
      { headers: { Authorization: `Bearer ${token}` } },
      mockFn
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  getExercises: async (token) => {
    const mockFn = () => [
      { _id: 'ex1', name: 'Lumbar Extension Stretch', category: 'Stretching', defaultSets: 3, defaultReps: 10, defaultDurationSec: 30 },
      { _id: 'ex2', name: 'Knee-to-Chest Lumbar Flexion', category: 'Stretching', defaultSets: 3, defaultReps: 12, defaultDurationSec: 20 },
      { _id: 'ex3', name: 'Plank Hold Core Stabilization', category: 'Strengthening', defaultSets: 3, defaultReps: 1, defaultDurationSec: 60 },
      { _id: 'ex4', name: 'Wall Squats Lower Body', category: 'Strengthening', defaultSets: 3, defaultReps: 10, defaultDurationSec: 0 }
    ];

    const res = await resilientFetch(
      '/exercises',
      { headers: { Authorization: `Bearer ${token}` } },
      mockFn
    );
    return { success: res.success, data: res.data, source: res.source };
  },

  prescribeProgram: async (prescriptionData, token) => {
    const mockFn = () => {
      const overrides = prescriptionData.exerciseOverrides.map(override => ({
        exerciseId: override.exerciseId,
        name: override.name || 'Custom Exercise',
        sets: override.sets,
        reps: override.reps,
        durationSec: override.durationSec,
        notes: override.notes || ''
      }));
      const newProgram = {
        _id: 'prog_' + Math.random().toString(36).substr(2, 9),
        patientId: prescriptionData.patientId,
        assignedBy: 'usr_ther1',
        therapistName: 'Dr. Jane Smith',
        startDate: prescriptionData.startDate || new Date().toISOString(),
        status: 'active',
        recoveryScore: 0,
        adherencePercent: 0,
        painTrendScore: 0,
        milestoneScore: 0,
        milestones: [
          { title: 'Baseline assessment', achieved: true },
          { title: 'Adherence threshold >50%', achieved: false }
        ],
        exerciseOverrides: overrides
      };
      if (!mockDb.activePrograms) mockDb.activePrograms = {};
      mockDb.activePrograms[prescriptionData.patientId] = newProgram;
      return { patientProgram: newProgram };
    };

    const res = await resilientFetch(
      `/programs/${prescriptionData.programId}/assign`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(prescriptionData)
      },
      mockFn
    );
    return { success: res.success, data: res.data, source: res.source, isOfflineQueued: res.isOfflineQueued };
  },

  submitEmergencyTriage: async (triageData, token) => {
    const mockFn = () => ({
      triageId: 'tri_' + Math.random().toString(36).substr(2, 8),
      urgency: triageData.painScale >= 8 ? 'HIGH' : 'MEDIUM',
      recommendedAction: 'Immediate Specialist Tele-Consultation Assigned',
      assignedDoctor: 'Dr. Ananya Iyer',
      timestamp: new Date().toISOString()
    });

    const res = await resilientFetch(
      '/clinical/emergency-triage',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(triageData)
      },
      mockFn
    );
    return { success: res.success, data: res.data, source: res.source, isOfflineQueued: res.isOfflineQueued };
  }
};

export default clinicalApi;
