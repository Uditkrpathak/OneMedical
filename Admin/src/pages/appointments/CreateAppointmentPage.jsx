import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Check, Clock, User, Calendar, ArrowRight, ArrowLeft,
  CheckCircle2, Star, ShieldCheck, MapPin, Video, Building, Plus,
  AlertCircle, FileText, ChevronLeft, ChevronRight, Filter, Upload,
  Building2, Home, VideoIcon, Paperclip, BellRing, CalendarCheck, Receipt,
  Info, MapPinIcon, Stethoscope, Layers, FileCheck
} from 'lucide-react';

// Mock Patient Data matching screenshot Step 1 & Step 5
const MOCK_PATIENTS = [
  {
    id: 'OM-90210',
    name: 'Sanya Malhotra',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    program: 'ACL RECOVERY',
    phase: 'ACL Recovery',
    progress: 75,
    lastSession: 'Oct 12, 2023',
  },
  {
    id: 'OM-88432',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    program: 'LUMBAR STRAIN',
    phase: 'Lumbar Strain · Phase 1',
    progress: 40,
    lastSession: 'Oct 05, 2023',
  },
  {
    id: 'OM-88290',
    name: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    program: 'SHOULDER IMPINGEMENT',
    phase: 'Shoulder Rehab · Phase 2',
    progress: 60,
    lastSession: 'Oct 18, 2023',
  },
];

// Mock Therapist Data matching screenshot Step 2 & Step 5
const MOCK_THERAPISTS = [
  {
    id: 'th_1',
    name: 'Dr. Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
    specs: 'Orthopedic Physiotherapy',
    rating: '4.9',
    availability: 'Available Today',
    availType: 'today',
  },
  {
    id: 'th_2',
    name: 'Dr. Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop',
    specs: 'Senior MSK Physiotherapist · 8 years exp',
    rating: '4.8',
    availability: 'Next Available: Tomorrow',
    availType: 'tomorrow',
  },
  {
    id: 'th_3',
    name: 'Dr. Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    specs: 'Neurological Specialist · 10 years exp',
    rating: '4.9',
    availability: 'Next Available: Wednesday',
    availType: 'later',
  },
];

// Weekday Dates for Step 3 Calendar Strip
const DATES_STRIP = [
  { day: 'MON', date: 21, fullDate: '2024-10-21' },
  { day: 'TUE', date: 22, fullDate: '2024-10-22' },
  { day: 'WED', date: 23, fullDate: '2024-10-23', active: true },
  { day: 'THU', date: 24, fullDate: '2024-10-24' },
  { day: 'FRI', date: 25, fullDate: '2024-10-25' },
  { day: 'SAT', date: 26, fullDate: '2024-10-26' },
  { day: 'SUN', date: 27, fullDate: '2024-10-27' },
];

export default function CreateAppointmentPage() {
  const navigate = useNavigate();

  // Wizard step state (Default to step 5 for step 5 review, toggleable 1-5)
  const [currentStep, setCurrentStep] = useState(5);

  // Form selections
  const [selectedPatient, setSelectedPatient] = useState(MOCK_PATIENTS[0]); // Sanya Malhotra
  const [selectedTherapist, setSelectedTherapist] = useState(MOCK_THERAPISTS[0]); // Dr. Arjun Mehta

  // Step 3 Schedule selections
  const [sessionDuration, setSessionDuration] = useState('45m');
  const [selectedDateObj, setSelectedDateObj] = useState(DATES_STRIP[2]); // Wed 23
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('01:45 PM');

  // Step 4 Session Details selections
  const [sessionType, setSessionType] = useState('Clinic Visit');
  const [patientInstructions, setPatientInstructions] = useState('Wear comfortable athletic clothing and bring any recent MRI scans for initial assessment.');
  const [staffNotes, setStaffNotes] = useState('Post-op Week 6. Focusing on mobility and weight-bearing exercises. Moderate inflammation reported.');
  const [urgencyPriority, setUrgencyPriority] = useState('Normal');

  // Search states
  const [patientSearch, setPatientSearch] = useState('');
  const [therapistSearch, setTherapistSearch] = useState('');

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredPatients = MOCK_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredTherapists = MOCK_THERAPISTS.filter(t =>
    t.name.toLowerCase().includes(therapistSearch.toLowerCase()) ||
    t.specs.toLowerCase().includes(therapistSearch.toLowerCase())
  );

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setBookingConfirmed(true);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-up max-w-[1400px] mx-auto pb-12">

      {/* Confirmation Toast/Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Appointment Confirmed!</h3>
            <p className="text-xs text-slate-500">
              Appointment for <strong className="text-slate-800">{selectedPatient?.name}</strong> with <strong className="text-slate-800">{selectedTherapist?.name}</strong> has been successfully booked for <strong>Wed, Oct 23 at 01:45 PM</strong>.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/appointments')}
                className="w-full py-3 bg-[#003882] text-white rounded-xl text-xs font-bold hover:bg-[#002b66] transition-all"
              >
                Go to Appointments Schedule
              </button>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Appointment</h1>
          <p className="text-xs text-slate-500 mt-1 font-normal">Book a treatment session by selecting patient, therapist and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all"
          >
            Discard Draft
          </button>
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Save & Continue</span>
          </button>
        </div>
      </div>

      {/* ─── STEPPER NAV BAR ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto px-4 overflow-x-auto">
          {[
            { step: 1, label: 'Patient' },
            { step: 2, label: 'Therapist' },
            { step: 3, label: 'Schedule' },
            { step: 4, label: 'Session Details' },
            { step: 5, label: 'Confirmation' },
          ].map((s, idx, arr) => {
            const isCompleted = currentStep > s.step || (currentStep === 5 && s.step < 5);
            const isActive = currentStep === s.step;

            return (
              <React.Fragment key={s.step}>
                <div
                  onClick={() => setCurrentStep(s.step)}
                  className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap py-1 group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted || isActive
                        ? 'bg-[#003882] text-white ring-4 ring-blue-50'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : s.step}
                  </div>
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isActive || isCompleted ? 'text-[#003882]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {idx < arr.length - 1 && (
                  <div className="hidden md:block flex-1 h-0.5 mx-3 bg-slate-100 min-w-[30px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 5 SUBHEADER */}
      {currentStep === 5 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review Appointment</h2>
          <p className="text-xs text-slate-500 mt-0.5">Please double-check all clinical and financial details before finalizing the booking.</p>
        </div>
      )}

      {/* ─── MAIN CONTENT (2 COLUMNS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: STEP CONTENT (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 1: PATIENT SELECTION                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  placeholder="Search by Name, Phone, or Patient ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPatients.map(p => {
                  const isSelected = selectedPatient?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`relative bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-2xs space-y-3.5 ${
                        isSelected ? 'border-[#003882] ring-2 ring-blue-500/10 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/40'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#003882] text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-snug">{p.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">#{p.id}</div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500 uppercase tracking-wide">{p.program}</span>
                          <span className="text-slate-700">{p.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003882] rounded-full transition-all duration-300" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock size={12} />
                        <span>Last session: {p.lastSession}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 2: THERAPIST SELECTION                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={therapistSearch}
                  onChange={e => setTherapistSearch(e.target.value)}
                  placeholder="Search by Name, Specialization..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="space-y-3">
                {filteredTherapists.map(t => {
                  const isSelected = selectedTherapist?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`bg-white rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 shadow-2xs ${
                        isSelected ? 'border-[#003882] ring-2 ring-blue-500/10 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-snug">{t.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{t.specs}</div>
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            <span className="flex items-center gap-0.5 font-bold text-amber-500">
                              <Star size={12} fill="currentColor" /> {t.rating}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className={`font-semibold ${t.availType === 'today' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                              {t.availability}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTherapist(t)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          isSelected ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Select'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 3: SCHEDULE SELECTION                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Session Duration</div>
                  <div className="flex items-center gap-2">
                    {['30m', '45m', '60m'].map(dur => (
                      <button
                        key={dur}
                        onClick={() => setSessionDuration(dur)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          sessionDuration === dur ? 'bg-[#003882] text-white border-[#003882] shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>Timezone: IST (UTC+5:30)</span>
                  <button className="flex items-center gap-1 text-slate-600 font-semibold hover:text-slate-800 ml-1">
                    <Filter size={13} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-bold text-slate-800">October 21 - 27, 2024</span>
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center">
                  {DATES_STRIP.map(item => {
                    const isSelected = selectedDateObj.date === item.date;
                    return (
                      <button
                        key={item.date}
                        onClick={() => setSelectedDateObj(item)}
                        className={`p-3 rounded-2xl transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected ? 'bg-blue-50/70 border-2 border-[#003882] text-[#003882]' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{item.day}</span>
                        <span className={`text-base font-extrabold ${isSelected ? 'text-[#003882]' : 'text-slate-800'}`}>
                          {item.date}
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#003882] mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">☼ MORNING SLOTS</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[{ time: '09:00 AM', s: 'avail' }, { time: '09:45 AM', s: 'avail' }, { time: '10:30 AM', s: 'dis' }, { time: '11:15 AM', s: 'avail' }].map((s, i) => (
                    <button
                      key={i}
                      disabled={s.s === 'dis'}
                      onClick={() => setSelectedTimeSlot(s.time)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                        s.s === 'dis' ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through' : selectedTimeSlot === s.time ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">☼ AFTERNOON SLOTS</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[{ time: '01:00 PM', s: 'dis' }, { time: '01:45 PM', s: 'avail' }, { time: '02:30 PM', s: 'avail' }, { time: '03:15 PM', s: 'avail' }, { time: '04:00 PM', s: 'avail' }, { time: '04:45 PM', s: 'avail' }].map((s, i) => (
                    <button
                      key={i}
                      disabled={s.s === 'dis'}
                      onClick={() => setSelectedTimeSlot(s.time)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                        s.s === 'dis' ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through' : selectedTimeSlot === s.time ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 4: SESSION DETAILS                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={15} className="text-blue-600" />
                  <span>Session Type</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Clinic Visit', icon: Building2, label: 'Clinic Visit', sub: 'At main campus' },
                    { id: 'Home Visit', icon: Home, label: 'Home Visit', sub: 'Physician travels' },
                    { id: 'Online Consultation', icon: VideoIcon, label: 'Online Consultation', sub: 'Via Tele-health' },
                  ].map(st => {
                    const IconComp = st.icon;
                    const isSel = sessionType === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => setSessionType(st.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                          isSel ? 'border-[#003882] bg-blue-50/30 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSel ? 'bg-blue-100 text-[#003882]' : 'bg-slate-100 text-slate-500'}`}>
                          <IconComp size={18} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSel ? 'text-[#003882]' : 'text-slate-800'}`}>{st.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{st.sub}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
                  <label className="block text-xs font-bold text-slate-800">Patient Instructions</label>
                  <textarea
                    rows={4}
                    value={patientInstructions}
                    onChange={e => setPatientInstructions(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
                  <label className="block text-xs font-bold text-slate-800">Internal Staff Notes</label>
                  <textarea
                    rows={4}
                    value={staffNotes}
                    onChange={e => setStaffNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 5: REVIEW & CONFIRMATION (Matching Screenshot 1-to-1)    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <div className="space-y-4">

              {/* 2x2 Grid of 4 Detail Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Card 1: Patient Details */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center shrink-0">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</div>
                      <div className="text-xs font-bold text-slate-900">{selectedPatient?.name}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Patient ID:</span>
                      <span className="font-bold text-[#003882] font-mono">#OM-90210</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Primary Case:</span>
                      <span className="font-bold text-slate-800">ACL Recovery</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Therapist */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center shrink-0">
                      <Stethoscope size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Therapist</div>
                      <div className="text-xs font-bold text-slate-900">{selectedTherapist?.name}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Specialization:</span>
                      <span className="font-bold text-slate-800 text-right">Orthopedic Physiotherapy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Rating:</span>
                      <span className="font-bold text-amber-500 flex items-center gap-0.5">
                        <Star size={12} fill="currentColor" /> 4.9
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Schedule */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule</div>
                      <div className="text-xs font-bold text-slate-900">Wed, Oct 23</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Time:</span>
                      <span className="font-bold text-slate-800">01:45 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-bold text-slate-800">45 mins</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Session Type */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session Type</div>
                      <div className="text-xs font-bold text-slate-900">Clinic Visit</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-tight">
                    One Medical Hub, Ground Floor, MG Road, Bangalore
                  </div>
                </div>

              </div>

              {/* Card 5: Clinical Metadata */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Layers size={14} className="text-[#003882]" />
                  <span>Clinical Metadata</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Patient Instructions Box */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Instructions</div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed min-h-[70px]">
                      {patientInstructions}
                    </div>
                  </div>

                  {/* Staff Notes Summary Box */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff Notes Summary</div>
                    <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/60 text-xs text-slate-700 leading-relaxed min-h-[70px]">
                      {staffNotes}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Financial Summary */}
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003882] uppercase tracking-wider">
                  <Receipt size={15} />
                  <span>Financial Summary</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Session Fee (Individual Therapy)</span>
                    <span className="font-semibold text-slate-800">₹1,500.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Facility Charges & Clinical Supplies</span>
                    <span className="font-semibold text-slate-800">₹300.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Insurance Coverage</span>
                    <span className="font-bold text-[#003882]">-₹1200.00</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between font-bold">
                    <span className="text-slate-900">Total Amount Payable</span>
                    <span className="text-base font-black text-[#003882]">₹600.00</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-full border border-slate-200 shadow-2xs transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Edit</span>
                </button>

                <button
                  onClick={() => setBookingConfirmed(true)}
                  className="px-6 py-2.5 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center gap-2"
                >
                  <span>Confirm & Book Appointment</span>
                  <CheckCircle2 size={16} />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: STEP 5 SPECIFIC SIDEBAR OR GENERAL SIDEBAR (4 COLS) */}
        <div className="lg:col-span-4">
          {currentStep === 5 ? (
            /* STEP 5 RIGHT WIDGETS (Matching Screenshot Step 5) */
            <div className="space-y-5">

              {/* NEXT STEPS Card */}
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#003882] uppercase tracking-wider">Next Steps</h3>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#003882] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <BellRing size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">Instant Confirmation</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        Patient notification will be sent via SMS/Email immediately after booking.
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#003882] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CalendarCheck size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">Sync to Calendar</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        The appointment will be automatically synced with Dr. Arjun Mehta's clinical calendar.
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#003882] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Receipt size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">Invoice Generation</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        A digital invoice will be generated and available in the patient portal.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOOKING POLICY Box */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Info size={14} className="text-slate-400" />
                  <span>BOOKING POLICY</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Cancellations made less than 24 hours before the appointment may be subject to a ₹500 cancellation fee. By confirming, you acknowledge that the therapist has been verified for this specific clinical case.
                </p>
              </div>

              {/* LOCATION MAP CARD */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
                <div className="h-36 bg-slate-200 relative flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                    alt="Clinic Map Location"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-blue-900/10" />
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[#003882] text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                    <MapPinIcon size={20} />
                  </div>
                </div>
                <div className="p-3 bg-white text-center border-t border-slate-100">
                  <span className="text-[10px] font-bold tracking-wide text-[#003882] uppercase">
                    📍 ONE MEDICAL HUB • MG ROAD
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* GENERAL SUMMARY SIDEBAR FOR STEPS 1-4 */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Appointment Summary</h3>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Patient</div>
                {selectedPatient ? (
                  <div className="flex items-center gap-3">
                    <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{selectedPatient.name}</div>
                      <div className="text-[11px] text-slate-400">Patient ID: #{selectedPatient.id}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <User size={14} />
                    <span>Not selected</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Therapist</div>
                {selectedTherapist ? (
                  <div className="flex items-center gap-3">
                    <img src={selectedTherapist.avatar} alt={selectedTherapist.name} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{selectedTherapist.name}</div>
                      <div className="text-[11px] text-slate-400">{selectedTherapist.specs}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <User size={14} />
                    <span>Not selected</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Schedule</div>
                {selectedDateObj && selectedTimeSlot ? (
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Wed, Oct 23, 2024</div>
                      <div className="text-xs font-bold text-[#003882]">{selectedTimeSlot}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Duration: {sessionDuration === '45m' ? '45 Minutes' : sessionDuration}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <Calendar size={14} />
                    <span>Not selected</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Session Fee</span>
                  <span className="font-semibold text-slate-800">₹1,500.00</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Insurance Coverage</span>
                  <span className="font-semibold text-blue-600">-₹1200.00</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Estimated</span>
                  <span className="text-sm font-black text-slate-900">₹300.00</span>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Next Step →</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
