import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';
import { useSectionRoute } from '@/hooks/useSectionRoute';
import type { CareerRoadmap } from '@/lib/journey';
import { getRecommendedSapCourseIds, loadCareerRoadmap } from '@/lib/journey';
import { COURSES } from '@/data/courses';

const TOOLKIT_ITEMS = [
  'Update my resume with previous experience and recent skills',
  'Prepare a confident, honest explanation of my career break',
  'Refresh my LinkedIn profile and professional summary',
  'Create or update one work sample / portfolio project',
  'Practise role-specific interview questions',
];

export default function LearningPage() {
  const { user } = useAuth();
  const { setSection } = useSectionRoute();
  const userId = user?.id ?? '';
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [toolkitDone, setToolkitDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!userId) return;
    setRoadmap(loadCareerRoadmap(userId));
    try {
      setCompletedTasks(new Set(JSON.parse(localStorage.getItem('restarther_task_progress_v1_' + userId) || '[]') as string[]));
      setToolkitDone(new Set(JSON.parse(localStorage.getItem('restarther_return_toolkit_v1_' + userId) || '[]') as number[]));
    } catch { setCompletedTasks(new Set()); setToolkitDone(new Set()); }
  }, [userId]);

  const confirmed = Boolean(roadmap?.confirmedAt);
  const recommendedIds = new Set([...(roadmap?.weeklyPlan.flatMap((week) => week.courseIds) ?? []), ...getRecommendedSapCourseIds(roadmap?.assessment)]);
  const recommendedCourses = COURSES.filter((course) => recommendedIds.has(course.id));
  const allTaskIds = useMemo(() => roadmap?.weeklyPlan.flatMap((week) => week.tasks.map((_, index) => `week-${week.week}-task-${index}`)) ?? [], [roadmap]);
  const completedCount = allTaskIds.filter((id) => completedTasks.has(id)).length;
  const progress = allTaskIds.length ? Math.round((completedCount / allTaskIds.length) * 100) : 0;

  const toggleTask = (id: string) => setCompletedTasks((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    localStorage.setItem('restarther_task_progress_v1_' + userId, JSON.stringify(Array.from(next)));
    return next;
  });
  const toggleToolkit = (index: number) => setToolkitDone((current) => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    localStorage.setItem('restarther_return_toolkit_v1_' + userId, JSON.stringify(Array.from(next)));
    return next;
  });

  const milestones = [
    { title: 'Complete your career assessment', detail: 'Reflect on your previous role, career break and return goals.', done: Boolean(roadmap) },
    { title: 'Confirm your comeback roadmap', detail: 'Review and adjust the plan before beginning.', done: confirmed },
    { title: 'Make progress on your learning tasks', detail: 'Tick off practical tasks as you complete them.', done: completedCount > 0 },
  ];

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Learning" title="Your next chapter, in progress." description="Your confirmed roadmap, practical tasks, career-return checklist and recommended courses live here." />

        {confirmed && roadmap ? (
          <>
            <section className="mt-10 rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-10">
              <div className="flex items-center gap-3 text-burgundy"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-soft"><Sparkles className="h-5 w-5" /></span><p className="editorial-label">Your confirmed roadmap</p></div>
              <h2 className="mt-5 font-display text-3xl font-bold text-ink">{roadmap.title}</h2>
              <p className="mt-2 text-sm text-burgundy">{roadmap.targetRole} · {roadmap.durationWeeks} weeks</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/75">{roadmap.overview}</p>
              <div className="mt-8 rounded-xl bg-cream-light p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-bold text-ink">Your learning progress</h3><strong className="text-burgundy">{progress}%</strong></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-burgundy/10"><div className="h-full rounded-full bg-burgundy transition-all" style={{ width: progress + '%' }} /></div>
                <p className="mt-2 text-xs text-muted">{completedCount} of {allTaskIds.length} learning tasks completed · Progress is saved on this device.</p>
              </div>
              <div className="mt-8 space-y-8">
                {[
                  { title: 'Phase 1 · Foundations & refresh', subtitle: 'Reconnect with the basics and identify what you already know.', from: 0, to: Math.max(1, Math.ceil(roadmap.weeklyPlan.length / 4)) },
                  { title: 'Phase 2 · Guided practice', subtitle: 'Build confidence through focused exercises and supported practice.', from: Math.max(1, Math.ceil(roadmap.weeklyPlan.length / 4)), to: Math.max(2, Math.ceil(roadmap.weeklyPlan.length / 2)) },
                  { title: 'Phase 3 · Applied skills', subtitle: 'Use your growing skills in practical tasks and small projects.', from: Math.max(2, Math.ceil(roadmap.weeklyPlan.length / 2)), to: Math.max(3, Math.ceil(roadmap.weeklyPlan.length * 3 / 4)) },
                  { title: 'Phase 4 · Career readiness', subtitle: 'Bring the learning together into evidence of your abilities.', from: Math.max(3, Math.ceil(roadmap.weeklyPlan.length * 3 / 4)), to: roadmap.weeklyPlan.length },
                ].map((phase, phaseIndex) => {
                  const phaseWeeks = roadmap.weeklyPlan.slice(phase.from, phase.to);
                  if (!phaseWeeks.length) return null;
                  return <section key={phase.title} aria-label={phase.title}>
                    <div className="mb-4 flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy text-sm font-semibold text-cream">{phaseIndex + 1}</span>
                      <div><h3 className="font-display text-xl font-bold text-ink">{phase.title}</h3><p className="mt-1 text-sm leading-6 text-ink/65">{phase.subtitle}</p></div>
                    </div>
                    <div className="ml-4 border-l-2 border-burgundy/15 pl-5 sm:ml-5 sm:pl-7">
                      {phaseWeeks.map((week) => (
                        <article key={week.week} className="border-b border-burgundy/10 py-5 first:pt-2 last:border-b-0">
                          <div className="flex flex-wrap items-center justify-between gap-2"><p className="editorial-label">Week {week.week} · Learning focus</p><span className="text-xs text-muted">{week.tasks.filter((_, index) => completedTasks.has(`week-${week.week}-task-${index}`)).length} / {week.tasks.length} tasks done</span></div>
                          <h4 className="mt-2 font-display text-lg font-semibold text-ink">{week.focus}</h4>
                          <p className="mt-2 text-sm leading-6 text-ink/70"><strong className="font-semibold text-ink/80">Topics:</strong> {week.topics.join(' · ')}</p>
                          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                            <ul className="space-y-3">{week.tasks.map((task, index) => {
                              const taskId = `week-${week.week}-task-${index}`;
                              return <li key={taskId} className="flex items-start gap-3 text-sm leading-6 text-ink/85"><input aria-label={`Complete week ${week.week} task ${index + 1}`} type="checkbox" checked={completedTasks.has(taskId)} onChange={() => toggleTask(taskId)} className="mt-1 h-4 w-4 shrink-0 accent-burgundy" /><span className={completedTasks.has(taskId) ? 'text-muted line-through' : ''}>{task}</span></li>;
                            })}</ul>
                            <aside className="h-fit rounded-lg bg-cream-light p-4"><p className="editorial-label">Milestone</p><p className="mt-2 text-sm leading-6 text-ink/80">{week.milestone}</p></aside>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>;
                })}
              </div>>
            </section>

            <section className="mt-8 rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-9">
              <p className="editorial-label">Career readiness</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">Your return-to-work toolkit</h2>
              <p className="mt-2 text-sm text-ink/70">Small steps to prepare for applications and conversations with employers.</p>
              <ul className="mt-5 space-y-3">{TOOLKIT_ITEMS.map((item, index) => <li key={item} className="flex items-start gap-3 text-sm"><input type="checkbox" checked={toolkitDone.has(index)} onChange={() => toggleToolkit(index)} className="mt-0.5 h-4 w-4 accent-burgundy" /><span className={toolkitDone.has(index) ? 'text-muted line-through' : 'text-ink/85'}>{item}</span></li>)}</ul>
            </section>

            <section className="mt-8 rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="editorial-label">Recommended courses</p><h2 className="mt-2 font-display text-2xl font-bold text-ink">Learn with trusted providers</h2><p className="mt-1 text-sm text-ink/70">Matched to your previous experience, target role and skill priorities. Select a course to visit its provider page.</p></div><button type="button" onClick={() => setSection('courses')} className={buttonClass('outline', 'gap-2')}>Explore all courses <ArrowRight className="h-4 w-4" /></button></div>
              {recommendedCourses.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{recommendedCourses.map((course) => <a key={course.id} href={course.providerUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-burgundy/15 bg-cream-light p-5 transition-colors hover:border-burgundy/50"><p className="text-xs font-semibold uppercase tracking-wider text-burgundy">{course.provider} · {course.level}</p><h3 className="mt-2 font-display text-lg font-bold text-ink">{course.title}</h3><p className="mt-2 text-sm text-ink/70">{course.summary}</p><p className="mt-3 text-xs text-muted">{course.duration} · {course.cost} · {course.hasCertificate ? 'Certificate information available' : 'No certificate listed'}</p></a>)}</div> : <p className="mt-5 text-sm text-muted">Your plan does not yet have a direct course match. Explore the catalogue for other options.</p>}
            </section>
          </>
        ) : (
          <section className="mt-12 rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy"><Sparkles className="h-5 w-5" /></div>
            <p className="editorial-label mt-6">Roadmap workspace</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">Start with My Journey</h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.7] text-ink/75">Complete the career-return assessment and confirm your AI-generated plan. Your weekly schedule and course recommendations will appear here.</p>
            <button type="button" onClick={() => setSection('journey')} className={buttonClass('primary', 'mt-8 gap-2')}>Open My Journey <ArrowRight className="h-4 w-4" /></button>
          </section>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Learning milestones">
          {milestones.map((milestone, index) => <article key={milestone.title} className="rounded-xl border border-burgundy/15 bg-cream-light p-6"><div className="flex items-center justify-between"><span className="font-label text-xs font-semibold uppercase tracking-wider text-muted">0{index + 1}</span>{milestone.done ? <CheckCircle2 className="h-4 w-4 text-burgundy" /> : <Compass className="h-4 w-4 text-muted" />}</div><h3 className="mt-6 font-display text-xl font-bold text-ink">{milestone.title}</h3><p className="mt-3 text-sm leading-[1.6] text-ink/70">{milestone.detail}</p></article>)}
        </section>
      </div>
    </div>
  );
}
