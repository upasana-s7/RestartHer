import { useState, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';

interface RoleOption {
  id: 'woman' | 'mentor' | 'business';
  label: string;
  description: string;
  image: string;
  alt: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'woman',
    label: 'Woman',
    description: 'Returning after a career break.',
    image: 'https://images.pexels.com/photos/25651531/pexels-photo-25651531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Confident professional woman working at her desk',
  },
  {
    id: 'mentor',
    label: 'Mentor',
    description: 'Guide and support women on their career journeys.',
    image: 'https://images.pexels.com/photos/7640442/pexels-photo-7640442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Two professional women discussing work at an office desk',
  },
  {
    id: 'business',
    label: 'Business Organization',
    description: 'Support career opportunities and professional growth.',
    image: 'https://images.pexels.com/photos/32216281/pexels-photo-32216281.png?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Modern minimalist office interior with workstations',
  },
];

interface RoleScreenProps {
  onSelectWoman: () => void;
}

export default function RoleScreen({ onSelectWoman }: RoleScreenProps) {
  const [selectedId, setSelectedId] = useState<RoleOption['id'] | null>(null);

  const handleSelect = (role: RoleOption) => {
    setSelectedId(role.id);
    if (role.id === 'woman') onSelectWoman();
  };

  return (
    <section className="w-full max-w-6xl px-6 py-16 sm:px-10" aria-labelledby="role-title">
      <p className="editorial-label text-center">Choose your path</p>
      <h1 id="role-title" className="mt-4 text-center font-display text-4xl font-bold leading-[1.2] text-ink sm:text-5xl">
        Who is joining RestartHER?
      </h1>

      <ul role="list" className="mt-12 grid gap-6 md:grid-cols-3">
        {ROLES.map((role, index) => {
          const selected = selectedId === role.id;
          return (
            <li key={role.id} className="animate-pop" style={{ animationDelay: `${index * 120}ms` } satisfies CSSProperties}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => handleSelect(role)}
                className={cn(
                  'group relative block aspect-square w-full overflow-hidden rounded-[1.5rem] text-left shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy',
                  selected && 'ring-4 ring-burgundy/40',
                )}
              >
                <img
                  src={role.image}
                  alt={role.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <span className="block font-display text-2xl font-bold sm:text-3xl">{role.label}</span>
                  <span className="mt-2 block text-sm leading-[1.5] text-cream/90">{role.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selectedId && selectedId !== 'woman' && (
        <p role="status" className="mt-8 text-center text-sm text-ink/75">
          This path is not open yet. Choose Woman to create your account.
        </p>
      )}
    </section>
  );
}
