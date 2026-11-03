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
        <div className="flex justify-end">
          <button type="button" onClick={dismissWelcome} className={buttonClass('primary')}>
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
