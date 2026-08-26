Apply the v2-only source-date freshness gate. <=2 days current, 3-5 days degraded but shadow-eligible, >5 days fail-closed, missing/unparseable source date fail-closed. Preserve baseline behavior and all other scoring/runtime logic.

Retrigger after workflow simplification: 2026-08-26T03:38+02:00.
