import { useMemo, useState } from 'react';
import { BadgeCheck, BriefcaseBusiness, CalendarDays, Check, MessageCircleHeart, Sparkles, UsersRound, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { buttonClass } from '@/components/ui/buttonClass';
import { cn } from '@/lib/cn';

type Mentor = {
  id: string;
  name: string;
  role: string;
  experience: number;
  interests: string[];
  skills: string[];
  bio: string;
  approach: string;
  initials: string;
  tone: string;
};
const MENTORS: Mentor[] = [
  { id: 'mentor-data-01', name: 'Ananya Rao', role: 'Data Analytics Lead', experience: 11, interests: ['Data Analytics', 'Technology'], skills: ['SQL', 'Power BI', 'Data storytelling'], bio: 'A data analytics leader who helps returning professionals reconnect with data tools, rebuild confidence and shape a practical portfolio.', approach: 'Warm, structured sessions with a focus on small wins and real-world practice.', initials: 'AR', tone: 'from-rose-200 to-orange-100' },
  { id: 'mentor-ai-02', name: 'Meera Iyer', role: 'AI & Machine Learning Manager', experience: 9, interests: ['AI & Machine Learning', 'Technology'], skills: ['Python', 'Machine Learning', 'AI strategy'], bio: 'Supports professionals refreshing their technical foundations and finding a clear route back into AI and machine learning roles.', approach: 'Breaks complex topics into manageable steps and encourages learning by doing.', initials: 'MI', tone: 'from-violet-200 to-pink-100' },
  { id: 'mentor-software-03', name: 'Kavya Menon', role: 'Senior Software Engineer', experience: 12, interests: ['Software / IT', 'Technology'], skills: ['JavaScript', 'React', 'System design'], bio: 'Guides women returning to software roles through skill refreshers, interview preparation and confidence-building practice.', approach: 'Practical, encouraging and focused on the learner’s target role.', initials: 'KM', tone: 'from-sky-200 to-teal-100' },
  { id: 'mentor-business-04', name: 'Priya Shah', role: 'Business Operations Director', experience: 14, interests: ['Business & Operations', 'Leadership'], skills: ['Process improvement', 'Stakeholder management', 'Strategy'], bio: 'Helps experienced professionals translate their earlier work into current business roles and communicate their strengths.', approach: 'Career strategy, transferable-skills mapping and realistic next steps.', initials: 'PS', tone: 'from-amber-200 to-rose-100' },
  { id: 'mentor-finance-05', name: 'Nisha Kapoor', role: 'Finance Transformation Consultant', experience: 10, interests: ['Finance', 'Business & Operations'], skills: ['Financial analysis', 'Excel', 'ERP'], bio: 'Offers guidance for returning to finance, reporting and business transformation teams after a career pause.', approach: 'Clear refresh plans for tools, current practices and role readiness.', initials: 'NK', tone: 'from-emerald-200 to-lime-100' },
  { id: 'mentor-people-06', name: 'Sana Thomas', role: 'People & Talent Partner', experience: 13, interests: ['Human Resources', 'Leadership'], skills: ['Recruitment', 'People strategy', 'Interview coaching'], bio: 'Helps women prepare for the return-to-work conversation, update their professional story and navigate interviews.', approach: 'Supportive career conversations with actionable resume and interview feedback.', initials: 'ST', tone: 'from-fuchsia-200 to-indigo-100' },
];
const FILTERS = ['All interests', 'Data Analytics', 'AI & Machine Learning', 'Software / IT', 'Business & Operations', 'Finance', 'Human Resources', 'Leadership', 'Technology'];

const PLANS = [
  { id: 'guided-session', title: 'Focused 1:1 Session', price: '₹499', detail: '30-minute online session', includes: ['One focused career question', 'Skill-refresh guidance', 'A few next steps to take away'] },
  { id: 'deep-dive-session', title: 'Career Deep Dive', price: '₹999', detail: '60-minute online session', includes: ['Target-role and experience review', 'Personalised learning direction', 'Resume or interview discussion'] },
  { id: 'ongoing-guidance', title: 'Ongoing Guidance', price: '₹1,999', detail: 'Monthly concept package', includes: ['Two 1:1 online sessions', 'Between-session learning check-ins', 'Continued career-return support'] },
];

export default function MentorshipPage() {
  const [interest, setInterest] = useState('All interests');
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [chosenMentor, setChosenMentor] = useState(() => {
    try { return localStorage.getItem('restarther_chosen_mentor_demo') ?? ''; } catch { return ''; }
  });
  const [confirmation, setConfirmation] = useState('');
  const [planInterest, setPlanInterest] = useState('');

  const filtered = useMemo(() => interest === 'All interests' ? MENTORS : MENTORS.filter((mentor) => mentor.interests.includes(interest)), [interest]);

  const confirmMentor = (mentor: Mentor) => {
    setChosenMentor(mentor.id);
    try { localStorage.setItem('restarther_chosen_mentor_demo', mentor.id); } catch { /* Local demo selection remains in state. */ }
    setConfirmation(mentor.name + ' is selected as your mentor in this prototype.');
    setActiveMentor(null);
  };

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Mentorship" title="You don't have to find your way alone." description="Explore mentors by the field you want to return to. Choose a free mentor connection, or view optional one-on-one guidance plans." />

        <section className="mt-10 rounded-[1.5rem] border border-burgundy/15 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="editorial-label flex items-center gap-2"><UsersRound className="h-4 w-4" /> Find a mentor by interest</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink">Mentors for your next chapter</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/75">These sample mentor profiles are fictional demo profiles for the hackathon prototype. Filters help show how recommendations can be matched to career interests.</p>
            </div>
            <span className="rounded-full bg-burgundy-soft px-3 py-1.5 text-xs font-semibold text-burgundy">Free mentor selection</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter mentors by interest">
            {FILTERS.map((item) => (
              <button key={item} type="button" aria-pressed={interest === item} onClick={() => setInterest(item)} className={cn('rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors', interest === item ? 'border-burgundy bg-burgundy text-cream' : 'border-burgundy/20 text-ink/75 hover:bg-burgundy-soft')}>
                {item}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted" aria-live="polite">{filtered.length} mentor profiles match this interest</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((mentor) => (
              <article key={mentor.id} className="flex flex-col rounded-2xl border border-burgundy/15 bg-cream-light p-5 transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-xl font-bold text-burgundy ring-4 ring-white', mentor.tone)} aria-label={'Illustrative profile avatar for ' + mentor.name}>{mentor.initials}</div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-ink">{mentor.name}</h3>
                    <p className="text-sm text-ink/75">{mentor.role}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted"><BriefcaseBusiness className="h-3.5 w-3.5" /> {mentor.experience} years of experience</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">{mentor.skills.map(skill => <span key={skill} className="rounded-md bg-white px-2 py-1 text-xs text-ink/80">{skill}</span>)}</div>
                <p className="mt-4 text-sm leading-6 text-ink/75">{mentor.bio}</p>
                <button type="button" onClick={() => { setActiveMentor(mentor); setConfirmation(''); }} className={buttonClass('outline', 'mt-auto self-start gap-2 pt-5')}>View mentor <Sparkles className="h-4 w-4" /></button>
                {chosenMentor === mentor.id && <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-burgundy"><Check className="h-3.5 w-3.5" /> Your selected mentor</p>}
              </article>
            ))}
          </div>
          {confirmation && <p role="status" className="mt-6 rounded-xl bg-burgundy-soft p-4 text-sm font-medium text-burgundy">{confirmation}</p>}
        </section>

        <section className="mt-10 rounded-[1.5rem] border border-burgundy/15 bg-white p-6 shadow-card sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy-soft text-burgundy"><MessageCircleHeart className="h-5 w-5" /></span>
            <div>
              <p className="editorial-label">Optional paid guidance</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">More dedicated time with a mentor</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/75">The free option lets you select a mentor in this demo. Paid plans are a pricing concept for more focused one-on-one career guidance, online sessions and follow-up support.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan, index) => (
              <article key={plan.id} className={cn('rounded-2xl border p-5', index === 1 ? 'border-burgundy/40 bg-cream-light' : 'border-burgundy/15 bg-white')}>
                <p className="editorial-label">{index === 0 ? 'Start here' : index === 1 ? 'Deeper support' : 'Continue together'}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">{plan.title}</h3>
                <p className="mt-3 font-display text-3xl font-bold text-burgundy">{plan.price}</p>
                <p className="mt-1 text-xs text-muted">{plan.detail}</p>
                <ul className="mt-4 space-y-2">{plan.includes.map(item => <li key={item} className="flex gap-2 text-sm text-ink/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />{item}</li>)}</ul>
                <button type="button" onClick={() => setPlanInterest(plan.id)} className={buttonClass(index === 1 ? 'primary' : 'outline', 'mt-5 w-full')}>{planInterest === plan.id ? 'Interest noted in demo' : 'Explore this plan'}</button>
              </article>
            ))}
          </div>
          <p className="mt-5 rounded-lg bg-cream-light p-3 text-xs leading-5 text-muted">Prototype only: prices are illustrative, and no payment, mentor scheduling, Google Meet link or real mentor availability is connected. Please do not treat these as live offers.</p>
        </section>
      </div>

      {activeMentor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-4" onClick={() => setActiveMentor(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="mentor-dialog-title" className="animate-sheet-in my-auto w-full max-w-xl rounded-[1.5rem] bg-white p-6 shadow-panel sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn('flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-2xl font-bold text-burgundy ring-4 ring-cream-light', activeMentor.tone)}>{activeMentor.initials}</div>
                <div>
                  <p className="editorial-label">Mentor profile · Demo</p>
                  <h2 id="mentor-dialog-title" className="mt-1 font-display text-2xl font-bold text-ink">{activeMentor.name}</h2>
                  <p className="text-sm text-ink/75">{activeMentor.role}</p>
                  <p className="mt-1 text-xs text-muted">{activeMentor.experience} years of experience</p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveMentor(null)} aria-label="Close mentor profile" className="rounded-full p-2 text-ink/70 hover:bg-cream-light"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 space-y-5">
              <div><p className="editorial-label">About</p><p className="mt-2 text-sm leading-6 text-ink/75">{activeMentor.bio}</p></div>
              <div><p className="editorial-label">Mentoring approach</p><p className="mt-2 text-sm leading-6 text-ink/75">{activeMentor.approach}</p></div>
              <div><p className="editorial-label">Core skills</p><div className="mt-2 flex flex-wrap gap-2">{activeMentor.skills.map(skill => <span key={skill} className="rounded-full bg-cream-light px-3 py-1.5 text-xs font-medium text-ink/80">{skill}</span>)}</div></div>
              <div><p className="editorial-label">Areas of interest</p><p className="mt-2 text-sm text-ink/75">{activeMentor.interests.join(' · ')}</p></div>
              <div className="rounded-xl bg-burgundy-soft p-4"><p className="flex items-center gap-2 text-sm font-semibold text-burgundy"><BadgeCheck className="h-4 w-4" /> Free mentor selection</p><p className="mt-1 text-xs leading-5 text-ink/75">Confirming saves your mentor choice in this prototype. It does not send a request or schedule a session.</p></div>
            </div>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setActiveMentor(null)} className={buttonClass('outline', 'gap-2')}>Cancel</button>
              <button type="button" onClick={() => confirmMentor(activeMentor)} className={buttonClass('primary', 'gap-2')}>Confirm mentor <Check className="h-4 w-4" /></button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
