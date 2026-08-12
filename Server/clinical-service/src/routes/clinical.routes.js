import express from 'express';
import { createExercise, listExercises, getExerciseById, updateExercise, deleteExercise } from '../controllers/exerciseController.js';
import { createProgram, listPrograms, assignProgram, getMyActiveProgram, getTodaysExercises, updateProgramStatus, getAssignedPatients } from '../controllers/programController.js';
import { logSession, getSessionHistory, getSessionById, updateSession, deleteSession, getPainTrend } from '../controllers/sessionController.js';
import { listMedicalRecords, createMedicalRecord, getMedicalRecordById, updateMedicalRecord, deleteMedicalRecord, getRecordsByPatient } from '../controllers/medicalRecordController.js';

const router = express.Router();

// ── SESSIONS (Root + Versioned + Root Aliases) ──────────────────────────────
router.post('/sessions',                              logSession);
router.post('/',                                      logSession);
router.get('/sessions',                               getSessionHistory);
router.get('/',                                       getSessionHistory);
router.get('/sessions/pain-trend/:patientProgramId',  getPainTrend);
router.get('/sessions/:id',                           getSessionById);
router.patch('/sessions/:id',                         updateSession);
router.delete('/sessions/:id',                        deleteSession);

router.post('/api/v1/sessions',                       logSession);
router.get('/api/v1/sessions',                        getSessionHistory);
router.get('/api/v1/sessions/pain-trend/:patientProgramId', getPainTrend);

// ── PROGRAMS & TODAY'S EXERCISES ─────────────────────────────────────────────
router.get('/programs/my/active',                     getMyActiveProgram);
router.get('/my/active',                              getMyActiveProgram);
router.get('/programs/my/today',                      getTodaysExercises);
router.get('/my/today',                               getTodaysExercises);

router.get('/programs',                               listPrograms);
router.post('/programs',                              createProgram);
router.post('/programs/:programId/assign',            assignProgram);
router.patch('/programs/:id/status',                  updateProgramStatus);

router.get('/api/v1/programs/my/active',              getMyActiveProgram);
router.get('/api/v1/programs/my/today',               getTodaysExercises);
router.get('/api/v1/programs',                        listPrograms);

// ── EXERCISES ─────────────────────────────────────────────────────────────────
router.get('/exercises',                              listExercises);
router.post('/exercises',                             createExercise);
router.get('/exercises/:id',                          getExerciseById);
router.patch('/exercises/:id',                        updateExercise);
router.delete('/exercises/:id',                       deleteExercise);

router.get('/api/v1/exercises',                       listExercises);
router.post('/api/v1/exercises',                      createExercise);

// ── MEDICAL RECORDS ───────────────────────────────────────────────────────────
router.get('/medical-records',                        listMedicalRecords);
router.post('/medical-records',                       createMedicalRecord);
router.get('/medical-records/patient/:patientId',     getRecordsByPatient);
router.get('/medical-records/:id',                    getMedicalRecordById);
router.patch('/medical-records/:id',                  updateMedicalRecord);
router.delete('/medical-records/:id',                 deleteMedicalRecord);

router.get('/api/v1/medical-records',                 listMedicalRecords);
router.post('/api/v1/medical-records',                createMedicalRecord);

// ── THERAPIST ADMIN VIEWS ─────────────────────────────────────────────────────
router.get('/admin/patients',                         getAssignedPatients);
router.get('/patients/assigned',                      getAssignedPatients);

// Service Root Info
router.get('/', (req, res) => {
  res.json({ service: 'clinical-service', version: '1.0.0', status: 'healthy' });
});

export default router;
