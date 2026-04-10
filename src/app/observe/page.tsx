'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import ObserveFlow from '@/components/observe/ObserveFlow';

export default function ObservePage() {
  const router = useRouter();
  const { authenticated, login, user } = usePrivy();

  const walletAddress =
    (user?.linkedAccounts.find(
      (a): a is Extract<typeof a, { type: 'wallet' }> =>
        a.type === 'wallet' && 'chainType' in a && (a as { chainType?: string }).chainType === 'solana'
    )?.address) ?? null;

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="rounded-2xl p-8"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.05), rgba(15,31,61,0.5))', border: '1px solid rgba(20,184,166,0.1)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)' }}>
              <Camera size={26} className="text-[#14B8A6]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Observe</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Sign in to photograph the night sky and earn Stars rewards.
            </p>
            <button onClick={login}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#070B14' }}>
              Sign In to Start →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ObserveFlow onClose={() => router.push('/')} walletAddress={walletAddress} />;
}
