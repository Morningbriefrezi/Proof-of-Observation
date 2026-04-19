'use client';

import type { PublicKey } from '@solana/web3.js';
import BetForm from './BetForm';
import PoolStats from './PoolStats';
import UserPositionCard from './UserPositionCard';
import type {
  MarketCategory,
  MarketMetadata,
  MarketOnChain,
  Position,
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

type DerivedStatus =
  | { kind: 'open' }
  | { kind: 'locked'; reason: 'close_time' | 'resolution_time' }
  | { kind: 'resolved'; side: 'yes' | 'no' | 'unresolved' }
  | { kind: 'cancelled' };

function deriveStatus(
  onChain: MarketOnChain,
  meta: MarketMetadata | null,
  now: Date,
): DerivedStatus {
  if (onChain.cancelled) return { kind: 'cancelled' };
  if (onChain.resolved) {
    const s = onChain.outcome;
    return {
      kind: 'resolved',
      side: s === 'yes' || s === 'no' ? s : 'unresolved',
    };
  }
  if (now >= onChain.resolutionTime) {
    return { kind: 'locked', reason: 'resolution_time' };
  }
  if (meta && now >= meta.closeTime) {
    return { kind: 'locked', reason: 'close_time' };
  }
  return { kind: 'open' };
}

interface MarketDetailProps {
  onChain: MarketOnChain;
  meta: MarketMetadata | null;
  mint: PublicKey;
  positions: Position[];
  balance: number | null;
  onRefresh: () => void;
}

export default function MarketDetail({
  onChain,
  meta,
  mint,
  positions,
  balance,
  onRefresh,
}: MarketDetailProps) {
  const cat = meta ? CATEGORY_META[meta.category] : CATEGORY_META.sky_event;
  const title = meta?.title ?? onChain.question ?? `Market #${onChain.marketId}`;
  const description =
    meta?.uiDescription ??
    'On-chain market created without seed metadata. Curated copy lands once this market is bound to a seed entry.';

  const status = deriveStatus(onChain, meta, new Date());

  return (
    <>
      {/* Top row: category badge + status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
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
          }}
        >
          <span style={{ fontSize: 11 }}>{cat.emoji}</span>
          {cat.label}
        </span>
        <StatusBadge status={status} />
      </div>

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

      {/* Status banners */}
      {status.kind === 'resolved' && (
        <Banner
          tone={status.side === 'yes' ? 'emerald' : status.side === 'no' ? 'rose' : 'slate'}
          title={
            status.side === 'unresolved'
              ? 'Market resolved'
              : `Resolved: ${status.side.toUpperCase()} won`
          }
          subtitle="Winning positions can be claimed."
        />
      )}
      {status.kind === 'cancelled' && (
        <Banner
          tone="slate"
          title="Market cancelled"
          subtitle="All positions refundable."
        />
      )}
      {status.kind === 'locked' && status.reason === 'resolution_time' && (
        <Banner
          tone="amber"
          title="Awaiting resolution"
          subtitle="Oracle data arrives shortly."
        />
      )}

      {/* Pool + Bet form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PoolStats onChain={onChain} />
        {status.kind === 'resolved' || status.kind === 'cancelled' ? (
          <div
            className="rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Positions closed
          </div>
        ) : (
          <BetForm
            onChain={onChain}
            mint={mint}
            balance={balance}
            locked={status.kind === 'locked'}
            onSuccess={onRefresh}
          />
        )}
      </div>

      <UserPositionCard positions={positions} />

      {/* Resolution details */}
      <section className="flex flex-col gap-2">
        <h3
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            margin: 0,
          }}
        >
          Resolution details
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            value={formatLocal(meta?.resolutionTime ?? onChain.resolutionTime)}
          />
          <DetailRow label="Market ID" value={`#${onChain.marketId}`} mono />
          <DetailRow
            label="Pools"
            value={`YES ${onChain.yesPool} · NO ${onChain.noPool}`}
            mono
          />
        </dl>
      </section>
    </>
  );
}

function StatusBadge({ status }: { status: DerivedStatus }) {
  const meta = {
    open: { label: 'Open', dot: '#34D399' },
    locked: { label: 'Locked', dot: '#FBBF24' },
    resolved: { label: 'Resolved', dot: '#FFD166' },
    cancelled: { label: 'Cancelled', dot: '#94A3B8' },
  }[status.kind];
  return (
    <span
      className="flex items-center gap-1.5"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: '0.14em',
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 9999,
          background: meta.dot,
          boxShadow: `0 0 6px ${meta.dot}aa`,
        }}
      />
      {meta.label}
    </span>
  );
}

function Banner({
  tone,
  title,
  subtitle,
}: {
  tone: 'emerald' | 'rose' | 'amber' | 'slate';
  title: string;
  subtitle?: string;
}) {
  const toneStyles: Record<
    'emerald' | 'rose' | 'amber' | 'slate',
    { bg: string; border: string; color: string }
  > = {
    emerald: {
      bg: 'rgba(52,211,153,0.10)',
      border: 'rgba(52,211,153,0.3)',
      color: '#34D399',
    },
    rose: {
      bg: 'rgba(244,114,182,0.10)',
      border: 'rgba(244,114,182,0.3)',
      color: '#F472B6',
    },
    amber: {
      bg: 'rgba(251,191,36,0.08)',
      border: 'rgba(251,191,36,0.3)',
      color: '#FBBF24',
    },
    slate: {
      bg: 'rgba(148,163,184,0.08)',
      border: 'rgba(148,163,184,0.28)',
      color: 'rgba(226,232,240,0.85)',
    },
  };
  const t = toneStyles[tone];
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 15,
          fontWeight: 600,
          color: t.color,
          margin: 0,
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.55)',
            margin: '2px 0 0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
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
