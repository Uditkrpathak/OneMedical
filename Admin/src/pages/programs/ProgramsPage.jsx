import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Filter, Grid, List, MoreVertical, Download, Share2,
  Archive, Trash2, Clock, Users, CheckCircle2, Layers,
  ChevronRight, Edit2, Eye, TrendingUp, Star
} from 'lucide-react';
import { api } from '../../api/api.js';

const MOCK_PROGRAMS = [
  {
    _id: 'prg_1',
    status: 'PUBLISHED',
    title: 'Post-ACL Recovery',
    desc: 'Comprehensive 12-week rehabilitation protocol.',
    duration: '12 Weeks',
    difficulty: 'Intermediate',
    patients: 428,
    completion: 82,
    thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400',
  },
  {
    _id: 'prg_2',
    status: 'DRAFT',
    title: 'Lower Back Stability',
    desc: 'Core strengthening and postural alignment focus.',
    duration: '8 Weeks',
    difficulty: 'Beginner',
    patients: 184,
    completion: 90,
    thumb: 'https://images.unsplash.com/photo-1666214278195-c2b30b8a6c63?auto=format&fit=crop&q=80&w=400',
  },
  {
    _id: 'prg_3',
    status: 'PUBLISHED',
    title: 'Cervical Mobility',
    desc: 'Targeted stretches for chronic neck tension.',
    duration: '4 Weeks',
    difficulty: 'Beginner',
    patients: 156,
    completion: 94,
    thumb: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
];

const RECENTLY_EDITED = [
  { title: 'Shoulder Impingement', sub: 'System Exercises v3', time: '2h ago' },
  { title: 'Hamstring Strain Level 2', sub: 'Week 4 – Phase B', time: '5h ago' },
];

const POPULAR_TEMPLATES = [
  { title: 'Universal Warm-up', sub: '8 exercises' },
  { title: 'Thoracic Opening', sub: '5 exercises' },
];

const DIFF_COLORS = {
  Intermediate: 'text-amber-700 bg-amber-50 border-amber-200',
  Beginner:     'text-emerald-700 bg-emerald-50 border-emerald-200',
  Advanced:     'text-rose-700 bg-rose-50 border-rose-200',
};

export default function ProgramsPage() {
  const token    = useSelector(s => s.auth?.accessToken);
  const navigate = useNavigate();
  const [programs, setPrograms] = useState(MOCK_PROGRAMS);
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openMenu, setOpenMenu] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await api.listPrograms(token);
      if (res.data && res.data.length > 0) {
        setPrograms(res.data.map((p, i) => ({
          _id: p._id || `prg_${i}`,
          status: p.status || 'PUBLISHED',
          title: p.title || 'Recovery Program',
          desc: p.desc || p.description || '',
          duration: p.duration || '8 Weeks',
          difficulty: p.difficulty || 'Intermediate',
          patients: p.activePatients || p.enrolled || 0,
          completion: p.completion ? parseInt(p.completion) : 80,
          thumb: p.image || MOCK_PROGRAMS[i % 3].thumb,
        })));
      }
    } catch { /* fallback to mock */ }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = programs.filter(p =>
    statusFilter === 'All' || p.status === statusFilter
  );

  return (
    <div className="space-y-6 animate-fade-up text-slate-800">

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Programs</h1>
          <p className="text-xs text-slate-500 mt-1">Create, organize and publish rehabilitation programs.</p>
        </div>
        <button
          onClick={() => navigate('/programs/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-full shadow-sm transition-all"
        >
          <Plus size={14} /> Create Program
        </button>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Program Templates', value: '48', sub: '+3 this week', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Published', value: '26', sub: '6 active clinics', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Drafts', value: '12', sub: 'Pending review', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Patients Assigned', value: '1,248', sub: 'All total', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
            <div className={`text-3xl font-extrabold mt-1 ${c.color}`}>{c.value}</div>
            <div className="text-[11px] text-slate-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ─── MAIN 2-COLUMN LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: PROGRAMS LIST */}
        <div className="lg:col-span-8 space-y-4">

          {/* Filter / View Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200/80 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-2xs">
              <Filter size={13} /> Filters
            </button>
            {['All', 'PUBLISHED', 'DRAFT'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all shadow-2xs ${
                  statusFilter === s
                    ? 'bg-[#003882] text-white border-[#003882]'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Status: {s === 'All' ? 'All' : s === 'PUBLISHED' ? 'Published' : 'Draft'}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Program Cards Grid / List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}>
            {filtered.map(p => (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                onClick={() => navigate(`/programs/${p._id}`)}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.thumb}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.style.background = '#e2e8f0'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Status Badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                    p.status === 'PUBLISHED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700/80 text-white'
                  }`}>
                    {p.status === 'PUBLISHED' ? '● PUBLISHED' : '○ DRAFT'}
                  </span>
                  {/* 3-dot menu */}
                  <button
                    onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === p._id ? null : p._id); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-lg shadow-2xs transition-all"
                  >
                    <MoreVertical size={14} className="text-slate-600" />
                  </button>
                  {openMenu === p._id && (
                    <div className="absolute top-9 right-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[130px]" onClick={e => e.stopPropagation()}>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50"><Edit2 size={12} /> Edit Program</button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50"><Eye size={12} /> Preview</button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-rose-500 hover:bg-rose-50"><Trash2 size={12} /> Delete</button>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{p.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{p.desc}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] flex-wrap">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock size={11} /> <span className="font-bold text-slate-700">{p.duration}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${DIFF_COLORS[p.difficulty] || DIFF_COLORS.Intermediate}`}>
                      {p.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Users size={11} />
                      <span className="font-bold text-slate-700">{p.patients.toLocaleString()} Active</span>
                    </div>
                    <div className="text-slate-500">
                      Completion <span className="font-bold text-slate-700">{p.completion}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#003882] rounded-full" style={{ width: `${p.completion}%` }} />
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/programs/${p._id}`); }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1"
                  >
                    View Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-5">

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Download, label: 'Export', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Share2,   label: 'Share',   color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: Archive,  label: 'Archive', color: 'text-amber-600',  bg: 'bg-amber-50' },
                { icon: Trash2,   label: 'Delete',  color: 'text-rose-600',   bg: 'bg-rose-50' },
              ].map(a => (
                <button key={a.label} className="flex flex-col items-center gap-2 p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:shadow-md hover:border-blue-200 transition-all">
                  <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center`}>
                    <a.icon size={16} className={a.color} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RECENTLY EDITED */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recently Edited</h3>
              <button className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="space-y-2.5">
              {RECENTLY_EDITED.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Layers size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{r.title}</div>
                    <div className="text-[11px] text-slate-400">{r.sub}</div>
                  </div>
                  <div className="text-[10px] text-slate-300 shrink-0">{r.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* POPULAR TEMPLATES */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Templates</h3>
            <div className="space-y-2">
              {POPULAR_TEMPLATES.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl hover:bg-blue-50/50 cursor-pointer group transition-all">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.title}</div>
                    <div className="text-[11px] text-slate-400">{t.sub}</div>
                  </div>
                  <button className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:border-blue-300 transition-all">
                    <Plus size={13} className="text-blue-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* GLOBAL STATS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Stats</h3>
            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Avg. completion rate', value: '84%', color: 'text-emerald-600' },
                { label: 'Avg. session duration', value: '42 mins', color: 'text-blue-600' },
                { label: 'Active users this week', value: '312', color: 'text-purple-600' },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-slate-500">{s.label}</span>
                  <span className={`font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
