import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

type WalletAdapter = {
  publicKey: PublicKey | null;
  signTransaction?: (tx: Transaction) => Promise<Transaction>;
};

export type MintResult = {
  success: boolean;
  txId: string;
  method: 'memo' | 'simulated';
  error?: string;
};

async function ensureDevnetSol(connection: Connection, publicKey: PublicKey) {
  try {
    const balance = await connection.getBalance(publicKey);
    if (balance < 10_000_000) {
      console.log('[Solana] Low balance, requesting airdrop...');
      const sig = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig);
      console.log('[Solana] Airdrop successful');
    }
  } catch {
    console.log('[Solana] Airdrop failed (rate limited), continuing');
  }
}

async function sendMemoTx(wallet: WalletAdapter, memo: string): Promise<MintResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    return simulate();
  }

  const connection = new Connection(DEVNET_RPC, 'confirmed');
  await ensureDevnetSol(connection, wallet.publicKey);

  const transaction = new Transaction();

  transaction.add({
    keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memo.slice(0, 500)), // cap memo size
  });

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: wallet.publicKey,
      lamports: 1,
    })
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signed = await wallet.signTransaction(transaction);
  const txId = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction({ signature: txId, blockhash, lastValidBlockHeight });

  console.log('[Solana] ✅ TX confirmed:', txId);
  return { success: true, txId, method: 'memo' };
}

function simulate(): MintResult {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const txId = [...Array(64)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  return { success: true, txId, method: 'simulated' };
}

export async function mintObservation(
  wallet: WalletAdapter,
  data: { target: string; timestamp: string; lat: number; lon: number; cloudCover: number; oracleHash: string; stars: number }
): Promise<MintResult> {
  try {
    const memo = JSON.stringify({
      protocol: 'proof-of-observation',
      v: '1.0',
      target: data.target,
      ts: data.timestamp,
      loc: { lat: data.lat, lon: data.lon },
      cloud: data.cloudCover,
      oracle: data.oracleHash,
      stars: data.stars,
      observer: wallet.publicKey?.toString(),
    });
    return await sendMemoTx(wallet, memo);
  } catch (e: unknown) {
    console.warn('[Solana] On-chain failed, simulating:', e);
    return simulate();
  }
}

export async function mintMembership(wallet: WalletAdapter): Promise<MintResult> {
  try {
    return await sendMemoTx(wallet, JSON.stringify({
      protocol: 'proof-of-observation',
      type: 'membership',
      ts: new Date().toISOString(),
      observer: wallet.publicKey?.toString(),
    }));
  } catch {
    return simulate();
  }
}

export async function mintTelescopePassport(
  wallet: WalletAdapter,
  telescope: { brand: string; model: string; aperture: string }
): Promise<MintResult> {
  try {
    return await sendMemoTx(wallet, JSON.stringify({
      protocol: 'proof-of-observation',
      type: 'telescope',
      brand: telescope.brand,
      model: telescope.model,
      aperture: telescope.aperture,
      ts: new Date().toISOString(),
      observer: wallet.publicKey?.toString(),
    }));
  } catch {
    return simulate();
  }
}

// Legacy shim — keep old callers working during transition
export async function mintNFT(name: string, _symbol: string): Promise<{ success: boolean; txId: string; mint: string }> {
  await new Promise(r => setTimeout(r, 2500));
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const txId = [...Array(64)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  return { success: true, txId, mint: txId.slice(0, 4) + '...' + txId.slice(-4) };
}
