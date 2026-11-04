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
    <header className="sticky top-0 z-30 border-b border-burgundy/15 bg-cream/90 backdrop-blur-md">
      <div className="flex h-20 items-center gap-4 px-5 sm:px-8 lg:px-12">
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

        <nav aria-label="Sections" className="ml-2 flex h-full min-w-0 flex-1">
          <ul className="flex h-full min-w-0 items-center gap-2 overflow-x-auto sm:gap-5 lg:gap-7">
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              return (
                <li key={item.id} className="h-full shrink-0">
                  <a
                    href={item.id === 'home' ? '#/' : `#/${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative h-full whitespace-nowrap font-label text-xs font-semibold tracking-wide transition-colors sm:text-sm',
                      active ? 'text-burgundy' : 'text-ink/70 hover:text-ink',
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-burgundy transition-transform duration-300',
                        active ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto shrink-0">
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}
