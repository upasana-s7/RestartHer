import Modal from '@/components/ui/Modal';
import { buttonClass } from '@/components/ui/buttonClass';

interface ReadingModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  subtitle?: string;
  lead?: string;
  paragraphs: string[];
  disclaimer: string;
}

export default function ReadingModal({ open, onClose, eyebrow, title, subtitle, lead, paragraphs, disclaimer }: ReadingModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} eyebrow={eyebrow}>
      {subtitle && <p className="font-label text-sm font-semibold uppercase tracking-wider text-muted">{subtitle}</p>}
      {lead && <p className="mt-5 font-display text-2xl italic leading-snug text-burgundy">“{lead}”</p>}
      <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.75] text-ink/85">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="editorial-rule mt-10 h-px opacity-40" />
      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-[1.5] text-muted">{disclaimer}</p>
        <button type="button" onClick={onClose} className={buttonClass('outline')}>
          Back to the edition
        </button>
      </div>
    </Modal>
  );
}
