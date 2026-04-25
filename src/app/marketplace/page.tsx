'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAppState } from '@/hooks/useAppState';
import { useLocation } from '@/lib/location';
import { useTranslations } from 'next-intl';
import LocationPicker from '@/components/LocationPicker';
import { getProductsByRegion, getDealersByRegion, GLOBAL_FALLBACK } from '@/lib/dealers';
import BackButton from '@/components/shared/BackButton';
import ProductCard from '@/components/marketplace/ProductCard';
import PageContainer from '@/components/layout/PageContainer';

type CategoryFilter = 'all' | 'telescope' | 'eyepiece' | 'binocular' | 'accessory';

const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'telescope', label: 'Telescopes' },
  { key: 'eyepiece', label: 'Eyepieces' },
  { key: 'binocular', label: 'Binoculars' },
  { key: 'accessory', label: 'Accessories' },
];

type RedeemTier = {
  stars: number;
  reward: string;
  sub?: string;
  apiTier: string;
};

const REDEEM_TIERS: RedeemTier[] = [
  { stars: 250, reward: '10% off any telescope', apiTier: '10% Telescope Discount' },
  { stars: 500, reward: 'Free Moon Lamp', sub: 'worth 85 GEL', apiTier: 'Free Moon Lamp' },
  { stars: 1000, reward: '20% off premium telescope', apiTier: '20% Telescope Discount' },
];

export default function MarketplacePage() {
  const { authenticated, login, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const { state } = useAppState();
  const { location } = useLocation();
  const t = useTranslations('marketplace');
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [starsBalance, setStarsBalance] = useState<number | null>(null);
  const [revealedCodes, setRevealedCodes] = useState<Record<string, string>>({});
  const [claiming, setClaiming] = useState<Record<string, boolean>>({});

  const solanaWallet = wallets.find(w => (w as { chainType?: string }).chainType === 'solana');
  const address = solanaWallet?.address ?? state.walletAddress ?? null;

  useEffect(() => {
    if (!address) return;
    fetch(`/api/stars-balance?address=${encodeURIComponent(address)}`)
      .then(r => r.json()).then(d => setStarsBalance(d.balance)).catch(() => {});
  }, [address]);

  const dealers = getDealersByRegion(location.region);
  const allProducts = getProductsByRegion(location.region);
  const showDealer = dealers.length > 1;

  const products = filter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === filter);

  function getDealerName(dealerId: string): string {
    return dealers.find(d => d.id === dealerId)?.name ?? dealerId;
  }

  const telescopesByTier = {
    beginner: products.filter(p => p.category === 'telescope' && p.skillLevel === 'beginner'),
    intermediate: products.filter(p => p.category === 'telescope' && (p.skillLevel === 'intermediate' || (!p.skillLevel && p.price >= 100 && p.price <= 500))),
    advanced: products.filter(p => p.category === 'telescope' && (p.skillLevel === 'advanced' || (!p.skillLevel && p.price > 500))),
  };
  const nonTelescopes = products.filter(p => p.category !== 'telescope');
  const isTelescopeView = filter === 'all' || filter === 'telescope';

  async function handleRedeem(tier: RedeemTier) {
    if (!address) return;
    setClaiming(prev => ({ ...prev, [tier.apiTier]: true }));
    try {
      const token = await getAccessToken().catch(() => null);
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tier: tier.apiTier, walletAddress: address }),
      });
      if (!res.ok) return;
      const { code } = await res.json();
      navigator.clipboard.writeText(code).catch(() => {});
      setRevealedCodes(prev => ({ ...prev, [tier.apiTier]: code }));
    } finally {
      setClaiming(prev => ({ ...prev, [tier.apiTier]: false }));
    }
  }

  return (
    <PageContainer variant="wide" className="py-6 animate-page-enter">
      <BackButton />

      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl mb-10 px-6 sm:px-10 py-12"
        style={{
          background:
            'radial-gradient(circle at 0% 100%, rgba(20,184,166,0.10), transparent 55%), rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-center">
          <div className="md:col-span-3">
            <p
              className="text-[11px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: '#5EEAD4', fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
            >
              Powered by Astroman
            </p>
            <h1
              className="text-4xl sm:text-5xl text-white mt-3 leading-tight"
              style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 500 }}
            >
              Real shop. Real gear. Real loop.
            </h1>
            <p className="text-lg text-slate-300 mt-4 max-w-md leading-relaxed">
              Astroman has sold telescopes in Georgia since 2019. Stars earned on Stellar
              redeem here for the same products our cash customers buy. This isn&apos;t a
              digital perks program — it&apos;s a retailer using Solana to reward an
              existing community.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6">
              {[
                { num: '60,000+', label: 'Followers' },
                { num: 'Tbilisi', label: 'Physical store' },
                { num: 'Since 2019', label: 'Founding year' },
              ].map(s => (
                <div key={s.label}>
                  <p
                    className="text-2xl text-white"
                    style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 500 }}
                  >
                    {s.num}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="https://astroman.ge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-7 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{
                background: 'rgba(20,184,166,0.12)',
                border: '1px solid rgba(20,184,166,0.25)',
                color: '#5EEAD4',
              }}
            >
              Visit Astroman.ge <span aria-hidden>↗</span>
            </a>
          </div>

          <aside className="md:col-span-2">
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
              >
                What you can redeem
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Beginner telescopes from 35 GEL',
                  'Premium instruments up to 2,500 GEL',
                  'Eyepieces, filters, mounts, tripods',
                  'All redeemable with Stars',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                    <span
                      className="mt-1.5 flex-shrink-0 rounded-full"
                      style={{ width: 4, height: 4, background: '#FFD166' }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}>
          {t('title')}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Your region:</span>
          <LocationPicker compact />
        </div>
      </div>

      {/* Stars redemption tiers */}
      <section className="mb-8">
        <h3
          className="text-2xl text-white mb-4"
          style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 500 }}
        >
          Redeem Stars for gear
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REDEEM_TIERS.map(tier => {
            const balance = starsBalance ?? 0;
            const unlocked = authenticated && balance >= tier.stars;
            const code = revealedCodes[tier.apiTier];
            const isClaiming = !!claiming[tier.apiTier];
            return (
              <div
                key={tier.apiTier}
                className="flex flex-col p-6 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: unlocked
                    ? '1px solid rgba(255,209,102,0.3)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p className="text-3xl leading-none" style={{ color: '#FFD166' }}>✦</p>
                <p
                  className="text-2xl text-white font-bold mt-3"
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
                >
                  {tier.stars.toLocaleString()} ✦
                </p>
                <p className="text-base text-slate-300 mt-2 leading-snug">
                  {tier.reward}
                  {tier.sub && (
                    <span className="block text-xs text-slate-500 mt-1">({tier.sub})</span>
                  )}
                </p>

                <div className="mt-auto pt-5">
                  {!authenticated ? (
                    <button
                      onClick={login}
                      className="w-full py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      Sign in to redeem
                    </button>
                  ) : code ? (
                    <p
                      className="text-xs text-center py-2 rounded-xl"
                      style={{
                        background: 'rgba(52,211,153,0.1)',
                        border: '1px solid rgba(52,211,153,0.25)',
                        color: '#34d399',
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      }}
                    >
                      Code copied: <strong>{code}</strong>
                    </p>
                  ) : unlocked ? (
                    <button
                      onClick={() => handleRedeem(tier)}
                      disabled={isClaiming}
                      className="w-full py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
                      style={{
                        background: 'linear-gradient(135deg, #14B8A6, #0E8A7C)',
                        color: '#04201D',
                      }}
                    >
                      {isClaiming ? 'Claiming…' : 'Redeem now'}
                    </button>
                  ) : (
                    <a
                      href="/sky"
                      className="block text-center text-xs py-2 rounded-xl transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.55)',
                      }}
                    >
                      Earn more — start a mission
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Redemption codes are valid 90 days at Astroman.ge or in-store.
        </p>
      </section>

      {/* Category filter — glassy pill container */}
      <div
        className="mb-3 p-1 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex overflow-x-auto scrollbar-hide gap-1">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-shrink-0 flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center min-w-[60px]"
              style={
                filter === f.key
                  ? { background: 'rgba(52,211,153,0.18)', color: '#34d399', boxShadow: 'inset 0 0 0 1px rgba(52,211,153,0.3)' }
                  : { color: 'rgba(255,255,255,0.65)' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tier shortcut pills — small, only for telescope/all views */}
      {isTelescopeView && (
        <div className="flex gap-1.5 mb-5">
          <a href="#tier-beginner" className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
            Beginner
          </a>
          <a href="#tier-intermediate" className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
            Mid
          </a>
          <a href="#tier-advanced" className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>
            Advanced
          </a>
        </div>
      )}

      {/* Product grid */}
      {products.length === 0 && filter !== 'all' ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-white font-semibold">
              No {CATEGORY_FILTERS.find(f => f.key === filter)?.label.toLowerCase()} available in your region yet.
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Showing all products instead
            </p>
            <button
              onClick={() => setFilter('all')}
              className="text-xs px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              Clear filter
            </button>
          </div>
          <div className="grid gap-3 grid-cols-2">
            {GLOBAL_FALLBACK.map(p => (
              <ProductCard key={p.id} product={p} showDealer={false} dealerName="Astroman" />
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-white font-semibold">No stores in your region yet</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Products from Astroman ship worldwide.
            </p>
          </div>
          <div className="grid gap-3 grid-cols-2">
            {GLOBAL_FALLBACK.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                showDealer={false}
                dealerName="Astroman"
              />
            ))}
          </div>
        </div>
      ) : isTelescopeView ? (
        <div className="flex flex-col gap-8">
          {/* Beginner tier */}
          {telescopesByTier.beginner.length > 0 && (
            <div id="tier-beginner">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 3, height: 18, borderRadius: 2, background: '#34d399' }} />
                <p className="text-sm font-semibold" style={{ color: '#34d399' }}>Beginner</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>First telescope · Easy setup</p>
              </div>
              <div className="grid gap-3 grid-cols-2">
                {telescopesByTier.beginner.map((p, i) => (
                  <ProductCard key={p.id} product={p} showDealer={showDealer} dealerName={getDealerName(p.dealerId)} priority={i === 0} />
                ))}
              </div>
            </div>
          )}
          {/* Intermediate tier */}
          {telescopesByTier.intermediate.length > 0 && (
            <div id="tier-intermediate">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 3, height: 18, borderRadius: 2, background: '#F59E0B' }} />
                <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Intermediate</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>More aperture · Better optics</p>
              </div>
              <div className="grid gap-3 grid-cols-2">
                {telescopesByTier.intermediate.map(p => (
                  <ProductCard key={p.id} product={p} showDealer={showDealer} dealerName={getDealerName(p.dealerId)} />
                ))}
              </div>
            </div>
          )}
          {/* Advanced tier */}
          {telescopesByTier.advanced.length > 0 && (
            <div id="tier-advanced">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 3, height: 18, borderRadius: 2, background: '#8B5CF6' }} />
                <p className="text-sm font-semibold" style={{ color: '#8B5CF6' }}>Advanced</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>GoTo mounts · Deep sky capable</p>
              </div>
              <div className="grid gap-3 grid-cols-2">
                {telescopesByTier.advanced.map(p => (
                  <ProductCard key={p.id} product={p} showDealer={showDealer} dealerName={getDealerName(p.dealerId)} />
                ))}
              </div>
            </div>
          )}
          {/* Non-telescope items if filter === 'all' */}
          {filter === 'all' && nonTelescopes.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 3, height: 18, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Accessories & More</p>
              </div>
              <div className="grid gap-3 grid-cols-2">
                {nonTelescopes.map(p => (
                  <ProductCard key={p.id} product={p} showDealer={showDealer} dealerName={getDealerName(p.dealerId)} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              showDealer={showDealer}
              dealerName={getDealerName(p.dealerId)}
              priority={i === 0}
            />
          ))}
        </div>
      )}

      {/* Founder testimonial */}
      <section className="mt-16 mb-10 max-w-2xl mx-auto text-center">
        <p className="text-xs italic text-slate-500 mb-4 tracking-wider uppercase">
          From the founder
        </p>
        <blockquote
          className="text-xl text-white leading-relaxed"
          style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 400 }}
        >
          &ldquo;I&apos;ve watched my customers ask whether comets are coming back, whether
          meteor showers will peak strong, whether tonight is worth setting up a scope.
          They&apos;ve never had a way to record those predictions. Stellar is that record.
          And when they&apos;re right, they get something real back — the gear they&apos;ve
          been browsing.&rdquo;
        </blockquote>
        <p className="text-sm text-slate-400 mt-4">— Rezi, founder of Astroman &amp; Stellar</p>
      </section>

      {/* Partner banner */}
      <div
        className="mt-10 py-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p className="text-white font-semibold text-sm mb-1">Become a Partner Store</p>
        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Sell your telescopes to astronomers worldwide through Stellar.
        </p>
        <a
          href="mailto:rezi@astroman.ge"
          className="text-xs"
          style={{ color: '#34d399' }}
        >
          Contact us →
        </a>
      </div>
    </PageContainer>
  );
}
