'use client';

import { useEffect, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function PageTransition({ children, delay = 0, className = '' }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animationDelay = `${delay}ms`;
    el.classList.add('animate-fade-in');
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
