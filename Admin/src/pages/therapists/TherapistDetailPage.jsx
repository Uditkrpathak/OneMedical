import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, Calendar, Activity, FileText, TrendingUp,
  Edit, Download, CheckCircle, Clock, AlertCircle, Flag, Plus,
  CreditCard, Target, Flame, Award, Play, Upload, ShieldCheck,
  Star, ChevronRight, ChevronDown, MoreHorizontal, Video, Users, Check,
  DollarSign, Search, Filter, Shield, ExternalLink, Globe, UserPlus,
} from 'lucide-react';

const THERAPIST_DATA = {
  id: 'th-001',
  name: 'Dr. Ananya Iyer',
  title: 'MPT Orthopedic Physiotherapy • 8 Years Exp',
  specialization: 'Sports Rehabilitation',
  rating: 4.9,
  languages: 'English, Hindi',
  status: 'Active',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
  phone: '+91 98765 12345',
  email: 'dr.ananya@onemedical.com',
  activePatients: 42,
  programsAssigned: 18,
  sessionsThisMonth: 164,
  monthlyRevenue: '₹1.8L',
};

const TABS = ['Profile', 'Availability', 'Assigned Patients', 'Programs', 'Revenue', 'Certifications'];

export default function TherapistDetailPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [activeTab, setActiveTab] = useState('Profile');
  const [selectedProgramModal, setSelectedProgramModal] = useState(null);
  const [isCreateProgramOpen, setIsCreateProgramOpen]   = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen]       = useState(false);
  const [isManageScheduleOpen, setIsManageScheduleOpen] = useState(false);

  const [therapist, setTherapist] = useState(THERAPIST_DATA);

  const [newProgramForm, setNewProgramForm] = useState({
    title: '',
    category: 'Orthopedic',
    description: '',
    duration: '12 Weeks',
    intensity: 'Medium',
    phase1: '',
    phase2: '',
    assignPatient: 'All Patients',
  });

  const [editForm, setEditForm] = useState({
    name: therapist.name,
    title: therapist.title,
    specialization: therapist.specialization,
    languages: therapist.languages,
    status: therapist.status,
    phone: therapist.phone,
    email: therapist.email,
  });

  const [scheduleForm, setScheduleForm] = useState({
    slotDuration: '45 Minutes',
    morningStart: '09:00 AM',
    morningEnd: '01:00 PM',
    afternoonStart: '02:30 PM',
    afternoonEnd: '06:00 PM',
    outOfClinic: false,
  });

  return (
    <div className="max-w-[1280px] animate-fade-up space-y-6 pb-12">
      
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => navigate('/therapists')} className="hover:text-blue-600 flex items-center gap-1">
          Therapists
        </button>
        <span>/</span>
        <span className="text-slate-900 font-bold">{therapist.name}</span>
      </div>

      {/* ── 1. HEADER PROFILE CARD ── */}
      <div className="card p-6 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img src={therapist.avatar} alt={therapist.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white ${therapist.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{therapist.name}</h1>
              <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold flex items-center gap-1 px-2 py-0.5">
                ★ {therapist.rating} ★
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold">{therapist.title}</p>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 pt-0.5">
              <Globe size={13} className="text-slate-400" /> Languages: {therapist.languages}
            </p>

            <div className="flex items-center gap-2 pt-1.5">
              <span className="badge bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
                {therapist.specialization}
              </span>
              <span className={`badge text-[10px] font-bold ${therapist.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {therapist.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn btn-secondary text-xs font-bold py-2.5 px-4 bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setEditForm({
                name: therapist.name,
                title: therapist.title,
                specialization: therapist.specialization,
                languages: therapist.languages,
                status: therapist.status,
                phone: therapist.phone,
                email: therapist.email,
              });
              setIsEditProfileOpen(true);
            }}
          >
            Edit Profile
          </button>
          <button
            className="btn btn-primary text-xs font-bold py-2.5 px-5 bg-blue-700 hover:bg-blue-600 shadow-sm rounded-xl flex items-center gap-1.5"
            onClick={() => setIsManageScheduleOpen(true)}
          >
            <Calendar size={14} /> Manage Schedule
          </button>
        </div>
      </div>

      {/* ── 2. 4 Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
        
        {/* Stat 1: Active Patients */}
        <div className="card p-4 space-y-2 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex justify-between items-center text-slate-500 font-medium">
            <span>Active Patients</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users size={15} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{THERAPIST_DATA.activePatients}</p>
          <p className="text-[11px] text-emerald-600 font-bold">↗ +12% from last month</p>
        </div>

        {/* Stat 2: Programs Assigned */}
        <div className="card p-4 space-y-2 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex justify-between items-center text-slate-500 font-medium">
            <span>Programs Assigned</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FileText size={15} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{THERAPIST_DATA.programsAssigned}</p>
          <p className="text-[11px] text-slate-400 font-medium">Current active programs</p>
        </div>

        {/* Stat 3: Sessions This Month */}
        <div className="card p-4 space-y-2 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex justify-between items-center text-slate-500 font-medium">
            <span>Sessions This Month</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Clock size={15} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{THERAPIST_DATA.sessionsThisMonth}</p>
          <p className="text-[11px] text-emerald-600 font-bold">↗ On track to exceed target</p>
        </div>

        {/* Stat 4: Monthly Revenue */}
        <div className="card p-4 space-y-2 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex justify-between items-center text-slate-500 font-medium">
            <span>Monthly Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign size={15} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{THERAPIST_DATA.monthlyRevenue}</p>
          <p className="text-[11px] text-slate-400 font-medium">Performance payout pending</p>
        </div>

      </div>

      {/* ── 3. TABS NAV ── */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 4. MAIN BODY GRID / SUB-TAB CONTENTS ── */}
      {activeTab === 'Profile' && (
      /* MAIN BODY GRID */
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Professional Overview Card */}
            <div className="card p-6 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Professional Overview</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Dr. Ananya Iyer is a highly specialized Orthopedic Physiotherapist with over 8 years of clinical experience. She specializes in advanced sports rehabilitation, focusing on non-invasive recovery protocols for elite athletes and post-operative orthopedic recovery.
              </p>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Her approach integrates traditional physiotherapy with modern biomechanical analysis and personalized recovery tracking. She has successfully led recovery programs for state-level athletes and maintains a high patient satisfaction rate through empathetic care and evidence-based practice.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Education</span>
                  <p className="font-bold text-slate-800 leading-snug">
                    Masters in Physiotherapy (MPT) - Orthopedics, Manipal University
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Certifications</span>
                  <p className="font-bold text-slate-800 leading-snug">
                    Manual Therapy (COMT), Dry Needling (Level 2)
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="card p-6 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity size={18} className="text-blue-600" /> Recent Activity
                </h3>
                <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900">Completed Session with Rohan Mehta</h4>
                      <span className="text-[10px] text-slate-400 font-medium">2 hours ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Knee Mobility Protocol - Week 4 Progress Review. Note: "Excellent recovery in range of motion."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900">Assigned New Program: Post-ACL Recovery</h4>
                      <span className="text-[10px] text-slate-400 font-medium">5 hours ago</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Assigned to Ananya Singh. Program duration: 12 weeks. High-intensity track.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold shrink-0">
                    <UserPlus size={16} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900">New Patient Assigned</h4>
                      <span className="text-[10px] text-slate-400 font-medium">Yesterday</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Vikram Malhotra transferred from General Wellness to Orthopedic Rehab.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <div className="space-y-6">
            
            {/* Today's Schedule Card */}
            <div className="card p-5 space-y-3 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-900">Today's Schedule</h3>
                <span className="badge bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5">4 Pending</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-700 block">10:30 AM - 11:15 AM</span>
                  <p className="font-bold text-slate-900">Arjun Kapoor</p>
                  <p className="text-[10px] text-slate-500">Shoulder Impingement</p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-700 block">12:00 PM - 12:45 PM</span>
                  <p className="font-bold text-slate-900">Sanya Malhotra</p>
                  <p className="text-[10px] text-slate-500">Post-Op Hip Rehab</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5 opacity-75">
                  <span className="text-[10px] font-bold text-slate-400 block">02:30 PM - 03:15 PM</span>
                  <p className="font-bold text-slate-800">Rohan Mehta</p>
                  <p className="text-[10px] text-slate-400">Completed (Knee Rehab)</p>
                </div>
              </div>

              <button className="text-xs text-blue-600 font-bold hover:underline block mx-auto pt-1" onClick={() => alert('Opening Full Calendar…')}>
                Open Calendar
              </button>
            </div>

            {/* Performance Summary Card */}
            <div className="card p-5 space-y-3.5 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <h3 className="text-xs font-bold text-slate-900">Performance Summary</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Patient Satisfaction</span>
                    <span className="text-blue-600 font-bold">98%</span>
                  </div>
                  <div className="progress-track h-2 bg-slate-100">
                    <div className="progress-fill bg-blue-600" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Program Completion Rate</span>
                    <span className="text-purple-600 font-bold">85%</span>
                  </div>
                  <div className="progress-track h-2 bg-slate-100">
                    <div className="progress-fill bg-purple-600" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center border-t border-slate-100 text-xs">
                <div>
                  <p className="text-base font-extrabold text-slate-900">12</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">NEW LEADS</span>
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900">4.8</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">AVG. RATING</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Dark Blue Card */}
            <div className="card p-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-3 shadow-md rounded-2xl">
              <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider">Quick Actions</h3>

              <button className="btn w-full justify-center text-xs font-bold py-2.5 bg-white text-blue-900 hover:bg-slate-100 rounded-xl" onClick={() => alert('Assigning Patient…')}>
                <UserPlus size={14} /> Assign Patient
              </button>

              <button className="btn w-full justify-center text-xs font-bold py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl" onClick={() => alert('Creating Program…')}>
                <Plus size={14} /> Create Program
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ── SUB-TAB: AVAILABILITY ── */}
      {activeTab === 'Availability' && (
        <div className="card p-6 space-y-5 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Clinical Availability</h3>
              <p className="text-xs text-slate-400">Configure consultation time slots & recurring break hours.</p>
            </div>
            <button className="btn btn-primary text-xs font-bold py-2 px-4" onClick={() => alert('Schedule updated!')}>
              Save Schedule
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">{day}</span>
                <div className="p-2 bg-blue-100/70 text-blue-800 rounded-xl text-[11px] font-bold text-center">
                  09:00 AM - 01:00 PM
                </div>
                <div className="p-2 bg-emerald-100/70 text-emerald-800 rounded-xl text-[11px] font-bold text-center">
                  02:30 PM - 06:00 PM
                </div>
                <span className="text-[9px] text-slate-400 block text-center font-semibold pt-1">8 Slots Available</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-TAB: ASSIGNED PATIENTS (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 12) ── */}
      {activeTab === 'Assigned Patients' && (
        <div className="card overflow-hidden shadow-sm border border-slate-200/80 bg-white rounded-2xl animate-fade-up">
          <table className="tbl w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3.5 px-5 text-left">Patient Name</th>
                <th className="py-3.5 px-4 text-left">Condition</th>
                <th className="py-3.5 px-4 text-left">Recovery Progress</th>
                <th className="py-3.5 px-4 text-left">Next Session</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  id: 'PT-2091',
                  name: 'Sanya Malhotra',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                  condition: 'Post-Op Hip Rehab',
                  week: 'Wk 4 of 12',
                  progress: 65,
                  progressColor: 'bg-teal-500 text-teal-600',
                  nextSession: 'Today, 4:30 PM',
                  room: 'Room 204B',
                  status: 'On Track',
                  statusBadge: 'bg-teal-50 text-teal-700 border border-teal-100',
                },
                {
                  id: 'PT-1822',
                  name: 'Arjun Kapoor',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                  condition: 'ACL Recovery',
                  week: 'Wk 8 of 16',
                  progress: 42,
                  progressColor: 'bg-blue-600 text-blue-600',
                  nextSession: 'Tomorrow, 10:00 AM',
                  room: 'Virtual Consultation',
                  status: 'Recovering',
                  statusBadge: 'bg-blue-50 text-blue-700 border border-blue-100',
                },
                {
                  id: 'PT-3310',
                  name: 'Rohan Mehta',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
                  condition: 'Rotator Cuff Tear',
                  week: 'Wk 2 of 20',
                  progress: 12,
                  progressColor: 'bg-red-500 text-red-600',
                  nextSession: '24 Oct, 11:30 AM',
                  room: 'Room 105A',
                  status: 'Needs Review',
                  statusBadge: 'bg-red-50 text-red-700 border border-red-100',
                },
                {
                  id: 'PT-4421',
                  name: 'Priyanshu Singh',
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
                  condition: 'Lumber Disc Bulge',
                  week: 'Wk 10 of 12',
                  progress: 92,
                  progressColor: 'bg-teal-500 text-teal-600',
                  nextSession: '25 Oct, 09:00 AM',
                  room: 'Room 202C',
                  status: 'On Track',
                  statusBadge: 'bg-teal-50 text-teal-700 border border-teal-100',
                },
              ].map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => navigate('/patients/PT-1024')}
                >
                  {/* Patient Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover shadow-sm shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900 leading-snug text-xs">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono font-medium">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Condition */}
                  <td className="py-4 px-4">
                    <h4 className="font-bold text-slate-800 text-xs">{p.condition}</h4>
                    <p className="text-[10px] text-blue-600 font-semibold">{p.week}</p>
                  </td>

                  {/* Recovery Progress */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="progress-track w-24 h-1.5 bg-slate-100">
                        <div className={`progress-fill ${p.progressColor.split(' ')[0]}`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className={`font-bold text-xs ${p.progressColor.split(' ')[1]}`}>{p.progress}%</span>
                    </div>
                  </td>

                  {/* Next Session */}
                  <td className="py-4 px-4">
                    <h4 className="font-bold text-slate-900 text-xs">{p.nextSession}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{p.room}</p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <span className={`badge text-[9px] font-bold px-2.5 py-1 rounded-full ${p.statusBadge}`}>
                      ● {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Pagination */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Showing 1-10 of 42 patients</span>

            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-600 font-semibold cursor-not-allowed">
                Previous
              </button>
              <button className="text-blue-600 font-bold hover:underline">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB: PROGRAMS (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 13) ── */}
      {activeTab === 'Programs' && (
        <div className="space-y-6 animate-fade-up">
          
          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-white border border-slate-200/80 rounded-full px-3.5 py-2.5 shadow-xs">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by program name or patient..."
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="btn btn-secondary text-xs font-bold py-2.5 px-4 bg-white border border-slate-200 shadow-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-xl">
                <Filter size={14} /> Filters
              </button>

              <button className="btn btn-primary text-xs font-bold py-2.5 px-5 bg-blue-700 hover:bg-blue-600 shadow-sm rounded-full flex items-center gap-1.5" onClick={() => setIsCreateProgramOpen(true)}>
                <Plus size={15} /> Create New Program
              </button>
            </div>
          </div>

          {/* 2x2 CARDS GRID */}
          <div className="grid grid-cols-2 gap-5">
            
            {/* Card 1: Post-Op ACL Recovery */}
            <div
              className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-all"
              onClick={() => setSelectedProgramModal({
                title: 'Post-Op ACL Recovery',
                category: 'ORTHOPEDIC',
                categoryBadge: 'bg-blue-50 text-blue-700 border-blue-100',
                description: 'Intensive phase-based rehabilitation protocol targeting knee range of motion, quadriceps reactivation, and progressive load training.',
                patients: 12,
                duration: '12 Weeks',
                intensity: 'High',
                intensityBadge: 'bg-rose-100 text-rose-700',
                compliance: '88%',
                phases: [
                  { name: 'Phase 1: Inflammatory Control & ROM (Wks 1-3)', exercises: 'Heel slides, Quad sets, Passive extension 0-90°' },
                  { name: 'Phase 2: Strength & Load Acceptance (Wks 4-8)', exercises: 'Wall squats, Step-ups, Terminal knee extension' },
                  { name: 'Phase 3: Agility & Sport Return (Wks 9-12)', exercises: 'Plyometrics, Directional hops, Functional agility drills' },
                ]
              })}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                    ORTHOPEDIC
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">Post-Op ACL Recovery</h3>
                <p className="text-xs text-slate-500 font-normal">Intensive phase-based rehabilitation protocol.</p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Patients</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">12</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Duration</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">12 Weeks</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Intensity</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                      High
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center -space-x-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center">
                    +10
                  </div>
                </div>
                <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 2: Lumbar Spine Stabilization */}
            <div
              className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between cursor-pointer hover:border-cyan-300 transition-all"
              onClick={() => setSelectedProgramModal({
                title: 'Lumbar Spine Stabilization',
                category: 'SPINE CARE',
                categoryBadge: 'bg-cyan-50 text-cyan-700 border-cyan-100',
                description: 'Core integration and postural correction series designed for lumbar disc compression and spondylosis relief.',
                patients: 24,
                duration: '8 Weeks',
                intensity: 'Medium',
                intensityBadge: 'bg-cyan-100 text-cyan-800',
                compliance: '92%',
                phases: [
                  { name: 'Phase 1: Deep Core Activation (Wks 1-2)', exercises: 'Pelvic tilts, Transverse abdominis activation, Bird-dog' },
                  { name: 'Phase 2: Postural Integration (Wks 3-6)', exercises: 'Modified planks, Glute bridges, Resistance band rows' },
                  { name: 'Phase 3: Functional Load (Wks 7-8)', exercises: 'Goblet deadlifts, Farmer carries, Core endurance drills' },
                ]
              })}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-50 text-cyan-700 border border-cyan-100 uppercase tracking-wider">
                    SPINE CARE
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">Lumbar Spine Stabilization</h3>
                <p className="text-xs text-slate-500 font-normal">Core integration and postural correction series.</p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Patients</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">24</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Duration</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">8 Weeks</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Intensity</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800">
                      Medium
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center -space-x-2">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center">
                    +23
                  </div>
                </div>
                <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 3: Rotator Cuff Strengthening */}
            <div
              className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between cursor-pointer hover:border-purple-300 transition-all"
              onClick={() => setSelectedProgramModal({
                title: 'Rotator Cuff Strengthening',
                category: 'UPPER LIMB',
                categoryBadge: 'bg-purple-50 text-purple-700 border-purple-100',
                description: 'Scapular mechanics, rotator cuff tendon conditioning, and glenohumeral stability resistance protocols.',
                patients: 6,
                duration: '6 Weeks',
                intensity: 'Low',
                intensityBadge: 'bg-slate-100 text-slate-700',
                compliance: '79%',
                phases: [
                  { name: 'Phase 1: Pendulum & Isometric (Wks 1-2)', exercises: 'Pendulum swings, Submaximal isometric rotations' },
                  { name: 'Phase 2: Scapular Strengthening (Wks 3-4)', exercises: 'Prone Y/T/W exercises, Theraband external rotations' },
                  { name: 'Phase 3: Overhead Dynamic Control (Wks 5-6)', exercises: 'Wall slides, Dumbbell scaption, Functional reach' },
                ]
              })}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                    UPPER LIMB
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">Rotator Cuff Strengthening</h3>
                <p className="text-xs text-slate-500 font-normal">Scapular mechanics and resistance protocols.</p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Patients</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">6</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Duration</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">6 Weeks</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Intensity</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                      Low
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center -space-x-2">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center">
                    +5
                  </div>
                </div>
                <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 4: Dotted Build Custom Protocol Card */}
            <div
              className="p-6 border-2 border-dashed border-slate-200/90 rounded-2xl bg-white flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all"
              onClick={() => setIsCreateProgramOpen(true)}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Plus size={24} />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Build Custom Protocol</h4>
              <p className="text-xs text-slate-400 font-medium">Tailor exercises for unique patient needs</p>
            </div>

          </div>

          {/* BOTTOM SECTION: PROGRAM INSIGHTS */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">Program Insights</h3>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-stretch text-xs">
              
              {/* Left Bar Chart Box */}
              <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900">Patient Progress Velocity</h4>
                  <div className="relative">
                    <select className="select text-xs py-1 px-3 appearance-none bg-slate-50 border border-slate-200 font-semibold text-slate-700 pr-7 rounded-lg">
                      <option>Last 30 Days</option>
                      <option>Last 60 Days</option>
                      <option>This Year</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3 h-36 pt-4 px-2">
                  {[45, 65, 40, 90, 75, 48, 35, 60, 70, 95].map((val, idx) => (
                    <div key={idx} className="flex-1 bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-full">
                      <div
                        className={`w-full rounded-t-xl transition-all ${idx % 3 === 0 ? 'bg-blue-700' : 'bg-blue-400'}`}
                        style={{ height: `${val}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Most Successful Box */}
              <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Most Successful</h4>

                <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-800 font-bold text-xs">
                    <TrendingUp size={15} /> Lumbar Stabilization
                  </div>
                  <span className="text-[10px] font-bold text-cyan-600 block">92% Completion Rate</span>
                </div>

                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-600 italic font-medium">
                    "Dr. Iyer's protocols have seen a 14% improvement in engagement since the mobile app rollout."
                  </p>
                  <span className="text-[9px] font-bold text-slate-400 block pt-1">— Clinic Admin Insight</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ── SUB-TAB: REVENUE (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 14) ── */}
      {activeTab === 'Revenue' && (
        <div className="space-y-6 animate-fade-up">
          
          {/* TOP 4 STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
            {/* Card 1 */}
            <div className="card p-4 space-y-2.5 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <DollarSign size={16} />
                </div>
                <span className="badge bg-emerald-50 text-emerald-700 text-[10px] font-bold">+12%</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 block">Total Earnings (MTD)</span>
              <p className="text-2xl font-extrabold text-slate-900">₹1.8L</p>
              <div className="progress-track h-1 bg-slate-100 mt-1">
                <div className="progress-fill bg-teal-500" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="card p-4 space-y-2.5 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <CreditCard size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-400 block">Avg. Session Fee</span>
              <p className="text-2xl font-extrabold text-slate-900">₹1,200</p>
              <p className="text-[10px] text-slate-400">Calculated over last 30 days</p>
            </div>

            {/* Card 3 */}
            <div className="card p-4 space-y-2.5 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Clock size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-400 block">Total Sessions</span>
              <p className="text-2xl font-extrabold text-slate-900">164</p>
              <p className="text-[10px] text-slate-400">96% completion rate</p>
            </div>

            {/* Card 4 */}
            <div className="card p-4 space-y-2.5 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-400 block">Pending Payout</span>
              <p className="text-2xl font-extrabold text-slate-900">₹42,000</p>
              <button className="text-[11px] text-teal-600 font-bold hover:underline flex items-center gap-1">
                Process Payout →
              </button>
            </div>
          </div>

          {/* MIDDLE ROW (REVENUE TRENDS CHART + REVENUE SOURCE DONUT) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch text-xs">
            
            {/* Revenue Trends Chart */}
            <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Revenue Trends</h4>
                  <p className="text-[11px] text-slate-400">Daily earnings over the last 30 days</p>
                </div>
                <div className="relative">
                  <select className="select text-xs py-1 px-3 appearance-none bg-slate-50 border border-slate-200 font-semibold text-slate-700 pr-7 rounded-lg">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Wave SVG Area Chart (100% MATCH FOR REFERENCE SCREENSHOT 16) */}
              <div className="h-48 relative flex items-end pt-6 pb-2 px-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Path */}
                  <path
                    d="M 80 95 C 140 85, 200 65, 240 45 C 270 30, 310 70, 340 100 C 365 125, 385 110, 410 40 L 410 150 L 80 150 Z"
                    fill="url(#revenueGrad)"
                  />
                  
                  {/* Line Path */}
                  <path
                    d="M 80 95 C 140 85, 200 65, 240 45 C 270 30, 310 70, 340 100 C 365 125, 385 110, 410 40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  
                  {/* Highlight Data Node Dot */}
                  <circle cx="240" cy="45" r="5" fill="#10b981" className="animate-pulse" />
                  <circle cx="240" cy="45" r="9" fill="#10b981" fillOpacity="0.2" />
                </svg>

                {/* Interactive Tooltip Callout Box */}
                <div className="absolute top-4 left-[46%] -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md border border-slate-700 pointer-events-none flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Oct 16: ₹6,800</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2.5 uppercase tracking-wider">
                <span>OCT 01</span>
                <span>OCT 08</span>
                <span>OCT 15</span>
                <span>OCT 22</span>
                <span>OCT 29</span>
              </div>
            </div>

            {/* Revenue Source Donut */}
            <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Revenue Source</h4>
                <p className="text-[11px] text-slate-400">Breakdown by session type</p>
              </div>

              {/* Circular Donut Representation */}
              <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-600" strokeWidth="4" strokeDasharray="60, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-teal-500" strokeWidth="4" strokeDasharray="25, 100" strokeDashoffset="-60" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-purple-600" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-85" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-slate-900 leading-none">100%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">VOLUME</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1 border-t border-slate-100 font-semibold">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Clinic Visits
                  </span>
                  <span className="font-extrabold text-slate-900">60%</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Home Visits
                  </span>
                  <span className="font-extrabold text-slate-900">25%</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Online Consults
                  </span>
                  <span className="font-extrabold text-slate-900">15%</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM TABLE: RECENT TRANSACTIONS */}
          <div className="card overflow-hidden shadow-sm border border-slate-200/80 bg-white rounded-2xl">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm">Recent Transactions</h4>
              <button className="text-xs text-blue-600 font-bold hover:underline">View All History ›</button>
            </div>

            <table className="tbl w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-5 text-left">PATIENT NAME</th>
                  <th className="py-3.5 px-4 text-left">DATE</th>
                  <th className="py-3.5 px-4 text-left">SERVICE TYPE</th>
                  <th className="py-3.5 px-4 text-left">AMOUNT</th>
                  <th className="py-3.5 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Sanya Malhotra', initials: 'SM', color: 'bg-blue-600', date: 'Oct 24, 2023', type: 'Post-Op Rehab', amount: '₹1,500', status: 'Paid', badge: 'bg-emerald-100 text-emerald-800' },
                  { name: 'Arjun Kapoor', initials: 'AK', color: 'bg-cyan-600', date: 'Oct 24, 2023', type: 'ACL Consultation', amount: '₹1,200', status: 'Processing', badge: 'bg-amber-100 text-amber-800' },
                  { name: 'Vikrant Singh', initials: 'VS', color: 'bg-purple-600', date: 'Oct 23, 2023', type: 'Lower Back Physio', amount: '₹1,200', status: 'Paid', badge: 'bg-emerald-100 text-emerald-800' },
                  { name: 'Rohan Shah', initials: 'RS', color: 'bg-indigo-600', date: 'Oct 22, 2023', type: 'Sports Massage', amount: '₹1,800', status: 'Paid', badge: 'bg-emerald-100 text-emerald-800' },
                ].map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${tx.color} text-white font-extrabold text-[10px] flex items-center justify-center shrink-0`}>
                          {tx.initials}
                        </div>
                        {tx.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{tx.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{tx.amount}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${tx.badge}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ── SUB-TAB: CERTIFICATIONS (100% MATCH FOR REFERENCE DESIGN SCREENSHOT 15) ── */}
      {activeTab === 'Certifications' && (
        <div className="space-y-6 animate-fade-up">
          
          {/* HEADER */}
          <div className="card p-5 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
            <h3 className="text-base font-bold text-slate-900">Verified Certifications</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Legally verified professional certifications and academic honors.
            </p>
          </div>

          {/* 3 CERTIFICATION CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    🎓
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                    ✔ VERIFIED
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">Master of Physiotherapy (MPT)</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Manipal Academy of Higher Education, Karnataka</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Issued</span>
                    <span className="font-bold text-slate-800">May 2018</span>
                  </div>
                  <div className="flex justify-between text-[11px] items-center">
                    <span className="text-slate-400">Status</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-100 text-emerald-800">PERMANENT</span>
                  </div>
                </div>
              </div>

              <button className="btn w-full justify-center text-xs font-bold py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 mt-2" onClick={() => alert('Opening MPT Certificate PDF…')}>
                👁 View Certificate
              </button>
            </div>

            {/* Card 2 */}
            <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    🏥
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                    ✔ VERIFIED
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">Certified Dry Needling Practitioner</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Indian Association of Physiotherapists (IAP)</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Issued</span>
                    <span className="font-bold text-slate-800">Oct 2021</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Expiry</span>
                    <span className="font-bold text-slate-800">Oct 2026</span>
                  </div>
                </div>
              </div>

              <button className="btn w-full justify-center text-xs font-bold py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 mt-2" onClick={() => alert('Opening Dry Needling Certificate PDF…')}>
                👁 View Certificate
              </button>
            </div>

            {/* Card 3 */}
            <div className="card p-5 space-y-4 shadow-sm border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                    🏆
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                    ✔ VERIFIED
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">Sports Rehabilitation Specialist</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Global Physio Council</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Issued</span>
                    <span className="font-bold text-slate-800">Jan 2023</span>
                  </div>
                  <div className="flex justify-between text-[11px] items-center">
                    <span className="text-slate-400">Renewal</span>
                    <span className="text-rose-600 font-bold">Action Required</span>
                  </div>
                </div>
              </div>

              <button className="btn w-full justify-center text-xs font-bold py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 mt-2" onClick={() => alert('Opening Sports Rehab Certificate PDF…')}>
                👁 View Certificate
              </button>
            </div>

          </div>

          {/* PROFESSIONAL MEMBERSHIPS SECTION */}
          <div className="card p-5 space-y-3 shadow-sm border border-slate-200/80 bg-white rounded-2xl">
            <h3 className="font-bold text-sm text-slate-900">Professional Memberships</h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                  🩺
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-xs">Indian Association of Physiotherapists (IAP)</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Life Member • L-12492</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">National Body</span>
                    <span className="text-[10px] text-slate-400">Member since 2016</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                  🌐
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-xs">World Physiotherapy (WCPT)</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Registered Affiliate Professional</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800">International Body</span>
                    <span className="text-[10px] text-slate-400">Member since 2019</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER COMPLIANCE BAR */}
          <div className="card p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex justify-between items-center text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-4">
              <span>🔒 Documents Audit: 12 Jan 2024</span>
              <span>🕒 Last Updated: Today, 09:45 AM</span>
            </div>

            <button className="text-blue-600 font-bold hover:underline" onClick={() => alert('Opening Compliance Handbook…')}>
              👁 View Compliance Handbook
            </button>
          </div>

        </div>
      )}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up space-y-5 p-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${selectedProgramModal.categoryBadge}`}>
                  {selectedProgramModal.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">{selectedProgramModal.title}</h2>
                <p className="text-xs text-slate-500 font-medium">{selectedProgramModal.description}</p>
              </div>

              <button
                onClick={() => setSelectedProgramModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">PATIENTS</span>
                <p className="text-base font-extrabold text-slate-900">{selectedProgramModal.patients}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">DURATION</span>
                <p className="text-base font-extrabold text-slate-900">{selectedProgramModal.duration}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">INTENSITY</span>
                <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${selectedProgramModal.intensityBadge}`}>
                  {selectedProgramModal.intensity}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">COMPLIANCE</span>
                <p className="text-base font-extrabold text-emerald-600">{selectedProgramModal.compliance}</p>
              </div>
            </div>

            {/* Phase Breakdown */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Protocol Timeline & Exercise Phases</h3>

              <div className="space-y-2.5">
                {selectedProgramModal.phases.map((phase, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                    <h4 className="font-bold text-blue-900 text-xs">{phase.name}</h4>
                    <p className="text-slate-600 text-[11px] font-medium">📋 Key Exercises: {phase.exercises}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
              <button
                className="btn btn-secondary font-bold text-slate-700 bg-slate-50 border border-slate-200"
                onClick={() => alert(`Exporting ${selectedProgramModal.title} PDF protocol…`)}
              >
                📥 Export Protocol PDF
              </button>

              <div className="flex items-center gap-3">
                <button
                  className="btn btn-secondary font-bold text-slate-700"
                  onClick={() => setSelectedProgramModal(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary font-bold bg-blue-700 hover:bg-blue-600 rounded-full px-5"
                  onClick={() => alert(`Assigning ${selectedProgramModal.title} to patient…`)}
                >
                  Assign to Patient
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* ── CREATE NEW PROGRAM MODAL OVERLAY ── */}
      {isCreateProgramOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up space-y-5 p-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create New Rehabilitation Program</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Design a phase-based therapy protocol for your clinic & patients.</p>
              </div>

              <button
                onClick={() => setIsCreateProgramOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Program "${newProgramForm.title || 'Custom Rehabilitation Program'}" published successfully!`);
                setIsCreateProgramOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">PROGRAM NAME *</label>
                <input
                  className="input text-xs py-2"
                  placeholder="e.g. Cervical Spine Mobility & Scapular Rehab"
                  value={newProgramForm.title}
                  onChange={e => setNewProgramForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">SPECIALIZATION / CATEGORY</label>
                  <div className="relative">
                    <select
                      className="select text-xs py-2 pr-8 appearance-none"
                      value={newProgramForm.category}
                      onChange={e => setNewProgramForm(p => ({ ...p, category: e.target.value }))}
                    >
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Spine Care">Spine Care</option>
                      <option value="Sports Rehab">Sports Rehab</option>
                      <option value="Upper Limb">Upper Limb</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">PROGRAM DURATION</label>
                  <div className="relative">
                    <select
                      className="select text-xs py-2 pr-8 appearance-none"
                      value={newProgramForm.duration}
                      onChange={e => setNewProgramForm(p => ({ ...p, duration: e.target.value }))}
                    >
                      <option value="4 Weeks">4 Weeks</option>
                      <option value="6 Weeks">6 Weeks</option>
                      <option value="8 Weeks">8 Weeks</option>
                      <option value="12 Weeks">12 Weeks</option>
                      <option value="16 Weeks">16 Weeks</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">DESCRIPTION & CLINICAL GOALS</label>
                <textarea
                  rows={2}
                  className="textarea text-xs py-2"
                  placeholder="e.g. Scapular mechanics, neck traction, and progressive resistance exercise routine."
                  value={newProgramForm.description}
                  onChange={e => setNewProgramForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              {/* Intensity Picker */}
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">INTENSITY LEVEL</label>
                <div className="flex gap-3 pt-1">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewProgramForm(p => ({ ...p, intensity: lvl }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        newProgramForm.intensity === lvl
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase Exercises */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase">Exercise Phase Breakdown</h4>
                <div>
                  <label className="label text-[10px] font-semibold text-slate-500">PHASE 1 EXERCISES (WEEKS 1-4)</label>
                  <input
                    className="input text-xs py-2"
                    placeholder="e.g. Chin tucks, Isometric neck extensions, Scapular pinches"
                    value={newProgramForm.phase1}
                    onChange={e => setNewProgramForm(p => ({ ...p, phase1: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-semibold text-slate-500">PHASE 2 EXERCISES (WEEKS 5-8+)</label>
                  <input
                    className="input text-xs py-2"
                    placeholder="e.g. Resistance band wall slides, Prone Y-raises, Postural retraining"
                    value={newProgramForm.phase2}
                    onChange={e => setNewProgramForm(p => ({ ...p, phase2: e.target.value }))}
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className="btn btn-secondary font-bold text-slate-700"
                  onClick={() => setIsCreateProgramOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary font-bold bg-blue-700 hover:bg-blue-600 rounded-full px-6"
                >
                  Create & Publish Program
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      {/* ── EDIT PROFILE MODAL OVERLAY ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up space-y-5 p-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Therapist Profile</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Update professional details and contact information.</p>
              </div>

              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTherapist(prev => ({
                  ...prev,
                  name: editForm.name,
                  title: editForm.title,
                  specialization: editForm.specialization,
                  languages: editForm.languages,
                  status: editForm.status,
                  phone: editForm.phone,
                  email: editForm.email,
                }));
                alert('Therapist profile updated successfully!');
                setIsEditProfileOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">FULL NAME *</label>
                <input
                  className="input text-xs py-2"
                  value={editForm.name}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">TITLE & DEGREES</label>
                <input
                  className="input text-xs py-2"
                  value={editForm.title}
                  onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">SPECIALIZATION</label>
                  <input
                    className="input text-xs py-2"
                    value={editForm.specialization}
                    onChange={e => setEditForm(p => ({ ...p, specialization: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">LANGUAGES SPOKEN</label>
                  <input
                    className="input text-xs py-2"
                    value={editForm.languages}
                    onChange={e => setEditForm(p => ({ ...p, languages: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">PHONE</label>
                  <input
                    className="input text-xs py-2"
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">EMAIL</label>
                  <input
                    className="input text-xs py-2"
                    value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="font-bold text-slate-700 text-xs">PRACTITIONER STATUS</span>
                <button
                  type="button"
                  onClick={() => setEditForm(p => ({ ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' }))}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${editForm.status === 'Active' ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${editForm.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${editForm.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {editForm.status}
                </span>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className="btn btn-secondary font-bold text-slate-700"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary font-bold bg-blue-700 hover:bg-blue-600 rounded-full px-6"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MANAGE SCHEDULE MODAL OVERLAY ── */}
      {isManageScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up space-y-5 p-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manage Weekly Clinical Schedule</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Configure consultation hours, slot durations, and clinic leaves.</p>
              </div>

              <button
                onClick={() => setIsManageScheduleOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Weekly schedule and consultation slots saved successfully!');
                setIsManageScheduleOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">APPOINTMENT SLOT DURATION</label>
                <div className="relative">
                  <select
                    className="select text-xs py-2 pr-8 appearance-none"
                    value={scheduleForm.slotDuration}
                    onChange={e => setScheduleForm(p => ({ ...p, slotDuration: e.target.value }))}
                  >
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="45 Minutes">45 Minutes</option>
                    <option value="60 Minutes">60 Minutes</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">MORNING SHIFT START</label>
                  <input
                    className="input text-xs py-2"
                    value={scheduleForm.morningStart}
                    onChange={e => setScheduleForm(p => ({ ...p, morningStart: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">MORNING SHIFT END</label>
                  <input
                    className="input text-xs py-2"
                    value={scheduleForm.morningEnd}
                    onChange={e => setScheduleForm(p => ({ ...p, morningEnd: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">AFTERNOON SHIFT START</label>
                  <input
                    className="input text-xs py-2"
                    value={scheduleForm.afternoonStart}
                    onChange={e => setScheduleForm(p => ({ ...p, afternoonStart: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">AFTERNOON SHIFT END</label>
                  <input
                    className="input text-xs py-2"
                    value={scheduleForm.afternoonEnd}
                    onChange={e => setScheduleForm(p => ({ ...p, afternoonEnd: e.target.value }))}
                  />
                </div>
              </div>

              {/* Emergency Out of Clinic Toggle */}
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-rose-900 text-xs block">OUT OF CLINIC / LEAVE</span>
                  <span className="text-[10px] text-rose-600 font-medium">Block all new appointments for today</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleForm(p => ({ ...p, outOfClinic: !p.outOfClinic }))}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${scheduleForm.outOfClinic ? 'bg-rose-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${scheduleForm.outOfClinic ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className="btn btn-secondary font-bold text-slate-700"
                  onClick={() => setIsManageScheduleOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary font-bold bg-blue-700 hover:bg-blue-600 rounded-full px-6"
                >
                  Save Weekly Schedule
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
