import React from 'react';
import {
  LayoutDashboard,
  Activity,
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
  Activity,
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
    <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-65px)] bg-white border-r border-[#E5E5EB] flex flex-col justify-between p-4 text-black">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-extrabold tracking-wider text-black uppercase">
          Financial Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                isActive
                  ? 'bg-[#EDE7FF] text-[#6D45CF] shadow-xs'
                  : 'text-black hover:text-[#6D45CF] hover:bg-[#F7F7FA]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#6D45CF]' : 'text-black group-hover:text-[#6D45CF]'
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
                      : 'bg-neutral-200 text-black'
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
          className="p-3.5 rounded-2xl bg-[#F7F7FA] border border-neutral-300 cursor-pointer hover:border-[#6D45CF]/60 transition-all group"
        >
          <div className="flex items-center gap-2 text-[#6D45CF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Financial Advice?</span>
          </div>
          <p className="text-[11px] text-black mt-1 leading-snug font-semibold">
            "Where is my business losing unnecessary money?"
          </p>
          <span className="text-[10px] text-[#6D45CF] font-extrabold mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Ask ARTHIQ AI →
          </span>
        </div>
      </div>
    </aside>
  );
};
