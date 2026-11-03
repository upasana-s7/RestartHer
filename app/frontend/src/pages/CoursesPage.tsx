import { useEffect, useMemo, useState } from 'react';
import { BookmarkCheck, Search, Sparkles } from 'lucide-react';
import { COURSES, COURSE_CATEGORIES, COURSE_PROVIDERS } from '@/data/courses';
import { DEFAULT_COURSE_FILTERS, filterCourses, type CourseFilters } from '@/lib/courseFilters';
import { cn } from '@/lib/cn';
import type { Course } from '@/types/content';
import CourseCard from '@/components/learning/CourseCard';
import CourseModal from '@/components/learning/CourseModal';
import PageHeader from '@/components/ui/PageHeader';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/ui/controls';
import { buttonClass } from '@/components/ui/buttonClass';
import { useAuth } from '@/hooks/useAuth';
import { loadCareerRoadmap } from '@/lib/journey';

type Tab = 'recommended' | 'explore';

export default function CoursesPage() {
  const [tab, setTab] = useState<Tab>('recommended');
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_COURSE_FILTERS);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [openCourse, setOpenCourse] = useState<Course | null>(null);
  const { user } = useAuth();
  const [roadmapCourseIds, setRoadmapCourseIds] = useState<string[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    const roadmap = loadCareerRoadmap(user.id);
    setRoadmapCourseIds(roadmap?.confirmedAt ? Array.from(new Set(roadmap.weeklyPlan.flatMap((week) => week.courseIds))) : []);
  }, [user?.id]);
  const journeyCourses = COURSES.filter((course) => roadmapCourseIds.includes(course.id));

  const results = useMemo(() => filterCourses(COURSES, filters), [filters]);

  const update = <K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const toggleSave = (id: string) =>
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const tabClass = (active: boolean) =>
    cn(
      'rounded-full px-5 py-2.5 font-label text-sm font-semibold transition-colors duration-200',
      active ? 'bg-burgundy text-cream' : 'text-ink/75 hover:text-burgundy',
    );

  return (
    <div className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Courses & Certifications"
          title="Find your next skill"
          description="Start with courses that fit your journey, or browse the whole catalogue whenever you like."
        />

        <div className="mt-10 flex flex-col gap-4 border-b border-burgundy/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Course views" className="inline-flex gap-1 rounded-full bg-cream-dark/60 p-1">
            <button role="tab" aria-selected={tab === 'recommended'} onClick={() => setTab('recommended')} className={tabClass(tab === 'recommended')}>
              Recommended for your journey
            </button>
            <button role="tab" aria-selected={tab === 'explore'} onClick={() => setTab('explore')} className={tabClass(tab === 'explore')}>
              Explore all courses
            </button>
          </div>
          <p className="flex items-center gap-2 font-label text-xs text-muted">
            <BookmarkCheck className="h-4 w-4 text-burgundy" aria-hidden="true" />
            {saved.size} saved on this device
          </p>
        </div>

        {tab === 'recommended' ? (
          <div className="mt-10">
            {journeyCourses.length ? (
              <>
                <div className="mb-6 rounded-xl border border-burgundy/15 bg-white p-6">
                  <p className="editorial-label flex items-center gap-2"><Sparkles className="h-4 w-4" /> Matched to your confirmed roadmap</p>
                  <p className="mt-2 text-sm text-ink/70">These courses were selected from the learning milestones in your personal plan.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {journeyCourses.map((course) => <CourseCard key={course.id} course={course} saved={saved.has(course.id)} onToggleSave={toggleSave} onOpen={setOpenCourse} />)}
                </div>
              </>
            ) : (
              <div className="rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card sm:p-12">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
                <h2 className="mt-6 font-display text-3xl font-bold text-ink">Recommendations start with your journey</h2>
                <p className="mt-4 max-w-2xl text-base leading-[1.7] text-ink/75">Complete and confirm your career roadmap first. We will show the courses matched to its learning milestones here. You can explore the full catalogue at any time.</p>
                <div className="mt-8"><button type="button" onClick={() => setTab('explore')} className={buttonClass('outline')}>Explore all courses</button></div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid gap-5 rounded-[1.25rem] border border-burgundy/15 bg-white p-6 shadow-card lg:grid-cols-12">
              <div className="lg:col-span-5">
                <label htmlFor="course-search" className={LABEL_CLASS}>
                  Search by title or skill
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    id="course-search"
                    type="search"
                    value={filters.query}
                    onChange={(event) => update('query', event.target.value)}
                    placeholder="E.g. SQL, writing, design"
                    className={cn(FIELD_CLASS, 'pl-10')}
                  />
                </div>
              </div>
              <div className="lg:col-span-3">
                <label htmlFor="course-category" className={LABEL_CLASS}>Category</label>
                <select id="course-category" value={filters.category} onChange={(event) => update('category', event.target.value)} className={FIELD_CLASS}>
                  <option value="all">All categories</option>
                  {COURSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="course-level" className={LABEL_CLASS}>Difficulty</label>
                <select id="course-level" value={filters.level} onChange={(event) => update('level', event.target.value as CourseFilters['level'])} className={FIELD_CLASS}>
                  <option value="all">All levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="course-sort" className={LABEL_CLASS}>Sort by</label>
                <select id="course-sort" value={filters.sort} onChange={(event) => update('sort', event.target.value as CourseFilters['sort'])} className={FIELD_CLASS}>
                  <option value="title">Title A–Z</option>
                  <option value="level">Difficulty</option>
                </select>
              </div>
              <div className="lg:col-span-3">
                <label htmlFor="course-provider" className={LABEL_CLASS}>Provider</label>
                <select id="course-provider" value={filters.provider} onChange={(event) => update('provider', event.target.value)} className={FIELD_CLASS}>
                  <option value="all">All providers</option>
                  {COURSE_PROVIDERS.map((provider) => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>
              <fieldset className="lg:col-span-4">
                <legend className={LABEL_CLASS}>Cost</legend>
                <div className="flex gap-2">
                  {(['all', 'Free', 'Paid'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={filters.cost === option}
                      onClick={() => update('cost', option)}
                      className={cn(
                        'flex-1 rounded-lg border px-3 py-2.5 font-label text-sm font-semibold transition-colors',
                        filters.cost === option ? 'border-burgundy bg-burgundy text-cream' : 'border-burgundy/25 text-ink hover:border-burgundy',
                      )}
                    >
                      {option === 'all' ? 'Any' : option}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="flex items-end lg:col-span-5">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={filters.certificateOnly}
                    onChange={(event) => update('certificateOnly', event.target.checked)}
                    className="h-4 w-4 accent-burgundy"
                  />
                  Only show courses that list a certificate
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-label text-sm text-ink/75" aria-live="polite">
                {results.length} {results.length === 1 ? 'course' : 'courses'} found
              </p>
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_COURSE_FILTERS)}
                className="font-label text-sm font-semibold text-burgundy hover:text-burgundy-deep"
              >
                Clear filters
              </button>
            </div>

            {results.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {results.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    saved={saved.has(course.id)}
                    onToggleSave={toggleSave}
                    onOpen={setOpenCourse}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-burgundy/35 bg-white px-6 py-12 text-center">
                <p className="font-display text-2xl font-bold text-ink">No courses match these filters</p>
                <p className="mt-3 text-sm text-ink/75">Try a broader search or clear the filters to see the full catalogue.</p>
              </div>
            )}

            <p className="mt-10 font-label text-xs uppercase tracking-wider text-muted">
              Sample catalogue for this prototype. Confirm current price and certificate terms on each provider’s site.
            </p>
          </div>
        )}
      </div>

      <CourseModal
        course={openCourse}
        saved={openCourse ? saved.has(openCourse.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setOpenCourse(null)}
      />
    </div>
  );
}
