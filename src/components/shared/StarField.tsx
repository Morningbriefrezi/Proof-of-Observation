'use client';
import { useMemo } from 'react';

export default function StarField() {
  const stars = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 1 + 0.5,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 8,
  })), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
