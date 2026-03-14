'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppState } from '@/hooks/useAppState';
import { mintMembership } from '@/lib/solana';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import MintAnimation from '@/components/shared/MintAnimation';

export default function MembershipStep() {
  const { state, setMembership } = useAppState();
  const wallet = useWallet();
  const unlocked = state.walletConnected;
  const done = state.membershipMinted;
  const [minting, setMinting] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const [method, setMethod] = useState<'memo' | 'simulated' | null>(null);
  const isEmailWallet = typeof window !== 'undefined' && !!localStorage.getItem('poo_wallet_email');

  const handleMint = async () => {
    setMinting(true);
    const result = await mintMembership(wallet);
    setMethod(result.method);
    setMintDone(true);
    setTimeout(() => {
      setMinting(false);
      setMintDone(false);
      setMembership(result.txId);
    }, 1200);
  };

  return (
    <>
      {minting && <MintAnimation done={mintDone} />}
      <Card glow={done ? 'brass' : null} className={!unlocked ? 'opacity-40 pointer-events-none' : ''}>
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            done ? 'bg-[#c9a84c] border-[#c9a84c] text-black' : 'border-[#c9a84c] text-[#c9a84c]'
          }`}>
            {done ? '✓' : '2'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Club Membership</h3>
            <p className="text-slate-400 text-sm mb-4">Mint your on-chain membership NFT</p>
            {isEmailWallet && !done && (
              <p className="text-amber-400 text-xs mb-3">📧 Email wallet — transaction will be simulated. Connect Phantom for real on-chain proof.</p>
            )}
            {done ? (
              <div className="bg-[#0f1a2e] border border-[#c9a84c]/40 rounded-lg p-4 flex items-center gap-4">
                <span className="text-3xl">🏛️</span>
                <div>
                  <p className="text-[#c9a84c] font-semibold">Astroman Club Member</p>
                  <p className="text-slate-400 text-xs">Founding Member</p>
                  <p className="font-mono text-xs text-slate-500 mt-1">
                    {state.membershipTx.slice(0, 8)}...{state.membershipTx.slice(-8)}
                  </p>
                  {method === 'memo' && (
                    <a href={`https://explorer.solana.com/tx/${state.membershipTx}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#34d399] hover:underline mt-1 block">
                      ✅ View on Solana Explorer ↗
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <Button variant="brass" onClick={handleMint} disabled={!unlocked} className="w-full sm:w-auto">
                Join Club ✦
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
