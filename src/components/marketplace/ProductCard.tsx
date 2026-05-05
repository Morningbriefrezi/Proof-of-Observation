'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/dealers';

const DIFFICULTY_TAG: Record<'beginner' | 'intermediate' | 'advanced', { bg: string; color: string; abbr: string }> = {
  beginner:     { bg: 'rgba(94, 234, 212,0.14)',  color: 'var(--seafoam)',     abbr: 'Beg' },
  intermediate: { bg: 'rgba(255, 209, 102,0.14)', color: 'var(--terracotta)', abbr: 'Mid' },
  advanced:     { bg: 'rgba(255, 209, 102,0.14)', color: 'var(--terracotta)', abbr: 'Adv' },
};

const formatPrice = (p: Product): string => {
  const n = p.price % 1 !== 0 ? p.price.toFixed(2) : p.price.toLocaleString();
  return `${n} ${p.currency}`;
};

interface Props {
  product: Product;
  dealerName: string;
}

export default function ProductCard({ product, dealerName }: Props) {
  const tag = product.skillLevel ? DIFFICULTY_TAG[product.skillLevel] : null;
  const checkoutHref = (mode: 'sol' | 'stars') =>
    `/marketplace/checkout?id=${encodeURIComponent(product.id)}&mode=${mode}`;

  return (
    <div
      className="group relative flex flex-col rounded-lg p-[12px] transition-all duration-200 hover:scale-[1.03] hover:-translate-y-[2px]"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '0.5px solid rgba(232,230,221,0.07)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 209, 102,0.35)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,230,221,0.07)'; }}
    >
      {tag && (
        <span
          className="absolute top-[8px] left-[8px] z-10 px-[7px] py-[3px] rounded-[4px] text-[9px] tracking-[0.18em] uppercase font-semibold"
          style={{ background: tag.bg, color: tag.color }}
        >
          {tag.abbr}
        </span>
      )}
      <a
        href={product.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`View ${product.name} on dealer site`}
      >
        <div
          className="relative w-full aspect-[1.3] rounded-md mb-[8px] overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255, 209, 102,0.05) 0%, transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          }}
        >
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 220px"
              style={{ objectFit: 'contain', padding: '14px' }}
              unoptimized
            />
          )}
        </div>
        <p className="text-[14px] font-medium text-[#E8E6DD] leading-[1.25] truncate mb-[3px] group-hover:text-white transition-colors">
          {product.name}
        </p>
        <p className="text-[10px] tracking-[0.16em] uppercase text-[rgba(232,230,221,0.65)] mb-[8px] truncate">
          {dealerName || product.category}
        </p>
      </a>
      <div
        className="flex justify-between items-center pt-[8px] mb-[10px]"
        style={{ borderTop: '0.5px solid rgba(232,230,221,0.1)' }}
      >
        <span className="text-[15px] font-semibold text-[var(--terracotta)] transition-all group-hover:scale-[1.06] group-hover:text-[#FFE08A] origin-left">
          {formatPrice(product)}
        </span>
        <span className="text-[11px] tracking-[0.14em] uppercase font-semibold text-[var(--seafoam)] transition-all group-hover:scale-[1.06] origin-right">
          ✦ {product.starsPrice.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-[6px]">
        <Link
          href={checkoutHref('sol')}
          className="flex-1 text-center px-[8px] py-[8px] rounded-md text-[11px] tracking-[0.14em] uppercase font-semibold transition-all hover:scale-[1.05] hover:brightness-125"
          style={{
            background: 'rgba(255, 209, 102, 0.10)',
            border: '0.5px solid rgba(255, 209, 102, 0.45)',
            color: 'var(--terracotta)',
          }}
          aria-label={`Pay for ${product.name} with SOL`}
        >
          Pay SOL
        </Link>
        <Link
          href={checkoutHref('stars')}
          className="flex-1 text-center px-[8px] py-[8px] rounded-md text-[11px] tracking-[0.14em] uppercase font-semibold transition-all hover:scale-[1.05] hover:brightness-125"
          style={{
            background: 'rgba(94, 234, 212, 0.10)',
            border: '0.5px solid rgba(94, 234, 212, 0.45)',
            color: 'var(--seafoam)',
          }}
          aria-label={`Redeem ${product.name} with stars`}
        >
          Pay Stars
        </Link>
      </div>
    </div>
  );
}
