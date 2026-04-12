'use client';

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

const TrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'inline' }}>
    <path d="M2 8L5 5L7 7L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 4H10V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'inline' }}>
    <path d="M2 4L5 7L7 5L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 8H10V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function StatCard({
  icon,
  label,
  value,
  suffix,
  trend,
  trendValue,
  accentColor = 'var(--accent)',
  onClick,
  className = '',
}: StatCardProps) {
  const trendColor =
    trend === 'up' ? 'var(--success)' :
    trend === 'down' ? 'var(--error)' :
    'var(--text-muted)';

  return (
    <div
      className={`card-base ${className}`}
      onClick={onClick}
      style={{
        padding: 16,
        position: 'relative',
        cursor: onClick ? 'pointer' : undefined,
        overflow: 'hidden',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.01)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 8,
          bottom: 8,
          width: 2,
          borderRadius: 1,
          background: accentColor,
        }}
      />
      {/* Content */}
      <div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon && (
            <span style={{ opacity: 0.5, display: 'flex', width: 16, height: 16, alignItems: 'center' }}>
              {icon}
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
            }}
          >
            {label}
          </span>
        </div>
        {/* Value row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 24,
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {value}
          </span>
          {suffix && (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginLeft: 2,
              }}
            >
              {suffix}
            </span>
          )}
        </div>
        {/* Trend row */}
        {trend && trendValue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor }}>
            {trend === 'up' ? <TrendUp /> : trend === 'down' ? <TrendDown /> : null}
            <span style={{ fontSize: 11, fontFamily: 'var(--font-body)' }}>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
