'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CloudSun, Satellite, User, BookOpen, Home } from 'lucide-react';

const TABS = [
  { href: '/sky',      label: 'Sky',      icon: <CloudSun size={19} />, center: false },
  { href: '/missions', label: 'Missions', icon: <Satellite size={19} />, center: false },
  { href: '/',         label: 'Home',     icon: <Home size={22} />,      center: true  },
  { href: '/learn',    label: 'Learning', icon: <BookOpen size={19} />,  center: false },
  { href: '/profile',  label: 'Profile',  icon: <User size={19} />,      center: false },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes tabSlideIn {
          from { transform: translateX(-50%) scaleX(0); opacity: 0; }
          to   { transform: translateX(-50%) scaleX(1); opacity: 1; }
        }
        @keyframes homeGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(124,58,237,0.5), 0 0 36px rgba(56,240,255,0.2); }
          50%       { box-shadow: 0 0 28px rgba(124,58,237,0.75), 0 0 56px rgba(56,240,255,0.35); }
        }
        .btm-tab-indicator {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 28px; height: 2px;
          background: linear-gradient(90deg, #7c3aed, #38F0FF);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 0 10px rgba(56,240,255,0.8);
          animation: tabSlideIn 0.2s ease forwards;
        }
        .btm-tab { transition: all 0.18s ease; -webkit-tap-highlight-color: transparent; }
        .btm-tab:active { transform: scale(0.92); }
      `}</style>
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(5, 8, 18, 0.92)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderTop: '1px solid rgba(124,58,237,0.22)',
          boxShadow: '0 -1px 0 rgba(56,240,255,0.06), 0 -8px 40px rgba(0,0,0,0.7)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          willChange: 'transform',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.9) 20%, rgba(56,240,255,1) 50%, rgba(124,58,237,0.9) 80%, transparent 100%)' }} />

        <div className="flex items-stretch">
          {TABS.map(tab => {
            const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

            if (tab.center) {
              const handlePress = () => {
                if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                else router.push('/');
              };
              return (
                <button
                  key={tab.href}
                  onClick={handlePress}
                  className="btm-tab flex-1 flex flex-col items-center justify-end pb-2 relative"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                >
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%', marginTop: -20,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.4) 0%, rgba(56,240,255,0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(56,240,255,0.12) 100%)',
                    border: isActive ? '1.5px solid rgba(56,240,255,0.55)' : '1.5px solid rgba(124,58,237,0.35)',
                    animation: isActive ? 'homeGlow 2.5s ease-in-out infinite' : undefined,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isActive ? '#67e8f9' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: isActive ? '1px solid rgba(56,240,255,0.2)' : '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                    {tab.icon}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase', color: isActive ? '#67e8f9' : 'rgba(255,255,255,0.38)', textShadow: isActive ? '0 0 8px rgba(56,240,255,0.5)' : undefined }}>
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="btm-tab flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] relative"
                style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                {isActive && <div className="btm-tab-indicator" />}
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(56,240,255,0.18) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(56,240,255,0.28)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 14px rgba(56,240,255,0.18), inset 0 1px 0 rgba(255,255,255,0.06)' : undefined,
                  color: isActive ? '#67e8f9' : 'rgba(255,255,255,0.38)',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(56,240,255,0.5))' : undefined,
                  transition: 'all 0.18s ease',
                }}>
                  {tab.icon}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: isActive ? '#67e8f9' : 'rgba(255,255,255,0.38)', textShadow: isActive ? '0 0 8px rgba(56,240,255,0.5)' : undefined, transition: 'all 0.18s ease' }}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
