import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  points: string[];
  children?: ReactNode;
}

export default function ComingSoon({ title, description, points, children }: ComingSoonProps) {
  return (
    <section className="rounded-[1.5rem] border border-burgundy/15 bg-white p-8 shadow-card sm:p-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="editorial-label mt-6">Coming soon</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-ink">{title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-[1.7] text-ink/75">{description}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 rounded-lg bg-cream-light px-4 py-3 text-sm leading-[1.5] text-ink/85">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
      {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
