'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePrivy } from '@privy-io/react-auth';
import { Telescope, Sparkles, ShoppingCart, ChevronDown, CheckCircle, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkyBadge } from '@/components/ui/SkyBadge';
import { useLocation } from '@/lib/location';
import type { PlanetInfo } from '@/lib/planets';
import LoadingRing from '@/components/ui/LoadingRing';

// ── Planet emoji map ──────────────────────────────────────────────────────────

const PLANET_EMOJI: Record<string, string> = {
  moon: '🌙',
  mercury: '☿',
  venus: '✨',
  mars: '🔴',
  jupiter: '🪐',
  saturn: '💫',
};

const PLANET_COLOR: Record<string, string> = {
  moon: '#B0B8CC',
  mercury: '#A0927A',
  venus: '#E8C87A',
  mars: '#EF4444',
  jupiter: '#C4956A',
  saturn: '#E8D5A0',
};

// ── Static product fallback ───────────────────────────────────────────────────

const FEATURED_PRODUCTS = [
  { id: 1, name: 'SkyWatcher 130P', category: 'Telescope', price: '₾649', emoji: '🔭' },
  { id: 2, name: 'Moon Lamp XL', category: 'Accessory', price: '₾89', emoji: '🌕' },
  { id: 3, name: 'Stellarium Atlas', category: 'Digital', price: '₾29', emoji: '🗺️' },
];

// ── Scroll-reveal hook ────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── HomePage ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const { ready } = usePrivy();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { location } = useLocation();
  const [planets, setPlanets] = useState<PlanetInfo[]>([]);
  const [skyCondition] = useState<'go' | 'maybe' | 'skip'>('go');

  useReveal();

  // ── Star field canvas ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let w = 0, h = 0;
    let animId = 0;
    let handleResize: () => void;
    let handleMove: (e: MouseEvent) => void;
    let mouseX = 0, mouseY = 0;

    const init = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      const stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.0,
        o: 0.2 + Math.random() * 0.65,
        speed: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        layer: Math.random(), // 0=near, 1=far (for parallax)
      }));

      let frame = 0;
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        frame++;
        const t = frame * 0.02;
        for (const s of stars) {
          const twinkle = s.o * (0.7 + 0.3 * Math.sin(t * s.speed + s.phase));
          // Parallax offset based on mouse and layer
          const px = (mouseX / w - 0.5) * s.layer * 12;
          const py = (mouseY / h - 0.5) * s.layer * 12;
          ctx.beginPath();
          ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
          ctx.fill();
        }
        animId = requestAnimationFrame(draw);
      };
      draw();

      handleResize = () => {
        w = hero.offsetWidth;
        h = hero.offsetHeight;
        canvas.width = w;
        canvas.height = h;
      };
      handleMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      };
      window.addEventListener('resize', handleResize);
      hero.addEventListener('mousemove', handleMove);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { init(); observer.disconnect(); }
    }, { threshold: 0 });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (handleMove && hero) hero.removeEventListener('mousemove', handleMove);
    };
  }, []);

  // ── Fetch planets ──────────────────────────────────────────────────────────
  useEffect(() => {
    const lat = location?.lat ?? 41.6941;
    const lon = location?.lon ?? 44.8337;
    fetch(`/api/sky/planets?lat=${lat}&lng=${lon}`)
      .then((r) => r.json())
      .then((data: PlanetInfo[]) => {
        const visible = data.filter((p) => p.visible && p.altitude > 5);
        setPlanets(visible.slice(0, 3));
      })
      .catch(() => {});
  }, [location]);

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingRing />
      </div>
    );
  }

  return (
    <>
      {/* ── SECTION 1: Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: 'calc(100dvh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'var(--color-space-black)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />
        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          top: '45%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,240,255,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div
          className="animate-fade-in-up"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
            padding: '24px 20px 48px',
            maxWidth: 640,
          }}
        >
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.75rem, 8vw, 5rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: 0,
            color: 'var(--color-text-primary)',
          }}>
            STELLAR
          </h1>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 420,
          }}>
            {t('home.hero.subtitle')}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/missions">
              <Button variant="primary" size="lg">
                {t('home.hero.ctaObserve')}
              </Button>
            </Link>
            <Link href="/sky">
              <Button variant="secondary" size="lg">
                {t('home.hero.ctaSky')}
              </Button>
            </Link>
          </div>

          <SkyBadge condition={skyCondition} />
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--color-text-muted)',
            zIndex: 1,
          }}
        >
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── SECTION 2: Tonight's Highlights ─────────────────────────────── */}
      <section
        className="reveal"
        style={{
          padding: '64px 20px',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          margin: '0 0 32px',
          position: 'relative',
          display: 'inline-block',
        }}>
          {t('home.tonight.title')}
          <span style={{
            position: 'absolute',
            bottom: -6,
            left: 0,
            height: 2,
            width: '100%',
            background: 'linear-gradient(90deg, var(--color-nebula-teal), transparent)',
            borderRadius: 2,
          }} />
        </h2>

        {planets.length === 0 ? (
          // Static fallback planets
          <div
            className="stagger-children"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
          >
            {[
              { key: 'jupiter', altitude: 45, azimuthDir: 'S', rise: '19:42', set: '03:18' },
              { key: 'saturn', altitude: 28, azimuthDir: 'SE', rise: '22:10', set: '06:45' },
              { key: 'mars', altitude: 18, azimuthDir: 'SW', rise: '20:55', set: '04:30' },
            ].map((p) => (
              <PlanetCard key={p.key} planetKey={p.key} altitude={p.altitude} azimuthDir={p.azimuthDir} rise={p.rise} set={p.set} t={t} />
            ))}
          </div>
        ) : (
          <div
            className="stagger-children"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
          >
            {planets.map((p) => (
              <PlanetCard
                key={p.key}
                planetKey={p.key}
                altitude={Math.round(p.altitude)}
                azimuthDir={p.azimuthDir}
                rise={p.rise instanceof Date ? p.rise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (p.rise ?? null)}
                set={p.set instanceof Date ? p.set.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (p.set ?? null)}
                t={t}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 3: How It Works ──────────────────────────────────────── */}
      <section
        className="reveal"
        style={{
          padding: '64px 20px',
          background: 'var(--color-panel-dark)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            margin: '0 0 48px',
            textAlign: 'center',
          }}>
            {t('home.howItWorks')}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 0,
            position: 'relative',
          }}>
            {/* Connecting dashed line — desktop only */}
            <div style={{
              position: 'absolute',
              top: 40,
              left: '12.5%',
              right: '12.5%',
              height: 1,
              background: 'repeating-linear-gradient(90deg, rgba(56,240,255,0.2) 0, rgba(56,240,255,0.2) 6px, transparent 6px, transparent 14px)',
              zIndex: 0,
            }} className="hiw-line" />

            {[
              {
                icon: <Telescope size={22} />,
                title: t('home.steps.observe'),
                desc: t('home.steps.observeDesc'),
                num: '01',
              },
              {
                icon: <CheckCircle size={22} />,
                title: t('home.steps.verify'),
                desc: t('home.hiw.verifyDesc'),
                num: '02',
              },
              {
                icon: <Star size={22} />,
                title: t('home.hiw.earn'),
                desc: t('home.hiw.earnDesc'),
                num: '03',
              },
              {
                icon: <ShoppingCart size={22} />,
                title: t('home.hiw.spend'),
                desc: t('home.hiw.spendDesc'),
                num: '04',
              },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 12px 24px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Icon circle */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(56,240,255,0.08)',
                  border: '1px solid rgba(56,240,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-nebula-teal)',
                  marginBottom: 16,
                  boxShadow: '0 0 16px rgba(56,240,255,0.08)',
                }}>
                  {step.icon}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.1em',
                  marginBottom: 4,
                }}>
                  {step.num}
                </span>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 8px',
                }}>
                  {step.title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: 160,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <style>{`.hiw-line { display: none; } @media (min-width: 768px) { .hiw-line { display: block; } }`}</style>
      </section>

      {/* ── SECTION 4: ASTRA AI Teaser ───────────────────────────────────── */}
      <section
        className="reveal"
        style={{ padding: '64px 20px', maxWidth: 1100, margin: '0 auto', width: '100%' }}
      >
        <div style={{
          background: 'var(--glass-bg, rgba(15,29,50,0.65))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(56,240,255,0.12)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-glow-teal)',
          padding: 24,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 32,
          alignItems: 'center',
        }}>
          {/* Left */}
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(56,240,255,0.1)',
              border: '1px solid rgba(56,240,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-nebula-teal)',
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                margin: '0 0 8px',
              }}>
                {t('home.astra.title')}
              </h3>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {t('home.astra.subtitle')}
              </p>
            </div>
            <Link href="/chat">
              <Button variant="primary" size="md">
                {t('home.astra.cta')}
              </Button>
            </Link>
          </div>

          {/* Right — mock chat */}
          <div style={{
            flex: '1 1 280px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {/* User bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: 'rgba(56,240,255,0.1)',
                border: '1px solid rgba(56,240,255,0.15)',
                borderRadius: '16px 16px 4px 16px',
                padding: '10px 14px',
                maxWidth: 280,
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
              }}>
                {t('home.astra.mockQ')}
              </div>
            </div>
            {/* ASTRA bubble */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(56,240,255,0.15)',
                border: '1px solid rgba(56,240,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: 'var(--color-nebula-teal)',
                flexShrink: 0,
                marginTop: 2,
              }}>
                ✦
              </div>
              <div style={{
                background: 'rgba(15,29,50,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px 16px 16px 16px',
                padding: '10px 14px',
                maxWidth: 300,
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}>
                {t('home.astra.mockA')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Marketplace Preview ──────────────────────────────── */}
      <section
        className="reveal"
        style={{
          padding: '48px 20px 80px',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            {t('home.market.title')}
          </h2>
          <Link
            href="/marketplace"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-nebula-teal)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            {t('home.market.browse')} →
          </Link>
        </div>

        <div
          className="stagger-children"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
            overflowX: 'auto',
          }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <Card key={product.id} variant="interactive" padding="md">
              {/* Image placeholder */}
              <div style={{
                height: 120,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                marginBottom: 16,
              }}>
                {product.emoji}
              </div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                margin: '0 0 4px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {product.category}
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: '0 0 12px',
              }}>
                {product.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 700,
                  color: 'var(--color-star-gold)',
                }}>
                  {product.price}
                </span>
                <Link href="/marketplace">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

// ── PlanetCard sub-component ──────────────────────────────────────────────────

function PlanetCard({
  planetKey,
  altitude,
  azimuthDir,
  rise,
  set,
  t,
}: {
  planetKey: string;
  altitude: number;
  azimuthDir: string;
  rise: string | null;
  set: string | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const name = t(`planets.${planetKey}` as Parameters<typeof t>[0]);
  const emoji = PLANET_EMOJI[planetKey] ?? '⭐';
  const color = PLANET_COLOR[planetKey] ?? '#ffffff';

  return (
    <Card variant="interactive" padding="md" className="animate-fade-in-up">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Planet header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}>
            {emoji}
          </div>
          <div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              {name}
            </p>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-aurora-green)',
              fontWeight: 500,
            }}>
              {t('planets.visibleNow')}
            </span>
          </div>
        </div>
        {/* Altitude badge */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 6,
            padding: '2px 8px',
          }}>
            {altitude}° {azimuthDir}
          </span>
        </div>
        {/* Rise / Set */}
        {(rise || set) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: 10,
          }}>
            {rise && (
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {t('planets.rise')}
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {typeof rise === 'string' ? rise : '—'}
                </p>
              </div>
            )}
            {set && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {t('planets.set')}
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {typeof set === 'string' ? set : '—'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
