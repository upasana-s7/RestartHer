import { useState, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import { buttonClass } from '@/components/ui/buttonClass';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/ui/controls';
import { useAuth } from '@/hooks/useAuth';
import { EDUCATION_OPTIONS, FIXED_GENDER, validateProfileDraft, type ProfileDraft } from '@/lib/profile';

interface ProfileWindowProps {
  onCancel: () => void;
}

export default function ProfileWindow({ onCancel }: ProfileWindowProps) {
  const { user, profileError, saveProfile } = useAuth();
  const [draft, setDraft] = useState<ProfileDraft>(() => ({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: user?.email ?? '',
    phone: user?.phone ? `+${user.phone}` : '',
    address: '',
    highest_education: '',
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validateProfileDraft(draft);
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError(null);
    const saveError = await saveProfile(draft);
    if (saveError) {
      setError(saveError);
      setSubmitting(false);
    }
  };

  const shownError = error ?? profileError;
  const emailLocked = Boolean(user?.email);
  const phoneLocked = Boolean(user?.phone);

  return (
    <Modal open onClose={onCancel} dismissible={false} title="Complete your profile" eyebrow="Your details">
      <form onSubmit={handleSave} noValidate className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-first-name" className={LABEL_CLASS}>First name</label>
            <input id="profile-first-name" type="text" autoComplete="given-name" value={draft.first_name} onChange={(event) => update('first_name', event.target.value)} className={FIELD_CLASS} />
          </div>
          <div>
            <label htmlFor="profile-last-name" className={LABEL_CLASS}>Last name</label>
            <input id="profile-last-name" type="text" autoComplete="family-name" value={draft.last_name} onChange={(event) => update('last_name', event.target.value)} className={FIELD_CLASS} />
          </div>
          <div>
            <label htmlFor="profile-dob" className={LABEL_CLASS}>Date of birth</label>
            <input id="profile-dob" type="date" autoComplete="bday" value={draft.date_of_birth} onChange={(event) => update('date_of_birth', event.target.value)} className={FIELD_CLASS} />
          </div>
          <div>
            <label htmlFor="profile-email" className={LABEL_CLASS}>Email</label>
            <input id="profile-email" type="email" autoComplete="email" value={draft.email} readOnly={emailLocked} onChange={(event) => update('email', event.target.value)} className={emailLocked ? `${FIELD_CLASS} bg-cream text-ink/70` : FIELD_CLASS} />
          </div>
          <div>
            <label htmlFor="profile-phone" className={LABEL_CLASS}>Phone number</label>
            <input id="profile-phone" type="tel" autoComplete="tel" value={draft.phone} readOnly={phoneLocked} onChange={(event) => update('phone', event.target.value)} className={phoneLocked ? `${FIELD_CLASS} bg-cream text-ink/70` : FIELD_CLASS} />
          </div>
          <div>
            <label htmlFor="profile-gender" className={LABEL_CLASS}>Gender</label>
            <input id="profile-gender" type="text" value={FIXED_GENDER} disabled className={`${FIELD_CLASS} cursor-not-allowed bg-cream text-ink/70`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="profile-address" className={LABEL_CLASS}>Address</label>
            <textarea id="profile-address" rows={3} autoComplete="street-address" value={draft.address} onChange={(event) => update('address', event.target.value)} className={`${FIELD_CLASS} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="profile-education" className={LABEL_CLASS}>Highest education</label>
            <select id="profile-education" value={draft.highest_education} onChange={(event) => update('highest_education', event.target.value as ProfileDraft['highest_education'])} className={FIELD_CLASS}>
              <option value="">Select an option</option>
              {EDUCATION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {shownError && (
          <p role="alert" className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error">{shownError}</p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-burgundy/15 pt-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={submitting} className={buttonClass('outline')}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className={buttonClass('primary')}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
