import React from "react";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroProps {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  primaryCtaText?: string;
  onPrimaryCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  showFloatingTelemetry?: boolean;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  eyebrow = "AI-POWERED FINANCIAL INTELLIGENCE",
  title = (
    <>
      See Beyond Numbers. <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
        Think Ahead.
      </span>
    </>
  ),
  subtitle = "An intelligent financial platform that helps businesses understand their expenses, detect financial risks, predict cash flow and uncover hidden profit opportunities.",
  primaryCtaText = "Explore ARTHIQ",
  onPrimaryCtaClick,
  secondaryCtaText = "Launch Dashboard",
  onSecondaryCtaClick,
  showFloatingTelemetry = true,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "relative w-full min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-white",
        className
      )}
    >
      {/* 1. Fine Geometric Grid Background */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-70"
        aria-hidden="true"
      />

      {/* 2. Soft Violet Radial Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-radial-violet pointer-events-none blur-3xl opacity-80"
        aria-hidden="true"
      />

      {/* 3. Bottom Fade / Gradient Transition */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-8 pb-16">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7FF] border border-[#DDD3FA] text-[#6D45CF] text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-in shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
          <span>{eyebrow}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold text-black tracking-[-0.035em] leading-[1.08] font-['Plus_Jakarta_Sans',sans-serif] animate-fade-up max-w-4xl">
          {title}
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-black max-w-2xl mx-auto leading-relaxed font-semibold animate-fade-up delay-100">
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto animate-fade-up delay-200">
          <Button
            size="lg"
            variant="default"
            onClick={onPrimaryCtaClick}
            className="w-full sm:w-auto text-sm font-semibold h-12 px-7 gap-2 shadow-[0_4px_20px_rgba(109,69,207,0.3)] bg-[#6D45CF] hover:bg-[#5B37B5] text-white"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onSecondaryCtaClick}
            className="w-full sm:w-auto text-sm font-bold h-12 px-7 gap-2 bg-white text-black border-neutral-300 hover:bg-[#F7F7FA] shadow-xs"
          >
            <span>{secondaryCtaText}</span>
          </Button>
        </div>
      </div>

      {/* 4. Floating Financial Visualization Cards (Carefully positioned at edges) */}
      {showFloatingTelemetry && (
        <div className="hidden lg:block pointer-events-none select-none" aria-hidden="true">
          {/* Card 1: Revenue Growth Indicator (Top Left) */}
          <div className="absolute top-[22%] left-[4%] xl:left-[8%] p-3.5 rounded-2xl bg-white border border-[#E5E5EB] shadow-card animate-float-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A879] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-black tracking-wider block">
                  QoQ Revenue Growth
                </span>
                <span className="text-sm font-extrabold text-black font-mono">
                  +10.0% (₹45.00L)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Health Score (Top Right) */}
          <div className="absolute top-[20%] right-[4%] xl:right-[8%] p-3.5 rounded-2xl bg-white border border-[#E5E5EB] shadow-card animate-float-reverse">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D45CF] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-black tracking-wider block">
                  Financial Health
                </span>
                <span className="text-sm font-extrabold text-[#6D45CF] font-mono">
                  84 / 100 Strong
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Profit Leakage Detected (Bottom Left) */}
          <div className="absolute bottom-[18%] left-[5%] xl:left-[10%] p-3.5 rounded-2xl bg-white border border-rose-200/80 shadow-card animate-float-reverse">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#E46D72] flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-[#E46D72] tracking-wider block">
                  Profit Leakage Alert
                </span>
                <span className="text-sm font-extrabold text-black font-mono">
                  ₹85,200 Recoverable
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: 90-Day Cash Flow Runway (Bottom Right) */}
          <div className="absolute bottom-[16%] right-[5%] xl:right-[9%] p-3.5 rounded-2xl bg-white border border-[#E5E5EB] shadow-card animate-float-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#6D45CF] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-black tracking-wider block">
                  30-90D Cash Runway
                </span>
                <span className="text-sm font-extrabold text-[#16A879] font-mono">
                  14.2 Mo Positive
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;

