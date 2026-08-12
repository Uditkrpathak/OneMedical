import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, Calendar, CreditCard, TrendingUp, Activity, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { api } from '../../api/api.js';
import { StatCard, PageHeader, Spinner, Avatar, StatusBadge } from '../../components/ui.jsx';

const MOCK_STATS = {
  totalPatients: 1248,
  activeTherapists: 14,
  totalAppointments: 86,
  totalRevenue: '₹4,12,000',
};

const WEEKLY_DATA = [
  { day: 'Mon', appointments: 12, revenue: 8400 },
  { day: 'Tue', appointments: 19, revenue: 13300 },
  { day: 'Wed', appointments: 14, revenue: 9800 },
  { day: 'Thu', appointments: 22, revenue: 15400 },
  { day: 'Fri', appointments: 18, revenue: 12600 },
  { day: 'Sat', appointments: 28, revenue: 19600 },
  { day: 'Sun', appointments: 9,  revenue: 6300 },
];

const RECENT_PATIENTS = [
  { id: 'PT-1024', name: 'Sanya Malhotra', condition: 'ACL Rehabilitation', therapist: 'Dr. Ananya Iyer', progress: 65, status: 'active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 'PT-1023', name: 'Rahul Verma',    condition: 'Lower Back Pain',     therapist: 'Dr. Ankur Mehta',  progress: 40, status: 'active', avatar: null },
  { id: 'PT-1022', name: 'Priya Singh',    condition: 'Frozen Shoulder',     therapist: 'Dr. Ananya Iyer',  progress: 82, status: 'active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
  { id: 'PT-1021', name: 'Arjun Kapoor',   condition: 'Knee Meniscus Tear',  therapist: 'Dr. Sarah Jenkins', progress: 30, status: 'active', avatar: null },
  { id: 'PT-1020', name: 'Meera Nair',     condition: 'Plantar Fasciitis',   therapist: 'Dr. Ankur Mehta',  progress: 90, status: 'completed', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
];

const RECENT_APPOINTMENTS = [
  { id: 'APT-001', patient: 'Sanya Malhotra',  type: 'Physical Therapy',   time: '10:00 AM', status: 'confirmed' },
  { id: 'APT-002', patient: 'Rahul Verma',     type: 'Consultation',        time: '11:30 AM', status: 'confirmed' },
  { id: 'APT-003', patient: 'Priya Singh',     type: 'Follow-up Session',   time: '02:00 PM', status: 'pending' },
  { id: 'APT-004', patient: 'Arjun Kapoor',    type: 'Physiotherapy',       time: '03:30 PM', status: 'confirmed' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-md text-xs">
      <p className="text-slate-400 mb-1 font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold text-xs">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const token    = useSelector(s => s.auth.accessToken);
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const load = async () => {
      try {
        const [users, appointments, payments, therapists] = await Promise.allSettled([
          api.listUsers(token, { limit: 1 }),
          api.listAppointments(token, { limit: 1 }),
          api.listPayments(token, { limit: 1 }),
          api.listTherapists(token, { limit: 1 }),
        ]);
        setStats({
          totalPatients:      users.value?.meta?.total ?? MOCK_STATS.totalPatients,
          activeTherapists:   therapists.value?.meta?.total ?? MOCK_STATS.activeTherapists,
          totalAppointments:  appointments.value?.meta?.total ?? MOCK_STATS.totalAppointments,
          totalRevenue:       MOCK_STATS.totalRevenue,
        });
      } catch {
        setStats(MOCK_STATS);
      }
      setLoading(false);
    };
    load();
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        title="Dashboard Overview"
        subtitle={today}
        action={
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button className="btn btn-secondary text-xs sm:text-sm" onClick={() => navigate('/patients')}>
              <Users size={14} /> View All Patients
            </button>
            <button className="btn btn-primary text-xs sm:text-sm" onClick={() => navigate('/appointments')}>
              <Calendar size={14} /> New Appointment
            </button>
          </div>
        }
      />

      {/* STAT CARDS GRID - 4 HORIZONTAL COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users}       label="Total Patients"   value={stats.totalPatients?.toLocaleString()}  change="12.5% vs last month" changeDir="up"   iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard icon={Stethoscope} label="Active Therapists" value={stats.activeTherapists}                change="2 new this month"     changeDir="up"   iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard icon={Calendar}    label="Appointments Today" value={stats.totalAppointments}              change="8.2% vs yesterday"    changeDir="up"   iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard icon={CreditCard}  label="Monthly Revenue"   value={stats.totalRevenue}                   change="₹18k vs last month"   changeDir="up"   iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Appointment Area Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Weekly Appointments</h3>
              <p className="text-xs text-slate-400">Total sessions scheduled per day</p>
            </div>
            <span className="badge badge-blue flex items-center gap-1">
              <Activity size={10} /> Live Stats
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_DATA} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#2563eb" fill="url(#apptGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Weekly Revenue (₹)</h3>
              <p className="text-xs text-slate-400">Total fee collections per day</p>
            </div>
            <span className="badge badge-purple flex items-center gap-1">
              <TrendingUp size={10} /> ₹19.6k peak
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA} margin={{ left: -20, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue (₹)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Patients Table - FULL WIDTH INSIDE CARD */}
        <div className="lg:col-span-7 card overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recent Patients</h3>
              <p className="text-xs text-slate-400">Latest registered patients</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patients')}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="tbl w-full min-w-[450px]">
              <thead>
                <tr>
                  <th className="w-2/5">Patient</th>
                  <th className="w-1/4">Condition</th>
                  <th className="w-1/4">Progress</th>
                  <th className="w-20 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_PATIENTS.map(p => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.name} src={p.avatar} />
                        <div>
                          <p className="font-semibold text-xs text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600 font-medium">{p.condition}</td>
                    <td>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="progress-track flex-1">
                          <div className="progress-fill" style={{ width: `${p.progress}%`, background: p.progress >= 80 ? '#10b981' : '#2563eb' }} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="text-center"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-5 card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Today's Schedule</h3>
              <p className="text-xs text-slate-400">{RECENT_APPOINTMENTS.length} bookings scheduled</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/appointments')}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-2.5 flex-1">
            {RECENT_APPOINTMENTS.map(apt => (
              <div key={apt.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${apt.status === 'confirmed' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                  {apt.status === 'confirmed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{apt.patient}</p>
                  <p className="text-[11px] text-slate-400">{apt.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-700">{apt.time}</p>
                  <StatusBadge status={apt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
