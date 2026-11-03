import { useMemo, useState } from 'react';
import { Search, BookmarkCheck } from 'lucide-react';
import { OPPORTUNITIES, OPPORTUNITY_CATEGORIES } from '@/data/opportunities';
import {
  DEFAULT_OPPORTUNITY_FILTERS,
  filterOpportunities,
  type OpportunityFilters,
} from '@/lib/opportunityFilters';
import { cn } from '@/lib/cn';
import type { Opportunity } from '@/types/content';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import OpportunityModal from '@/components/opportunities/OpportunityModal';
import PageHeader from '@/components/ui/PageHeader';
import { FIELD_CLASS, LABEL_CLASS, chipClass } from '@/components/ui/controls';

type Tab = 'jobs';

const TYPE_OPTIONS: { value: OpportunityFilters['type']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Internship', label: 'Internships' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
];

const DURATION_OPTIONS: { value: OpportunityFilters['duration']; label: string }[] = [
  { value: 'all', label: 'Any duration' },
  { value: '1-2', label: '1–2 months' },
  { value: '3-6', label: '3–6 months' },
  { value: '6+', label: '6+ months' },
];

export default function OpportunitiesPage() {
  const [tab, setTab] = useState<Tab>('jobs');
  const [filters, setFilters] = useState<OpportunityFilters>(DEFAULT_OPPORTUNITY_FILTERS);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [openItem, setOpenItem] = useState<Opportunity | null>(null);

  const results = useMemo(() => filterOpportunities(OPPORTUNITIES, filters, Date.now()), [filters]);

  const update = <K extends keyof OpportunityFilters>(key: K, value: OpportunityFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const setType = (type: OpportunityFilters['type']) =>
    setFilters((current) => ({
      ...current,
      type,
      duration: type === 'Full-time' || type === 'Part-time' ? 'all' : current.duration,
    }));

  const showDuration = filters.type === 'all' || filters.type === 'Internship';

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
          eyebrow="Opportunities"
          title="Her next opportunity."
          description="The right opportunity could be the beginning of something new. Explore internships and jobs, then apply through the original source."
        />

        <div className="mt-10 flex flex-col gap-4 border-b border-burgundy/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Opportunity views" className="inline-flex gap-1 rounded-full bg-cream-dark/60 p-1">
            <button role="tab" aria-selected={tab === 'jobs'} onClick={() => setTab('jobs')} className={tabClass(tab === 'jobs')}>
              Jobs &amp; internships
            </button>
          </div>
          <p className="flex items-center gap-2 font-label text-xs text-muted">
            <BookmarkCheck className="h-4 w-4 text-burgundy" aria-hidden="true" />
            {saved.size} saved on this device
          </p>
        </div>

        <div className="mt-10">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Opportunity type">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filters.type === option.value}
                  onClick={() => setType(option.value)}
                  className={chipClass(filters.type === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 rounded-[1.25rem] border border-burgundy/15 bg-white p-6 shadow-card lg:grid-cols-12">
              <div className="lg:col-span-4">
                <label htmlFor="opp-search" className={LABEL_CLASS}>Search by role, company or skill</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    id="opp-search"
                    type="search"
                    value={filters.query}
                    onChange={(event) => update('query', event.target.value)}
                    placeholder="E.g. analyst, Pinecrest, SQL"
                    className={cn(FIELD_CLASS, 'pl-10')}
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="opp-mode" className={LABEL_CLASS}>Work mode</label>
                <select id="opp-mode" value={filters.workMode} onChange={(event) => update('workMode', event.target.value as OpportunityFilters['workMode'])} className={FIELD_CLASS}>
                  <option value="all">Any</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="opp-pay" className={LABEL_CLASS}>Compensation</label>
                <select id="opp-pay" value={filters.compensation} onChange={(event) => update('compensation', event.target.value as OpportunityFilters['compensation'])} className={FIELD_CLASS}>
                  <option value="all">Any</option>
                  <option value="Stipend">Paid / stipend</option>
                  <option value="Salary">Salary</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="opp-experience" className={LABEL_CLASS}>Experience</label>
                <select id="opp-experience" value={filters.experience} onChange={(event) => update('experience', event.target.value as OpportunityFilters['experience'])} className={FIELD_CLASS}>
                  <option value="all">Any</option>
                  <option value="Fresher / entry-level">Fresher / entry-level</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="opp-category" className={LABEL_CLASS}>Category</label>
                <select id="opp-category" value={filters.category} onChange={(event) => update('category', event.target.value)} className={FIELD_CLASS}>
                  <option value="all">All categories</option>
                  {OPPORTUNITY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              {showDuration && (
                <div className="lg:col-span-3">
                  <label htmlFor="opp-duration" className={LABEL_CLASS}>Internship duration</label>
                  <select id="opp-duration" value={filters.duration} onChange={(event) => update('duration', event.target.value as OpportunityFilters['duration'])} className={FIELD_CLASS}>
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="lg:col-span-3">
                <label htmlFor="opp-sort" className={LABEL_CLASS}>Sort by</label>
                <select id="opp-sort" value={filters.sort} onChange={(event) => update('sort', event.target.value as OpportunityFilters['sort'])} className={FIELD_CLASS}>
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest posted</option>
                </select>
              </div>
              <div className="flex items-end lg:col-span-4">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={filters.recentOnly}
                    onChange={(event) => update('recentOnly', event.target.checked)}
                    className="h-4 w-4 accent-burgundy"
                  />
                  Posted in the last 14 days
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-label text-sm text-ink/75" aria-live="polite">
                {results.length} {results.length === 1 ? 'opportunity' : 'opportunities'} shown
              </p>
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_OPPORTUNITY_FILTERS)}
                className="font-label text-sm font-semibold text-burgundy hover:text-burgundy-deep"
              >
                Clear filters
              </button>
            </div>

            {results.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {results.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    saved={saved.has(opportunity.id)}
                    onToggleSave={toggleSave}
                    onOpen={setOpenItem}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-burgundy/35 bg-white px-6 py-12 text-center">
                <p className="font-display text-2xl font-bold text-ink">No opportunities match these filters</p>
                <p className="mt-3 text-sm text-ink/75">Try removing a filter or searching for a broader term.</p>
              </div>
            )}

            <p className="mt-10 font-label text-xs uppercase tracking-wider text-muted">
              Demonstration listings for this prototype. Live listings will show their original source and verification date.
            </p>
        </div>
      </div>

      <OpportunityModal
        opportunity={openItem}
        saved={openItem ? saved.has(openItem.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setOpenItem(null)}
      />
    </div>
  );
}
