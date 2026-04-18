'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { usePrivy } from '@privy-io/react-auth';
import SearchModal from './SearchModal';

export default function Nav() {
  const { state } = useAppState();
  const { authenticated } = usePrivy();
  const [searchOpen, setSearchOpen] = useState(false);

  const stars =
    state.completedMissions.reduce((s, m) => s + m.stars, 0) +
    (state.completedQuizzes ?? []).reduce((s, q) => s + q.stars, 0);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-3.5 py-2.5"
      style={{
        background: [
          'radial-gradient(ellipse 240px 80px at 50% 100%, rgba(56,240,255,0.1) 0%, transparent 60%)',
          'radial-gradient(ellipse 220px 60px at 50% 0%, rgba(132,101,203,0.12) 0%, transparent 60%)',
          '#070B18',
        ].join(', '),
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <MicroStars />

      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* LEFT: Search */}
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 38,
            height: 38,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <Search size={16} color="rgba(255,255,255,0.75)" strokeWidth={2} />
        </button>

        {/* CENTER: Logo + wordmark */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <StellarLogo />
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 20,
              fontWeight: 700,
              color: '#F2F0EA',
              letterSpacing: '0.14em',
            }}
          >
            STELLAR
          </span>
        </Link>

        {/* RIGHT: Profile pill with stars */}
        <Link
          href={authenticated ? '/profile' : '/login'}
          className="flex items-center gap-1.5 transition-all active:scale-95"
          style={{
            padding: '6px 10px 6px 6px',
            background: 'rgba(132,101,203,0.1)',
            border: '1px solid rgba(132,101,203,0.3)',
            borderRadius: 999,
            textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(132,101,203,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(132,101,203,0.3)'; }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8465CB, #38F0FF)',
            }}
          >
            <User size={12} color="#0a0a0a" strokeWidth={2.5} />
            {authenticated && (
              <div
                className="stl-nav-glow-dot absolute"
                style={{
                  bottom: -1,
                  right: -1,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#34d399',
                  border: '1.5px solid #070B18',
                }}
              />
            )}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              color: '#C9B8F0',
              fontWeight: 600,
            }}
          >
            {stars} ✦
          </span>
        </Link>
      </div>

      {/* Cosmic accent line */}
      <div className="stl-cosmic-line absolute left-0 right-0 bottom-0" />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function StellarLogo() {
  return (
    <div style={{ position: 'relative', width: 26, height: 26 }}>
      <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="stl-logo-planet" cx="0.35" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#E8ECF4" />
            <stop offset="0.5" stopColor="#8BA5CE" />
            <stop offset="1" stopColor="#2E3A52" />
          </radialGradient>
        </defs>
        <ellipse cx="13" cy="13" rx="12" ry="3" fill="none" stroke="#FFD166" strokeWidth="1" opacity="0.85" transform="rotate(-20 13 13)" />
        <circle cx="13" cy="13" r="7" fill="url(#stl-logo-planet)" />
        <ellipse cx="13" cy="13" rx="12" ry="3" fill="none" stroke="#FFD166" strokeWidth="1" opacity="0.85" transform="rotate(-20 13 13)" strokeDasharray="9 60" strokeDashoffset="-16" />
        <path d="M 22 6 L 22.5 7.5 L 24 8 L 22.5 8.5 L 22 10 L 21.5 8.5 L 20 8 L 21.5 7.5 Z" fill="#38F0FF" opacity="0.85" />
      </svg>
    </div>
  );
}

function MicroStars() {
  const stars = [
    { top: 8,  left: '25%', size: 1,   delay: '0s',   color: '#fff' },
    { top: 38, left: '78%', size: 1,   delay: '1.6s', color: '#fff' },
    { top: 14, left: '65%', size: 1.5, delay: '2.8s', color: '#38F0FF' },
    { top: 22, left: '8%',  size: 1,   delay: '0.9s', color: '#fff' },
    { top: 42, left: '42%', size: 1,   delay: '2.2s', color: '#FFD166' },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="stl-tw absolute pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: s.color,
            borderRadius: '50%',
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );
}
