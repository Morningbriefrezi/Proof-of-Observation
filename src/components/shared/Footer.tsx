import { ECOSYSTEM, SPONSORS } from '@/lib/constants';
import AstroLogo from './AstroLogo';

const links = [
  { label: 'Solana', href: SPONSORS.solana },
  { label: 'FarmHawk', href: SPONSORS.farmhawk },
  { label: 'Pollinet', href: SPONSORS.pollinet },
  { label: 'Scriptonia', href: SPONSORS.scriptonia },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border-glass)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center gap-3 flex-wrap text-xs text-[var(--text-dim)]">
        <span>Powered by</span>
        <a href={ECOSYSTEM.store} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#c9a84c] hover:text-[#e8c555] transition-colors font-medium">
          <AstroLogo className="h-4 w-4" />
          Astroman
        </a>
        {links.map(l => (
          <span key={l.label} className="flex items-center gap-2">
            <span className="text-[var(--border-glass)]">·</span>
            <a href={l.href} target="_blank" rel="noopener noreferrer"
              className="hover:text-[var(--text-secondary)] transition-colors">
              {l.label}
            </a>
          </span>
        ))}
      </div>
    </footer>
  );
}
