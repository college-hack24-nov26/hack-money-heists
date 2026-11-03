import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, AlertTriangle, KeyRound, CheckCircle2 } from 'lucide-react';
import { ArthiqLogo } from '../components/ArthiqLogo';

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onMfaRequired: (challengeId: string, email: string) => void;
  onBackToHome: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onMfaRequired,
  onBackToHome
}) => {
  const [email, setEmail] = useState('admin@apex.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.message || 'Too many attempts. Account locked temporarily.');
          if (data.retryAfterSeconds) setLockoutSeconds(data.retryAfterSeconds);
        } else {
          setError(data.message || 'Invalid email or password.');
        }
        setLoading(false);
        return;
      }

      if (data.status === 'mfa_required') {
        onMfaRequired(data.mfaChallengeId, email);
        return;
      }

      // Success
      if (rememberMe) {
        localStorage.setItem('arthiq_auth_token', data.token);
        localStorage.setItem('arthiq_user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('arthiq_auth_token', data.token);
        sessionStorage.setItem('arthiq_user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError('Network communication failed with ARTHIQ Gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white font-sans selection:bg-[#6D45CF] selection:text-white relative overflow-hidden">
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#6D45CF]/20 via-[#3B82F6]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-6">
        <div className="inline-block cursor-pointer" onClick={onBackToHome}>
          <ArthiqLogo theme="dark" size="large" />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8] tracking-widest uppercase font-semibold">
          See Beyond Numbers. Think Ahead.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#111622]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Enterprise Sign In</h2>
              <p className="text-xs text-[#94A3B8]">Multi-Tenant Financial Intelligence</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold">{error}</p>
                {lockoutSeconds && (
                  <p className="text-[11px] text-rose-400/80 mt-0.5">Rate limiter lockout active for {lockoutSeconds}s.</p>
                )}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Work Email Address
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
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] focus:ring-1 focus:ring-[#6D45CF] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#CBD5E1]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-[11px] text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0A0D14]/80 border border-white/[0.1] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:border-[#6D45CF] focus:ring-1 focus:ring-[#6D45CF] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/[0.1] bg-[#0A0D14] text-[#6D45CF] focus:ring-0"
                />
                <span>Remember session for 24h</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">TLS 1.3 / AES-256</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6D45CF] hover:bg-[#5B37B5] active:bg-[#4C289F] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(109,69,207,0.35)] mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Picker */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block mb-2">
              Select Demo Role Persona
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoUser('admin@apex.com', 'Admin@12345')}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-left transition-colors"
              >
                <div className="font-semibold text-white">Super Admin (MFA)</div>
                <div className="text-[10px] text-[#94A3B8]">admin@apex.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoUser('finance@apex.com', 'Finance@12345')}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-left transition-colors"
              >
                <div className="font-semibold text-white">Finance Manager</div>
                <div className="text-[10px] text-[#94A3B8]">finance@apex.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoUser('accountant@aarav.com', 'Accountant@12345')}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-left transition-colors"
              >
                <div className="font-semibold text-white">Accountant</div>
                <div className="text-[10px] text-[#94A3B8]">accountant@aarav.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoUser('auditor@compliance.com', 'Auditor@12345')}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-left transition-colors"
              >
                <div className="font-semibold text-white">Read-Only Auditor</div>
                <div className="text-[10px] text-[#94A3B8]">auditor@compliance.com</div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-[#94A3B8]">
            <span>Don't have an enterprise account? </span>
            <button
              onClick={onNavigateToRegister}
              className="text-[#A78BFA] hover:text-[#C4B5FD] font-semibold transition-colors"
            >
              Register Company
            </button>
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Tenant RLS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PBKDF2-SHA512</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ISO 27001 Aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
