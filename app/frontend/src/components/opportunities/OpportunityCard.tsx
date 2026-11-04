import { Bookmark, BookmarkCheck, CalendarClock, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/cn';
import type { Opportunity } from '@/types/content';

interface OpportunityCardProps {
  opportunity: Opportunity;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onOpen: (opportunity: Opportunity) => void;
}

export default function OpportunityCard({ opportunity, saved, onToggleSave, onOpen }: OpportunityCardProps) {
  const item = opportunity;
  return (
    <article className="flex flex-col rounded-[1.25rem] border border-burgundy/15 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-label text-xs font-semibold uppercase tracking-wider text-muted">{item.company}</p>
          <h3 className="mt-1 font-display text-xl font-bold leading-snug text-ink">{item.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onToggleSave(item.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-label text-xs font-semibold transition-colors',
            saved ? 'bg-burgundy text-cream' : 'text-burgundy hover:bg-burgundy-soft',
          )}
        >
          {saved ? <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2 text-xs text-ink/80">
        <li className="rounded-md bg-burgundy-soft px-2.5 py-1 font-semibold text-burgundy">{item.type}</li>
        <li className="rounded-md bg-cream-light px-2.5 py-1">{item.workMode}</li>
        <li className="rounded-md bg-cream-light px-2.5 py-1">{item.pay}</li>
        {item.durationMonths !== null && <li className="rounded-md bg-cream-light px-2.5 py-1">{item.durationMonths} months</li>}
      </ul>

      <p className="mt-4 flex items-center gap-2 text-sm text-ink/75">
        <MapPin className="h-4 w-4 shrink-0 text-burgundy" aria-hidden="true" />
        {item.location}
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm text-ink/75">
        <CalendarClock className="h-4 w-4 shrink-0 text-burgundy" aria-hidden="true" />
        Apply by {formatDate(item.deadline)} · Posted {formatDate(item.postedOn)}
      </p>

      <p className="mt-4 text-xs leading-[1.5] text-muted">
        Skills: {item.skills.join(', ')}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="font-label text-[0.65rem] uppercase tracking-wider text-muted">{item.source}</span>
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="font-label text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-deep"
        >
          View details →
        </button>
      </div>
    </article>
  );
}
