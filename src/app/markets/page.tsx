'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import PageTransition from '@/components/ui/PageTransition';
import MarketCard from '@/components/markets/MarketCard';
import { useReadOnlyProgram } from '@/lib/markets/privy-adapter';
import {
  getFullMarkets,
  getAllMarkets,
  type Market,
  type MarketCategory,
  type MarketOnChain,
  type MarketStatus,
} from '@/lib/markets';

type FilterValue = 'all' | MarketCategory;

const FILTERS: { value: FilterValue; label: string; emoji: string }[] = [
  { value: 'all',                  label: 'All',     emoji: '✦' },
  { value: 'sky_event',            label: 'Sky',     emoji: '🔭' },
  { value: 'weather_event',        label: 'Weather', emoji: '🌧' },
  { value: 'natural_phenomenon',   label: 'Nature',  emoji: '⚡' },
];

function deriveStatus(on: MarketOnChain, now: Date): MarketStatus {
  if (on.cancelled) return 'cancelled';
  if (on.resolved) return 'resolved';
  if (now >= on.resolutionTime) return 'locked';
  return 'open';
}

function synthesizeMarket(on: MarketOnChain): Market {
  const total = on.yesPool + on.noPool;
  const impliedYesOdds = total === 0 ? 0.5 : on.yesPool / total;
  const now = new Date();
  return {
    metadata: {
      id: `onchain-${on.marketId}`,
      marketId: on.marketId,
      title: on.question || `Market #${on.marketId}`,
      category: 'sky_event',
      closeTime: on.resolutionTime,
      resolutionTime: on.resolutionTime,
      resolutionSource: 'On-chain market — metadata pending',
      yesCondition: on.question,
      whyInteresting: '',
      uiDescription:
        'On-chain market created without seed metadata. Curated copy lands once this market is bound to a seed entry.',
    },
    onChain: on,
    impliedYesOdds,
    impliedNoOdds: 1 - impliedYesOdds,
    timeToClose: on.resolutionTime.getTime() - now.getTime(),
    timeToResolve: on.resolutionTime.getTime() - now.getTime(),
    status: deriveStatus(on, now),
  };
}

export default function MarketsPage() {
  const router = useRouter();
  const program = useReadOnlyProgram();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getFullMarkets(program), getAllMarkets(program)])
      .then(([bound, allOnChain]) => {
        if (cancelled) return;
        const boundIds = new Set(bound.map((m) => m.onChain.marketId));
        const synthesized = allOnChain
          .filter((on) => !boundIds.has(on.marketId))
          .map(synthesizeMarket);
        setMarkets([...bound, ...synthesized]);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error('[markets] failed to load', err);
        setError(err instanceof Error ? err.message : 'Failed to load markets');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [program]);

  const filtered = useMemo(
    () => (filter === 'all' ? markets : markets.filter((m) => m.metadata.category === filter)),
    [markets, filter],
  );

  const counts = useMemo(() => {
    let open = 0;
    let locked = 0;
    let resolved = 0;
    for (const m of markets) {
      if (m.status === 'open') open++;
      else if (m.status === 'locked') locked++;
      else if (m.status === 'resolved') resolved++;
    }
    return { open, locked, resolved };
  }, [markets]);

  return (
    <PageTransition>
      <PageContainer variant="wide" className="py-3 sm:py-6 flex flex-col gap-5">
        {/* Header */}
        <header className="flex flex-col gap-1.5">
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 38,
              lineHeight: 1.05,
              fontWeight: 600,
              color: '#F2F0EA',
              letterSpacing: '-0.012em',
              margin: 0,
            }}
          >
            Markets Tonight
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            {loading
              ? 'Loading on-chain state…'
              : `${counts.open} open · ${counts.resolved} resolved · ${counts.locked} locked`}
          </p>
        </header>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '7px 12px',
                  borderRadius: 9999,
                  border: active
                    ? '1px solid rgba(255,209,102,0.6)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: active ? '#FFD166' : 'rgba(255,255,255,0.03)',
                  color: active ? '#0a0a0a' : 'rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 12 }}>{f.emoji}</span>
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  minHeight: 196,
                }}
              />
            ))}
          </div>
        ) : error ? (
          <div
            className="rounded-xl px-4 py-6 text-center"
            style={{
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.2)',
              color: 'rgba(252,165,165,0.85)',
              fontFamily: 'var(--font-display)',
              fontSize: 13,
            }}
          >
            Couldn’t load markets — {error}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-xl px-4 py-10 text-center flex flex-col items-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.6 }}>✦</span>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 17,
                color: '#F2F0EA',
                margin: 0,
              }}
            >
              No markets in this category yet
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
              }}
            >
              Live markets seed when the judging window opens.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((market) => (
              <MarketCard
                key={market.onChain.marketId}
                market={market}
                onClick={() => router.push(`/markets/${market.onChain.marketId}`)}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </PageTransition>
  );
}
