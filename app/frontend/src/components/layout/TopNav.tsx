import { Feather, Menu } from 'lucide-react';
import type { Section } from '@/hooks/useSectionRoute';
import { cn } from '@/lib/cn';
import AvatarMenu from './AvatarMenu';
import { NAV_ITEMS } from './navItems';

interface TopNavProps {
  section: Section;
  onNavigate: (section: Section) => void;
  onOpenDrawer: () => void;
}

export default function TopNav({ section, onNavigate, onOpenDrawer }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-burgundy/15 bg-cream/95 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open menu"
          aria-controls="app-sidebar"
          className="rounded-md p-2 text-ink transition-colors hover:bg-burgundy-soft hover:text-burgundy lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <Feather className="h-5 w-5 text-burgundy" aria-hidden="true" />
          <span className="font-display text-lg font-bold tracking-tight">RESTARTHER</span>
        </div>

        <div className="ml-auto">
          <AvatarMenu />
        </div>
      </div>

      {/* Keep section links visible on phones and tablets; don't make users rely on the drawer. */}
      <nav aria-label="Section navigation" className="border-t border-burgundy/10 px-3 sm:px-6 lg:px-8">
        <ul className="flex min-h-12 items-stretch gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active = section === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex h-12 items-center whitespace-nowrap px-3 font-label text-xs font-semibold tracking-wide transition-colors sm:px-4 sm:text-sm',
                    active ? 'text-burgundy' : 'text-ink/70 hover:bg-burgundy-soft hover:text-ink',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-burgundy transition-transform duration-200',
                      active ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
