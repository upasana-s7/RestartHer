import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';

const STEPS = ['Experience', 'Confidence', 'Skills', 'Opportunity'];

export default function Statement() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section ref={ref} className="bg-cream-light px-5 py-24 sm:px-8 lg:px-12 lg:py-32" aria-labelledby="statement-title">
      <div className="mx-auto max-w-5xl text-center">
        <p className={cn('reveal editorial-label', inView && 'is-visible')}>A word for every returner</p>
        <h2
          id="statement-title"
          className={cn(
            'reveal mt-6 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-burgundy',
            inView && 'is-visible',
          )}
        >
          You are not starting from zero.
        </h2>
        <div className={cn('reveal mx-auto mt-10 max-w-2xl space-y-3 text-lg text-ink/80', inView && 'is-visible')}>
          <p className="font-display text-2xl italic text-ink">“You are starting with experience.”</p>
          <p>Your skills. Your knowledge. Your resilience. Your story.</p>
          <p>Your career break is a chapter, not your entire story.</p>
        </div>

        <ol className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={cn(
                'flex items-center gap-4 transition-all duration-700 ease-out',
                inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
              )}
              style={{ transitionDelay: `${300 + index * 220}ms` }}
            >
              <span className="rounded-full border border-burgundy px-6 py-3 font-label text-sm font-semibold uppercase tracking-[0.18em] text-burgundy">
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <span className="hidden font-label text-lg text-burgundy sm:inline" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
