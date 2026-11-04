import { Bookmark, BookmarkCheck, ExternalLink, Info } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { buttonClass } from '@/components/ui/buttonClass';
import { formatDate } from '@/lib/formatDate';
import type { Opportunity } from '@/types/content';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export default function OpportunityModal({ opportunity, saved, onToggleSave, onClose }: OpportunityModalProps) {
  return (
    <Modal
      open={opportunity !== null}
      onClose={onClose}
      title={opportunity?.title ?? ''}
      eyebrow={opportunity ? opportunity.company : ''}
    >
      {opportunity && (
        <div className="space-y-7">
          <p className="text-base leading-[1.7] text-ink/85">{opportunity.summary}</p>

          <dl className="grid gap-4 rounded-xl bg-cream-light p-5 sm:grid-cols-2">
            <Detail label="Type" value={opportunity.type} />
            <Detail label="Work mode" value={`${opportunity.workMode} · ${opportunity.location}`} />
            <Detail label="Compensation" value={opportunity.pay} />
            <Detail
              label="Duration"
              value={opportunity.durationMonths !== null ? `${opportunity.durationMonths} months` : 'Not applicable'}
            />
            <Detail label="Eligibility" value={opportunity.eligibility} />
            <Detail label="Application deadline" value={formatDate(opportunity.deadline)} />
            <Detail label="Posted" value={formatDate(opportunity.postedOn)} />
            <Detail label="Source" value={opportunity.source} />
          </dl>

          <div>
            <h3 className="editorial-label text-[0.65rem]">Responsibilities</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-[1.6] text-ink/85">
              {opportunity.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="editorial-label text-[0.65rem]">Required skills</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {opportunity.skills.map((skill) => (
                <li key={skill} className="rounded-full border border-burgundy/25 px-3 py-1 text-sm text-ink">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-burgundy/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => onToggleSave(opportunity.id)} aria-pressed={saved} className={buttonClass('outline')}>
              {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              {saved ? 'Saved' : 'Save opportunity'}
            </button>
            {opportunity.applyUrl ? (
              <a href={opportunity.applyUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary')}>
                Apply now
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                Demonstration listing. No live application link.
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="editorial-label text-[0.65rem] text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-[1.5] text-ink">{value}</dd>
    </div>
  );
}
