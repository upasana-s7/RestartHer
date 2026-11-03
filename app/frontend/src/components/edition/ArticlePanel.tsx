import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import type { Article } from '@/types/content';

type Tone = 'white' | 'cream' | 'burgundy' | 'ink';

const TONES: Record<Tone, { panel: string; label: string; body: string; button: string }> = {
  white: {
    panel: 'bg-white',
    label: 'text-burgundy',
    body: 'text-ink/75',
    button: 'border-burgundy text-burgundy hover:bg-burgundy hover:text-cream',
  },
  cream: {
    panel: 'bg-cream-dark/60',
    label: 'text-burgundy',
    body: 'text-ink/75',
    button: 'border-burgundy text-burgundy hover:bg-burgundy hover:text-cream',
  },
  burgundy: {
    panel: 'bg-burgundy',
    label: 'text-cream/80',
    body: 'text-cream/90',
    button: 'border-cream text-cream hover:bg-cream hover:text-burgundy',
  },
  ink: {
    panel: 'bg-ink',
    label: 'text-cream/70',
    body: 'text-cream/80',
    button: 'border-cream text-cream hover:bg-cream hover:text-ink',
  },
};

interface ArticlePanelProps {
  article: Article;
  tone: Tone;
  imageOnLeft: boolean;
  onRead: (article: Article) => void;
  saved: boolean;
  onToggleSave: () => void;
}

export default function ArticlePanel({ article, tone, imageOnLeft, onRead, saved, onToggleSave }: ArticlePanelProps) {
  const { ref, inView } = useInView<HTMLElement>(0.15);
  const palette = TONES[tone];

  return (
    <article
      ref={ref}
      className={cn(
        'reveal group flex flex-col overflow-hidden rounded-[1.5rem] shadow-card transition-shadow duration-500 hover:shadow-panel md:min-h-[320px] md:flex-row',
        palette.panel,
        !imageOnLeft && 'md:flex-row-reverse',
        inView && 'is-visible',
      )}
    >
      <div className="relative h-64 shrink-0 overflow-hidden md:h-auto md:w-[38%]">
        <img
          src={article.image}
          alt={article.imageAlt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3">
          <span className={cn('font-display text-3xl font-bold italic', palette.label)}>{article.number}</span>
          <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
          <p className={cn('font-label text-xs font-semibold uppercase tracking-[0.18em]', palette.label)}>
            {article.category}
          </p>
        </div>

        <h3 className={cn('mt-5 font-display text-3xl font-bold leading-[1.15] lg:text-4xl', tone === 'burgundy' || tone === 'ink' ? 'text-cream' : 'text-ink')}>
          {article.headline}
        </h3>
        <p className={cn('mt-4 max-w-xl text-base leading-[1.6]', palette.body)}>{article.preview}</p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => onRead(article)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border px-5 py-2.5 font-label text-sm font-semibold transition-colors duration-300',
              palette.button,
            )}
          >
            Read more
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <span className={cn('font-label text-xs uppercase tracking-wider', palette.label)}>{article.readingTime}</span>
          <button type="button" onClick={onToggleSave} aria-pressed={saved} className={cn('inline-flex items-center gap-2 rounded-md border border-current px-3 py-2 text-xs font-semibold transition-colors', palette.label, 'hover:bg-burgundy/5')}>
            {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
            {saved ? 'Saved story' : 'Save story'}
          </button>
        </div>
      </div>
    </article>
  );
}

export type { Tone };
