import { useState, useEffect, useMemo, useRef, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext, type AuthContextValue, type AuthResult, type WelcomeState } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { isCandidateProfile, type CandidateProfile, type ProfileDraft, type ProfileEditDraft } from '@/lib/profile';

const SERVICE_UNAVAILABLE = 'The account service is not available right now. Please try again shortly.';
const GENERIC_ERROR = 'Something went wrong. Please try again.';
const PROFILE_LOAD_ERROR = 'We could not load your profile. Please try again.';
const PROFILE_SAVE_ERROR = 'We could not save your profile. Please check your details and try again.';
const PROFILE_COLUMNS = 'first_name, last_name, date_of_birth, email, phone, address, gender, highest_education, career_interests, skills, career_goals';

type Credentials = { email: string; password: string } | { phone: string; password: string };

function toCredentials(identifier: string, password: string): Credentials {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) return { email: trimmed, password };
  return { phone: `+${trimmed.replace(/[^0-9]/g, '')}`, password };
}

function describeError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('already registered') || lower.includes('already been registered') || lower.includes('already exists')) {
    return 'An account with these details already exists. Try signing in instead.';
  }
  if (lower.includes('invalid login credentials')) return 'Those details do not match our records.';
  if (lower.includes('password')) return 'Please choose a stronger password with at least 8 characters.';
  if (lower.includes('phone')) return 'Please check the phone number and try again.';
  if (lower.includes('fetch') || lower.includes('network')) {
    return 'We could not reach the account service. Check your connection and try again.';
  }
  return GENERIC_ERROR;
}

async function loadProfile(userId: string): Promise<{ profile: CandidateProfile | null; error: string | null }> {
  if (!supabase) return { profile: null, error: SERVICE_UNAVAILABLE };
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select(PROFILE_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return { profile: null, error: PROFILE_LOAD_ERROR };
  if (data !== null && !isCandidateProfile(data)) return { profile: null, error: PROFILE_LOAD_ERROR };
  if (!data) return { profile: null, error: null };
  return {
    profile: {
      ...data,
      career_interests: typeof data.career_interests === 'string' ? data.career_interests : '',
      skills: typeof data.skills === 'string' ? data.skills : '',
      career_goals: typeof data.career_goals === 'string' ? data.career_goals : '',
    },
    error: null,
  };
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [welcome, setWelcome] = useState<WelcomeState | null>(null);
  const flowRef = useRef(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      (async () => {
        if (data.session) {
          const result = await loadProfile(data.session.user.id);
          if (!active) return;
          setProfile(result.profile);
          setProfileError(result.error);
        }
        if (!active) return;
        setSession(data.session);
        setLoading(false);
      })();
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (flowRef.current) return;
      setSession(next);
      if (!next) {
        setProfile(null);
        setProfileError(null);
        setWelcome(null);
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: SERVICE_UNAVAILABLE, needsSignIn: false };
    flowRef.current = true;
    try {
      const { data, error } = await supabase.auth.signUp(toCredentials(identifier, password));
      if (error) return { error: describeError(error.message), needsSignIn: false };
      if (data.session) {
        setProfile(null);
        setProfileError(null);
        setSession(data.session);
        return { error: null, needsSignIn: false };
      }
      return { error: null, needsSignIn: true };
    } finally {
      flowRef.current = false;
    }
  }, []);

  const signIn = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: SERVICE_UNAVAILABLE, needsSignIn: false };
    flowRef.current = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword(toCredentials(identifier, password));
      if (error) return { error: describeError(error.message), needsSignIn: false };
      if (!data.session) return { error: GENERIC_ERROR, needsSignIn: false };
      const result = await loadProfile(data.session.user.id);
      if (result.error) {
        await supabase.auth.signOut();
        return { error: result.error, needsSignIn: false };
      }
      setProfile(result.profile);
      setProfileError(null);
      setWelcome(result.profile ? { name: result.profile.first_name, returning: true } : null);
      setSession(data.session);
      return { error: null, needsSignIn: false };
    } finally {
      flowRef.current = false;
    }
  }, []);

  const signOut = useCallback(async (): Promise<string | null> => {
    if (!supabase) return SERVICE_UNAVAILABLE;
    const { error } = await supabase.auth.signOut();
    if (error) return describeError(error.message);
    setProfile(null);
    setProfileError(null);
    setWelcome(null);
    return null;
  }, []);

  const saveProfile = useCallback(
    async (draft: ProfileDraft): Promise<string | null> => {
      if (!supabase || !session) return SERVICE_UNAVAILABLE;
      if (!draft.highest_education) return 'Please choose your highest education.';
      const saved: CandidateProfile = {
        first_name: draft.first_name.trim(),
        last_name: draft.last_name.trim(),
        date_of_birth: draft.date_of_birth,
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        address: draft.address.trim(),
        gender: 'Female',
        highest_education: draft.highest_education,
        career_interests: '',
        skills: '',
        career_goals: '',
      };
      const { error } = await supabase.from('candidate_profiles').insert(saved);
      if (error) return PROFILE_SAVE_ERROR;
      setProfile(saved);
      setProfileError(null);
      setWelcome({ name: saved.first_name, returning: false });
      return null;
    },
    [session],
  );

  const updateProfile = useCallback(async (draft: ProfileEditDraft): Promise<string | null> => {
    if (!supabase || !session) return SERVICE_UNAVAILABLE;
    const updates = {
      first_name: draft.first_name.trim(),
      last_name: draft.last_name.trim(),
      date_of_birth: draft.date_of_birth,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      highest_education: draft.highest_education,
      career_interests: draft.career_interests.trim(),
      skills: draft.skills.trim(),
      career_goals: draft.career_goals.trim(),
    };
    const { data, error } = await supabase
      .from('candidate_profiles')
      .update(updates)
      .eq('user_id', session.user.id)
      .select(PROFILE_COLUMNS)
      .maybeSingle();
    if (error || !data || !isCandidateProfile(data)) return PROFILE_SAVE_ERROR;
    setProfile({
      ...data,
      career_interests: typeof data.career_interests === 'string' ? data.career_interests : '',
      skills: typeof data.skills === 'string' ? data.skills : '',
      career_goals: typeof data.career_goals === 'string' ? data.career_goals : '',
    });
    return null;
  }, [session]);

  const dismissWelcome = useCallback(() => setWelcome(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      profile,
      profileError,
      welcome,
      dismissWelcome,
      signUp,
      signIn,
      signOut,
      saveProfile,
      updateProfile,
    }),
    [session, loading, profile, profileError, welcome, dismissWelcome, signUp, signIn, signOut, saveProfile, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
