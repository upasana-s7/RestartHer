import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Info, LifeBuoy, LogOut, Settings, UserRound } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/ui/controls';
import { EDUCATION_OPTIONS, type ProfileEditDraft } from '@/lib/profile';
import { buttonClass } from '@/components/ui/buttonClass';

const MENU_ITEMS = [
  { label: 'My Profile', icon: UserRound, view: 'profile' },
  { label: 'Account Settings', icon: Settings, view: 'settings' },
  { label: 'Help & Support', icon: LifeBuoy, view: 'support' },
] as const;
type MenuView = (typeof MENU_ITEMS)[number]['view'] | null;

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<MenuView>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('restarther-compact-mode') === 'true');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, profile, updateProfile, signOut } = useAuth();
  const name = profile?.first_name ?? user?.email?.split('@')[0] ?? 'there';
  const initial = name.charAt(0).toUpperCase() || 'R';
  const [draft, setDraft] = useState<ProfileEditDraft | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const openView = (nextView: MenuView) => {
    setOpen(false);
    setProfileMessage(null);
    if (nextView === 'profile' && profile) {
      setDraft({ ...profile });
    }
    setView(nextView);
  };

  const handleProfileSave = async () => {
    if (!draft) return;
    setSaving(true);
    setProfileMessage(null);
    const error = await updateProfile(draft);
    setSaving(false);
    setProfileMessage(error ?? 'Your profile changes are saved.');
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    const error = await signOut();
    if (error) {
      setSignOutError(error);
      setSigningOut(false);
    }
  };

  const toggleCompactMode = (enabled: boolean) => {
    setCompactMode(enabled);
    localStorage.setItem('restarther-compact-mode', String(enabled));
  };

  return (
    <div ref={containerRef} className="relative">
      <button ref={buttonRef} type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open} aria-label="Open account menu" className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform duration-200 hover:scale-105">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy font-display text-base font-bold text-cream ring-2 ring-cream ring-offset-2 ring-offset-cream-light">{initial}</span>
        <ChevronDown className={cn('h-4 w-4 text-ink transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className="animate-sheet-in absolute right-0 top-full z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-xl border border-burgundy/15 bg-cream-light shadow-panel">
          <div className="flex items-center gap-3 border-b border-burgundy/15 px-5 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy font-display text-lg font-bold text-cream">{initial}</span>
            <div className="min-w-0"><p className="truncate font-label text-sm font-semibold text-ink">{name}</p><p className="truncate text-xs text-muted">{user?.email ?? profile?.email}</p></div>
          </div>
          <ul className="py-2">
            {MENU_ITEMS.map(({ label, icon: Icon, view: nextView }) => (
              <li key={label}><button type="button" role="menuitem" onClick={() => openView(nextView)} className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-ink transition-colors hover:bg-burgundy-soft hover:text-burgundy"><Icon className="h-4 w-4" aria-hidden="true" />{label}</button></li>
            ))}
            <li><button type="button" role="menuitem" onClick={() => { setOpen(false); setAboutOpen(true); }} className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-ink transition-colors hover:bg-burgundy-soft hover:text-burgundy"><Info className="h-4 w-4" aria-hidden="true" />About RestartHER</button></li>
            <li><button type="button" role="menuitem" onClick={handleSignOut} disabled={signingOut} className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-ink transition-colors hover:bg-burgundy-soft hover:text-burgundy disabled:opacity-60"><LogOut className="h-4 w-4" aria-hidden="true" />{signingOut ? 'Signing out...' : 'Sign Out'}</button></li>
          </ul>
          {signOutError && <p role="alert" className="border-t border-burgundy/15 px-5 py-3 text-xs text-error">{signOutError}</p>}
        </div>
      )}

      <Modal open={view === 'profile'} onClose={() => setView(null)} title="My Profile" eyebrow="Your information">
        {draft && <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {([['first_name', 'First name'], ['last_name', 'Last name'], ['date_of_birth', 'Date of birth'], ['email', 'Email'], ['phone', 'Phone']] as const).map(([key, label]) => (
              <label key={key} className={key === 'email' || key === 'phone' ? 'sm:col-span-2' : ''}><span className={LABEL_CLASS}>{label}</span><input type={key === 'date_of_birth' ? 'date' : key === 'email' ? 'email' : 'text'} value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} className={FIELD_CLASS} /></label>
            ))}
          </div>
          <label><span className={LABEL_CLASS}>Address</span><textarea value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} className={cn(FIELD_CLASS, 'min-h-20')} /></label>
          <label><span className={LABEL_CLASS}>Highest education</span><select value={draft.highest_education} onChange={(event) => setDraft({ ...draft, highest_education: event.target.value as ProfileEditDraft['highest_education'] })} className={FIELD_CLASS}>{EDUCATION_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label><span className={LABEL_CLASS}>Career interests</span><input value={draft.career_interests} onChange={(event) => setDraft({ ...draft, career_interests: event.target.value })} placeholder="e.g. Data, marketing, design" className={FIELD_CLASS} /></label>
          <label><span className={LABEL_CLASS}>Skills</span><textarea value={draft.skills} onChange={(event) => setDraft({ ...draft, skills: event.target.value })} placeholder="Separate skills with commas" className={cn(FIELD_CLASS, 'min-h-20')} /></label>
          <label><span className={LABEL_CLASS}>Career goals</span><textarea value={draft.career_goals} onChange={(event) => setDraft({ ...draft, career_goals: event.target.value })} className={cn(FIELD_CLASS, 'min-h-20')} /></label>
          {profileMessage && <p role="status" className="text-sm text-burgundy">{profileMessage}</p>}
          <div className="flex justify-end"><button type="button" onClick={handleProfileSave} disabled={saving} className={buttonClass('primary')}>{saving ? 'Saving...' : 'Save changes'}</button></div>
        </div>}
      </Modal>

      <Modal open={view === 'settings'} onClose={() => setView(null)} title="Account Settings" eyebrow="Preferences">
        <div className="space-y-6"><div><h3 className="font-display text-xl font-bold text-ink">Display</h3><label className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-burgundy/15 bg-white p-4 text-sm text-ink"><span><span className="block font-semibold">Compact reading layout</span><span className="mt-1 block text-xs text-muted">Keep this preference on this device.</span></span><input type="checkbox" checked={compactMode} onChange={(event) => toggleCompactMode(event.target.checked)} className="h-4 w-4 accent-burgundy" /></label></div><p className="text-xs leading-[1.6] text-muted">Password and sign-in details are managed securely by the account service and are not changed in this panel.</p></div>
      </Modal>

      <Modal open={view === 'support'} onClose={() => setView(null)} title="Help & Support" eyebrow="A little guidance">
        <div className="space-y-6 text-sm leading-[1.6] text-ink/80"><div><h3 className="font-display text-xl font-bold text-ink">Frequently asked questions</h3><div className="mt-4 space-y-4"><p><strong>How do I update my details?</strong><br />Open My Profile from this menu, edit the fields and choose Save changes.</p><p><strong>Where do I begin?</strong><br />Start with My Journey when you are ready to create a personalized career plan.</p><p><strong>Are listings guaranteed to be live?</strong><br />Check the original provider before applying; this prototype identifies where live verification is still needed.</p></div></div><p className="rounded-xl bg-burgundy-soft px-4 py-3 text-burgundy">There is no support submission endpoint connected in this project yet, so no message form is presented as if it were sending.</p></div>
      </Modal>

      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="About RestartHER" eyebrow="The HER Edition"><div className="space-y-4 text-base leading-[1.6] text-ink/85"><p>RestartHER supports women returning to work after a career break. It brings together learning, opportunities and guidance so that every comeback can move at a pace that fits real life.</p><p>The HER Edition is our editorial space for stories about women rebuilding their careers. Your personal journey, learning and opportunities live alongside it, so you can always pick up where you left off.</p></div></Modal>
    </div>
  );
}
