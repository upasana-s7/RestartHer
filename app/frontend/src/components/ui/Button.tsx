import type { ButtonHTMLAttributes } from 'react';
import { buttonClass, type ButtonVariant } from '@/components/ui/buttonClass';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button type="button" className={buttonClass(variant, className)} {...props} />;
}
