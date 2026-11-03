import { useCallback, useEffect, useState } from 'react';

export const SECTIONS = ['home', 'dashboard', 'journey', 'learning', 'courses', 'opportunities', 'mentorship'] as const;
export type Section = (typeof SECTIONS)[number];

function readSection(): Section {
  const key = window.location.hash.replace(/^#\/?/, '');
  return (SECTIONS as readonly string[]).includes(key) ? (key as Section) : 'home';
}

export function useSectionRoute() {
  const [section, setSectionState] = useState<Section>(readSection);

  useEffect(() => {
    const onChange = () => setSectionState(readSection());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const setSection = useCallback((next: Section) => {
    const target = next === 'home' ? '#/' : `#/${next}`;
    if (window.location.hash !== target) window.location.hash = target;
    else setSectionState(next);
  }, []);

  return { section, setSection };
}
