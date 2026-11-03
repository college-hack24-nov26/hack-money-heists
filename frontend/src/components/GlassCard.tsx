import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'light' | 'dark' | 'gradient';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  variant = 'light'
}) => {
  const baseClasses = variant === 'dark'
    ? 'bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs text-black'
    : variant === 'gradient'
    ? 'rounded-2xl p-5 bg-gradient-to-br from-[#EDE7FF]/40 to-white border border-[#DDD3FA] shadow-xs text-black'
    : 'bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs text-black';

  const hoverClass = hoverEffect
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-[#D4D4DE]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
