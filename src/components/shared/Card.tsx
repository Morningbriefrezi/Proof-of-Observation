import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'brass' | 'emerald' | 'cyan' | 'solana' | null;
}

const glowMap = {
  brass: 'border-[#c9a84c]/50 glow-brass',
  emerald: 'border-[#34d399]/50 glow-emerald',
  cyan: 'border-[#22d3ee]/50 glow-cyan',
  solana: 'border-[#9945FF]/50 glow-solana',
};

export default function Card({ children, className = '', glow }: CardProps) {
  return (
    <div className={`
      glass-card p-5 transition-all duration-300
      ${glow ? glowMap[glow] : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
