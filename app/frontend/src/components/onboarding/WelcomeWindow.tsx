import { Sparkles, Compass, BookOpen, Flag } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';

export default function WelcomeWindow() {
  const { welcome, dismissWelcome } = useAuth();
  if (!welcome) return null;

  const title = welcome.returning ? `Welcome back, ${welcome.name}!` : `Welcome, ${welcome.name}!`;
  const message = welcome.returning
    ? "We're glad you're continuing your journey with RestartHER."
    : 'Your next chapter begins here.';

  return (
    <Modal open onClose={dismissWelcome} title={title} eyebrow="RestartHER">
      <div className="space-y-8">
        <p className="text-base leading-[1.6] text-ink/85">{message}</p>
        <div className="rounded-xl border border-burgundy/15 bg-cream px-4 py-4">
          <p className="flex items-center gap-2 font-label text-xs font-semibold text-burgundy"><Sparkles className="h-4 w-4" aria-hidden="true" /> A little at a time</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-cream-light px-2 py-3 transition-transform duration-200 hover:-translate-y-0.5">
              <Compass className="mx-auto h-5 w-5 text-burgundy" aria-hidden="true" />
              <p className="mt-2 text-[0.65rem] font-semibold text-ink">Discover</p>
            </div>
            <div className="rounded-lg bg-cream-light px-2 py-3 transition-transform duration-200 hover:-translate-y-0.5">
              <BookOpen className="mx-auto h-5 w-5 text-burgundy" aria-hidden="true" />
              <p className="mt-2 text-[0.65rem] font-semibold text-ink">Learn</p>
            </div>
            <div className="rounded-lg bg-cream-light px-2 py-3 transition-transform duration-200 hover:-translate-y-0.5">
              <Flag className="mx-auto h-5 w-5 text-burgundy" aria-hidden="true" />
              <p className="mt-2 text-[0.65rem] font-semibold text-ink">Grow</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">Explore at your own pace—your next chapter starts with one small step.</p>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={dismissWelcome} className={buttonClass('primary')}>
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
