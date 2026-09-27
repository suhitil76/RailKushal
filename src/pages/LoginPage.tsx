import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Cpu, Radio, Sparkles, Train } from 'lucide-react';
import { RailLogo } from '../components/common/RailLogo';
import { SEED_USERS } from '../data/seedData';
import { store } from '../services/store';
import { UserRole } from '../types/railway';
import { toast } from '../components/common/Toast';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const DEMO_CREDENTIALS: Record<string, { email: string; pass: string; role: UserRole; title: string; desc: string; color: string }> = {
  CONTROL_OFFICE: {
    email: 'control@railkushal.demo',
    pass: 'Control@123',
    role: 'CONTROL_OFFICE',
    title: 'Control Office Planner',
    desc: 'Division-wide review, merge & publish authority',
    color: '#0F766E'
  },
  ENGINEERING: {
    email: 'engineering@railkushal.demo',
    pass: 'Eng@123',
    role: 'ENGINEERING',
    title: 'Engineering Officer',
    desc: 'Permanent way, rails, welds & tamping',
    color: '#1769AA'
  },
  TRD: {
    email: 'trd@railkushal.demo',
    pass: 'TRD@123',
    role: 'TRD',
    title: 'TRD Officer',
    desc: 'OHE lines, power blocks & isolator permits',
    color: '#D97706'
  },
  S_AND_T: {
    email: 'signals@railkushal.demo',
    pass: 'Signal@123',
    role: 'S_AND_T',
    title: 'S&T Officer',
    desc: 'Signals, axle counters & interlocking',
    color: '#7C3AED'
  },
  SENIOR_REVIEWER: {
    email: 'reviewer@railkushal.demo',
    pass: 'Review@123',
    role: 'SENIOR_REVIEWER',
    title: 'Senior Reviewer (ADRM)',
    desc: 'Executive analytics, availability & exceptions',
    color: '#059669'
  },
  ADMIN: {
    email: 'admin@railkushal.demo',
    pass: 'Admin@123',
    role: 'ADMIN',
    title: 'System Administrator',
    desc: 'Data integration, AI weights & demo reset',
    color: '#64748B'
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('control@railkushal.demo');
  const [password, setPassword] = useState('Control@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const matchedKey = Object.keys(DEMO_CREDENTIALS).find(
        k => DEMO_CREDENTIALS[k].email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matchedKey) {
        setErrorMsg('Invalid email address. Please select one of the 6 demo accounts.');
        setIsLoading(false);
        return;
      }

      const cred = DEMO_CREDENTIALS[matchedKey];
      if (password !== cred.pass) {
        setErrorMsg('Incorrect password. For demo convenience, see password indicated on role cards.');
        setIsLoading(false);
        return;
      }

      const user = SEED_USERS.find(u => u.role === cred.role) || SEED_USERS[0];
      store.setCurrentUser(user);
      setIsLoading(false);
      toast.success('Access Granted', `Welcome, ${user.name} (${cred.title})`);
      onLoginSuccess();
    }, 450);
  };

  const handleQuickSelect = (roleKey: string) => {
    const cred = DEMO_CREDENTIALS[roleKey];
    setEmail(cred.email);
    setPassword(cred.pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none">
          <path d="M-100 200 C 300 150, 600 450, 1100 300 C 1300 220, 1500 400, 1600 350"
            stroke="#0F766E" strokeWidth="3" strokeDasharray="8 6" />
          <path d="M-100 450 C 400 500, 700 250, 1200 600 C 1400 700, 1600 500, 1700 550"
            stroke="#1769AA" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="600" cy="450" r="10" fill="#0F766E" />
          <circle cx="1100" cy="300" r="8" fill="#1769AA" />
          <circle cx="700" cy="250" r="9" fill="#D97706" />
        </svg>
      </div>

      {/* Persistent Top Safety Disclaimer */}
      <div className="relative z-10 w-full bg-amber-50 border-b border-amber-200 py-1.5 px-4 text-center text-xs text-amber-800">
        <span className="font-bold text-amber-700 uppercase tracking-wider">Prototype Mode</span>
        <span className="mx-2 text-amber-400">·</span>
        <span>Synthetic / Demo Operational Data · Decision-support only. Final operational and safety decisions remain with authorized railway officials.</span>
      </div>

      {/* Main Login Body */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto w-full">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#12355B] shadow-xl mb-4">
            <Train className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#12355B] tracking-tight">
            RAIL<span className="text-rail-teal">KUSHAL</span>
          </h1>
          <p className="text-sm font-semibold text-rail-cyan mt-1 tracking-wide">
            AI-Powered Integrated Block Planning for Pune Division
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-rail-muted">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 font-mono text-[11px] text-blue-700">
              SIH 2026 · Problem Statement ID: 26027
            </span>
            <span>·</span>
            <span>Central Railway</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Left: Login Form */}
          <div className="lg:col-span-5 bg-white border border-rail-border rounded-2xl p-7 shadow-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-rail-text">Operations Portal Sign-In</h2>
              <p className="text-xs text-rail-muted mt-1">Authenticate with division credentials or choose a quick persona below.</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rail-text mb-1.5">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-rail-bg border border-rail-border rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-rail-text focus:outline-none focus:border-rail-teal focus:ring-1 focus:ring-rail-teal/20"
                    placeholder="officer@railkushal.demo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rail-text mb-1.5">Authorization Key / Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-rail-bg border border-rail-border rounded-lg pl-10 pr-10 py-2.5 text-xs text-rail-text focus:outline-none focus:border-rail-teal focus:ring-1 focus:ring-rail-teal/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rail-muted hover:text-rail-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#12355B] hover:bg-[#0D2744] text-white font-bold text-xs tracking-wide transition-colors shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>Enter Command Centre</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-rail-border flex items-center justify-between text-[11px] text-rail-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-rail-emerald" />
                RBAC Security Enforced
              </span>
              <span className="font-mono">CRIS/Pune Auth</span>
            </div>
          </div>

          {/* Right: 6 Demo Persona Quick Select Cards */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#12355B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rail-teal" />
                Instant Demo Personas (One-Click Testing)
              </span>
              <span className="text-[11px] text-rail-muted">Click any persona card to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(DEMO_CREDENTIALS).map(([key, cred]) => {
                const isSelected = email === cred.email;
                return (
                  <div
                    key={key}
                    onClick={() => handleQuickSelect(key)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-rail-teal shadow-lg ring-1 ring-rail-teal/20'
                        : 'bg-white border-rail-border hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cred.color }} />
                        <span className="text-xs font-bold text-rail-text">{cred.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rail-deep text-rail-muted border border-rail-border">
                        {cred.role.slice(0, 4)}
                      </span>
                    </div>
                    <p className="text-[11px] text-rail-muted line-clamp-2 leading-relaxed">{cred.desc}</p>
                    <div className="mt-2.5 pt-2 border-t border-rail-border flex items-center justify-between text-[10px] text-rail-muted font-mono">
                      <span className="truncate mr-2">{cred.email}</span>
                      <span className="text-rail-cyan shrink-0 font-semibold">{cred.pass}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-3 border-t border-rail-border bg-white text-center text-xs text-rail-muted">
        RAILKUSHAL © 2026 · Smart India Hackathon Prototype · Ministry of Railways Problem Statement ID 26027
      </footer>
    </div>
  );
};
