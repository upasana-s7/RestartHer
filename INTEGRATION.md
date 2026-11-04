# RestartHER pitch prototype

## Public deployment

Import `upasana-s7/RestartHer` into Vercel and select branch `integration/bolt-react-gemini`. Keep the project root at the repository root. The root `vercel.json` contains the frontend build/output settings and SPA rewrite. Deploy to receive a public HTTPS URL.

## Demo accounts and profiles

This branch uses browser-local demo sign-up/sign-in and profile storage. No Supabase project or database setup is needed. Demo accounts work only in the browser where they were created; they do not sync across browsers/devices, and clearing browser storage removes them. This is for a hackathon prototype only, not production authentication. Do not enter real sensitive personal information.

## AI companion

The companion calls `/odata/v4/restart-her/chatWithCompanion`. A static Vercel frontend does not host the CAP backend. To enable Gemini replies on the public URL, deploy the CAP backend separately and set `VITE_API_BASE_URL` to its HTTPS base URL in Vercel environment variables, then redeploy. Set `GEMINI_API_KEY` only in the backend host's server-side environment variables. Never put the Gemini key in a `VITE_*` variable or commit it.

Until the CAP endpoint is deployed and configured, the frontend and navigation work but Gemini chat will report that the service is unavailable. Course/opportunity/learning/mentorship content still includes demonstration data; don't describe sample listings as verified live vacancies.
