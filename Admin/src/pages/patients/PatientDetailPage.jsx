import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, Calendar, Activity, FileText, TrendingUp,
  Edit, Download, CheckCircle, Clock, AlertCircle, Flag, Plus,
  CreditCard, Target, Flame, Award, Play, Upload, ShieldCheck,
  Pill, BarChart2, Star, ChevronRight, MoreHorizontal, Video,
  Share2, Archive, Lock, FileSpreadsheet, Paperclip, Send, Search,
  Eye, X, ChevronDown, Trash2, Filter, Sparkles, Dumbbell, User,
  Maximize2, PlusCircle, AlertTriangle, Stethoscope, Heart, MapPin,
  FilePlus, History, UserCheck, HelpCircle, ShieldAlert, ClipboardList,
  Zap, MessageSquare, ExternalLink, RefreshCw, Printer, LogOut,
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

// ─── FULL MOCK DATA WITH ENTERPRISE AUDIT LOGS & OVERVIEW WIDGETS ────────────
const INITIAL_PATIENT = {
  id: 'PT-1024', name: 'Sanya Malhotra', age: 32, gender: 'Female',
  phone: '+91 98765 43210', email: 'sanya.m@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  status: 'Active Treatment', treatmentType: 'Online Treatment',
  primaryTherapist: 'Dr. Ananya Iyer',
  nextAppointment: { date: '24 Feb', day: 'Fri', time: '10:30 AM', type: 'Video Call' },
  recoveryScore: 78, painLevelText: 'Moderate (3/10)',
  sessionsCompleted: '18 / 30',
  activeProgramsCount: '3 Active',
  streakDays: 14,
  adherenceRate: 92,
  riskLevel: 'Low Risk (94% Stability)',

  // Care Team
  careTeam: [
    { role: 'Lead Physiotherapist', name: 'Dr. Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100' },
    { role: 'Orthopedic Consultant', name: 'Dr. Vikram Mehta', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100' },
    { role: 'Care Coordinator', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
  ],

  program: {
    title: 'Lumbar Spine Stabilization',
    subtitle: 'Focus on deep core activation and progressive weight loading.',
    progress: 80,
    frequency: '3x per week',
    duration: '12 Weeks Plan',
    sessionsPerWeek: 'Mon, Wed, Fri',
    exercisesCount: '8 Routine Items',
    exercises: [
      { name: 'Pelvic Tilts', tag: 'MOBILITY', sets: '3', reps: '12', duration: '5 min', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300' },
      { name: 'Cat-Cow Stretch', tag: 'FLEXIBILITY', duration: '2m', intensity: 'Low', thumb: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300' },
    ],
    recommended: [
      { name: 'Core Strength & Conditioning', desc: 'Enhance spinal support by building deep abdominal stability.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', duration: '6 Weeks • Intermediate', tag: 'HIGHLY RECOMMENDED' },
      { name: 'Mobility Flow for Desk Workers', desc: 'Targeted movements to alleviate postural stress from prolonged...', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300', duration: '4 Weeks • Beginner', tag: null },
    ],
    recoveryGoals: [
      { id: 1, text: 'Walk 3km without pain intensification', tag: 'SHORT TERM', done: true },
      { id: 2, text: 'Return to recreational tennis practice', tag: 'LONG TERM', done: false },
      { id: 3, text: 'Full lumbar flexion mobility (standard range)', tag: 'SHORT TERM', done: false },
    ],
  },

  primaryDiagnoses: [
    {
      id: 'd1',
      title: 'Lumbar Spondylosis',
      desc: 'Degenerative changes observed in L4-L5 vertebrae.',
      date: 'DIAGNOSED JAN 2024',
      status: 'CURRENT',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      activeIcon: true,
    },
    {
      id: 'd2',
      title: 'Post-Operative ACL Recovery',
      desc: 'Strength maintenance program following reconstruction.',
      date: 'DIAGNOSED OCT 2022',
      status: 'PAST',
      statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
      activeIcon: false,
    },
  ],

  medicalTimeline: [
    { id: 't1', title: 'Pain Reduced', desc: 'Reported 20% reduction in morning stiffness.', date: '05 Nov 2023', active: true },
    { id: 't2', title: 'Program Modified', desc: 'Integrated lumbar stabilization exercises.', date: '30 Oct 2023', active: false },
    { id: 't3', title: 'Treatment Started', desc: 'Bi-weekly physiotherapy sessions initiated.', date: '16 Oct 2023', active: false },
    { id: 't4', title: 'MRI Report Uploaded', desc: 'mri_scan_lumbar.pdf', isFile: true, date: '14 Oct 2023', active: false },
    { id: 't5', title: 'Initial Consultation', desc: 'Evaluated by Dr. Mehta. Initial diagnosis: Disc Bulge L4-L5.', date: '12 Oct 2023', active: false },
  ],

  surgicalHistory: [
    {
      id: 's1',
      dateTag: 'JUNE 2022',
      title: 'Left Knee ACL Reconstruction',
      desc: 'Successful reconstruction using hamstring autograft.',
      doctor: 'Dr. Vikram Mehta',
    },
    {
      id: 's2',
      dateTag: 'YEAR 2015',
      title: 'Appendectomy',
      desc: 'Laparoscopic procedure with no complications.',
      facility: "St. Jude's Hospital",
    },
  ],

  familyHistory: [
    { side: 'PATERNAL', label: 'Type 2 Diabetes', gender: 'male' },
    { side: 'MATERNAL', label: 'Hypertension', gender: 'female' },
  ],

  allergies: [
    { name: 'Penicillin', severity: 'SEVERE', desc: 'Anaphylactic response documented in childhood records.' },
    { name: 'NSAIDs', severity: 'MILD', desc: 'Mild gastric sensitivity. Use with caution or prefer alternatives.' },
  ],

  medications: [
    { name: 'Etoricoxib 60mg', freq: 'Once Daily' },
    { name: 'Pantoprazole 40mg', freq: 'Before Breakfast' },
  ],

  vitalMetrics: {
    bloodType: 'O+',
    height: '168 cm',
    weight: '62 kg',
    bmi: '22.0',
    bmiCategory: 'NORMAL',
  },

  clinicianNotesText: 'Patient shows high adherence to post-op recovery protocols. Recent lumbar flare-up likely related to increased desk time. Recommended ergonomic assessment.',

  recentReports: [
    { name: 'MRI Scan - Lumbar Spine', date: 'Uploaded on 12 Feb 2024 • 4.2 MB', iconColor: 'bg-red-50 text-red-600' },
    { name: 'Initial Assessment Report', date: 'Uploaded on 05 Feb 2024 • 1.9 MB', iconColor: 'bg-blue-50 text-blue-600' },
  ],

  clinicalNotes: [
    {
      id: 'n1',
      text: '"Patient reports improved morning stiffness. Focusing on eccentric loading next session."',
      date: 'Feb 19, 2024',
      author: 'Dr. Ananya Iyer',
    },
    {
      id: 'n2',
      text: '"Started new core stability protocol. Patient tolerated well but limited flexion observed."',
      date: 'Feb 11, 2024',
      author: 'Dr. Ananya Iyer',
    },
  ],

  // ─── RICH AUDIT LOG HISTORY DATA ───
  auditLogs: [
    {
      id: 'log_101',
      timestamp: 'Today · 02:45 PM',
      category: 'Clinical Note',
      action: 'Added Clinical Observation Note',
      user: 'Dr. Ananya Iyer (Lead Physio)',
      ip: '192.168.1.45 · Admin Console',
      badge: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'log_102',
      timestamp: 'Yesterday · 11:20 AM',
      category: 'Treatment Plan',
      action: 'Updated Program Compliance to 80%',
      user: 'System Auto-Tracker (AI Assistant)',
      ip: 'Automated Bot Job',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'log_103',
      timestamp: '19 Feb 2024 · 04:15 PM',
      category: 'Appointment',
      action: 'Completed Telehealth Video Consultation (#APT-1024)',
      user: 'Dr. Ananya Iyer',
      ip: '192.168.1.45 · Video WebRTC',
      badge: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'log_104',
      timestamp: '14 Feb 2024 · 09:30 AM',
      category: 'Document',
      action: 'Uploaded Report: MRI Scan - Lumbar Spine (4.2 MB)',
      user: 'Priya Sharma (Care Coord)',
      ip: '192.168.1.12 · Upload Service',
      badge: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'log_105',
      timestamp: '12 Feb 2024 · 10:00 AM',
      category: 'Billing',
      action: 'Generated Invoice #INV-8021 for ₹4,500 (Paid via UPI)',
      user: 'System Admin (Finance)',
      ip: '192.168.1.10 · Razorpay Webhook',
      badge: 'bg-green-100 text-green-700',
    },
    {
      id: 'log_106',
      timestamp: '09 Feb 2024 · 03:00 PM',
      category: 'Patient Record',
      action: 'Assigned Lumbar Spine Stabilization Program',
      user: 'Dr. Ananya Iyer',
      ip: '192.168.1.45 · Program Builder',
      badge: 'bg-blue-100 text-blue-700',
    },
  ],

  chartData: [
    { week: 'W1', score: 30, pain: 8, mobility: 38 },
    { week: 'W3', score: 42, pain: 7, mobility: 50 },
    { week: 'W5', score: 55, pain: 5, mobility: 62 },
    { week: 'W7', score: 63, pain: 4, mobility: 72 },
    { week: 'W9', score: 70, pain: 3, mobility: 80 },
    { week: 'W11', score: 78, pain: 2, mobility: 88 },
  ],
  sessionStats: [
    { session: 'Session 1 — Lower Spine', date: 'Jan 23 · 10:00 AM', pain: 2, milestone: 'Started Treatment', flag: false },
    { session: 'Session 2 — Core Activation', date: 'Jan 26 · 11:00 AM', pain: 3, milestone: 'Phase 1 Complete', flag: false },
    { session: 'Session 3 — Hip Flexor', date: 'Jan 29 · 10:30 AM', pain: 4, milestone: '—', flag: true },
    { session: 'Session 4 — Full Protocol', date: 'Feb 02 · 09:00 AM', pain: 2, milestone: 'Milestone Achieved', flag: false },
  ],
  reports: [
    { name: 'MRI Scan – Lumbar Spine', date: 'Jan 14, 2025', size: '4.2 MB', type: 'MRI Scan', status: 'Reviewed' },
    { name: 'Initial Assessment Report', date: 'Jan 02, 2025', size: '0.8 MB', type: 'Assessment', status: 'Reviewed' },
  ],
  payments: {
    totalBilled: 42500, outstanding: 8000, currency: '₹',
    history: [
      { invId: 'INV-8021', date: 'Oct 12, 2024', desc: 'Physiotherapy Session', amount: 4500, status: 'Paid' },
    ],
  },
};

const TABS = ['Overview', 'Medical History', 'Programs', 'Progress', 'Reports', 'Payments', 'Notes', 'History'];

export default function PatientDetailPage() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const [tab, setTab] = useState('Overview');
  const [patientData, setPatientData] = useState(INITIAL_PATIENT);
  
  // Modals state
  const [showEditModal, setShowEditModal]       = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAssignModal, setShowAssignModal]   = useState(false);
  const [showFlagModal, setShowFlagModal]       = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [flagReason, setFlagReason]   = useState('Spike in Reported Pain');

  const [editForm, setEditForm] = useState({
    name: '', age: '', gender: 'Female', phone: '', email: '', primaryTherapist: 'Dr. Ananya Iyer', status: 'Active Treatment',
  });

  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    setPatientData(prev => ({
      ...prev,
      name: editForm.name,
      age: Number(editForm.age),
      gender: editForm.gender,
      phone: editForm.phone,
      email: editForm.email,
      primaryTherapist: editForm.primaryTherapist,
      status: editForm.status,
    }));
    setShowEditModal(false);
    alert('Patient profile updated successfully!');
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `n_${Date.now()}`,
      text: `"${newNoteText.trim()}"`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Dr. Ananya Iyer',
    };
    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: 'Just Now',
      category: 'Clinical Note',
      action: `Added Clinical Note: "${newNoteText.trim().substring(0, 30)}..."`,
      user: 'Dr. Ananya Iyer',
      ip: '192.168.1.45 · Admin Console',
      badge: 'bg-blue-100 text-blue-700',
    };
    setPatientData(prev => ({
      ...prev,
      clinicalNotes: [newNote, ...prev.clinicalNotes],
      auditLogs: [newLog, ...prev.auditLogs],
    }));
    setNewNoteText('');
    setShowAddNoteModal(false);
  };

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    alert(`Patient flagged for clinical review: ${flagReason}`);
    setShowFlagModal(false);
  };

  const toggleGoal = (goalId) => {
    setPatientData(prev => ({
      ...prev,
      program: {
        ...prev.program,
        recoveryGoals: prev.program.recoveryGoals.map(g => g.id === goalId ? { ...g, done: !g.done } : g),
      },
    }));
  };

  return (
    <div className="max-w-[1300px] animate-fade-up space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => navigate('/patients')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors font-medium">
          <ArrowLeft size={14} /> Patients
        </button>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-700">{patientData.name}</span>
      </div>

      {/* HEADER CARD */}
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <img src={patientData.avatar} alt={patientData.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900">{patientData.name}</h1>
              <span className="badge badge-red text-[10px]">Lower Back Pain</span>
              <span className="badge badge-blue text-[10px]">● {patientData.status}</span>
              <span className="badge bg-emerald-100 text-emerald-700 text-[10px] font-bold">🛡️ {patientData.riskLevel}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>{patientData.age} years • {patientData.gender}</span>
              <span className="flex items-center gap-1"><User size={12} /> {patientData.primaryTherapist}</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Calendar size={12} /> Next: {patientData.nextAppointment.date} • {patientData.nextAppointment.time}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0 w-full md:w-auto">
            <button className="btn btn-secondary btn-sm text-xs font-semibold flex-1 sm:flex-none" onClick={() => {
              setEditForm({
                name: patientData.name,
                age: patientData.age,
                gender: patientData.gender,
                phone: patientData.phone,
                email: patientData.email,
                primaryTherapist: patientData.primaryTherapist,
                status: patientData.status,
              });
              setShowEditModal(true);
            }}>
              <Edit size={13} /> Edit Profile
            </button>
            <button className="btn btn-secondary btn-sm text-xs font-semibold flex-1 sm:flex-none" onClick={() => setShowFlagModal(true)}>
              <Flag size={13} className="text-red-500" /> Flag Patient
            </button>
            <button className="btn btn-primary btn-sm text-xs font-bold w-full sm:w-auto">
              <Calendar size={13} /> Book Appointment
            </button>
          </div>
        </div>

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>RECOVERY SCORE</span>
              <span className="text-blue-600">+2% this week</span>
            </div>
            <p className="text-xl font-extrabold text-blue-600 mt-0.5">{patientData.recoveryScore}%</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>PAIN LEVEL</span>
              <span className="text-slate-400">Last Check: Today</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{patientData.painLevelText}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>ADHERENCE STREAK</span>
              <span className="text-amber-500 font-bold flex items-center gap-0.5">🔥 {patientData.streakDays} Days</span>
            </div>
            <p className="text-xl font-extrabold text-purple-600 mt-0.5">{patientData.adherenceRate}% Compliance</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400">SESSIONS COMPLETED</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{patientData.sessionsCompleted}</p>
            <div className="progress-track mt-1.5"><div className="progress-fill" style={{ width: '60%' }} /></div>
          </div>
        </div>
      </div>

      {/* TABS NAV */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap
              ${tab === t
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      {tab === 'Overview'        && <OverviewTab P={patientData} onAddNote={() => setShowAddNoteModal(true)} toggleGoal={toggleGoal} onAssign={() => setShowAssignModal(true)} onFlag={() => setShowFlagModal(true)} />}
      {tab === 'Medical History' && <MedicalHistoryTab P={patientData} />}
      {tab === 'Programs'        && <ProgramsTab P={patientData} />}
      {tab === 'Progress'        && <ProgressTab P={patientData} />}
      {tab === 'Reports'         && <ReportsTab P={patientData} />}
      {tab === 'Payments'        && <PaymentsTab P={patientData} />}
      {tab === 'Notes'           && <NotesTab P={patientData} onAddNote={() => setShowAddNoteModal(true)} />}
      {tab === 'History'         && <HistoryTab P={patientData} />}

      {/* MODAL 0: EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit size={18} className="text-blue-600" /> Edit Patient Profile
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input text-xs" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Age</label>
                  <input className="input text-xs" type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select className="select text-xs" value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input text-xs" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} required />
                </div>
                <div className="col-span-2">
                  <label className="label">Email Address</label>
                  <input className="input text-xs" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Primary Therapist</label>
                  <select className="select text-xs" value={editForm.primaryTherapist} onChange={e => setEditForm({ ...editForm, primaryTherapist: e.target.value })}>
                    <option value="Dr. Ananya Iyer">Dr. Ananya Iyer</option>
                    <option value="Dr. Ankur Mehta">Dr. Ankur Mehta</option>
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                  </select>
                </div>
                <div>
                  <label className="label">Treatment Status</label>
                  <select className="select text-xs" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="Active Treatment">Active Treatment</option>
                    <option value="Under Observation">Under Observation</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  <CheckCircle size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CLINICAL NOTE */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Add Clinical Note
              </h3>
              <button onClick={() => setShowAddNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddNoteSubmit} className="space-y-4">
              <div>
                <label className="label">Note Details</label>
                <textarea
                  className="input h-32 text-xs resize-none p-3 leading-relaxed"
                  placeholder="Enter clinical observations, progress notes, or treatment adjustments..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setShowAddNoteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  <CheckCircle size={14} /> Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FLAG PATIENT */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                <Flag size={18} /> Flag Patient for Clinical Review
              </h3>
              <button onClick={() => setShowFlagModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleFlagSubmit} className="space-y-4 text-xs">
              <div>
                <label className="label">Flag Reason</label>
                <select className="select" value={flagReason} onChange={e => setFlagReason(e.target.value)}>
                  <option value="Spike in Reported Pain">Spike in Reported Pain (&gt;7/10)</option>
                  <option value="Non-Compliance with Prescribed Routine">Non-Compliance (&lt;40% completion)</option>
                  <option value="Requesting Doctor Re-consultation">Requesting Doctor Re-consultation</option>
                  <option value="Medical Certificate / Leave Request">Medical Certificate / Leave Request</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setShowFlagModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger text-xs">
                  Flag Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── OVERVIEW TAB WITH ENHANCED CARE TEAM & RISK WIDGETS ───────────────────────
function OverviewTab({ P, onAddNote, toggleGoal, onAssign, onFlag }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* 1. Current Treatment Plan Card */}
        <div className="card p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Current Treatment Plan</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              View Details ↗
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <Maximize2 size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-900">{P.program.title}</p>
                  <span className="badge badge-green text-[10px] font-bold">{P.program.progress}% Progress</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{P.program.subtitle}</p>
              </div>
            </div>

            <div className="progress-track"><div className="progress-fill" style={{ width: `${P.program.progress}%` }} /></div>

            <div className="flex gap-3 text-xs pt-1">
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">FREQUENCY</span>
                <span className="font-bold text-slate-800 text-xs">{P.program.frequency}</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">DURATION</span>
                <span className="font-bold text-slate-800 text-xs">{P.program.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Pain Level & Body Focus Area Card (NEW) */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity size={16} className="text-red-500" /> Pain Rating & Body Focus Area
            </h3>
            <span className="badge badge-red text-[10px]">VAS 3 / 10 · Mild</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-red-50/60 p-3 rounded-xl border border-red-100 space-y-1">
              <span className="text-[9px] font-bold text-red-900 uppercase">PRIMARY FOCUS</span>
              <p className="font-bold text-slate-900">Lumbar Spine (L4-L5)</p>
              <p className="text-red-700 text-[10px] font-semibold">↓ Reduced from 7/10 at onset</p>
            </div>
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 space-y-1">
              <span className="text-[9px] font-bold text-amber-900 uppercase">SECONDARY AREA</span>
              <p className="font-bold text-slate-900">Left Gluteal Tightness</p>
              <p className="text-amber-700 text-[10px] font-semibold">Postural Compensation</p>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-[9px] font-bold text-emerald-900 uppercase">PAIN TRIGGER</span>
              <p className="font-bold text-slate-900">Prolonged Desk Sitting</p>
              <p className="text-emerald-700 text-[10px] font-semibold">Relieved by walking</p>
            </div>
          </div>
        </div>

        {/* 3. Today's Prescribed Exercises Compliance (NEW) */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell size={16} className="text-blue-600" /> Today's Routine Compliance
            </h3>
            <span className="text-xs font-bold text-blue-600">2 of 3 Completed</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                <span className="font-bold text-slate-900">Pelvic Tilts & Core Engagement</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">3/3 Sets Done</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                <span className="font-bold text-slate-900">Cat-Cow Spinal Stretch</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">2 Mins Completed</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px]">⏳</span>
                <span className="font-bold text-slate-800">Glute Bridges with Resistance Band</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Scheduled Evening</span>
            </div>
          </div>
        </div>

        {/* 4. Recovery Goals Card */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Recovery Goals</h3>
            <button className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200 text-xs">
              +
            </button>
          </div>

          <div className="space-y-2">
            {P.program.recoveryGoals.map((g) => (
              <div key={g.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs hover:bg-slate-100/50 transition-colors cursor-pointer" onClick={() => toggleGoal(g.id)}>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${g.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                  {g.done && <CheckCircle size={13} />}
                </div>
                <span className={`flex-1 font-medium ${g.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {g.text}
                </span>
                <span className={`badge text-[9px] font-bold ${g.tag === 'SHORT TERM' ? 'bg-slate-200 text-slate-700' : 'bg-purple-100 text-purple-700'}`}>
                  {g.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Care Team Members Widget */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope size={16} className="text-blue-600" /> Multidisciplinary Care Team
            </h3>
            <span className="text-xs text-slate-400">3 Specialists</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {P.careTeam.map((ct, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-center">
                <img src={ct.avatar} alt={ct.name} className="w-10 h-10 rounded-full mx-auto object-cover border border-blue-200" />
                <div>
                  <p className="font-bold text-slate-900">{ct.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{ct.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recent Reports Card */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Recent Reports</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>

          <div className="space-y-2">
            {P.recentReports.map((rep, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${rep.iconColor} flex items-center justify-center font-bold shrink-0`}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{rep.name}</p>
                    <p className="text-[10px] text-slate-400">{rep.date}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (SIDEBAR) */}
      <div className="space-y-5">
        
        {/* 1. Upcoming Appointments Card */}
        <div className="card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Appointments</h3>

          <div className="bg-blue-600 text-white p-4 rounded-2xl space-y-3 shadow-md">
            <div className="flex justify-between items-center text-[10px] font-bold text-blue-200 uppercase tracking-wider">
              <span>NEXT SESSION</span>
              <MoreHorizontal size={14} className="cursor-pointer" />
            </div>
            <div>
              <p className="text-sm font-bold">Feb 24</p>
              <p className="text-xs text-blue-100">10:30 AM – 11:30 AM</p>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-blue-500/50 text-xs">
              <img src={P.avatar} alt="Doctor" className="w-6 h-6 rounded-full object-cover border border-white" />
              <span className="font-bold text-white">Dr. Ananya Iyer</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center text-xs">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">UPCOMING</span>
              <p className="font-bold text-slate-800 mt-0.5">March 02</p>
              <p className="text-[10px] text-slate-400">02:15 PM • Video Call</p>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>

        {/* 2. Clinical Notes Card */}
        <div className="card p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Notes</h3>
            <button onClick={onAddNote} className="text-xs text-blue-600 font-bold hover:underline">
              + Add Note
            </button>
          </div>

          <div className="space-y-2.5">
            {P.clinicalNotes.map((note) => (
              <div key={note.id} className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs text-slate-700 italic leading-relaxed">{note.text}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                  <span>{note.date}</span>
                  <span>{note.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Quick Actions */}
        <div className="card p-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h3>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold" onClick={onAssign}>
            <Activity size={14} className="text-blue-600" /> Assign Program
          </button>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold">
            <Download size={14} className="text-purple-600" /> Upload Report
          </button>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold">
            <CreditCard size={14} className="text-amber-600" /> New Bill
          </button>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold hover:bg-red-50 hover:text-red-600" onClick={onFlag}>
            <Flag size={14} className="text-red-500" /> Flag Patient
          </button>
        </div>

      </div>

    </div>
  );
}

// ─── MEDICAL HISTORY TAB (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 2) ────────
function MedicalHistoryTab({ P }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* 1. Primary Diagnoses */}
        <div className="card p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope size={16} className="text-blue-600" /> Primary Diagnoses
            </h3>
            <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              ⊕ Add Record
            </button>
          </div>

          <div className="space-y-3">
            {P.primaryDiagnoses.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-3 text-xs">
                <div className={`w-9 h-9 rounded-full ${d.activeIcon ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-bold shrink-0 mt-0.5`}>
                  {d.activeIcon ? <Activity size={18} /> : <History size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">{d.title}</h4>
                  <p className="text-slate-500 mt-0.5">{d.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge bg-slate-200 text-slate-600 text-[9px] font-bold">{d.date}</span>
                    <span className={`badge text-[9px] font-bold ${d.statusColor}`}>{d.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Medical Timeline */}
        <div className="card p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Medical Timeline</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All Logs</button>
          </div>

          <div className="relative pl-6 space-y-6 text-xs before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {P.medicalTimeline.map((item) => (
              <div key={item.id} className="relative flex justify-between items-start">
                <div className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${item.active ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`} />
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  {item.isFile ? (
                    <a href="#download" className="text-blue-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline">
                      📄 {item.desc}
                    </a>
                  ) : (
                    <p className="text-slate-500 mt-0.5">{item.desc}</p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-4">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Surgical History */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Edit size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Surgical History</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {P.surgicalHistory.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                <span className="badge bg-slate-200 text-slate-600 text-[9px] font-bold uppercase">{s.dateTag}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{s.title}</h4>
                <p className="text-slate-500">{s.desc}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 font-semibold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                    👤
                  </div>
                  <span>{s.doctor || s.facility}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Family Medical History */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Activity size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Family Medical History</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {P.familyHistory.map((fam, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {fam.gender === 'male' ? '♂' : '♀'}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{fam.side}</span>
                  <p className="font-bold text-slate-900">{fam.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Lifestyle & Social History (NEW) */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck size={16} className="text-purple-600" /> Lifestyle & Ergonomic Factors
            </h3>
            <span className="badge badge-purple text-[9px]">Postural Assessment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
              <span className="text-[9px] font-bold text-purple-900 uppercase">OCCUPATION & POSTURE</span>
              <p className="font-bold text-slate-900">Software Engineer (Desk Job)</p>
              <p className="text-slate-500 text-[11px]">8+ hours sitting daily. Ergonomic setup advised.</p>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
              <span className="text-[9px] font-bold text-blue-900 uppercase">PHYSICAL ACTIVITY LEVEL</span>
              <p className="font-bold text-slate-900">Moderate (Recreational Tennis)</p>
              <p className="text-slate-500 text-[11px]">2 sessions/week prior to lumbar flare-up.</p>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-[9px] font-bold text-emerald-900 uppercase">HABITS & SLEEP</span>
              <p className="font-bold text-slate-900">Non-Smoker · 7.5 hrs Sleep</p>
              <p className="text-slate-500 text-[11px]">Sleep quality high, side-sleeper with knee pillow.</p>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
              <span className="text-[9px] font-bold text-amber-900 uppercase">LAB & VITAMIN D LEVELS</span>
              <p className="font-bold text-slate-900">Vitamin D3: 18 ng/mL (Low)</p>
              <p className="text-slate-500 text-[11px]">Weekly 60k IU supplement prescribed.</p>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (SIDEBAR) */}
      <div className="space-y-5">
        
        {/* 1. Allergies Card (Red Border Top Card) */}
        <div className="card p-5 space-y-3 border-t-4 border-t-red-500 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
            <AlertTriangle size={16} />
            <span>Allergies</span>
          </div>

          <div className="space-y-3">
            {P.allergies.map((all, i) => (
              <div key={i} className="p-3 bg-red-50/50 rounded-2xl border border-red-100 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{all.name}</span>
                  <span className={`badge text-[9px] font-bold ${all.severity === 'SEVERE' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    {all.severity}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">{all.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Enhanced Prescription & Medication History Card */}
        <div className="card p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Pill size={14} className="text-purple-600" /> Active Medications
            </h3>
            <span className="badge badge-purple text-[9px] font-bold">3 Prescriptions</span>
          </div>

          <div className="space-y-3">
            {P.medications.map((m, i) => (
              <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{m.name}</span>
                  <span className="badge bg-purple-100 text-purple-800 text-[9px] font-bold">{m.status || 'Active'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>📅 {m.freq}</span>
                  <span>Dr. {m.doctor || 'Ananya Iyer'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Past / Discontinued Medications */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">PAST / SOS MEDICATIONS</span>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Thiocolchicoside 4mg (Muscle Relaxant)</span>
              <span className="text-slate-400">Ended Sep 2024</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Paracetamol 650mg</span>
              <span className="text-slate-400">SOS (As Needed)</span>
            </div>
          </div>

          {/* Preferred Pharmacy */}
          <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 flex justify-between items-center text-[11px]">
            <div>
              <span className="text-[9px] font-bold text-purple-900 uppercase block">PREFERRED PHARMACY</span>
              <span className="font-bold text-slate-800">Apollo Pharmacy (Indiranagar)</span>
            </div>
            <span className="badge badge-green text-[9px]">Auto-Refill</span>
          </div>

          <button className="btn btn-secondary w-full justify-center text-xs text-slate-700 font-bold" onClick={() => alert('Opening Medication Regimen Editor…')}>
            <Plus size={13} /> Update Regimen / Add Rx
          </button>
        </div>

        {/* 3. Vital Metrics Card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <Activity size={16} /> Vital Metrics
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Blood Type</span>
              <span className="font-bold text-blue-600">{P.vitalMetrics.bloodType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Height</span>
              <span className="font-bold text-slate-800">{P.vitalMetrics.height}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Weight</span>
              <span className="font-bold text-slate-800">{P.vitalMetrics.weight}</span>
            </div>
          </div>

          {/* BMI Box */}
          <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">BMI INDEX</span>
                <span className="text-base font-extrabold text-slate-900">{P.vitalMetrics.bmi}</span>
              </div>
              <span className="badge badge-blue text-[9px] font-bold">{P.vitalMetrics.bmiCategory}</span>
            </div>

            <div className="progress-track h-2 bg-slate-200">
              <div className="progress-fill bg-blue-600" style={{ width: '45%' }} />
            </div>

            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase">
              <span>UNDER</span>
              <span>IDEAL RANGE</span>
              <span>OVER</span>
            </div>
          </div>
        </div>

        {/* 4. Clinician Notes */}
        <div className="card p-5 space-y-2 bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
            <MapPin size={14} className="text-blue-600" /> Clinician Notes
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {P.clinicianNotesText}
          </p>
        </div>

      </div>

    </div>
  );
}

// ─── PROGRAMS TAB (100% MATCH FOR REFERENCE DESIGN SCREENSHOT) ────────────────
function ProgramsTab({ P }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start animate-fade-up">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* 1. Active Programs */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Programs</h3>
              <p className="text-xs text-slate-400">Ongoing physical therapy protocols prescribed by Dr. Iyer</p>
            </div>
            <span className="text-xs font-bold text-blue-600">1 Active Protocol</span>
          </div>

          <div className="card p-5 space-y-4 border-l-4 border-l-emerald-500 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="badge badge-blue text-[9px] uppercase font-bold">HIGH PRIORITY</span>
                <p className="text-[11px] text-slate-400 mt-1">Assigned by Dr. Ananya Iyer</p>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{P.program.title}</h4>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-blue-600">80%</p>
                <p className="text-[10px] text-slate-400 font-semibold">Overall Compliance</p>
              </div>
            </div>

            <div className="progress-track h-2 bg-slate-100">
              <div className="progress-fill bg-blue-600" style={{ width: '80%' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">SCHEDULE</span>
                <span className="font-bold text-slate-800 text-xs">{P.program.sessionsPerWeek}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">DURATION</span>
                <span className="font-bold text-slate-800 text-xs">{P.program.duration}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">EXERCISES</span>
                <span className="font-bold text-slate-800 text-xs">{P.program.exercisesCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button className="btn btn-primary btn-sm text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold">
                <Play size={13} /> Video Tutorial access
              </button>
              <button className="btn btn-secondary btn-sm text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 text-slate-700 font-bold">
                <FileText size={13} /> Exercise List
              </button>
              <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50">
                <BarChart2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Today's Prescribed Exercises */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Today's Prescribed Exercises</h3>

          <div className="grid grid-cols-2 gap-4">
            {P.program.exercises.map((ex, idx) => (
              <div key={idx} className="card overflow-hidden group shadow-sm border border-slate-200/80">
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img src={ex.thumb} alt={ex.name} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 badge badge-blue text-[9px] font-bold uppercase tracking-wider">{ex.tag}</span>
                  <p className="absolute bottom-3 left-24 font-bold text-white text-sm drop-shadow">{ex.name}</p>
                </div>

                <div className="p-3.5 flex justify-between items-center text-xs bg-white">
                  <div>
                    {ex.sets ? (
                      <div className="flex gap-4">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">SETS</span>
                          <span className="font-extrabold text-slate-900 text-sm">{ex.sets}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">REPS</span>
                          <span className="font-extrabold text-slate-900 text-sm">{ex.reps}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">DURATION</span>
                          <span className="font-extrabold text-slate-900 text-sm">{ex.duration}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">INTENSITY</span>
                          <span className="font-extrabold text-slate-900 text-sm">{ex.intensity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-600 hover:text-white transition-colors">
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recommended Supplementary Care */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recommended Supplementary Care</h3>
            <p className="text-xs text-slate-400">Programs that align with Sanya's recovery trajectory</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {P.program.recommended.map((rec, idx) => (
              <div key={idx} className="card overflow-hidden space-y-3 p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  {rec.tag && <span className="badge badge-blue text-[9px] uppercase font-bold w-fit">{rec.tag}</span>}
                  <img src={rec.img} alt={rec.name} className="w-full h-36 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{rec.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.desc}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-400 font-semibold text-[11px]">{rec.duration}</span>
                  <div className="flex gap-2">
                    <button className="text-blue-600 font-bold hover:underline text-xs">Preview</button>
                    <button className="btn btn-primary btn-sm text-xs py-1.5 px-3 rounded-lg font-bold">Assign</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (SIDEBAR) */}
      <div className="space-y-5">
        
        {/* 1. Current Goals Progress Meters */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
            <Flag size={14} className="text-blue-600" />
            <span>Current Goals</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Pain Reduction</span>
                <span className="text-blue-600 font-bold">70%</span>
              </div>
              <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-blue-600" style={{ width: '70%' }} /></div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Mobility</span>
                <span className="text-teal-600 font-bold">45%</span>
              </div>
              <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-teal-500" style={{ width: '45%' }} /></div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Strength</span>
                <span className="text-purple-600 font-bold">30%</span>
              </div>
              <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-purple-600" style={{ width: '30%' }} /></div>
            </div>
          </div>
        </div>

        {/* 2. Upcoming Milestones */}
        <div className="card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Milestones</h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar size={15} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Next Review</p>
                <p className="text-[10px] text-slate-400">28 Oct, 2023</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <Clock size={15} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Next Session</p>
                <p className="text-[10px] text-slate-400">Tomorrow, 10:30 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <CheckCircle size={15} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Est. Completion</p>
                <p className="text-[10px] text-slate-400">15 Nov, 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions */}
        <div className="card p-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h3>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold">
            <Plus size={14} className="text-blue-600" /> Assign Exercise
          </button>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold">
            <Edit size={14} className="text-purple-600" /> Modify Program
          </button>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold">
            <Calendar size={14} className="text-amber-600" /> Schedule Review
          </button>
          <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-semibold">
            <Send size={14} className="text-emerald-600" /> Send Reminder
          </button>
        </div>

        {/* 4. Patient History Summary Quote */}
        <div className="card p-5 space-y-2 bg-slate-50/80 border-slate-200">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PATIENT HISTORY SUMMARY</h3>
          <p className="text-xs text-slate-700 italic leading-relaxed">
            "Lumbar stabilization has shown 12% improvement in mobility range since last assessment."
          </p>
          <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 pt-1">
            <Eye size={13} /> View full clinical notes
          </button>
        </div>

        {/* 5. Physio Assistant AI Box */}
        <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 space-y-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
            <Sparkles size={16} /> Physio Assistant AI
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Analyze Sanya's performance and get auto-adjustments for her next program.
          </p>
          <button className="btn btn-primary w-full justify-center text-xs py-2 bg-blue-600 hover:bg-blue-500 font-bold">
            Launch Analysis
          </button>
        </div>

      </div>

    </div>
  );
}

// ─── PROGRESS TAB (100% MATCH FOR REFERENCE DESIGN SCREENSHOT) ────────────────
function ProgressTab({ P }) {
  const [shareToggle, setShareToggle] = useState(true);
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Metric 1: Recovery Score */}
        <div className="card p-4 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Recovery Score</span>
            <span className="badge badge-blue text-[10px] font-bold">↗ +4%</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center font-extrabold text-sm text-slate-900 shrink-0">
              78%
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">Last week: 74%</p>
              <p className="text-[11px] text-blue-600 font-bold">Ahead of schedule</p>
            </div>
          </div>
        </div>

        {/* Metric 2: Avg Pain Level */}
        <div className="card p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Avg. Pain Level</span>
            <span className="badge badge-blue text-[10px] font-bold">-1.2 pts</span>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">3.2 <span className="text-xs text-slate-400 font-medium">/ 10</span></p>
            <div className="flex items-center gap-1 mt-2">
              {[4, 3.8, 3.5, 3.4, 3.2].map((v, i) => (
                <div key={i} className="w-5 bg-blue-600 rounded-full" style={{ height: `${v * 4}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Metric 3: Range of Motion */}
        <div className="card p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Range of Motion</span>
            <span className="badge badge-blue text-[10px] font-bold uppercase">EXCELLENT</span>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">85% <span className="text-xs text-slate-400 font-semibold">Mobility</span></p>
            <div className="progress-track h-2 bg-slate-100 mt-2">
              <div className="progress-fill bg-blue-600" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
              <span>START: 40%</span>
              <span>TARGET: 95%</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Compliance Rate */}
        <div className="card p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Compliance Rate</span>
            <CheckCircle size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">92% <span className="text-xs text-slate-400 font-semibold">Adherence</span></p>
            <div className="flex gap-1.5 mt-2">
              {['M', 'T', 'W', 'T', 'F'].map((day, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── MAIN BODY GRID: CHART & SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        
        {/* LEFT COLUMN: CHART & MOBILITY TILE CARDS */}
        <div className="space-y-6">
          
          {/* Pain & Activity Correlation Chart */}
          <div className="card p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pain and Activity Correlation</h3>
                <p className="text-xs text-slate-400">Analyzing intensity vs. exercise load over 8 weeks</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-300" /> Exercise Min
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Pain Score
                </span>
              </div>
            </div>

            {/* AI Recovery Trajectory Forecast Banner (NEW) */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3.5 rounded-2xl flex justify-between items-center text-xs shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/80 backdrop-blur-md flex items-center justify-center font-bold text-white shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-bold text-white">AI Recovery Trajectory Forecast</p>
                  <p className="text-[11px] text-blue-200">On track for 100% full ambulation by Nov 15, 2024 (96% AI Confidence).</p>
                </div>
              </div>
              <span className="badge bg-emerald-500 text-white font-bold text-[9px] shrink-0">+12% Velocity</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { week: 'W1', pain: 7.2, load: 15 },
                  { week: 'W2', pain: 6.5, load: 20 },
                  { week: 'W3', pain: 6.8, load: 25 },
                  { week: 'W4', pain: 5.4, load: 35 },
                  { week: 'W5', pain: 4.2, load: 45 },
                  { week: 'W6', pain: 3.5, load: 50 },
                  { week: 'W7', pain: 2.8, load: 60 },
                  { week: 'W8', pain: 2.1, load: 65 },
                ]}>
                  <defs>
                    <linearGradient id="exerciseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="load" name="Exercise Min" stroke="#14b8a6" fill="url(#exerciseGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="pain" name="Pain Score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mobility Breakdown */}
          <div className="card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Mobility Breakdown</h3>
              <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                Last updated via AI Gait Sync: Today, 09:12 AM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">LUMBAR FLEXION</span>
                <p className="text-base font-extrabold text-slate-900">72°</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-slate-400">Target: 70°</span>
                  <span className="badge badge-green text-[8px] font-bold">ACHIEVED</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">LATERAL ROTATION</span>
                <p className="text-base font-extrabold text-slate-900">34°</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-slate-400">Target: 30°</span>
                  <span className="badge badge-green text-[8px] font-bold">ACHIEVED</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">HIP EXTENSION</span>
                <p className="text-base font-extrabold text-slate-900">12°</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-slate-400">Target: 20°</span>
                  <span className="badge badge-blue text-[8px] font-bold">IN PROGRESS</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">CORE STABILITY</span>
                <p className="text-base font-extrabold text-slate-900">B+</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-slate-400">Target: A-</span>
                  <span className="badge badge-blue text-[8px] font-bold">IN PROGRESS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Biomechanics & Quad Symmetry Widget (NEW) */}
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity size={16} className="text-teal-600" /> Quad Muscle Symmetry & Gait Analysis
              </h3>
              <span className="badge badge-purple text-[9px]">8% Imbalance</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Left Quad Strength</span>
                  <span className="text-blue-600">88%</span>
                </div>
                <div className="progress-track h-2 bg-slate-200"><div className="progress-fill bg-blue-600" style={{ width: '88%' }} /></div>
                <p className="text-[10px] text-slate-400">Reconstructed Knee Limb</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Right Quad Strength</span>
                  <span className="text-emerald-600">96%</span>
                </div>
                <div className="progress-track h-2 bg-slate-200"><div className="progress-fill bg-emerald-600" style={{ width: '96%' }} /></div>
                <p className="text-[10px] text-slate-400">Healthy Reference Limb</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-5">
          
          {/* 1. Functional Goals */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Functional Goals</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span>Squat Depth</span>
                  <span className="text-blue-600 font-bold">90%</span>
                </div>
                <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-blue-600" style={{ width: '90%' }} /></div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span>Walking Distance</span>
                  <span className="text-blue-600 font-bold">75%</span>
                </div>
                <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-blue-600" style={{ width: '75%' }} /></div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span>Single Leg Balance</span>
                  <span className="text-blue-600 font-bold">60%</span>
                </div>
                <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-blue-600" style={{ width: '60%' }} /></div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1">
                  <span>Ascending Stairs</span>
                  <span className="text-blue-600 font-bold">45%</span>
                </div>
                <div className="progress-track h-2 bg-slate-100"><div className="progress-fill bg-blue-600" style={{ width: '45%' }} /></div>
              </div>
            </div>

            <button className="btn btn-secondary w-full justify-center text-xs font-bold mt-2" onClick={() => alert('Editing functional milestones…')}>
              Update Functional Milestones
            </button>
          </div>

          {/* 2. Quick Actions */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>

            <button className="btn btn-secondary w-full justify-center text-xs text-slate-700 font-bold py-2.5" onClick={() => alert('Exporting PDF Progress Report…')}>
              📄 Export Progress Report
            </button>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-800">Share with Patient</span>
              <button
                onClick={() => setShareToggle(!shareToggle)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 ${shareToggle ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${shareToggle ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* 3. Clinician Observations */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinician Observations</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-slate-700 italic leading-relaxed">
                  "Sanya has shown significant improvement in quadriceps activation. We can begin introducing eccentric loading exercises."
                </p>
                <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                  Dr. Rao · 2 days ago
                </p>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-slate-700 italic leading-relaxed">
                  "Pain spikes noted during cold weather; recommended heat therapy."
                </p>
                <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                  Dr. Rao · 1 week ago
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// ─── REPORTS TAB (100% MATCH FOR REFERENCE DESIGN SCREENSHOT) ────────────────
function ReportsTab({ P }) {
  const recentReportsList = [
    {
      id: 'rep_1',
      title: 'MRI Lumbar Spine',
      date: '24 Oct 2024 • 12.4 MB',
      status: 'VERIFIED',
      statusColor: 'badge-green',
      iconBg: 'bg-teal-100 text-teal-600',
    },
    {
      id: 'rep_2',
      title: 'Initial Assessment',
      date: '18 Oct 2024 • 2.1 MB',
      status: 'VERIFIED',
      statusColor: 'badge-green',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'rep_3',
      title: 'Biomechanical Analysis',
      date: '02 Nov 2024 • 45.8 MB',
      status: 'PENDING',
      statusColor: 'badge-amber',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'rep_4',
      title: 'Progress Summary Q3',
      date: '30 Sep 2024 • 1.4 MB',
      status: 'VERIFIED',
      statusColor: 'badge-green',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ];

  const reportHistoryTable = [
    { name: 'Physio Intake Form', category: 'Assessment', date: '15 Oct 2024', status: 'Verified', statusBadge: 'badge-green' },
    { name: 'X-Ray Pelvis', category: 'Imaging', date: '12 Oct 2024', status: 'Verified', statusBadge: 'badge-green' },
    { name: 'ROM Measurements', category: 'Progress', date: '01 Nov 2024', status: 'Pending', statusBadge: 'badge-amber' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start animate-fade-up">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* 1. Upload Clinical Documents Dropzone */}
        <div className="card border-2 border-dashed border-blue-200 p-8 text-center bg-blue-50/20 space-y-3 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Upload size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upload Clinical Documents</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Drag and drop MRI, CT scans, or clinical notes here. Supported formats: PDF, DICOM, JPEG.
            </p>
          </div>
          <button className="btn btn-secondary text-xs px-5 py-2 font-bold bg-white border border-slate-200 shadow-sm" onClick={() => alert('Select file from computer…')}>
            Select Files
          </button>
        </div>

        {/* 2. Recent Reports 2x2 Grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Recent Reports</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All →</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recentReportsList.map((rep) => (
              <div key={rep.id} className="card p-4 space-y-3 shadow-sm border border-slate-200/80">
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl ${rep.iconBg} flex items-center justify-center font-bold`}>
                    <FileText size={18} />
                  </div>
                  <span className={`badge text-[9px] font-bold ${rep.statusColor}`}>{rep.status}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rep.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{rep.date}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button className="btn btn-secondary text-xs py-1.5 flex-1 justify-center bg-slate-50 font-semibold" onClick={() => alert(`Viewing ${rep.title}`)}>
                    <Eye size={13} /> View
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 shrink-0" onClick={() => alert(`Downloading ${rep.title}`)}>
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Report History Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Report History</h3>
          </div>

          <table className="tbl w-full">
            <thead>
              <tr>
                <th>REPORT NAME</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th className="text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {reportHistoryTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <FileText size={14} className="text-blue-600" /> {row.name}
                  </td>
                  <td className="text-xs text-slate-500">{row.category}</td>
                  <td className="text-xs text-slate-500">{row.date}</td>
                  <td>
                    <span className={`badge text-[9px] font-bold ${row.statusBadge}`}>
                      ● {row.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Showing 3 of 18 reports</span>
            <div className="flex gap-1">
              <button className="w-6 h-6 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600">‹</button>
              <button className="w-6 h-6 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600">›</button>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (SIDEBAR) */}
      <div className="space-y-5">
        
        {/* 1. Quick Actions */}
        <div className="card p-5 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quick Actions</h3>

          <button className="btn btn-primary w-full justify-center text-xs font-bold py-2.5 bg-blue-700 hover:bg-blue-600" onClick={() => alert('Generating AI Progress Report…')}>
            <Sparkles size={14} /> Generate Progress Report
          </button>
          <button className="btn btn-secondary w-full justify-center text-xs text-slate-700 font-semibold py-2 bg-blue-50 border-blue-100 hover:bg-blue-100" onClick={() => alert('Link copied to share with patient!')}>
            <Share2 size={14} className="text-blue-600" /> Share with Patient
          </button>
          <button className="btn btn-secondary w-full justify-center text-xs text-slate-700 font-semibold py-2 bg-blue-50 border-blue-100 hover:bg-blue-100" onClick={() => alert('Exporting complete medical record ZIP…')}>
            <Download size={14} className="text-blue-600" /> Export Medical Record
          </button>
          <button className="btn btn-secondary w-full justify-center text-xs text-red-600 font-semibold py-2 bg-red-50 border-red-100 hover:bg-red-100" onClick={() => alert('Records archived.')}>
            <Trash2 size={14} className="text-red-500" /> Archive Records
          </button>
        </div>

        {/* 2. Storage Usage Bar */}
        <div className="card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Usage</h3>

          <div className="flex justify-between items-center text-xs font-bold text-slate-900">
            <span>154.2 MB of 1 GB</span>
            <span className="text-blue-600">15%</span>
          </div>

          <div className="progress-track h-2 bg-slate-100">
            <div className="progress-fill bg-blue-600" style={{ width: '15%' }} />
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            Clinical data is end-to-end encrypted and HIPAA compliant.
          </p>
        </div>

        {/* 3. Recently Shared Stack */}
        <div className="card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recently Shared</h3>

          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center border border-white shadow-sm">AS</div>
            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center border border-white shadow-sm">SM</div>
            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 font-bold text-[10px] flex items-center justify-center border border-white shadow-sm">AI</div>
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center border border-white shadow-sm">+2</div>
          </div>

          <p className="text-[10px] text-slate-400">
            Last shared with Dr. Ananya Iyer on 03 Nov.
          </p>
        </div>

      </div>

    </div>
  );
}

// ─── PAYMENTS TAB (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 6) ─────────────
function PaymentsTab({ P }) {
  const billingHistory = P?.payments?.history?.map(h => ({
    invId: h.invId || 'INV-8021',
    date: h.date || 'Oct 12, 2024',
    desc: h.desc || 'Physiotherapy Session',
    amount: typeof h.amount === 'number' ? `₹${h.amount.toLocaleString('en-IN')}` : h.amount || '₹4,500',
    status: h.status || 'Paid',
    badge: h.status === 'Paid' ? 'badge-emerald' : 'badge-amber',
  })) || [
    { invId: 'INV-8021', date: 'Oct 12, 2024', desc: 'Physiotherapy Session × 4', amount: '₹4,500', status: 'Paid', badge: 'badge-emerald' },
    { invId: 'INV-7954', date: 'Sep 28, 2024', desc: 'ACL Rehab Package (Initial)', amount: '₹12,000', status: 'Paid', badge: 'badge-emerald' },
    { invId: 'INV-7810', date: 'Sep 10, 2024', desc: 'Consultation & Diagnostics', amount: '₹2,500', status: 'Paid', badge: 'badge-emerald' },
    { invId: 'INV-8102', date: 'Nov 02, 2024', desc: 'Home Visit Surcharge', amount: '₹1,800', status: 'Pending', badge: 'badge-amber' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Billed */}
        <div className="card p-5 space-y-1 border-l-4 border-l-blue-600 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL BILLED</span>
          <p className="text-2xl font-extrabold text-slate-900">₹42,500</p>
          <p className="text-xs text-emerald-600 font-bold pt-1 flex items-center gap-1">
            ↗ 8 sessions billed in 2024
          </p>
        </div>

        {/* Outstanding */}
        <div className="card p-5 space-y-1 border-l-4 border-l-amber-500 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OUTSTANDING</span>
          <p className="text-2xl font-extrabold text-red-600">₹8,000</p>
          <p className="text-xs text-amber-600 font-bold pt-1 flex items-center gap-1">
            ⏱ Next payment due in 3 days
          </p>
        </div>

        {/* Insurance Status */}
        <div className="card p-5 space-y-1 border-l-4 border-l-emerald-600 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INSURANCE STATUS</span>
          <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-1.5">
            Verified <CheckCircle size={20} className="text-blue-600" />
          </p>
          <p className="text-xs text-slate-500 font-semibold pt-1 flex items-center gap-1">
            🛡️ HDFC ERGO Health Care
          </p>
        </div>

      </div>

      {/* ── ROW 2: MAIN BODY GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* Billing History Table */}
          <div className="card overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Billing History</h3>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><Filter size={15} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><Download size={15} /></button>
              </div>
            </div>

            <table className="tbl w-full">
              <thead>
                <tr>
                  <th>INVOICE ID</th>
                  <th>DATE</th>
                  <th>DESCRIPTION</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th className="text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((inv) => (
                  <tr key={inv.invId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="font-mono text-xs font-bold text-blue-600">{inv.invId}</td>
                    <td className="text-xs text-slate-500">{inv.date}</td>
                    <td className="text-xs font-semibold text-slate-800">{inv.desc}</td>
                    <td className="font-bold text-xs text-slate-900">{inv.amount}</td>
                    <td>
                      <span className={`badge text-[9px] font-bold ${inv.badge}`}>{inv.status}</span>
                    </td>
                    <td className="text-right">
                      <button className="text-xs text-blue-600 font-bold hover:underline" onClick={() => alert(`Viewing Invoice ${inv.invId}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <button className="text-xs text-blue-600 font-bold hover:underline" onClick={() => alert('Opening Full Transaction History…')}>
                View Full Transaction History ›
              </button>
            </div>
          </div>

          {/* Active Insurance Card */}
          <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Active Insurance</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">PROVIDER</span>
                <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  🏥 HDFC ERGO Health
                </p>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">POLICY NUMBER</span>
                <p className="font-mono font-bold text-slate-800 mt-1">HEP-90123-2024-MH</p>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">COVERAGE</span>
                <p className="font-bold text-teal-600 mt-1">80% Reimbursable</p>
                <div className="progress-track h-1.5 bg-slate-100 mt-1.5">
                  <div className="progress-fill bg-teal-500" style={{ width: '80%' }} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 text-slate-500 font-medium">
              <div className="flex gap-4">
                <span>📅 Valid till Jan 2025</span>
                <span>📞 1800-22-4444</span>
              </div>
              <button className="text-blue-600 font-bold hover:underline flex items-center gap-1" onClick={() => alert('Editing Insurance Details…')}>
                ✏️ Update Details
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-5">
          
          {/* 1. Quick Actions */}
          <div className="card p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quick Actions</h3>

            <button className="btn btn-primary w-full justify-between text-xs font-bold py-2.5 bg-blue-700 hover:bg-blue-600" onClick={() => alert('Generating Invoice…')}>
              <span className="flex items-center gap-2">📄 Generate Invoice</span>
              <span>›</span>
            </button>

            <button className="btn btn-primary w-full justify-between text-xs font-bold py-2.5 bg-teal-700 hover:bg-teal-600" onClick={() => alert('Recording Payment…')}>
              <span className="flex items-center gap-2">💳 Record Payment</span>
              <span>›</span>
            </button>

            <button className="btn btn-secondary w-full justify-between text-xs text-slate-700 font-semibold py-2 bg-blue-50 border-blue-100 hover:bg-blue-100" onClick={() => alert('Payment Reminder Sent!')}>
              <span className="flex items-center gap-2"><Send size={14} className="text-blue-600" /> Send Reminder</span>
              <span>›</span>
            </button>
          </div>

          {/* 2. Payment Methods */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Methods</h3>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex justify-between items-center text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-blue-900 italic text-sm">VISA</span>
                <div>
                  <p className="font-mono font-bold text-slate-900">•••• 4421</p>
                  <p className="text-[10px] text-slate-400">Expires 10/26</p>
                </div>
              </div>
              <CheckCircle size={16} className="text-teal-600" />
            </div>

            <button className="btn btn-secondary w-full justify-center text-xs text-slate-700 font-bold border-dashed border-slate-300 py-2.5" onClick={() => alert('Adding new payment method…')}>
              <Plus size={14} /> Add new method
            </button>
          </div>

          {/* 3. Billing Forecast */}
          <div className="card p-5 space-y-3 bg-slate-50/80 border border-dashed border-slate-300 text-center">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
              <BarChart2 size={16} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Billing Forecast</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Estimated bill for next 4 sessions is approx.</p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">₹16,000</p>
            </div>
            <button className="text-xs text-blue-600 font-bold hover:underline block mx-auto" onClick={() => alert('Downloading Projection PDF…')}>
              Download Projection
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

// ─── NOTES TAB (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 7) ─────────────────
function NotesTab({ P, onAddNote }) {
  const [internalOnlyToggle, setInternalOnlyToggle] = useState(false);

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* TOP CONTROLS BAR */}
      <div className="flex flex-wrap justify-between items-center gap-3 card p-4">
        <div className="flex items-center gap-3">
          <select className="select text-xs py-1.5 bg-slate-50 w-40 font-semibold">
            <option value="All">All Categories</option>
            <option value="Session Note">Session Notes</option>
            <option value="Internal">Internal Notes</option>
            <option value="Assessment">Assessments</option>
          </select>

          <button className="btn btn-secondary text-xs py-1.5 px-3 font-semibold text-slate-600 bg-slate-50">
            <Calendar size={14} /> Date Range
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-600 font-semibold">
            <span>Internal Only</span>
            <button
              onClick={() => setInternalOnlyToggle(!internalOnlyToggle)}
              className={`w-10 h-5 rounded-full transition-colors p-0.5 ${internalOnlyToggle ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${internalOnlyToggle ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <button onClick={onAddNote} className="btn btn-primary text-xs font-bold py-2 px-4 bg-blue-700 hover:bg-blue-600">
          <Plus size={14} /> Add New Note
        </button>
      </div>

      {/* MAIN BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        
        {/* LEFT COLUMN: NOTES FEED */}
        <div className="space-y-4">
          
          {/* Note Card 1 */}
          <div className="card p-5 space-y-3 border-l-4 border-l-blue-600 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Session Note - Lower Lumbar Focus</h4>
                  <p className="text-[11px] text-slate-400">22 Feb 2024, 10:30 AM · Dr. Ananya Iyer</p>
                </div>
              </div>
              <span className="badge badge-blue text-[9px] font-bold uppercase">SESSION NOTE</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Sanya reported a significant reduction in morning stiffness compared to last week (3/10 vs 6/10 on VAS). Today's focus was on dynamic lumbar stabilization and progressive loading of the posterior chain.
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              Observed slight compensation in right hip during single-leg bridge exercises. Corrected with tactile cues to pelvis. Patient was able to complete 3 sets of 12 reps with good form afterwards.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="badge bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium flex items-center gap-1">
                📄 Mobility_Report_V2.pdf
              </span>
              <span className="badge bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium flex items-center gap-1">
                📋 Exercise Log
              </span>
            </div>
          </div>

          {/* Note Card 2 (Internal Private) */}
          <div className="card p-5 space-y-3 border-l-4 border-l-slate-800 bg-slate-50/60 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Private Note: Therapist Transition</h4>
                  <p className="text-[11px] text-slate-400">20 Feb 2024, 04:15 PM · Dr. Ananya Iyer</p>
                </div>
              </div>
              <span className="badge bg-slate-800 text-white text-[9px] font-bold uppercase">INTERNAL</span>
            </div>

            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Patient is highly motivated but tends to over-train at home. Suggested a strict rest day on Sundays. If her ROM doesn't improve by next Friday, consider referring back to Dr. Kapoor for a fresh MRI consult on L4-L5."
            </p>
          </div>

          {/* Note Card 3 */}
          <div className="card p-5 space-y-3 border-l-4 border-l-teal-500 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                  <Search size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Initial Assessment - Post-Op Review</h4>
                  <p className="text-[11px] text-slate-400">15 Feb 2024, 09:00 AM · Dr. Rajesh Mehta</p>
                </div>
              </div>
              <span className="badge badge-green text-[9px] font-bold uppercase">ASSESSMENT</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Standard post-operative review 6 weeks following microdiscectomy. Scar tissue healing well. Baseline flexion/extension measurements recorded in 'Progress' tab. Patient cleared for Phase 2 rehabilitation.
            </p>
          </div>

          {/* Footer Load Button */}
          <button className="btn btn-secondary text-xs mx-auto block px-6 py-2 rounded-full font-bold text-slate-600 bg-white border border-slate-200">
            Load previous notes
          </button>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-5">
          
          {/* Quick Actions */}
          <div className="card p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quick Actions</h3>

            <button className="btn btn-secondary w-full justify-start text-xs text-red-600 font-bold bg-red-50 border-red-100 hover:bg-red-100" onClick={() => alert('Flagged for review!')}>
              <Flag size={14} className="text-red-500" /> Flag for Review
            </button>
            <button className="btn btn-secondary w-full justify-start text-xs text-blue-600 font-bold bg-blue-50 border-blue-100 hover:bg-blue-100" onClick={() => alert('Shared with specialist!')}>
              <Share2 size={14} className="text-blue-600" /> Share with Specialist
            </button>
            <button className="btn btn-secondary w-full justify-start text-xs text-slate-700 font-bold py-2" onClick={() => alert('Exporting PDF…')}>
              <Download size={14} className="text-slate-500" /> Export Notes (PDF)
            </button>
          </div>

          {/* Recovery Snapshot */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recovery Snapshot</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Protocol</span>
                <span className="font-bold text-slate-900">Lumbar Stabilization</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Phase</span>
                <span className="font-bold text-slate-900">2 of 4</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                <span>OVERALL PROGRESS</span>
                <span className="text-blue-600">80%</span>
              </div>
              <div className="progress-track h-2 bg-slate-100">
                <div className="progress-fill bg-blue-600" style={{ width: '80%' }} />
              </div>
            </div>
          </div>

          {/* Files & Links */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Files & Links</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                  📄
                </div>
                <div>
                  <p className="font-bold text-slate-900">MRI_Lumbosacral.pdf</p>
                  <p className="text-[10px] text-slate-400">Added 10 Feb 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  📹
                </div>
                <div>
                  <p className="font-bold text-slate-900">Gait_Analysis_V1.mp4</p>
                  <p className="text-[10px] text-slate-400">Added 05 Feb 2024</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// ─── HISTORY (ACTIVITY LOG / AUDIT TRAIL) TAB (100% MATCH FOR REFERENCE SCREENSHOT 8) ────────
function HistoryTab({ P }) {
  const [activeStaffFilter, setActiveStaffFilter] = useState('All');
  const [catFilter, setCatFilter]                   = useState('All Activities');

  return (
    <div className="space-y-6 animate-fade-up">
      
      {/* HEADER */}
      <div className="flex justify-between items-center card p-4">
        <h3 className="text-base font-bold text-slate-900">Activity Log</h3>
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          📅 Oct 1, 2023 - Oct 25, 2023
        </span>
      </div>

      {/* MAIN BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        
        {/* LEFT COLUMN: VERTICAL NODE TIMELINE */}
        <div className="space-y-6">
          
          {/* GROUP 1: Today, Oct 25 */}
          <div className="space-y-3 relative pl-6 border-l-2 border-l-blue-200">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
            <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">Today, Oct 25</h4>

            {/* Node 1 */}
            <div className="card p-4 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <FileText size={15} />
                </div>
                <h5 className="font-bold text-xs text-slate-900">Dr. Ananya Iyer added a clinical note</h5>
              </div>
              <p className="text-xs text-slate-600 italic pl-9 leading-relaxed">
                "Patient showing 10% increase in knee flexion. Pain levels reported at 2/10 during extension exercises."
              </p>
              <div className="pl-9 pt-1 text-[10px] text-slate-400 font-bold uppercase">
                11:45 AM · CLINICAL UPDATE
              </div>
            </div>

            {/* Node 2 */}
            <div className="card p-4 space-y-1.5 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    💳
                  </div>
                  <h5 className="font-bold text-xs text-slate-900">Payment Success - Session Fee</h5>
                </div>
                <span className="badge badge-green text-[9px] font-bold">● ₹1,200 RECEIVED</span>
              </div>
              <div className="pl-9 pt-1 text-[10px] text-slate-400 font-bold uppercase">
                09:15 AM · BILLING
              </div>
            </div>
          </div>

          {/* GROUP 2: Monday, Oct 23 */}
          <div className="space-y-3 relative pl-6 border-l-2 border-l-slate-200">
            <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-slate-400" />
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Monday, Oct 23</h4>

            {/* Node 3 */}
            <div className="card p-4 space-y-1.5 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar size={15} />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900">Admin (Priya S.) rescheduled an appointment</h5>
                </div>
                <span className="badge bg-blue-50 text-blue-700 text-[9px] font-mono font-bold">
                  Oct 24, 4:00 PM → Oct 26, 11:00 AM
                </span>
              </div>
              <div className="pl-9 pt-1 text-[10px] text-slate-400 font-bold uppercase">
                04:30 PM · SCHEDULING
              </div>
            </div>

            {/* Node 4 */}
            <div className="card p-4 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  📄
                </div>
                <h5 className="font-bold text-xs text-slate-900">Patient Portal - MRI Report Uploaded</h5>
              </div>
              <p className="text-xs text-slate-500 pl-9 font-mono">
                Sanya_Malhotra_Knee_MRI_Oct23.pdf (4.2 MB)
              </p>
              <div className="pl-9 pt-1 text-[10px] text-slate-400 font-bold uppercase">
                10:05 AM · DOCUMENTS
              </div>
            </div>
          </div>

          {/* GROUP 3: Oct 18 */}
          <div className="space-y-3 relative pl-6 border-l-2 border-l-slate-200">
            <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-slate-400" />
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Oct 18</h4>

            {/* Node 5 */}
            <div className="card p-4 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <ClipboardList size={15} />
                </div>
                <h5 className="font-bold text-xs text-slate-900">Dr. Rahul Sharma assigned new Program Module</h5>
              </div>
              <p className="text-xs text-slate-600 font-medium pl-9">
                Assigned: Phase 2: Progressive Loading & Stability
              </p>
              <div className="pl-9 pt-1 text-[10px] text-slate-400 font-bold uppercase">
                03:20 PM · CARE PLAN
              </div>
            </div>
          </div>

          {/* Footer Load Button */}
          <button className="btn btn-secondary text-xs mx-auto block px-6 py-2 rounded-full font-bold text-slate-600 bg-white border border-slate-200">
            Load Older Activities
          </button>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-5">
          
          {/* Audit Summary */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
              <CheckCircle size={15} className="text-blue-600" /> Audit Summary
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">TOTAL ACTIONS (OCT)</span>
                <p className="text-2xl font-extrabold text-slate-900">42</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                📈
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                AI
              </div>
              <div>
                <span className="text-[9px] font-bold text-blue-900 uppercase block">MOST ACTIVE STAFF</span>
                <p className="font-bold text-slate-900">Dr. Ananya Iyer</p>
                <p className="text-[10px] text-slate-500">12 Actions this month</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">CATEGORY DISTRIBUTION</span>
              <div className="h-2 w-full rounded-full bg-slate-100 flex overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: '50%' }} />
                <div className="bg-purple-600 h-full" style={{ width: '30%' }} />
                <div className="bg-indigo-900 h-full" style={{ width: '20%' }} />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-0.5">
                <span className="text-blue-600">CLINICAL</span>
                <span className="text-purple-600">ADMIN</span>
                <span className="text-indigo-900">BILLING</span>
              </div>
            </div>
          </div>

          {/* Filter History */}
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter History</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="label text-[10px]">CATEGORY</label>
                <select className="select text-xs py-1.5 bg-slate-50" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="All Activities">All Activities</option>
                  <option value="Clinical Update">Clinical Updates</option>
                  <option value="Billing">Billing</option>
                  <option value="Scheduling">Scheduling</option>
                  <option value="Documents">Documents</option>
                </select>
              </div>

              <div>
                <label className="label text-[10px]">STAFF MEMBER</label>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Dr. Sharma', 'Dr. Iyer', 'Priya S.'].map((staff) => (
                    <button
                      key={staff}
                      onClick={() => setActiveStaffFilter(staff)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${activeStaffFilter === staff ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {staff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn btn-secondary w-full justify-center text-xs font-bold text-slate-600 mt-2" onClick={() => { setActiveStaffFilter('All'); setCatFilter('All Activities'); }}>
              🔄 Reset Filters
            </button>
          </div>

          {/* Audit Trail Verified Banner */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs">
            <CheckCircle size={20} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">AUDIT TRAIL VERIFIED</p>
              <p className="text-[10px] text-emerald-700 leading-tight mt-0.5">
                Tracking is encrypted and HIPAA compliant.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
