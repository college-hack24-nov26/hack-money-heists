import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertOctagon,
  FileCheck2,
  Receipt,
  BarChart3,
  Bot,
  Users2,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Zap,
  Globe,
  Sliders,
  Database
} from 'lucide-react';
import { ParticleField } from '../animations/ParticleField';
import { GlassCard } from '../components/GlassCard';
import { MetricBadge } from '../components/MetricBadge';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [calcMonthlySpend, setCalcMonthlySpend] = useState<number>(1500000);
  const estimatedAnnualSavings = Math.round(calcMonthlySpend * 0.082 * 12);

  const modules = [
    {
      icon: Receipt,
      title: "Smart Expense Analyzer",
      desc: "ML anomaly detection on outlier disbursements, recurring SaaS sprawl tracking, and duplicate expense elimination.",
      badge: "Module 1"
    },
    {
      icon: FileCheck2,
      title: "Invoice Fraud & Forensic Detector",
      desc: "Document OCR parsing, statutory 15-character GSTIN checksum validation, IFSC routing checks, and risk scoring.",
      badge: "Module 2"
    },
    {
      icon: TrendingUp,
      title: "SME Cash Flow Intelligence",
      desc: "Holt-Winters predictive forecasting over 7, 30, 60, and 90 days with 95% bootstrap confidence bands and runway alerts.",
      badge: "Module 3"
    },
    {
      icon: AlertOctagon,
      title: "Profit Leakage Detector (PLD)",
      desc: "ARTHIQ's signature engine: scans ledger for redundant licenses, vendor price creep (+23%), and delayed debtor carry costs.",
      badge: "Module 4"
    },
    {
      icon: BarChart3,
      title: "Financial Analytics & BI",
      desc: "Executive P&L statements, Balance Sheets, and 15+ Chartered Accountant ratios with 1-click Excel XLSX/CSV export.",
      badge: "Module 5"
    },
    {
      icon: Users2,
      title: "Client & Receivable Isolation",
      desc: "Centralized client profiles, DSO tracking, credit limits, and tenant-level cryptographic isolation.",
      badge: "Module 6"
    },
    {
      icon: ShieldCheck,
      title: "Financial Risk Radar",
      desc: "Multi-dimensional early warning system analyzing liquidity, profitability margins, credit default, and operational drag.",
      badge: "Module 7"
    },
    {
      icon: Bot,
      title: "ARTHIQ AI Financial Assistant",
      desc: "Conversational financial intelligence engine executing verified general ledger tools with zero hallucinated figures.",
      badge: "Module 10"
    }
  ];

  return (
    <div className="relative min-h-screen bg-midnight text-neutral-offwhite overflow-hidden font-sans">
      {/* Interactive Canvas Particle Field */}
      <ParticleField />

      {/* Top Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5 border-b border-white/[0.06] bg-midnight/70 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue via-accent-cyan to-emerald-400 p-[1.5px] shadow-glow">
            <div className="w-full h-full bg-navy-dark rounded-[10px] flex items-center justify-center font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">
              AQ
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
              ARTHIQ
            </span>
            <span className="text-[10px] uppercase tracking-wider block text-neutral-muted">
              Financial Intelligence Platform
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-muted">
          <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#cashflow" className="hover:text-white transition-colors">Prediction</a>
          <a href="#leakage" className="hover:text-white transition-colors">Profit Leakage</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </div>

        <button
          onClick={onLaunchDashboard}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent-blue via-accent-cyan to-emerald-400 text-midnight hover:opacity-95 transition-opacity shadow-glow flex items-center gap-2"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-28 px-6 lg:px-16 max-w-7xl mx-auto text-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-accent-blue/30 text-xs text-accent-cyan mb-8 animate-float">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Financial Intelligence for SMEs & Finance Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-['Plus_Jakarta_Sans'] max-w-5xl mx-auto">
          Financial Intelligence That <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-blue to-emerald-400">Thinks Ahead.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-muted max-w-3xl mx-auto font-normal leading-relaxed">
          Understand your numbers. Detect hidden risks. Predict what comes next. Make smarter financial decisions with AI-powered financial intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-accent-blue to-accent-cyan text-midnight hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 group"
          >
            <span>Launch Executive Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#leakage"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold glass-panel hover:bg-white/[0.08] text-neutral-offwhite transition-all border border-white/10 text-center"
          >
            Calculate Leakage Savings
          </a>
        </div>

        {/* Floating Zero-Gravity Financial Cards Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="rounded-3xl p-1.5 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl">
            <div className="rounded-[22px] bg-navy-dark/95 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400">APEX TECHNOLOGIES • LIVE AUDIT</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">Autonomous Financial Health Radar</h3>
                </div>
                <div className="flex items-center gap-3">
                  <MetricBadge label="Health: 84/100 Strong" variant="emerald" />
                  <MetricBadge label="Runway: 14.2 Mo" variant="blue" />
                </div>
              </div>

              {/* Mini Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
                <div className="p-4 rounded-xl glass-panel-subtle">
                  <span className="text-neutral-muted block">Gross Revenue (Q1)</span>
                  <span className="text-xl font-bold text-white mt-1 block">₹45,00,000</span>
                  <span className="text-[11px] text-emerald-400 mt-1 block">+10.0% QoQ</span>
                </div>
                <div className="p-4 rounded-xl glass-panel-subtle border-accent-coral/20 bg-rose-950/10">
                  <span className="text-neutral-muted block">Identified Profit Leakage</span>
                  <span className="text-xl font-bold text-rose-400 mt-1 block">₹85,200</span>
                  <span className="text-[11px] text-emerald-400 mt-1 block">₹8.88L Annual Savings</span>
                </div>
                <div className="p-4 rounded-xl glass-panel-subtle">
                  <span className="text-neutral-muted block">Liquid Reserves</span>
                  <span className="text-xl font-bold text-accent-cyan mt-1 block">₹18,50,000</span>
                  <span className="text-[11px] text-neutral-muted mt-1 block">Safety target: ₹5.00L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Financial Modules Grid */}
      <section id="features" className="relative z-10 py-24 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MetricBadge label="Architectural Breadth" variant="blue" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-['Plus_Jakarta_Sans']">
            10 Interconnected Financial Intelligence Modules
          </h2>
          <p className="text-sm text-neutral-muted mt-3">
            Designed to replace fragmented accounting tools with unified, proactive financial decision support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <GlassCard key={i} hoverEffect className="space-y-3 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-cyan border border-accent-blue/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-muted uppercase">{m.badge}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-4">{m.title}</h3>
                  <p className="text-xs text-neutral-muted mt-2 leading-relaxed">{m.desc}</p>
                </div>
                <div className="pt-2 text-[11px] text-accent-blue font-semibold flex items-center gap-1">
                  <span>Explore Module →</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Interactive Profit Leakage Calculator Section */}
      <section id="leakage" className="relative z-10 py-24 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-semibold border border-rose-500/30 mb-3">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>ARTHIQ Signature Feature</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] leading-tight">
              Where Is Your Business Losing Money Unnecessarily?
            </h2>
            <p className="text-sm text-neutral-muted mt-4 leading-relaxed">
              Most SMEs bleed between <strong>6% to 12% of total operational expenditure</strong> through unannounced supplier price escalations, redundant SaaS tool licenses, duplicate invoice settlements, and carrying costs on overdue client invoices.
            </p>

            <div className="space-y-3 mt-6 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-offwhite">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Identifies duplicate vendor billing cycles within 48 hours.</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-offwhite">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Flags supplier price creep (e.g. +23% hike with zero volume justification).</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-offwhite">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Eliminates overlapping software subscriptions across departments.</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Card */}
          <GlassCard className="p-8 space-y-6 border-accent-coral/20 bg-gradient-to-b from-navy-dark to-midnight">
            <h3 className="text-base font-bold text-white">Instant Profit Leakage Estimator</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-muted">
                <span>Monthly Company Operating Expenses (OPEX):</span>
                <span className="font-bold text-white font-mono">₹{calcMonthlySpend.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="250000"
                value={calcMonthlySpend}
                onChange={(e) => setCalcMonthlySpend(Number(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="flex justify-between text-[10px] text-neutral-muted">
                <span>₹5 Lakh/mo</span>
                <span>₹50 Lakh/mo</span>
                <span>₹1 Crore/mo</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-midnight/90 border border-white/[0.08] text-center space-y-2">
              <span className="text-xs text-neutral-muted uppercase tracking-wider block">
                Estimated Recoverable Annual Savings
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-accent-cyan font-mono block">
                ₹{estimatedAnnualSavings.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-neutral-muted">
                Based on verified benchmark recovery rate of 8.2% across vetted SME ledgers.
              </p>
            </div>

            <button
              onClick={onLaunchDashboard}
              className="w-full py-3.5 rounded-xl text-xs font-bold bg-accent-blue hover:bg-accent-blue/90 text-white transition-colors shadow-glow flex items-center justify-center gap-2"
            >
              <span>Scan Your Ledger with ARTHIQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </GlassCard>
        </div>
      </section>

      {/* Security & Data Protection */}
      <section id="security" className="relative z-10 py-24 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <MetricBadge label="Bank-Grade Security" variant="emerald" />
          <h2 className="text-3xl font-bold text-white mt-3 font-['Plus_Jakarta_Sans']">
            Tenant-Level Isolation & Enterprise Governance
          </h2>
          <p className="text-xs text-neutral-muted mt-2">
            Your financial data is protected by strict organization-level encryption, role-based controls, and zero cross-tenant leakage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <GlassCard className="p-6 space-y-2">
            <Lock className="w-5 h-5 text-accent-cyan mb-2" />
            <h3 className="font-bold text-white text-sm">Row-Level Tenant Isolation</h3>
            <p className="text-neutral-muted leading-relaxed">
              Every query is cryptographically bound to your Organization ID. No client can ever access another tenant's financial statements.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <Database className="w-5 h-5 text-accent-blue mb-2" />
            <h3 className="font-bold text-white text-sm">Grounded Math, Zero Hallucination</h3>
            <p className="text-neutral-muted leading-relaxed">
              ARTHIQ AI executes validated deterministic mathematical tools. It never invents balances or claims to have analyzed data that was not uploaded.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="font-bold text-white text-sm">Statutory Compliance Ready</h3>
            <p className="text-neutral-muted leading-relaxed">
              Built-in Indian GSTIN 15-character statutory verification, RBI IFSC routing checks, and dual-signoff accounts payable workflows.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-6 lg:px-16 max-w-5xl mx-auto text-center">
        <GlassCard className="p-12 border-accent-blue/30 bg-gradient-to-b from-navy/80 to-midnight relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-sm text-neutral-muted mt-3 max-w-xl mx-auto">
            Experience ARTHIQ today with Apex Technologies' pre-loaded live demonstration dataset.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-accent-blue via-accent-cyan to-emerald-400 text-midnight hover:opacity-95 transition-opacity shadow-glow flex items-center gap-2"
            >
              <span>Launch ARTHIQ Workspace Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Professional Footer */}
      <footer className="relative z-10 py-10 px-6 lg:px-16 border-t border-white/[0.06] text-xs text-neutral-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">ARTHIQ</span>
          <span>•</span>
          <span>AI-Powered Financial Intelligence Platform</span>
        </div>
        <div>
          <span>© 2026 ARTHIQ. All rights reserved. Built for SMEs, Finance Leaders & Chartered Analysts.</span>
        </div>
      </footer>
    </div>
  );
};

