import React from 'react';

interface RailLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const RailLogo: React.FC<RailLogoProps> = ({ size = 'md', showText = true }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 42 : 32;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div 
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#102A43] via-[#0B1F33] to-[#071626] border border-[#244B6A] p-1.5 shadow-md shadow-cyan-950/40"
        style={{ width: iconSize + 12, height: iconSize + 12 }}
      >
        {/* SVG Railway tracks converging into a network intelligence node */}
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left curved track */}
          <path d="M 8 42 C 14 30, 20 22, 24 16" stroke="#20C6B7" strokeWidth="3.5" strokeLinecap="round" />
          {/* Right curved track */}
          <path d="M 40 42 C 34 30, 28 22, 24 16" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          {/* Center stem */}
          <path d="M 24 16 L 24 6" stroke="#20C6B7" strokeWidth="3.5" strokeLinecap="round" />
          {/* Sleepers */}
          <line x1="12" y1="36" x2="36" y2="36" stroke="#244B6A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="28" x2="32" y2="28" stroke="#244B6A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="22" x2="28" y2="22" stroke="#244B6A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Central AI Network Node */}
          <circle cx="24" cy="14" r="5" fill="#071626" stroke="#20C6B7" strokeWidth="2.5" />
          <circle cx="24" cy="14" r="2.5" fill="#38BDF8" className="animate-ping" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider ${textSize} text-[#E6F4F1]`}>
              RAIL<span className="text-[#20C6B7]">KUSHAL</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#163B5C] text-[#38BDF8] border border-[#244B6A]">
              PUNE
            </span>
          </div>
          <span className="text-[10px] text-[#A7C1D4] font-medium tracking-wide">
            Central Railway · AI Block Planning
          </span>
        </div>
      )}
    </div>
  );
};
