import type { CSSProperties } from 'react';

export type PlanetSize = 'small' | 'medium' | 'large';

const SCALE: Record<PlanetSize, number> = {
  small: 0.55,
  medium: 0.75,
  large: 1,
};

const BOX: Record<PlanetSize, number> = {
  small: 28,
  medium: 36,
  large: 52,
};

export function PlanetViz({ name, size = 'large' }: { name: string; size?: PlanetSize }) {
  const key = name.toLowerCase();
  const art = (() => {
    switch (key) {
      case 'venus':     return <div className="planet-venus" />;
      case 'mars':      return <div className="planet-mars" />;
      case 'jupiter':   return <div className="planet-jupiter" />;
      case 'saturn':
        return (
          <div className="planet-saturn-wrap">
            <div className="planet-saturn" />
            <div className="planet-ring" />
          </div>
        );
      case 'mercury':   return <div className="planet-mercury" />;
      case 'moon':      return <div className="planet-moon" />;
      case 'neptune':
      case 'uranus':    return <div className="planet-neptune" />;
      case 'pleiades':  return <div className="planet-cluster" />;
      case 'orion':     return <div className="planet-nebula" />;
      case 'andromeda': return <div className="planet-galaxy" />;
      case 'crab':      return <div className="planet-remnant" />;
      default:          return <div className="planet-mercury" />;
    }
  })();

  if (size === 'large') return art;

  const wrapper: CSSProperties = {
    width: BOX[size],
    height: BOX[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  const inner: CSSProperties = {
    transform: `scale(${SCALE[size]})`,
    transformOrigin: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <span style={wrapper}>
      <span style={inner}>{art}</span>
    </span>
  );
}
