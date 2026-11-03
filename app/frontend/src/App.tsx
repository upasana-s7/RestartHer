import AppShell from '@/components/layout/AppShell';
import EntryFlow, { type EntryStep } from '@/components/onboarding/EntryFlow';
import ProfileWindow from '@/components/onboarding/ProfileWindow';
import WelcomeWindow from '@/components/onboarding/WelcomeWindow';
import AuthProvider from '@/context/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import { useSectionRoute } from '@/hooks/useSectionRoute';
import { useState } from 'react';
import EditionPage from '@/pages/EditionPage';
import JourneyPage from '@/pages/JourneyPage';
import LearningPage from '@/pages/LearningPage';
import OpportunitiesPage from '@/pages/OpportunitiesPage';
import CoursesPage from '@/pages/CoursesPage';
import MentorshipPage from '@/pages/MentorshipPage';

function RootGate() {
  const { user, profile, loading, signOut } = useAuth();
  const { section, setSection } = useSectionRoute();
  const [returnToAccount, setReturnToAccount] = useState(false);

  if (loading) return <div className="min-h-screen bg-cream" aria-busy="true" />;

  if (!user) {
    const initialStep: EntryStep = returnToAccount ? 'account' : 'intro';
    return <EntryFlow initialStep={initialStep} />;
  }

  if (!profile) {
    const cancelProfile = () => {
      setReturnToAccount(true);
      void signOut();
    };
    return (
      <main className="min-h-screen bg-cream text-ink">
        <ProfileWindow onCancel={cancelProfile} />
      </main>
    );
  }

  return (
    <>
      <AppShell section={section} onNavigate={setSection}>
        {section === 'home' && <EditionPage onNavigate={setSection} />}
        {section === 'journey' && <JourneyPage onNavigate={setSection} />}
        {section === 'learning' && <LearningPage />}
        {section === 'courses' && <CoursesPage />}
        {section === 'opportunities' && <OpportunitiesPage />}
        {section === 'mentorship' && <MentorshipPage />}
      </AppShell>
      <WelcomeWindow />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <RootGate />
    </AuthProvider>
  );
}

export default App;
