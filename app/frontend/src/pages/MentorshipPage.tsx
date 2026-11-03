import { UsersRound } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function MentorshipPage() {
  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Mentorship"
          title="Find the right perspective."
          description="Explore mentor connections when verified profiles, availability and booking services are connected to RestartHER."
        />
        <section className="mt-12 rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card sm:p-12">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy">
            <UsersRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="editorial-label mt-6">Verified connections only</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">Mentor discovery is not connected yet</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.7] text-ink/75">
            No mentor profiles, prices, availability or meeting links are being invented here. The mentor API and booking
            service must be provided before requests can be sent safely.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {['Career field and expertise filters', 'Free or paid session details', 'Online format and duration', 'Availability and booking options'].map((item) => (
              <li key={item} className="rounded-lg bg-cream-light px-4 py-3 text-sm text-ink/80">{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
