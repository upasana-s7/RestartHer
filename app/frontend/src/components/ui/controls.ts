import { cn } from '@/lib/cn';

export const FIELD_CLASS =
  'w-full rounded-lg border border-burgundy/25 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20';

export function chipClass(active: boolean): string {
  return cn(
    'rounded-full border px-4 py-2 font-label text-xs font-semibold tracking-wide transition-colors duration-200',
    active ? 'border-burgundy bg-burgundy text-cream' : 'border-burgundy/25 bg-white text-ink hover:border-burgundy hover:text-burgundy',
  );
}

export const LABEL_CLASS = 'mb-1.5 block font-label text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink/70';
