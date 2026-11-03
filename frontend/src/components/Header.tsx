import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { ArthiqLogo } from './ArthiqLogo';

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 backdrop-blur-xl border-b border-[#E5E5EB] text-[#15151B]">
      {/* Brand & Organization */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-3 focus:outline-none text-left"
        >
          <ArthiqLogo size="compact" theme="light" />
        </button>

        {/* Org Selector Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F7FA] border border-[#E5E5EB] text-xs text-[#15151B]">
          <Building2 className="w-3.5 h-3.5 text-[#6D45CF]" />
          <span className="font-semibold">Apex Technologies Pvt Ltd</span>
          <span className="text-[11px] text-[#71717A]">GST: 27AAPFU0939F1ZV</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717A] ml-1" />
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            placeholder="Search general ledger, vendors, GSTIN..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F7FA] border border-[#E5E5EB] rounded-xl text-[#15151B] placeholder-[#71717A] focus:outline-none focus:border-[#6D45CF] transition-colors"
          />
        </div>

        {/* Quick Health Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#16A879]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-semibold">Health: 84/100 (Strong)</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#F7F7FA] border border-[#E5E5EB] text-[#15151B] hover:bg-[#ECECF1] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E5E5EB] p-4 shadow-xl z-50 animate-fade-in text-[#15151B]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
                <span className="text-xs font-semibold text-[#15151B]">Financial Alerts</span>
                <span className="text-[10px] font-bold text-[#6D45CF]">3 Active</span>
              </div>
              <div className="divide-y divide-[#F0F0F5] mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-left">
                    <p className="text-xs font-semibold text-[#15151B]">{n.title}</p>
                    <p className="text-[11px] text-[#71717A] mt-0.5 leading-snug">{n.desc}</p>
                    <span className="text-[9px] text-[#71717A] mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Landing Page Switcher */}
        <button
          onClick={onToggleLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#71717A] hover:text-[#15151B] hover:bg-[#F7F7FA] transition-colors border border-[#E5E5EB]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Homepage</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E5E5EB]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D45CF] to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            VS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-[#15151B] leading-tight">Vikramaditya S.</p>
            <p className="text-[10px] text-[#71717A]">Managing Director</p>
          </div>
        </div>
      </div>
    </header>
  );
};
