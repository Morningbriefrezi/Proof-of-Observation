'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import type { ReactNode } from 'react';
import { useUserSync } from '@/hooks/useUserSync';

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
}

function UserSyncWrapper({ children }: { children: ReactNode }) {
  useUserSync();
  return <>{children}</>;
}

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!.trim();

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'sms', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#34d399',
          logo: '/logo.png',
          loginMessage: 'Sign in to Stellar',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          ethereum: { createOnLogin: 'off' },
          solana: { createOnLogin: 'users-without-wallets' },
        },
      }}
    >
      <UserSyncWrapper>{children}</UserSyncWrapper>
    </PrivyProvider>
  );
}
