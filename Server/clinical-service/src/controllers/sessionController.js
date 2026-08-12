import SessionLog from '../models/SessionLog.js';
import PatientProgram from '../models/PatientProgram.js';
import { recalculateRecoveryScore, checkPainAlert } from '../utils/recoveryEngine.js';
import { publishEvent } from '../utils/rabbitmq.js';

// ─── LOG SESSION ──────────────────────────────────────────────────────────────
export const logSession = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'] || req.body.userId || 'usr_pat1';
    const { patientProgramId, sessionLogId, date, exercisesCompleted, painLevel, notes, completedOffline } = req.body;

    let activeProgram = null;
    if (targetProgramId) {
      activeProgram = await PatientProgram.findById(targetProgramId);
    } else {
      activeProgram = await PatientProgram.findOne({ patientId, status: 'active' });
    }

    if (activeProgram) {
      targetProgramId = activeProgram._id;
      prevScore = activeProgram.recoveryScore || 0;
    }

    if (sessionLogId) {
      const existing = await SessionLog.findOne({ sessionLogId });
      if (existing) {
        return res.json({
          success: true,
          message: 'Session already logged (idempotent)',
          sessionId: existing._id,
          recoveryScore: prevScore,
          previousRecoveryScore: prevScore,
          adherencePercent: 100,
          streak: 1,
          exercisesCompletedToday: 1,
        });
      }
    }

    const session = await SessionLog.create({
      patientId,
      patientProgramId: targetProgramId || undefined,
      sessionLogId,
      completedOffline: completedOffline || false,
      date: date || new Date().toISOString().slice(0, 10),
      exercisesCompleted: exercisesCompleted || [],
      painLevel: painLevel !== undefined ? painLevel : 2,
      notes,
    });

    const totalLogs = await SessionLog.countDocuments({ patientId });
    const computedScore = Math.min(100, 25 + totalLogs * 15);
    const computedAdherence = Math.min(100, 30 + totalLogs * 20);

    if (activeProgram) {
      await PatientProgram.findByIdAndUpdate(activeProgram._id, {
        recoveryScore: computedScore,
        adherencePercent: computedAdherence,
      });
    }

    let scores = { recoveryScore: computedScore, adherencePercent: computedAdherence };
    if (targetProgramId) {
      const calcResult = await recalculateRecoveryScore(targetProgramId);
      if (calcResult && calcResult.recoveryScore > 0) scores = calcResult;
    }

    if (targetProgramId) {
      const shouldAlert = await checkPainAlert(targetProgramId);
      if (shouldAlert) {
        await publishEvent('clinical.alert', {
          patientId,
          patientProgramId: targetProgramId,
          painLevel,
          message: `Patient pain level is ${painLevel}/10 for consecutive sessions.`,
        });
      }
    }

    const currentScore = scores?.recoveryScore ?? 25;
    const adherence = scores?.adherencePercent ?? 100;
    const streakVal = 1;
    const exCount = Array.isArray(exercisesCompleted) ? exercisesCompleted.length : (exercisesCompleted || 1);

    res.status(201).json({
      success: true,
      message: 'Session logged successfully',
      sessionId: session._id,
      recoveryScore: currentScore,
      previousRecoveryScore: prevScore,
      adherencePercent: adherence,
      streak: streakVal,
      exercisesCompletedToday: exCount,
      data: { session, scores },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET SESSION HISTORY ──────────────────────────────────────────────────────
export const getSessionHistory = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'] || req.query.userId || 'usr_pat1';
    const userRole  = req.headers['x-user-role'];
    const { patientProgramId, page = 1, limit = 50, offset = 0 } = req.query;

    const filter = { isDeleted: false };
    if (userRole === 'patient' || !userRole) filter.patientId = patientId;
    if (patientProgramId) filter.patientProgramId = patientProgramId;

    const effectiveSkip = offset ? parseInt(offset) : (parseInt(page) - 1) * parseInt(limit);
    const [sessions, total] = await Promise.all([
      SessionLog.find(filter).sort({ date: -1 }).skip(effectiveSkip).limit(parseInt(limit)).lean(),
      SessionLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      sessions,
      data: sessions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: effectiveSkip,
        hasMore: effectiveSkip + sessions.length < total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET SESSION BY ID ────────────────────────────────────────────────────────
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await SessionLog.findById(id).lean();
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── UPDATE SESSION ───────────────────────────────────────────────────────────
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await SessionLog.findByIdAndUpdate(id, req.body, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session updated successfully', session });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── DELETE SESSION ───────────────────────────────────────────────────────────
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await SessionLog.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET PAIN TREND ───────────────────────────────────────────────────────────
export const getPainTrend = async (req, res) => {
  try {
    const { patientProgramId } = req.params;
    const logs = await SessionLog.find({ patientProgramId }).sort({ date: 1 }).select('date painLevel').lean();
    res.json({ success: true, data: { trend: logs.map(l => ({ date: l.date, painLevel: l.painLevel })) } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
