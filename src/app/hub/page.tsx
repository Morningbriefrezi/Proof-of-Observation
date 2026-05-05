'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sun, TrendingUp, Target, Sparkles, BookOpen, Globe, MessageCircle,
  Trophy, Gem, Telescope, ShoppingBag, Search, User, ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SearchModal from '@/components/shared/SearchModal';
import { useDisplayProfile } from '@/hooks/useDisplayProfile';

type FeatureItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  caption: string;
  description: string;
};

const PRIMARY: FeatureItem[] = [
  {
    href: '/sky',
    label: 'Sky forecast',
    icon: Sun,
    caption: '7-day outlook',
    description: 'Cloud cover, transparency and planet rise/set for tonight and the week ahead.',
  },
  {
    href: '/markets',
    label: 'Markets',
    icon: TrendingUp,
    caption: 'Sky predictions',
    description: 'Bet on tonight’s clears, comet brightness and transit visibility — paid in Stars.',
  },
  {
    href: '/missions',
    label: 'Missions',
    icon: Target,
    caption: 'Observation tasks',
    description: 'Earn Stars by aiming your scope at verified targets when conditions allow.',
  },
  {
    href: '/chat',
    label: 'ASTRA AI',
    icon: MessageCircle,
    caption: 'Space companion',
    description: 'Ask anything about the night sky, your gear, or what is worth observing now.',
  },
];

const YOU: FeatureItem[] = [
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
    caption: 'Account',
    description: 'Wallet, identity and preferences.',
  },
  {
    href: '/club',
    label: 'My telescope',
    icon: Telescope,
    caption: 'Gear',
    description: 'Your scopes, eyepieces and observing log.',
  },
  {
    href: '/nfts',
    label: 'Discoveries',
    icon: Gem,
    caption: 'On-chain record',
    description: 'Verified observations minted as attestations.',
  },
];

const MORE: FeatureItem[] = [
  {
    href: '/feed',
    label: 'Feed',
    icon: Sparkles,
    caption: 'Community',
    description: 'Recent discoveries from observers worldwide.',
  },
  {
    href: '/learn',
    label: 'Learning',
    icon: BookOpen,
    caption: 'Lessons',
    description: 'Constellations, telescopes, solar system.',
  },
  {
    href: '/network',
    label: 'Network',
    icon: Globe,
    caption: 'Astronomers',
    description: 'Find observers near you.',
  },
  {
    href: '/leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
    caption: 'Standings',
    description: 'Top observers this month.',
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    icon: ShoppingBag,
    caption: 'Astroman shop',
    description: 'Telescopes, eyepieces and mounts.',
  },
];

export default function HubPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { authenticated, firstName } = useDisplayProfile();
  const greeting = authenticated ? `Welcome back, ${firstName}.` : 'Welcome to Stellar.';

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-8 sm:mb-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <div
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-white/40 mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Hub
              </div>
              <h1
                className="text-[24px] sm:text-[32px] leading-[1.1] text-white tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {greeting}
              </h1>
              <p className="mt-2 text-[13px] sm:text-[14px] text-[#A8B4C8] max-w-xl">
                Everything Stellar in one place — sky data, missions, markets and your gear.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-left text-[#A8B4C8] hover:border-white/[0.16] hover:bg-white/[0.04] transition-colors"
            aria-label="Open search"
          >
            <Search size={16} strokeWidth={1.8} />
            <span className="text-[13px] sm:text-[14px]">Search the sky, markets, missions, products…</span>
            <span
              className="ml-auto hidden sm:inline-flex items-center gap-1 text-[11px] text-white/40 px-1.5 py-0.5 rounded border border-white/[0.08]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ⌘K
            </span>
          </button>
        </header>

        <SectionLabel>Explore</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 sm:mb-10">
          {PRIMARY.map((item) => (
            <FeatureCard key={item.href} item={item} variant="primary" />
          ))}
        </div>

        <SectionLabel>You</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 sm:mb-10">
          {YOU.map((item) => (
            <FeatureCard key={item.href} item={item} variant="compact" />
          ))}
        </div>

        <SectionLabel>More</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {MORE.map((item) => (
            <FeatureRow key={item.href} item={item} />
          ))}
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2
        className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-white/40"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function FeatureCard({ item, variant }: { item: FeatureItem; variant: 'primary' | 'compact' }) {
  const Icon = item.icon;
  const isPrimary = variant === 'primary';
  return (
    <Link
      href={item.href}
      className="group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04] transition-colors no-underline overflow-hidden"
    >
      <div className={isPrimary ? 'p-4 sm:p-5' : 'p-4'}>
        <div className="flex items-start justify-between mb-3">
          <div
            className={`${isPrimary ? 'w-10 h-10' : 'w-9 h-9'} rounded-lg bg-[#FFD166]/[0.08] border border-[#FFD166]/[0.16] flex items-center justify-center shrink-0`}
          >
            <Icon size={isPrimary ? 18 : 16} strokeWidth={1.8} color="#FFD166" />
          </div>
          <ArrowUpRight
            size={16}
            strokeWidth={1.6}
            className="text-white/30 group-hover:text-white/70 transition-colors"
          />
        </div>
        <div
          className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#FFD166]/80 mb-1.5"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {item.caption}
        </div>
        <div className="text-[15px] sm:text-[16px] text-white font-medium leading-tight mb-1.5">
          {item.label}
        </div>
        <p className={`text-[12px] sm:text-[13px] text-[#A8B4C8] leading-snug ${isPrimary ? '' : 'line-clamp-2'}`}>
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function FeatureRow({ item }: { item: FeatureItem }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group flex items-center gap-3 px-3.5 py-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04] transition-colors no-underline"
    >
      <div className="w-9 h-9 rounded-lg bg-[#FFD166]/[0.08] border border-[#FFD166]/[0.16] flex items-center justify-center shrink-0">
        <Icon size={15} strokeWidth={1.8} color="#FFD166" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] sm:text-[14px] text-white font-medium leading-tight">
          {item.label}
        </div>
        <div className="text-[11px] sm:text-[12px] text-[#A8B4C8] leading-tight mt-0.5 truncate">
          {item.description}
        </div>
      </div>
      <ArrowUpRight
        size={14}
        strokeWidth={1.6}
        className="text-white/25 group-hover:text-white/70 transition-colors shrink-0"
      />
    </Link>
  );
}
