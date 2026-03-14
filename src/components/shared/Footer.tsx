import { ECOSYSTEM, SPONSORS } from '@/lib/constants';
import AstroLogo from './AstroLogo';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-4 px-4 text-xs text-[var(--text-dim)]">
        <span>Powered by</span>
        <a href={ECOSYSTEM.store} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors">
          <AstroLogo heightClass="h-4" />
        </a>
        <span className="text-[var(--border-glass)]">·</span>
        <a href={SPONSORS.solana} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Solana</a>
        <span className="text-[var(--border-glass)]">·</span>
        <a href={SPONSORS.farmhawk} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">FarmHawk</a>
        <span className="text-[var(--border-glass)]">·</span>
        <a href={SPONSORS.pollinet} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Pollinet</a>
        <span className="text-[var(--border-glass)]">·</span>
        <a href={SPONSORS.scriptonia} target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">Scriptonia</a>
      </div>
    </footer>
  );
}
