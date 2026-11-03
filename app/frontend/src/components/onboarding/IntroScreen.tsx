import { useEffect } from 'react';

const INTRO_DURATION_MS = 5000;
const SPLASH_ARTWORK = '/restart-her-splash.svg';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <section
      aria-label="Welcome to RestartHER"
      className="intro-splash relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-burgundy-deep"
    >
      <img
        src={SPLASH_ARTWORK}
        alt="RestartHER illustrated woman with gently moving hair and flowing dress, holding a book"
        className="intro-splash-art absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="intro-splash-vignette absolute inset-0" aria-hidden="true" />
      <div className="intro-splash-glow absolute inset-y-[-20%] left-[-30%] w-1/2" aria-hidden="true" />
      <div className="intro-splash-glow intro-splash-glow-right absolute inset-y-[-15%] right-[-30%] w-1/2" aria-hidden="true" />
      <div className="intro-splash-fabric absolute inset-x-0 bottom-0 h-1/2" aria-hidden="true" />
      <div className="intro-splash-trail absolute inset-0" aria-hidden="true" />
      <span className="sr-only">Her career paused. Her potential never did.</span>
    </section>
  );
}
