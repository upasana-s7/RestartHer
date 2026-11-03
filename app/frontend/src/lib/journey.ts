import { COURSES } from '@/data/courses';
import { sendCompanionMessage } from '@/lib/restartHerApi';

export interface CareerAssessment {
  goal: string;
  targetRole: string;
  experience: string;
  existingSkills: string;
  weeklyTime: string;
  learningPreference: string;
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
}
export const ASSESSMENT_QUESTIONS: Array<{ key: keyof CareerAssessment; label: string; hint: string; options?: string[] }> = [
  { key: 'goal', label: 'What would you like your next career chapter to look like?', hint: 'Describe the kind of work or change you hope to make.' },
  { key: 'targetRole', label: 'Which role or career area interests you most?', hint: 'It is okay if you are still exploring.' },
  { key: 'experience', label: 'What best describes your previous work or learning experience?', hint: 'Include career breaks, education, volunteering or projects.' },
  { key: 'existingSkills', label: 'What skills or strengths do you already bring?', hint: 'List tools, subject knowledge, communication or people skills.' },
  { key: 'weeklyTime', label: 'How much time can you realistically set aside each week?', hint: 'Choose a pace that fits your life.', options: ['1–3 hours', '4–6 hours', '7–10 hours', '11+ hours'] },
  { key: 'learningPreference', label: 'How do you prefer to learn?', hint: 'Pick what feels most comfortable.', options: ['Short videos and guided lessons', 'Reading and self-paced courses', 'Hands-on projects and practice', 'A mix of these'] },
  { key: 'biggestBarrier', label: 'What is the biggest thing making it difficult to restart?', hint: 'For example: confidence, time, knowing where to begin, or updating skills.' },
];
export function emptyAssessment(): CareerAssessment {
  return { goal: '', targetRole: '', experience: '', existingSkills: '', weeklyTime: '4–6 hours', learningPreference: 'A mix of these', biggestBarrier: '' };
}
export function loadCareerRoadmap(userId: string): CareerRoadmap | null {
  try {
    const raw = localStorage.getItem('restarther_roadmap_v1_' + userId);
    return raw ? JSON.parse(raw) as CareerRoadmap : null;
  } catch { return null; }
}
export function saveCareerRoadmap(userId: string, roadmap: CareerRoadmap): void {
  localStorage.setItem('restarther_roadmap_v1_' + userId, JSON.stringify(roadmap));
}
export async function generateCareerRoadmap(answers: CareerAssessment, revision = ''): Promise<CareerRoadmap> {
  const catalogue = COURSES.map((course) => ({ id: course.id, title: course.title, provider: course.provider, skills: course.skills, level: course.level, duration: course.duration }));
  const prompt = [
    'Create a practical, supportive career comeback learning roadmap from this seven-question assessment.',
    'Return ONLY valid JSON, no markdown fences, matching this shape:',
    '{"title":"short title","targetRole":"target role","overview":"2-3 personalised sentences","durationWeeks":4,"weeklyPlan":[{"week":1,"focus":"focus","topics":["topic"],"tasks":["specific task"],"milestone":"observable deliverable","courseIds":["valid catalogue id"]}]}',
    'Create 4 to 6 weeks. Every week needs 2-4 specific tasks, a concrete milestone, and only courseIds from the supplied catalogue. Use an empty courseIds array if none fit. Match the user available weekly time. Start with foundations, then practice, then a small portfolio-ready outcome. Do not invent courses, certificates, jobs, or guarantees.',
    'ASSESSMENT: ' + JSON.stringify(answers),
    'AVAILABLE COURSE CATALOGUE: ' + JSON.stringify(catalogue),
    revision ? 'REQUESTED CHANGE: ' + revision + '. Revise the plan to honour this while preserving useful parts.' : '',
  ].filter(Boolean).join('\n');
  const raw = await sendCompanionMessage(prompt);
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('The AI response was not a usable roadmap. Please try generating it again.');
  let parsed: unknown;
  try { parsed = JSON.parse(raw.slice(start, end + 1)); }
  catch { throw new Error('The roadmap could not be formatted correctly. Please try again.'); }
  const value = parsed as Partial<CareerRoadmap>;
  if (typeof value.title !== 'string' || typeof value.targetRole !== 'string' || !Array.isArray(value.weeklyPlan) || !value.weeklyPlan.length) {
    throw new Error('The AI returned an incomplete roadmap. Please generate it again.');
  }
  const validIds = new Set(COURSES.map((course) => course.id));
  const weeklyPlan = value.weeklyPlan.map((week, index) => ({
    week: Number(week.week) || index + 1,
    focus: String(week.focus || 'Week ' + (index + 1)),
    topics: Array.isArray(week.topics) ? week.topics.map(String) : [],
    tasks: Array.isArray(week.tasks) ? week.tasks.map(String) : [],
    milestone: String(week.milestone || 'Review what you have learned'),
    courseIds: Array.isArray(week.courseIds) ? week.courseIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)) : [],
  }));
  return { title: value.title, targetRole: value.targetRole, overview: String(value.overview || ''), durationWeeks: weeklyPlan.length, weeklyPlan };
}
