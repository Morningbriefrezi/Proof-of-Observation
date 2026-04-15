import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) return NextResponse.json({ error: 'address required' }, { status: 400 });

  const endpoint = process.env.HELIUS_RPC_URL ?? process.env.NEXT_PUBLIC_HELIUS_RPC_URL ?? 'https://api.devnet.solana.com';
  const collectionMint = process.env.NEXT_PUBLIC_COLLECTION_MINT_ADDRESS;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'getAssetsByOwner',
      params: { ownerAddress: address, page: 1, limit: 100, displayOptions: { showUnverifiedCollections: true } },
    }),
  });

  if (!res.ok) return NextResponse.json({ error: 'upstream failed' }, { status: 502 });

  const data = await res.json();
  const items = data?.result?.items ?? [];
  const filtered = collectionMint
    ? items.filter((item: { grouping?: { group_key: string; group_value: string }[] }) =>
        item.grouping?.some(g => g.group_key === 'collection' && g.group_value === collectionMint)
      )
    : items;

  return NextResponse.json({ items: filtered });
}
