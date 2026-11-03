import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { buttonClass } from '@/components/ui/buttonClass';
import type { Course } from '@/types/content';

interface CourseModalProps {
  course: Course | null;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export default function CourseModal({ course, saved, onToggleSave, onClose }: CourseModalProps) {
  return (
    <Modal open={course !== null} onClose={onClose} title={course?.title ?? ''} eyebrow={course ? `${course.provider} · ${course.category}` : ''}>
      {course && (
        <div className="space-y-7">
          <p className="text-base leading-[1.7] text-ink/85">{course.summary}</p>

          <dl className="grid gap-4 rounded-xl bg-cream-light p-5 sm:grid-cols-2">
            <div>
              <dt className="editorial-label text-[0.65rem] text-muted">Level</dt>
              <dd className="mt-1 text-sm text-ink">{course.level}</dd>
            </div>
            <div>
              <dt className="editorial-label text-[0.65rem] text-muted">Duration</dt>
              <dd className="mt-1 text-sm text-ink">{course.duration}</dd>
            </div>
            <div>
              <dt className="editorial-label text-[0.65rem] text-muted">Cost</dt>
              <dd className="mt-1 text-sm text-ink">{course.cost}</dd>
            </div>
            <div>
              <dt className="editorial-label text-[0.65rem] text-muted">Certificate</dt>
              <dd className="mt-1 text-sm text-ink">{course.certificateNote}</dd>
            </div>
          </dl>

          <div>
            <h3 className="editorial-label text-[0.65rem]">Skills covered</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <li key={skill} className="rounded-full border border-burgundy/25 px-3 py-1 text-sm text-ink">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-burgundy/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => onToggleSave(course.id)}
              aria-pressed={saved}
              className={buttonClass('outline')}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              {saved ? 'Saved' : 'Save course'}
            </button>
            <a
              href={course.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('primary')}
            >
              Visit provider
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
