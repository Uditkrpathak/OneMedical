import express from 'express';
import { createAppointment, cancelAppointment, completeAppointment, getMyAppointments, getAvailableSlots, confirmAppointment, rescheduleAppointment } from '../controllers/bookingController.js';

const router = express.Router();

// Root + Versioned Appointments
router.get('/appointments', getMyAppointments);
router.get('/appointments/my-bookings', getMyAppointments);
router.get('/appointments/therapist/schedule', getMyAppointments);
router.post('/appointments', createAppointment);

router.patch('/appointments/:id/cancel', cancelAppointment);
router.post('/appointments/:id/cancel',  cancelAppointment);
router.post('/appointments/cancel',      cancelAppointment);

router.patch('/appointments/:id/reschedule', rescheduleAppointment);
router.post('/appointments/:id/reschedule',  rescheduleAppointment);
router.post('/appointments/reschedule',      rescheduleAppointment);

router.patch('/appointments/:id/complete',   completeAppointment);
router.patch('/appointments/:id/confirm',    confirmAppointment);  // internal: called by payment/identity service

router.get('/availability/:therapistId', getAvailableSlots);

export default router;
