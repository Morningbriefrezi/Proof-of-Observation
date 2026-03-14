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
  const [pollinetIcon, setPollinetIcon] = useState('🟢');
  const [showLogout, setShowLogout] = useState(false);
  const clubDone = state.walletConnected && state.membershipMinted && !!state.telescope;
  const email = typeof window !== 'undefined' ? localStorage.getItem('poo_wallet_email') : null;

  const updatePollinet = useCallback(() => {
    const s = getPollinetStatus();
    setPollinetIcon(s.icon + (pendingCount > 0 ? ` ${pendingCount}⏳` : ''));
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
    { href: '/', label: 'Home', icon: <Home size={13} /> },
    { href: '/club', label: 'Club', icon: <Building2 size={13} /> },
    { href: '/sky', label: 'Sky', icon: <Sparkles size={13} />, locked: !clubDone },
    { href: '/nfts', label: 'NFTs', icon: <ImageIcon size={13} />, locked: !clubDone },
  ];

  const walletShort = state.walletAddress
    ? `${state.walletAddress.slice(0, 4)}...${state.walletAddress.slice(-4)}`
    : '';
  const walletLabel = email ? `✉️ ${email.split('@')[0]}` : `🟢 ${walletShort}`;

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-40">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">

        {/* Main row */}
        <div className="h-14 flex items-center justify-between gap-2">
          <Link href="/" className="flex-shrink-0" title="Astroman">
            <AstroLogo heightClass="h-7" />
          </Link>

          {/* Tabs */}
          <div className="flex items-center">
            {tabs.map(tab => (
              <div key={tab.href}>
                {tab.locked ? (
                  <span className="px-1.5 py-1 text-[var(--text-dim)] text-xs flex items-center gap-0.5 cursor-not-allowed">
                    <Lock size={10} />
                    <span className="hidden xs:inline">{tab.label}</span>
                  </span>
                ) : (
                  <Link
                    href={tab.href}
                    className={`px-2 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all duration-200 ${
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

          {/* Desktop wallet */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-[var(--text-dim)]">{pollinetIcon}</span>
            {state.walletConnected && (
              <div className="relative">
                <button
                  onClick={() => setShowLogout(v => !v)}
                  className="text-[#34d399] font-hash bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)] px-2 py-1 rounded-lg hover:bg-[rgba(52,211,153,0.15)] text-xs"
                >
                  {walletLabel}
                </button>
                {showLogout && (
                  <div className="absolute right-0 top-full mt-2 glass-card p-3 w-52 z-50">
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

        {/* Mobile second row — wallet only when connected */}
        {state.walletConnected && (
          <div className="flex sm:hidden items-center justify-between w-full pb-2 pt-0 border-t border-white/5">
            <span className="text-xs text-[var(--text-dim)]">{pollinetIcon}</span>
            <span className="text-xs text-[#34d399] font-hash">{walletShort}</span>
            <button onClick={handleLogout} className="text-xs text-[var(--text-dim)] hover:text-red-400 transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
