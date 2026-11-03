# RestartHER demo deployment

## Public frontend deployment

Import `upasana-s7/RestartHer` into Vercel and select branch `integration/bolt-react-gemini`. Keep the project root at the repository root. The root `vercel.json` defines the Vite build and output directory. Deploy to receive a public HTTPS URL.

This branch uses browser-local demo accounts and profiles; no Supabase project is required. Each browser stores its own demo accounts and profile. Accounts do not sync between browsers/devices, and clearing browser storage removes them. This is a pitch prototype, not production authentication or shared cloud storage. Do not enter real sensitive personal information.

## AI companion

The companion still calls `/odata/v4/restart-her/chatWithCompanion`. A static Vercel frontend deployment does not host the CAP service. To enable Gemini on the public site, deploy the CAP backend separately and set `VITE_API_BASE_URL` to its HTTPS base URL in Vercel's environment variables, then redeploy. Set `GEMINI_API_KEY` only in the backend hosting provider's server-side environment. Never put the Gemini key in a `VITE_*` variable or commit it.

Until that backend is deployed, the rest of the frontend can be presented, but Gemini chat will report that the service is unavailable.
