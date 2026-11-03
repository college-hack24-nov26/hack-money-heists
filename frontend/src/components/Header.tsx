import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  Building2,
  ExternalLink,
  Shield,
  LogOut
} from 'lucide-react';
import { ArthiqLogo } from './ArthiqLogo';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleLanding: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string;
  } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onToggleLanding,
  user,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = user?.name || "Vikramaditya S.";
  const displayRole = user?.role || "Super Admin";
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 backdrop-blur-xl border-b border-[#E5E5EB] text-black">
      {/* Brand & Organization */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-3 focus:outline-none text-left cursor-pointer"
        >
          <ArthiqLogo size="compact" theme="light" />
        </button>

        {/* Org Selector Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F7FA] border border-[#E5E5EB] text-xs text-black">
          <Building2 className="w-3.5 h-3.5 text-[#6D45CF]" />
          <span className="font-bold text-black">Apex Technologies Pvt Ltd</span>
          <span className="text-[11px] font-semibold text-black">GST: 27AAPFU0939F1ZV</span>
          <ChevronDown className="w-3.5 h-3.5 text-black ml-1" />
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search general ledger, vendors, GSTIN..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F7FA] border border-[#E5E5EB] rounded-xl text-black placeholder-neutral-600 font-medium focus:outline-none focus:border-[#6D45CF] transition-colors"
          />
        </div>

        {/* Quick Health Pill / Security Link */}
        <button
          onClick={() => onNavigate('security')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-[#16A879] transition-colors cursor-pointer"
          title="Open Enterprise Security Center"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold">Security: 96/100 (A+)</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#F7F7FA] border border-[#E5E5EB] text-black hover:bg-[#ECECF1] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E5E5EB] p-4 shadow-xl z-50 animate-fade-in text-black">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
                <span className="text-xs font-bold text-black">Financial Alerts</span>
                <span className="text-[10px] font-bold text-[#6D45CF]">3 Active</span>
              </div>
              <div className="divide-y divide-[#F0F0F5] mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-left">
                    <p className="text-xs font-bold text-black">{n.title}</p>
                    <p className="text-[11px] text-black mt-0.5 leading-snug font-medium">{n.desc}</p>
                    <span className="text-[9px] text-black font-semibold mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Landing Page Switcher */}
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-black hover:bg-[#F7F7FA] transition-colors border border-neutral-300 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Homepage</span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E5E5EB]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D45CF] to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            {initials || 'AR'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-extrabold text-black leading-tight">{displayName}</p>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#6D45CF]">{displayRole}</span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Secure Session Logout"
              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
