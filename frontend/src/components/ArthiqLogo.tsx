import React from 'react';

interface ArthiqLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
  onClick?: () => void;
  size?: 'default' | 'large' | 'compact';
}

export const ArthiqLogo: React.FC<ArthiqLogoProps> = ({
  className = '',
  theme = 'light',
  onClick,
  size = 'default'
}) => {
  const isDark = theme === 'dark';
  
  // Sizing definitions: approx 44-52px icon and 30-36px brand text as required
  const iconSizeClass = size === 'large' 
    ? 'w-12 h-12 md:w-14 md:h-14' 
    : size === 'compact'
    ? 'w-9 h-9'
    : 'w-11 h-11 md:w-[48px] md:h-[48px]';

  const textSizeClass = size === 'large'
    ? 'text-3xl md:text-4xl'
    : size === 'compact'
    ? 'text-xl'
    : 'text-2xl md:text-[32px]';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Precision Geometric Financial Intelligence Emblem */}
      <div className={`relative ${iconSizeClass} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Base Geometric Plate */}
          <rect
            x="2"
            y="2"
            width="48"
            height="48"
            rx="14"
            fill={isDark ? "#171924" : "#F7F7FA"}
            stroke={isDark ? "rgba(255,255,255,0.12)" : "#E5E5EB"}
            strokeWidth="1.5"
          />
          
          {/* Central Precision Hexagon / Growth Prism */}
          <path
            d="M26 8L41 16.5V33.5L26 42L11 33.5V16.5L26 8Z"
            fill="url(#logoGradient)"
            opacity={isDark ? "0.95" : "0.92"}
          />
          
          {/* Data Intersection Facets: Representing Intelligence & Stability */}
          <path
            d="M26 8L41 16.5L26 25L11 16.5L26 8Z"
            fill="#A78BFA"
            opacity="0.9"
          />
          <path
            d="M26 25L41 16.5V33.5L26 42V25Z"
            fill="#6D45CF"
          />
          <path
            d="M26 25V42L11 33.5V16.5L26 25Z"
            fill="#8B5CF6"
          />
          
          {/* Center Precision Focal Dot */}
          <circle cx="26" cy="25" r="3.2" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="logoGradient" x1="11" y1="8" x2="41" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="0.5" stopColor="#6D45CF" />
              <stop offset="1" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`font-['Plus_Jakarta_Sans',sans-serif] font-extrabold tracking-[-0.035em] leading-none ${textSizeClass} ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            ARTHIQ
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDE7FF] text-[#6D45CF] border border-[#DDD3FA]">
            Intelligence
          </span>
        </div>
      </div>
    </div>
  );
};

