import { useCallback, useState } from 'react';
import AuthWindow from '@/components/onboarding/AuthWindow';
import IntroScreen from '@/components/onboarding/IntroScreen';
import RoleScreen from '@/components/onboarding/RoleScreen';

export type EntryStep = 'intro' | 'role' | 'account';

interface EntryFlowProps {
  initialStep: EntryStep;
}

export default function EntryFlow({ initialStep }: EntryFlowProps) {
  const [step, setStep] = useState<EntryStep>(initialStep);

  const showRoles = useCallback(() => setStep('role'), []);
  const showAccount = useCallback(() => setStep('account'), []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream text-ink">
      {step === 'intro' && <IntroScreen onComplete={showRoles} />}
      {step === 'role' && <RoleScreen onSelectWoman={showAccount} />}
      {step === 'account' && <AuthWindow onClose={showRoles} />}
    </main>
  );
}
