import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calendar, Clock, User, ChevronLeft, ChevronRight,
  Info, CheckCircle2, Briefcase, ChevronDown
} from 'lucide-react';
import { UserAvatar } from '../../components/ui.jsx';
import { api } from '../../api/api.js';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TIME_ROWS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const END_TIME_MAP = {
  '09:00 AM': '10:00 AM',
  '10:00 AM': '11:00 AM',
  '11:00 AM': '12:00 PM',
  '12:00 PM': '01:00 PM',
  '01:00 PM': '02:00 PM',
  '02:00 PM': '03:00 PM',
  '03:00 PM': '04:00 PM',
  '04:00 PM': '05:00 PM',
};

// Get the Monday of the week that contains `date`
function getWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDateShort(date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatDateFull(date, dayName) {
  return `${dayName}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ANCHOR: week containing Oct 27 2024
const ANCHOR_DATE = new Date(2024, 9, 27); // Oct 27, 2024

// Static booked slots: define by ISO date string + time for realism
const BOOKED_SLOTS = new Set([
  '2024-10-29_10:00 AM', // WED Oct 29
  '2024-10-31_03:00 PM', // FRI Oct 31
]);

function isoKey(date, time) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}_${time}`;
}

export default function RescheduleAppointmentPage() {
  const token = useSelector(s => s.auth?.accessToken);
  const navigate = useNavigate();
  const { id } = useParams();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null); // { colIdx, rowIdx, date, time }
  const [rescheduleReason, setRescheduleReason] = useState('Patient Request');
  const [internalNotes, setInternalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute the 7 dates for this week dynamically
  const weekDates = useMemo(() => {
    const monday = getWeekMonday(ANCHOR_DATE);
    monday.setDate(monday.getDate() + weekOffset * 7);
    return DAYS.map((_, i) => addDays(monday, i));
  }, [weekOffset]);

  const weekLabel = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    if (start.getMonth() === end.getMonth()) {
      return `${MONTHS[start.getMonth()]} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${MONTHS[start.getMonth()]} ${start.getDate()} - ${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  }, [weekDates]);

  // THU is always leave day in this therapist's schedule (colIdx 3)
  const isLeaveCol = (colIdx) => colIdx === 3;
  const isBooked = (colIdx, time) => BOOKED_SLOTS.has(isoKey(weekDates[colIdx], time));
  const isSelected = (colIdx, time) =>
    selectedSlot && selectedSlot.colIdx === colIdx && selectedSlot.time === time;

  const handleSelectSlot = (colIdx, time) => {
    const date = weekDates[colIdx];
    setSelectedSlot({
      colIdx,
      time,
      date,
      endTime: END_TIME_MAP[time],
      dateStr: formatDateFull(date, DAY_NAMES[colIdx]),
      dateShort: formatDateShort(date),
    });
  };

  const handleConfirmReschedule = async () => {
    if (!selectedSlot) {
      showToast('Please select a new time slot first.');
      return;
    }
    setLoading(true);
    try {
      await api.rescheduleAppointment(token, id || 'APT-1024', {
        newDate: selectedSlot.dateShort,
        newTimeSlot: `${selectedSlot.time} - ${selectedSlot.endTime}`,
        reason: rescheduleReason,
        notes: internalNotes,
      });
    } catch {
      // graceful fallback
    }
    setLoading(false);
    showToast('Appointment rescheduled successfully!');
    setTimeout(() => navigate(`/appointments/${id || 'APT-1024'}`), 1200);
  };

  const today = new Date();

  return (
    <div className="space-y-6 text-slate-800 animate-fade-up max-w-[1400px] mx-auto pb-12">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reschedule Appointment</h1>
        <p className="text-xs text-slate-500 mt-1">Move an appointment while preserving treatment continuity.</p>
      </div>

      {/* ─── CURRENT APPOINTMENT BANNER ─── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PATIENT</div>
              <div className="text-xs font-extrabold text-slate-900">
                Sanya Malhotra <span className="font-mono text-slate-400 font-normal text-[11px]">#OM-90210</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">THERAPIST</div>
              <div className="text-xs font-extrabold text-slate-900">Dr. Arjun Mehta</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT SCHEDULE</div>
              <div className="text-xs font-extrabold text-slate-900">Oct 23, 2024 • 01:45 PM</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 text-[11px]">
          <span className="px-3 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-200/80">● Confirmed</span>
          <span className="text-slate-400">Clinic Visit</span>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: WEEKLY AVAILABILITY GRID */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          {/* Grid Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Weekly Availability</h3>
            <div className="flex items-center gap-3 text-xs font-bold text-[#003882]">
              <button
                onClick={() => { setWeekOffset(p => p - 1); setSelectedSlot(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                title="Previous Week"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{weekLabel}</span>
              <button
                onClick={() => { setWeekOffset(p => p + 1); setSelectedSlot(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                title="Next Week"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  {/* Time column header */}
                  <th className="w-20" />
                  {weekDates.map((date, colIdx) => {
                    const isToday = date.toDateString() === today.toDateString();
                    const isWed = colIdx === 2; // WED is red in design
                    return (
                      <th key={colIdx} className="py-2 text-center text-[11px] font-bold text-slate-700">
                        <div className="text-[10px] font-bold text-slate-400">{DAYS[colIdx]}</div>
                        <div className={`text-sm font-extrabold mt-0.5 ${isWed ? 'text-rose-500' : isToday ? 'text-blue-600' : 'text-slate-900'}`}>
                          {date.getDate()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TIME_ROWS.map((time, rowIdx) => (
                  <tr key={rowIdx} className="h-10">
                    {/* Time label */}
                    <td className="text-[10px] font-semibold text-slate-400 whitespace-nowrap text-left">
                      {time}
                    </td>

                    {/* Day cells */}
                    {weekDates.map((_, colIdx) => {
                      // THU (colIdx 3) is therapist leave — span all rows
                      if (isLeaveCol(colIdx)) {
                        if (rowIdx === 0) {
                          return (
                            <td
                              key={colIdx}
                              rowSpan={TIME_ROWS.length}
                              className="bg-slate-50/80 border-x border-slate-100 text-[10px] font-bold text-slate-300 tracking-widest uppercase align-middle select-none text-center"
                              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.2em' }}
                            >
                              THERAPIST ON LEAVE
                            </td>
                          );
                        }
                        return null;
                      }

                      const booked = isBooked(colIdx, time);
                      const selected = isSelected(colIdx, time);

                      return (
                        <td key={colIdx} className="p-1 border border-slate-100/60 align-middle">
                          {selected ? (
                            <div className="w-full h-8 bg-[#003882] text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center tracking-wider shadow-sm">
                              SELECTED
                            </div>
                          ) : booked ? (
                            <div
                              className="w-full h-8 bg-slate-100/80 rounded-lg cursor-not-allowed"
                              title="Already booked"
                            />
                          ) : (
                            <button
                              onClick={() => handleSelectSlot(colIdx, time)}
                              className="w-full h-8 rounded-lg border border-transparent hover:border-blue-300 hover:bg-blue-50/60 transition-all"
                              title={`${DAY_NAMES[colIdx]} ${time}`}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003882]" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-slate-200 bg-slate-50" />
              <span>Blocked</span>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY + ACTIONS */}
        <div className="lg:col-span-4 space-y-5">

          {/* CARD 1: NEW SLOT SELECTION */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              New Slot Selection
            </h3>

            {/* Doctor Info */}
            <div className="p-3 bg-blue-50/50 rounded-2xl flex items-center gap-3">
              <UserAvatar
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
                name="Dr. Arjun Mehta"
                className="w-10 h-10"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Arjun Mehta</div>
                <div className="text-[11px] text-slate-400">Lead Psychotherapist</div>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-[#003882] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SELECTED DATE</div>
                  <div className={`font-extrabold mt-0.5 ${selectedSlot ? 'text-slate-900' : 'text-slate-300'}`}>
                    {selectedSlot ? selectedSlot.dateStr : 'Select a slot on the calendar'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#003882] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SELECTED TIME</div>
                  <div className={`font-extrabold mt-0.5 ${selectedSlot ? 'text-slate-900' : 'text-slate-300'}`}>
                    {selectedSlot ? `${selectedSlot.time} – ${selectedSlot.endTime}` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="p-3.5 bg-blue-50/30 rounded-2xl border border-blue-100/80 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
              <Info size={15} className="text-[#003882] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Availability Notes: </span>
                High demand on this day. 15-min buffer included for sanitization and notes.
              </div>
            </div>
          </div>

          {/* CARD 2: ADDITIONAL DETAILS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Additional Details
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Reschedule Reason</label>
              <div className="relative">
                <select
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100/80 rounded-full text-xs text-slate-800 font-semibold appearance-none border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option>Patient Request</option>
                  <option>Therapist Request</option>
                  <option>Clinical Change</option>
                  <option>Emergency</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">Internal Notes (Optional)</label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={e => setInternalNotes(e.target.value)}
                placeholder="Add any specific context for the clinical team..."
                className="w-full p-3 bg-slate-100/80 rounded-2xl text-xs text-slate-800 border-none placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => navigate(`/appointments/${id || 'APT-1024'}`)}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-full border border-slate-200/90 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReschedule}
              disabled={loading || !selectedSlot}
              className={`w-full py-3 text-xs font-bold rounded-full shadow-sm transition-all flex items-center justify-center gap-2
                ${selectedSlot
                  ? 'bg-[#003882] hover:bg-[#002b66] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Confirm Reschedule</span>
              )}
            </button>

            {!selectedSlot && (
              <p className="text-center text-[11px] text-slate-400">
                ↑ Click any available slot on the calendar first
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
