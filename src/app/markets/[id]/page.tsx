'use client';

import { useEffect, useMemo, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageTransition from '@/components/ui/PageTransition';
import { useReadOnlyProgram } from '@/lib/markets/privy-adapter';
import {
  getMarket,
  findMetadataByMarketId,
  type MarketCategory,
  type MarketOnChain,
  type MarketMetadata,
} from '@/lib/markets';

const CATEGORY_META: Record<
  MarketCategory,
  { label: string; emoji: string; color: string; bg: string; border: string }
> = {
  sky_event: {
    label: 'SKY EVENT',
    emoji: '🔭',
    color: '#FFD166',
    bg: 'rgba(255,209,102,0.12)',
    border: 'rgba(255,209,102,0.25)',
  },
  weather_event: {
    label: 'WEATHER',
    emoji: '🌧',
    color: '#5EEAD4',
    bg: 'rgba(94,234,212,0.10)',
    border: 'rgba(94,234,212,0.25)',
  },
  natural_phenomenon: {
    label: 'NATURE',
    emoji: '⚡',
    color: '#C4B5FD',
    bg: 'rgba(196,181,253,0.10)',
    border: 'rgba(196,181,253,0.25)',
  },
};

function formatLocal(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const program = useReadOnlyProgram();
  const marketId = useMemo(() => Number(id), [id]);

  const [onChain, setOnChain] = useState<MarketOnChain | null>(null);
  const [meta, setMeta] = useState<MarketMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!Number.isFinite(marketId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    getMarket(program, marketId)
      .then((on) => {
        if (cancelled) return;
        if (!on) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setOnChain(on);
        setMeta(findMetadataByMarketId(marketId));
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error('[market detail] failed to load', err);
        setNotFound(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [program, marketId]);

  const cat = meta ? CATEGORY_META[meta.category] : CATEGORY_META.sky_event;
  const title = meta?.title ?? onChain?.question ?? `Market #${marketId}`;
  const description =
    meta?.uiDescription ??
    'On-chain market created without seed metadata. Curated copy lands once this market is bound to a seed entry.';

  return (
    <PageTransition>
      <PageContainer variant="wide" className="py-3 sm:py-6 flex flex-col gap-5">
        {/* Back button */}
        <button
          onClick={() => router.push('/markets')}
          className="inline-flex items-center gap-1.5 self-start"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            letterSpacing: '0.04em',
          }}
        >
          <ArrowLeft size={13} /> Back to markets
        </button>

        {loading ? (
          <div
            className="animate-pulse rounded-xl"
            style={{
              minHeight: 320,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
        ) : notFound ? (
          <div
            className="rounded-xl px-4 py-10 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'var(--font-display)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 13,
            }}
          >
            Market #{id} not found on-chain.
          </div>
        ) : (
          <>
            {/* Category badge */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: cat.color,
                background: cat.bg,
                border: `1px solid ${cat.border}`,
                borderRadius: 4,
                padding: '3px 7px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                lineHeight: 1,
                alignSelf: 'flex-start',
              }}
            >
              <span style={{ fontSize: 11 }}>{cat.emoji}</span>
              {cat.label}
            </span>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 30,
                lineHeight: 1.18,
                fontWeight: 600,
                color: '#F2F0EA',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
              }}
            >
              {description}
            </p>

            {/* Banner: betting coming */}
            <div
              className="rounded-xl px-4 py-4 flex items-start gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(99,102,241,0.06))',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>🚧</span>
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#F2F0EA',
                    margin: 0,
                  }}
                >
                  Betting interface coming tomorrow
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.55)',
                    margin: '2px 0 0',
                  }}
                >
                  Day 4 ships YES/NO position entry, live odds, and your active stake.
                </p>
              </div>
            </div>

            {/* Detail grid */}
            <dl
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              style={{ marginTop: 4 }}
            >
              {meta?.yesCondition && (
                <DetailRow label="YES condition" value={meta.yesCondition} fullWidth />
              )}
              {meta?.resolutionSource && (
                <DetailRow label="Resolution source" value={meta.resolutionSource} fullWidth />
              )}
              {meta?.closeTime && (
                <DetailRow label="Closes" value={formatLocal(meta.closeTime)} />
              )}
              <DetailRow
                label="Resolves"
                value={formatLocal(meta?.resolutionTime ?? onChain!.resolutionTime)}
              />
              <DetailRow label="Market ID" value={`#${marketId}`} mono />
              {onChain && (
                <DetailRow
                  label="Pools"
                  value={`YES ${onChain.yesPool} · NO ${onChain.noPool}`}
                  mono
                />
              )}
            </dl>
          </>
        )}
      </PageContainer>
    </PageTransition>
  );
}

function DetailRow({
  label,
  value,
  fullWidth,
  mono,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      className={fullWidth ? 'sm:col-span-2' : ''}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '10px 12px',
      }}
    >
      <dt
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          margin: 0,
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
          fontSize: mono ? 12 : 13,
          color: '#F2F0EA',
          margin: '4px 0 0',
          lineHeight: 1.4,
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        }}
      >
        {value}
      </dd>
    </div>
  );
}
