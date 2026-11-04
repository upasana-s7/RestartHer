export interface Article {
  id: string;
  number: string;
  category: string;
  headline: string;
  preview: string;
  body: string[];
  readingTime: string;
  image: string;
  imageAlt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  journey: string;
  quote: string;
  body: string[];
  portrait: string;
  portraitAlt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  provider: string;
  providerUrl: string;
  category: string;
  skills: string[];
  level: CourseLevel;
  duration: string;
  cost: 'Free' | 'Paid';
  hasCertificate: boolean;
  certificateNote: string;
  summary: string;
}

export type OpportunityType = 'Internship' | 'Full-time' | 'Part-time';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type Compensation = 'Stipend' | 'Unpaid' | 'Salary';
export type ExperienceLevel = 'Fresher / entry-level' | 'Experienced';

export interface Opportunity {
  id: string;
  company: string;
  title: string;
  type: OpportunityType;
  workMode: WorkMode;
  location: string;
  category: string;
  experience: ExperienceLevel;
  compensation: Compensation;
  pay: string;
  durationMonths: number | null;
  skills: string[];
  postedOn: string;
  deadline: string;
  summary: string;
  responsibilities: string[];
  eligibility: string;
  applyUrl: string | null;
  source: string;
}
