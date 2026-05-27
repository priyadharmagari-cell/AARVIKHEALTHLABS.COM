import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  style?: React.CSSProperties;
}

export const Logo = ({ className = "", showText = false, style }: LogoProps) => {
  if (showText) {
    return (
      <svg 
        viewBox="0 0 350 100" 
        className={`select-none ${className}`} 
        style={{ minWidth: '150px', display: 'inline-block', ...style }}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Blue-to-Cyan Gradient for the A-frame */}
          <linearGradient id="aFrameGrad" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" /> {/* Vivid Royal Blue */}
            <stop offset="50%" stopColor="#0ea5e9" /> {/* Vibrant Sky Blue */}
            <stop offset="100%" stopColor="#0f172a" /> {/* Deep luxurious Navy */}
          </linearGradient>

          {/* Liquid Gradient inside the test tube */}
          <linearGradient id="liquidGrad" x1="50" y1="26" x2="50" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Vibrant Emerald-to-Teal Gradient for the organic swoosh */}
          <linearGradient id="swooshGrad" x1="15" y1="70" x2="85" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" /> {/* Mint Emerald */}
            <stop offset="50%" stopColor="#059669" /> {/* Deep Emerald */}
            <stop offset="100%" stopColor="#14b6a2" /> {/* Light Teal */}
          </linearGradient>

          {/* Floating Blue/Cyan Gradient for the Medical Plus */}
          <linearGradient id="plusGrad" x1="68" y1="18" x2="84" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" /> {/* Extra bright sky blue */}
            <stop offset="100%" stopColor="#2563eb" /> {/* Vivid blue */}
          </linearGradient>

          {/* Glow filter for depth - made significantly thicker and brighter with blue/cyan glows */}
          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0ea5e9" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#3b82f6" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* --- LEFT SIDE: ICON (0 TO 100) --- */}
        <g transform="translate(5, 0)" filter="url(#glowFilter)">
          {/* Stylized Modern "A" Left Leg of the logo - added stroke and increased strokeWidth for thickness */}
          <path 
            d="M 45 22 L 22 78 Q 21.5 80 23.5 80 L 32.5 80 Q 34 80 34.5 78.5 L 45.2 51 Z" 
            fill="url(#aFrameGrad)" 
            stroke="url(#aFrameGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Stylized Modern "A" Right Leg of the logo - added stroke and increased strokeWidth for thickness */}
          <path 
            d="M 54.8 45.3 L 67.5 78.5 Q 68 80 70 80 L 78.5 80 Q 80.5 80 79.5 78.5 L 63.5 40 Z" 
            fill="url(#aFrameGrad)" 
            stroke="url(#aFrameGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Central diagnostic test tube - made boundaries bolder */}
          <rect x="47" y="15" width="12" height="2.5" rx="1.25" fill="#38bdf8" />
          <path 
            d="M 48.5 17.5 H 57.5 V 42 C 57.5 46.5 48.5 46.5 48.5 42 V 17.5 Z" 
            fill="rgba(56, 189, 248, 0.12)" 
            stroke="#0ea5e9" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 49.5 27 C 51 26 55 28 56.5 27 V 41.5 C 56.5 44 49.5 44 49.5 41.5 V 27 Z" 
            fill="url(#liquidGrad)" 
          />
          
          {/* Active bubbling details */}
          <circle cx="51.5" cy="31" r="1.25" fill="#ffffff" opacity="0.95" />
          <circle cx="54.5" cy="34" r="1" fill="#ffffff" opacity="0.95" />
          <circle cx="52.2" cy="37" r="1.1" fill="#ffffff" opacity="0.85" />
 
          {/* Green/Teal organic swoosh curve that cuts across 'A' leg - boldened */}
          <path 
            d="M 18 64 C 28 64 45 52 64 48 C 74 46 82 40 85 32 C 80 44 65 52 48 56 C 30 60 22 64 18 64 Z" 
            fill="url(#swooshGrad)" 
            stroke="url(#swooshGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
 
          {/* Floating Bright Medical Plus sign - highlighted pink with a slight stroke to make it stand out thick */}
          <path 
            d="M 76 18 H 81 V 23 H 86 V 28 H 81 V 33 H 76 V 28 H 71 V 23 H 76 V 18 Z" 
            fill="url(#plusGrad)" 
            stroke="url(#plusGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
 
        {/* --- RIGHT SIDE: TYPOGRAPHY (STARTING AT X=115) --- */}
        {/* Company Name: AARVIK with geometric cuts and ultra premium, thick bold letter rendering */}
        <text 
          x="115" 
          y="48" 
          fill="currentColor" 
          className="text-slate-900 dark:text-white"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ 
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif', 
            fontSize: '32px', 
            fontWeight: 950, 
            letterSpacing: '0.06em',
            textAnchor: 'start'
          }}
        >
          AARVIK
        </text>
 
        {/* Divider lines and "HEALTH LABS" - thicker lines */}
        {/* Left Decorative Line */}
        <line x1="115" y1="64" x2="145" y2="64" stroke="#ff4d80" strokeWidth="2.5" />
        
        {/* "HEALTH LABS" label */}
        <text 
          x="152" 
          y="68" 
          fill="#ff4d80" 
          stroke="#ff4d80"
          strokeWidth="0.5"
          style={{ 
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif', 
            fontSize: '11px', 
            fontWeight: 950, 
            letterSpacing: '0.24em',
            textAnchor: 'start'
          }}
        >
          HEALTHLABS
        </text>
        
        {/* Right Decorative Line */}
        <line x1="258" y1="64" x2="330" y2="64" stroke="#ff4d80" strokeWidth="2.5" />

        {/* Subtitle slogan: "SCIENCE. HEALTH. FUTURE." */}
        <text 
          x="115" 
          y="84" 
          fill="#64748b" 
          style={{ 
            fontFamily: 'JetBrains Mono, SFMono-Regular, monospace', 
            fontSize: '6.5px', 
            fontWeight: 800, 
            letterSpacing: '0.19em',
            textAnchor: 'start'
          }}
        >
          SCIENCE. HEALTH. FUTURE.
        </text>
      </svg>
    );
  }

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`select-none ${className}`} 
      style={{ minWidth: '32px', minHeight: '32px', display: 'inline-block', ...style }}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic Blue-to-Cyan Gradient for the A-frame */}
        <linearGradient id="aFrameGradStandalone" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Vivid Royal Blue */}
          <stop offset="50%" stopColor="#0ea5e9" /> {/* Vibrant Sky Blue */}
          <stop offset="100%" stopColor="#0f172a" /> {/* Deep luxurious Navy */}
        </linearGradient>

        {/* Liquid Gradient inside the test tube */}
        <linearGradient id="liquidGradStandalone" x1="50" y1="26" x2="50" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Vibrant Emerald-to-Teal Gradient for the organic swoosh */}
        <linearGradient id="swooshGradStandalone" x1="15" y1="70" x2="85" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" /> {/* Mint Emerald */}
          <stop offset="50%" stopColor="#059669" /> {/* Deep Emerald */}
          <stop offset="100%" stopColor="#14b6a2" /> {/* Light Teal */}
        </linearGradient>

        {/* Floating Blue/Cyan Gradient for the Medical Plus */}
        <linearGradient id="plusGradStandalone" x1="68" y1="18" x2="84" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" /> {/* Extra bright sky blue */}
          <stop offset="100%" stopColor="#2563eb" /> {/* Vivid blue */}
        </linearGradient>

        {/* Glow filter for depth - made significantly thicker and brighter with blue/cyan glows */}
        <filter id="glowFilterStandalone" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0ea5e9" floodOpacity="0.45" />
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#3b82f6" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#glowFilterStandalone)">
        {/* Stylized Modern "A" Left Leg of the logo */}
        <path 
          d="M 45 22 L 22 78 Q 21.5 80 23.5 80 L 32.5 80 Q 34 80 34.5 78.5 L 45.2 51 Z" 
          fill="url(#aFrameGradStandalone)" 
          stroke="url(#aFrameGradStandalone)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Stylized Modern "A" Right Leg of the logo */}
        <path 
          d="M 54.8 45.3 L 67.5 78.5 Q 68 80 70 80 L 78.5 80 Q 80.5 80 79.5 78.5 L 63.5 40 Z" 
          fill="url(#aFrameGradStandalone)" 
          stroke="url(#aFrameGradStandalone)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Central diagnostic test tube */}
        <rect x="47" y="15" width="12" height="2.5" rx="1.25" fill="#38bdf8" />
        <path 
          d="M 48.5 17.5 H 57.5 V 42 C 57.5 46.5 48.5 46.5 48.5 42 V 17.5 Z" 
          fill="rgba(56, 189, 248, 0.12)" 
          stroke="#0ea5e9" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
        <path 
          d="M 49.5 27 C 51 26 55 28 56.5 27 V 41.5 C 56.5 44 49.5 44 49.5 41.5 V 27 Z" 
          fill="url(#liquidGradStandalone)" 
        />
        
        {/* Active bubbling details */}
        <circle cx="51.5" cy="31" r="1.25" fill="#ffffff" opacity="0.95" />
        <circle cx="54.5" cy="34" r="1" fill="#ffffff" opacity="0.95" />
        <circle cx="52.2" cy="37" r="1.1" fill="#ffffff" opacity="0.85" />

        {/* Green/Teal organic swoosh curve that cuts across 'A' leg */}
        <path 
          d="M 18 64 C 28 64 45 52 64 48 C 74 46 82 40 85 32 C 80 44 65 52 48 56 C 30 60 22 64 18 64 Z" 
          fill="url(#swooshGradStandalone)" 
          stroke="url(#swooshGradStandalone)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Floating Bright Medical Plus sign */}
        <path 
          d="M 76 18 H 81 V 23 H 86 V 28 H 81 V 33 H 76 V 28 H 71 V 23 H 76 V 18 Z" 
          fill="url(#plusGradStandalone)" 
          stroke="url(#plusGradStandalone)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
