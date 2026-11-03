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
    <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-61px)] bg-midnight/90 border-r border-white/[0.06] flex flex-col justify-between p-4">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-neutral-muted uppercase">
          Financial Intelligence
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-accent-blue/15 text-white border border-accent-blue/30 shadow-[0_0_15px_-3px_rgba(86,139,255,0.2)]'
                  : 'text-neutral-muted hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-accent-cyan' : 'text-neutral-muted group-hover:text-neutral-offwhite'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.badge.includes('Flagged')
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      : item.badge.includes('Save')
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : isActive
                      ? 'bg-accent-cyan/20 text-accent-cyan'
                      : 'bg-white/5 text-neutral-muted'
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
      <div className="pt-4 border-t border-white/[0.06]">
        <div
          onClick={() => onNavigate('assistant')}
          className="p-3.5 rounded-xl glass-panel-subtle cursor-pointer hover:border-accent-blue/40 transition-all group"
        >
          <div className="flex items-center gap-2 text-accent-cyan text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Financial Advice?</span>
          </div>
          <p className="text-[11px] text-neutral-muted mt-1 leading-snug">
            "Where is my business losing unnecessary money?"
          </p>
          <span className="text-[10px] text-accent-blue font-medium mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Ask ARTHIQ AI →
          </span>
        </div>
      </div>
    </aside>
  );
};

