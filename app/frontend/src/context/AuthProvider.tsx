import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type AuthResult, type WelcomeState, type DemoSession, type DemoUser } from '@/context/AuthContext';
import { isCandidateProfile, validateProfileDraft, type CandidateProfile, type ProfileDraft, type ProfileEditDraft } from '@/lib/profile';

const USERS_KEY = 'restarther_demo_users_v1';
const PROFILES_KEY = 'restarther_demo_profiles_v1';
const SESSION_KEY = 'restarther_demo_session_v1';
type StoredUser = { id: string; identifier: string; email?: string; phone?: string; salt: string; passwordHash: string };
type StoredProfiles = Record<string, CandidateProfile>;
function readJson<T>(key: string, fallback: T): T {
 try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}
function bytesToBase64(bytes: Uint8Array): string {
 let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary);
}
function base64ToBytes(value: string): Uint8Array { return Uint8Array.from(atob(value), (c) => c.charCodeAt(0)); }
async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
 const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
 const saltBuffer = new ArrayBuffer(salt.byteLength);\n new Uint8Array(saltBuffer).set(salt);\n const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBuffer, iterations: 120000, hash: 'SHA-256' }, material, 256);
 return bytesToBase64(new Uint8Array(bits));
}
function toDemoUser(user: StoredUser): DemoUser { return user.email ? { id: user.id, email: user.email } : { id: user.id, phone: user.phone }; }
function makeSession(user: StoredUser): DemoSession { return { user: toDemoUser(user) }; }

export default function AuthProvider({ children }: { children: ReactNode }) {
 const [session, setSession] = useState<DemoSession | null>(null);
 const [loading, setLoading] = useState(true);
 const [profile, setProfile] = useState<CandidateProfile | null>(null);
 const [profileError, setProfileError] = useState<string | null>(null);
 const [welcome, setWelcome] = useState<WelcomeState | null>(null);

 useEffect(() => {
  const id = localStorage.getItem(SESSION_KEY);
  if (id) {
   const user = readJson<StoredUser[]>(USERS_KEY, []).find((item) => item.id === id);
   if (user) {
    setSession(makeSession(user));
    const saved = readJson<StoredProfiles>(PROFILES_KEY, {})[id];
    if (saved && isCandidateProfile(saved)) setProfile(saved);
   } else localStorage.removeItem(SESSION_KEY);
  }
  setLoading(false);
 }, []);

 const signUp = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
  const clean = identifier.trim().toLowerCase();
  if (!clean || password.length < 8) return { error: 'Enter a valid email/phone and a password with at least 8 characters.', needsSignIn: false };
  const users = readJson<StoredUser[]>(USERS_KEY, []);
  if (users.some((item) => item.identifier === clean)) return { error: 'An account with these details already exists. Try signing in instead.', needsSignIn: false };
  try {
   const salt = crypto.getRandomValues(new Uint8Array(16));
   const user: StoredUser = { id: crypto.randomUUID(), identifier: clean, ...(clean.includes('@') ? { email: clean } : { phone: clean }), salt: bytesToBase64(salt), passwordHash: await hashPassword(password, salt) };
   localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
   localStorage.setItem(SESSION_KEY, user.id);
   setSession(makeSession(user)); setProfile(null); setProfileError(null);
   return { error: null, needsSignIn: false };
  } catch { return { error: 'Demo sign-up needs a modern browser with HTTPS enabled.', needsSignIn: false }; }
 }, []);

 const signIn = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
  const clean = identifier.trim().toLowerCase();
  const user = readJson<StoredUser[]>(USERS_KEY, []).find((item) => item.identifier === clean);
  if (!user) return { error: 'No matching demo account exists in this browser. Please create an account first.', needsSignIn: false };
  try {
   if (await hashPassword(password, base64ToBytes(user.salt)) !== user.passwordHash) return { error: 'Those details do not match our records.', needsSignIn: false };
   localStorage.setItem(SESSION_KEY, user.id);
   const saved = readJson<StoredProfiles>(PROFILES_KEY, {})[user.id] ?? null;
   setProfile(saved && isCandidateProfile(saved) ? saved : null); setProfileError(null);
   setWelcome(saved ? { name: saved.first_name, returning: true } : null);
   setSession(makeSession(user));
   return { error: null, needsSignIn: false };
  } catch { return { error: 'Sign-in is unavailable in this browser. Please try again.', needsSignIn: false }; }
 }, []);

 const signOut = useCallback(async (): Promise<string | null> => {
  localStorage.removeItem(SESSION_KEY); setSession(null); setProfile(null); setProfileError(null); setWelcome(null); return null;
 }, []);

 const saveProfile = useCallback(async (draft: ProfileDraft): Promise<string | null> => {
  if (!session) return 'Please sign in again.';
  const problem = validateProfileDraft(draft); if (problem) return problem;
  const saved: CandidateProfile = {
   first_name: draft.first_name.trim(), last_name: draft.last_name.trim(), date_of_birth: draft.date_of_birth,
   email: draft.email.trim(), phone: draft.phone.trim(), address: draft.address.trim(), gender: 'Female',
   highest_education: draft.highest_education as CandidateProfile['highest_education'],
   career_interests: '', skills: '', career_goals: '',
  };
  const profiles = readJson<StoredProfiles>(PROFILES_KEY, {}); profiles[session.user.id] = saved;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); setProfile(saved); setProfileError(null);
  setWelcome({ name: saved.first_name, returning: false }); return null;
 }, [session]);

 const updateProfile = useCallback(async (draft: ProfileEditDraft): Promise<string | null> => {
  if (!session) return 'Please sign in again.';
  const profiles = readJson<StoredProfiles>(PROFILES_KEY, {}); const current = profiles[session.user.id];
  if (!current) return 'We could not find your profile. Please complete it again.';
  const updated: CandidateProfile = { ...current, first_name: draft.first_name.trim(), last_name: draft.last_name.trim(),
   date_of_birth: draft.date_of_birth, email: draft.email.trim(), phone: draft.phone.trim(), address: draft.address.trim(),
   highest_education: draft.highest_education as CandidateProfile['highest_education'],
   career_interests: draft.career_interests.trim(), skills: draft.skills.trim(), career_goals: draft.career_goals.trim() };
  profiles[session.user.id] = updated; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); setProfile(updated); return null;
 }, [session]);

 const dismissWelcome = useCallback(() => setWelcome(null), []);
 const value = useMemo<AuthContextValue>(() => ({ session, user: session?.user ?? null, loading, profile, profileError, welcome, dismissWelcome, signUp, signIn, signOut, saveProfile, updateProfile }),
  [session, loading, profile, profileError, welcome, dismissWelcome, signUp, signIn, signOut, saveProfile, updateProfile]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
