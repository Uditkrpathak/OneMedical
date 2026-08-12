import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Download, Star, ChevronDown, MoreVertical, Plus, User,
  ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';

const THERAPISTS_LIST = [
  {
    _id: 'th-001',
    name: 'Dr. Arjun Mehta',
    degrees: 'BPT, MPT • 12 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120',
    specializations: [
      { name: 'Sports Rehab', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      { name: 'Orthopedic', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
    ],
    patientsCount: 42,
    availability: 'Available Today',
    availabilityColor: 'text-blue-600 bg-blue-600',
    rating: 4.9,
    status: 'ACTIVE',
    statusBadge: 'bg-emerald-100 text-emerald-800',
  },
  {
    _id: 'th-002',
    name: 'Dr. Priya Sharma',
    degrees: 'BPT • 8 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120',
    specializations: [
      { name: 'Neurological', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      { name: 'MSK', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
    ],
    patientsCount: 28,
    availability: 'Busy',
    availabilityColor: 'text-slate-400 bg-slate-400',
    rating: 4.8,
    status: 'ACTIVE',
    statusBadge: 'bg-emerald-100 text-emerald-800',
  },
  {
    _id: 'th-003',
    name: 'Dr. Ananya Iyer',
    degrees: 'BPT, MPT • 10 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww',
    specializations: [
      { name: 'Pelvic Health', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      { name: 'Pediatrics', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
    ],
    patientsCount: 35,
    availability: 'Available Today',
    availabilityColor: 'text-blue-600 bg-blue-600',
    rating: 4.9,
    status: 'ACTIVE',
    statusBadge: 'bg-emerald-100 text-emerald-800',
  },
  {
    _id: 'th-004',
    name: 'Dr. Rajesh Kumar',
    degrees: 'BPT, PhD • 22 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
    initials: 'RK',
    specializations: [
      { name: 'Geriatrics', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      { name: 'Manual Therapy', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
    ],
    patientsCount: 15,
    availability: 'On Leave',
    availabilityColor: 'text-red-500 bg-red-500',
    rating: 5.0,
    status: 'INACTIVE',
    statusBadge: 'bg-slate-200 text-slate-700',
  },
];

export default function TherapistsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredTherapists = THERAPISTS_LIST.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.degrees.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── 1. HEADER AREA ── */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Therapists</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage therapists, schedules and patient assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-secondary text-xs font-bold py-2.5 px-4 bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50" onClick={() => alert('Exporting therapist directory…')}>
            <Download size={14} /> Export List
          </button>

          <button className="btn btn-primary text-xs font-bold py-2.5 px-5 bg-blue-700 hover:bg-blue-600 shadow-sm rounded-full flex items-center gap-1.5" onClick={() => navigate('/therapists/add')}>
            <Plus size={15} /> Add Therapist
          </button>
        </div>
      </div>

      {/* ── 2. SEARCH & FILTER BAR ── */}
      <div className="flex flex-wrap justify-between items-center gap-3 card p-3 shadow-sm bg-white border border-slate-200/80 rounded-2xl">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-100 rounded-full px-3.5 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search therapists by name or specialization"
            className="bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder-slate-400 font-medium"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="relative">
            <select
              className="select text-xs py-2 px-4 rounded-full bg-slate-50 border border-slate-200 font-semibold text-slate-700 pr-8 appearance-none cursor-pointer"
              value={selectedSpec}
              onChange={e => setSelectedSpec(e.target.value)}
            >
              <option value="All">Specialization</option>
              <option value="Sports Rehab">Sports Rehab</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Neurological">Neurological</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="select text-xs py-2 px-4 rounded-full bg-slate-50 border border-slate-200 font-semibold text-slate-700 pr-8 appearance-none cursor-pointer"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="All">Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── 3. THERAPISTS TABLE ── */}
      <div className="card overflow-hidden shadow-sm border border-slate-200/80 rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="tbl w-full text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
              <th className="py-3.5 px-5 text-left">Therapist</th>
              <th className="py-3.5 px-4 text-left">Specialization</th>
              <th className="py-3.5 px-4 text-center">Patient Load & Capacity</th>
              <th className="py-3.5 px-4 text-left">Availability</th>
              <th className="py-3.5 px-4 text-center">Rating</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTherapists.map((t) => (
              <tr
                key={t._id}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => navigate(`/therapists/${t._id}`)}
              >
                {/* Therapist Info */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {t.initials}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{t.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{t.degrees}</p>
                    </div>
                  </div>
                </td>

                {/* Specialization Tags */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1.5">
                    {t.specializations.map((spec, idx) => (
                      <span key={idx} className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${spec.color}`}>
                        {spec.name}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Patient Load & Capacity Indicator (NEW ENHANCEMENT) */}
                <td className="py-4 px-4">
                  <div className="space-y-1 w-32 mx-auto text-center">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-900">{t.patientsCount} Patients</span>
                      <span className={t.patientsCount > 40 ? 'text-amber-600' : 'text-blue-600'}>
                        {Math.round((t.patientsCount / 50) * 100)}%
                      </span>
                    </div>
                    <div className="progress-track h-1.5 bg-slate-100">
                      <div
                        className={`progress-fill ${t.patientsCount > 40 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.round((t.patientsCount / 50) * 100)}%` }}
                      />
                    </div>
                    {t.patientsCount > 40 && (
                      <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold block w-fit mx-auto mt-0.5">
                        ⚠️ High Load
                      </span>
                    )}
                  </div>
                </td>

                {/* Availability */}
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 font-bold text-xs text-slate-700">
                    <span className={`w-2 h-2 rounded-full ${t.availabilityColor}`} />
                    {t.availability}
                  </span>
                </td>

                {/* Rating */}
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    {t.rating.toFixed(1)}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-4 text-center">
                  <span className={`badge text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase ${t.statusBadge}`}>
                    {t.status}
                  </span>
                </td>

                {/* Action */}
                <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* ── 4. FOOTER PAGINATION ── */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 font-medium">
          <span>Showing 1–10 of 48 therapists</span>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
              ‹
            </button>
            <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
              5
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
              ›
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
