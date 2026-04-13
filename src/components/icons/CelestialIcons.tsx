'use client';

import React, { useId } from 'react';

export interface CelestialIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

function uid(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, '');
}

// ── Moon ──────────────────────────────────────────────────────────────────────
export function MoonIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ filter: 'drop-shadow(0 0 6px rgba(232,224,208,0.3))', overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .mg${id}{animation:mgp${id} 4s ease-in-out infinite}
          @keyframes mgp${id}{0%,100%{filter:drop-shadow(0 0 6px rgba(232,224,208,0.3))}50%{filter:drop-shadow(0 0 14px rgba(232,224,208,0.65))}}
        `}</style>
      )}
      <defs>
        <radialGradient id={`mrg${id}`} cx="68%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#EEE8D8"/>
          <stop offset="55%" stopColor="#CEC6B4"/>
          <stop offset="100%" stopColor="#A0988A"/>
        </radialGradient>
        <mask id={`mm${id}`}>
          <rect width="48" height="48" fill="white"/>
          <circle cx="15" cy="21" r="17.5" fill="black"/>
        </mask>
      </defs>
      <circle cx="24" cy="24" r="20" fill={`url(#mrg${id})`} mask={`url(#mm${id})`}
        className={animate ? `mg${id}` : ''}/>
      {/* craters */}
      <circle cx="33" cy="17" r="2.2" fill="rgba(0,0,0,0.07)" mask={`url(#mm${id})`}/>
      <circle cx="38" cy="27" r="1.5" fill="rgba(0,0,0,0.06)" mask={`url(#mm${id})`}/>
      <circle cx="31" cy="31" r="1.3" fill="rgba(0,0,0,0.05)" mask={`url(#mm${id})`}/>
      <circle cx="36" cy="21" r="1"   fill="rgba(0,0,0,0.06)" mask={`url(#mm${id})`}/>
    </svg>
  );
}

// ── Jupiter ───────────────────────────────────────────────────────────────────
export function JupiterIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ filter: 'drop-shadow(0 0 8px rgba(224,174,111,0.25))', overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .jb${id}{animation:jba${id} 60s ease-in-out infinite alternate;transform-origin:24px 24px}
          @keyframes jba${id}{0%{transform:rotate(0deg)}100%{transform:rotate(2.5deg)}}
        `}</style>
      )}
      <defs>
        <linearGradient id={`jlg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#E0AE6F"/>
          <stop offset="18%"  stopColor="#C48050"/>
          <stop offset="36%"  stopColor="#E8C088"/>
          <stop offset="52%"  stopColor="#D4915A"/>
          <stop offset="68%"  stopColor="#E0B870"/>
          <stop offset="84%"  stopColor="#C07845"/>
          <stop offset="100%" stopColor="#D8A460"/>
        </linearGradient>
        <clipPath id={`jcp${id}`}><circle cx="24" cy="24" r="20"/></clipPath>
      </defs>
      <circle cx="24" cy="24" r="20" fill={`url(#jlg${id})`} className={animate ? `jb${id}` : ''}/>
      {/* Great Red Spot */}
      <ellipse cx="29" cy="29" rx="4" ry="2.5" fill="#C45A3A" opacity="0.65"
        clipPath={`url(#jcp${id})`} className={animate ? `jb${id}` : ''}/>
    </svg>
  );
}

// ── Saturn ────────────────────────────────────────────────────────────────────
export function SaturnIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ filter: 'drop-shadow(0 0 6px rgba(234,214,184,0.2))', overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .sr${id}{animation:srp${id} 3s ease-in-out infinite}
          @keyframes srp${id}{0%,100%{opacity:.55}50%{opacity:.75}}
        `}</style>
      )}
      <defs>
        <radialGradient id={`srg${id}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#F0E0C0"/>
          <stop offset="100%" stopColor="#C8A870"/>
        </radialGradient>
        <clipPath id={`srb${id}`}><rect x="0" y="0" width="48" height="24"/></clipPath>
        <clipPath id={`srf${id}`}><rect x="0" y="24" width="48" height="24"/></clipPath>
      </defs>
      {/* Ring back half */}
      <ellipse cx="24" cy="26" rx="26" ry="7" stroke="#C8B090" strokeWidth="2.5" fill="none"
        opacity="0.55" clipPath={`url(#srb${id})`} transform="rotate(-8,24,26)"
        className={animate ? `sr${id}` : ''}/>
      {/* Planet */}
      <circle cx="24" cy="24" r="16" fill={`url(#srg${id})`}/>
      {/* Ring front half */}
      <ellipse cx="24" cy="26" rx="26" ry="7" stroke="#C8B090" strokeWidth="2.5" fill="none"
        opacity="0.55" clipPath={`url(#srf${id})`} transform="rotate(-8,24,26)"
        className={animate ? `sr${id}` : ''}/>
    </svg>
  );
}

// ── Orion Nebula ──────────────────────────────────────────────────────────────
export function OrionNebulaIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .oc${id}{animation:ocd${id} 5s ease-in-out infinite alternate}
          @keyframes ocd${id}{from{transform:translateX(0)}to{transform:translateX(1px)}}
        `}</style>
      )}
      <defs>
        <filter id={`of${id}`}><feGaussianBlur stdDeviation="2.8"/></filter>
        <radialGradient id={`oc${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#FF6B9D" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`op${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`ob${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g filter={`url(#of${id})`} className={animate ? `oc${id}` : ''}>
        <circle cx="23" cy="22" r="15" fill={`url(#oc${id})`}/>
        <circle cx="30" cy="27" r="12" fill={`url(#op${id})`}/>
        <circle cx="16" cy="28" r="11" fill={`url(#ob${id})`}/>
      </g>
      {/* Stars */}
      <circle cx="24" cy="20" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="28" cy="25" r="0.9" fill="white" opacity="0.85"/>
      <circle cx="20" cy="27" r="0.8" fill="white" opacity="0.8"/>
      <circle cx="27" cy="31" r="0.7" fill="white" opacity="0.7"/>
      <circle cx="21" cy="16" r="0.6" fill="white" opacity="0.75"/>
      <circle cx="32" cy="21" r="0.6" fill="white" opacity="0.65"/>
    </svg>
  );
}

// ── Pleiades ──────────────────────────────────────────────────────────────────
export function PleiadesIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  const stars = [
    { cx: 24, cy: 13, r: 3.2 },
    { cx: 32, cy: 18, r: 2.8 },
    { cx: 17, cy: 20, r: 2.4 },
    { cx: 28, cy: 27, r: 2.0 },
    { cx: 21, cy: 31, r: 1.8 },
    { cx: 35, cy: 29, r: 1.6 },
    { cx: 14, cy: 29, r: 1.6 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ filter: 'drop-shadow(0 0 4px rgba(147,197,253,0.5))', overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          ${stars.map((_, i) => `.ps${id}${i}{animation:pt${id} ${(2 + i * 0.4).toFixed(1)}s ease-in-out infinite;animation-delay:${(i * 0.3).toFixed(1)}s}`).join('')}
          @keyframes pt${id}{0%,100%{opacity:.7}50%{opacity:1}}
        `}</style>
      )}
      <circle cx="24" cy="22" r="18" fill="rgba(147,197,253,0.04)"/>
      <line x1="24" y1="13" x2="32" y2="18" stroke="rgba(147,197,253,0.12)" strokeWidth="0.5"/>
      <line x1="32" y1="18" x2="28" y2="27" stroke="rgba(147,197,253,0.10)" strokeWidth="0.5"/>
      <line x1="24" y1="13" x2="17" y2="20" stroke="rgba(147,197,253,0.10)" strokeWidth="0.5"/>
      <line x1="17" y1="20" x2="21" y2="31" stroke="rgba(147,197,253,0.08)" strokeWidth="0.5"/>
      {stars.map(({ cx, cy, r }, i) => {
        const si = r * 0.36;
        return (
          <path key={i}
            className={animate ? `ps${id}${i}` : ''}
            d={`M${cx},${cy - r} L${cx + si},${cy - si} L${cx + r},${cy} L${cx + si},${cy + si} L${cx},${cy + r} L${cx - si},${cy + si} L${cx - r},${cy} L${cx - si},${cy - si}Z`}
            fill="#E8E8FF"/>
        );
      })}
    </svg>
  );
}

// ── Andromeda Galaxy ──────────────────────────────────────────────────────────
export function AndromedaIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ filter: 'drop-shadow(0 0 8px rgba(255,248,231,0.15))', overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .ag${id}{animation:agr${id} 8s ease-in-out infinite alternate;transform-origin:24px 24px}
          @keyframes agr${id}{from{transform:rotate(-40deg)}to{transform:rotate(-39deg)}}
        `}</style>
      )}
      <defs>
        <radialGradient id={`ag${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF8E7" stopOpacity="1"/>
          <stop offset="28%"  stopColor="#E8D8B0" stopOpacity="0.85"/>
          <stop offset="65%"  stopColor="#B8A88F" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#B8A88F" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g transform="rotate(-40,24,24)" className={animate ? `ag${id}` : ''}>
        <ellipse cx="24" cy="24" rx="22" ry="5.5" fill={`url(#ag${id})`}/>
        <ellipse cx="24" cy="24" rx="18" ry="4" stroke="rgba(255,248,231,0.12)" strokeWidth="0.8" fill="none"/>
        <ellipse cx="24" cy="24" rx="13" ry="2.8" stroke="rgba(255,248,231,0.09)" strokeWidth="0.5" fill="none"/>
      </g>
      <circle cx="24" cy="24" r="2.8" fill="#FFF8E7" opacity="0.95"/>
      <circle cx="24" cy="24" r="1.3" fill="white"/>
    </svg>
  );
}

// ── Crab Nebula ───────────────────────────────────────────────────────────────
export function CrabNebulaIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  const fils = [
    { d: 'M24,24 L27,9',  c: '#38BDF8', o: 0.65 },
    { d: 'M24,24 L37,15', c: '#EF4444', o: 0.60 },
    { d: 'M24,24 L39,27', c: '#F97316', o: 0.55 },
    { d: 'M24,24 L34,37', c: '#38BDF8', o: 0.60 },
    { d: 'M24,24 L19,39', c: '#EF4444', o: 0.65 },
    { d: 'M24,24 L9,34',  c: '#F97316', o: 0.55 },
    { d: 'M24,24 L9,19',  c: '#38BDF8', o: 0.60 },
    { d: 'M24,24 L15,9',  c: '#EF4444', o: 0.50 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .cf${id}{animation:cfp${id} 2s ease-in-out infinite;transform-origin:24px 24px}
          @keyframes cfp${id}{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
        `}</style>
      )}
      <defs>
        <filter id={`cff${id}`}><feGaussianBlur stdDeviation="0.8"/></filter>
      </defs>
      <g filter={`url(#cff${id})`} className={animate ? `cf${id}` : ''}>
        {fils.map((f, i) => (
          <path key={i} d={f.d} stroke={f.c} strokeWidth="2.5" opacity={f.o} strokeLinecap="round"/>
        ))}
      </g>
      <circle cx="24" cy="24" r="2.8" fill="#A5F3FC"
        style={{ filter: 'drop-shadow(0 0 5px rgba(165,243,252,0.9))' }}/>
      <circle cx="24" cy="24" r="1.2" fill="white"/>
    </svg>
  );
}

// ── Night Sky ─────────────────────────────────────────────────────────────────
export function NightSkyIcon({ size = 48, className, animate: _animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ overflow: 'visible' }}>
      <style>{`@media(prefers-reduced-motion:no-preference){
        .nt${id}{animation:ntp${id} 2s ease-in-out infinite}
        @keyframes ntp${id}{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>
      <circle cx="24" cy="24" r="22" fill="#0F1D32" opacity="0.9"/>
      <defs>
        <mask id={`nm${id}`}>
          <rect width="48" height="48" fill="white"/>
          <circle cx="36" cy="11" r="6.5" fill="black"/>
        </mask>
      </defs>
      {/* Crescent */}
      <circle cx="33" cy="9" r="7.5" fill="#E8E0D0" mask={`url(#nm${id})`}/>
      {/* Stars */}
      <circle cx="12" cy="14" r="1.3" fill="white" opacity="0.85" className={`nt${id}`}/>
      <circle cx="20" cy="33" r="1.0" fill="white" opacity="0.70"/>
      <circle cx="10" cy="29" r="0.8" fill="white" opacity="0.60"/>
      <circle cx="35" cy="31" r="1.0" fill="white" opacity="0.65"/>
      <circle cx="16" cy="22" r="0.7" fill="white" opacity="0.55"/>
    </svg>
  );
}

// ── Telescope (fallback) ──────────────────────────────────────────────────────
export function TelescopeIcon({ size = 48, className, animate }: CelestialIconProps) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      style={{ overflow: 'visible' }}>
      {animate && (
        <style>{`@media(prefers-reduced-motion:no-preference){
          .tf${id}{animation:tfp${id} 2s ease-in-out infinite}
          @keyframes tfp${id}{0%,100%{opacity:.6}50%{opacity:1}}
        `}</style>
      )}
      {/* Tube */}
      <line x1="9" y1="37" x2="38" y2="14" stroke="#38F0FF" strokeWidth="2" strokeLinecap="round"/>
      {/* Eyepiece */}
      <line x1="9" y1="34" x2="9" y2="40" stroke="#38F0FF" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Objective */}
      <line x1="37" y1="12" x2="40" y2="16" stroke="#38F0FF" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Tripod */}
      <line x1="21" y1="37" x2="16" y2="44" stroke="#38F0FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="21" y1="37" x2="25" y2="44" stroke="#38F0FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="21" y1="37" x2="21" y2="44" stroke="#38F0FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
      {/* Mount */}
      <circle cx="21" cy="37" r="2" stroke="#38F0FF" strokeWidth="1.5" fill="none"/>
      {/* Lens flare */}
      <path
        d="M38,13 L39.2,10.5 L40.5,13 L38,14.2Z M38,13 L35.5,11.8 L38,10.5 L40.5,11.8Z"
        fill="#38F0FF" opacity="0.7" className={animate ? `tf${id}` : ''}/>
    </svg>
  );
}

// ── Star Token (inline ✦ replacement) ─────────────────────────────────────────
export function StarTokenIcon({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 2px rgba(255,209,102,0.5))' }}>
      <path d="M6 1L7.1 4.9L11 6L7.1 7.1L6 11L4.9 7.1L1 6L4.9 4.9Z" fill="#FFD166"/>
    </svg>
  );
}

// ── Difficulty Dots ───────────────────────────────────────────────────────────
export function DifficultyDots({ level }: { level: 1 | 2 | 3 | 4 }) {
  const count = level <= 2 ? level : 3;
  const color =
    level === 4 ? 'rgba(239,68,68,0.85)'
    : level === 3 ? 'rgba(245,158,11,0.8)'
    : 'rgba(56,240,255,0.7)';
  const glow = level === 4 ? '0 0 4px rgba(239,68,68,0.6)' : 'none';
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          backgroundColor: color, boxShadow: glow, flexShrink: 0,
        }}/>
      ))}
    </div>
  );
}
