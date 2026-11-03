-- Run this once in Supabase SQL Editor for the RestartHER React prototype.
-- Authentication is handled by Supabase Auth; each profile belongs to exactly one auth user.

create table if not exists public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  email text not null,
  phone text not null,
  address text not null,
  gender text not null default 'Female',
  highest_education text not null,
  career_interests text not null default '',
  skills text not null default '',
  career_goals text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.candidate_profiles enable row level security;

 drop policy if exists "Users can read their own candidate profile" on public.candidate_profiles;
create policy "Users can read their own candidate profile"
  on public.candidate_profiles for select to authenticated
  using (auth.uid() = user_id);

 drop policy if exists "Users can create their own candidate profile" on public.candidate_profiles;
create policy "Users can create their own candidate profile"
  on public.candidate_profiles for insert to authenticated
  with check (auth.uid() = user_id);

 drop policy if exists "Users can update their own candidate profile" on public.candidate_profiles;
create policy "Users can update their own candidate profile"
  on public.candidate_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
