'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { useAppState } from '@/hooks/useAppState';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';

function createWalletFromEmail(email: string) {
  const keypair = Keypair.generate();
  localStorage.setItem('poo_wallet_email', email);
  localStorage.setItem('poo_wallet_address', keypair.publicKey.toString());
  console.log('[Wallet] Created from email:', email, keypair.publicKey.toString());
  return keypair.publicKey.toString();
}

export default function WalletStep() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { state, setWallet } = useAppState();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const done = state.walletConnected;

  useEffect(() => {
    if (connected && publicKey && !state.walletConnected) {
      console.log('[Wallet] Phantom connected:', publicKey.toBase58());
      setWallet(publicKey.toBase58());
    }
  }, [connected, publicKey]);

  // Restore email wallet on mount
  useEffect(() => {
    if (!state.walletConnected) {
      const saved = localStorage.getItem('poo_wallet_address');
      const savedEmail = localStorage.getItem('poo_wallet_email');
      if (saved && savedEmail) setWallet(saved);
    }
  }, []);

  const handleEmailWallet = () => {
    if (!email || !email.includes('@')) {
      setEmailError('Enter a valid email');
      return;
    }
    setEmailError('');
    const address = createWalletFromEmail(email);
    setWallet(address);
  };

  return (
    <Card glow={done ? 'emerald' : null}>
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 ${
          done ? 'bg-[#34d399] border-[#34d399] text-black' : 'border-[#c9a84c] text-[#c9a84c]'
        }`}>
          {done ? '✓' : '1'}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          {done ? (
            <p className="text-[#34d399] font-mono text-sm mt-1">
              {state.walletAddress.slice(0, 8)}...{state.walletAddress.slice(-8)}
              {localStorage.getItem('poo_wallet_email') && (
                <span className="text-slate-400 font-sans ml-2 text-xs">({localStorage.getItem('poo_wallet_email')})</span>
              )}
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {/* Phantom */}
              <Button variant="solana" onClick={() => setVisible(true)} className="w-full min-h-[44px]">
                👻 Connect Phantom Wallet
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#1a2d4d]" />
                <span className="text-slate-600 text-xs">or</span>
                <div className="flex-1 h-px bg-[#1a2d4d]" />
              </div>

              {/* Email */}
              <div className="bg-[#0f1a2e] border border-[#1a2d4d] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✉️</span>
                  <p className="text-slate-300 text-sm font-medium">Continue with Email</p>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="your@email.com"
                  onKeyDown={e => e.key === 'Enter' && handleEmailWallet()}
                  className="w-full bg-[#05080f] border border-[#1a2d4d] rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-[#c9a84c] min-h-[44px]"
                />
                {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
                <Button variant="brass" onClick={handleEmailWallet} className="w-full min-h-[44px]">
                  Create Wallet &amp; Sign In →
                </Button>
                <p className="text-slate-600 text-xs text-center">No wallet? No problem. We&apos;ll create one for you automatically.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
