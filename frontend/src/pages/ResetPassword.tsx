import React, { useState } from 'react';
import { Lock, Eye, EyeOff, KeyRound, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ArthiqLogo } from '../components/ArthiqLogo';

interface ResetPasswordProps {
  initialToken?: string;
  onResetSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToHome: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  initialToken = '',
  onResetSuccess,
  onNavigateToLogin,
  onBackToHome
}) => {
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to reset password. Token may be invalid or expired.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Communication error with ARTHIQ Gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white font-sans selection:bg-[#6D45CF] selection:text-white relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#6D45CF]/20 via-[#3B82F6]/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-6">
        <div className="inline-block cursor-pointer" onClick={onBackToHome}>
          <ArthiqLogo theme="dark" size="large" />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8] tracking-widest uppercase font-semibold">
          Autonomous Financial Intelligence
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#111622]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="mb-6 pb-4 border-b border-white/[0.08]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#6D45CF]" />
              Set New Password
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Provide your single-use reset token and configure a secure replacement passphrase.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Credentials Updated Successfully
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Your enterprise password has been updated and hashed with PBKDF2-SHA512. All prior session tokens have been invalidated.
                </p>
              </div>

              <button
                type="button"
                onClick={onResetSuccess}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6D45CF] to-[#5B37B5] hover:opacity-95 text-white shadow-[0_4px_16px_rgba(109,69,207,0.35)] transition-all cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="rst-..."
                  className="w-full px-3.5 py-2.5 bg-[#0B0F19] border border-white/10 rounded-xl text-sm font-mono text-violet-300 placeholder-neutral-500 focus:outline-none focus:border-[#6D45CF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#6D45CF] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#6D45CF] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6D45CF] to-[#5B37B5] hover:opacity-95 disabled:opacity-50 text-white shadow-[0_4px_16px_rgba(109,69,207,0.35)] transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Passphrase</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
            <span className="text-neutral-500 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Salted Hash
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
