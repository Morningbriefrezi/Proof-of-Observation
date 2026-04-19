'use client';

import { useMemo } from 'react';
import { useWallets } from '@privy-io/react-auth/solana';
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  getProgram,
  getReadOnlyProgram,
  type AnchorWalletLike,
  type StellarMarketsProgram,
} from './client';

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com';

let _connection: Connection | null = null;
function getConnection(): Connection {
  if (!_connection) _connection = new Connection(RPC_URL, 'confirmed');
  return _connection;
}

interface PrivySolanaWalletLike {
  address: string;
  signTransaction: (
    input: { transaction: Uint8Array; chain?: string },
  ) => Promise<{ signedTransaction: Uint8Array }>;
}

type SignableTx = Transaction | VersionedTransaction;

async function signOne<T extends SignableTx>(
  wallet: PrivySolanaWalletLike,
  tx: T,
): Promise<T> {
  const isVersioned = tx instanceof VersionedTransaction;
  const serialized = isVersioned
    ? (tx as VersionedTransaction).serialize()
    : (tx as Transaction).serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });
  const { signedTransaction } = await wallet.signTransaction({
    transaction: serialized as Uint8Array,
  });
  return (
    isVersioned
      ? VersionedTransaction.deserialize(signedTransaction)
      : Transaction.from(signedTransaction)
  ) as T;
}

export function usePrivyAnchorWallet(): AnchorWalletLike | null {
  const { wallets, ready } = useWallets();
  return useMemo(() => {
    if (!ready) return null;
    const wallet = wallets[0] as unknown as PrivySolanaWalletLike | undefined;
    if (!wallet?.address) return null;

    const publicKey = new PublicKey(wallet.address);

    return {
      publicKey,
      async signTransaction<T extends Transaction>(tx: T): Promise<T> {
        return signOne(wallet, tx as unknown as SignableTx) as unknown as T;
      },
      async signAllTransactions<T extends Transaction>(txs: T[]): Promise<T[]> {
        const out: T[] = [];
        for (const tx of txs) {
          out.push(
            (await signOne(wallet, tx as unknown as SignableTx)) as unknown as T,
          );
        }
        return out;
      },
    };
  }, [wallets, ready]);
}

export function useProgramWithPrivy(): StellarMarketsProgram | null {
  const wallet = usePrivyAnchorWallet();
  return useMemo(() => {
    if (!wallet) return null;
    return getProgram(wallet, getConnection());
  }, [wallet]);
}

export function useReadOnlyProgram(): StellarMarketsProgram {
  return useMemo(() => getReadOnlyProgram(getConnection()), []);
}
