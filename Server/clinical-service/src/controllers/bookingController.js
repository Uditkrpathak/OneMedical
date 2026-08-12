import { v4 as uuidv4 } from 'uuid';
import Appointment from '../models/Appointment.js';
import { acquireSlotLock, releaseSlotLock } from '../utils/redis.js';
import { publishEvent } from '../utils/rabbitmq.js';

// ─── CREATE APPOINTMENT (with slot locking) ───────────────────────────────────
export const createAppointment = async (req, res) => {
  const requestId = uuidv4();
  const { therapistId, therapistProfileId, serviceType, appointmentPlace, date, startTime, endTime, durationMin } = req.body;
  const patientId = req.headers['x-user-id'];

  if (!therapistId || !date || !startTime || !endTime || !serviceType) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'therapistId, date, startTime, endTime, and serviceType are required.' } });
  }

  let lockAcquired = false;
  try {
    // Acquire distributed Redis slot lock
    lockAcquired = await acquireSlotLock(therapistId, date, startTime, requestId);
    if (!lockAcquired) {
      return res.status(409).json({ success: false, error: { code: 'SLOT_ALREADY_LOCKED', message: 'This slot is being booked by someone else. Please choose another slot.' } });
    }

    // Check if slot is already booked
    const existing = await Appointment.findOne({
      therapistId, date, startTime, isDeleted: false,
      status: { $in: ['pending_payment', 'confirmed'] },
    });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'SLOT_ALREADY_BOOKED', message: 'This slot is already booked.' } });
    }

    // Compute hold expiry
    const holdExpiresAt = new Date(Date.now() + (parseInt(process.env.APPOINTMENT_HOLD_MINUTES) || 10) * 60 * 1000);

    const appointment = await Appointment.create({
      patientId, therapistId, therapistProfileId, serviceType, appointmentPlace,
      date, startTime, endTime, durationMin: durationMin || 30,
      status: 'pending_payment', holdExpiresAt,
      createdBy: req.headers['x-user-role'] === 'patient' ? 'self' : 'admin',
    });

    res.status(201).json({ success: true, data: { appointment } });
  } catch (err) {
    console.error('[Clinical] createAppointment error:', err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  } finally {
    if (lockAcquired) await releaseSlotLock(therapistId, date, startTime, requestId);
  }
};

// ─── CONFIRM APPOINTMENT (called internally after payment) ───────────────────
export const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentTxnId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'confirmed', paymentTxnId, holdExpiresAt: null },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found.' } });

    await publishEvent('appointment.confirmed', { appointmentId: id, patientId: appointment.patientId, therapistId: appointment.therapistId });

    res.json({ success: true, data: { appointment } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── CANCEL APPOINTMENT ────────────────────────────────────────────────────────
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found.' } });

    // Only patient (own), therapist (own), or admin can cancel
    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only cancel your own appointments.' } });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = reason || '';
    await appointment.save();

    await publishEvent('appointment.cancelled', { appointmentId: id, patientId: appointment.patientId, therapistId: appointment.therapistId });

    res.json({ success: true, data: { appointment } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── COMPLETE APPOINTMENT + SESSION SUMMARY ───────────────────────────────────
export const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionSummary } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id, { status: 'completed', sessionSummary }, { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found.' } });

    await publishEvent('appointment.completed', { appointmentId: id, patientId: appointment.patientId, therapistId: appointment.therapistId });

    res.json({ success: true, data: { appointment } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET MY APPOINTMENTS ──────────────────────────────────────────────────────
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { isDeleted: false };
    if (userRole === 'patient') filter.patientId = userId;
    else if (userRole === 'therapist') filter.therapistId = userId;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [appointments, total] = await Promise.all([
      Appointment.find(filter).sort({ date: -1, startTime: -1 }).skip(skip).limit(parseInt(limit)),
      Appointment.countDocuments(filter),
    ]);

    res.json({ success: true, data: appointments, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET AVAILABLE SLOTS ──────────────────────────────────────────────────────
export const getAvailableSlots = async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'date query param is required (YYYY-MM-DD).' } });

    // Get already booked slots for that day
    const booked = await Appointment.find({
      therapistId, date, isDeleted: false,
      status: { $in: ['pending_payment', 'confirmed'] },
    }, 'startTime endTime');

    const bookedTimes = new Set(booked.map(a => a.startTime));

    res.json({ success: true, data: { date, therapistId, bookedSlots: [...bookedTimes] } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── RESCHEDULE APPOINTMENT ──────────────────────────────────────────────────
export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, date, startTime, endTime } = req.body;
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found.' } });

    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only reschedule your own appointments.' } });
    }

    const updatedDate = newDate || date || appointment.date;
    const updatedStartTime = newTime || startTime || appointment.startTime;
    const updatedEndTime = endTime || appointment.endTime;

    appointment.date = updatedDate;
    appointment.startTime = updatedStartTime;
    if (updatedEndTime) appointment.endTime = updatedEndTime;
    appointment.status = 'confirmed';
    await appointment.save();

    await publishEvent('appointment.rescheduled', {
      appointmentId: id,
      patientId: appointment.patientId,
      therapistId: appointment.therapistId,
      newDate: updatedDate,
      newStartTime: updatedStartTime,
    });

    res.json({ success: true, data: { appointment, message: 'Appointment rescheduled successfully.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── AUTO-EXPIRE HOLDS (run as cron or interval) ──────────────────────────────
export const expireHeldAppointments = async () => {
  try {
    const result = await Appointment.updateMany(
      { status: 'pending_payment', holdExpiresAt: { $lt: new Date() } },
      { status: 'cancelled', cancelReason: 'Payment hold expired — auto-cancelled.' }
    );
    if (result.modifiedCount > 0) console.log(`[Clinical] Auto-cancelled ${result.modifiedCount} held appointment(s).`);
  } catch (err) {
    console.error('[Clinical] expireHeldAppointments error:', err.message);
  }
};
