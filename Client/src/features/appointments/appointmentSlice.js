import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess(state, action) {
      state.loading = false;
      state.appointments = action.payload;
    },
    fetchAppointmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addAppointment(state, action) {
      state.appointments.unshift(action.payload);
    },
    updateAppointmentStatus(state, action) {
      const { id, status } = action.payload;
      const appt = state.appointments.find(a => a._id === id || a.appointmentId === id);
      if (appt) {
        appt.status = status;
      }
    }
  },
});

export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  addAppointment,
  updateAppointmentStatus
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
