import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Building2,
  ShieldCheck,
  KeyRound,
  FileCheck,
  CheckCircle2,
  HardDrive,
  Database,
  Cloud
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';

export const ReportsSettings: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (reportType: string) => {
    setDownloading(true);
    setTimeout(() => {
      let content = "data:text/csv;charset=utf-8,";
      content += `ARTHIQ REPORT: ${reportType.toUpperCase()}\n`;
      content += `Organization: Apex Technologies Pvt Ltd\n`;
      content += `Date: ${new Date().toISOString()}\n\n`;
      content += "ID,Parameter,Value,Status\n";
      content += "1,Gross Operating Revenue,4500000,Audited\n";
      content += "2,Operating OPEX,1274400,Verified\n";
      content += "3,Net Margin,15.4%,Healthy\n";
      content += "4,Liquid Runway,14.2 Mo,Positive\n";

      const encodedUri = encodeURI(content);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ARTHIQ_${reportType}_Export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-panel">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-black font-['Plus_Jakarta_Sans']">
            Reports & Tenant Organization Settings
          </h1>
          <MetricBadge label="Enterprise Multi-Tenant" variant="blue" />
        </div>
        <p className="text-xs text-black mt-1 max-w-xl">
          Automated export of statutory financial packages, general ledger data, audit logs, and organization-level encryption controls.
        </p>
      </div>

      {/* Reports Generation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="space-y-3">
          <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue w-fit">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-black">Full Financial Statement Model</h3>
          <p className="text-xs text-black">
            Comprehensive P&L, Balance Sheet, Cash Flow, and 15+ Financial Ratios ready for banking & board presentations.
          </p>
          <button
            onClick={() => handleDownload("Financial_Statements_Model")}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors flex items-center justify-center gap-2 shadow-glow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download XLSX / CSV</span>
          </button>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-fit">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-black">Profit Leakage & Audit Dossier</h3>
          <p className="text-xs text-black">
            Detailed schedule of all 5 detected leakages, price creeps, duplicate payments, and verified savings recommendations.
          </p>
          <button
            onClick={() => handleDownload("Profit_Leakage_Dossier")}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Leakage Dossier</span>
          </button>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-black">Accounts Payable & Invoice Register</h3>
          <p className="text-xs text-black">
            Complete vendor invoice log with forensic risk classifications, GSTIN checksum statuses, and payment vouchers.
          </p>
          <button
            onClick={() => handleDownload("Invoice_Register")}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-midnight hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-emeraldGlow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice Register</span>
          </button>
        </GlassCard>
      </div>

      {/* Supabase PostgreSQL Cloud Database */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6D45CF]/10 text-[#6D45CF]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-black">Supabase PostgreSQL Cloud Database</h3>
              <p className="text-[11px] text-black">Connected to Project: mmljatcvouyjfbznxjgs</p>
            </div>
          </div>
          <MetricBadge label="Supabase Connected" variant="emerald" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Cloud Project URL</span>
            <span className="font-mono text-emerald-400 mt-0.5 block truncate">mmljatcvouyjfbznxjgs.supabase.co</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Database Engine</span>
            <span className="font-semibold text-black mt-0.5 block">PostgreSQL 15+ (Cloud Hosted)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Auth & Client API</span>
            <span className="font-semibold text-black mt-0.5 block">@supabase/supabase-js v2</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Row Level Security</span>
            <span className="font-semibold text-emerald-400 mt-0.5 block">Active RLS on All Tables</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
          <span className="text-black block text-[10px] uppercase font-bold tracking-wider">Synchronized Schema Tables</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {['organizations', 'users', 'accounts', 'clients', 'vendors', 'expenses', 'invoices', 'profit_leakage_findings', 'audit_logs'].map(table => (
              <span key={table} className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-[#E2E8F0] text-[11px] font-mono text-black">
                {table}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Organization Credentials & Tenant Isolation */}
      <GlassCard className="space-y-4">
        <h3 className="text-sm font-semibold text-black">Organization Profile & Security Boundary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Entity Name</span>
            <span className="font-semibold text-black mt-0.5 block">Apex Technologies Pvt Ltd</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Registered GSTIN</span>
            <span className="font-mono text-white mt-0.5 block">27AAPFU0939F1ZV</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Statutory PAN</span>
            <span className="font-mono text-white mt-0.5 block">AAPFU0939F</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-black block text-[10px]">Liquidity Safety Floor</span>
            <span className="font-bold text-emerald-400 mt-0.5 block">₹5,00,000.00</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-semibold text-black">Tenant-Level Database Row Isolation</p>
              <p className="text-[11px] text-black">
                Multi-tenant cryptography active. No cross-tenant access is permitted across client records.
              </p>
            </div>
          </div>
          <MetricBadge label="Active AES-256" variant="emerald" />
        </div>
      </GlassCard>
    </div>
  );
};

