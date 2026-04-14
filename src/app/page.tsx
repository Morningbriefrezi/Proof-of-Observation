'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import HomeSkyPreview from '@/components/home/HomeSkyPreview';
import { usePrivy } from '@privy-io/react-auth';
import { Telescope, Camera, Star } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';
import PageTransition from '@/components/ui/PageTransition';
import LoadingRing from '@/components/ui/LoadingRing';

export default function HomePage() {
  const t = useTranslations();
  const { ready } = usePrivy();
  const [activeStep, setActiveStep] = useState(0);
  const stepPausedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!stepPausedRef.current) setActiveStep(s => (s + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { icon: Telescope, title: t('home.steps.observe'), desc: t('home.steps.observeDesc') },
    { icon: Camera,    title: t('home.steps.verify'),  desc: t('home.steps.verifyDesc') },
    { icon: Star,      title: t('home.steps.mint'),    desc: t('home.steps.mintDesc') },
  ];

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingRing />
      </div>
    );
  }

  return (
    <PageTransition>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hero-line-1 { opacity: 0; animation: fadeInUp 0.8s ease-out 0.1s forwards; }
          .hero-line-2 { opacity: 0; animation: fadeInUp 0.8s ease-out 0.3s forwards; }
          .hero-line-3 { opacity: 0; animation: fadeInUp 0.8s ease-out 0.5s forwards; }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .earn-rewards-text {
            background: linear-gradient(135deg, #34d399, #38F0FF, #a78bfa, #34d399);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 6s ease infinite;
          }
          @keyframes cosmicGlowPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0), 0 2px 16px rgba(52,211,153,0.06); }
            50% { box-shadow: 0 0 0 4px rgba(52,211,153,0.07), 0 2px 32px rgba(52,211,153,0.18); }
          }
          .step-card-active { animation: cosmicGlowPulse 3s ease-in-out infinite; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-line-1, .hero-line-2, .hero-line-3 { opacity: 1; }
          .earn-rewards-text {
            background: linear-gradient(135deg, #34d399, #38F0FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
        .hiw-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .hiw-scroll::-webkit-scrollbar { display: none; }
        .hiw-card { flex: 0 0 72%; scroll-snap-align: center; min-height: 150px; }
        @media (min-width: 640px) {
          .hiw-scroll { display: grid; grid-template-columns: repeat(3, 1fr); overflow-x: visible; scroll-snap-type: none; }
          .hiw-card { flex: none; }
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100dvh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#070B14',
        }}
      >
        {/* Ambient glow orbs */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, rgba(56,240,255,0.03) 30%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '60%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24, padding: '16px 16px 32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
            <span className="hero-line-1" style={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>Observe the</span>
            <span className="hero-line-2" style={{ display: 'block', color: '#34d399' }}>Night Sky.</span>
            <span className="hero-line-3 earn-rewards-text" style={{ display: 'block' }}>Earn rewards.</span>
          </h1>

          <p style={{ maxWidth: 440, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0 }}>
            Photograph celestial objects from anywhere in the world. Earn Stars tokens, collect discovery NFTs, and shop telescopes at your local dealer.
          </p>

          <LocationPicker compact />

          <Link href="/missions" className="btn-primary" style={{ textDecoration: 'none', fontSize: 15 }}>
            Start Observing →
          </Link>
        </div>
      </section>

      {/* Remaining sections */}
      <div className="max-w-3xl w-full mx-auto px-4 pt-1 pb-16 sm:pb-12 flex flex-col items-center gap-8 overflow-x-hidden">

        {/* Tonight's Sky Preview */}
        <div style={{ width: '100%', position: 'relative', borderRadius: 20, background: 'rgba(12, 18, 33, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid var(--stellar-border)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)', padding: 24, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'var(--stellar-gradient-sol)', borderRadius: 20 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600, margin: 0 }}>
                  Tonight&apos;s Sky
                </h2>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', fontSize: 11, color: 'rgba(52, 211, 153, 0.9)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
                  Live
                </span>
              </div>
              <Link href="/sky" style={{ color: 'var(--stellar-teal)', fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                View full forecast →
              </Link>
            </div>
            <Suspense fallback={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 38, borderRadius: 12, background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.08)' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  {[0,1,2,3,4].map(i => <div key={i} style={{ minWidth: 140, height: 112, flexShrink: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16 }} />)}
                </div>
              </div>
            }>
              <HomeSkyPreview />
            </Suspense>
          </div>
        </div>

        {/* How It Works — 3-step strip */}
        <div
          id="how-it-works"
          className="w-full"
          onMouseEnter={() => { stepPausedRef.current = true; }}
          onMouseLeave={() => { stepPausedRef.current = false; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {t('home.howItWorks')}
            </span>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }} />
          </div>

          <div className="hiw-scroll">
            {steps.map((item, i) => {
              const active = activeStep === i;
              return (
                <button
                  key={i}
                  className={`hiw-card${active ? ' step-card-active' : ''}`}
                  onClick={() => { setActiveStep(i); stepPausedRef.current = true; }}
                  style={{
                    padding: '22px 18px',
                    borderRadius: 16,
                    background: 'rgba(12, 18, 33, 0.6)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${active ? 'rgba(56, 240, 255, 0.25)' : 'var(--stellar-border)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    transition: 'border-color 0.4s, transform 0.3s',
                    transform: active ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'linear-gradient(135deg, rgba(153,69,255,0.15), rgba(56,240,255,0.15))', color: 'rgba(255,255,255,0.75)', marginBottom: 14, alignSelf: 'flex-start' }}>
                    0{i + 1}
                  </span>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,240,255,0.08) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <item.icon size={20} color={active ? 'rgba(56,240,255,1)' : 'rgba(56,240,255,0.5)'} strokeWidth={1.5} />
                  </div>
                  <p style={{ color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, margin: '0 0 6px', fontFamily: 'var(--font-display)', transition: 'color 0.3s' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                onClick={() => { setActiveStep(i); stepPausedRef.current = true; }}
                style={{ width: activeStep === i ? 20 : 8, height: 8, borderRadius: 4, cursor: 'pointer', background: activeStep === i ? 'var(--stellar-teal)' : 'rgba(255,255,255,0.15)', transition: 'width 0.3s ease, background 0.3s ease' }}
              />
            ))}
          </div>
        </div>

        {/* ASTRA CTA */}
        <div style={{ width: '100%', textAlign: 'center', padding: '8px 0' }}>
          <Link
            href="/chat"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(56,240,255,0.15), rgba(52,211,153,0.15))',
              border: '1px solid rgba(52,211,153,0.3)',
              color: 'white',
              borderRadius: 12,
              padding: '12px 24px',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Ask ASTRA what&apos;s visible tonight →
          </Link>
        </div>

      </div>
    </PageTransition>
  );
}
