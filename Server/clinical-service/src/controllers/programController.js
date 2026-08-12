import Program from '../models/Program.js';
import PatientProgram from '../models/PatientProgram.js';
import SessionLog from '../models/SessionLog.js';

// ─── CREATE PROGRAM ───────────────────────────────────────────────────────────
export const createProgram = async (req, res) => {
  try {
    const therapistId = req.headers['x-user-id'];
    const { title, description, targetCondition, durationWeeks, difficulty, exercises, isTemplate } = req.body;
    if (!title || !targetCondition) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'title and targetCondition are required.' } });

    const program = await Program.create({ title, description, targetCondition, durationWeeks, difficulty, exercises: exercises || [], isTemplate: isTemplate || false, createdBy: therapistId });
    res.status(201).json({ success: true, data: { program } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── LIST MY PROGRAMS ─────────────────────────────────────────────────────────
export const listPrograms = async (req, res) => {
  try {
    const therapistId = req.headers['x-user-id'];
    const { page = 1, limit = 20, targetCondition } = req.query;
    const filter = { createdBy: therapistId, isDeleted: false };
    if (targetCondition) filter.targetCondition = new RegExp(targetCondition, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [programs, total] = await Promise.all([
      Program.find(filter).skip(skip).limit(parseInt(limit)).lean(),
      Program.countDocuments(filter),
    ]);
    res.json({ success: true, data: programs, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── ASSIGN PROGRAM TO PATIENT ────────────────────────────────────────────────
export const assignProgram = async (req, res) => {
  try {
    const therapistId = req.headers['x-user-id'];
    const { programId } = req.params;
    const { patientId, startDate, milestones, exerciseOverrides, activityRestrictions, patientGoals, appointmentId } = req.body;

    if (!patientId) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'patientId is required.' } });

    const program = await Program.findById(programId);
    if (!program || program.isDeleted) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Program not found.' } });

    const assignment = await PatientProgram.create({
      patientId, programId, assignedBy: therapistId, appointmentId,
      startDate: startDate ? new Date(startDate) : new Date(),
      milestones: milestones || [],
      exerciseOverrides: exerciseOverrides || [],
      activityRestrictions, patientGoals,
    });

    res.status(201).json({ success: true, data: { assignment } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET PATIENT'S ACTIVE PROGRAM ────────────────────────────────────────────
export const getMyActiveProgram = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'] || 'usr_pat1';
    let assignment = await PatientProgram.findOne({ patientId, status: 'active', isDeleted: false })
      .populate({ path: 'programId', populate: { path: 'exercises.exerciseId' } })
      .lean();

    if (!assignment) {
      let defaultTemplate = await Program.findOne({ isTemplate: true });
      if (!defaultTemplate) {
        defaultTemplate = await Program.create({
          title: 'Lower Back & Spine Recovery Program',
          description: 'Comprehensive rehabilitation program for lumbar stability and posture alignment.',
          targetCondition: 'Lower Back Pain',
          durationWeeks: 6,
          difficulty: 'Intermediate',
          isTemplate: true,
          exercises: [],
        });
      }

      const sessionCount = await SessionLog.countDocuments({ patientId });
      const initialScore = sessionCount > 0 ? Math.min(100, 25 + sessionCount * 20) : 25;
      const initialAdherence = sessionCount > 0 ? Math.min(100, 30 + sessionCount * 20) : 50;

      const newAssignment = await PatientProgram.create({
        patientId,
        programId: defaultTemplate._id,
        assignedBy: 'system',
        startDate: new Date(),
        status: 'active',
        recoveryScore: initialScore,
        adherencePercent: initialAdherence,
        painTrendScore: 70,
        milestoneScore: 80,
        patientGoals: 'Establish baseline mobility & strength',
        milestones: [
          { title: 'Reduce pain level below 5/10', achieved: true },
          { title: 'Gain 90 deg range of motion', achieved: true },
          { title: 'Perform daily exercises consistently', achieved: false },
        ],
      });

      assignment = await PatientProgram.findById(newAssignment._id).populate('programId').lean();
    }

    res.json({ success: true, data: { assignment } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET TODAY'S EXERCISES ────────────────────────────────────────────────────
export const getTodaysExercises = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun

    const assignment = await PatientProgram.findOne({ patientId, status: 'active', isDeleted: false })
      .populate({ path: 'programId' })
      .lean();

    if (!assignment) return res.json({ success: true, data: { exercises: [], message: 'No active program.' } });

    const program = assignment.programId;
    const daysElapsed = Math.floor((today - new Date(assignment.startDate)) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(daysElapsed / 7) + 1;

    // Filter exercises for today's day and current week
    const todaysExercises = (program.exercises || []).filter(ex =>
      ex.dayOfWeek === dayOfWeek && ex.weekNumber === currentWeek
    );

    // Apply per-patient overrides
    const overrideMap = {};
    (assignment.exerciseOverrides || []).forEach(o => {
      overrideMap[o.exerciseId.toString()] = o;
    });

    const enriched = await Promise.all(todaysExercises.map(async (ex) => {
      const override = overrideMap[ex.exerciseId?.toString()] || {};
      return {
        ...ex,
        sets:        override.sets        || ex.sets,
        reps:        override.reps        || ex.reps,
        durationSec: override.durationSec || ex.durationSec,
        notes:       override.notes       || ex.notes,
      };
    }));

    res.json({ success: true, data: { patientProgramId: assignment._id, exercises: enriched, recoveryScore: assignment.recoveryScore } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── UPDATE PROGRAM STATUS ────────────────────────────────────────────────────
export const updateProgramStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const assignment = await PatientProgram.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, data: { assignment } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET ASSIGNED PATIENTS FOR THERAPIST ──────────────────────────────────────
export const getAssignedPatients = async (req, res) => {
  try {
    const therapistId = req.headers['x-user-id'];
    const activePrograms = await PatientProgram.find({ assignedBy: therapistId, status: 'active', isDeleted: false }).lean();
    
    // Fetch patient names and phone numbers from identity service
    const patientIds = activePrograms.map(ap => ap.patientId);
    
    let usersMap = {};
    if (patientIds.length > 0) {
      try {
        const response = await fetch(`http://localhost:5001/internal/users?ids=${patientIds.join(',')}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            resData.data.forEach(u => {
              usersMap[u._id.toString()] = u;
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch patient users:', err.message);
      }
    }

    const patients = activePrograms.map(ap => {
      const u = usersMap[ap.patientId] || {};
      return {
        userId: ap.patientId,
        name: u.name || 'New Patient',
        phoneNumber: u.phoneNumber || '+91 99999 99999',
        activeProgramName: ap.patientGoals || 'Lumbar Spine Rehab',
        recoveryScore: ap.recoveryScore || 0,
        painLevelCurrent: ap.painTrendScore || 0,
        lastSessionDate: ap.updatedAt ? new Date(ap.updatedAt).toISOString().split('T')[0] : 'N/A'
      };
    });

    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
