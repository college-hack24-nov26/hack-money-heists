import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onToggleLanding
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Critical Invoice Flagged",
      desc: "Duplicate Invoice #INV-SM-2024-DUP detected from SysMatrix (₹12,000).",
      time: "10 mins ago",
      type: "critical"
    },
    {
      id: 2,
      title: "Profit Leakage Identified",
      desc: "Apex Logistics shipment costs increased 23% without volume change.",
      time: "2 hours ago",
      type: "warning"
    },
    {
      id: 3,
      title: "Cash Runway Updated",
      desc: "30-day forecast confirmed safe with ₹18.5L in liquid reserves.",
      time: "1 day ago",
      type: "info"
    }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-midnight/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Brand & Organization */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue via-accent-cyan to-emerald-400 p-[1.5px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-navy-dark rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">
                AQ
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-['Plus_Jakarta_Sans']">
                ARTHIQ
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-blue/15 text-accent-cyan border border-accent-blue/30 font-medium">
                AI Core
              </span>
            </div>
            <p className="text-[11px] text-neutral-muted">Financial Intelligence</p>
          </div>
        </button>

        {/* Org Selector Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy/60 border border-white/[0.06] text-xs text-neutral-offwhite">
          <Building2 className="w-3.5 h-3.5 text-accent-blue" />
          <span className="font-medium">Apex Technologies Pvt Ltd</span>
          <span className="text-[10px] text-neutral-muted">GST: 27AAPFU0939F1ZV</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-muted ml-1" />
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
          <input
            type="text"
            placeholder="Search transactions, vendors, GST..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-navy/50 border border-white/[0.08] rounded-xl text-neutral-offwhite placeholder-neutral-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>

        {/* Quick Health Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-medium">Health: 84/100 (Strong)</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-navy/60 border border-white/[0.06] text-neutral-offwhite hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-semibold text-white">Financial Alerts</span>
                <span className="text-[10px] text-accent-cyan">3 Active</span>
              </div>
              <div className="divide-y divide-white/[0.04] mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-left">
                    <p className="text-xs font-medium text-neutral-offwhite">{n.title}</p>
                    <p className="text-[11px] text-neutral-muted mt-0.5 leading-snug">{n.desc}</p>
                    <span className="text-[9px] text-neutral-muted/70 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Landing Page Switcher */}
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-muted hover:text-white hover:bg-white/5 transition-colors border border-white/[0.06]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-cyan flex items-center justify-center font-bold text-xs text-midnight">
            VS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Vikramaditya S.</p>
            <p className="text-[10px] text-neutral-muted">Managing Director</p>
          </div>
        </div>
      </div>
    </header>
  );
};

