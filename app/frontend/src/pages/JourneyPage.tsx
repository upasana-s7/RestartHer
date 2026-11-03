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
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const saved = loadCareerRoadmap(userId);
    if (saved) { setRoadmap(saved); if (saved.assessment) setAnswers({ ...emptyAssessment, ...saved.assessment, personalContext: saved.assessment.personalContext ?? '' }); setConfirmed(Boolean(saved.confirmedAt)); }
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
    const updated = { ...roadmap, weeklyPlan, confirmedAt: undefined };
    setRoadmap(updated); if (userId) saveCareerRoadmap(userId, updated); setConfirmed(false);
  };

  const complete = ASSESSMENT_QUESTIONS.every(({ key }) => answers[key].trim().length > 0);

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="My Journey" title="Your comeback, step by step." description="A guided return-to-work plan built around your previous experience, career break, target role and available time." />

        {!roadmap && (
          <section className="mt-10 rounded-[1.5rem] border border-burgundy/15 bg-white p-7 shadow-card sm:p-10">
            <div className="flex items-center gap-3 text-burgundy"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-soft"><Compass className="h-5 w-5" /></span><p className="editorial-label">Your guided journey</p></div>
            <h2 className="mt-6 font-display text-3xl font-bold text-ink">Let's build a plan that fits your life.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/75">Answer seven short questions in your own words. Your AI guide will use your experience, goals and available time to create a plan you can review and edit.</p>
            <div className="mt-8 space-y-6">
              {ASSESSMENT_QUESTIONS.map((question, index) => (
                <div key={question.key}>
                  <label htmlFor={question.key} className={LABEL_CLASS}>0{index + 1}. {question.label}</label>
                  <p className="mb-2 text-xs text-muted">{question.hint}</p>
                  {'multiline' in question && question.multiline ? (
                    <textarea id={question.key} rows={2} value={answers[question.key]} onChange={(event) => updateAnswer(question.key, event.target.value)} placeholder={question.placeholder} className={FIELD_CLASS + ' resize-y'} />
                  ) : (
                    <input id={question.key} type="text" value={answers[question.key]} onChange={(event) => updateAnswer(question.key, event.target.value)} placeholder={question.placeholder} className={FIELD_CLASS} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-burgundy/15 pt-7">
              <label htmlFor="personal-context" className={LABEL_CLASS}>Anything else you'd like your AI guide to know? <span className="font-normal normal-case tracking-normal text-muted">(Optional)</span></label>
              <p className="mb-2 text-xs text-muted">Share anything the questions didn't capture — concerns, goals, skills you feel out of practice with, or circumstances you'd like the plan to consider.</p>
              <textarea id="personal-context" rows={5} maxLength={1500} value={answers.personalContext} onChange={(event) => updateAnswer('personalContext', event.target.value)} placeholder="" className={FIELD_CLASS + ' resize-y'} />
              <p className="mt-1 text-right text-xs text-muted">{answers.personalContext.length}/1500</p>
            </div>
            {error && <p role="alert" className="mt-5 rounded-lg bg-burgundy-soft p-3 text-sm text-burgundy">{error}</p>}
            <button type="button" disabled={!complete || generating} onClick={() => void generate()} className={buttonClass('primary', 'mt-8 gap-2')}>
              {generating ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Building your plan…</> : <>Generate my roadmap <Sparkles className="h-4 w-4" /></>}
            </button>
            {generating && <p className="mt-3 text-xs text-muted" aria-live="polite">Creating your personalised career-return plan…</p>}
          </section>
        )}

        {roadmap && (
          <section className="mt-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-burgundy/15 bg-cream-light p-5">
              <div><p className="editorial-label">Career profile</p><h2 className="mt-2 font-display text-xl font-bold text-ink">Your goals can change.</h2><p className="mt-1 text-sm text-ink/70">Edit your assessment answers whenever your priorities shift, then rebuild the plan.</p></div>
              <button type="button" onClick={() => setEditingProfile((value) => !value)} className={buttonClass('outline')}>{editingProfile ? 'Close profile editor' : 'Edit my answers'}</button>
            </div>
            {editingProfile && (
              <div className="mb-6 rounded-[1.5rem] border border-burgundy/15 bg-white p-6 shadow-card sm:p-8">
                <div className="space-y-5">
                  {ASSESSMENT_QUESTIONS.map((question, index) => (
                    <div key={question.key}>
                      <label htmlFor={'edit-' + question.key} className={LABEL_CLASS}>0{index + 1}. {question.label}</label>
                      {'multiline' in question && question.multiline ? (
                        <textarea id={'edit-' + question.key} rows={3} value={answers[question.key]} onChange={(event) => updateAnswer(question.key, event.target.value)} className={FIELD_CLASS + ' mt-1 resize-y'} />
                      ) : (
                        <input id={'edit-' + question.key} value={answers[question.key]} onChange={(event) => updateAnswer(question.key, event.target.value)} className={FIELD_CLASS + ' mt-1'} />
                      )}
                    </div>
                  ))}
                  <div><label htmlFor="edit-personal-context" className={LABEL_CLASS}>Additional context (optional)</label><textarea id="edit-personal-context" rows={3} maxLength={1500} value={answers.personalContext} onChange={(event) => updateAnswer('personalContext', event.target.value)} className={FIELD_CLASS + ' mt-1 resize-y'} /></div>
                </div>
                {error && <p role="alert" className="mt-4 text-sm text-burgundy">{error}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" disabled={!complete || generating} onClick={() => void generate('Please rebuild this roadmap from my updated assessment answers. Re-evaluate removed or added skills and fit the duration and availability.')} className={buttonClass('primary', 'gap-2')}>{generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Update profile & rebuild plan</button>
                  <button type="button" onClick={() => setEditingProfile(false)} className={buttonClass('outline')}>Cancel</button>
                </div>
                <p className="mt-3 text-xs text-muted">Review the rebuilt roadmap and confirm it to save the updated assessment and plan.</p>
              </div>
            )}
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
                  <textarea id="roadmap-change" rows={2} value={changeRequest} onChange={(event) => setChangeRequest(event.target.value)} className={FIELD_CLASS + ' mt-1 resize-y'} placeholder="" />
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
                  <p className="mt-1 text-sm text-ink/75">Your learning schedule and course recommendations are now available in Learning. Your previous experience remains the starting point of this plan.</p>
                  <button type="button" onClick={() => onNavigate('learning')} className={buttonClass('primary', 'mt-4 gap-2')}>Open my learning plan <ArrowRight className="h-4 w-4" /></button>
                  <button type="button" onClick={() => { const draft = { ...roadmap, confirmedAt: undefined }; saveCareerRoadmap(userId, draft); setRoadmap(draft); setConfirmed(false); }} className="ml-4 mt-4 text-sm font-semibold text-burgundy underline">Make changes</button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
