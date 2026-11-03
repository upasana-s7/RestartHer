import { COURSES } from '@/data/courses';
import { sendCompanionMessage } from '@/lib/restartHerApi';

export interface CareerAssessment {
  previousRole: string;
  breakDuration: string;
  existingSkills: string;
  targetRole: string;
  learningNeeds: string;
  availability: string;
  biggestBarrier: string;
  personalContext: string;
}
export interface RoadmapWeek {
  week: number;
  focus: string;
  topics: string[];
  tasks: string[];
  milestone: string;
  courseIds: string[];
}
export interface CareerRoadmap {
  title: string;
  targetRole: string;
  overview: string;
  durationWeeks: number;
  weeklyPlan: RoadmapWeek[];
  confirmedAt?: string;
  assessment?: CareerAssessment;
}
type AssessmentQuestionKey = Exclude<keyof CareerAssessment, 'personalContext'>;
export const ASSESSMENT_QUESTIONS: Array<{ key: AssessmentQuestionKey; label: string; hint: string; placeholder: string; multiline?: boolean }> = [
  {
    key: 'previousRole',
    label: 'What was your previous role or field?',
    hint: 'Tell us your job title, industry or area of work.',
    placeholder: 'E.g. Software engineer, accountant, teacher, project manager',
  },
  {
    key: 'breakDuration',
    label: 'How long have you been away from work?',
    hint: 'An approximate duration is perfectly fine.',
    placeholder: 'E.g. 3 years, 5–10 years, since 2019',
  },
  {
    key: 'existingSkills',
    label: 'What experience and skills do you already have?',
    hint: 'Mention your responsibilities, tools, strengths or areas of expertise.',
    placeholder: 'E.g. Team management, Excel, client communication, SQL', multiline: true,
  },
  {
    key: 'targetRole',
    label: 'What kind of role would you like to return to?',
    hint: 'You can name a specific job or a broader field.',
    placeholder: 'E.g. Data analyst, software developer, finance, or my previous role',
  },
  {
    key: 'learningNeeds',
    label: 'What would you like to refresh or learn?',
    hint: 'Tell us which skills, tools or knowledge you want to work on.',
    placeholder: 'E.g. Refresh Python and SQL, learn current industry tools', multiline: true,
  },
  {
    key: 'availability',
    label: 'How much time can you commit?',
    hint: 'Include your daily study time and the time you want your plan to cover.',
    placeholder: 'E.g. 1 hour a day for 30 days',
  },
  {
    key: 'biggestBarrier',
    label: 'What feels like your biggest challenge right now?',
    hint: 'Be honest. This helps us make the plan more supportive and realistic.',
    placeholder: 'E.g. Low confidence, outdated skills, explaining my career break',
  },
];
export function emptyAssessment(): CareerAssessment {
  return { previousRole: '', breakDuration: '', existingSkills: '', targetRole: '', learningNeeds: '', availability: '', biggestBarrier: '', personalContext: '' };
}
export function loadCareerRoadmap(userId: string): CareerRoadmap | null {
  try {
    const raw = localStorage.getItem('restarther_roadmap_v1_' + userId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CareerRoadmap;
    // Older assessment drafts used a student-focused schema; ask those learners to refresh it.
    if (parsed.assessment && !('previousRole' in parsed.assessment)) return null;
    return parsed;
  } catch { return null; }
}
export function saveCareerRoadmap(userId: string, roadmap: CareerRoadmap): void {
  localStorage.setItem('restarther_roadmap_v1_' + userId, JSON.stringify(roadmap));
}
function getTargetWeeks(availability: string): number {
  const days = Number(availability.match(/(\d+)\s*days?/i)?.[1] ?? 30);
  return Math.max(1, Math.min(13, Math.ceil(days / 7)));
}
export async function generateCareerRoadmap(answers: CareerAssessment, revision = ''): Promise<CareerRoadmap> {
  const catalogue = COURSES.map((course) => ({ id: course.id, title: course.title, provider: course.provider, skills: course.skills, level: course.level }));
  const targetWeeks = getTargetWeeks(answers.availability);
  const prompt = [
    'You are creating a career re-entry plan for a woman with prior professional experience who is returning after a career break. Do not treat her as a student or first-time job seeker.',
    'Return ONLY valid JSON with this exact shape:',
    '{"title":"short title","targetRole":"target role","overview":"where she stands now, what she aims to achieve and how this plan helps","durationWeeks":' + targetWeeks + ',"weeklyPlan":[{"week":1,"focus":"focus","topics":["topic"],"tasks":["specific task","specific task"],"milestone":"observable result","courseIds":["valid catalogue id"]}]}',
    'Create exactly ' + targetWeeks + ' weeks, aligned to her chosen duration and realistic daily availability. Structure the journey progressively: foundations and refresh first, then guided practice, applied exercises, and a portfolio/career-readiness outcome where appropriate. Each week needs 2-4 specific topics, 3-5 actionable tasks, and one measurable milestone. Each task must explain the actual action (not generic labels like learn/practice), include a realistic time estimate in minutes, and identify an output or check for understanding. Give the overview a useful high-level learning approach: how the skill will be approached, why the sequence works, and what she should be able to do by the end. Use approachable language and avoid dumping an overwhelming list. Build on prior experience, refresh relevant skills, include hands-on work and suitable resume/interview preparation. Be encouraging about the career gap. Use only courseIds from the catalogue; use [] when none fit. Do not invent courses, certificates, jobs, salaries or guarantees. Keep concise but sufficiently informative.',
    'CAREER RETURN ASSESSMENT: ' + JSON.stringify(answers),
    'AVAILABLE COURSES: ' + JSON.stringify(catalogue),
    revision ? 'REQUESTED CHANGE: ' + revision + '. Apply it while keeping the plan concise.' : '',
  ].filter(Boolean).join('\n');
  const raw = await sendCompanionMessage(prompt, [], 'roadmap');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('The AI response was not a usable roadmap. Please try again.');
  let parsed: unknown;
  try { parsed = JSON.parse(raw.slice(start, end + 1)); }
  catch { throw new Error('The roadmap could not be formatted correctly. Please try again.'); }
  const value = parsed as Partial<CareerRoadmap>;
  if (typeof value.title !== 'string' || typeof value.targetRole !== 'string' || !Array.isArray(value.weeklyPlan) || !value.weeklyPlan.length) {
    throw new Error('The AI returned an incomplete roadmap. Please generate it again.');
  }
  const validIds = new Set(COURSES.map((course) => course.id));
  const weeklyPlan = value.weeklyPlan.slice(0, targetWeeks).map((week, index) => ({
    week: Number(week.week) || index + 1,
    focus: String(week.focus || 'Week ' + (index + 1)),
    topics: Array.isArray(week.topics) ? week.topics.slice(0, 4).map(String) : [],
    tasks: Array.isArray(week.tasks) ? week.tasks.slice(0, 5).map(String) : [],
    milestone: String(week.milestone || 'Review what you have learned'),
    courseIds: Array.isArray(week.courseIds) ? week.courseIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)) : [],
  }));
  return { title: value.title, targetRole: value.targetRole, overview: String(value.overview || ''), durationWeeks: weeklyPlan.length, weeklyPlan, assessment: answers };
}

/** Match SAP learning resources to a learner's previous experience and target return role. */
export function getRecommendedSapCourseIds(assessment?: CareerAssessment): string[] {
  if (!assessment) return [];
  const interests = [assessment.previousRole, assessment.targetRole, assessment.learningNeeds, assessment.existingSkills]
    .join(' ').toLowerCase();
  const matches: Array<{ id: string; terms: string[] }> = [
    { id: 'sap-analytics-cloud-data-analyst', terms: ['data', 'analytics', 'analyst', 'dashboard', 'reporting'] },
    { id: 'sap-business-data-cloud', terms: ['data', 'analytics', 'business', 'machine learning'] },
    { id: 'sap-bw4hana', terms: ['data', 'analytics', 'warehouse', 'database', 'reporting'] },
    { id: 'sap-ai-fundamentals', terms: ['ai', 'artificial intelligence', 'machine learning', 'technology', 'it', 'software'] },
    { id: 'sap-generative-ai-hub', terms: ['ai', 'artificial intelligence', 'generative', 'developer', 'technology'] },
    { id: 'sap-s4hana-cloud', terms: ['business', 'management', 'finance', 'operations', 'erp', 'consulting'] },
  ];
  const selected = matches.filter(({ terms }) => terms.some((term) => interests.includes(term))).map(({ id }) => id);
  return selected.length ? selected : ['sap-analytics-cloud-data-analyst'];
}
