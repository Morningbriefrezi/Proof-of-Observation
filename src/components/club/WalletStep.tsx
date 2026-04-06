'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';

async function ensureDevnetSol(publicKey: PublicKey) {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const balance = await connection.getBalance(publicKey);
    if (balance < 50_000_000) {
      console.log('[Airdrop] Requesting devnet SOL...');
      const sig = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig);
      console.log('[Airdrop] ✅ 1 SOL airdropped');
    }
  } catch {
    console.log('[Airdrop] Rate limited — user may need faucet.solana.com');
  }
}

export default function WalletStep() {
  const { login, authenticated, ready, user } = usePrivy();
  const { state, setWallet } = useAppState();

  // Find the Solana embedded wallet from the user's linked accounts
  const solanaWallet = user?.linkedAccounts.find(
    (a): a is Extract<typeof a, { type: 'wallet' }> =>
      a.type === 'wallet' && 'chainType' in a && (a as { chainType?: string }).chainType === 'solana'
  );
  const walletAddress = solanaWallet?.address ?? null;
  const [airdropStatus, setAirdropStatus] = useState<'idle' | 'funding' | 'funded' | 'failed'>('idle');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const done = state.walletConnected;

  // When Privy auth completes and the embedded Solana wallet is available, sync into AppState
  useEffect(() => {
    if (authenticated && walletAddress && !state.walletConnected) {
      console.log('[Privy] Wallet ready:', walletAddress);
      setWallet(walletAddress);
      setAirdropStatus('funding');
      ensureDevnetSol(new PublicKey(walletAddress))
        .then(() => setAirdropStatus('funded'))
        .catch(() => setAirdropStatus('failed'));
    }
  }, [authenticated, walletAddress, state.walletConnected]);

  // Fetch balance once connected
  useEffect(() => {
    if (done && state.walletAddress) {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      connection.getBalance(new PublicKey(state.walletAddress))
        .then(bal => setWalletBalance(bal))
        .catch(() => setWalletBalance(0));
    }
  }, [done, state.walletAddress]);

  // Show loading state while Privy SDK initialises
  if (!ready) {
    return (
      <Card glow={null} className="">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFD166] flex items-center justify-center text-sm font-bold text-[#FFD166]">
            1
          </div>
          <p className="text-slate-500 text-sm animate-pulse">Loading…</p>
        </div>
      </Card>
    );
  }

  return (
    <Card glow={done ? 'emerald' : null} className={done ? 'animate-pulse-success' : ''}>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          done ? 'bg-[#34d399] border-[#34d399] text-black' : 'border-[#FFD166] text-[#FFD166]'
        }`}>
          {done ? '✓' : '1'}
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          {done ? (
            <div className="mt-2 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 text-[#34d399]">
                <CheckCircle2 size={15} />
                <span className="text-sm font-medium">Solana wallet connected</span>
              </div>
              <p className="font-hash text-xs text-[var(--text-secondary)]">
                {state.walletAddress.slice(0, 8)}...{state.walletAddress.slice(-8)}
              </p>
              {airdropStatus === 'funding' && (
                <p className="text-xs text-[#38F0FF] animate-pulse">Activating wallet on Solana devnet…</p>
              )}
              {airdropStatus === 'funded' && (
                <p className="text-xs text-[#34d399]">✓ Wallet activated — 1 devnet SOL funded</p>
              )}
              {walletBalance === 0 && airdropStatus === 'idle' && (
                <div className="mt-2 w-full rounded-xl p-3 text-left flex flex-col gap-2"
                  style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />
                    <p className="text-amber-400 text-xs font-semibold">Wallet registered — needs activation</p>
                  </div>
                  <p className="text-slate-500 text-xs">Your Solana wallet was created. To submit on-chain proofs, top it up with free devnet SOL.</p>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-slate-400 font-mono bg-[#070B14] px-2 py-1 rounded truncate flex-1"
                      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                      {state.walletAddress}
                    </code>
                    <button onClick={() => navigator.clipboard.writeText(state.walletAddress)}
                      className="text-[10px] text-[#38F0FF] hover:underline whitespace-nowrap flex-shrink-0">Copy</button>
                  </div>
                  <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors text-center">
                    Get free devnet SOL at faucet.solana.com ↗
                  </a>
                </div>
              )}
              {airdropStatus === 'failed' && (
                <div className="mt-1 flex flex-col items-center gap-1">
                  <p className="text-xs text-amber-400">⚠ Airdrop rate limited — fund manually:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-slate-400 font-mono bg-[#070B14] px-2 py-1 rounded truncate max-w-[180px]">
                      {state.walletAddress}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(state.walletAddress)}
                      className="text-[10px] text-[#38F0FF] hover:underline whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                  <a
                    href="https://faucet.solana.com"
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Get devnet SOL at faucet.solana.com ↗
                  </a>
                </div>
              )}
              <a
                href={`https://explorer.solana.com/address/${state.walletAddress}?cluster=devnet`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-[var(--text-dim)] hover:text-[#FFD166] transition-colors"
              >
                View on Solana Explorer ↗
              </a>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {/* Email / social — primary */}
              <div className="bg-[#0F1F3D] rounded-xl p-4 flex flex-col gap-3" style={{ border: '1px solid rgba(255,209,102,0.2)' }}>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#FFD166]" />
                    <p className="text-white text-sm font-semibold">Continue with Email</p>
                  </div>
                  <p className="text-slate-500 text-xs ml-6">We create a Solana wallet for you automatically. No app needed.</p>
                </div>
                <Button variant="brass" onClick={() => login()} className="w-full min-h-[44px]">
                  Continue with Email →
                </Button>
                <p className="text-slate-600 text-xs text-center">Also supports Google, SMS, and Phantom wallet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
