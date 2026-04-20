'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import PageTransition from '@/components/ui/PageTransition';
import { useReadOnlyProgram } from '@/lib/markets/privy-adapter';
import { useAppState } from '@/hooks/useAppState';
import {
  checkObserverAdvantage,
  getOracleKeyForMarketId,
  missionsToObservations,
} from '@/lib/observer-advantage';
import {
  getFullMarkets,
  getAllMarkets,
  type Market,
  type MarketCategory,
  type MarketOnChain,
  type MarketStatus,
} from '@/lib/markets';

type TabValue = 'all' | 'tonight' | 'week';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;

interface CategoryDef {
  key: MarketCategory;
  label: string;
  emoji: string;
}

// v2 categories first (post-seed), v1 fallback below
const CATEGORY_ORDER: CategoryDef[] = [
  { key: 'meteor',             label: 'Meteor Showers',  emoji: '☄' },
  { key: 'solar',              label: 'Solar Activity',  emoji: '☀' },
  { key: 'mission',            label: 'Space Missions',  emoji: '🚀' },
  { key: 'comet',              label: 'Comets & Asteroids', emoji: '🌠' },
  { key: 'discovery',          label: 'Scientific Discoveries', emoji: '🔬' },
  { key: 'weather',            label: 'Weather × Sky',   emoji: '🌤' },
  { key: 'sky_event',          label: 'Sky Events',      emoji: '🔭' },
  { key: 'weather_event',      label: 'Weather Events',  emoji: '🌧' },
  { key: 'natural_phenomenon', label: 'Natural Phenomena', emoji: '⚡' },
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

function formatCountdown(ms: number): string {
  if (ms <= 0) return '—';
  const days = Math.floor(ms / ONE_DAY_MS);
  if (days >= 1) return `${days}d`;
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (hours >= 1) return `${hours}h`;
  const mins = Math.max(1, Math.floor(ms / (60 * 1000)));
  return `${mins}m`;
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

function formatStat(n: number): string {
  return n.toLocaleString();
}

function oddsColorClass(yesPct: number): { odds: string; fill: string } {
  if (yesPct >= 60) return { odds: 'stl-odds-hi',  fill: 'stl-fill-hi' };
  if (yesPct >= 40) return { odds: 'stl-odds-mid', fill: 'stl-fill-mid' };
  return                   { odds: 'stl-odds-lo',  fill: 'stl-fill-lo' };
}

function urgencyLevel(msToClose: number): 'urgent' | 'hot' | 'distant' | 'normal' {
  if (msToClose <= 0) return 'normal';
  if (msToClose <= ONE_DAY_MS) return 'urgent';
  if (msToClose <= ONE_WEEK_MS) return 'hot';
  if (msToClose > THIRTY_DAYS_MS) return 'distant';
  return 'normal';
}

function categoryPillClass(category: string): string {
  switch (category) {
    case 'meteor': return 'stl-cat-pill stl-cat-meteor';
    case 'solar': return 'stl-cat-pill stl-cat-solar';
    case 'mission': return 'stl-cat-pill stl-cat-mission';
    case 'comet': return 'stl-cat-pill stl-cat-comet';
    case 'discovery': return 'stl-cat-pill stl-cat-discovery';
    case 'weather':
    case 'weather_event':
    case 'natural_phenomenon':
    case 'sky_event':
    default:
      return 'stl-cat-pill stl-cat-weather';
  }
}

function categoryLabel(category: string): string {
  switch (category) {
    case 'meteor': return 'Meteor';
    case 'solar': return 'Solar';
    case 'mission': return 'Mission';
    case 'comet': return 'Comet';
    case 'discovery': return 'Discovery';
    case 'weather': return 'Weather';
    case 'weather_event': return 'Weather';
    case 'natural_phenomenon': return 'Phenom';
    case 'sky_event': return 'Sky';
    default: return category.slice(0, 8).toUpperCase();
  }
}

/** Shorten long resolution source strings to a compact oracle badge. */
function oracleBadge(src: string | undefined): string | null {
  if (!src) return null;
  const s = src.toLowerCase();
  if (s.includes('imo') || s.includes('international meteor')) return 'IMO live';
  if (s.includes('swpc') || s.includes('noaa space weather')) return 'NOAA SWPC';
  if (s.includes('noaa')) return 'NOAA';
  if (s.includes('open-meteo')) return 'Open-Meteo';
  if (s.includes('nasa') && s.includes('spacex')) return 'NASA / SpaceX';
  if (s.includes('nasa')) return 'NASA';
  if (s.includes('spacex')) return 'SpaceX';
  if (s.includes('mpc') || s.includes('minor planet')) return 'MPC';
  if (s.includes('cobs')) return 'COBS';
  if (s.includes('ams ') || s.includes('american meteor')) return 'AMS';
  if (s.includes('jpl') || s.includes('horizons')) return 'NASA JPL';
  if (s.includes('gcn') || s.includes('ligo')) return 'LIGO / GCN';
  if (s.includes('jwst')) return 'JWST team';
  if (s.includes('nobel')) return 'Nobel cttee';
  if (s.includes('gaia')) return 'ESA Gaia';
  if (s.includes('laser seti') || s.includes('seti')) return 'SETI';
  if (s.includes('esa')) return 'ESA';
  if (s.includes('cnsa') || s.includes('chang')) return 'CNSA';
  if (s.includes('colosseum')) return 'Colosseum';
  return null;
}

export default function MarketsPage() {
  const router = useRouter();
  const program = useReadOnlyProgram();
  const { state } = useAppState();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabValue>('all');

  const observations = useMemo(
    () => missionsToObservations(state.completedMissions ?? []),
    [state.completedMissions],
  );

  const advantageByMarketId = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (const m of markets) {
      const key = getOracleKeyForMarketId(m.onChain.marketId);
      map[m.onChain.marketId] = checkObserverAdvantage(key, observations).hasAdvantage;
    }
    return map;
  }, [markets, observations]);

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

  // Hero: 3 markets closest to closing (open only)
  const heroMarkets = useMemo(() => {
    const now = Date.now();
    return markets
      .filter((m) => m.status === 'open' && m.metadata.closeTime.getTime() > now)
      .sort((a, b) => a.metadata.closeTime.getTime() - b.metadata.closeTime.getTime())
      .slice(0, 3);
  }, [markets]);

  // Visible set after tab filter (tonight / week / all)
  const visible = useMemo(() => {
    const now = Date.now();
    if (tab === 'tonight') {
      return markets.filter(
        (m) => m.status === 'open' && m.metadata.closeTime.getTime() - now <= ONE_DAY_MS,
      );
    }
    if (tab === 'week') {
      return markets.filter(
        (m) => m.status === 'open' && m.metadata.closeTime.getTime() - now <= ONE_WEEK_MS,
      );
    }
    return markets;
  }, [markets, tab]);

  // Group open/locked markets by category (resolved gets its own section below)
  const grouped = useMemo(() => {
    const activeOnly = visible.filter(
      (m) => m.status === 'open' || m.status === 'locked',
    );
    const out: { def: CategoryDef; items: Market[] }[] = [];
    for (const def of CATEGORY_ORDER) {
      const items = activeOnly.filter((m) => m.metadata.category === def.key);
      if (items.length === 0) continue;
      items.sort((a, b) => {
        const aOpen = a.status === 'open' ? 0 : 1;
        const bOpen = b.status === 'open' ? 0 : 1;
        if (aOpen !== bOpen) return aOpen - bOpen;
        return a.metadata.closeTime.getTime() - b.metadata.closeTime.getTime();
      });
      out.push({ def, items });
    }
    return out;
  }, [visible]);

  // Resolved + cancelled — dedicated bottom section
  const resolvedItems = useMemo(() => {
    return markets
      .filter((m) => m.status === 'resolved' || m.status === 'cancelled')
      .sort(
        (a, b) =>
          b.metadata.resolutionTime.getTime() - a.metadata.resolutionTime.getTime(),
      );
  }, [markets]);

  const summary = useMemo(() => {
    let open = 0;
    let resolved = 0;
    let staked = 0;
    let tonight = 0;
    let week = 0;
    const now = Date.now();
    for (const m of markets) {
      if (m.status === 'open') {
        open++;
        const dt = m.metadata.closeTime.getTime() - now;
        if (dt <= ONE_DAY_MS) tonight++;
        if (dt <= ONE_WEEK_MS) week++;
      }
      if (m.status === 'resolved') resolved++;
      staked += m.onChain.totalStaked;
    }
    return { total: markets.length, open, resolved, staked, tonight, week };
  }, [markets]);

  return (
    <PageTransition>
      <PageContainer variant="wide" className="py-3 sm:py-6 flex flex-col gap-5">
        {/* Header */}
        <header className="flex flex-col gap-1.5">
          <h1 className="stl-display-lg" style={{ margin: 0, color: 'var(--stl-text-bright)' }}>
            Sky Markets
          </h1>
          <p className="stl-mono-kicker" style={{ color: 'var(--stl-text-muted)', margin: 0 }}>
            {loading
              ? 'Loading on-chain state…'
              : `${summary.open} open · ${summary.resolved} resolved · ${formatStat(summary.staked)} ✦ staked`}
          </p>
        </header>

        {/* Summary stat grid */}
        {!loading && markets.length > 0 && (
          <div className="stl-summary-grid">
            <div className="stl-summary-cell">
              <span className="stl-summary-label">Total Markets</span>
              <span className="stl-summary-value">{formatStat(summary.total)}</span>
            </div>
            <div className="stl-summary-cell">
              <span className="stl-summary-label">Live</span>
              <span className="stl-summary-value">{formatStat(summary.open)}</span>
            </div>
            <div className="stl-summary-cell">
              <span className="stl-summary-label">Resolved</span>
              <span className="stl-summary-value">{formatStat(summary.resolved)}</span>
            </div>
            <div className="stl-summary-cell">
              <span className="stl-summary-label">Stars Staked</span>
              <span className="stl-summary-value">
                {formatVolume(summary.staked)}{' '}
                <span style={{ fontSize: 14, color: 'var(--stl-gold)' }}>✦</span>
              </span>
            </div>
          </div>
        )}

        {/* Hero: 3 closest-to-closing markets */}
        {!loading && heroMarkets.length > 0 && (
          <section className="flex flex-col">
            <div className="stl-hero-kicker">Closing soon — trade now</div>
            <div className="stl-hero-grid">
              {heroMarkets.map((m) => (
                <HeroCard
                  key={m.onChain.marketId}
                  market={m}
                  advantage={!!advantageByMarketId[m.onChain.marketId]}
                  onClick={() => router.push(`/markets/${m.onChain.marketId}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tab bar */}
        {!loading && markets.length > 0 && (
          <div className="stl-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'all'}
              className="stl-tab"
              onClick={() => setTab('all')}
            >
              All <span className="stl-tab-count">({summary.total})</span>
            </button>
            <button
              role="tab"
              aria-selected={tab === 'tonight'}
              className="stl-tab"
              onClick={() => setTab('tonight')}
            >
              Tonight <span className="stl-tab-count">({summary.tonight})</span>
            </button>
            <button
              role="tab"
              aria-selected={tab === 'week'}
              className="stl-tab"
              onClick={() => setTab('week')}
            >
              This Week <span className="stl-tab-count">({summary.week})</span>
            </button>
            <button
              className="stl-tab"
              onClick={() => router.push('/my-positions')}
              style={{ marginLeft: 'auto', opacity: 0.65 }}
            >
              My Bets →
            </button>
          </div>
        )}

        {/* Body */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  background: 'var(--stl-bg-surface)',
                  border: '1px solid var(--stl-border-soft)',
                  borderRadius: 'var(--stl-r-sm)',
                  height: 42,
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
              fontFamily: 'var(--font-serif)',
              fontSize: 13,
            }}
          >
            Couldn&rsquo;t load markets &mdash; {error}
          </div>
        ) : visible.length === 0 ? (
          <div
            className="rounded-xl px-4 py-10 text-center flex flex-col items-center gap-2"
            style={{
              background: 'var(--stl-bg-surface)',
              border: '1px solid var(--stl-border-soft)',
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.6 }}>✦</span>
            <p className="stl-display-md" style={{ color: 'var(--stl-text-bright)', margin: 0 }}>
              No markets in this window
            </p>
            <p className="stl-body-sm" style={{ color: 'var(--stl-text-muted)', margin: 0 }}>
              {tab === 'all'
                ? 'Live markets seed when the judging window opens.'
                : 'Try a wider filter to see upcoming markets.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2" id="markets-table">
            {grouped.map(({ def, items }) => (
              <section key={def.key} style={{ display: 'flex', flexDirection: 'column' }}>
                <header className="stl-cat-header">
                  <span style={{ fontSize: 13, opacity: 0.85, width: 20, display: 'inline-block' }}>{def.emoji}</span>
                  <span className="stl-cat-name">{def.label}</span>
                  <span className="stl-cat-count">({items.length})</span>
                </header>
                <div className="stl-bet-list">
                  {items.map((m) => (
                    <MarketRow
                      key={m.onChain.marketId}
                      market={m}
                      advantage={!!advantageByMarketId[m.onChain.marketId]}
                      onClick={() => router.push(`/markets/${m.onChain.marketId}`)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Dedicated Resolved section — always at bottom */}
        {!loading && resolvedItems.length > 0 && (
          <section className="stl-resolved-section">
            <header className="stl-resolved-header">
              <span className="stl-resolved-title">Resolved</span>
              <span className="stl-resolved-count">{resolvedItems.length} settled</span>
            </header>
            <div className="stl-resolved-list">
              {resolvedItems.map((m) => (
                <ResolvedRow
                  key={m.onChain.marketId}
                  market={m}
                  onClick={() => router.push(`/markets/${m.onChain.marketId}`)}
                />
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </PageTransition>
  );
}

interface HeroCardProps {
  market: Market;
  advantage: boolean;
  onClick: () => void;
}

function HeroCard({ market, advantage, onClick }: HeroCardProps) {
  const yesPct = Math.round(market.impliedYesOdds * 100);
  const msToClose = market.metadata.closeTime.getTime() - Date.now();
  const urgency = urgencyLevel(msToClose);
  const colors = oddsColorClass(yesPct);
  const pillClass = categoryPillClass(market.metadata.category);
  const pillLabel = categoryLabel(market.metadata.category);

  const cardClass = [
    'stl-hero-card',
    urgency === 'urgent' ? 'urgent' : urgency === 'hot' ? 'hot' : '',
  ].filter(Boolean).join(' ');

  const timeClass = [
    'stl-hero-time',
    urgency === 'urgent' ? 'urgent' : urgency === 'hot' ? 'hot' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cardClass}
    >
      <div className="stl-hero-top">
        <span className={pillClass}>{pillLabel}</span>
        <span className={timeClass}>closes {formatCountdown(msToClose)}</span>
      </div>
      <h3 className="stl-hero-title">{market.metadata.title}</h3>
      <div className="stl-hero-odds-row">
        <span className={`stl-hero-odds ${colors.odds}`}>{yesPct}%</span>
        <div className="stl-hero-bar" aria-hidden>
          <div className={`stl-hero-fill ${colors.fill}`} style={{ width: `${yesPct}%` }} />
        </div>
      </div>
      <div className="stl-hero-foot">
        <span>{formatVolume(market.onChain.totalStaked)} staked</span>
        {advantage && <span className="stl-hero-adv">🔭 1.5×</span>}
      </div>
    </div>
  );
}

interface RowProps {
  market: Market;
  advantage: boolean;
  onClick: () => void;
}

function MarketRow({ market, advantage, onClick }: RowProps) {
  const emoji = market.metadata.emoji ?? '✦';
  const yesPct = Math.round(market.impliedYesOdds * 100);
  const noPct = 100 - yesPct;
  const yesMult = market.impliedYesOdds > 0.001 ? 1 / market.impliedYesOdds : 999;
  const noMult = market.impliedYesOdds < 0.999 ? 1 / (1 - market.impliedYesOdds) : 999;
  const volume = market.onChain.totalStaked;
  const msToClose = market.metadata.closeTime.getTime() - Date.now();
  const countdown = formatCountdown(msToClose);
  const urgency = urgencyLevel(msToClose);
  const oracle = oracleBadge(market.metadata.resolutionSource);
  const locked = market.status === 'locked';

  const countdownClass = [
    'stl-bet-countdown',
    urgency === 'urgent' ? 'urgent' : urgency === 'hot' ? 'hot' : '',
    locked ? 'locked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="stl-bet-row"
      id={`market-${market.onChain.marketId}`}
    >
      <div className="stl-bet-head">
        <span className="stl-bet-emoji" aria-hidden>{emoji}</span>
        <span className="stl-bet-title">{market.metadata.title}</span>
        <span className={countdownClass}>
          {locked ? 'locked' : countdown}
        </span>
      </div>
      <div className="stl-bet-sides">
        <div className="stl-bet-side stl-bet-yes">
          <div className="stl-bet-side-head">
            <span className="stl-bet-side-label">YES</span>
            <span className="stl-bet-side-pct">{yesPct}%</span>
          </div>
          <span className="stl-bet-side-mult">pays {yesMult.toFixed(2)}×</span>
        </div>
        <div className="stl-bet-side stl-bet-no">
          <div className="stl-bet-side-head">
            <span className="stl-bet-side-label">NO</span>
            <span className="stl-bet-side-pct">{noPct}%</span>
          </div>
          <span className="stl-bet-side-mult">pays {noMult.toFixed(2)}×</span>
        </div>
      </div>
      <div className="stl-bet-foot">
        {oracle && <span className="stl-bet-oracle">{oracle}</span>}
        {advantage && <span className="stl-bet-adv">🔭 1.5× stake bonus</span>}
        <span className="stl-bet-vol">{formatVolume(volume)} ✦ staked</span>
      </div>
    </div>
  );
}

interface ResolvedRowProps {
  market: Market;
  onClick: () => void;
}

function ResolvedRow({ market, onClick }: ResolvedRowProps) {
  const cancelled = market.status === 'cancelled';
  const isYes = !cancelled && market.onChain.outcome === 'yes';
  const isNo = !cancelled && market.onChain.outcome === 'no';
  const emoji = market.metadata.emoji ?? '✦';
  const date = market.metadata.resolutionTime.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  const tagClass = cancelled
    ? 'stl-resolved-tag'
    : isYes
      ? 'stl-resolved-tag stl-resolved-yes'
      : 'stl-resolved-tag stl-resolved-no';

  const tagLabel = cancelled ? '⟳ CANCELLED' : isYes ? '✓ YES' : '✗ NO';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="stl-resolved-row"
    >
      <span className="stl-resolved-emoji" aria-hidden>{emoji}</span>
      <span className="stl-resolved-title">{market.metadata.title}</span>
      <span className={tagClass}>{tagLabel}</span>
      <span className="stl-resolved-date">{date}</span>
    </div>
  );
}

