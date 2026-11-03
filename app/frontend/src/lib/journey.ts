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
export const ASSESSMENT_QUESTIONS: Array<{ key: keyof CareerAssessment; label: string; hint: string; options: string[] }> = [
  {
    key: 'previousRole',
    label: 'What was your previous professional role or field?',
    hint: 'Choose the closest match to the work or profession you were part of before your break.',
    options: ['Software / IT', 'Data / analytics', 'Business / operations', 'Finance / accounting', 'Marketing / communications', 'Design / creative', 'Education / research', 'Healthcare', 'Human resources', 'Sales / customer support', 'Engineering / manufacturing', 'Other professional field'],
  },
  {
    key: 'breakDuration',
    label: 'How long have you been on a career break?',
    hint: 'There is no wrong answer. This helps us understand how much refreshing may be useful.',
    options: ['Less than 6 months', '6–12 months', '1–2 years', '2–5 years', '5–10 years', 'More than 10 years'],
  },
  {
    key: 'existingSkills',
    label: 'Which skills and experience do you already bring?',
    hint: 'Choose the closest description of your previous work and strengths.',
    options: ['Professional experience in my field', 'Technical tools and job-specific skills', 'Project, team or people management', 'Communication, client or stakeholder skills', 'A combination of these', 'I need help identifying my transferable skills'],
  },
  {
    key: 'targetRole',
    label: 'What role or field would you like to return to?',
    hint: 'Choose your preferred direction, even if you want to return to a slightly different role.',
    options: ['Return to my previous role / field', 'Technology and IT', 'Data and analytics', 'AI and machine learning', 'Business and operations', 'Finance', 'Marketing and communications', 'Design and creative work', 'Human resources', 'Education / research', 'Not sure yet'],
  },
  {
    key: 'learningNeeds',
    label: 'What would you most like to refresh or develop?',
    hint: 'This helps us focus your learning plan on the skills that matter to your return.',
    options: ['Refresh tools and technical skills', 'Learn new tools used in my field', 'Build practical projects or a portfolio', 'Update industry knowledge', 'Prepare my resume and interviews', 'Rebuild confidence and communication', 'A balanced combination'],
  },
  {
    key: 'availability',
    label: 'How much time can you set aside for your return-to-work plan?',
    hint: 'Choose a realistic daily pace and target duration. You can change this later.',
    options: ['30 min/day · 30 days', '1 hour/day · 30 days', '2 hours/day · 30 days', '1 hour/day · 45 days', '2 hours/day · 45 days', '1 hour/day · 60 days', '2 hours/day · 60 days', '1 hour/day · 90 days', '2 hours/day · 90 days'],
  },
  {
    key: 'biggestBarrier',
    label: 'What is your biggest challenge in returning to work?',
    hint: 'Your plan will include practical support for the challenge you select.',
    options: ['Lack of confidence after the break', 'Outdated skills or unfamiliar tools', 'Explaining my career gap', 'Balancing learning with family or other responsibilities', 'Uncertainty about suitable roles', 'Resume and interview preparation', 'Finding flexible or returnship opportunities', 'I am not sure where to restart'],
  },
];
export function emptyAssessment(): CareerAssessment {
  return { previousRole: '', breakDuration: '', existingSkills: '', targetRole: '', learningNeeds: '', availability: '1 hour/day · 30 days', biggestBarrier: '' };
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
    'Create exactly ' + targetWeeks + ' weeks to fit the selected target duration. Each week needs 1-3 topics, 2-3 specific achievable tasks and one observable milestone. Respect the selected daily time. Build on prior professional experience, identify transferable skills, and focus on refreshing or developing the skills needed for the selected return role. Include practical assignments and resume/interview preparation at a suitable stage. Be supportive about the career gap; never frame it as failure. Use only courseIds from the supplied catalogue; use [] when none fit. Do not invent courses, certificates, jobs, salaries or guarantees. Keep wording concise.',
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
    topics: Array.isArray(week.topics) ? week.topics.slice(0, 3).map(String) : [],
    tasks: Array.isArray(week.tasks) ? week.tasks.slice(0, 3).map(String) : [],
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
    { id: 'sap-developer-learning', terms: ['technology', 'it', 'software', 'development', 'developer', 'programming', 'coding'] },
  ];
  const selected = matches.filter(({ terms }) => terms.some((term) => interests.includes(term))).map(({ id }) => id);
  return selected.length ? selected : ['sap-learning-journeys'];
}
