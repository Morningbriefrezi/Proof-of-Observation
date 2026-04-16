'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

export default function SkyAstraCta() {
  const { authenticated } = usePrivy();

  return (
    <Link
      href={authenticated ? '/chat' : '/missions'}
      className="flex items-center gap-3 px-5 py-4 rounded-2xl transition-all hover:border-[#38F0FF]/30"
      style={{
        background: 'linear-gradient(135deg, rgba(56,240,255,0.06), rgba(26,143,160,0.03))',
        border: '1px solid rgba(56,240,255,0.12)',
      }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(56,240,255,0.1)', border: '1px solid rgba(56,240,255,0.2)' }}>
        <span style={{ color: '#38F0FF' }}>✦</span>
      </div>
      <div>
        <p className="text-white text-sm font-semibold">Not sure what to observe?</p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {authenticated ? 'Ask ASTRA for a personalized recommendation →' : 'Explore tonight\'s missions →'}
        </p>
      </div>
    </Link>
  );
}
