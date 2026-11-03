# RestartHER integration notes

## Gemini AI companion (backend)

The CAP service exposes the chatWithCompanion action at:

POST /odata/v4/restart-her/chatWithCompanion

Example request body:

```json
{ "message": "Help me plan my return to work." }
```

The OData action returns an object containing reply. It validates the message (required, maximum 4,000 characters), calls Gemini from the CAP server, and returns a generic service error if the provider is unavailable. It does not store chat history or load a candidate profile yet.

Set GEMINI_API_KEY in the backend runtime environment or deployment secret manager. Do not commit a real key and do not place it in a VITE_* variable. GEMINI_MODEL is optional and defaults to gemini-3.8-flash.

For local development, copy .env.example to .env and add your own key to the local file. The .env file is ignored by Git. Do not commit it.

## Frontend integration status

The BoltFrontend repository is currently flattened at its root while its React imports expect the original src/components, src/pages, src/context, src/hooks, src/lib, src/data, and src/types structure. Its auth provider also uses Supabase candidate_profiles, while this CAP backend currently models ReturningProfessionals and exposes OData V4 actions. The React app must be restored into its expected folder structure and the authentication/profile mapping must be designed before replacing the generated SAPUI5 app or claiming end-to-end integration.