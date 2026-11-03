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
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    coral: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    neutral: 'bg-white/5 text-neutral-muted border-white/10'
  };

  let resolvedVariant = variant;
  const l = label.toLowerCase();
  if (l.includes('critical') || l.includes('high') || l.includes('deficit') || l.includes('flagged')) {
    resolvedVariant = 'coral';
  } else if (l.includes('medium') || l.includes('warning') || l.includes('watch') || l.includes('suspected')) {
    resolvedVariant = 'amber';
  } else if (l.includes('low') || l.includes('healthy') || l.includes('verified') || l.includes('active') || l.includes('strong')) {
    resolvedVariant = 'emerald';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variantStyles[resolvedVariant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

