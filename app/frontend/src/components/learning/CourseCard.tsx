import { Bookmark, BookmarkCheck, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Course } from '@/types/content';

interface CourseCardProps {
  course: Course;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onOpen: (course: Course) => void;
}

export default function CourseCard({ course, saved, onToggleSave, onOpen }: CourseCardProps) {
  return (
    <article className="group flex flex-col rounded-[1.25rem] border border-burgundy/15 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <p className="editorial-label text-[0.65rem]">{course.provider}</p>
        <button
          type="button"
          onClick={() => onToggleSave(course.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${course.title} from saved` : `Save ${course.title}`}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label text-xs font-semibold transition-colors',
            saved ? 'bg-burgundy text-cream' : 'text-burgundy hover:bg-burgundy-soft',
          )}
        >
          {saved ? <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <a href={course.providerUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-left">
        <h3 className="font-display text-xl font-bold leading-snug text-ink transition-colors group-hover:text-burgundy">{course.title}</h3>
      </a>
      <p className="mt-3 text-sm leading-[1.6] text-ink/75">{course.summary}</p>

      <ul className="mt-5 flex flex-wrap gap-2 text-xs text-ink/80">
        <li className="rounded-md bg-cream-light px-2.5 py-1">{course.level}</li>
        <li className="rounded-md bg-cream-light px-2.5 py-1">{course.cost}</li>
        <li className="flex items-center gap-1 rounded-md bg-cream-light px-2.5 py-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {course.duration}
        </li>
        {course.hasCertificate && (
          <li className="flex items-center gap-1 rounded-md bg-burgundy-soft px-2.5 py-1 text-burgundy">
            <Award className="h-3 w-3" aria-hidden="true" />
            Certificate
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => onOpen(course)}
        className="mt-auto self-start pt-6 font-label text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-deep"
      >
        Open official course →
      </button>
    </article>
  );
}
