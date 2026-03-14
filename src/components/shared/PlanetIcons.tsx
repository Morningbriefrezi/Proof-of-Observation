import { Sparkles } from 'lucide-react';

interface IconProps { size?: number }

export function MoonIcon({ size = 40 }: IconProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #e8e8d0 0%, #c9c9b0 50%, #a0a090 100%)',
      boxShadow: '0 0 14px rgba(232,232,208,0.3), inset -4px -4px 8px rgba(0,0,0,0.3)',
      flexShrink: 0,
    }} />
  );
}

export function JupiterIcon({ size = 40 }: IconProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(180deg, #d4a574 0%, #c4855c 28%, #d4a574 48%, #8b6042 68%, #d4a574 100%)',
      boxShadow: '0 0 14px rgba(212,165,116,0.3)',
      flexShrink: 0,
    }} />
  );
}

export function SaturnIcon({ size = 40 }: IconProps) {
  return (
    <div style={{ position: 'relative', width: size * 1.6, height: size, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size * 0.72, height: size * 0.72, borderRadius: '50%',
        background: 'linear-gradient(180deg, #e8d5a0 0%, #c4a56a 100%)',
        boxShadow: '0 0 10px rgba(232,213,160,0.3)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-22deg)',
        width: size * 1.5, height: size * 0.14, borderRadius: '50%',
        border: '2px solid rgba(200,180,140,0.55)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export function NebulaIcon({ size = 40 }: IconProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(217,70,239,0.35), rgba(124,58,237,0.25), transparent)',
      boxShadow: '0 0 20px rgba(217,70,239,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Sparkles size={size * 0.5} style={{ color: '#e879f9' }} />
    </div>
  );
}

export function PleiadesIcon({ size = 40 }: IconProps) {
  const dots = [
    [0.3, 0.2], [0.62, 0.14], [0.5, 0.44], [0.22, 0.5],
    [0.72, 0.54], [0.38, 0.72], [0.56, 0.82],
  ];
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {dots.map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${x * 100}%`, top: `${y * 100}%`,
          width: i < 3 ? 4 : 3, height: i < 3 ? 4 : 3,
          borderRadius: '50%', background: '#e0e7ff',
          boxShadow: '0 0 6px rgba(224,231,255,0.7)',
          transform: 'translate(-50%,-50%)',
        }} />
      ))}
    </div>
  );
}

// Map mission id → planet icon
export function MissionIcon({ id, size = 40 }: { id: string; size?: number }) {
  switch (id) {
    case 'moon': return <MoonIcon size={size} />;
    case 'jupiter': return <JupiterIcon size={size} />;
    case 'saturn': return <SaturnIcon size={size} />;
    case 'orion': return <NebulaIcon size={size} />;
    case 'pleiades': return <PleiadesIcon size={size} />;
    default: return <span style={{ fontSize: size * 0.7 }}>✨</span>;
  }
}
