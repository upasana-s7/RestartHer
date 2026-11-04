import { useState } from 'react';
import { Feather, Quote, Sparkles } from 'lucide-react';
import { INSPIRATION_QUOTES } from '@/data/editorial';
import type { Section } from '@/hooks/useSectionRoute';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from './navItems';

interface SidebarProps {
  section: Section;
  drawerOpen: boolean;
  aiOpen: boolean;
  onNavigate: (section: Section) => void;
  onToggleAi: () => void;
}

export default function Sidebar({ section, drawerOpen, aiOpen, onNavigate, onToggleAi }: SidebarProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFlipped, setQuoteFlipped] = useState(false);
  const [quoteAnimating, setQuoteAnimating] = useState(false);
  const nextQuoteIndex = (quoteIndex + 1) % INSPIRATION_QUOTES.length;
  const flipQuote = () => {
    if (quoteAnimating) return;
    setQuoteAnimating(true);
    setQuoteFlipped((value) => !value);
  };

  return (
    <aside
      id="app-sidebar"
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-burgundy/15 bg-cream-light transition-transform duration-300 ease-out lg:translate-x-0',
        drawerOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-cream">
            <Feather className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold leading-none tracking-tight text-ink">RESTARTHER</p>
            <p className="editorial-label mt-1 text-[0.6rem] text-muted">The HER Edition</p>
          </div>
        </div>

        <div className="editorial-rule mt-8 opacity-60" />

        <div
          role="button"
          tabIndex={0}
          aria-label="Flip inspiration quote card"
          onClick={flipQuote}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              flipQuote();
            }
          }}
          onTransitionEnd={(event) => {
            if (event.propertyName !== 'transform') return;
            if (quoteFlipped) setQuoteIndex(nextQuoteIndex);
            setQuoteAnimating(false);
          }}
          className="group mt-8 cursor-pointer select-none rounded-xl border border-burgundy/15 bg-cream p-5 shadow-card [perspective:900px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
        >
          <div className={cn('relative min-h-[7.5rem] transition-transform duration-700 [transform-style:preserve-3d]', quoteFlipped && '[transform:rotateY(180deg)]')}>
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <p className="editorial-label flex items-center gap-2"><Quote className="h-3.5 w-3.5" aria-hidden="true" />A little inspiration</p>
              <blockquote aria-live="polite" className="mt-4 font-display text-lg italic leading-snug text-ink">“{INSPIRATION_QUOTES[quoteIndex]}”</blockquote>
            </div>
            <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <p className="editorial-label flex items-center gap-2"><Quote className="h-3.5 w-3.5" aria-hidden="true" />A little inspiration</p>
              <blockquote className="mt-4 font-display text-lg italic leading-snug text-ink">“{INSPIRATION_QUOTES[nextQuoteIndex]}”</blockquote>
            </div>
          </div>
        </div>

        <nav aria-label="Main" className="mt-8">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={section === item.id ? 'page' : undefined}
                  className={cn(
                    'w-full rounded-md px-4 py-3 text-left font-label text-sm font-semibold transition-colors',
                    section === item.id ? 'bg-burgundy text-cream' : 'text-ink hover:bg-burgundy-soft hover:text-burgundy',
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={onToggleAi}
            aria-expanded={aiOpen}
            aria-controls="ai-companion"
            className="group flex w-full items-center justify-between rounded-xl border border-burgundy bg-burgundy px-5 py-4 text-left text-cream shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-burgundy-deep"
          >
            <span>
              <span className="block font-label text-sm font-semibold">Ask RestartHER AI</span>
              <span className="mt-0.5 block text-xs text-cream/85">Roadmaps, learning and next steps</span>
            </span>
            <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
