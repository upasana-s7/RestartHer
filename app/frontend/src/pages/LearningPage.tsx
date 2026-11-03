import { ArrowRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClass } from '@/components/ui/buttonClass';

const MILESTONES = [
  { title: 'Complete your career assessment', detail: 'Answer seven questions so your next steps reflect your goals.', done: false },
  { title: 'Confirm your comeback roadmap', detail: 'Review and adjust the plan before anything is saved.', done: false },
  { title: 'Build your first skill', detail: 'Your confirmed recommendations and progress will appear here.', done: false },
];

export default function LearningPage() {
  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Learning"
          title="Your next chapter, in progress."
          description="Learning will become your home for the roadmap, milestones and progress you choose to take forward."
        />

        <section className="mt-12 rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card sm:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="editorial-label mt-6">Roadmap workspace</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">Start with My Journey</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.7] text-ink/75">
            Complete the assessment and confirm your roadmap first. Once you do, this space will hold your milestones,
            schedule, skills in progress and recommended courses.
          </p>
          <button type="button" className={buttonClass('primary', 'mt-8 gap-2')}>
            Open My Journey <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Learning milestones">
          {MILESTONES.map((milestone, index) => (
            <article key={milestone.title} className="rounded-xl border border-burgundy/15 bg-cream-light p-6">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-semibold uppercase tracking-wider text-muted">0{index + 1}</span>
                {milestone.done ? <CheckCircle2 className="h-4 w-4 text-burgundy" aria-hidden="true" /> : <Compass className="h-4 w-4 text-muted" aria-hidden="true" />}
              </div>
              <h3 className="mt-6 font-display text-xl font-bold text-ink">{milestone.title}</h3>
              <p className="mt-3 text-sm leading-[1.6] text-ink/70">{milestone.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
