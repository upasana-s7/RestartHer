export const EDUCATION_OPTIONS = [
  'Doctorate',
  'Postgraduate',
  'Undergraduate',
  'Diploma',
  '12th Pass',
  '10th Pass',
  'Other',
] as const;

export type EducationLevel = (typeof EDUCATION_OPTIONS)[number];

export const FIXED_GENDER = 'Female' as const;

export interface CandidateProfile {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  gender: typeof FIXED_GENDER;
  highest_education: EducationLevel;
  career_interests: string;
  skills: string;
  career_goals: string;
}

export interface ProfileEditDraft extends ProfileDraft {
  career_interests: string;
  skills: string;
  career_goals: string;
}

export interface ProfileDraft {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  highest_education: EducationLevel | '';
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;
const MINIMUM_AGE_YEARS = 16;

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  const latestAllowed = new Date(
    Date.UTC(today.getUTCFullYear() - MINIMUM_AGE_YEARS, today.getUTCMonth(), today.getUTCDate()),
  );
  return date <= latestAllowed && date.getUTCFullYear() > 1900;
}

export function validateProfileDraft(draft: ProfileDraft): string | null {
  if (!draft.first_name.trim()) return 'Please enter your first name.';
  if (!draft.last_name.trim()) return 'Please enter your last name.';
  if (!isValidBirthDate(draft.date_of_birth)) {
    return `Please enter a valid date of birth. You need to be at least ${MINIMUM_AGE_YEARS} years old.`;
  }
  if (!EMAIL_PATTERN.test(draft.email.trim())) return 'Please enter a valid email address.';
  if (!PHONE_PATTERN.test(draft.phone.trim())) return 'Please enter a valid phone number.';
  if (!draft.address.trim()) return 'Please enter your address.';
  if (!draft.highest_education) return 'Please choose your highest education.';
  return null;
}

export function isCandidateProfile(value: unknown): value is CandidateProfile {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.first_name === 'string' &&
    typeof row.last_name === 'string' &&
    typeof row.date_of_birth === 'string' &&
    typeof row.email === 'string' &&
    typeof row.phone === 'string' &&
    typeof row.address === 'string' &&
    row.gender === FIXED_GENDER &&
    typeof row.highest_education === 'string'
  );
}
