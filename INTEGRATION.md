# RestartHER integration status

## Migrated React frontend

The Bolt React + TypeScript + Vite frontend is being migrated into `app/frontend`. Its source is organised under `src/components`, `src/pages`, `src/context`, `src/hooks`, `src/lib`, `src/data`, and `src/types`. The original SAPUI5 application under `app/restarther` is preserved.

Run the CAP backend on port 4004 with `npm run watch-restarther`, and run the React frontend in a second terminal with `npm run frontend:dev`. The Vite dev server proxies `/odata` requests to `http://localhost:4004`. For a separately hosted frontend, set `VITE_API_BASE_URL` to the deployed CAP service origin.

## Gemini companion

The React companion calls `POST /odata/v4/restart-her/chatWithCompanion` with `{ "message": "..." }`. The CAP action validates messages (required, maximum 4,000 characters), calls Gemini server-side, and returns `{ "reply": "..." }`. The API key is never sent to the browser.

Set `GEMINI_API_KEY` in the backend runtime environment or deployment secret manager. `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`. Do not commit `.env` files or place Gemini credentials in `VITE_*` variables.

## Remaining integration work

- The Bolt frontend currently uses Supabase Auth and a `candidate_profiles` table. RestartHER's CAP backend uses `ReturningProfessionals` and production XSUAA authentication. These identity and profile models are not yet unified; the React profile flow must not be treated as connected to CAP until that is implemented and tested.
- Course and opportunity catalogues, journey/roadmap progress, mentorship, and profile editing still use the Bolt frontend's local/demo data or Supabase. Their CAP persistence and API contracts remain to be integrated.
- The React app is built as a separate Vite workspace. Production hosting/reverse-proxy configuration is still required so the frontend can reach CAP securely.
- No end-to-end build or live Gemini request has been run from this environment. Configure the backend secret and run the build/check workflow before deployment.