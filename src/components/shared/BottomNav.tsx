'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloudSun, LayoutGrid, TrendingUp, Home, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useDisplayProfile } from '@/hooks/useDisplayProfile';
import { avatarById } from '@/lib/avatars';

type Tab = { href: string; label: string; icon: LucideIcon | 'profile' };

const TABS: Tab[] = [
  { href: '/hub',      label: 'Hub',     icon: LayoutGrid },
  { href: '/sky',      label: 'Sky',     icon: CloudSun },
  { href: '/',         label: 'Home',    icon: Home },
  { href: '/markets',  label: 'Markets', icon: TrendingUp },
  { href: '/profile',  label: 'Profile', icon: 'profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { authenticated, initials, avatarId } = useDisplayProfile();
  const avatarDef = avatarId ? avatarById(avatarId) : null;
  const showAvatarIcon = avatarDef && avatarDef.id !== 'initial';

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: '#050812',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: 70,
          padding: '6px 4px 0',
        }}
      >
        {TABS.map(tab => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const isProfile = tab.icon === 'profile';
          const Icon = isProfile ? null : (tab.icon as LucideIcon);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 4,
                paddingTop: 6,
                textDecoration: 'none',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
              }}
            >
              {/* Active pill — filled tab background behind icon */}
              <div
                style={{
                  position: 'relative',
                  width: 44,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  background: isActive
                    ? 'radial-gradient(ellipse at 50% 55%, rgba(255, 209, 102,0.22) 0%, rgba(255, 209, 102,0.05) 55%, transparent 75%)'
                    : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: -6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 2,
                      borderRadius: 2,
                      background: 'var(--stl-gold)',
                      boxShadow: '0 0 10px rgba(255, 209, 102,0.8)',
                    }}
                  />
                )}
                {isProfile ? (
                  authenticated && showAvatarIcon && avatarDef ? (
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
                        border: isActive ? '1.5px solid rgba(255,209,102,0.6)' : '1.5px solid rgba(255,255,255,0.15)',
                        filter: isActive ? 'drop-shadow(0 0 6px rgba(255, 209, 102,0.45))' : 'none',
                        transition: 'border-color 0.2s ease, filter 0.2s ease',
                      }}
                    >
                      <avatarDef.Icon size={18} tint={avatarDef.tint} />
                    </span>
                  ) : authenticated && initials ? (
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
                        border: isActive ? '1.5px solid rgba(255,209,102,0.6)' : '1.5px solid rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        lineHeight: 1,
                        filter: isActive ? 'drop-shadow(0 0 6px rgba(255, 209, 102,0.45))' : 'none',
                        transition: 'border-color 0.2s ease, filter 0.2s ease',
                      }}
                    >
                      {initials}
                    </span>
                  ) : (
                    <User
                      size={22}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      color={isActive ? 'var(--stl-gold)' : 'rgba(255,255,255,0.42)'}
                      style={{
                        filter: isActive ? 'drop-shadow(0 0 6px rgba(255, 209, 102,0.45))' : 'none',
                        transition: 'color 0.2s ease, filter 0.2s ease',
                      }}
                    />
                  )
                ) : Icon ? (
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    color={isActive ? 'var(--stl-gold)' : 'rgba(255,255,255,0.42)'}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(255, 209, 102,0.45))' : 'none',
                      transition: 'color 0.2s ease, filter 0.2s ease',
                    }}
                  />
                ) : null}
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 10.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--stl-text-bright)' : 'rgba(255,255,255,0.42)',
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  transition: 'color 0.2s ease',
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
