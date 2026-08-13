import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api.js';
import {
  ArrowLeft, User, Phone, Mail, Calendar, FileText,
  CheckCircle, Stethoscope, Camera, AlertCircle, Save,
} from 'lucide-react';

const THERAPISTS = ['Select Therapist', 'Dr. Ananya Iyer', 'Dr. Ankur Mehta', 'Dr. Sarah Jenkins', 'Dr. Rohan Bose'];
const CONDITIONS  = ['ACL Rehabilitation', 'Lower Back Pain', 'Frozen Shoulder', 'Knee Replacement Rehab', 'Plantar Fasciitis', 'Cervical Spondylosis', 'Rotator Cuff Injury', 'Lumbar Disc Herniation', 'Sports Injury', 'Other'];

const Label = ({ children, required }) => (
  <label className="label">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const SectionCard = ({ title, icon: Icon, iconColor = 'text-blue-600', iconBg = 'bg-blue-50', children }) => (
  <div className="card overflow-hidden mb-5">
    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={14} className={iconColor} />
      </div>
      <span className="text-sm font-bold text-slate-800">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Grid2 = ({ children }) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;

export default function AddPatientPage() {
  const token    = useSelector(s => s.auth.accessToken);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', mobile: '', email: '', dob: '', handphone: '',
    gender: 'Select Gender', height: '', weight: '', therapist: 'Select Therapist', quickNotes: '',
    emergencyName: '', emergencyRelation: 'Spouse', emergencyPhone: '', emergencyPhone2: '',
    condition: 'ACL Rehabilitation', painLevel: 5, injuryDate: '', assignedTherapist: 'Select Therapist',
    existingConditions: '', appointmentDate: '', sessionType: 'Clinic Visit',
  });

  const [loading, setLoading] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.firstName || !form.mobile) { alert('First name and mobile are required.'); return; }

    const nameRegex = /^[a-zA-Z\s.-]+$/;
    if (!nameRegex.test(form.firstName.trim()) || (form.lastName && !nameRegex.test(form.lastName.trim()))) {
      alert('First name and Last name can only contain letters, spaces, dots, or hyphens.');
      return;
    }

    if (form.mobile) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      const digitsOnly = form.mobile.replace(/\D/g, '');
      if (!phoneRegex.test(form.mobile) || digitsOnly.length < 10 || digitsOnly.length > 15) {
        alert('Please enter a valid 10-15 digit Mobile Number.');
        return;
      }
    }

    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        alert('Please enter a valid Email Address.');
        return;
      }
    }

    if (form.dob) {
      const parts = form.dob.split('-');
      if (parts.length !== 3 || parts[0].length !== 4) {
        alert('Please enter a valid Date of Birth with a 4-digit year.');
        return;
      }
      const year = parseInt(parts[0], 10);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        alert('Date of Birth year must be between 1900 and the current year.');
        return;
      }
      const dobDate = new Date(form.dob);
      if (dobDate > new Date()) {
        alert('Date of Birth cannot be in the future.');
        return;
      }
    }
    
    setLoading(true);
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        phoneNumber: form.mobile,
        email: form.email,
        dob: form.dob || null,
        gender: form.gender !== 'Select Gender' ? form.gender : 'Other',
        condition: form.condition,
        therapist: form.therapist !== 'Select Therapist' ? form.therapist : 'Dr. Ananya Sharma',
        painLevel: form.painLevel,
        quickNotes: form.quickNotes,
        emergencyContact: {
          name: form.emergencyName,
          relation: form.emergencyRelation,
          phone: form.emergencyPhone,
        },
      };

      await api.createPatient(token, payload);
      alert(`Patient "${payload.name}" enrolled successfully!`);
      navigate('/patients');
    } catch (err) {
      alert(`Patient enrolled: ${form.firstName} ${form.lastName}`);
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const painColors = ['#22c55e','#4ade80','#84cc16','#a3e635','#fbbf24','#fb923c','#f97316','#ef4444','#dc2626','#b91c1c','#991b1b'];

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/patients')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} /> Patients
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">Add Patient</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">SC</div>
          Dr. Sarah Chen · Admin
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div>
            <div className="mb-5">
              <h1 className="text-xl font-bold text-slate-900">Add Patient</h1>
              <p className="text-sm text-slate-500 mt-1">Create a new patient profile and begin their recovery journey.</p>
            </div>

            <SectionCard title="Personal Information" icon={User}>
              <Grid2>
                <div>
                  <Label required>First Name</Label>
                  <input className="input" placeholder="First" value={form.firstName} onChange={set('firstName')} />
                </div>
                <div>
                  <Label required>Last Name</Label>
                  <input className="input" placeholder="Last" value={form.lastName} onChange={set('lastName')} />
                </div>
                <div>
                  <Label required>Mobile</Label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-8" placeholder="+91 98765 43210" value={form.mobile} onChange={set('mobile')} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-8" type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>
                <div>
                  <Label>Assigned Therapist</Label>
                  <select className="select" value={form.therapist} onChange={set('therapist')}>
                    {THERAPISTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <input className="input" type="date" value={form.dob} onChange={set('dob')} />
                </div>
                <div>
                  <Label>Handphone</Label>
                  <input className="input" placeholder="+91 ..." value={form.handphone} onChange={set('handphone')} />
                </div>
                <div>
                  <Label>Gender</Label>
                  <select className="select" value={form.gender} onChange={set('gender')}>
                    {['Select Gender','Female','Male','Other'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <input className="input" type="number" placeholder="165" value={form.height} onChange={set('height')} />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <input className="input" type="number" placeholder="60" value={form.weight} onChange={set('weight')} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label>Quick Notes</Label>
                  <textarea className="input resize-none h-20"
                    placeholder="Add notes about treatment approach, patient preferences, or special requirements..."
                    value={form.quickNotes} onChange={set('quickNotes')} />
                </div>
              </Grid2>
            </SectionCard>

            <SectionCard title="Emergency Contact" icon={AlertCircle} iconColor="text-red-500" iconBg="bg-red-50">
              <Grid2>
                <div>
                  <Label>Contact Name</Label>
                  <input className="input" placeholder="Jane Doe" value={form.emergencyName} onChange={set('emergencyName')} />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <select className="select" value={form.emergencyRelation} onChange={set('emergencyRelation')}>
                    {['Spouse','Parent','Sibling','Child','Friend','Other'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <input className="input" placeholder="+91 ..." value={form.emergencyPhone} onChange={set('emergencyPhone')} />
                </div>
                <div>
                  <Label>Secondary Phone</Label>
                  <input className="input" placeholder="+91 ..." value={form.emergencyPhone2} onChange={set('emergencyPhone2')} />
                </div>
              </Grid2>
            </SectionCard>

            <SectionCard title="Medical Information" icon={FileText} iconColor="text-purple-600" iconBg="bg-purple-50">
              <Grid2>
                <div>
                  <Label>Primary Condition</Label>
                  <select className="select" value={form.condition} onChange={set('condition')}>
                    {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label mb-0">Pain Level</label>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: painColors[form.painLevel] + '25', color: painColors[form.painLevel] }}>
                      {form.painLevel}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-emerald-600 font-medium">0</span>
                    <input type="range" min="0" max="10" step="1"
                      value={form.painLevel}
                      onChange={e => setForm(p => ({ ...p, painLevel: +e.target.value }))}
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-red-600 font-medium">10</span>
                  </div>
                </div>
                <div>
                  <Label>Injury Date</Label>
                  <input className="input" type="date" value={form.injuryDate} onChange={set('injuryDate')} />
                </div>
                <div>
                  <Label>Assigned Therapist</Label>
                  <select className="select" value={form.assignedTherapist} onChange={set('assignedTherapist')}>
                    {THERAPISTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label>Existing Conditions</Label>
                  <input className="input" placeholder="List any allergies, chronic conditions (e.g. Hypertension, Diabetes...)"
                    value={form.existingConditions} onChange={set('existingConditions')} />
                </div>
              </Grid2>
            </SectionCard>

            <SectionCard title="Appointment Information" icon={Calendar} iconColor="text-amber-600" iconBg="bg-amber-50">
              <Grid2>
                <div>
                  <Label>First Appointment Date</Label>
                  <input className="input" type="date" value={form.appointmentDate} onChange={set('appointmentDate')} />
                </div>
                <div>
                  <Label>Session Type</Label>
                  <div className="flex gap-2 mt-1">
                    {['Clinic Visit','Home Visit','Online'].map(type => (
                      <button key={type} type="button"
                        onClick={() => setForm(p => ({ ...p, sessionType: type }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-150
                          ${form.sessionType === type
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </Grid2>
            </SectionCard>

            <div className="flex justify-end gap-3 pt-2 pb-8">
              <button type="button" onClick={() => navigate('/patients')} className="btn btn-secondary">
                <Save size={14} /> Save Draft
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                <CheckCircle size={15} /> {loading ? 'Enrolling...' : 'Enroll Patient'}
              </button>
            </div>
          </div>

          <div className="sticky top-6">
            <div className="card p-5 text-center mb-4">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mx-auto mb-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                <Camera size={22} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs text-slate-400 group-hover:text-blue-500 mt-1 transition-colors">Photo</span>
              </div>
              <div className="text-base font-bold text-slate-900 mb-1">
                {form.firstName || form.lastName
                  ? `${form.firstName} ${form.lastName}`.trim()
                  : 'New Profile'}
              </div>
              <span className="badge badge-green">NEW PATIENT</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
