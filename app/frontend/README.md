# React frontend integration

This directory contains the first Bolt React feature migrated into RestartHER: the AI companion. It calls the CAP OData V4 action at `POST /odata/v4/restart-her/chatWithCompanion` with `{ "message": "..." }`. Gemini credentials remain on the CAP server.

This is not yet the complete Bolt application. The remaining screens, authentication and profile workflows still need migration and mapping to the CAP data model before this folder can be built as the complete frontend.
