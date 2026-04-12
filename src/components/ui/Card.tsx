'use client';

import React from 'react';

// ---- Card ----------------------------------------------------------------

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glow?: 'accent' | 'stars' | false;
  className?: string;
}

const paddingMap = { none: 0, sm: 12, md: 16, lg: 24 };

export function Card({
  children,
  hover = true,
  onClick,
  padding = 'md',
  glow = false,
  className = '',
}: CardProps) {
  const glowClass = glow === 'accent' ? 'glow-accent' : glow === 'stars' ? 'glow-stars' : '';

  return (
    <div
      className={`card-base ${glowClass} ${className}`}
      onClick={onClick}
      style={{
        padding: paddingMap[padding],
        cursor: onClick ? 'pointer' : undefined,
        // Disable hover transform when hover=false
        ...(hover === false ? { transform: 'none' } : {}),
      }}
      // Suppress hover when explicitly disabled
      onMouseEnter={
        hover === false
          ? (e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; }
          : undefined
      }
    >
      {children}
    </div>
  );
}

// ---- CardBadge -----------------------------------------------------------

type BadgeVariant = 'default' | 'accent' | 'stars' | 'success' | 'warning' | 'error';

const badgeVariantClass: Record<BadgeVariant, string> = {
  default: 'badge-muted',
  accent: 'badge-accent',
  stars: 'badge-stars',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
};

interface CardBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function CardBadge({ children, variant = 'default' }: CardBadgeProps) {
  return <span className={`badge-pill ${badgeVariantClass[variant]}`}>{children}</span>;
}

// ---- CardStat ------------------------------------------------------------

interface CardStatProps {
  label: string;
  value: string | number;
  suffix?: string;
  mono?: boolean;
}

export function CardStat({ label, value, suffix, mono = true }: CardStatProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span
          style={{
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
            fontWeight: 700,
            fontSize: mono ? 18 : 20,
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginLeft: 2,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ---- CardImage -----------------------------------------------------------

type AspectRatio = 'square' | 'video' | 'wide';

const aspectMap: Record<AspectRatio, string> = {
  square: '1 / 1',
  video: '16 / 9',
  wide: '16 / 9',
};

interface CardImageProps {
  src?: string;
  alt?: string;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: AspectRatio;
  overlay?: React.ReactNode;
  className?: string;
}

export function CardImage({
  src,
  alt = '',
  fallbackIcon,
  aspectRatio = 'square',
  overlay,
  className = '',
}: CardImageProps) {
  return (
    <div
      className={className}
      style={{
        aspectRatio: aspectMap[aspectRatio],
        overflow: 'hidden',
        borderRadius: '12px 12px 0 0',
        position: 'relative',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      ) : (
        <span style={{ opacity: 0.2, fontSize: 36 }}>{fallbackIcon}</span>
      )}
      {overlay && (
        <div style={{ position: 'absolute', inset: 0 }}>{overlay}</div>
      )}
    </div>
  );
}
