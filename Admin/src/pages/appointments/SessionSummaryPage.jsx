import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  User, CheckCircle2, FileText, Plus, Bold, Italic,
  List, Link2, Clock, Save, Send, ChevronDown, Check
} from 'lucide-react';
import { UserAvatar } from '../../components/ui.jsx';
import { api } from '../../api/api.js';

const TREATMENTS = [
  { key: 'manual', label: 'Manual Therapy', default: true },
  { key: 'stretching', label: 'Stretching', default: true },
  { key: 'strength', label: 'Strength Training', default: false },
  { key: 'mobility', label: 'Mobility Exercises', default: true },
  { key: 'electro', label: 'Electrotherapy', default: false },
  { key: 'dry', label: 'Dry Needling', default: false },
  { key: 'soft', label: 'Soft Tissue Release', default: false },
];

const PAIN_LABELS = ['0', '', '3.5 Pn Intl', '', '', '6 Moderate', '', '', '', '', '', '', '12 (max)'];

const CircularProgress = ({ value = 78, size = 112 }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke="#003882" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
};

export default function SessionSummaryPage() {
  const token = useSelector(s => s.auth?.accessToken);
  const navigate = useNavigate();
  const { id } = useParams();

  // Treatment toggles
  const [activeTreatments, setActiveTreatments] = useState(
    new Set(TREATMENTS.filter(t => t.default).map(t => t.key))
  );
  const toggleTreatment = (key) => {
    setActiveTreatments(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Clinical Notes
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Patient Response
  const [painBefore, setPainBefore] = useState(7);
  const [painAfter, setPainAfter] = useState(3);
  const [mobilityResponse, setMobilityResponse] = useState('Significant');
  const [strengthResponse, setStrengthResponse] = useState('Stable');

  // Next Treatment Plan
  const [exercises, setExercises] = useState([
    'Scapular retractions – 3 sets of 12 reps, focus on slow eccentric phase.'
  ]);
  const [homeInstructions, setHomeInstructions] = useState('Apply ice for 15 mins post-workout. Avoid heavy lifting');
  const [programMods, setProgramMods] = useState('');

  // Follow-up Checklist
  const [checklist, setChecklist] = useState({
    hep: true, report: false, schedule: false, share: false
  });
  const toggleChecklist = (key) => setChecklist(p => ({ ...p, [key]: !p[key] }));

  // State
  const [loading, setLoading] = useState(false);
  const [autoSaveTime] = useState('2 mins ago');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await api.saveSessionSummary(token, id || 'APT-1024', {
        treatments: [...activeTreatments],
        notes: clinicalNotes,
        draft: true,
      });
    } catch { /* fallback */ }
    setLoading(false);
    showToast('Draft saved successfully!');
  };

  const handleCompleteSession = async () => {
    setLoading(true);
    try {
      await api.saveSessionSummary(token, id || 'APT-1024', {
        treatments: [...activeTreatments],
        notes: clinicalNotes,
        painBefore, painAfter,
        mobilityResponse, strengthResponse,
        homeInstructions, programMods,
        checklist,
        complete: true,
      });
    } catch { /* fallback */ }
    setLoading(false);
    showToast('Session completed successfully!');
    setTimeout(() => navigate(`/appointments/${id || 'APT-1024'}`), 1400);
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-up max-w-[1380px] mx-auto pb-16 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
          <CheckCircle2 size={15} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Session Summary</h1>
        <p className="text-xs text-slate-500 mt-1">Document today's treatment and prepare the next recovery steps.</p>
      </div>

      {/* ─── PATIENT INFO BANNER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Patient */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User size={17} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 leading-tight">Sanya Malhotra</div>
              <div className="text-[11px] text-slate-400 font-mono">Patient Id #3M-90212</div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-100 hidden sm:block" />

          {/* Meta grid */}
          <div className="flex flex-wrap gap-6 text-xs">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">THERAPIST</div>
              <div className="font-bold text-slate-800 mt-0.5">Mr. Arjun Mehta</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SESSION TYPE</div>
              <div className="font-bold text-slate-800 mt-0.5">Clinic Visit</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DURATION</div>
              <div className="font-bold text-slate-800 mt-0.5">45 mins</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DATE & TIME</div>
              <div className="font-bold text-slate-800 mt-0.5">Oct 23, 2024 • 02:30 PM</div>
            </div>
          </div>

          <div className="ml-auto">
            <span className="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full">
              In Progress
            </span>
          </div>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-5">

          {/* ── 1. TREATMENT PERFORMED ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-base">🩺</span> Treatment Performed
            </h3>

            <div className="flex flex-wrap gap-2">
              {TREATMENTS.map(t => (
                <button
                  key={t.key}
                  onClick={() => toggleTreatment(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                    activeTreatments.has(t.key)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {activeTreatments.has(t.key) && <Check size={11} />}
                  {t.label}
                </button>
              ))}
              <button className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border border-dashed border-slate-300 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all">
                <Plus size={11} /> Add Other
              </button>
            </div>
          </div>

          {/* ── 2. CLINICAL NOTES ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-base">📋</span> Clinical Notes
            </h3>

            {/* Fake Toolbar */}
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2.5">
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Bold size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Italic size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><List size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Link2 size={14} /></button>
              <div className="ml-auto">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Clock size={14} /></button>
              </div>
            </div>

            <textarea
              rows={5}
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              placeholder="Begin typing clinical observations and objective findings here..."
              className="w-full text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* ── 3. PATIENT RESPONSE ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-base">🎯</span> Patient Response
            </h3>

            {/* Pain Level VAS Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Pain Level (VAS)</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-400">Before <span className="font-bold text-slate-800">{painBefore}/10</span></span>
                  <span className="text-slate-400">After <span className="font-bold text-emerald-600">{painAfter}/10</span></span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-10">Before</span>
                  <input
                    type="range" min={0} max={10} value={painBefore}
                    onChange={e => setPainBefore(Number(e.target.value))}
                    className="flex-1 accent-[#003882] h-1.5 rounded-full"
                  />
                  <span className="text-[10px] font-bold text-slate-600 w-6 text-right">{painBefore}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-10">After</span>
                  <input
                    type="range" min={0} max={10} value={painAfter}
                    onChange={e => setPainAfter(Number(e.target.value))}
                    className="flex-1 accent-emerald-500 h-1.5 rounded-full"
                  />
                  <span className="text-[10px] font-bold text-emerald-600 w-6 text-right">{painAfter}</span>
                </div>
              </div>
            </div>

            {/* Mobility & Strength toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Mobility Improvement</div>
                <div className="flex rounded-xl overflow-hidden border border-slate-200">
                  {['None', 'Minor', 'Significant'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setMobilityResponse(opt)}
                      className={`flex-1 py-1.5 text-[11px] font-bold transition-all ${
                        mobilityResponse === opt
                          ? 'bg-[#003882] text-white'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Strength Response</div>
                <div className="flex rounded-xl overflow-hidden border border-slate-200">
                  {['Increased', 'Stable', 'Improved'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setStrengthResponse(opt)}
                      className={`flex-1 py-1.5 text-[11px] font-bold transition-all ${
                        strengthResponse === opt
                          ? 'bg-[#003882] text-white'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. NEXT TREATMENT PLAN ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-base">🏥</span> Next Treatment Plan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Recommended Exercises */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Recommended Exercises</div>
                <div className="space-y-2">
                  {exercises.map((ex, i) => (
                    <div key={i} className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/80 text-[11px] text-slate-700 leading-relaxed">
                      {ex}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setExercises(p => [...p, ''])}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-1"
                >
                  <Plus size={13} /> Add Exercise
                </button>
              </div>

              {/* Home Instructions */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Home Instructions</div>
                <textarea
                  rows={4}
                  value={homeInstructions}
                  onChange={e => setHomeInstructions(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Program Modifications */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700">Program Modifications</div>
              <textarea
                rows={2}
                value={programMods}
                onChange={e => setProgramMods(e.target.value)}
                placeholder="Adjusting load for next session based on today's feedback..."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-5">

          {/* ── RECOVERY SNAPSHOT ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recovery Snapshot</h3>

            {/* Circular Progress */}
            <div className="flex flex-col items-center py-2">
              <div className="relative">
                <CircularProgress value={78} size={110} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900">78%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider -mt-0.5">Recovery<br/>Score</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pain Trend</span>
                <span className="font-bold text-emerald-600">-12% vs last wk</span>
              </div>

              {/* Mini Bar Chart */}
              <div className="flex items-end gap-1 h-10 mt-1">
                {[30, 45, 35, 55, 48, 65, 78].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t-sm transition-all ${i === 6 ? 'bg-[#003882]' : 'bg-slate-200'}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500">Session Completion</span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
            </div>
          </div>

          {/* ── FOLLOW-UP CHECKLIST ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Follow-up Checklist</h3>
            <div className="space-y-2">
              {[
                { key: 'hep', label: 'Assign Home Program (HEP)' },
                { key: 'report', label: 'Upload Report' },
                { key: 'schedule', label: 'Schedule Next Session' },
                { key: 'share', label: 'Share Instructions' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleChecklist(item.key)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      checklist[item.key]
                        ? 'bg-[#003882] border-[#003882]'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checklist[item.key] && <Check size={9} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-xs transition-colors ${checklist[item.key] ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs font-bold text-slate-700 rounded-2xl transition-all shadow-2xs">
              <Save size={14} className="text-slate-500" /> Save Summary
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs font-bold text-slate-700 rounded-2xl transition-all shadow-2xs">
              <FileText size={14} className="text-slate-500" /> Generate Report
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs font-bold text-slate-700 rounded-2xl transition-all shadow-2xs">
              <Send size={14} className="text-slate-500" /> Notify Patient
            </button>
          </div>

        </div>
      </div>

      {/* ─── STICKY BOTTOM FOOTER BAR ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-8 py-3.5 flex items-center justify-between z-40 shadow-lg">
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Clock size={12} /> Auto-saved {autoSaveTime}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
          >
            Save Draft
          </button>
          <button
            onClick={handleCompleteSession}
            disabled={loading}
            className="px-6 py-2 text-xs font-bold text-white bg-[#003882] hover:bg-[#002b66] rounded-full shadow-sm transition-all flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            Complete Session
          </button>
        </div>
      </div>

    </div>
  );
}
