import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  showText = true,
  className = '',
  animate = true,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`} id="zaiarc-logo-wrapper">
      {/* Visual Shield Icon */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Red Glow Backing */}
        <div className="absolute w-8 h-8 rounded-full bg-red-600 blur-[8px] opacity-40"></div>
        <svg
          width={size}
          height={size + 4}
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 ${animate ? 'animate-[pulse_3s_infinite_ease-in-out]' : ''}`}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.45))' }}
        >
          <defs>
            <radialGradient id="shield-grad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#800000" />
              <stop offset="100%" stopColor="#250000" />
            </radialGradient>
            <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#D4D4D8" />
              <stop offset="100%" stopColor="#52525B" />
            </linearGradient>
            <linearGradient id="red-accent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF4444" />
              <stop offset="100%" stopColor="#990000" />
            </linearGradient>
          </defs>

          {/* Outer Red Laser Glow Ring */}
          <circle
            cx="50"
            cy="52"
            r="46"
            stroke="rgba(255, 0, 0, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* Shield Outer Silver Border */}
          <path
            d="M50 12 C68 18, 86 10, 86 38 C86 70, 68 94, 50 102 C32 94, 14 70, 14 38 C14 10, 32 18, 50 12 Z"
            fill="url(#shield-grad)"
            stroke="url(#silver-grad)"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Shield Inner Red Fill Inset */}
          <path
            d="M50 20 C64 25, 78 18, 78 40 C78 64, 64 84, 50 91 C36 84, 22 64, 22 40 C22 18, 36 25, 50 20 Z"
            fill="rgba(255, 0, 0, 0.08)"
            stroke="url(#red-accent)"
            strokeWidth="2"
          />

          {/* Magnifying Glass handle */}
          <line
            x1="58"
            y1="60"
            x2="74"
            y2="76"
            stroke="url(#silver-grad)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Magnifying Glass Rim */}
          <circle
            cx="46"
            cy="48"
            r="16"
            fill="rgba(192, 192, 192, 0.1)"
            stroke="url(#silver-grad)"
            strokeWidth="4.5"
          />

          {/* Lens reflection/shine */}
          <path
            d="M37 41 A11 11 0 0 1 50 37"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Brand Text Lockup */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="font-heading font-black text-2xl tracking-tighter text-white leading-none">
            ZAI<span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">ARC</span>
          </div>
          <div className="text-[9px] font-mono tracking-[0.3em] text-gray-500 font-bold leading-none mt-1.5 uppercase">
            Audit Platform
          </div>
        </div>
      )}
    </div>
  );
};
