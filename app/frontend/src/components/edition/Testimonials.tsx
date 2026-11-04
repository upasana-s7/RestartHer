import { Quote } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import type { Testimonial } from '@/types/content';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  onRead: (testimonial: Testimonial) => void;
}

function TestimonialCard({ testimonial, index, onRead }: TestimonialCardProps) {
  const { ref, inView } = useInView<HTMLElement>(0.2);

  return (
    <article
      ref={ref}
      className={cn(
        'reveal group flex flex-col rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card transition-transform duration-500 hover:-translate-y-1 sm:p-10',
        inView && 'is-visible',
      )}
      style={{ transitionDelay: `${(index % 2) * 120}ms` }}
    >
      <p className="editorial-label">Her comeback story</p>
      <Quote className="mt-6 h-9 w-9 fill-burgundy/20 text-burgundy" aria-hidden="true" />
      <p className="mt-4 font-display text-xl italic leading-snug text-ink">{testimonial.quote}</p>

      <div className="mt-auto flex items-center gap-4 pt-8">
        <img
          src={testimonial.portrait}
          alt={testimonial.portraitAlt}
          loading="lazy"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-burgundy/20"
        />
        <div className="min-w-0">
          <p className="font-label text-sm font-semibold text-ink">{testimonial.name}</p>
          <p className="text-sm leading-snug text-muted">{testimonial.journey}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRead(testimonial)}
        className="mt-8 self-start border-b border-burgundy pb-0.5 font-label text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-deep"
      >
        Read more
      </button>
    </article>
  );
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  onRead: (testimonial: Testimonial) => void;
}

export default function Testimonials({ testimonials, onRead }: TestimonialsProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className={cn('reveal max-w-3xl', inView && 'is-visible')}>
          <p className="editorial-label">Voices from the edition</p>
          <h2 id="testimonials-title" className="mt-4 font-display text-4xl font-bold leading-[1.15] text-ink sm:text-5xl">
            Her next chapter. <span className="text-burgundy">Her own words.</span>
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-ink/75">Every journey is different. Every small step forward matters.</p>
          <p className="mt-4 font-label text-xs font-semibold uppercase tracking-wider text-muted">
            Illustrative sample testimonials for this prototype, not real accounts
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} onRead={onRead} />
          ))}
        </div>
      </div>
    </section>
  );
}
