import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/ui/controls';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';
import type { Section } from '@/hooks/useSectionRoute';
import {
  ASSESSMENT_QUESTIONS, emptyAssessment, generateCareerRoadmap, loadCareerRoadmap,
  saveCareerRoadmap, type CareerAssessment, type CareerRoadmap,
} from '@/lib/journey';

export default function JourneyPage({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [answers, setAnswers] = useState<CareerAssessment>(emptyAssessment);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [changeRequest, setChangeRequest] = useState('');

  useEffect(() => {
    if (!userId) return;
    const saved = loadCareerRoadmap(userId);
    if (saved) { setRoadmap(saved); setConfirmed(Boolean(saved.confirmedAt)); }
  }, [userId]);

  const updateAnswer = (key: keyof CareerAssessment, value: string) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  const generate = async (revision = '') => {
    setGenerating(true); setError('');
    try {
      const next = await generateCareerRoadmap(answers, revision);
      setRoadmap(next); setConfirmed(false); setChangeRequest('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not create your roadmap. Please try again.');
    } finally { setGenerating(false); }
  };

  const confirm = () => {
    if (!userId || !roadmap) return;
    const saved = { ...roadmap, confirmedAt: new Date().toISOString() };
    saveCareerRoadmap(userId, saved); setRoadmap(saved); setConfirmed(true);
  };

  const editWeek = (index: number, field: 'focus' | 'milestone' | 'tasks', value: string) => {
    if (!roadmap) return;
    const weeklyPlan = roadmap.weeklyPlan.map((week, i) => i !== index ? week : {
      ...week, [field]: field === 'tasks' ? value.split('\n').filter(Boolean) : value,
    });
    setRoadmap({ ...roadmap, weeklyPlan, confirmedAt: undefined }); setConfirmed(false);
  };

  const complete = ASSESSMENT_QUESTIONS.every(({ key }) => answers[key].trim().length > 0);

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="My Journey" title="Your comeback, step by step." description="A guided career reset built around your experience, goals and the time you have available." />

        {!roadmap && (
          <section className="mt-10 rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-10">
            <div className="flex items-center gap-3 text-burgundy"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-soft"><Compass className="h-5 w-5" /></span><p className="editorial-label">Your guided journey</p></div>
            <h2 className="mt-6 font-display text-3xl font-bold text-ink">Let's build a plan that fits your life.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/75">Answer seven short questions. Your AI guide will turn your answers into a practical learning roadmap. You can review, edit or regenerate it before confirming anything.</p>
            <div className="mt-8 space-y-7">
              {ASSESSMENT_QUESTIONS.map((question, index) => (
                <div key={question.key}>
                  <label htmlFor={question.key} className={LABEL_CLASS}>0{index + 1}. {question.label}</label>
                  <p className="mb-2 text-xs text-muted">{question.hint}</p>
                  {question.options ? (
                    <select id={question.key} value={answers[question.key]} onChange={(event) => updateAnswer(question.key, event.target.value)} className={FIELD_CLASS}>
                      <option value="">Choose an answer</option>
                      {question.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <textarea id={question.key} rows={2} value={answers[question.key]} onChange={(event) => updateAnswer(question.key, event.target.value)} className={FIELD_CLASS + ' resize-y'} placeholder="Your answer..." />
                  )}
                </div>
              ))}
            </div>
            {error && <p role="alert" className="mt-5 rounded-lg bg-burgundy-soft p-3 text-sm text-burgundy">{error}</p>}
            <button type="button" disabled={!complete || generating} onClick={() => void generate()} className={buttonClass('primary', 'mt-8 gap-2')}>
              {generating ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Creating your roadmap…</> : <>Generate my roadmap <Sparkles className="h-4 w-4" /></>}
            </button>
            {generating && <p className="mt-3 text-xs text-muted" aria-live="polite">Your answers are being turned into a week-by-week plan. This can take a little time.</p>}
          </section>
        )}

        {roadmap && (
          <section className="mt-10">
            <div className="rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="editorial-label flex items-center gap-2"><Sparkles className="h-4 w-4" /> Your personal roadmap</p>
                {confirmed && <span className="inline-flex items-center gap-2 rounded-full bg-burgundy-soft px-3 py-1.5 text-xs font-semibold text-burgundy"><CheckCircle2 className="h-4 w-4" /> Confirmed</span>}
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-ink">{roadmap.title}</h2>
              <p className="mt-2 font-label text-sm font-semibold text-burgundy">Career direction: {roadmap.targetRole} · {roadmap.durationWeeks} weeks</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/75">{roadmap.overview}</p>
              <div className="mt-8 space-y-5">
                {roadmap.weeklyPlan.map((week, index) => (
                  <article key={week.week} className="rounded-xl border border-burgundy/15 bg-cream-light p-5 sm:p-6">
                    <p className="editorial-label">Week {week.week}</p>
                    <label className={LABEL_CLASS}>Focus</label>
                    <input value={week.focus} onChange={(event) => editWeek(index, 'focus', event.target.value)} disabled={confirmed} className={FIELD_CLASS + ' mt-1'} />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Topics</p>
                    <p className="mt-1 text-sm text-ink/80">{week.topics.join(' · ')}</p>
                    <label className={LABEL_CLASS + ' mt-4'}>Learning tasks (one per line)</label>
                    <textarea rows={3} value={week.tasks.join('\n')} onChange={(event) => editWeek(index, 'tasks', event.target.value)} disabled={confirmed} className={FIELD_CLASS + ' mt-1 resize-y'} />
                    <label className={LABEL_CLASS + ' mt-4'}>Your milestone</label>
                    <input value={week.milestone} onChange={(event) => editWeek(index, 'milestone', event.target.value)} disabled={confirmed} className={FIELD_CLASS + ' mt-1'} />
                  </article>
                ))}
              </div>
              {!confirmed ? (
                <>
                  <label htmlFor="roadmap-change" className={LABEL_CLASS + ' mt-8'}>Want AI to change something?</label>
                  <textarea id="roadmap-change" rows={2} value={changeRequest} onChange={(event) => setChangeRequest(event.target.value)} className={FIELD_CLASS + ' mt-1 resize-y'} placeholder="E.g. make this a slower 6-week plan with more hands-on practice." />
                  {error && <p role="alert" className="mt-4 text-sm text-burgundy">{error}</p>}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" disabled={generating} onClick={() => void generate(changeRequest)} className={buttonClass('outline', 'gap-2')}>
                      {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Regenerate with AI
                    </button>
                    <button type="button" onClick={confirm} className={buttonClass('primary', 'gap-2')}>Confirm my roadmap <CheckCircle2 className="h-4 w-4" /></button>
                  </div>
                </>
              ) : (
                <div className="mt-8 rounded-xl bg-burgundy-soft p-5">
                  <p className="font-semibold text-ink">Your roadmap is confirmed.</p>
                  <p className="mt-1 text-sm text-ink/75">Your learning schedule and course recommendations are now available in Learning.</p>
                  <button type="button" onClick={() => onNavigate('learning')} className={buttonClass('primary', 'mt-4 gap-2')}>Open my learning plan <ArrowRight className="h-4 w-4" /></button>
                  <button type="button" onClick={() => { setRoadmap({ ...roadmap, confirmedAt: undefined }); setConfirmed(false); }} className="ml-4 mt-4 text-sm font-semibold text-burgundy underline">Make changes</button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
