import { useEffect, useState } from 'react';
import { ArrowRight, BookOpenCheck, CheckCircle2, Compass, GraduationCap, Sparkles, Target } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';
import { useSectionRoute } from '@/hooks/useSectionRoute';
import { loadCareerRoadmap } from '@/lib/journey';
import type { CareerRoadmap } from '@/lib/journey';

type Pace = 'gentle' | 'steady' | 'focused';
const PACE_LABELS: Record<Pace, string> = { gentle: 'Gentle · flexible and light', steady: 'Steady · consistent weekly progress', focused: 'Focused · more intensive sessions' };

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { setSection } = useSectionRoute();
  const userId = user?.id ?? '';
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [savedCourses, setSavedCourses] = useState(0);
  const [pace, setPace] = useState<Pace>('gentle');

  useEffect(() => {
    if (!userId) return;
    setRoadmap(loadCareerRoadmap(userId));
    try {
      setCompletedTasks(new Set(JSON.parse(localStorage.getItem('restarther_task_progress_v1_' + userId) || '[]') as string[]));
      setSavedCourses((JSON.parse(localStorage.getItem('restarther_saved_courses_v1_' + userId) || '[]') as string[]).length);
      const savedPace = localStorage.getItem('restarther_learning_pace_v1_' + userId);
      if (savedPace === 'gentle' || savedPace === 'steady' || savedPace === 'focused') setPace(savedPace);
    } catch { setCompletedTasks(new Set()); setSavedCourses(0); }
  }, [userId]);

  const weeks = roadmap?.weeklyPlan ?? [];
  const taskCount = weeks.reduce((sum, week) => sum + week.tasks.length, 0);
  const completedCount = weeks.reduce((sum, week) => sum + week.tasks.filter((_, index) => completedTasks.has('week-' + week.week + '-task-' + index)).length, 0);
  const progress = taskCount ? Math.min(100, Math.round(completedCount / taskCount * 100)) : 0;
  const weekProgress = weeks.map((week) => ({
    week: week.week,
    focus: week.focus,
    total: week.tasks.length,
    done: week.tasks.filter((_, index) => completedTasks.has('week-' + week.week + '-task-' + index)).length,
  }));
  const nextTask = weeks.flatMap((week) => week.tasks.map((task, index) => ({ week: week.week, task, key: 'week-' + week.week + '-task-' + index }))).find((item) => !completedTasks.has(item.key));
  const confirmed = Boolean(roadmap?.confirmedAt);

  const choosePace = (next: Pace) => {
    setPace(next);
    if (userId) localStorage.setItem('restarther_learning_pace_v1_' + userId, next);
  };

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Your dashboard" title={profile?.first_name ? `Welcome back, ${profile.first_name}.` : 'Your comeback workspace.'} description="A calm, visual snapshot of what you are learning and the progress you have made. Move at a pace that fits your life." />

        <section className="mt-8 rounded-[1.5rem] border border-burgundy/15 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="editorial-label">Your learning journey</p><h2 className="mt-2 font-display text-2xl font-bold text-ink">{roadmap?.targetRole ?? 'Your next career chapter'}</h2><p className="mt-1 text-sm text-ink/70">{confirmed ? roadmap?.durationWeeks + ' week roadmap · confirmed' : roadmap ? 'Your roadmap is ready for review' : 'Start whenever you feel ready.'}</p></div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-soft text-burgundy"><Compass className="h-5 w-5" /></span>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink">Overall learning progress</span><strong className="font-display text-2xl text-burgundy">{progress}%</strong></div>
          <div role="progressbar" aria-label="Overall learning progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-3 overflow-hidden rounded-full bg-burgundy/10"><div className="h-full rounded-full bg-burgundy transition-all duration-500" style={{ width: progress + '%' }} /></div>
          <p className="mt-2 text-xs text-muted">{completedCount} of {taskCount} roadmap tasks completed. Progress is saved in this browser for this demo account.</p>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Roadmap milestones', value: String(weeks.filter((week) => weekProgress.find((item) => item.week === week.week)?.done === week.tasks.length && week.tasks.length > 0).length) + ' / ' + weeks.length, icon: Target },
            { label: 'Tasks completed', value: String(completedCount), icon: CheckCircle2 },
            { label: 'Skills in your plan', value: String(new Set(weeks.flatMap((week) => week.topics)).size), icon: BookOpenCheck },
            { label: 'Courses saved', value: String(savedCourses), icon: GraduationCap },
          ].map((item) => <article key={item.label} className="rounded-xl border border-burgundy/15 bg-white p-5 shadow-card"><item.icon className="h-5 w-5 text-burgundy" /><p className="mt-3 text-xs uppercase tracking-wider text-muted">{item.label}</p><p className="mt-1 font-display text-2xl font-bold text-ink">{item.value}</p></article>)}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-[1.5rem] border border-burgundy/15 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="editorial-label">Roadmap activity</p><h2 className="mt-2 font-display text-2xl font-bold text-ink">Your weekly progress</h2></div><span className="text-xs text-muted">Completed tasks by week</span></div>
            {weekProgress.length ? <div className="mt-6 flex min-h-40 items-end gap-2 overflow-x-auto pb-2" aria-label="Weekly completed task chart">
              {weekProgress.map((week) => <div key={week.week} className="flex min-w-8 flex-1 flex-col items-center gap-2"><span className="text-xs font-semibold text-burgundy">{week.done}/{week.total}</span><div className="flex h-28 w-full items-end rounded-t-md bg-burgundy/5"><div className="w-full rounded-t-md bg-burgundy/70 transition-all" style={{ height: (week.total ? week.done / week.total * 100 : 0) + '%' }} /></div><span className="text-[0.65rem] text-muted">W{week.week}</span></div>)}
            </div> : <p className="mt-5 rounded-xl bg-cream-light p-5 text-sm text-ink/70">Your weekly chart will appear once you create a roadmap.</p>}
          </article>
          <article className="rounded-[1.5rem] border border-burgundy/15 bg-cream-light p-6 sm:p-8">
            <p className="editorial-label flex items-center gap-2"><Sparkles className="h-4 w-4" /> One small step today</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink">{nextTask?.task ?? (confirmed ? 'You have reached the end of this roadmap.' : 'Explore your next chapter when you are ready.')}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">{nextTask ? 'Week ' + nextTask.week + ' · A suggested next action. There is no daily streak or deadline.' : 'You can take a pause or review what you have already learned.'}</p>
            <button type="button" onClick={() => setSection(confirmed ? 'learning' : 'journey')} className={buttonClass('primary', 'mt-5 gap-2')}>{confirmed ? 'Continue learning' : 'Start My Journey'} <ArrowRight className="h-4 w-4" /></button>
          </article>
        </section>

        <section className="mt-6 rounded-[1.5rem] border border-burgundy/15 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="editorial-label">Your learning rhythm</p><h2 className="mt-2 font-display text-2xl font-bold text-ink">Choose a pace that feels doable.</h2><p className="mt-1 text-sm text-ink/70">You can change this at any time. This is a preference, not a commitment.</p></div><span className="rounded-full bg-burgundy-soft px-3 py-1.5 text-xs font-semibold text-burgundy">{PACE_LABELS[pace]}</span></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(['gentle','steady','focused'] as Pace[]).map((option) => <button key={option} type="button" onClick={() => choosePace(option)} aria-pressed={pace === option} className={'rounded-xl border p-4 text-left transition-colors ' + (pace === option ? 'border-burgundy bg-burgundy-soft' : 'border-burgundy/15 bg-cream-light hover:border-burgundy/40')}><span className="font-semibold capitalize text-ink">{option} pace</span><p className="mt-1 text-xs leading-5 text-ink/70">{option === 'gentle' ? 'A little at a time with room for breaks.' : option === 'steady' ? 'Consistent, balanced weekly progress.' : 'More concentrated sessions when you have time.'}</p></button>)}
          </div>
        </section>

        {!roadmap && <section className="mt-6 rounded-xl border border-burgundy/15 bg-white p-6"><p className="text-sm text-ink/75">You can explore RestartHER's stories and courses before building a roadmap. There is no need to complete every step today.</p></section>}
      </div>
    </div>
  );
}
