import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Building2, User, KeyRound, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ArthiqLogo } from '../components/ArthiqLogo';

interface RegisterProps {
  onRegisterSuccess: (user: any, token: string) => void;
  onNavigateToLogin: () => void;
  onBackToHome: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onBackToHome
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Company Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          companyName,
          gstin: gstin.toUpperCase(),
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed. Please check input parameters.');
        setLoading(false);
        return;
      }

      localStorage.setItem('arthiq_auth_token', data.token);
      localStorage.setItem('arthiq_user', JSON.stringify(data.user));
      onRegisterSuccess(data.user, data.token);
    } catch {
      setError('Connection to ARTHIQ gateway failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-center py-10 sm:px-6 lg:px-8 text-white font-sans selection:bg-[#6D45CF] selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#6D45CF]/20 via-[#3B82F6]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-5">
        <div className="inline-block cursor-pointer" onClick={onBackToHome}>
          <ArthiqLogo theme="dark" size="large" />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8] tracking-widest uppercase font-semibold">
          Tenant Onboarding & Isolation Provisioning
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4">
        <div className="bg-[#111622]/90 backdrop-blur-xl py-7 px-6 sm:px-10 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Register Organization</h2>
              <p className="text-xs text-[#94A3B8]">Deploy Isolated Tenant Database & RLS Boundaries</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditi Verma"
                    className="w-full pl-9 pr-3 py-2 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Company Legal Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Zenith Solutions Pvt Ltd"
                    className="w-full pl-9 pr-3 py-2 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Statutory GSTIN (Optional)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="27AABCA1234F1Z5"
                  className="w-full px-3 py-2 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs font-mono placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Password (min 8 chars)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Assigned RBAC Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0D14] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-[#6D45CF] transition-colors"
                >
                  <option value="Company Admin">Company Admin</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Read-Only Auditor">Read-Only Auditor</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6D45CF] hover:bg-[#5B37B5] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(109,69,207,0.35)] mt-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Tenant Key</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#94A3B8]">
            <span>Already registered? </span>
            <button
              onClick={onNavigateToLogin}
              className="text-[#A78BFA] hover:text-[#C4B5FD] font-semibold transition-colors"
            >
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
