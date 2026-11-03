import { ArrowRight } from 'lucide-react';
import type { Section } from '@/hooks/useSectionRoute';

interface FinalCtaProps {
  onNavigate: (section: Section) => void;
}

export default function FinalCta({ onNavigate }: FinalCtaProps) {
  return (
    <section className="bg-burgundy px-5 py-28 text-center sm:px-8 lg:px-12 lg:py-36" aria-labelledby="final-cta-title">
      <div className="mx-auto max-w-4xl">
        <p className="font-label text-xs font-semibold uppercase tracking-[0.22em] text-cream/75">Your next chapter</p>
        <h2
          id="final-cta-title"
          className="mt-6 font-display text-[clamp(2.75rem,8vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-cream"
        >
          Your story didn’t end here.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-[1.6] text-cream/85">There is more ahead. And this time, you get to write it.</p>
        <button
          type="button"
          onClick={() => onNavigate('journey')}
          className="group mt-12 inline-flex items-center gap-3 rounded-md bg-cream px-8 py-4 font-label text-sm font-semibold tracking-wide text-burgundy transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-cream"
        >
          Explore my career journey
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
