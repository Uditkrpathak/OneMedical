import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin, User, Stethoscope, Phone, Mail,
  FileText, CheckCircle, RefreshCcw, XCircle, Play, Send, Download,
  ExternalLink, Paperclip, AlertCircle, ShieldCheck, ChevronRight, Info,
  CheckCircle2, RefreshCw, Layers, Check
} from 'lucide-react';
import { UserAvatar } from '../../components/ui.jsx';

const APPOINTMENT_DATA = {
  id: 'APT-1024',
  status: 'Confirmed',
  sessionType: 'Clinic Visit',
  date: 'Wednesday, Oct 23, 2024',
  time: '01:45 PM',
  duration: '45 mins',
  location: 'One Medical Hub, MG Road',
  patient: {
    id: '#OM-90210',
    name: 'Sanya Malhotra',
    condition: 'ACL Recovery',
    recoveryScore: 78,
    phone: '+919876543210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  },
  therapist: {
    id: 'th-001',
    name: 'Dr. Arjun Mehta',
    specialization: 'Physiotherapy',
    availability: 'Available',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
  },
  notesPreview: 'Patient shows improved range of motion in left...',
  attachment: {
    name: 'MRI_Scan_Knee_Oct.pdf',
    size: '2.4 MB',
    uploaded: 'Uploaded Oct 10',
  },
  timeline: [
    { label: 'Booked', date: 'Oct 12, 10:30 AM', done: true },
    { label: 'Confirmed', date: 'Oct 12, 02:15 PM', done: true },
    { label: 'Reminder Sent', date: 'Oct 22, 09:00 AM', done: true },
    { label: 'Session Started', date: 'Expected 01:45 PM', done: false },
    { label: 'Completed', date: '', done: false },
  ],
  relatedSessions: [
    { title: 'Follow-up Session', date: 'Oct 16, 2024', status: 'COMPLETED' },
    { title: 'Routine Checkup', date: 'Oct 30, 2024', status: 'NEXT' },
  ],
};

export default function AppointmentDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-up max-w-[1400px] mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Details</h1>
            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/80">
              Confirmed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">View booking information, session details and actions.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(`/appointments/${id || 'APT-1024'}/reschedule`)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-200/80 shadow-2xs transition-all flex items-center gap-1.5"
          >
            <RefreshCcw size={13} />
            <span>Reschedule</span>
          </button>
          <button
            onClick={() => showToast('Appointment cancellation requested.')}
            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-full border border-rose-200/80 transition-all flex items-center gap-1.5"
          >
            <span>Cancel</span>
          </button>
          <button
            onClick={() => navigate(`/appointments/${id || 'APT-1024'}/session`)}
            className="px-5 py-2 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>› Start Session</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN GRID (2 COLUMNS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">

          {/* CARD 1: APPOINTMENT INFORMATION */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Appointment Information</h3>
              <Info size={15} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">ID</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">#{APPOINTMENT_DATA.id}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">SESSION TYPE</div>
                <div className="font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.sessionType}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">DATE</div>
                <div className="font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.date}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">TIME</div>
                <div className="font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.time}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">DURATION</div>
                <div className="font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.duration}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">LOCATION</div>
                <div className="font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.location}</div>
              </div>
            </div>
          </div>

          {/* CARD 2: PATIENT INFORMATION */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Information</h3>
              <button
                onClick={() => navigate('/patients/1')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View Patient
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  src={APPOINTMENT_DATA.patient.avatar}
                  name={APPOINTMENT_DATA.patient.name}
                  className="w-12 h-12"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{APPOINTMENT_DATA.patient.name}</div>
                  <div className="text-[11px] text-slate-400">ID: {APPOINTMENT_DATA.patient.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">CONDITION</div>
                  <div className="font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.patient.condition}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">RECOVERY SCORE</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#003882] rounded-full" style={{ width: `${APPOINTMENT_DATA.patient.recoveryScore}%` }} />
                    </div>
                    <span className="font-bold text-slate-800">{APPOINTMENT_DATA.patient.recoveryScore}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">CONTACT</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{APPOINTMENT_DATA.patient.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM 2 CARDS ROW (THERAPIST & SESSION NOTES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* THERAPIST CARD */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Therapist</h3>
                <button
                  onClick={() => navigate('/therapists/1')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View
                </button>
              </div>

              <div className="flex items-center gap-3">
                <UserAvatar
                  src={APPOINTMENT_DATA.therapist.avatar}
                  name={APPOINTMENT_DATA.therapist.name}
                  className="w-10 h-10"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{APPOINTMENT_DATA.therapist.name}</div>
                  <div className="text-[11px] text-slate-400">{APPOINTMENT_DATA.therapist.specialization}</div>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Status: Available</span>
                </span>
              </div>
            </div>

            {/* SESSION NOTES PREVIEW CARD */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Session Notes Preview
              </h3>

              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700">Previous Summary: </span>
                {APPOINTMENT_DATA.notesPreview}
              </div>

              {/* Attachment File Box */}
              <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{APPOINTMENT_DATA.attachment.name}</div>
                    <div className="text-[10px] text-slate-400">{APPOINTMENT_DATA.attachment.size} • {APPOINTMENT_DATA.attachment.uploaded}</div>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Downloading MRI scan report...')}
                  className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">

          {/* WIDGET 1: APPOINTMENT STATUS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Appointment Status
            </h3>

            <div className="space-y-4 pl-1 relative">
              {APPOINTMENT_DATA.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="relative mt-0.5">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      item.done ? 'bg-[#003882] text-white' : 'border-2 border-slate-300 bg-white'
                    }`}>
                      {item.done && <Check size={10} />}
                    </div>
                    {idx < APPOINTMENT_DATA.timeline.length - 1 && (
                      <div className={`absolute top-4 left-1.5 -translate-x-1/2 w-0.5 h-6 ${
                        item.done ? 'bg-[#003882]' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">{item.label}</div>
                    {item.date && <div className="text-[11px] text-slate-400">{item.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 2: QUICK ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate(`/appointments/${id || 'APT-1024'}/reschedule`)}
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50/50 hover:text-blue-700 rounded-xl text-xs font-bold text-slate-700 border border-slate-200/80 transition-all flex items-center gap-2.5"
              >
                <Calendar size={15} className="text-blue-600" />
                <span>Reschedule</span>
              </button>

              <button
                onClick={() => showToast('Reminder sent to patient via SMS/Email!')}
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50/50 hover:text-blue-700 rounded-xl text-xs font-bold text-slate-700 border border-slate-200/80 transition-all flex items-center gap-2.5"
              >
                <Send size={15} className="text-blue-600" />
                <span>Send Reminder</span>
              </button>

              <button
                onClick={() => showToast('Generating session clinical summary...')}
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50/50 hover:text-blue-700 rounded-xl text-xs font-bold text-slate-700 border border-slate-200/80 transition-all flex items-center gap-2.5"
              >
                <FileText size={15} className="text-blue-600" />
                <span>Generate Summary</span>
              </button>

              <button
                onClick={() => showToast('Cancellation dialog triggered.')}
                className="w-full p-2.5 bg-rose-50/50 hover:bg-rose-100/60 text-rose-600 rounded-xl text-xs font-bold border border-rose-200/60 transition-all flex items-center gap-2.5"
              >
                <XCircle size={15} />
                <span>Cancel Appointment</span>
              </button>
            </div>
          </div>

          {/* WIDGET 3: RELATED SESSIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Related Sessions</h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>PREVIOUS</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">COMPLETED</span>
                </div>
                <div className="text-xs font-bold text-slate-900">Oct 16, 2024</div>
                <div className="text-[11px] text-slate-500">Follow-up Session</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>NEXT</span>
                  <ExternalLink size={12} className="text-slate-400" />
                </div>
                <div className="text-xs font-bold text-slate-900">Oct 30, 2024</div>
                <div className="text-[11px] text-slate-500">Routine Checkup</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
