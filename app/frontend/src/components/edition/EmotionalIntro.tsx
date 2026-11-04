import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import type { Section } from '@/hooks/useSectionRoute';
import { cn } from '@/lib/cn';

interface EmotionalIntroProps {
  onNavigate: (section: Section) => void;
}

export default function EmotionalIntro({ onNavigate }: EmotionalIntroProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="intro-title">
      <div ref={ref} className={cn('reveal mx-auto grid max-w-6xl gap-10 md:grid-cols-12 md:gap-16', inView && 'is-visible')}>
        <div className="md:col-span-5">
          <p className="editorial-label">Your story. Your timeline. Your terms.</p>
          <h2 id="intro-title" className="mt-5 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            This edition is about <span className="text-burgundy">you.</span>
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-[1.7] text-ink/80 md:col-span-7">
          <p>
            Every career has its own story. Some chapters are filled with opportunities, while others bring unexpected pauses,
            responsibilities, and changes.
          </p>
          <p>
            A career break does not erase your experience, your abilities, or your ambitions. RestartHER exists to help you
            rediscover what you already carry and explore what comes next.
          </p>
          <p className="font-display text-xl italic text-ink">Your journey does not have to look like anyone else’s.</p>
          <button
            type="button"
            onClick={() => onNavigate('journey')}
            className="group inline-flex items-center gap-2 border-b border-burgundy pb-1 font-label text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-deep"
          >
            Discover your next chapter
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
