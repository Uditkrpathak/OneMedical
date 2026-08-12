import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Plus, ChevronDown, Check, ShieldCheck, Users, FileText,
  Zap, Accessibility, Dumbbell, Scissors
} from 'lucide-react';
import { api } from '../../api/api.js';

const TEMPLATES = [
  { key: 'blank',   label: 'Blank Program',  icon: '✚',  color: 'bg-slate-100 text-slate-600' },
  { key: 'lower',   label: 'Lower Back',     icon: '🦴', color: 'bg-blue-50 text-blue-700' },
  { key: 'acl',     label: 'ACL Rehab',      icon: '🦵', color: 'bg-indigo-50 text-indigo-700' },
  { key: 'shoulder',label: 'Shoulder',       icon: '💪', color: 'bg-purple-50 text-purple-700' },
  { key: 'sports',  label: 'Sports Injury',  icon: '🏃', color: 'bg-emerald-50 text-emerald-700' },
  { key: 'post',    label: 'Post Surgery',   icon: '🏥', color: 'bg-rose-50 text-rose-700' },
];

const CONDITIONS = [
  'ACL Tear', 'Lower Back Pain', 'Frozen Shoulder', 'Cervical Spondylosis',
  'Knee Osteoarthritis', 'Plantar Fasciitis', 'Rotator Cuff Tear',
];

const BODY_AREAS = [
  'Spine & Back', 'Knee & Leg', 'Shoulder & Arm', 'Neck', 'Hip & Pelvis',
  'Ankle & Foot', 'Full Body',
];

export default function CreateProgramPage() {
  const token    = useSelector(s => s.auth?.accessToken);
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [programName, setProgramName]           = useState('');
  const [condition, setCondition]               = useState('');
  const [bodyArea, setBodyArea]                 = useState('');
  const [difficulty, setDifficulty]             = useState('Intermediate');
  const [duration, setDuration]                 = useState('12');
  const [visibility, setVisibility]             = useState('draft'); // 'draft' | 'publish'
  const [loading, setLoading]                   = useState(false);

  const handleCreate = async () => {
    if (!programName.trim()) return;
    setLoading(true);
    try {
      await api.createProgram(token, {
        title: programName,
        condition,
        bodyArea,
        difficulty,
        duration: `${duration} Weeks`,
        visibility,
        template: selectedTemplate,
      });
    } catch { /* fallback */ }
    setLoading(false);
    navigate('/programs');
  };

  return (
    <div className="space-y-6 animate-fade-up text-slate-800 max-w-[900px] mx-auto pb-12">

      {/* ─── PAGE HEADER ─── */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Recovery Program</h1>
        <p className="text-xs text-slate-500 mt-1">Start with the essentials. You can add exercises, weeks and goals later.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">

        {/* ─── TEMPLATE PICKER ─── */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start From a Template</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.key}
                onClick={() => setSelectedTemplate(t.key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center transition-all ${
                  selectedTemplate === t.key
                    ? 'border-[#003882] bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-blue-200 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${t.color}`}>
                  {t.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-700 leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* ─── PROGRAM NAME ─── */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Program Name</label>
          <input
            value={programName}
            onChange={e => setProgramName(e.target.value)}
            placeholder="e.g. 12-Week Post-ACL Reconstruction"
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* ─── CONDITION + BODY AREA ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Target Condition</label>
            <div className="relative">
              <select
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Body Area</label>
            <div className="relative">
              <select
                value={bodyArea}
                onChange={e => setBodyArea(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select area</option>
                {BODY_AREAS.map(b => <option key={b}>{b}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ─── DIFFICULTY + DURATION ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Difficulty</label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200">
              {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 text-[11px] font-bold transition-all ${
                    difficulty === d
                      ? 'bg-[#003882] text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Estimated Duration</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                min={1}
                max={52}
                onChange={e => setDuration(e.target.value)}
                className="w-20 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-xs font-bold text-slate-400">Weeks</span>
            </div>
          </div>
        </div>

        {/* ─── PROGRAM VISIBILITY ─── */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Program Visibility</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setVisibility('draft')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                visibility === 'draft'
                  ? 'border-[#003882] bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  visibility === 'draft' ? 'border-[#003882] bg-[#003882]' : 'border-slate-300'
                }`}>
                  {visibility === 'draft' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Draft Mode</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Visible only to admins</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setVisibility('publish')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                visibility === 'publish'
                  ? 'border-[#003882] bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  visibility === 'publish' ? 'border-[#003882] bg-[#003882]' : 'border-slate-300'
                }`}>
                  {visibility === 'publish' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Publish Later</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Schedule for specific date</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ─── ACTIONS ─── */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={() => navigate('/programs')}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-full border border-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !programName.trim()}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full shadow-sm transition-all ${
              programName.trim()
                ? 'bg-[#003882] hover:bg-[#002b66] text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            Create Program →
          </button>
        </div>
      </div>

      {/* ─── BOTTOM TRUST BADGES ─── */}
      <div className="flex items-center justify-center gap-8 text-[11px] text-slate-400 pt-2">
        <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Clinical Goals Protocol</div>
        <div className="flex items-center gap-1.5"><Users size={14} className="text-blue-500" /> Auto-Invite to Clinics</div>
        <div className="flex items-center gap-1.5"><FileText size={14} className="text-purple-500" /> HIPAA Compliant Protocol</div>
      </div>
    </div>
  );
}
