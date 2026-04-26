'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect, useRef } from 'react';
import {
  CloudSun, ShoppingBag, Satellite, User, Search, BookOpen,
  Trophy, Radio, MessageCircle, Telescope, Gem, TrendingUp,
} from 'lucide-react';
import AstroLogo from './AstroLogo';
import SearchModal from './SearchModal';

const SECTIONS = [
  {
    label: 'Explore',
    links: [
      { href: '/sky',         label: 'Sky Forecast',  desc: "Tonight's conditions",     icon: CloudSun },
      { href: '/markets',     label: 'Markets',        desc: 'Predict tonight\'s sky',   icon: TrendingUp },
      { href: '/missions',    label: 'Missions',       desc: 'Observe & earn Stars',     icon: Satellite },
      { href: '/learn',       label: 'Learning',       desc: 'Planets, quizzes & more',  icon: BookOpen },
      { href: '/network',     label: 'Network',        desc: 'Observer network + DePIN', icon: Radio },
      { href: '/chat',        label: 'ASTRA AI',       desc: 'Your space companion',     icon: MessageCircle },
    ],
  },
  {
    label: 'Community',
    links: [
      { href: '/leaderboard', label: 'Leaderboard',   desc: 'Top observers',            icon: Trophy },
      { href: '/nfts',        label: 'Discoveries',   desc: 'Your on-chain NFTs',       icon: Gem },
      { href: '/club',        label: 'My Telescope',  desc: 'Register your scope',      icon: Telescope },
    ],
  },
  {
    label: 'Shop',
    links: [
      { href: '/marketplace', label: 'Marketplace',   desc: 'Shop telescopes',          icon: ShoppingBag },
    ],
  },
];

const QUICK_TABS = [
  { href: '/sky',         label: 'Sky',       icon: CloudSun },
  { href: '/missions',    label: 'Missions',  icon: Satellite },
  { href: '/markets',     label: 'Markets',   icon: TrendingUp },
  { href: '/learn',       label: 'Learning',  icon: BookOpen },
  { href: '/marketplace', label: 'Shop',      icon: ShoppingBag },
  { href: '/profile',     label: 'Profile',   icon: User },
];

export default function Nav() {
  const pathname = usePathname();
  const { authenticated, ready, login } = usePrivy();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSearchOpen(false); setDropdownOpen(false); }, [pathname]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDropdownOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dropdownOpen]);

  return (
    <>
      <style>{`
        @keyframes fadeInBackdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-icon-btn { transition: color 0.15s ease, background 0.15s ease; }
        .nav-icon-btn:hover { background: rgba(255,255,255,0.07) !important; color: rgba(255,255,255,0.9) !important; }
        .nav-tab { position: relative; transition: all 0.18s ease; border-radius: 9999px; }
        .nav-tab:hover:not(.nav-tab-active) { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9) !important; }
        .nav-login-btn:hover { background: rgba(124,58,237,0.2) !important; border-color: rgba(124,58,237,0.6) !important; }
        .dd-link { transition: background 0.15s ease, transform 0.15s ease; }
        .dd-link:hover { background: rgba(99,102,241,0.07) !important; }
        .hamburger-hline { display: block; height: 1.5px; width: 18px; border-radius: 2px; background: #FFFFFF; transition: all 0.22s cubic-bezier(0.22,1,0.36,1); transform-origin: center; }
      `}</style>

      {/* Dropdown embedded with header */}
      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            onClick={() => setDropdownOpen(false)}
          />
          <div
            className="fixed z-[56]"
            style={{
              top: 56,
              left: logoRef.current ? logoRef.current.getBoundingClientRect().left : 56,
              width: 196,
              animation: 'dropIn 0.15s cubic-bezier(0.22,1,0.36,1)',
              background: 'rgba(5,8,18,0.97)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTopColor: 'transparent',
              borderRadius: '0 0 12px 12px',
              boxShadow: '4px 8px 24px rgba(0,0,0,0.5)',
              padding: '8px 6px 10px',
            }}
          >
            {SECTIONS.map((section, si) => (
              <div key={section.label}>
                {si > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 2px' }} />}
                <p style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                  padding: '4px 8px 2px', margin: 0,
                }}>
                  {section.label}
                </p>
                {section.links.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className="dd-link flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                      style={{
                        textDecoration: 'none',
                        background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                      }}
                    >
                      <Icon size={13} style={{ color: isActive ? '#818cf8' : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                      <span style={{
                        fontSize: 12.5, fontWeight: 600,
                        color: isActive ? '#818cf8' : 'rgba(255,255,255,0.8)',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(5, 8, 18, 0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-3">
          <div className="h-14 flex items-center gap-2">

            {/* Hamburger — three vertical white lines */}
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="nav-icon-btn w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label={dropdownOpen ? 'Close navigation' : 'Open navigation'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center', width: 18 }}>
                <span className="hamburger-hline" style={{
                  opacity: dropdownOpen ? 1 : 1,
                  transform: dropdownOpen ? 'translateY(5.5px) rotate(45deg)' : 'none',
                }} />
                <span className="hamburger-hline" style={{
                  opacity: dropdownOpen ? 0 : 0.85,
                }} />
                <span className="hamburger-hline" style={{
                  transform: dropdownOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
                }} />
              </div>
            </button>

            {/* Logo — mobile: absolutely centered; sm+: in flow */}
            <div className="sm:hidden absolute left-0 right-0 flex justify-center pointer-events-none">
              <Link href="/" className="pointer-events-auto" title="Stellar">
                <div style={{ filter: 'drop-shadow(0 0 18px rgba(99,102,241,0.6)) drop-shadow(0 0 36px rgba(99,102,241,0.25))' }}>
                  <AstroLogo heightClass="h-8" size={30} />
                </div>
              </Link>
            </div>
            <div ref={logoRef} className="hidden sm:flex items-center flex-shrink-0">
              <Link href="/" title="Stellar">
                <div style={{ filter: 'drop-shadow(0 0 18px rgba(99,102,241,0.6)) drop-shadow(0 0 36px rgba(99,102,241,0.25))' }}>
                  <AstroLogo heightClass="h-8" size={30} />
                </div>
              </Link>
            </div>

            {/* Quick tabs — sm and up */}
            <div className="hidden sm:flex flex-1 items-center justify-center gap-1">
              {QUICK_TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`nav-tab px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${isActive ? 'nav-tab-active' : ''}`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(99,102,241,0.18) 100%)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: '#67e8f9',
                      textDecoration: 'none',
                      boxShadow: '0 0 16px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                      textShadow: '0 0 10px rgba(99,102,241,0.5)',
                    } : {
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid transparent',
                      textDecoration: 'none',
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right cluster: search + login (Profile lives in the middle tabs) */}
            <div className="ml-auto flex items-center gap-1 flex-shrink-0 z-10">
              <button
                onClick={() => setSearchOpen(true)}
                className="nav-icon-btn w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.18s ease',
                }}
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.9} />
              </button>
              {!ready ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : !authenticated ? (
                <button
                  onClick={() => login()}
                  className="nav-login-btn"
                  style={{
                    height: 34, borderRadius: 9999, cursor: 'pointer',
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.5)',
                    color: '#c4b5fd',
                    padding: '0 16px',
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.04em',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Log In
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </nav>
    </>
  );
}
