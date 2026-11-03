import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { CandidateProfile, ProfileDraft, ProfileEditDraft } from '@/lib/profile';

export interface WelcomeState {
  name: string;
  returning: boolean;
}

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: CandidateProfile | null;
  profileError: string | null;
  welcome: WelcomeState | null;
  dismissWelcome: () => void;
  signUp: (identifier: string, password: string) => Promise<AuthResult>;
  signIn: (identifier: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<string | null>;
  saveProfile: (draft: ProfileDraft) => Promise<string | null>;
  updateProfile: (draft: ProfileEditDraft) => Promise<string | null>;
}

export interface AuthResult {
  error: string | null;
  needsSignIn: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
