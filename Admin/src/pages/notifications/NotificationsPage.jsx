import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Bell, Calendar, CreditCard, AlertTriangle, CheckCircle2,
  Users, FileText, X, Check, MoreVertical, Settings, Filter
} from 'lucide-react';
import { api } from '../../api/api.js';

const MOCK_NOTIFICATIONS = [
  { _id: 'n1', type: 'appointment', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Appointment Reminder Sent', body: 'Reminder dispatched to Sanya Malhotra for Oct 24, 2:30 PM session.', time: '2 mins ago', read: false },
  { _id: 'n2', type: 'payment',     icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Payment Received', body: '₹4,500 collected from Arjun Reddy via Credit Card — ACL Recovery Package.', time: '18 mins ago', read: false },
  { _id: 'n3', type: 'alert',       icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Patient Missed Session', body: 'Rahul Verma missed the Oct 22 home visit. Follow-up recommended.', time: '1 hour ago', read: false },
  { _id: 'n4', type: 'user',        icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', title: 'New Booking Request', body: 'Dr. Ankur Mehta received a new clinic visit request from Priya Singh.', time: '3 hours ago', read: true },
  { _id: 'n5', type: 'document',    icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100', title: 'Report Uploaded', body: 'MRI scan report uploaded to Kabir Singh\'s medical records by Dr. Priya Sharma.', time: 'Yesterday', read: true },
  { _id: 'n6', type: 'appointment', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Session Completed', body: 'Session summary saved for Marcus Thorne — Spine Rehab Week 4.', time: 'Yesterday', read: true },
  { _id: 'n7', type: 'payment',     icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Invoice Overdue', body: 'INV-2024-003 for Marcus Thorne is 3 days overdue. Consider sending a reminder.', time: '2 days ago', read: true },
];

const FILTER_TYPES = ['All', 'Appointments', 'Payments', 'Alerts', 'System'];

export default function NotificationsPage() {
  const token = useSelector(s => s.auth?.accessToken);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter]               = useState('All');
  const [loading, setLoading]             = useState(false);
  const [toast, setToast]                 = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listNotifications(token);
      if (res.data && res.data.length > 0) setNotifications(res.data);
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const markRead = (id) => {
    setNotifications(p => p.map(n => n._id === id ? { ...n, read: true } : n));
    api.markNotificationRead(token, id).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
    try { await api.markAllRead(token); } catch {}
    showToast('All notifications marked as read.');
  };

  const dismiss = (id) => setNotifications(p => p.filter(n => n._id !== id));

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Appointments') return n.type === 'appointment';
    if (filter === 'Payments') return n.type === 'payment';
    if (filter === 'Alerts') return n.type === 'alert';
    return n.type === 'document' || n.type === 'user';
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-up text-slate-800">

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
          <CheckCircle2 size={15} className="text-emerald-400" /> {toast}
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-[#003882] text-white text-[11px] font-extrabold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Stay updated on clinic activity, alerts, and system events.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-600 rounded-full hover:bg-slate-50 shadow-2xs transition-all"
          >
            <Check size={13} /> Mark All Read
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-600 rounded-full hover:bg-slate-50 shadow-2xs transition-all">
            <Settings size={13} /> Preferences
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: Notification List */}
        <div className="lg:col-span-8 space-y-4">

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 bg-slate-100/80 rounded-2xl w-fit">
            {FILTER_TYPES.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filter === f ? 'bg-white text-[#003882] shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Bell size={32} className="mb-3 opacity-30" />
                <div className="text-sm font-bold">No notifications</div>
                <div className="text-xs mt-1">You're all caught up!</div>
              </div>
            ) : (
              filtered.map(n => {
                const IconComp = n.icon || Bell;
                return (
                  <div
                    key={n._id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group ${
                      n.read ? 'bg-white border-slate-100' : 'bg-blue-50/30 border-blue-200/60'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <IconComp size={17} className={n.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-extrabold text-slate-900">{n.title}</div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {!n.read && (
                        <button
                          onClick={() => markRead(n._id)}
                          title="Mark as read"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-all"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => dismiss(n._id)}
                        title="Dismiss"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-all"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-[#003882] shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Preferences & Summary */}
        <div className="lg:col-span-4 space-y-5">

          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Unread', value: unreadCount, color: 'text-[#003882]' },
                { label: 'Total', value: notifications.length, color: 'text-slate-800' },
                { label: 'Alerts', value: notifications.filter(n => n.type === 'alert').length, color: 'text-amber-600' },
                { label: 'Payments', value: notifications.filter(n => n.type === 'payment').length, color: 'text-emerald-600' },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs">
                  <span className="text-slate-500">{s.label}</span>
                  <span className={`font-extrabold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: 'Appointment reminders', key: 'appt', on: true },
                { label: 'Payment receipts', key: 'pay', on: true },
                { label: 'Patient alerts', key: 'alert', on: true },
                { label: 'System updates', key: 'sys', on: false },
                { label: 'Weekly report digest', key: 'digest', on: false },
              ].map(p => (
                <div key={p.key} className="flex items-center justify-between">
                  <span className="text-xs text-slate-700">{p.label}</span>
                  <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-all ${p.on ? 'bg-[#003882]' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.on ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
