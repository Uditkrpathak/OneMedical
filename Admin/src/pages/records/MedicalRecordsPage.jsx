import { useState } from 'react';
import {
  FileText, Download, Upload, Search, Filter, ShieldCheck, Folder, Eye, Lock,
} from 'lucide-react';

export default function MedicalRecordsPage() {
  const [tab, setTab] = useState('Medical Documents');

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Medical Records & Document Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5">HIPAA-compliant secure storage for patient MRI scans, treatment reports, and clinical notes.</p>
        </div>
        <button className="btn btn-primary text-xs shrink-0 self-start sm:self-auto" onClick={() => alert('Uploading Document…')}>
          <Upload size={14} /> Upload Document
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Secure Document Store</h2>
        <p className="text-xs text-slate-500">All uploaded documents are end-to-end encrypted and audited.</p>
      </div>
    </div>
  );
}
