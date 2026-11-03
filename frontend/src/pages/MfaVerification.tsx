import React, { useState } from 'react';
import { ShieldCheck, KeyRound, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ArthiqLogo } from '../components/ArthiqLogo';

interface MfaVerificationProps {
  challengeId: string;
  email: string;
  onVerifySuccess: (user: any, token: string) => void;
  onBackToLogin: () => void;
}

export const MfaVerification: React.FC<MfaVerificationProps> = ({
  challengeId,
  email,
  onVerifySuccess,
  onBackToLogin
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'MFA Verification failed. Incorrect code.');
        setLoading(false);
        return;
      }

      localStorage.setItem('arthiq_auth_token', data.token);
      localStorage.setItem('arthiq_user', JSON.stringify(data.user));

      onVerifySuccess(data.user, data.token);
    } catch (err) {
      setError('Communication error during MFA verification.');
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
        <ArthiqLogo theme="dark" size="large" />
        <p className="mt-2 text-xs text-[#94A3B8] tracking-widest uppercase font-semibold">
          High-Security Enterprise Tenant Gate
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#111622]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="mb-6 pb-4 border-b border-white/[0.08]">
            <div className="w-12 h-12 rounded-xl bg-[#6D45CF]/20 border border-[#6D45CF]/40 flex items-center justify-center text-[#A78BFA] mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Your account has advanced MFA enabled. Enter the 6-digit TOTP code generated for <span className="text-white font-mono">{email}</span>.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Hint */}
          <div className="mb-5 p-3 rounded-xl bg-[#6D45CF]/10 border border-[#6D45CF]/20 text-[11px] text-violet-300 flex items-center justify-between">
            <span>Enterprise Test OTP Code:</span>
            <button
              type="button"
              onClick={() => setCode('123456')}
              className="px-2 py-0.5 rounded bg-[#6D45CF]/30 border border-[#6D45CF]/40 font-mono font-bold text-white hover:bg-[#6D45CF]/50 transition-colors cursor-pointer"
            >
              Fill 123456
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2 text-center">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#6D45CF] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6D45CF] to-[#5B37B5] hover:opacity-95 disabled:opacity-50 text-white shadow-[0_4px_16px_rgba(109,69,207,0.35)] transition-all cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify and Authenticate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel & Sign In</span>
            </button>
            <span className="text-neutral-500 text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Strict 5m Window
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
