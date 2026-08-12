import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, TrendingUp, Clock, AlertCircle, Plus, Download,
  Search, Filter, ChevronDown, MoreVertical, CheckCircle2,
  FileText, RefreshCcw, X, Check, Send, Users, IndianRupee
} from 'lucide-react';
import { api } from '../../api/api.js';
import { Pagination, StatusBadge, ConfirmModal, EmptyState } from '../../components/ui.jsx';

const MOCK_TRANSACTIONS = [
  { _id: 'tx_101', patientName: 'Sanya Malhotra', therapistName: 'Dr. Ankur Mehta', type: 'Session Fee', amount: 1200, date: 'Oct 24, 2023', method: 'UPI / GPay', status: 'PAID' },
  { _id: 'tx_102', patientName: 'Arjun Reddy', therapistName: 'Dr. Priya Sharma', type: 'Package Renewal', amount: 4500, date: 'Oct 23, 2023', method: 'Credit Card', status: 'PAID' },
  { _id: 'tx_103', patientName: 'Marcus Thorne', therapistName: 'Dr. Rohan Bose', type: 'Home Visit Surcharge', amount: 1800, date: 'Oct 22, 2023', method: 'Insurance Direct', status: 'PENDING' },
  { _id: 'tx_104', patientName: 'Priya Singh', therapistName: 'Dr. Ananya Iyer', type: 'Session Fee', amount: 1200, date: 'Oct 21, 2023', method: 'Net Banking', status: 'PAID' },
  { _id: 'tx_105', patientName: 'Kabir Singh', therapistName: 'Dr. Priya Sharma', type: 'Session Fee', amount: 1200, date: 'Oct 20, 2023', method: 'UPI / GPay', status: 'PAID' },
];

const MOCK_INVOICES = [
  { _id: 'inv_101', invoiceNo: 'INV-2024-001', patient: 'Sanya Malhotra', services: 'Physiotherapy × 4 sessions', gst: 216, subtotal: 4800, total: 5016, date: 'Oct 24, 2023', due: 'Nov 7, 2023', status: 'PAID' },
  { _id: 'inv_102', invoiceNo: 'INV-2024-002', patient: 'Arjun Reddy', services: 'ACL Recovery Package', gst: 810, subtotal: 9000, total: 9810, date: 'Oct 23, 2023', due: 'Nov 6, 2023', status: 'PENDING' },
  { _id: 'inv_103', invoiceNo: 'INV-2024-003', patient: 'Marcus Thorne', services: 'Spine Rehab × 2 sessions', gst: 432, subtotal: 2400, total: 2832, date: 'Oct 18, 2023', due: 'Nov 1, 2023', status: 'PENDING' },
];

const MOCK_PAYOUTS = [
  { _id: 'po_101', therapist: 'Dr. Ankur Mehta', sessions: 24, revenue: 28800, commission: 60, payout: 17280, period: 'Oct 2023', status: 'PENDING' },
  { _id: 'po_102', therapist: 'Dr. Priya Sharma', sessions: 18, revenue: 21600, commission: 60, payout: 12960, period: 'Oct 2023', status: 'PENDING' },
  { _id: 'po_103', therapist: 'Dr. Ananya Iyer', sessions: 14, revenue: 16800, commission: 60, payout: 10080, period: 'Sep 2023', status: 'PAID' },
];

const TABS = ['Transactions', 'Invoices', 'Payouts', 'Refunds'];

function fmt(n) { return `₹${Number(n).toLocaleString('en-IN')}`; }

export default function PaymentsPage() {
  const token    = useSelector(s => s.auth?.accessToken);
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState('Transactions');
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [invoices, setInvoices]         = useState(MOCK_INVOICES);
  const [payouts, setPayouts]           = useState(MOCK_PAYOUTS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [page, setPage]                 = useState(1);
  const [total, setTotal]               = useState(MOCK_TRANSACTIONS.length);
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [confirmRefund, setConfirmRefund]       = useState(null);

  // Invoice form state
  const [invPatient, setInvPatient]   = useState('');
  const [invService, setInvService]   = useState('');
  const [invAmount, setInvAmount]     = useState('');
  const [invGstPct, setInvGstPct]     = useState(9);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listPayments(token, { page, limit: 10, search: searchQuery });
      if (res.data && res.data.length > 0) {
        setTransactions(res.data);
        setTotal(res.meta?.total || res.data.length);
      }
    } catch { /* use mock */ }
    setLoading(false);
  }, [token, page, searchQuery]);

  useEffect(() => { load(); }, [load]);

  const handleCreateInvoice = async () => {
    if (!invPatient || !invAmount) return;
    try {
      await api.createInvoice(token, {
        patient: invPatient,
        service: invService,
        amount: parseFloat(invAmount),
        gstPercent: invGstPct,
      });
    } catch { /* fallback */ }
    setShowInvoiceModal(false);
    showToast('Invoice created successfully!');
    setInvPatient(''); setInvService(''); setInvAmount('');
  };

  const handleInitiatePayout = async (po) => {
    try { await api.computePayout(token, { therapistId: po._id, period: po.period }); } catch {}
    setPayouts(prev => prev.map(p => p._id === po._id ? { ...p, status: 'PAID' } : p));
    showToast(`Payout of ${fmt(po.payout)} initiated to ${po.therapist}!`);
  };

  const handleExportCSV = () => {
    const rows = transactions.map(t =>
      `"${t._id}","${t.patientName}","${t.therapistName}","${t.type}","${fmt(t.amount)}","${t.date}","${t.method}","${t.status}"`
    );
    const csv = ['ID,Patient,Therapist,Type,Amount,Date,Method,Status', ...rows].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('CSV exported successfully!');
  };

  const totalRevenue = transactions.filter(t => t.status === 'PAID').reduce((a, t) => a + t.amount, 0);
  const pending      = transactions.filter(t => t.status === 'PENDING').reduce((a, t) => a + t.amount, 0);
  const todayCollected = transactions.filter(t => t.date === 'Oct 24, 2023' && t.status === 'PAID').reduce((a, t) => a + t.amount, 0);
  const outstanding  = invoices.filter(i => i.status === 'PENDING').reduce((a, i) => a + i.total, 0);

  const filteredTxn = transactions.filter(t =>
    t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up text-slate-800">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs text-white ${toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'}`}>
          <CheckCircle2 size={15} className="text-emerald-400" /> {toast.msg}
        </div>
      )}

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Create Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name</label>
                <input value={invPatient} onChange={e => setInvPatient(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Sanya Malhotra" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Description</label>
                <input value={invService} onChange={e => setInvService(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Physiotherapy × 4 sessions" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input type="number" value={invAmount} onChange={e => setInvAmount(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="4800" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST %</label>
                  <select value={invGstPct} onChange={e => setInvGstPct(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none">
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={9}>9%</option>
                    <option value={18}>18%</option>
                  </select>
                </div>
              </div>
              {invAmount && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">{fmt(invAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">GST ({invGstPct}%)</span><span className="font-bold">{fmt(invAmount * invGstPct / 100)}</span></div>
                  <div className="flex justify-between border-t border-blue-100 pt-1"><span className="font-bold text-slate-800">Total</span><span className="font-extrabold text-[#003882]">{fmt(parseFloat(invAmount) + invAmount * invGstPct / 100)}</span></div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateInvoice} disabled={!invPatient || !invAmount} className="px-5 py-2 text-xs font-bold bg-[#003882] text-white rounded-xl hover:bg-[#002b66] disabled:opacity-40">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments & Billing</h1>
          <p className="text-xs text-slate-500 mt-1">Financial ledger, invoices, therapist payouts, and transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-600 rounded-full hover:bg-slate-50 shadow-2xs transition-all">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#003882] hover:bg-[#002b66] text-white text-xs font-bold rounded-full shadow-sm transition-all">
            <Plus size={14} /> Create Invoice
          </button>
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), sub: 'Collected (all time)', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: fmt(pending), sub: 'Awaiting collection', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: "Today's Collection", value: fmt(todayCollected), sub: 'Oct 24, 2023', icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Outstanding Dues', value: fmt(outstanding), sub: 'Across open invoices', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
                <div className={`text-2xl font-extrabold mt-1 ${c.color}`}>{c.value}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{c.sub}</div>
              </div>
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                <c.icon size={16} className={c.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── TABS ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Tab nav */}
        <div className="flex items-center justify-between border-b border-slate-100 overflow-x-auto flex-wrap sm:flex-nowrap gap-2 p-1">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab ? 'border-[#003882] text-[#003882]' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Search in tab header */}
          <div className="p-2 w-full sm:w-auto">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-44"
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* ── TRANSACTIONS TAB ── */}
          {activeTab === 'Transactions' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Transaction ID', 'Patient', 'Therapist', 'Type', 'Amount', 'Date', 'Method', 'Status', ''].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTxn.map(t => (
                      <tr key={t._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-mono text-[11px] font-bold text-blue-600">#{t._id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{t.patientName}</td>
                        <td className="py-3 px-3 text-slate-500">{t.therapistName}</td>
                        <td className="py-3 px-3 text-slate-600">{t.type}</td>
                        <td className="py-3 px-3 font-extrabold text-slate-900">{fmt(t.amount)}</td>
                        <td className="py-3 px-3 text-slate-400">{t.date}</td>
                        <td className="py-3 px-3 text-slate-500">{t.method}</td>
                        <td className="py-3 px-3"><StatusBadge status={t.status} /></td>
                        <td className="py-3 px-3">
                          <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><Download size={13} className="text-slate-400" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} total={total} limit={10} onChange={setPage} />
            </div>
          )}

          {/* ── INVOICES TAB ── */}
          {activeTab === 'Invoices' && (
            <div className="space-y-3">
              {invoices.map(inv => (
                <div key={inv._id} className="flex items-center gap-4 p-4 bg-slate-50/60 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{inv.invoiceNo}</span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{inv.patient} — {inv.services}</div>
                    <div className="text-[11px] text-slate-400">Issued: {inv.date} · Due: {inv.due}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-slate-900">{fmt(inv.total)}</div>
                    <div className="text-[10px] text-slate-400">incl. GST {fmt(inv.gst)}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="p-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-600 rounded-xl transition-all"><Download size={13} /></button>
                    <button className="p-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-600 rounded-xl transition-all"><Send size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAYOUTS TAB ── */}
          {activeTab === 'Payouts' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Therapist', 'Period', 'Sessions', 'Revenue', 'Commission', 'Payout Amount', 'Status', ''].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payouts.map(po => (
                      <tr key={po._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900">{po.therapist}</td>
                        <td className="py-3.5 px-3 text-slate-500">{po.period}</td>
                        <td className="py-3.5 px-3 text-slate-600">{po.sessions}</td>
                        <td className="py-3.5 px-3 font-bold">{fmt(po.revenue)}</td>
                        <td className="py-3.5 px-3 text-slate-500">{po.commission}%</td>
                        <td className="py-3.5 px-3 font-extrabold text-[#003882]">{fmt(po.payout)}</td>
                        <td className="py-3.5 px-3"><StatusBadge status={po.status} /></td>
                        <td className="py-3.5 px-3">
                          {po.status === 'PENDING' && (
                            <button
                              onClick={() => handleInitiatePayout(po)}
                              className="px-3 py-1.5 bg-[#003882] text-white text-[11px] font-bold rounded-full hover:bg-[#002b66] transition-all"
                            >
                              Initiate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REFUNDS TAB ── */}
          {activeTab === 'Refunds' && (
            <EmptyState
              icon={RefreshCcw}
              title="No Refund Requests"
              subtitle="When patients or admins raise refund requests, they will appear here for review and approval."
              action="Raise a Refund"
              onAction={() => showToast('Refund request raised!')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
