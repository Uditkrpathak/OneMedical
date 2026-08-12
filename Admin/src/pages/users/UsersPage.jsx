import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Plus, Search, Shield, User, Edit2, Trash2, CheckCircle2,
  MoreVertical, X, ChevronDown, Clock, Activity
} from 'lucide-react';
import { api } from '../../api/api.js';
import { UserAvatar } from '../../components/ui.jsx';
import { ConfirmModal, StatusBadge, Pagination } from '../../components/ui.jsx';

const ROLES = ['Admin', 'Clinic Admin', 'Receptionist', 'Therapist', 'Billing'];

const ROLE_COLORS = {
  'Admin':        'bg-purple-50 text-purple-700 border-purple-200',
  'Clinic Admin': 'bg-blue-50 text-blue-700 border-blue-200',
  'Receptionist': 'bg-teal-50 text-teal-700 border-teal-200',
  'Therapist':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Billing':      'bg-amber-50 text-amber-700 border-amber-200',
};

const PERMISSIONS = {
  'Admin':        { Appointments: true, Patients: true, Therapists: true, Programs: true, Billing: true, Analytics: true, Users: true },
  'Clinic Admin': { Appointments: true, Patients: true, Therapists: true, Programs: true, Billing: true, Analytics: true, Users: false },
  'Receptionist': { Appointments: true, Patients: true, Therapists: false, Programs: false, Billing: false, Analytics: false, Users: false },
  'Therapist':    { Appointments: true, Patients: true, Therapists: false, Programs: true, Billing: false, Analytics: false, Users: false },
  'Billing':      { Appointments: false, Patients: false, Therapists: false, Programs: false, Billing: true, Analytics: true, Users: false },
};

const MOCK_STAFF = [
  { _id: 's1', name: 'Dr. Sarah Chen', email: 'sarah@onemedical.in', phone: '+91 98765 43210', role: 'Admin', status: 'ACTIVE', lastActive: '2 mins ago', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100' },
  { _id: 's2', name: 'Ankur Mehta', email: 'ankur@onemedical.in', phone: '+91 98765 43211', role: 'Receptionist', status: 'ACTIVE', lastActive: '15 mins ago', avatar: null },
  { _id: 's3', name: 'Meera Joshi', email: 'meera@onemedical.in', phone: '+91 98765 43212', role: 'Billing', status: 'ACTIVE', lastActive: '1 hour ago', avatar: null },
  { _id: 's4', name: 'Rohan Kapoor', email: 'rohan@onemedical.in', phone: '+91 98765 43213', role: 'Clinic Admin', status: 'INACTIVE', lastActive: '3 days ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
];

const AUDIT_LOG = [
  { user: 'Dr. Sarah Chen', action: 'Created invoice INV-2024-002 for Arjun Reddy', time: '5 mins ago', type: 'billing' },
  { user: 'Ankur Mehta', action: 'Confirmed appointment APT-1024 for Sanya Malhotra', time: '22 mins ago', type: 'appointment' },
  { user: 'Dr. Sarah Chen', action: 'Added new patient: Priya Singh', time: '1 hour ago', type: 'patient' },
  { user: 'Meera Joshi', action: 'Generated payout report for October 2023', time: '2 hours ago', type: 'billing' },
  { user: 'Rohan Kapoor', action: 'Updated program: Lower Back Stability v2.1', time: 'Yesterday', type: 'program' },
];

export default function UsersPage() {
  const token = useSelector(s => s.auth?.accessToken);
  const [staff, setStaff]             = useState(MOCK_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter]   = useState('All');
  const [activeTab, setActiveTab]     = useState('Staff');
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast]             = useState(null);
  const [viewRole, setViewRole]       = useState('Admin');

  // Add Staff form state
  const [newName, setNewName]   = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole]   = useState('Receptionist');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    try {
      const res = await api.listStaff(token);
      if (res.data && res.data.length > 0) setStaff(res.data);
    } catch {}
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleAddStaff = async () => {
    if (!newName || !newEmail) return;
    const newMember = {
      _id: `s${Date.now()}`,
      name: newName, email: newEmail, phone: newPhone,
      role: newRole, status: 'ACTIVE', lastActive: 'Just now', avatar: null,
    };
    try { await api.createStaffUser(token, newMember); } catch {}
    setStaff(p => [newMember, ...p]);
    setShowAddModal(false);
    setNewName(''); setNewEmail(''); setNewPhone(''); setNewRole('Receptionist');
    showToast(`${newName} added as ${newRole} successfully!`);
  };

  const handleDelete = async () => {
    const id = confirmDelete._id;
    try { await api.deleteStaffUser(token, id); } catch {}
    setStaff(p => p.filter(s => s._id !== id));
    setConfirmDelete(null);
    showToast('Staff member removed.');
  };

  const filteredStaff = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'All' || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  const modules = Object.keys(PERMISSIONS['Admin']);

  return (
    <div className="space-y-6 animate-fade-up text-slate-800">

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
          <CheckCircle2 size={15} className="text-emerald-400" /> {toast}
        </div>
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${confirmDelete?.name}? This will revoke all their access immediately.`}
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Dr. Anjali Verma" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="anjali@onemedical.in" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone</label>
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role</label>
                <div className="relative">
                  <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 appearance-none focus:outline-none">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleAddStaff} disabled={!newName || !newEmail} className="px-5 py-2 text-xs font-bold bg-[#003882] text-white rounded-xl hover:bg-[#002b66] disabled:opacity-40">
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Users & Staff</h1>
          <p className="text-xs text-slate-500 mt-1">Manage clinic staff, roles, permissions, and audit activity.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-full shadow-sm transition-all"
        >
          <Plus size={14} /> Add Staff Member
        </button>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Staff', value: staff.length, color: 'text-blue-600' },
          { label: 'Active', value: staff.filter(s => s.status === 'ACTIVE').length, color: 'text-emerald-600' },
          { label: 'Inactive', value: staff.filter(s => s.status === 'INACTIVE').length, color: 'text-slate-400' },
          { label: 'Roles Used', value: new Set(staff.map(s => s.role)).size, color: 'text-purple-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
            <div className={`text-3xl font-extrabold mt-1 ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* ─── TABS ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {['Staff', 'Permissions', 'Audit Log'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-[#003882] text-[#003882]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-5">

          {/* ── STAFF TAB ── */}
          {activeTab === 'Staff' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-0 max-w-xs">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search staff..." className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                {['All', ...ROLES].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-3 py-2 text-[11px] font-bold rounded-xl border transition-all ${roleFilter === r ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                    {r}
                  </button>
                ))}
              </div>

              {/* Staff Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Name', 'Role', 'Contact', 'Status', 'Last Active', ''].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStaff.map(s => (
                      <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar src={s.avatar} name={s.name} className="w-8 h-8" />
                            <div>
                              <div className="font-extrabold text-slate-900">{s.name}</div>
                              <div className="text-[10px] text-slate-400">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ROLE_COLORS[s.role] || ''}`}>{s.role}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500">{s.phone}</td>
                        <td className="py-3.5 px-3"><StatusBadge status={s.status} /></td>
                        <td className="py-3.5 px-3 text-slate-400 flex items-center gap-1"><Clock size={11} /> {s.lastActive}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Edit2 size={13} /></button>
                            <button onClick={() => setConfirmDelete(s)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PERMISSIONS TAB ── */}
          {activeTab === 'Permissions' && (
            <div className="space-y-4">
              {/* Role selector */}
              <div className="flex gap-2 flex-wrap">
                {ROLES.map(r => (
                  <button key={r} onClick={() => setViewRole(r)}
                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${viewRole === r ? 'bg-[#003882] text-white border-[#003882]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Permissions for: <span className="text-slate-700">{viewRole}</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {modules.map(mod => {
                    const hasAccess = PERMISSIONS[viewRole]?.[mod] ?? false;
                    return (
                      <div key={mod} className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold ${hasAccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${hasAccess ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {mod}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── AUDIT LOG TAB ── */}
          {activeTab === 'Audit Log' && (
            <div className="space-y-2">
              {AUDIT_LOG.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity size={13} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900">{log.user}</span>
                    <span className="text-xs text-slate-500"> {log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
