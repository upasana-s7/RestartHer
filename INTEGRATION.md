# RestartHER prototype setup (Supabase-first)

The React prototype uses **Supabase Auth + Supabase Postgres** for sign-up, sign-in, and candidate profiles. SAP XSUAA is not required for this frontend authentication flow. The existing CAP/SAPUI5 backend is retained for the existing SAP features; do not assume Supabase sessions are accepted by CAP.

## 1. Configure Supabase

1. Create or open a Supabase project.
2. In **Authentication → Providers**, enable Email. For a quick in-person demo, you may temporarily turn off email confirmation in the project's Auth settings; turn it back on for a public deployment.
3. Open **SQL Editor** and run the complete script in `supabase/schema.sql`. It creates the profile table and row-level security policies so each signed-in user can access only their own profile.
4. In **Project Settings → API**, copy the Project URL and publishable/anon key. Never use a service-role key in the browser.
5. Create `app/frontend/.env.local` from `app/frontend/.env.example` and set:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
VITE_API_BASE_URL=
```

Do not commit `.env.local`.

## 2. Run the prototype locally

From the repository root, install dependencies with `npm install`. In one terminal run `npm run watch-restarther` (CAP backend, port 4004). In another run `npm run frontend:dev` (Vite frontend). Open the local Vite URL printed in the terminal.

The sign-up flow creates a Supabase Auth user. After the user signs in, the onboarding form saves a profile row keyed to that user's auth UUID. The SQL policies enforce per-user access. The profile upsert also makes the onboarding save safe to retry.

## 3. Gemini companion

The companion calls the CAP action `/odata/v4/restart-her/chatWithCompanion`. Set `GEMINI_API_KEY` in the **backend** environment only. Never put it in a `VITE_*` variable or commit it. Test the companion while the local CAP server is running.

Important: the existing CAP project requires XSUAA in its production profile. A Supabase login does not automatically authenticate to CAP. For this local prototype, use the configured local CAP development server. Before public deployment, put Gemini behind a Supabase Edge Function (or implement and test Supabase JWT verification in CAP) rather than disabling backend authentication.

## 4. What is demo data

Course and opportunity cards, journey content, and mentorship screens still include local demonstration content. They are suitable for demonstrating navigation and UI, but are not yet backed by complete production workflows or live listings. Do not present sample opportunities as verified vacancies.

## 5. Pre-demo checklist

- Supabase URL and publishable/anon key configured in `app/frontend/.env.local`.
- SQL script run successfully in Supabase.
- Email confirmation setting matches the demo plan (temporary off for an immediate demo, if needed).
- Backend Gemini key configured in the backend runtime, not frontend.
- CAP and Vite servers both running.
- Test a fresh account, sign out, sign in again, edit profile, navigate all sections, and send one companion message.
