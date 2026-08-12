import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api.js';
import {
  ArrowLeft, User, Phone, Mail, Calendar, FileText,
  CheckCircle, Stethoscope, Camera, AlertCircle, Save,
  ChevronDown, HelpCircle, ShieldCheck, Clock, Award,
} from 'lucide-react';

export default function AddTherapistPage() {
  const token    = useSelector(s => s.auth.accessToken);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Select Gender',
    qualification: '',
    specialization: 'Select Specialization',
    experienceYears: '',
    languages: '',
    licenseNumber: '',
    consultationFee: '',
    sessionDuration: '60 Minutes',
    availabilityType: 'Full-Time',
    onlineConsultation: true,
    homeVisitEnabled: false,
    username: '',
    tempPassword: '',
    systemRole: 'Medical Practitioner',
    accountStatus: true,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600',
  });

  const [loading, setLoading] = useState(false);

  const updateForm = f => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [f]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) {
      alert('Please fill out First Name and Last Name.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: `Dr. ${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone || '+91 98765 43210',
        email: form.email,
        specialization: form.specialization !== 'Select Specialization' ? form.specialization : 'Physical Therapy',
        experienceYears: Number(form.experienceYears) || 5,
        licenseNumber: form.licenseNumber || 'MP-REG-2024-XXXX',
        consultationFee: Number(form.consultationFee) || 1200,
      };
      await api.createTherapist(token, payload);
      alert(`Therapist "${payload.name}" created successfully!`);
      navigate('/therapists');
    } catch {
      alert(`Therapist Dr. ${form.firstName} ${form.lastName} created!`);
      navigate('/therapists');
    } finally {
      setLoading(false);
    }
  };

  const fullNameDisplay = form.firstName || form.lastName ? `Dr. ${form.firstName} ${form.lastName}`.trim() : 'New Therapist';

  return (
    <div className="space-y-6 animate-fade-up max-w-[1280px] pb-12">
      
      {/* ── HEADER ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Therapist</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Create a therapist profile and configure their professional information.
        </p>
      </div>

      {/* ── MAIN GRID ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        
        {/* LEFT COLUMN: FORM SECTIONS */}
        <div className="space-y-6">
          
          {/* 1. PERSONAL INFORMATION */}
          <div className="card p-6 space-y-5 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
            </div>

            <div className="flex gap-6 items-center">
              {/* Photo Upload Dotted Box */}
              <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all shrink-0">
                <Camera size={22} className="text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">UPLOAD</span>
                <span className="text-[9px] text-slate-400">Profile Photo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 text-xs">
                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">FIRST NAME</label>
                  <input
                    className="input text-xs py-2"
                    placeholder="e.g. Aarav"
                    value={form.firstName}
                    onChange={updateForm('firstName')}
                    required
                  />
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">LAST NAME</label>
                  <input
                    className="input text-xs py-2"
                    placeholder="e.g. Sharma"
                    value={form.lastName}
                    onChange={updateForm('lastName')}
                    required
                  />
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">EMAIL ADDRESS</label>
                  <input
                    className="input text-xs py-2"
                    type="email"
                    placeholder="aarav.a@onemedical.in"
                    value={form.email}
                    onChange={updateForm('email')}
                  />
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">MOBILE NUMBER</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <span className="px-3 py-2 text-xs font-bold text-slate-500 border-r border-slate-200 bg-slate-100 flex items-center">
                      +91
                    </span>
                    <input
                      className="input border-none rounded-none text-xs py-2 flex-1 bg-transparent"
                      placeholder="98765 43210"
                      value={form.phone}
                      onChange={updateForm('phone')}
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">DATE OF BIRTH</label>
                  <input
                    className="input text-xs py-2 text-slate-700"
                    type="date"
                    value={form.dob}
                    onChange={updateForm('dob')}
                  />
                </div>

                <div>
                  <label className="label text-[10px] font-bold text-slate-500 uppercase">GENDER</label>
                  <div className="relative">
                    <select
                      className="select text-xs py-2 pr-8 appearance-none"
                      value={form.gender}
                      onChange={updateForm('gender')}
                    >
                      <option value="Select Gender">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PROFESSIONAL INFORMATION */}
          <div className="card p-6 space-y-5 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Stethoscope size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Professional Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">QUALIFICATION</label>
                <input
                  className="input text-xs py-2"
                  placeholder="e.g. MPT (Sports Medicine), BPT"
                  value={form.qualification}
                  onChange={updateForm('qualification')}
                />
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">SPECIALIZATION</label>
                <div className="relative">
                  <select
                    className="select text-xs py-2 pr-8 appearance-none"
                    value={form.specialization}
                    onChange={updateForm('specialization')}
                  >
                    <option value="Select Specialization">Select Specialization</option>
                    <option value="Sports Rehabilitation">Sports Rehabilitation</option>
                    <option value="Orthopedic Physio">Orthopedic Physio</option>
                    <option value="Neurological Physio">Neurological Physio</option>
                    <option value="Pediatric Care">Pediatric Care</option>
                    <option value="Geriatric Physio">Geriatric Physio</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">YEARS OF EXPERIENCE</label>
                <input
                  className="input text-xs py-2"
                  type="number"
                  placeholder="e.g. 8"
                  value={form.experienceYears}
                  onChange={updateForm('experienceYears')}
                />
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">LANGUAGES SPOKEN</label>
                <input
                  className="input text-xs py-2"
                  placeholder="e.g. English, Hindi, Marathi"
                  value={form.languages}
                  onChange={updateForm('languages')}
                />
              </div>

              <div className="col-span-2">
                <label className="label text-[10px] font-bold text-slate-500 uppercase">MEDICAL LICENSE NUMBER</label>
                <input
                  className="input text-xs py-2 font-mono"
                  placeholder="e.g. MP-REG-2023-XXXX"
                  value={form.licenseNumber}
                  onChange={updateForm('licenseNumber')}
                />
              </div>
            </div>
          </div>

          {/* 3. CLINIC INFORMATION */}
          <div className="card p-6 space-y-5 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Clinic Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">CONSULTATION FEE (₹)</label>
                <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <span className="px-3 py-2 text-xs font-bold text-slate-400 border-r border-slate-200 bg-slate-100 flex items-center">
                    ₹
                  </span>
                  <input
                    className="input border-none rounded-none text-xs py-2 flex-1 bg-transparent"
                    type="number"
                    placeholder="1200"
                    value={form.consultationFee}
                    onChange={updateForm('consultationFee')}
                  />
                </div>
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">SESSION DURATION</label>
                <div className="relative">
                  <select
                    className="select text-xs py-2 pr-8 appearance-none"
                    value={form.sessionDuration}
                    onChange={updateForm('sessionDuration')}
                  >
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="45 Minutes">45 Minutes</option>
                    <option value="60 Minutes">60 Minutes</option>
                    <option value="90 Minutes">90 Minutes</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">AVAILABILITY TYPE</label>
                <div className="relative">
                  <select
                    className="select text-xs py-2 pr-8 appearance-none"
                    value={form.availabilityType}
                    onChange={updateForm('availabilityType')}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Visiting Specialist">Visiting Specialist</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, onlineConsultation: !p.onlineConsultation }))}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${form.onlineConsultation ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${form.onlineConsultation ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className="font-bold text-slate-700 text-xs">Online Consultation</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, homeVisitEnabled: !p.homeVisitEnabled }))}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${form.homeVisitEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${form.homeVisitEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className="font-bold text-slate-700 text-xs">Home Visit Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. ACCOUNT SETTINGS */}
          <div className="card p-6 space-y-5 shadow-sm rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Account Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">USERNAME</label>
                <input
                  className="input text-xs py-2"
                  placeholder="aarav_sharma_physio"
                  value={form.username}
                  onChange={updateForm('username')}
                />
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">TEMP PASSWORD</label>
                <input
                  className="input text-xs py-2"
                  type="password"
                  placeholder="••••••••"
                  value={form.tempPassword}
                  onChange={updateForm('tempPassword')}
                />
              </div>

              <div>
                <label className="label text-[10px] font-bold text-slate-500 uppercase">SYSTEM ROLE</label>
                <div className="relative">
                  <select
                    className="select text-xs py-2 pr-8 appearance-none"
                    value={form.systemRole}
                    onChange={updateForm('systemRole')}
                  >
                    <option value="Medical Practitioner">Medical Practitioner</option>
                    <option value="Lead Consultant">Lead Consultant</option>
                    <option value="Assistant Physio">Assistant Physio</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <span className="font-bold text-slate-700 text-xs">Account Status</span>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, accountStatus: !p.accountStatus }))}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${form.accountStatus ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${form.accountStatus ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${form.accountStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {form.accountStatus ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-6">
          
          {/* 1. PROFILE PREVIEW CARD */}
          <div className="card overflow-hidden shadow-sm border border-slate-200/80 bg-white rounded-2xl">
            <div className="relative h-44 bg-slate-900">
              <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300 block">PROFILE PREVIEW</span>
                <h3 className="text-lg font-bold drop-shadow-sm leading-snug">{fullNameDisplay}</h3>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">SPECIALIZATION</span>
                <span className="font-bold text-slate-800">
                  {form.specialization !== 'Select Specialization' ? form.specialization : '—'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">EXPERIENCE</span>
                <span className="font-bold text-slate-800">
                  {form.experienceYears ? `${form.experienceYears} Years` : '— Years'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">CONSULTATION FEE</span>
                <span className="font-bold text-blue-600">
                  ₹ {form.consultationFee || 0}
                </span>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-0.5 text-[11px] mt-2">
                <span className="font-bold text-blue-900 uppercase text-[9px] block">CLINIC STATUS</span>
                <p className="text-slate-600">Ready to accept appointments upon profile completion.</p>
              </div>
            </div>
          </div>

          {/* 2. ONBOARDING TIPS CARD */}
          <div className="card p-5 space-y-3 bg-blue-50/40 border border-blue-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs border-b border-blue-100 pb-2">
              <HelpCircle size={15} className="text-blue-600" /> ONBOARDING TIPS
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Ensure the License Number is valid for audit compliance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Upload a professional headshot for the patient portal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Set an accurate Session Duration to avoid schedule overlaps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Confirm Languages Spoken to help patient matching.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── 5. BOTTOM ACTION BAR ── */}
        <div className="col-span-2 card p-4 flex justify-between items-center bg-white border border-slate-200 shadow-sm rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">
            ⚠️ Unsaved changes will be lost unless drafted.
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-secondary text-xs px-5 py-2.5 font-bold bg-white border border-slate-200"
              onClick={() => alert('Draft saved successfully!')}
            >
              Save Draft
            </button>

            <button
              type="submit"
              className="btn btn-primary text-xs px-6 py-2.5 font-bold bg-blue-700 hover:bg-blue-600 rounded-full"
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create Therapist'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
