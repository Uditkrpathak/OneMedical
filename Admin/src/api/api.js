const BASE_URL = '/api/v1';

// Initial Mock Datasets as graceful fallback if server API is offline
const MOCK_PATIENTS = [
  { _id: 'PT-1024', id: 'PT-1024', name: 'Sanya Malhotra', phoneNumber: '+91 98765 43210', email: 'sanya@example.com', role: 'patient', isActive: true, condition: 'ACL Recovery · Phase 2', progress: 78, lastSession: 'Oct 12, 2023', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { _id: 'PT-1021', id: 'PT-1021', name: 'Marcus Thorne', phoneNumber: '+91 98765 43211', email: 'marcus@example.com', role: 'patient', isActive: true, condition: 'Lumbar Spine', progress: 48, lastSession: 'Oct 05, 2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { _id: 'PT-1023', id: 'PT-1023', name: 'Rahul Verma', phoneNumber: '+91 98765 43212', email: 'rahul@example.com', role: 'patient', isActive: true, condition: 'Lower Back Pain', progress: 40, lastSession: 'Oct 10, 2023', avatar: null },
  { _id: 'PT-1022', id: 'PT-1022', name: 'Priya Singh', phoneNumber: '+91 98765 43213', email: 'priya@example.com', role: 'patient', isActive: true, condition: 'Frozen Shoulder', progress: 82, lastSession: 'Sep 28, 2023', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
];

const MOCK_THERAPISTS = [
  { _id: 'th-001', id: 'th-001', name: 'Dr. Ankur Mehta', title: 'Sports Physiotherapist · 12 Years Exp', specialization: 'Orthopedics & Spine', experienceYears: 12, rating: 4.9, availability: 'Available Today', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100', totalRevenue: 180000, activePatients: 18 },
  { _id: 'th-002', id: 'th-002', name: 'Dr. Ananya Iyer', title: 'Senior MPT Physiotherapist · 8 Years Exp', specialization: 'Sports Injury & Knees', experienceYears: 8, rating: 4.9, availability: 'Available Tomorrow', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', totalRevenue: 142000, activePatients: 14 },
  { _id: 'th-003', id: 'th-003', name: 'Dr. Priya Sharma', title: 'Neurological Specialist · 10 Years Exp', specialization: 'Neurological Physio', experienceYears: 10, rating: 4.8, availability: 'Available Wednesday', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100', totalRevenue: 165000, activePatients: 12 },
];

const MOCK_APPOINTMENTS = [
  { _id: 'a_101', id: 'APT-1024', patientName: 'Arjun Reddy', therapistName: 'Dr. Priya Sharma', date: 'Oct 24, 2023', timeSlot: '10:00 AM', mode: 'Chamber Visit', serviceType: 'Physiotherapy', status: 'CONFIRMED' },
  { _id: 'a_102', id: 'APT-1025', patientName: 'Sanya Malhotra', therapistName: 'Dr. Rohan Bose', date: 'Oct 24, 2023', timeSlot: '02:00 PM', mode: 'Online Visit', serviceType: 'Spine Rehab', status: 'PENDING' },
  { _id: 'a_103', id: 'APT-1026', patientName: 'Kabir Singh', therapistName: 'Dr. Ananya Iyer', date: 'Oct 25, 2023', timeSlot: '11:30 AM', mode: 'Home Visit', serviceType: 'Knee Rehab', status: 'COMPLETED' },
];

const MOCK_EXERCISES = [
  { _id: 'e1', name: 'Pelvic Tilts', tag: 'MOBILITY', duration: '5 mins', equipment: 'Yoga Mat', usedIn: '11 Programs', liked: true, thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', desc: 'Core activation and low-back pelvic tilting.' },
  { _id: 'e2', name: 'Knee-to-Chest', tag: 'MOBILITY', duration: '6 mins', equipment: 'Yoga Mat', usedIn: '8 Programs', liked: false, thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', desc: 'Gently stretch the lower back and gluteal muscles.' },
  { _id: 'e3', name: 'Cat-Cow', tag: 'MOBILITY', duration: '5 mins', equipment: 'Yoga Mat', usedIn: '5 Programs', liked: false, thumb: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400', desc: 'Spinal articulation and rhythmic pelvic motion.' },
];

const MOCK_PROGRAMS = [
  { _id: 'pr_1', title: 'Post-ACL Recovery', tag: 'KNEE RECOVERY', desc: 'Comprehensive 12-week structured knee rehabilitation protocol.', duration: '12 Weeks', difficulty: 'Intermediate', activePatients: 428, completion: '82%', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
  { _id: 'pr_2', title: 'Lower Back Stability', tag: 'SPINE REHAB', desc: 'Core strengthening and postural alignment focus for lumbar relief.', duration: '8 Weeks', difficulty: 'Beginner', activePatients: 184, completion: '90%', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400' },
  { _id: 'pr_3', title: 'Cervical Mobility', tag: 'NECK REHAB', desc: 'Targeted exercises for chronic neck pain and postural strain.', duration: '4 Weeks', difficulty: 'Beginner', activePatients: 154, completion: '84%', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400' },
];

const MOCK_PAYMENTS = [
  { _id: 'tx_101', patientName: 'Sanya Malhotra', therapistName: 'Dr. Ankur Mehta', type: 'Session Fee', amount: '₹1,200', date: 'Oct 24, 2023', method: 'UPI / GPay', status: 'PAID' },
  { _id: 'tx_102', patientName: 'Arjun Reddy', therapistName: 'Dr. Priya Sharma', type: 'Package Renewal', amount: '₹4,500', date: 'Oct 23, 2023', method: 'Credit Card', status: 'PAID' },
  { _id: 'tx_103', patientName: 'Marcus Thorne', therapistName: 'Dr. Rohan Bose', type: 'Home Visit Surcharge', amount: '₹1,800', date: 'Oct 22, 2023', method: 'Insurance Direct', status: 'PENDING' },
];

const request = async (path, options = {}, token = null) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API Fallback] ${path} -> using mock dataset (${err.message})`);
    if (path.includes('/users/patients') || path.includes('/patients') || path.includes('/admin/users')) {
      return { data: MOCK_PATIENTS, meta: { total: MOCK_PATIENTS.length, page: 1 } };
    }
    if (path.includes('/therapists')) {
      return { data: MOCK_THERAPISTS, meta: { total: MOCK_THERAPISTS.length, page: 1 } };
    }
    if (path.includes('/appointments')) {
      return { data: MOCK_APPOINTMENTS, meta: { total: MOCK_APPOINTMENTS.length, page: 1 } };
    }
    if (path.includes('/exercises')) {
      return { data: MOCK_EXERCISES, meta: { total: MOCK_EXERCISES.length, page: 1 } };
    }
    if (path.includes('/programs')) {
      return { data: MOCK_PROGRAMS, meta: { total: MOCK_PROGRAMS.length, page: 1 } };
    }
    if (path.includes('/payments') || path.includes('/invoices') || path.includes('/payouts')) {
      return { data: MOCK_PAYMENTS, meta: { total: MOCK_PAYMENTS.length, page: 1 } };
    }
    return { data: [], meta: { total: 0, page: 1 } };
  }
};

export const api = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  requestOtp: (body)          => request('/auth/otp/request', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp:  (body)          => request('/auth/otp/verify', { method: 'POST', body: JSON.stringify(body) }),
  login:      (body)          => request('/auth/otp/verify', { method: 'POST', body: JSON.stringify(body) }),
  me:         (token)         => request('/users/me', {}, token),

  // ── Patients & System Users ──────────────────────────────────────────────────
  listUsers:       (token, params = {}) => request(`/admin/users?${new URLSearchParams(params)}`, {}, token),
  listPatients:    (token, params = {}) => request(`/users/patients?${new URLSearchParams(params)}`, {}, token),
  getPatientDetail:(token, id)          => request(`/users/patients/${id}`, {}, token),
  createPatient:   (token, body)        => request('/users/patients', { method: 'POST', body: JSON.stringify(body) }, token),

  // ── Therapists ───────────────────────────────────────────────────────────────
  listTherapists:  (token, params = {}) => request(`/therapists?${new URLSearchParams(params)}`, {}, token),
  getTherapist:    (token, id)          => request(`/therapists/${id}`, {}, token),
  createTherapist: (token, body)        => request('/therapists', { method: 'POST', body: JSON.stringify(body) }, token),
  verifyTherapist: (token, id, body)    => request(`/therapists/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),

  // ── Appointments & Schedules ─────────────────────────────────────────────────
  listAppointments:      (token, params = {}) => request(`/appointments?${new URLSearchParams(params)}`, {}, token),
  getAppointmentDetail:  (token, id)          => request(`/appointments/${id}`, {}, token),
  createAppointment:     (token, body)        => request('/appointments', { method: 'POST', body: JSON.stringify(body) }, token),
  rescheduleAppointment: (token, id, body)    => request(`/appointments/${id}/reschedule`, { method: 'PATCH', body: JSON.stringify(body) }, token),
  sendReminder:          (token, id, body)    => request(`/appointments/${id}/reminder`, { method: 'POST', body: JSON.stringify(body) }, token),
  saveSessionSummary:    (token, id, body)    => request(`/appointments/${id}/session-summary`, { method: 'POST', body: JSON.stringify(body) }, token),
  cancelAppointment:     (token, id, body)    => request(`/appointments/${id}/cancel`, { method: 'PATCH', body: JSON.stringify(body) }, token),

  // ── Exercises ────────────────────────────────────────────────────────────────
  listExercises:  (token, params = {}) => request(`/exercises?${new URLSearchParams(params)}`, {}, token),
  createExercise: (token, body)        => request('/exercises', { method: 'POST', body: JSON.stringify(body) }, token),
  deleteExercise: (token, id)          => request(`/exercises/${id}`, { method: 'DELETE' }, token),

  // ── Rehabilitation Programs ──────────────────────────────────────────────────
  listPrograms:       (token, params = {}) => request(`/programs?${new URLSearchParams(params)}`, {}, token),
  getProgramDetail:   (token, id)          => request(`/programs/${id}`, {}, token),
  createProgram:      (token, body)        => request('/programs', { method: 'POST', body: JSON.stringify(body) }, token),
  updateProgram:      (token, id, body)    => request(`/programs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),
  deleteProgram:      (token, id)          => request(`/programs/${id}`, { method: 'DELETE' }, token),
  assignPatientToProgram: (token, id, body) => request(`/programs/${id}/assign`, { method: 'POST', body: JSON.stringify(body) }, token),
  getProgramOutcomes: (token, id)          => request(`/programs/${id}/outcomes`, {}, token),
  getProgramVersions: (token, id)          => request(`/programs/${id}/versions`, {}, token),

  // ── Appointments — extended ──────────────────────────────────────────────────
  updateAppointment:  (token, id, body)    => request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),
  deleteAppointment:  (token, id)          => request(`/appointments/${id}`, { method: 'DELETE' }, token),

  // ── Patients — extended ──────────────────────────────────────────────────────
  updatePatient:      (token, id, body)    => request(`/users/patients/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),
  deletePatient:      (token, id)          => request(`/users/patients/${id}`, { method: 'DELETE' }, token),

  // ── Therapists — extended ────────────────────────────────────────────────────
  updateTherapist:    (token, id, body)    => request(`/therapists/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),
  deleteTherapist:    (token, id)          => request(`/therapists/${id}`, { method: 'DELETE' }, token),
  getTherapistSlots:  (token, id, date)    => request(`/therapists/${id}/slots?date=${date}`, {}, token),

  // ── Payments & Financials ────────────────────────────────────────────────────
  listPayments:       (token, params = {}) => request(`/payments?${new URLSearchParams(params)}`, {}, token),
  listInvoices:       (token, params = {}) => request(`/payments/invoices?${new URLSearchParams(params)}`, {}, token),
  listPayouts:        (token, params = {}) => request(`/payments/payouts?${new URLSearchParams(params)}`, {}, token),
  listRefunds:        (token, params = {}) => request(`/payments/refunds?${new URLSearchParams(params)}`, {}, token),
  createInvoice:      (token, body)        => request('/payments/invoices', { method: 'POST', body: JSON.stringify(body) }, token),
  computePayout:      (token, body)        => request('/payouts/compute', { method: 'POST', body: JSON.stringify(body) }, token),
  initiateRefund:     (token, body)        => request('/refunds', { method: 'POST', body: JSON.stringify(body) }, token),
  approveRefund:      (token, id)          => request(`/refunds/${id}/approve`, { method: 'PATCH' }, token),

  // ── Analytics ────────────────────────────────────────────────────────────────
  getAnalyticsSummary: (token, params = {}) => request(`/analytics/summary?${new URLSearchParams(params)}`, {}, token),
  getRevenueChart:     (token, params = {}) => request(`/analytics/revenue?${new URLSearchParams(params)}`, {}, token),
  getTherapistStats:   (token, params = {}) => request(`/analytics/therapists?${new URLSearchParams(params)}`, {}, token),

  // ── Notifications ────────────────────────────────────────────────────────────
  listNotifications:   (token)             => request('/notifications', {}, token),
  markNotificationRead:(token, id)         => request(`/notifications/${id}/read`, { method: 'PATCH' }, token),
  markAllRead:         (token)             => request('/notifications/read-all', { method: 'PATCH' }, token),

  // ── Staff / Users ────────────────────────────────────────────────────────────
  listStaff:           (token, params = {}) => request(`/admin/users?${new URLSearchParams(params)}`, {}, token),
  createStaffUser:     (token, body)        => request('/admin/users', { method: 'POST', body: JSON.stringify(body) }, token),
  updateStaffUser:     (token, id, body)    => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token),
  deleteStaffUser:     (token, id)          => request(`/admin/users/${id}`, { method: 'DELETE' }, token),
  getAuditLog:         (token, params = {}) => request(`/admin/audit-log?${new URLSearchParams(params)}`, {}, token),
};
