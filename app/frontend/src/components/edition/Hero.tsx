import { ArrowRight } from 'lucide-react';
import { buttonClass } from '@/components/ui/buttonClass';
import { scrollToId } from '@/lib/scrollToId';
import type { Section } from '@/hooks/useSectionRoute';

const SIDE_HEADLINES = ['A new chapter begins here.', 'Her experience still matters.', 'Every comeback has its own story.'];

export default function Hero({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <section className="grid items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-20">
      <div className="lg:col-span-7">
        <p className="animate-rise editorial-label [animation-delay:300ms]">The Comeback Issue</p>
        <h2 className="animate-rise mt-5 font-display text-[clamp(3rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-ink [animation-delay:420ms]">
          She paused.
          <br />
          <span className="text-burgundy">She returned.</span>
          <br />
          She rose.
        </h2>
        <ul className="animate-rise mt-10 space-y-3 border-l-2 border-burgundy pl-5 [animation-delay:600ms]">
          {SIDE_HEADLINES.map((line) => (
            <li key={line} className="font-display text-lg italic text-ink/80">
              {line}
            </li>
          ))}
        </ul>
        <div className="animate-rise mt-12 flex flex-wrap gap-3 [animation-delay:750ms]">
          <button
            type="button"
            onClick={() => onNavigate('journey')}
            className={buttonClass('primary', 'gap-3 px-7 py-4 group')}
          >
            Start my career journey
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToId('stories')}
            className={buttonClass('outline', 'gap-3 px-7 py-4')}
          >
            Read the edition
          </button>
        </div>
      </div>

      <figure className="lg:col-span-5">
        <div className="animate-image-reveal group relative overflow-hidden rounded-[1.75rem] shadow-card">
          <img
            src="https://images.pexels.com/photos/27086922/pexels-photo-27086922.jpeg?auto=compress&cs=tinysrgb&h=1000&w=800"
            alt="A smiling woman in a formal suit standing confidently indoors"
            className="h-[460px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 sm:h-[560px]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 pt-16">
            <p className="font-label text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cream/90">Cover story</p>
            <p className="mt-1 font-display text-xl font-semibold text-cream">Her experience never left.</p>
          </div>
        </div>
        <figcaption className="mt-3 font-label text-xs text-muted">Illustrative photograph for the prototype edition.</figcaption>
      </figure>
    </section>
  );
}
