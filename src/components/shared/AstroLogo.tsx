'use client';
import { useState } from 'react';

export default function AstroLogo({ className = 'h-8 w-8' }: { className?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="text-2xl">🔭</span>;
  return (
    <img
      src="https://club.astroman.ge/logo.png"
      alt="Astroman"
      className={className}
      onError={() => setErr(true)}
    />
  );
}
