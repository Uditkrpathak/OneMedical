import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Filter, Download, MoreVertical, Eye, ArrowUpDown, ChevronLeft, ChevronRight,
  LayoutGrid, Table as TableIcon, FileText, UserPlus, TrendingUp, CheckCircle, Activity,
} from 'lucide-react';
import { api } from '../../api/api.js';
import { PageHeader, Spinner, EmptyState } from '../../components/ui.jsx';

const MOCK_PATIENTS = [
  {
    _id: 'p_101',
    id: 'OM-8821',
    name: 'Arjun Mehra',
    ageGender: '42, Male',
    condition: 'Post-Op Rehab',
    therapist: 'Dr. Ananya Sharma',
    nextAppointment: 'Oct 12, 2023 · 09:30 AM',
    recoveryScore: 78,
    status: 'Active Treatment',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    _id: 'p_102',
    id: 'OM-8845',
    name: 'Priya Iyer',
    ageGender: '29, Female',
    condition: 'Neuropathy',
    therapist: 'Dr. Rohan Kapoor',
    nextAppointment: 'Oct 14, 2023 · 02:15 PM',
    recoveryScore: 45,
    status: 'Observation',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
  {
    _id: 'p_103',
    id: 'OM-8790',
    name: 'Vikram Malhotra',
    ageGender: '74, Male',
    condition: 'Hypertension',
    therapist: 'Dr. Dev Mukherjee',
    nextAppointment: 'Tomorrow · 11:00 AM',
    recoveryScore: 92,
    status: 'Recovered',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    _id: 'p_104',
    id: 'OM-8812',
    name: 'Sanya Nair',
    ageGender: '51, Female',
    condition: 'Rehab',
    therapist: 'Dr. Ananya Sharma',
    nextAppointment: 'Oct 20, 2023 · 09:00 AM',
    recoveryScore: 61,
    status: 'Active Treatment',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
  },
];

export default function PatientsPage() {
  const token    = useSelector(s => s.auth.accessToken);
  const navigate = useNavigate();

  const [patients, setPatients]         = useState(MOCK_PATIENTS);
  const [loading, setLoading]           = useState(false);
  const [viewMode, setViewMode]         = useState('table'); // 'table' | 'cards'
  const [searchQuery, setSearchQuery]   = useState('');
  const [conditionFilter, setCondition] = useState('All');
  const [therapistFilter, setTherapist] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ageFilter, setAgeFilter]       = useState('All');
  const [sortBy, setSortBy]             = useState('Recently Updated');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listPatients(token);
      if (res.data && res.data.length > 0) {
        const data = res.data.map((u, idx) => ({
          _id: u._id || `p_${idx}`,
          id: u.id || `OM-${8800 + idx}`,
          name: u.name || 'Patient Name',
          ageGender: u.ageGender || `${u.age || 35}, ${u.gender || 'Male'}`,
          condition: u.condition || 'Post-Op Rehab',
          therapist: u.therapist || 'Dr. Ananya Sharma',
          nextAppointment: u.nextAppointment || 'Oct 15, 2023 · 10:00 AM',
          recoveryScore: u.progress || u.recoveryScore || 75,
          status: u.status || 'Active Treatment',
          avatar: u.avatar || null,
        }));
        setPatients(data);
      }
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // Working Filters & Search Logic
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q);
    const matchCond   = conditionFilter === 'All' || p.condition === conditionFilter;
    const matchTher   = therapistFilter === 'All' || p.therapist === therapistFilter;
    const matchStat   = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCond && matchTher && matchStat;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Patients</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage patient records and recovery journeys with precision tools designed for clinical excellence.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button className="btn btn-secondary text-xs" onClick={() => alert('Importing patients…')}>
            <FileText size={14} /> Import Patients
          </button>
          <button className="btn btn-primary text-xs" onClick={() => navigate('/patients/add')}>
            <UserPlus size={15} /> Add Patient
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CARD */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, ID or condition..."
              className="input pl-9 text-xs py-2.5 w-full bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon size={14} /> Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid size={14} /> Cards
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-slate-100 pt-3 text-xs gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <select className="select text-xs py-1.5 bg-slate-50 flex-1 sm:w-36 min-w-[120px]" value={conditionFilter} onChange={e => setCondition(e.target.value)}>
              <option value="All">All Conditions</option>
              <option value="Post-Op Rehab">Post-Op Rehab</option>
              <option value="Neuropathy">Neuropathy</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Rehab">Rehab</option>
            </select>

            <select className="select text-xs py-1.5 bg-slate-50 flex-1 sm:w-40 min-w-[130px]" value={therapistFilter} onChange={e => setTherapist(e.target.value)}>
              <option value="All">Assigned Therapist</option>
              <option value="Dr. Ananya Sharma">Dr. Ananya Sharma</option>
              <option value="Dr. Rohan Kapoor">Dr. Rohan Kapoor</option>
              <option value="Dr. Dev Mukherjee">Dr. Dev Mukherjee</option>
            </select>

            <select className="select text-xs py-1.5 bg-slate-50 flex-1 sm:w-32 min-w-[110px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">Status: All</option>
              <option value="Active Treatment">Active Treatment</option>
              <option value="Observation">Observation</option>
              <option value="Recovered">Recovered</option>
            </select>

            <select className="select text-xs py-1.5 bg-slate-50 flex-1 sm:w-32 min-w-[110px]" value={ageFilter} onChange={e => setAgeFilter(e.target.value)}>
              <option value="All">Age: All Groups</option>
              <option value="18-35">18 - 35 Yrs</option>
              <option value="36-55">36 - 55 Yrs</option>
              <option value="56+">56+ Yrs</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="shrink-0">SORT BY:</span>
            <select className="select text-xs py-1.5 bg-slate-50 w-full sm:w-36 font-bold text-slate-800" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="Recently Updated">Recently Updated</option>
              <option value="Recovery Score">Recovery Score</option>
              <option value="Name A-Z">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="tbl w-full min-w-[800px]">
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>PATIENT ID</th>
                  <th>CONDITION</th>
                  <th>ASSIGNED THERAPIST</th>
                  <th>NEXT APPOINTMENT</th>
                  <th>RECOVERY SCORE</th>
                  <th>STATUS</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(p => (
                  <tr key={p._id} className="cursor-pointer" onClick={() => navigate(`/patients/${p._id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-200">
                          {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" /> : p.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.ageGender}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                        #{p.id}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-blue text-[10px] uppercase font-bold">{p.condition}</span>
                    </td>
                    <td className="text-xs text-slate-700 font-semibold">{p.therapist}</td>
                    <td className="text-xs text-slate-500">{p.nextAppointment}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 progress-track"><div className="progress-fill" style={{ width: `${p.recoveryScore}%` }} /></div>
                        <span className="font-bold text-xs text-slate-800">{p.recoveryScore}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={
                        p.status === 'Active Treatment' ? 'badge-blue text-[10px]' :
                        p.status === 'Recovered' ? 'badge-green text-[10px]' : 'badge-slate text-[10px]'
                      }>
                        ● {p.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-medium">
            <span>Showing 1 - {filteredPatients.length} of 248 patients</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"><ChevronLeft size={14} /></button>
              <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center hover:bg-slate-50">2</button>
              <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center hover:bg-slate-50">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center hover:bg-slate-50">25</button>
              <button className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(p => (
            <div key={p._id} className="card p-5 space-y-3 cursor-pointer card-hover" onClick={() => navigate(`/patients/${p._id}`)}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border-2 border-blue-200">
                  {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" /> : p.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.ageGender} • #{p.id}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between"><span className="text-slate-400">Condition:</span> <span className="font-bold text-slate-800">{p.condition}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Therapist:</span> <span className="font-semibold text-slate-700">{p.therapist}</span></div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span>RECOVERY</span><span>{p.recoveryScore}%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${p.recoveryScore}%` }} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM 3 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="card p-5 flex items-center gap-4 border-l-4 border-l-blue-600">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">New patients this month</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">+18.5%</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4 border-l-4 border-l-emerald-600">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Average Recovery Score</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">74.2%</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4 border-l-4 border-l-purple-600">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Record Updates today</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">142</p>
          </div>
        </div>
      </div>
    </div>
  );
}
