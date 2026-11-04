import { ArrowRight, BookOpenText, Briefcase, GraduationCap, Users, type LucideIcon } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import type { Section } from '@/hooks/useSectionRoute';
import { cn } from '@/lib/cn';

interface JourneyCard {
  title: string;
  description: string;
  cta: string;
  target: Section;
  image: string;
  icon: LucideIcon;
  comingSoon: boolean;
}

const JOURNEY_CARDS: JourneyCard[] = [
  {
    title: 'Rediscover my skills',
    description: 'Reconnect with the knowledge and experience you already have.',
    cta: 'Explore my skills',
    target: 'journey',
    image: 'https://images.pexels.com/photos/19905190/pexels-photo-19905190.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: BookOpenText,
    comingSoon: false,
  },
  {
    title: 'Learn something new',
    description: 'Explore new skills and build confidence at your own pace.',
    cta: 'Explore my learning',
    target: 'learning',
    image: 'https://images.pexels.com/photos/3768173/pexels-photo-3768173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: GraduationCap,
    comingSoon: false,
  },
  {
    title: 'Explore opportunities',
    description: 'Discover career paths and opportunities that match your goals.',
    cta: 'Find opportunities',
    target: 'opportunities',
    image: 'https://images.pexels.com/photos/7223033/pexels-photo-7223033.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Briefcase,
    comingSoon: false,
  },
  {
    title: 'Find a mentor',
    description: 'Explore guidance, support, and professional connections.',
    cta: 'Find guidance',
    target: 'mentorship',
    image: 'https://images.pexels.com/photos/8530439/pexels-photo-8530439.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Users,
    comingSoon: false,
  },
];

interface JourneyCardButtonProps {
  card: JourneyCard;
  index: number;
  onNavigate: (section: Section) => void;
}

function JourneyCardButton({ card, index, onNavigate }: JourneyCardButtonProps) {
  const { ref, inView } = useInView<HTMLButtonElement>(0.2);
  const Icon = card.icon;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onNavigate(card.target)}
      className={cn(
        'reveal group flex flex-col overflow-hidden rounded-[1.25rem] border border-burgundy/15 bg-white text-left shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-panel',
        inView && 'is-visible',
      )}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={card.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
        />
        {card.comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 font-label text-[0.65rem] font-semibold uppercase tracking-wider text-burgundy">
            Coming soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy-soft text-burgundy">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold leading-snug text-ink">{card.title}</h3>
        <p className="mt-2 text-sm leading-[1.6] text-ink/75">{card.description}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 font-label text-sm font-semibold text-burgundy">
          {card.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

interface JourneyCardsProps {
  onNavigate: (section: Section) => void;
}

export default function JourneyCards({ onNavigate }: JourneyCardsProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="bg-cream-light px-5 py-24 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="journey-title">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className={cn('reveal max-w-3xl', inView && 'is-visible')}>
          <p className="editorial-label">Choose your own career journey</p>
          <h2 id="journey-title" className="mt-4 font-display text-4xl font-bold leading-[1.15] text-ink sm:text-5xl">
            Every comeback is different.
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-ink/75">
            Your next chapter should reflect your goals, your experiences, and the life you have today.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {JOURNEY_CARDS.map((card, index) => (
            <JourneyCardButton key={card.title} card={card} index={index} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
}
