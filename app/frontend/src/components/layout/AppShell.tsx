import { useEffect, useState, type ReactNode } from 'react';
import type { Section } from '@/hooks/useSectionRoute';
import AiCompanion from '@/components/companion/AiCompanion';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface AppShellProps {
  section: Section;
  onNavigate: (section: Section) => void;
  children: ReactNode;
}

export default function AppShell({ section, onNavigate, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const navigate = (next: Section) => {
    setDrawerOpen(false);
    onNavigate(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Sidebar
        section={section}
        drawerOpen={drawerOpen}
        aiOpen={aiOpen}
        onNavigate={navigate}
        onToggleAi={() => setAiOpen((value) => !value)}
      />

      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <AiCompanion open={aiOpen} onClose={() => setAiOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <TopNav section={section} onNavigate={navigate} onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
