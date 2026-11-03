import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, LayoutDashboard, Lock } from 'lucide-react';
import { ArthiqLogo } from '../components/ArthiqLogo';

interface UnauthorizedProps {
  requiredRole?: string;
  userRole?: string;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onSwitchAccount: () => void;
}

export const Unauthorized: React.FC<UnauthorizedProps> = ({
  requiredRole = 'Super Admin / Company Admin',
  userRole = 'Employee',
  onNavigateHome,
  onNavigateDashboard,
  onSwitchAccount
}) => {
  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white font-sans selection:bg-[#6D45CF] selection:text-white relative overflow-hidden">
      {/* Background Warning Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-rose-500/15 via-orange-500/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-6">
        <div className="inline-block cursor-pointer" onClick={onNavigateHome}>
          <ArthiqLogo theme="dark" size="large" />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8] tracking-widest uppercase font-semibold">
          Layer 2 RBAC Authorization Gate
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#111622]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-2xl border border-rose-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-5 shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">403 — Access Denied</h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Your authenticated session lacks the required Role-Based Access Control (RBAC) privileges to perform this operation.
          </p>

          {/* Role Comparison Card */}
          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-medium">Your Current Role:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                {userRole}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-medium">Required Clearance:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6D45CF]/20 text-violet-300 font-mono font-bold text-[11px] border border-[#6D45CF]/40">
                {requiredRole}
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Lock className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>Event recorded in immutable audit log</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 space-y-3">
            <button
              onClick={onNavigateDashboard}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6D45CF] to-[#5B37B5] hover:opacity-95 text-white shadow-[0_4px_16px_rgba(109,69,207,0.35)] transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Permitted Modules</span>
            </button>

            <button
              onClick={onSwitchAccount}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch to Higher Privileged Account</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] text-center">
            <button
              onClick={onNavigateHome}
              className="text-neutral-400 hover:text-white text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
