import { Compass } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import ComingSoon from '@/components/ui/ComingSoon';

export default function JourneyPage() {
  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="My Journey"
          title="Your comeback, step by step."
          description="Your personal career journey will guide you from where you are today to the role you want next. It is being built now, and nothing here is saved or in progress yet."
        />

        <div className="mt-12">
          <ComingSoon
            title="Your guided journey is coming soon"
            description="A short conversation with your AI guide, a seven-question assessment and a roadmap built around your goals. You will review and approve every step before it begins."
            points={[
              'A gentle introduction to how the journey works',
              'A seven-question assessment about your goals and experience',
              'A personal roadmap you can review, change and confirm',
              'Learning tasks that link to the courses you need',
            ]}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-burgundy/25 px-4 py-2 font-label text-xs font-semibold uppercase tracking-wider text-burgundy">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Not started
            </span>
          </ComingSoon>
        </div>
      </div>
    </div>
  );
}
