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
  assessment?: CareerAssessment;
}
export const ASSESSMENT_QUESTIONS: Array<{ key: keyof CareerAssessment; label: string; hint: string; options: string[] }> = [
  {
    key: 'experience',
    label: 'Where are you right now?',
    hint: 'Choose the option that best describes your current stage.',
    options: ['Student or recent graduate', 'Currently working', 'Taking a career break', 'Returning after a long break', 'Exploring my first career', 'Changing career direction'],
  },
  {
    key: 'targetRole',
    label: 'Which career area interests you?',
    hint: 'It is okay if you are still exploring.',
    options: ['Technology and IT', 'Data and analytics', 'AI and machine learning', 'Design and creative work', 'Business and management', 'Marketing and communication', 'Finance', 'Not sure yet'],
  },
  {
    key: 'existingSkills',
    label: 'What best describes the skills you already have?',
    hint: 'Think about studies, work, projects and everyday strengths.',
    options: ['I am starting from scratch', 'Basic computer and digital skills', 'Some technical or subject knowledge', 'I have completed projects or practical work', 'Strong communication or people skills', 'A mix of these'],
  },
  {
    key: 'goal',
    label: 'What would you most like to improve?',
    hint: 'Choose the skill area you want your roadmap to focus on.',
    options: ['Technical or job-specific skills', 'Communication and presentation', 'Confidence and interview skills', 'Practical projects and experience', 'A balanced mix of skills'],
  },
  {
    key: 'learningPreference',
    label: 'How do you feel about communication and confidence?',
    hint: 'This helps us make your plan supportive, not overwhelming.',
    options: ['I feel comfortable sharing my ideas', 'I am somewhat confident but want to improve', 'I lack confidence and want guided practice', 'I want to improve both communication and confidence'],
  },
  {
    key: 'weeklyTime',
    label: 'How much time can you set aside each week?',
    hint: 'Choose a realistic pace.',
    options: ['1–3 hours', '4–6 hours', '7–10 hours', '11+ hours'],
  },
  {
    key: 'biggestBarrier',
    label: 'What is your biggest challenge right now?',
    hint: 'Pick the one that affects you most.',
    options: ['I do not know where to start', 'Lack of confidence', 'Limited time or other responsibilities', 'I need to update my skills', 'I need practical experience', 'I feel overwhelmed or inconsistent'],
  },
];
export function emptyAssessment(): CareerAssessment {
  return { goal: '', targetRole: '', experience: '', existingSkills: '', weeklyTime: '4–6 hours', learningPreference: '', biggestBarrier: '' };
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
  const catalogue = COURSES.map((course) => ({ id: course.id, title: course.title, skills: course.skills, level: course.level }));
  const prompt = [
    'Build a concise, personalised learning roadmap using this short career check-in.',
    'Return ONLY valid JSON with this exact shape:',
    '{"title":"short title","targetRole":"career area","overview":"two short personalised sentences","durationWeeks":4,"weeklyPlan":[{"week":1,"focus":"focus","topics":["topic"],"tasks":["specific task","specific task"],"milestone":"observable result","courseIds":["valid catalogue id"]}]}',
    'Create exactly 4 practical weeks. Each week needs 1-2 topics, 2 specific achievable tasks, one observable milestone, and only courseIds from the supplied catalogue (use [] when none fit). Keep the plan beginner-friendly and realistic for the weekly time selected. Include the chosen skill-development goal and support communication/confidence needs when relevant. Do not invent courses, certificates, jobs, or guarantees. Keep wording concise.',
    'CAREER CHECK-IN: ' + JSON.stringify(answers),
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
  const weeklyPlan = value.weeklyPlan.slice(0, 4).map((week, index) => ({
    week: Number(week.week) || index + 1,
    focus: String(week.focus || 'Week ' + (index + 1)),
    topics: Array.isArray(week.topics) ? week.topics.slice(0, 3).map(String) : [],
    tasks: Array.isArray(week.tasks) ? week.tasks.slice(0, 3).map(String) : [],
    milestone: String(week.milestone || 'Review what you have learned'),
    courseIds: Array.isArray(week.courseIds) ? week.courseIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)) : [],
  }));
  return { title: value.title, targetRole: value.targetRole, overview: String(value.overview || ''), durationWeeks: weeklyPlan.length, weeklyPlan, assessment: answers };
}
