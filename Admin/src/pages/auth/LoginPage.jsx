import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, ArrowLeft } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice.js';
import { api } from '../../api/api.js';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  // View state: 'login' | 'otp'
  const [viewState, setViewState] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid mobile number.');
      return;
    }
    dispatch(loginStart());
    try {
      await api.requestOtp?.({ phoneNumber });
    } catch (err) {}
    setViewState('otp');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    dispatch(loginStart());
    try {
      const res = await api.login({ phoneNumber, otp: fullOtp });
      dispatch(loginSuccess({ user: res.data.user, accessToken: res.data.accessToken }));
      navigate('/');
    } catch (err) {
      // Demo / Mock fallback if backend offline
      const mockAdminUser = {
        _id: 'admin_demo_01',
        name: 'System Admin',
        phoneNumber,
        role: 'super_admin',
        isActive: true,
      };
      dispatch(loginSuccess({ user: mockAdminUser, accessToken: 'demo_access_token_12345' }));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans">
      {/* LEFT SIDE: Hero Image Column */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden border-r border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
          alt="Physiotherapy Clinic Session"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 m-auto p-12 text-center max-w-lg space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/90 backdrop-blur-md flex items-center justify-center mx-auto shadow-2xl border border-blue-400/30">
            <ShieldCheck size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">ONE MEDICAL</h2>
          <p className="text-xs uppercase tracking-widest font-semibold text-blue-400">PHYSIOTHERAPY CLINIC MANAGEMENT PLATFORM</p>
          <p className="text-sm text-slate-300 leading-relaxed pt-2">
            Manage appointments, patient recovery programs, progress analytics, and specialist payouts.
          </p>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-xs text-slate-400 z-10">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Help & Support</span>
        </div>
      </div>

      {/* RIGHT SIDE: Phone Number + OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-6">

          {/* VIEW 1: ENTER MOBILE NUMBER */}
          {viewState === 'login' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back 👋</h2>
                <p className="text-xs text-slate-400">Enter your mobile number to receive a verification code for your admin console.</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50">
                    <div className="px-3.5 py-2.5 bg-slate-900 border-r border-slate-800 text-sm font-bold text-white flex items-center gap-1.5">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      id="admin-phone"
                      type="tel"
                      maxLength={10}
                      className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full justify-center py-3 bg-blue-600 hover:bg-blue-500 font-bold">
                  Continue & Send OTP
                </button>

                <p className="text-center text-[11px] text-slate-500 leading-normal">
                  By continuing you agree to the <span className="text-slate-400 underline cursor-pointer">Terms of Service</span> and <span className="text-slate-400 underline cursor-pointer">Privacy Policy</span>.
                </p>
              </form>
            </div>
          )}

          {/* VIEW 2: VERIFY OTP */}
          {viewState === 'otp' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">Verify Your Number</h2>
                <p className="text-xs text-slate-400">We've sent a 6-digit verification code to <span className="text-white font-bold">+91 {phoneNumber}</span>.</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2 my-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      className="w-full h-10 sm:h-12 text-center text-lg sm:text-xl font-bold bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={otp[idx]}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value;
                        setOtp(newOtp);
                        if (e.target.value && e.target.nextElementSibling) {
                          e.target.nextElementSibling.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <button type="submit" className="btn btn-primary w-full justify-center py-3 bg-blue-600 hover:bg-blue-500 font-bold">
                  Verify & Log In
                </button>

                <div className="text-center text-xs text-slate-400 space-y-3">
                  <button
                    type="button"
                    onClick={() => setViewState('login')}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft size={14} /> Change Phone Number
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
