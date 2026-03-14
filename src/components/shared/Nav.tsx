'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import { getPollinetStatus } from '@/lib/pollinet';
import { useEffect, useState, useCallback } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const { state, pendingCount } = useAppState();
  const [pollinetLabel, setPollinetLabel] = useState('🟢 Online');
  const clubDone = state.walletConnected && state.membershipMinted && !!state.telescope;

  const updatePollinet = useCallback(() => {
    const s = getPollinetStatus();
    const pending = pendingCount > 0 ? ` · ${pendingCount} pending` : '';
    setPollinetLabel(`${s.icon} ${s.label}${pending}`);
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

  const tabs = [
    { href: '/', label: 'Home' },
    { href: '/club', label: '🏛️ Club' },
    { href: '/sky', label: '🌌 Sky', locked: !clubDone },
    { href: '/nfts', label: '🖼️ NFTs', locked: !clubDone },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#05080f]/90 backdrop-blur border-b border-[#1a2d4d]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl flex-shrink-0" title="Astroman Home">
          🔭
        </Link>

        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <div key={tab.href}>
              {tab.locked ? (
                <span className="px-2 py-1.5 text-slate-600 text-sm flex items-center gap-1 cursor-not-allowed">
                  🔒 <span className="hidden sm:inline">{tab.label}</span>
                </span>
              ) : (
                <Link
                  href={tab.href}
                  className={`px-2 sm:px-3 py-1.5 rounded text-sm transition-all duration-200 ${
                    pathname === tab.href
                      ? 'text-[#c9a84c] border-b-2 border-[#c9a84c]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs flex-shrink-0">
          <span className="text-slate-500 hidden md:inline" title="Pollinet status">{pollinetLabel}</span>
          <span className="text-slate-500 md:hidden">{pollinetLabel.split(' ')[0]}</span>
          {state.walletConnected && (
            <span className="text-[#34d399] font-mono bg-[#111c30] px-2 py-1 rounded">
              🟢 {state.walletAddress.slice(0, 4)}...{state.walletAddress.slice(-4)}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
