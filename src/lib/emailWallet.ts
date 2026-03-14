import { Keypair, Transaction, Connection } from '@solana/web3.js';

export function saveEmailKeypair(keypair: Keypair, email: string): void {
  const secretB64 = btoa(String.fromCharCode(...keypair.secretKey));
  localStorage.setItem('stellar_wallet_email', email);
  localStorage.setItem('stellar_wallet_address', keypair.publicKey.toString());
  localStorage.setItem('stellar_wallet_secret', secretB64);
}

export function getEmailKeypair(): Keypair | null {
  try {
    const b64 = localStorage.getItem('stellar_wallet_secret');
    if (!b64) return null;
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return Keypair.fromSecretKey(bytes);
  } catch {
    return null;
  }
}

export function getEmailSendTransaction() {
  const keypair = getEmailKeypair();
  if (!keypair) return null;

  return async (tx: Transaction, connection: Connection): Promise<string> => {
    tx.feePayer = keypair.publicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.sign(keypair);
    const raw = tx.serialize();
    const sig = await connection.sendRawTransaction(raw, { skipPreflight: false });
    return sig;
  };
}
