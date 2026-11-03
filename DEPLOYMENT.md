# RestartHER pitch prototype

## Public deployment

Import `upasana-s7/RestartHer` into Vercel and select branch `integration/bolt-react-gemini`. Keep the project root at the repository root. The root `vercel.json` contains the frontend build/output settings and SPA rewrite. Deploy to receive a public HTTPS URL.

## Demo accounts and profiles

This branch uses browser-local demo sign-up/sign-in and profile storage. No Supabase project or database setup is needed. Demo accounts work only in the browser where they were created; they do not sync across browsers/devices, and clearing browser storage removes them. This is for a hackathon prototype only, not production authentication. Do not enter real sensitive personal information.

## Gemini AI companion

The Vercel serverless endpoint in `api/chat.js` securely calls Gemini from the server. In Vercel, open **Project Settings → Environment Variables** and add:

- `GEMINI_API_KEY`: your Gemini API key (server-side secret; do not add a `VITE_` prefix)
- `GEMINI_MODEL`: optional; defaults to `gemini-2.5-flash`

Apply the variables to the Production environment and redeploy. The frontend calls `/api/chat` on the same public domain. You do not need to deploy the CAP backend for this Gemini chat route.

If you set `VITE_API_BASE_URL`, the frontend instead uses the existing CAP action `/odata/v4/restart-her/chatWithCompanion`. Leave it blank for the Vercel Gemini function.

## Demo content

Course/opportunity/learning/mentorship content still includes demonstration data; don't describe sample listings as verified live vacancies.
