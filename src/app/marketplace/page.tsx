'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStellarUser } from '@/hooks/useStellarUser';
import { useStarsBalance } from '@/hooks/useStarsBalance';
import { useAppState } from '@/hooks/useAppState';
import { useLocation } from '@/lib/location';
import LocationPicker from '@/components/LocationPicker';
import PageContainer from '@/components/layout/PageContainer';
import FeaturedProduct from '@/components/marketplace/FeaturedProduct';
import ProductCard from '@/components/marketplace/ProductCard';
import { getProductsByRegion, getDealersByRegion, GLOBAL_FALLBACK } from '@/lib/dealers';
import type { Product } from '@/lib/dealers';

type CategoryFilter = 'all' | 'telescope' | 'eyepiece' | 'binocular' | 'accessory';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'telescope', label: 'Telescopes' },
  { key: 'eyepiece', label: 'Eyepieces' },
  { key: 'binocular', label: 'Binoculars' },
  { key: 'accessory', label: 'Accessories' },
];

const DIFFICULTY_TONE: Record<Exclude<DifficultyFilter, 'all'>, { border: string; bg: string; color: string }> = {
  beginner:     { border: 'rgba(94, 234, 212,0.45)',  bg: 'rgba(94, 234, 212,0.10)',  color: 'var(--seafoam)' },
  intermediate: { border: 'rgba(255, 209, 102,0.45)', bg: 'rgba(255, 209, 102,0.10)', color: 'var(--terracotta)' },
  advanced:     { border: 'rgba(255, 209, 102,0.45)', bg: 'rgba(255, 209, 102,0.10)', color: 'var(--terracotta)' },
};

export default function MarketplacePage() {
  const router = useRouter();
  const { address: stellarAddress } = useStellarUser();
  const { state } = useAppState();
  const { location } = useLocation();
  const address = stellarAddress ?? state.walletAddress ?? null;
  const starsBalance = useStarsBalance(address);
  const balance = starsBalance ?? 0;

  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');

  const dealers = useMemo(() => getDealersByRegion(location.region), [location.region]);
  const showDealer = dealers.length > 1;
  const regionProducts = useMemo(() => {
    const list = getProductsByRegion(location.region);
    return list.length > 0 ? list : GLOBAL_FALLBACK;
  }, [location.region]);
  const allProducts = useMemo(() => regionProducts.filter(p => p.kind !== 'stars-only'), [regionProducts]);
  const getDealerName = useCallback(
    (id: string): string => dealers.find(d => d.id === id)?.name ?? id,
    [dealers],
  );

  const inCategory = useMemo(
    () => filter === 'all' ? allProducts : allProducts.filter(p => p.category === filter),
    [allProducts, filter],
  );
  const visible = useMemo(
    () => difficulty === 'all' ? inCategory : inCategory.filter(p => p.skillLevel === difficulty),
    [inCategory, difficulty],
  );

  const featured = useMemo<Product | null>(() => {
    const telescopeScope = filter === 'all' || filter === 'telescope';
    if (!telescopeScope) return null;
    if (difficulty === 'advanced') return null;
    const pool = inCategory.filter(p => p.category === 'telescope');
    if (pool.length === 0) return null;
    if (difficulty === 'all' || difficulty === 'intermediate') {
      const mid = pool.find(p => p.skillLevel === 'intermediate');
      if (mid) return mid;
    }
    if (difficulty === 'all' || difficulty === 'beginner') {
      const beginners = pool.filter(p => p.skillLevel === 'beginner');
      if (beginners.length) return [...beginners].sort((a, b) => b.price - a.price)[0];
    }
    return pool[0] ?? null;
  }, [inCategory, filter, difficulty]);

  const remaining = useMemo(
    () => visible.filter(p => !featured || p.id !== featured.id),
    [visible, featured],
  );

  return (
    <PageContainer variant="wide" className="font-mono py-5 animate-page-enter">
      <div className="marketplace-page-bg overflow-hidden">
        <div className="relative z-10">
          <button
            onClick={() => router.back()}
            className="block text-[11px] tracking-[0.22em] uppercase text-[rgba(232,230,221,0.65)] hover:text-[#E8E6DD] transition-colors mb-[14px]"
          >
            ‹ Back
          </button>

          {/* Compact header: Marketplace as a small button + balance + region */}
          <div className="flex flex-wrap items-center gap-[10px] mb-[22px]">
            <span
              className="inline-flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13px] tracking-[0.18em] uppercase font-semibold transition-all hover:scale-[1.04] cursor-default"
              style={{
                background: 'rgba(255, 209, 102,0.12)',
                border: '1px solid rgba(255, 209, 102,0.45)',
                color: 'var(--terracotta)',
              }}
            >
              <span className="opacity-70 text-[11px]">04</span>
              <span>Marketplace</span>
            </span>

            <span
              className="inline-flex items-center gap-[7px] px-[14px] py-[8px] rounded-full text-[12px] uppercase backdrop-blur-md transition-all hover:scale-[1.04]"
              style={{
                background: 'rgba(94, 234, 212, 0.10)',
                border: '1px solid rgba(94, 234, 212, 0.40)',
              }}
            >
              <span className="tracking-[0.14em] text-[rgba(232,230,221,0.7)]">Balance</span>
              <span className="font-semibold text-[var(--seafoam)]">{balance.toLocaleString()}</span>
              <span className="text-[var(--seafoam)]">✦</span>
            </span>

            <span className="inline-flex items-center gap-[7px] text-[12px] uppercase">
              <span className="tracking-[0.14em] text-[rgba(232,230,221,0.7)]">Region</span>
              <LocationPicker compact />
            </span>
          </div>

          {/* Filter buttons — zoom on hover */}
          <div className="flex flex-wrap items-center gap-[8px] mb-[22px]">
            {CATEGORIES.map(c => {
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className="px-[16px] py-[10px] text-[12px] tracking-[0.14em] uppercase rounded-full whitespace-nowrap transition-all duration-200 hover:scale-[1.08]"
                  style={
                    active
                      ? { background: 'rgba(255, 209, 102,0.14)', color: 'var(--terracotta)', border: '1px solid rgba(255, 209, 102,0.45)', fontWeight: 600 }
                      : { color: 'rgba(232,230,221,0.78)', border: '1px solid rgba(232,230,221,0.16)', background: 'rgba(255,255,255,0.015)' }
                  }
                >
                  {c.label}
                </button>
              );
            })}
            <span className="w-px h-[20px] bg-[rgba(232,230,221,0.15)] mx-1 flex-shrink-0" />
            {(['beginner', 'intermediate', 'advanced'] as const).map(d => {
              const active = difficulty === d;
              const tone   = DIFFICULTY_TONE[d];
              const label  = d === 'intermediate' ? 'Mid' : d.charAt(0).toUpperCase() + d.slice(1);
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(active ? 'all' : d)}
                  className="px-[14px] py-[9px] text-[11px] tracking-[0.18em] uppercase font-medium rounded-full whitespace-nowrap transition-all duration-200 hover:scale-[1.08]"
                  style={{
                    border: `1px solid ${active ? tone.border : 'rgba(232,230,221,0.18)'}`,
                    background: active ? tone.bg : 'rgba(255,255,255,0.015)',
                    color: active ? tone.color : 'rgba(232,230,221,0.78)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Featured on the LEFT, grid of remaining products on the RIGHT */}
          {featured && remaining.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,460px)_1fr] gap-[18px] items-start">
              <FeaturedProduct product={featured} dealerName={showDealer ? getDealerName(featured.dealerId) : ''} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px] content-start">
                {remaining.map(p => (
                  <ProductCard key={p.id} product={p} dealerName={showDealer ? getDealerName(p.dealerId) : ''} />
                ))}
              </div>
            </div>
          ) : featured ? (
            <FeaturedProduct product={featured} dealerName={showDealer ? getDealerName(featured.dealerId) : ''} />
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[12px]">
              {visible.map(p => (
                <ProductCard key={p.id} product={p} dealerName={showDealer ? getDealerName(p.dealerId) : ''} />
              ))}
            </div>
          ) : (
            <p className="text-center text-[13px] tracking-[0.14em] uppercase text-[rgba(232,230,221,0.7)] py-12">
              No items match these filters
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
