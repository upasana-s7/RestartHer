import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-label text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-burgundy text-cream hover:-translate-y-0.5 hover:bg-burgundy-deep hover:shadow-card',
  outline: 'border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream',
  ghost: 'text-burgundy hover:bg-burgundy-soft',
};

export function buttonClass(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(BASE, VARIANTS[variant], className);
}
