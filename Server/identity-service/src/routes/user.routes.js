import express from 'express';
import {
  getMyProfile,
  updatePatientProfile,
  updateTherapistProfile,
  listTherapists,
  getTherapistById,
  adminListUsers,
  internalGetUsersByIds,
  getSavedTherapists,
  saveTherapist,
  removeSavedTherapist,
  updateNotificationPreferences,
  requestAccountDeletion,
} from '../controllers/userController.js';

const router = express.Router();

// Authenticated user profile
router.get('/me',                        getMyProfile);
router.patch('/patients/me',             updatePatientProfile);
router.patch('/therapists/me',           updateTherapistProfile);

// Saved Specialists
router.get('/me/saved-therapists',               getSavedTherapists);
router.post('/me/saved-therapists/:therapistId', saveTherapist);
router.delete('/me/saved-therapists/:therapistId', removeSavedTherapist);

// Preferences & Lifecycle
router.patch('/me/notifications',        updateNotificationPreferences);
router.post('/me/delete-request',        requestAccountDeletion);

// Public therapist search (gateway does not require auth for GET /therapists)
router.get('/therapists',                listTherapists);
router.get('/',                          listTherapists);
router.get('/therapists/:id',            getTherapistById);

// Internal — called by other services via API key (not exposed publicly through gateway)
router.get('/internal/therapists/:id',  getTherapistById);
router.get('/internal/users',           internalGetUsersByIds);

// Admin only (role check done at gateway, double-checked here if needed)
router.get('/admin/users',               adminListUsers);

export default router;
