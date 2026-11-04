import type { Course, CourseLevel } from '@/types/content';

export interface CourseFilters {
  query: string;
  category: string;
  level: 'all' | CourseLevel;
  cost: 'all' | 'Free' | 'Paid';
  provider: string;
  certificateOnly: boolean;
  sort: 'title' | 'level';
}

export const DEFAULT_COURSE_FILTERS: CourseFilters = {
  query: '',
  category: 'all',
  level: 'all',
  cost: 'all',
  provider: 'all',
  certificateOnly: false,
  sort: 'title',
};

const LEVEL_ORDER: Record<CourseLevel, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export function filterCourses(courses: Course[], filters: CourseFilters): Course[] {
  const query = filters.query.trim().toLowerCase();

  return courses
    .filter((course) => {
      if (!query) return true;
      return [course.title, course.provider, course.category, ...course.skills].some((value) =>
        value.toLowerCase().includes(query),
      );
    })
    .filter((course) => filters.category === 'all' || course.category === filters.category)
    .filter((course) => filters.level === 'all' || course.level === filters.level)
    .filter((course) => filters.cost === 'all' || course.cost === filters.cost)
    .filter((course) => filters.provider === 'all' || course.provider === filters.provider)
    .filter((course) => !filters.certificateOnly || course.hasCertificate)
    .sort((a, b) => {
      if (filters.sort === 'level') {
        return LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.title.localeCompare(b.title);
      }
      return a.title.localeCompare(b.title);
    });
}
