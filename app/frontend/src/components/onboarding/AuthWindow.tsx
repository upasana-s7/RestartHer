import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { buttonClass } from '@/components/ui/buttonClass';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/ui/controls';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

type AuthMode = 'signup' | 'signin';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;
const MIN_PASSWORD_LENGTH = 8;

interface AuthWindowProps {
  onClose: () => void;
}

function isValidIdentifier(value: string): boolean {
  return value.includes('@') ? EMAIL_PATTERN.test(value) : PHONE_PATTERN.test(value);
}

export default function AuthWindow({ onClose }: AuthWindowProps) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const validate = (): string | null => {
    if (!isValidIdentifier(identifier.trim())) return 'Please enter a valid email address or phone number.';
    if (isSignUp && password.length < MIN_PASSWORD_LENGTH) {
      return `Please choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!isSignUp && !password) return 'Please enter your password.';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError(null);
    setNotice(null);

    if (isSignUp) {
      const result = await signUp(identifier, password);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
      } else if (result.needsSignIn) {
        setPassword('');
        setSubmitting(false);
        switchMode('signin');
        setNotice('Your account is ready. Please sign in with your details and password.');
      }
    } else {
      const result = await signIn(identifier, password);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
      }
    }
  };

  return (
    <Modal open onClose={onClose} title={isSignUp ? 'Create your account' : 'Welcome back'} eyebrow="Your account">
      <div role="tablist" aria-label="Account action" className="mb-6 grid grid-cols-2 rounded-full border border-burgundy/25 bg-white p-1">
        {(['signup', 'signin'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => switchMode(value)}
            className={cn(
              'rounded-full px-4 py-2 font-label text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200',
              mode === value ? 'bg-burgundy text-cream' : 'text-ink hover:text-burgundy',
            )}
          >
            {value === 'signup' ? 'Sign up' : 'Sign in'}
          </button>
        ))}
      </div>

      <div className="mb-5 rounded-xl border border-burgundy/15 bg-cream px-4 py-3 transition-colors duration-200">
        <p className="font-label text-xs font-semibold text-burgundy">{isSignUp ? 'A fresh start, saved for you' : 'Your journey is waiting'}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{isSignUp ? 'Create an account to keep your learning plan, progress and next steps together.' : 'Sign in to pick up your RestartHER journey right where you left it.'}</p>
      </div>

      {notice && (
        <p role="status" className="mb-5 rounded-lg bg-burgundy-soft px-4 py-3 text-sm text-burgundy-deep">
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="auth-identifier" className={LABEL_CLASS}>Email or phone number</label>
          <input
            id="auth-identifier"
            type="text"
            inputMode="email"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="auth-password" className={LABEL_CLASS}>Password</label>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={cn(FIELD_CLASS, 'pr-12')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted transition-colors hover:text-burgundy"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          {isSignUp && (
            <div className="mt-2 space-y-1.5" aria-live="polite">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{password.length >= MIN_PASSWORD_LENGTH ? 'Password length looks good' : 'Password length'}</span>
                <span>{password.length}/{MIN_PASSWORD_LENGTH} characters</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-burgundy/10">
                <div className="h-full rounded-full bg-burgundy transition-[width] duration-300" style={{ width: `${Math.min(100, (password.length / MIN_PASSWORD_LENGTH) * 100)}%` }} />
              </div>
              <p className="text-xs text-muted">Use at least {MIN_PASSWORD_LENGTH} characters.</p>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={buttonClass('primary', 'w-full')}>
          {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </Modal>
  );
}
