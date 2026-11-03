import { useEffect, useState } from 'react';
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, CheckCircle2, Compass, GraduationCap, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';
import { useSectionRoute } from '@/hooks/useSectionRoute';
import { loadCareerRoadmap } from '@/lib/journey';
import type { CareerRoadmap } from '@/lib/journey';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { setSection } = useSectionRoute();
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [completed, setCompleted] = useState(0);
  const [savedCourses, setSavedCourses] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    setRoadmap(loadCareerRoadmap(user.id));
    try {
      setCompleted((JSON.parse(localStorage.getItem('restarther_task_progress_v1_' + user.id) || '[]') as string[]).length);
      setSavedCourses((JSON.parse(localStorage.getItem('restarther_saved_courses_v1_' + user.id) || '[]') as string[]).length);
    } catch { setCompleted(0); setSavedCourses(0); }
  }, [user?.id]);

  const confirmed = Boolean(roadmap?.confirmedAt);
  const taskCount = roadmap?.weeklyPlan.reduce((sum, week) => sum + week.tasks.length, 0) ?? 0;
  const progress = taskCount ? Math.min(100, Math.round(completed / taskCount * 100)) : 0;
  const nextTask = roadmap?.weeklyPlan.flatMap((week) => week.tasks.map((task) => ({ week: week.week, task, key: `week-${week.week}-task-${week.tasks.indexOf(task)}` }))).find((item) => {
    try { return !new Set(JSON.parse(localStorage.getItem('restarther_task_progress_v1_' + (user?.id ?? '')) || '[]') as string[]).has(item.key); } catch { return true; }
  });

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Your dashboard" title={profile?.first_name ? `Welcome back, ${profile.first_name}.` : 'Your comeback workspace.'} description="A clear view of your career-return plan, learning progress and next steps." />
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Roadmap status', value: confirmed ? 'Confirmed' : roadmap ? 'Review needed' : 'Not started', icon: Compass },
            { label: 'Learning progress', value: progress + '%', icon: BookOpenCheck },
            { label: 'Tasks completed', value: String(completed), icon: CheckCircle2 },
            { label: 'Saved courses', value: String(savedCourses), icon: GraduationCap },
          ].map((item) => <article key={item.label} className="rounded-xl border border-burgundy/15 bg-white p-5 shadow-card"><item.icon className="h-5 w-5 text-burgundy" /><p className="mt-4 text-xs uppercase tracking-wider text-muted">{item.label}</p><p className="mt-1 font-display text-2xl font-bold text-ink">{item.value}</p></article>)}
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-9">
            <p className="editorial-label flex items-center gap-2"><Sparkles className="h-4 w-4" /> Your next step</p>
            {confirmed && roadmap ? <><h2 className="mt-4 font-display text-2xl font-bold text-ink">{nextTask?.task ?? 'You have completed every task in this roadmap.'}</h2><p className="mt-2 text-sm text-ink/70">{nextTask ? `Week ${nextTask.week} · ${roadmap.targetRole}` : 'Review your progress and choose your next learning goal.'}</p><button type="button" onClick={() => setSection('learning')} className={buttonClass('primary', 'mt-6 gap-2')}>Continue learning <ArrowRight className="h-4 w-4" /></button></> : <><h2 className="mt-4 font-display text-2xl font-bold text-ink">Build a plan around the experience you already have.</h2><p className="mt-2 text-sm leading-6 text-ink/70">Complete your career-return assessment to create a practical plan based on your previous role, career break and goals.</p><button type="button" onClick={() => setSection('journey')} className={buttonClass('primary', 'mt-6 gap-2')}>Start My Journey <ArrowRight className="h-4 w-4" /></button></>}
          </article>
          <article className="rounded-[1.5rem] border border-burgundy/15 bg-cream-light p-7 sm:p-9">
            <BriefcaseBusiness className="h-6 w-6 text-burgundy" />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink">Prepare for your return</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">Your next chapter includes more than courses. Build your resume, portfolio and interview confidence alongside your learning plan.</p>
            <button type="button" onClick={() => setSection('learning')} className="mt-5 text-sm font-semibold text-burgundy underline">Open career readiness toolkit</button>
          </article>
        </section>
      </div>
    </div>
  );
}
