'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useReadOnlyProgram } from '@/lib/markets/privy-adapter';
import { getFullMarkets, loadSeedMarkets } from '@/lib/markets/metadata';
import type { Market, MarketMetadata, MarketCategory } from '@/lib/markets/types';
import { getCategoryIcon } from '@/components/icons/MarketIcons';

interface Row {
  slug: string;
  title: string;
  category: MarketCategory;
  oracle: string | null;
  closeDate: string;
  yesPct: number;
  noPct: number;
}

function oracleBadge(src: string | undefined): string | null {
  if (!src) return null;
  const s = src.toLowerCase();
  if (s.includes('imo')) return 'IMO';
  if (s.includes('swpc') || s.includes('noaa')) return 'NOAA';
  if (s.includes('open-meteo')) return 'Open-Meteo';
  if (s.includes('nasa') && s.includes('spacex')) return 'NASA';
  if (s.includes('spacex')) return 'SpaceX';
  if (s.includes('nasa')) return 'NASA';
  if (s.includes('mpc') || s.includes('minor planet')) return 'MPC';
  if (s.includes('esa')) return 'ESA';
  if (s.includes('cnsa') || s.includes('chang')) return 'CNSA';
  if (s.includes('cobs')) return 'COBS';
  if (s.includes('ams')) return 'AMS';
  if (s.includes('jpl')) return 'JPL';
  if (s.includes('jwst')) return 'JWST';
  return null;
}

function closeDateLabel(d: Date): string {
  const now = new Date();
  const ms = d.getTime() - now.getTime();
  if (ms <= 0) return 'locked';
  const days = Math.floor(ms / 86400000);
  if (days >= 1) return `closes ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  const hours = Math.max(1, Math.floor(ms / 3600000));
  return `closes in ${hours}h`;
}

function metadataToRow(m: MarketMetadata, yesPctOverride?: number): Row {
  const yesPct = yesPctOverride ?? m.initialYesPct ?? 50;
  return {
    slug: m.id,
    title: m.title,
    category: m.category,
    oracle: oracleBadge(m.resolutionSource),
    closeDate: closeDateLabel(m.closeTime),
    yesPct: Math.round(yesPct),
    noPct: 100 - Math.round(yesPct),
  };
}

function marketToRow(m: Market): Row {
  return metadataToRow(m.metadata, m.impliedYesOdds * 100);
}

export default function HomeMarkets() {
  const program = useReadOnlyProgram();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;

    const seed = loadSeedMarkets();
    const now = Date.now();
    const seedRows = seed
      .filter((m) => m.marketId !== null && !m.preResolved && m.closeTime.getTime() > now)
      .sort((a, b) => a.closeTime.getTime() - b.closeTime.getTime())
      .slice(0, 5)
      .map((m) => metadataToRow(m));
    setRows(seedRows);

    getFullMarkets(program)
      .then((full) => {
        if (cancelled) return;
        const open = full
          .filter((m) => m.status === 'open')
          .sort((a, b) => a.metadata.closeTime.getTime() - b.metadata.closeTime.getTime())
          .slice(0, 5);
        if (open.length) setRows(open.map(marketToRow));
      })
      .catch(() => { /* keep seed fallback */ });
    return () => { cancelled = true; };
  }, [program]);

  const totalCount = useMemo(() => loadSeedMarkets().length, []);

  return (
    <div>
      <div className="home-col-head">
        <h2 className="home-col-title">Trending markets</h2>
        <Link href="/markets" className="home-col-link">All {totalCount} markets</Link>
      </div>
      <div className="home-markets-list">
        {rows.map((row) => {
          const Icon = getCategoryIcon(row.category);
          return (
            <Link key={row.slug} href={`/markets/${row.slug}`} className="home-market-row">
              <span className="home-market-icon">
                <Icon size={14} />
              </span>
              <div className="home-market-body">
                <div className="home-market-title">{row.title}</div>
                <div className="home-market-meta">
                  {row.oracle && <span className="home-market-oracle">{row.oracle}</span>}
                  {row.oracle && <span>·</span>}
                  <span>{row.closeDate}</span>
                </div>
              </div>
              <div className="home-market-odds">
                <span className="home-market-btn yes">Yes {row.yesPct}%</span>
                <span className="home-market-btn no">No {row.noPct}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
