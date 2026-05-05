'use client';

// Client-side helper for the prepare → sign → submit Stars burn flow.
//
// /api/stars/burn server-side builds a Transaction with the fee payer set
// as gas sponsor and partial-signs as fee payer. The user's wallet adds
// its own signature here, then we ship the fully-signed tx back for the
// server to broadcast and record.

import bs58 from 'bs58';
import { Transaction } from '@solana/web3.js';

interface PrivySolanaWallet {
  address: string;
  signTransaction: (
    input: { transaction: Uint8Array; chain?: string },
  ) => Promise<{ signedTransaction: Uint8Array }>;
}

export type BurnKind = 'discount-burn' | 'shop-purchase' | 'redeem-code';

interface PrepareResponse {
  tx?: string;
  blockhash?: string;
  signature?: string;
  burned?: number;
  cached?: boolean;
  error?: string;
}

interface SubmitResponse {
  signature?: string;
  burned?: number;
  cached?: boolean;
  error?: string;
}

function chainFromRpc(): string {
  const rpc =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL ??
    'https://api.devnet.solana.com';
  if (rpc.includes('devnet')) return 'solana:devnet';
  if (rpc.includes('testnet')) return 'solana:testnet';
  return 'solana:mainnet';
}

export async function executeBurn(args: {
  privyToken: string | null;
  wallet: PrivySolanaWallet;
  amount: number;
  kind: BurnKind;
  orderId?: string;
  redeemCodeId?: string;
}): Promise<{ signature: string; burned: number; cached: boolean }> {
  const { privyToken, wallet, amount, kind, orderId, redeemCodeId } = args;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (privyToken) headers['Authorization'] = `Bearer ${privyToken}`;

  // ─── Prepare ──────────────────────────────────────────────────────────────
  const prepRes = await fetch('/api/stars/burn', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'prepare',
      walletAddress: wallet.address,
      amount,
      kind,
      orderId,
      redeemCodeId,
    }),
  });
  const prep: PrepareResponse = await prepRes.json();
  if (!prepRes.ok) {
    throw new Error(prep.error ?? 'Could not prepare burn');
  }
  // Idempotency short-circuit — server already has a recorded burn for this
  // (orderId, kind). Return as-is.
  if (prep.cached && prep.signature) {
    return { signature: prep.signature, burned: prep.burned ?? amount, cached: true };
  }
  if (!prep.tx) throw new Error('Server did not return a transaction to sign');

  // ─── Sign via Privy embedded wallet ───────────────────────────────────────
  const tx = Transaction.from(Buffer.from(prep.tx, 'base64'));
  const serializedForSign = tx.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  const { signedTransaction } = await wallet.signTransaction({
    transaction: serializedForSign as Uint8Array,
    chain: chainFromRpc(),
  });
  const signedTxB64 = Buffer.from(signedTransaction).toString('base64');
  void bs58; // referenced for future versioned-tx path

  // ─── Submit ───────────────────────────────────────────────────────────────
  const subRes = await fetch('/api/stars/burn', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'submit',
      walletAddress: wallet.address,
      amount,
      kind,
      orderId,
      redeemCodeId,
      signedTxB64,
    }),
  });
  const sub: SubmitResponse = await subRes.json();
  if (!subRes.ok) {
    throw new Error(sub.error ?? 'Burn submission failed');
  }
  if (!sub.signature) throw new Error('No signature returned from submit');
  return { signature: sub.signature, burned: sub.burned ?? amount, cached: !!sub.cached };
}
