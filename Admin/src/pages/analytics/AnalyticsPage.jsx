import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp, TrendingDown, Users, Calendar, CheckCircle2,
  Download, ChevronDown, BarChart2, Activity, Star
} from 'lucide-react';
import { api } from '../../api/api.js';

// ── Inline SVG sparkline ──────────────────────────────────────────────────────
function Sparkline({ data, color = '#003882', height = 40, filled = true }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200; const h = height;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 8) - 4,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${pts[pts.length-1].x} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      {filled && <path d={area} fill={color} fillOpacity="0.12" />}
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, color = '#003882', labels }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-lg transition-all"
            style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.7 + (v / max) * 0.3 }}
          />
          {labels && <div className="text-[9px] text-slate-400 whitespace-nowrap">{labels[i]}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Funnel bar ────────────────────────────────────────────────────────────────
function FunnelBar({ label, value, total, color }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-bold text-slate-800">{value.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const DATE_RANGES = ['This Week', 'This Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

const MOCK_REVENUE    = [82000, 94000, 110000, 88000, 125000, 138000];
const MOCK_APT_COUNTS = [48, 62, 55, 71, 66, 80];
const MOCK_PATIENTS   = [12, 18, 14, 22, 19, 25];
const MONTHS          = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const THERAPIST_STATS = [
  { name: 'Dr. Ankur Mehta',  sessions: 24, revenue: 28800, rating: 4.9, utilization: 88, trend: 'up' },
  { name: 'Dr. Priya Sharma', sessions: 18, revenue: 21600, rating: 4.8, utilization: 72, trend: 'up' },
  { name: 'Dr. Ananya Iyer',  sessions: 14, revenue: 16800, rating: 4.9, utilization: 65, trend: 'down' },
  { name: 'Dr. Rohan Bose',   sessions: 11, revenue: 13200, rating: 4.7, utilization: 58, trend: 'up' },
];

function fmt(n) { return `₹${Number(n).toLocaleString('en-IN')}`; }

export default function AnalyticsPage() {
  const token = useSelector(s => s.auth?.accessToken);
  const [dateRange, setDateRange]         = useState('Last 6 Months');
  const [showRangeDrop, setShowRangeDrop] = useState(false);
  const [loading, setLoading]             = useState(false);

  const totalRevenue   = MOCK_REVENUE.reduce((a, v) => a + v, 0);
  const totalAppts     = MOCK_APT_COUNTS.reduce((a, v) => a + v, 0);
  const newPatients    = MOCK_PATIENTS.reduce((a, v) => a + v, 0);
  const completionRate = 84;

  return (
    <div className="space-y-6 animate-fade-up text-slate-800">

      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Clinic performance, revenue trends, and patient insights.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <div className="relative">
            <button
              onClick={() => setShowRangeDrop(d => !d)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-700 rounded-full shadow-2xs hover:bg-slate-50 transition-all"
            >
              <Calendar size={13} /> {dateRange} <ChevronDown size={13} className={`transition-transform ${showRangeDrop ? 'rotate-180' : ''}`} />
            </button>
            {showRangeDrop && (
              <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg z-20 py-1 min-w-[160px]">
                {DATE_RANGES.map(r => (
                  <button key={r} onClick={() => { setDateRange(r); setShowRangeDrop(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${dateRange === r ? 'text-[#003882] bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-600 rounded-full shadow-2xs hover:bg-slate-50 transition-all">
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* ─── KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), change: '+18%', dir: 'up', sub: 'vs last period', sparkData: MOCK_REVENUE, color: '#003882' },
          { label: 'Appointments', value: totalAppts, change: '+12%', dir: 'up', sub: 'completed sessions', sparkData: MOCK_APT_COUNTS, color: '#0ea5e9' },
          { label: 'New Patients', value: newPatients, change: '+24%', dir: 'up', sub: 'acquired', sparkData: MOCK_PATIENTS, color: '#8b5cf6' },
          { label: 'Completion Rate', value: `${completionRate}%`, change: '-2%', dir: 'down', sub: 'session completion', sparkData: [80, 83, 85, 84, 82, 84], color: '#10b981' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-2 overflow-hidden relative">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
            <div className="text-2xl font-extrabold text-slate-900">{c.value}</div>
            <div className={`flex items-center gap-1 text-[11px] font-bold ${c.dir === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {c.dir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {c.change} <span className="text-slate-400 font-normal">{c.sub}</span>
            </div>
            <div className="mt-2 -mx-1">
              <Sparkline data={c.sparkData} color={c.color} height={36} />
            </div>
          </div>
        ))}
      </div>

      {/* ─── CHARTS ROW 1 ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Revenue Trend */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Revenue Trend</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Monthly clinic revenue — last 6 months</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-[#003882]">{fmt(totalRevenue)}</div>
              <div className="text-[11px] text-emerald-600 font-bold">↑ 18% vs prev. period</div>
            </div>
          </div>

          {/* Revenue bars with month labels */}
          <div className="flex items-end gap-3 h-36 pt-2">
            {MOCK_REVENUE.map((v, i) => {
              const max = Math.max(...MOCK_REVENUE);
              const pct = (v / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="text-[10px] font-bold text-transparent group-hover:text-slate-700 transition-colors">{fmt(v)}</div>
                  <div
                    className="w-full rounded-t-xl transition-all group-hover:opacity-100"
                    style={{ height: `${pct}%`, background: `linear-gradient(180deg, #003882 0%, #0056cc 100%)`, opacity: 0.7 + (pct / 100) * 0.3 }}
                  />
                  <div className="text-[10px] font-bold text-slate-400">{MONTHS[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointment Funnel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Appointment Funnel</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Booking → completion breakdown</p>
          </div>
          <div className="space-y-3">
            <FunnelBar label="Booked" value={382} total={382} color="#003882" />
            <FunnelBar label="Confirmed" value={354} total={382} color="#0ea5e9" />
            <FunnelBar label="Attended" value={331} total={382} color="#8b5cf6" />
            <FunnelBar label="Completed" value={321} total={382} color="#10b981" />
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px]">
            <span className="font-bold text-emerald-700">84% completion rate</span>
            <span className="text-emerald-600"> — above industry avg of 72%</span>
          </div>
        </div>
      </div>

      {/* ─── CHARTS ROW 2 ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Patient Acquisition */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Patient Acquisition</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">New vs. returning patients per month</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#003882] inline-block"/> New</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-300 inline-block"/> Returning</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {MOCK_PATIENTS.map((v, i) => {
              const returning = Math.round(v * 1.8);
              const maxTotal = Math.max(...MOCK_PATIENTS) * 2.8;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col-reverse" style={{ height: '90px' }}>
                    <div className="w-full rounded-b-lg" style={{ height: `${(returning / maxTotal) * 90}px`, background: '#bfdbfe' }} />
                    <div className="w-full rounded-t-lg" style={{ height: `${(v / maxTotal) * 90}px`, background: '#003882' }} />
                  </div>
                  <div className="text-[9px] text-slate-400">{MONTHS[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Therapist Performance */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Therapist Performance</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">This month's individual metrics</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[550px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Therapist', 'Sessions', 'Revenue', 'Rating', 'Utilization', 'Trend'].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {THERAPIST_STATS.map(t => (
                  <tr key={t.name} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900 whitespace-nowrap">{t.name}</td>
                    <td className="py-3 px-2 text-slate-600">{t.sessions}</td>
                    <td className="py-3 px-2 font-bold text-[#003882]">{fmt(t.revenue)}</td>
                    <td className="py-3 px-2">
                      <span className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" /> {t.rating}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003882] rounded-full" style={{ width: `${t.utilization}%` }} />
                        </div>
                        <span className="font-bold text-slate-600">{t.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {t.trend === 'up'
                        ? <span className="text-emerald-600 font-bold flex items-center gap-0.5"><TrendingUp size={12} /> Up</span>
                        : <span className="text-rose-500 font-bold flex items-center gap-0.5"><TrendingDown size={12} /> Down</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── TOP PROGRAMS ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Top Performing Programs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Post-ACL Recovery', patients: 428, completion: 82, trend: '+5%' },
            { title: 'Lower Back Stability', patients: 184, completion: 90, trend: '+12%' },
            { title: 'Cervical Mobility', patients: 156, completion: 94, trend: '+8%' },
          ].map(p => (
            <div key={p.title} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
              <div className="text-xs font-extrabold text-slate-900">{p.title}</div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">{p.patients.toLocaleString()} patients</span>
                <span className="font-bold text-emerald-600">{p.trend}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Completion</span><span className="font-bold">{p.completion}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#003882] rounded-full" style={{ width: `${p.completion}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
