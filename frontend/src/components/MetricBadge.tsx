import React from 'react';

interface MetricBadgeProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'coral' | 'blue' | 'neutral';
  className?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  variant = 'neutral',
  className = ''
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-[#16A879] border-emerald-200/80',
    amber: 'bg-amber-50 text-[#E5A33D] border-amber-200/80',
    coral: 'bg-rose-50 text-[#E46D72] border-rose-200/80',
    blue: 'bg-[#EDE7FF] text-[#6D45CF] border-[#DDD3FA]',
    neutral: 'bg-[#F7F7FA] text-black border-[#E5E5EB]'
  };

  let resolvedVariant = variant;
  const l = label.toLowerCase();
  if (l.includes('critical') || l.includes('high') || l.includes('deficit') || l.includes('flagged')) {
    resolvedVariant = 'coral';
  } else if (l.includes('medium') || l.includes('warning') || l.includes('watch') || l.includes('suspected')) {
    resolvedVariant = 'amber';
  } else if (l.includes('low') || l.includes('healthy') || l.includes('verified') || l.includes('active') || l.includes('strong') || l.includes('positive')) {
    resolvedVariant = 'emerald';
  } else if (l.includes('ml') || l.includes('predictive') || l.includes('ai') || l.includes('signature')) {
    resolvedVariant = 'blue';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variantStyles[resolvedVariant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};
