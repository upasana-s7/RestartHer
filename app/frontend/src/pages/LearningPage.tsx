import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';
import { useSectionRoute } from '@/hooks/useSectionRoute';
import type { CareerRoadmap } from '@/lib/journey';
import { loadCareerRoadmap } from '@/lib/journey';
import { COURSES } from '@/data/courses';

export default function LearningPage() {
  const { user } = useAuth();
  const { setSection } = useSectionRoute();
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  useEffect(() => {
    if (user?.id) setRoadmap(loadCareerRoadmap(user.id));
  }, [user?.id]);

  const confirmed = Boolean(roadmap?.confirmedAt);
  const recommendedIds = new Set(roadmap?.weeklyPlan.flatMap((week) => week.courseIds) ?? []);
  const recommendedCourses = COURSES.filter((course) => recommendedIds.has(course.id));
  const milestones = [
    { title: 'Complete your career assessment', detail: 'Answer seven questions so your next steps reflect your goals.', done: Boolean(roadmap) },
    { title: 'Confirm your comeback roadmap', detail: 'Review and adjust the plan before anything is saved.', done: confirmed },
    { title: 'Build your first skill', detail: confirmed ? 'Choose a task from your first week and begin learning.' : 'Your first learning task will appear after you confirm your roadmap.', done: false },
  ];

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Learning" title="Your next chapter, in progress." description="Your confirmed roadmap, weekly learning tasks and recommended courses live here." />

        {confirmed && roadmap ? (
          <section className="mt-10 rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-10">
            <div className="flex items-center gap-3 text-burgundy"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-soft"><Sparkles className="h-5 w-5" /></span><p className="editorial-label">Your confirmed roadmap</p></div>
            <h2 className="mt-5 font-display text-3xl font-bold text-ink">{roadmap.title}</h2>
            <p className="mt-2 text-sm text-burgundy">{roadmap.targetRole} · {roadmap.durationWeeks} weeks</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/75">{roadmap.overview}</p>
            <div className="mt-8 space-y-4">
              {roadmap.weeklyPlan.map((week) => (
                <article key={week.week} className="rounded-xl border border-burgundy/15 bg-cream-light p-5">
                  <p className="editorial-label">Week {week.week}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-ink">{week.focus}</h3>
                  <p className="mt-2 text-sm text-muted">{week.topics.join(' · ')}</p>
                  <ul className="mt-4 space-y-2">{week.tasks.map((task, index) => <li key={index} className="flex gap-2 text-sm text-ink/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />{task}</li>)}</ul>
                  <p className="mt-4 border-t border-burgundy/10 pt-3 text-sm"><strong>Milestone:</strong> {week.milestone}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-display text-xl font-bold text-ink">Recommended courses</p><p className="mt-1 text-sm text-ink/70">Matched to the skills in your roadmap.</p></div>
              <button type="button" onClick={() => setSection('courses')} className={buttonClass('outline', 'gap-2')}>Explore all courses <ArrowRight className="h-4 w-4" /></button>
            </div>
            {recommendedCourses.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {recommendedCourses.map((course) => <a key={course.id} href={course.providerUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-burgundy/15 bg-white p-5 transition-colors hover:border-burgundy/50"><p className="text-xs font-semibold uppercase tracking-wider text-burgundy">{course.provider} · {course.level}</p><h3 className="mt-2 font-display text-lg font-bold text-ink">{course.title}</h3><p className="mt-2 text-sm text-ink/70">{course.summary}</p><p className="mt-3 text-xs text-muted">{course.duration} · {course.cost} · {course.hasCertificate ? 'Certificate listed' : 'No certificate listed'}</p></a>)}
              </div>
            ) : <p className="mt-5 rounded-lg bg-cream-light p-4 text-sm text-ink/70">Your roadmap does not yet have a direct match in the sample course catalogue. Explore all courses to find a suitable next step.</p>}
          </section>
        ) : (
          <section className="mt-12 rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy"><Sparkles className="h-5 w-5" /></div>
            <p className="editorial-label mt-6">Roadmap workspace</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">Start with My Journey</h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.7] text-ink/75">Complete the seven-question career assessment and confirm your AI-generated roadmap. Your weekly schedule and course recommendations will appear here.</p>
            <button type="button" onClick={() => setSection('journey')} className={buttonClass('primary', 'mt-8 gap-2')}>Open My Journey <ArrowRight className="h-4 w-4" /></button>
          </section>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Learning milestones">
          {milestones.map((milestone, index) => (
            <article key={milestone.title} className="rounded-xl border border-burgundy/15 bg-cream-light p-6">
              <div className="flex items-center justify-between"><span className="font-label text-xs font-semibold uppercase tracking-wider text-muted">0{index + 1}</span>{milestone.done ? <CheckCircle2 className="h-4 w-4 text-burgundy" /> : <Compass className="h-4 w-4 text-muted" />}</div>
              <h3 className="mt-6 font-display text-xl font-bold text-ink">{milestone.title}</h3>
              <p className="mt-3 text-sm leading-[1.6] text-ink/70">{milestone.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
