'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppState } from '@/hooks/useAppState';
import { getPollinetStatus } from '@/lib/pollinet';
import { useEffect, useState, useCallback } from 'react';
import { Lock, Building2, Sparkles, ImageIcon, Home } from 'lucide-react';
import AstroLogo from './AstroLogo';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect, connected } = useWallet();
  const { state, pendingCount, reset } = useAppState();
  const [pollinetLabel, setPollinetLabel] = useState('🟢');
  const [showLogout, setShowLogout] = useState(false);
  const clubDone = state.walletConnected && state.membershipMinted && !!state.telescope;
  const email = typeof window !== 'undefined' ? localStorage.getItem('poo_wallet_email') : null;

  const updatePollinet = useCallback(() => {
    const s = getPollinetStatus();
    const pending = pendingCount > 0 ? ` · ${pendingCount}⏳` : '';
    setPollinetLabel(`${s.icon}${pending}`);
  }, [pendingCount]);

  useEffect(() => {
    updatePollinet();
    window.addEventListener('online', updatePollinet);
    window.addEventListener('offline', updatePollinet);
    return () => {
      window.removeEventListener('online', updatePollinet);
      window.removeEventListener('offline', updatePollinet);
    };
  }, [updatePollinet]);

  const handleLogout = async () => {
    if (!confirm('Log out and clear all data?')) return;
    if (connected) await disconnect();
    localStorage.removeItem('poo_wallet_email');
    localStorage.removeItem('poo_wallet_address');
    reset();
    router.push('/');
    setShowLogout(false);
  };

  const tabs = [
    { href: '/', label: 'Home', icon: <Home size={14} /> },
    { href: '/club', label: 'Club', icon: <Building2 size={14} /> },
    { href: '/sky', label: 'Sky', icon: <Sparkles size={14} />, locked: !clubDone },
    { href: '/nfts', label: 'NFTs', icon: <ImageIcon size={14} />, locked: !clubDone },
  ];

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex-shrink-0" title="Astroman">
          <AstroLogo className="h-8 w-8" />
        </Link>

        <div className="flex items-center gap-0.5">
          {tabs.map(tab => (
            <div key={tab.href}>
              {tab.locked ? (
                <span className="px-2 py-1.5 text-[var(--text-dim)] text-xs flex items-center gap-1 cursor-not-allowed">
                  <Lock size={11} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              ) : (
                <Link
                  href={tab.href}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 ${
                    pathname === tab.href
                      ? 'text-[#c9a84c] bg-[rgba(201,168,76,0.1)] border-b-2 border-[#c9a84c]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs flex-shrink-0">
          <span className="text-[var(--text-dim)]">{pollinetLabel}</span>
          {state.walletConnected && (
            <div className="relative">
              <button
                onClick={() => setShowLogout(v => !v)}
                className="text-[#34d399] font-hash bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)] px-2 py-1 rounded-lg hover:bg-[rgba(52,211,153,0.15)] text-xs"
              >
                {email ? `✉️ ${email.split('@')[0]}` : `🟢 ${state.walletAddress.slice(0,4)}...${state.walletAddress.slice(-3)}`}
              </button>
              {showLogout && (
                <div className="absolute right-0 top-full mt-2 glass-card border border-[var(--border-glass)] rounded-xl p-3 w-52 z-50">
                  <p className="text-[var(--text-secondary)] text-xs mb-1 truncate font-hash">{state.walletAddress.slice(0,8)}...{state.walletAddress.slice(-6)}</p>
                  {email && <p className="text-[var(--text-dim)] text-xs mb-3">{email}</p>}
                  <button onClick={handleLogout} className="w-full text-left text-red-400 hover:text-red-300 text-xs py-1.5 px-2 rounded hover:bg-red-500/10 transition-all">
                    Sign out &amp; clear data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
