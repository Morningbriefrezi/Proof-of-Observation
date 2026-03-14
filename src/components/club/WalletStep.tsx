'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { saveEmailKeypair } from '@/lib/emailWallet';
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

function createWalletFromEmail(email: string) {
  const keypair = Keypair.generate();
  saveEmailKeypair(keypair, email);
  console.log('[Wallet] Created from email:', email, keypair.publicKey.toString());
  return keypair.publicKey.toString();
}

export default function WalletStep() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { state, setWallet } = useAppState();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [airdropStatus, setAirdropStatus] = useState<'idle' | 'funding' | 'funded' | 'failed'>('idle');
  const done = state.walletConnected;

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const hasPhantomExtension = typeof window !== 'undefined' && !!(window as { phantom?: { solana?: unknown } }).phantom?.solana;
  // Detect if we're already running inside Phantom's built-in browser
  const inPhantomBrowser = isMobile && hasPhantomExtension;

  const handlePhantomClick = () => {
    if (inPhantomBrowser || !isMobile) {
      // In Phantom browser or on desktop — use adapter modal directly
      setVisible(true);
    } else {
      // On mobile without Phantom — open page inside Phantom's browser
      // User will connect there and the flow continues in Phantom's browser
      const url = typeof window !== 'undefined' ? window.location.href : '';
      window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`;
    }
  };

  // If arriving in Phantom's browser, auto-open connect modal
  useEffect(() => {
    if (inPhantomBrowser && !state.walletConnected && !done) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [inPhantomBrowser]);

  useEffect(() => {
    if (connected && publicKey && !state.walletConnected) {
      console.log('[Wallet] Phantom connected:', publicKey.toBase58());
      setWallet(publicKey.toBase58());
      ensureDevnetSol(publicKey);
    }
  }, [connected, publicKey]);

  // Restore email wallet on mount
  useEffect(() => {
    if (!state.walletConnected) {
      const saved = localStorage.getItem('stellar_wallet_address');
      const savedEmail = localStorage.getItem('stellar_wallet_email');
      if (saved && savedEmail) setWallet(saved);
    }
  }, []);

  const handleEmailWallet = async () => {
    if (!email || !email.includes('@')) {
      setEmailError('Enter a valid email');
      return;
    }
    setEmailError('');
    const address = createWalletFromEmail(email);
    setWallet(address);
    setAirdropStatus('funding');
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const pk = new PublicKey(address);
      const balance = await connection.getBalance(pk);
      if (balance >= 50_000_000) {
        setAirdropStatus('funded');
        return;
      }
      const sig = await connection.requestAirdrop(pk, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, 'confirmed');
      console.log('[Wallet] Airdropped 1 SOL to email wallet');
      setAirdropStatus('funded');
    } catch {
      console.log('[Wallet] Airdrop rate limited');
      setAirdropStatus('failed');
    }
  };

  return (
    <Card glow={done ? 'emerald' : null} className={done ? 'animate-pulse-success' : ''}>
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 ${
          done ? 'bg-[#34d399] border-[#34d399] text-black' : 'border-[#FFD166] text-[#FFD166]'
        }`}>
          {done ? '✓' : '1'}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          {done ? (
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#34d399]">
                <CheckCircle2 size={15} />
                <span className="text-sm font-medium">Solana wallet connected</span>
              </div>
              <p className="font-hash text-xs text-[var(--text-secondary)] ml-5">
                {state.walletAddress.slice(0, 8)}...{state.walletAddress.slice(-8)}
              </p>
              {localStorage.getItem('stellar_wallet_email') && (
                <p className="text-xs text-[var(--text-dim)] ml-5">
                  Signed in as {localStorage.getItem('stellar_wallet_email')}
                </p>
              )}
              {airdropStatus === 'funding' && (
                <p className="text-xs text-[#38F0FF] ml-5 animate-pulse">Funding wallet with devnet SOL...</p>
              )}
              {airdropStatus === 'funded' && (
                <p className="text-xs text-[#34d399] ml-5">✓ 1 devnet SOL funded</p>
              )}
              {airdropStatus === 'failed' && (
                <div className="ml-5 mt-1 flex flex-col gap-1">
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
                className="text-xs text-[var(--text-dim)] hover:text-[#FFD166] ml-5 transition-colors"
              >
                View on Solana Explorer ↗
              </a>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {/* Phantom */}
              <div className="flex flex-col gap-1.5">
                <Button variant="solana" onClick={handlePhantomClick} className="w-full min-h-[44px]">
                  👻 {inPhantomBrowser ? 'Connect Phantom' : isMobile ? 'Continue in Phantom Browser' : 'Connect Phantom Wallet'}
                </Button>
                {isMobile && !inPhantomBrowser && (
                  <p className="text-slate-600 text-xs text-center">Opens this page inside Phantom&apos;s built-in browser. Camera works there.</p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[rgba(56, 240, 255, 0.12)]" />
                <span className="text-slate-600 text-xs">or</span>
                <div className="flex-1 h-px bg-[rgba(56, 240, 255, 0.12)]" />
              </div>

              {/* Email */}
              <div className="bg-[#0F1F3D] border border-[rgba(56, 240, 255, 0.12)] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[var(--text-secondary)]" />
                  <p className="text-[var(--text-primary)] text-sm font-medium">Continue with Email</p>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="your@email.com"
                  onKeyDown={e => e.key === 'Enter' && handleEmailWallet()}
                  className="w-full bg-[#070B14] border border-[rgba(56, 240, 255, 0.12)] rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-[#FFD166] min-h-[44px]"
                />
                {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
                <Button variant="brass" onClick={handleEmailWallet} className="w-full min-h-[44px]">
                  Create Wallet &amp; Sign In →
                </Button>
                <p className="text-slate-600 text-xs text-center">No wallet? No problem. We&apos;ll create one for you automatically.</p>
                <p className="text-slate-600 text-xs text-center">A real Solana keypair is generated and stored locally in your browser.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
