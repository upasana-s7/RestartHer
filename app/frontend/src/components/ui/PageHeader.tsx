import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  className?: string;
}

export default function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <p className="editorial-label">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-[1.6] text-ink/75">{description}</p>
    </div>
  );
}
