'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ active: boolean }>;
}

const SkyIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#38F0FF' : 'rgba(255,255,255,0.55)'}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="16" r="4" />
    <circle cx="15" cy="11" r="5" />
    <line x1="15" y1="4" x2="15" y2="2" />
    <line x1="20" y1="11" x2="22" y2="11" />
    <line x1="20" y1="7" x2="21" y2="6" />
  </svg>
);

const MissionsIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#38F0FF' : 'rgba(255,255,255,0.55)'}
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
    <circle cx="12" cy="10" r="1" fill={active ? '#38F0FF' : 'transparent'} />
  </svg>
);

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#38F0FF' : 'rgba(255,255,255,0.55)'}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LearnIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#38F0FF' : 'rgba(255,255,255,0.55)'}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#38F0FF' : 'rgba(255,255,255,0.55)'}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ITEMS: NavItem[] = [
  { href: '/sky',      label: 'Sky',      icon: SkyIcon },
  { href: '/missions', label: 'Missions', icon: MissionsIcon },
  { href: '/',         label: 'Home',     icon: HomeIcon },
  { href: '/learn',    label: 'Learn',    icon: LearnIcon },
  { href: '/profile',  label: 'Profile',  icon: ProfileIcon },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed z-50"
      style={{
        bottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        left: 14,
        right: 14,
        pointerEvents: 'none',
      }}
    >
      <div
        className="relative flex items-center justify-around"
        style={{
          padding: '8px 6px',
          borderRadius: 22,
          background: 'rgba(8,12,26,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: [
            '0 12px 40px rgba(0,0,0,0.5)',
            '0 0 24px rgba(132,101,203,0.12)',
            'inset 0 1px 0 rgba(255,255,255,0.05)',
          ].join(', '),
          pointerEvents: 'auto',
        }}
      >
        <div
          className="absolute"
          style={{
            top: 0,
            left: '20%',
            right: '20%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(56,240,255,0.4), transparent)',
          }}
        />

        {ITEMS.map(item => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-[3px] transition-all active:scale-[0.92]"
              style={{
                flex: active ? 1.15 : 1,
                padding: '6px 4px',
                borderRadius: 14,
                background: active
                  ? 'linear-gradient(135deg, rgba(56,240,255,0.15), rgba(132,101,203,0.15))'
                  : 'transparent',
                border: active ? '1px solid rgba(56,240,255,0.25)' : '1px solid transparent',
                transition: 'all 240ms cubic-bezier(.2,.7,.2,1)',
                textDecoration: 'none',
              }}
            >
              <Icon active={active} />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 9.5,
                  color: active ? '#38F0FF' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {item.label}
              </span>

              {active && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#38F0FF',
                    boxShadow: '0 0 10px #38F0FF',
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
