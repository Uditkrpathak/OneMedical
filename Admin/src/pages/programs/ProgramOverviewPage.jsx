import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Users, Clock, Layers, TrendingUp, BarChart2, CheckCircle2,
  Copy, UserPlus, Download, Archive, ChevronRight, ChevronDown,
  Plus, Edit2, Activity, Target
} from 'lucide-react';

const PROGRAM = {
  title: 'Lower Back Recovery Program',
  subtitle: 'A comprehensive 8-week structured protocol designed for patients recovering from acute disc herniation and chronic lumbar instability.',
  version: 'v2.1',
  status: 'Published',
  duration: '8 Weeks',
  exercises: 42,
  patients: 126,
  completion: 67,
  goals: [
    'Restore lumbar mobility, strengthen core stabilizers, and manage pain through graded exposure and neural mobilization'
  ],
  focusArea: { name: 'Lumbar Spine', sub: 'Primary anatomical focus' },
  difficulty: 'Intermediate',
  successRate: '92%',
  targetConditions: ['Sciatica', 'Disc Herniation', 'Spinal Stenosis'],
  recoveryJourney: [
    { weeks: '0-2', label: 'Pain Management & Mobilization' },
    { weeks: '2-4', label: 'Foundation Stability' },
    { weeks: '4-6', label: 'Strength & Exercise Gains' },
    { weeks: '7-8', label: 'Recovery' },
  ],
  chartData: [22, 35, 48, 60, 72, 67],
};

const WEEKS = [
  {
    num: 1,
    title: 'Pain Management & Mobilization',
    desc: 'Focus on reducing inflammation and restoring basic range of motion.',
    sessions: 3,
    exercises: 6,
    focus: 'Neural Desensitization',
    exerciseList: [
      { name: 'Pelvic Tilts', sets: '2 sets × 10/min', rest: '30s', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=60' },
      { name: 'Knee-to-Chest', sets: '2 sets × Next: 10s', rest: '15s', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=60' },
      { name: 'Cat-Cow', sets: '2 sets × 10 reps · 5e · 15s', rest: '15s', thumb: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=60' },
    ],
  },
  { num: 2, title: 'Foundational Stability', desc: 'Core engagement and proprioceptive awareness training.', sessions: 3, exercises: 5, focus: 'Core Activation', exerciseList: [] },
  { num: 3, title: 'Strength & Dynamic Control', desc: 'Progressive loading of posterior chain and trunk musculature.', sessions: 4, exercises: 7, focus: 'Progressive Overload', exerciseList: [] },
  { num: 4, title: 'Functional Integration', desc: 'Bridging rehabilitation to daily functional movements.', sessions: 3, exercises: 6, focus: 'ADL Training', exerciseList: [] },
];

const RECENT_ACTIVITY = [
  { user: 'Dr. Sarah Chen', action: 'updated 3 exercises in Week 4', time: '2 hours ago' },
  { user: 'Marcus Reed', action: 'published v2.1 of the program', time: 'Yesterday at 3:45 PM' },
  { user: 'Dr. Usman Wilson', action: 'added internal clinical notes', time: 'Oct 24, 2024' },
];

const TABS = ['Overview', 'Weeks', 'Exercises', 'Assigned Patients', 'Outcomes', 'Version History'];

export default function ProgramOverviewPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [activeTab, setActiveTab]     = useState('Overview');
  const [expandedWeek, setExpandedWeek] = useState(1);

  return (
    <div className="space-y-6 animate-fade-up text-slate-800 max-w-[1380px] mx-auto pb-12">

      {/* ─── PAGE HEADER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{PROGRAM.title}</h1>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{PROGRAM.version}</span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">● {PROGRAM.status}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 max-w-xl">{PROGRAM.subtitle}</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-full shadow-sm transition-all whitespace-nowrap">
            <UserPlus size={14} /> Assign Patients
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Duration', value: PROGRAM.duration, sub: 'Standard Protocol', icon: Clock },
            { label: 'Exercises', value: PROGRAM.exercises, sub: '+2 since v2.0', icon: Layers },
            { label: 'Assigned Patients', value: PROGRAM.patients, sub: 'Active in clinics', icon: Users },
            { label: 'Completion Rate', value: `${PROGRAM.completion}%`, sub: null, icon: TrendingUp, progress: true },
          ].map(c => (
            <div key={c.label} className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase">{c.label}</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{c.value}</div>
              {c.sub && <div className="text-[11px] text-slate-400">{c.sub}</div>}
              {c.progress && (
                <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#003882] rounded-full" style={{ width: `${PROGRAM.completion}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex overflow-x-auto gap-0 border-b border-slate-100 -mb-5 -mx-5 px-5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#003882] text-[#003882]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'Overview' && (
          <>
            {/* LEFT */}
            <div className="lg:col-span-8 space-y-5">
              {/* Program Overview Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Program Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Goals */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">GOALS</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{PROGRAM.goals[0]}</p>

                    <div className="mt-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">TARGET CONDITIONS</div>
                      <div className="flex flex-wrap gap-1.5">
                        {PROGRAM.targetConditions.map(c => (
                          <span key={c} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Focus Area */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">FOCUS AREAS</div>
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                      <div className="text-xs font-extrabold text-blue-800">{PROGRAM.focusArea.name}</div>
                      <div className="text-[11px] text-blue-600">{PROGRAM.focusArea.sub}</div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <div className="text-[10px] text-slate-400 uppercase">Difficulty</div>
                        <div className="font-bold text-slate-800">{PROGRAM.difficulty}</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <div className="text-[10px] text-slate-400 uppercase">Success Rate</div>
                        <div className="font-bold text-emerald-600">{PROGRAM.successRate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recovery Journey */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Recovery Journey</h3>
                  <button className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                    Full Timeline <ChevronRight size={12} />
                  </button>
                </div>
                {/* Phase dots */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-6 left-4 right-4 h-0.5 bg-slate-200" />
                  <div className="grid grid-cols-4 gap-2 relative">
                    {PROGRAM.recoveryJourney.map((phase, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 text-center">
                        <div className={`w-4 h-4 rounded-full border-2 z-10 ${i <= 1 ? 'bg-[#003882] border-[#003882]' : 'bg-white border-slate-300'}`} />
                        <div className="text-[10px] font-bold text-slate-400">Weeks {phase.weeks}</div>
                        <div className="text-[10px] font-bold text-slate-700 leading-tight">{phase.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Program Statistics */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900">Program Statistics</h3>
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Avg Mobility Score</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Pain Reduction (%)</span>
                </div>
                {/* Simple sparkline chart */}
                <div className="flex items-end gap-1.5 h-28 pt-2">
                  {PROGRAM.chartData.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                      <div className="w-full flex flex-col gap-0.5 items-center" style={{ height: '80px' }}>
                        <div className="w-2.5 rounded-t bg-blue-500 transition-all" style={{ height: `${v}%` }} />
                        <div className="w-2.5 rounded-t bg-emerald-400 opacity-60 transition-all" style={{ height: `${v * 0.7}%` }} />
                      </div>
                      <div className="text-[9px] text-slate-400">W{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4 space-y-5">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                {[
                  { icon: Copy,     label: 'Duplicate Program',   color: 'text-blue-600' },
                  { icon: UserPlus, label: 'Bulk Assign',          color: 'text-purple-600' },
                  { icon: Download, label: 'Export Clinical PDF',  color: 'text-emerald-600' },
                  { icon: Archive,  label: 'Archive Program',      color: 'text-rose-500', danger: true },
                ].map(a => (
                  <button
                    key={a.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold transition-all ${
                      a.danger
                        ? 'text-rose-500 hover:bg-rose-50 hover:border-rose-200'
                        : `${a.color} hover:bg-slate-50`
                    }`}
                  >
                    <a.icon size={15} /> {a.label}
                  </button>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                  <button className="text-[11px] font-bold text-blue-600 hover:underline">View Full Audit Log</button>
                </div>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((a, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-bold text-slate-800">{a.user}</span>
                      <span className="text-slate-500"> {a.action}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── WEEKS TAB ── */}
        {activeTab === 'Weeks' && (
          <>
            {/* LEFT: Week Accordions */}
            <div className="lg:col-span-8 space-y-3">
              {WEEKS.map(week => (
                <div key={week.num} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  {/* Week Header */}
                  <button
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50/60 transition-colors"
                    onClick={() => setExpandedWeek(expandedWeek === week.num ? null : week.num)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-[#003882] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        {week.num}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-extrabold text-slate-900">{week.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{week.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-slate-400">{week.sessions} per week</div>
                        <div className="text-[10px] font-bold text-slate-600">{week.exercises} exercises</div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${expandedWeek === week.num ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Week Details (expanded) */}
                  {expandedWeek === week.num && (
                    <div className="border-t border-slate-100 px-5 pb-5 space-y-4">
                      {/* Meta row */}
                      <div className="flex flex-wrap gap-4 pt-4 text-[11px]">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Activity size={12} /> {week.sessions} per week
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Layers size={12} /> {week.exercises} exercises
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Target size={12} /> Clinical Focus: <strong className="text-slate-800">{week.focus}</strong>
                        </span>
                      </div>

                      {/* Exercise Sequence */}
                      {week.exerciseList.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exercise Sequence</div>
                          {week.exerciseList.map((ex, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                              <img
                                src={ex.thumb}
                                alt={ex.name}
                                className="w-9 h-9 rounded-xl object-cover shrink-0"
                                onError={e => e.target.style.background = '#e2e8f0'}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-900">{ex.name}</div>
                                <div className="text-[10px] text-slate-400">{ex.sets}</div>
                              </div>
                              <div className="text-[10px] text-slate-400">Rest: {ex.rest}</div>
                            </div>
                          ))}
                          <button
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-1"
                          >
                            <Plus size={12} /> Add Exercise
                          </button>
                        </div>
                      )}

                      {/* Week Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
                          <Edit2 size={12} /> Edit Week Configuration
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-all">
                          <Plus size={12} /> Add Training Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <p className="text-center text-[11px] text-slate-400 pt-2">Weeks 5–8 available in full view</p>
            </div>

            {/* RIGHT Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              {/* Weekly Progress Target */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Week Insights</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Weekly Progress Target</span>
                  <span className="font-extrabold text-[#003882]">100%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#003882] rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Most patients complete this in&nbsp;3–5 days on average. Success rate for neural desensitization is 84%.
                </p>
              </div>

              {/* Cumulative Program Load */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cumulative Program Load</h3>
                <div className="flex items-end gap-2 h-20">
                  {[30, 42, 55, 65, 75, 80, 87, 90].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${v}%`,
                        background: `rgba(0,56,130,${0.3 + i * 0.09})`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>WEEK 1</span>
                  <span>WEEK 8</span>
                </div>
              </div>

              {/* Phase 1 Guidelines */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Phase 1 Guidelines
                </h3>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-start gap-1.5"><span className="text-[#003882] mt-0.5">•</span> Avoid long-lever rotation exercises in Weeks 1–2.</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#003882] mt-0.5">•</span> Emphasize understanding during a stiffness or pain spike.</li>
                  <li className="flex items-start gap-1.5"><span className="text-[#003882] mt-0.5">•</span> Target VAS pain reduction of 25% before advancing to Week 3.</li>
                </ul>
                <button className="text-[11px] font-bold text-blue-600 hover:underline mt-1">View Full Clinical Protocols</button>
              </div>
            </div>
          </>
        )}

        {/* Placeholder for other tabs */}
        {!['Overview', 'Weeks'].includes(activeTab) && (
          <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-12 text-center text-slate-400 text-sm">
            <Layers size={32} className="mx-auto mb-3 opacity-30" />
            <div className="font-bold">{activeTab} content coming soon</div>
          </div>
        )}
      </div>
    </div>
  );
}
