import type { Opportunity, OpportunityType } from '@/types/content';

export const RECENT_WINDOW_DAYS = 14;

export interface OpportunityFilters {
  query: string;
  type: 'all' | OpportunityType;
  workMode: 'all' | Opportunity['workMode'];
  compensation: 'all' | Opportunity['compensation'];
  experience: 'all' | Opportunity['experience'];
  duration: 'all' | '1-2' | '3-6' | '6+';
  category: string;
  recentOnly: boolean;
  sort: 'relevance' | 'newest';
}

export const DEFAULT_OPPORTUNITY_FILTERS: OpportunityFilters = {
  query: '',
  type: 'all',
  workMode: 'all',
  compensation: 'all',
  experience: 'all',
  duration: 'all',
  category: 'all',
  recentOnly: false,
  sort: 'relevance',
};

const DAY_MS = 24 * 60 * 60 * 1000;

function postedTime(opportunity: Opportunity): number {
  return Date.parse(`${opportunity.postedOn}T00:00:00Z`);
}

function matchesDuration(months: number | null, bucket: OpportunityFilters['duration']): boolean {
  if (bucket === 'all') return true;
  if (months === null) return false;
  if (bucket === '1-2') return months >= 1 && months <= 2;
  if (bucket === '3-6') return months >= 3 && months <= 6;
  return months > 6;
}

function relevanceScore(opportunity: Opportunity, query: string): number {
  if (!query) return 0;
  let score = 0;
  if (opportunity.title.toLowerCase().includes(query)) score += 3;
  if (opportunity.company.toLowerCase().includes(query)) score += 2;
  if (opportunity.skills.some((skill) => skill.toLowerCase().includes(query))) score += 1;
  return score;
}

export function filterOpportunities(opportunities: Opportunity[], filters: OpportunityFilters, now: number): Opportunity[] {
  const query = filters.query.trim().toLowerCase();

  const matched = opportunities
    .filter((item) => {
      if (!query) return true;
      return relevanceScore(item, query) > 0 || item.location.toLowerCase().includes(query);
    })
    .filter((item) => filters.type === 'all' || item.type === filters.type)
    .filter((item) => filters.workMode === 'all' || item.workMode === filters.workMode)
    .filter((item) => filters.compensation === 'all' || item.compensation === filters.compensation)
    .filter((item) => filters.experience === 'all' || item.experience === filters.experience)
    .filter((item) => matchesDuration(item.durationMonths, filters.duration))
    .filter((item) => filters.category === 'all' || item.category === filters.category)
    .filter((item) => !filters.recentOnly || now - postedTime(item) <= RECENT_WINDOW_DAYS * DAY_MS);

  return matched.sort((a, b) => {
    if (filters.sort === 'relevance') {
      const difference = relevanceScore(b, query) - relevanceScore(a, query);
      if (difference !== 0) return difference;
    }
    return postedTime(b) - postedTime(a);
  });
}
