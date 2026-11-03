import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  FileCheck2,
  TrendingUp,
  AlertOctagon,
  BarChart3,
  ShieldAlert,
  ShoppingCart,
  Users2,
  Bot,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'expenses',
      label: 'Expense Analyzer',
      icon: Receipt,
      badge: 'ML'
    },
    {
      id: 'invoices',
      label: 'Invoice Intelligence',
      icon: FileCheck2,
      badge: '3 Flagged'
    },
    {
      id: 'cashflow',
      label: 'Cash Flow Forecast',
      icon: TrendingUp,
      badge: '90D'
    },
    {
      id: 'leakage',
      label: 'Profit Leakage (PLD)',
      icon: AlertOctagon,
      badge: '₹85K Save'
    },
    {
      id: 'analytics',
      label: 'Financial Analytics & BI',
      icon: BarChart3,
      badge: 'Excel'
    },
    {
      id: 'risks',
      label: 'Risk Management',
      icon: ShieldAlert,
      badge: 'Radar'
    },
    {
      id: 'procurement',
      label: 'Procurement Cost',
      icon: ShoppingCart,
      badge: null
    },
    {
      id: 'clients',
      label: 'Client Management',
      icon: Users2,
      badge: null
    },
    {
      id: 'assistant',
      label: 'ARTHIQ AI Assistant',
      icon: Bot,
      badge: 'AI Analyst'
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: FileSpreadsheet,
      badge: null
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-65px)] bg-white border-r border-[#E5E5EB] flex flex-col justify-between p-4 text-[#15151B]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-[#71717A] uppercase">
          Financial Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#EDE7FF] text-[#6D45CF] shadow-xs'
                  : 'text-[#71717A] hover:text-[#15151B] hover:bg-[#F7F7FA]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#6D45CF]' : 'text-[#71717A] group-hover:text-[#15151B]'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.badge.includes('Flagged')
                      ? 'bg-rose-100 text-[#E46D72]'
                      : item.badge.includes('Save')
                      ? 'bg-emerald-100 text-[#16A879]'
                      : isActive
                      ? 'bg-[#DDD3FA] text-[#6D45CF]'
                      : 'bg-[#ECECF1] text-[#71717A]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Assistant Quick Prompt Pill */}
      <div className="pt-4 border-t border-[#E5E5EB]">
        <div
          onClick={() => onNavigate('assistant')}
          className="p-3.5 rounded-2xl bg-[#F7F7FA] border border-[#E5E5EB] cursor-pointer hover:border-[#6D45CF]/40 transition-all group"
        >
          <div className="flex items-center gap-2 text-[#6D45CF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Financial Advice?</span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1 leading-snug">
            "Where is my business losing unnecessary money?"
          </p>
          <span className="text-[10px] text-[#6D45CF] font-bold mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Ask ARTHIQ AI →
          </span>
        </div>
      </div>
    </aside>
  );
};
