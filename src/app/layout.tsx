import type { Metadata } from 'next';
import './globals.css';
import { SolanaWalletProvider } from '@/components/providers/WalletProvider';
import { AppStateProvider } from '@/hooks/useAppState';
import Nav from '@/components/shared/Nav';
import StarField from '@/components/shared/StarField';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Proof of Observation — Astroman',
  description: 'Strava for astronomy on Solana. Verify your stargazing. Earn on-chain rewards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-void text-slate-200 min-h-screen font-sans flex flex-col">
        <SolanaWalletProvider>
          <AppStateProvider>
            <StarField />
            <Nav />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </AppStateProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
