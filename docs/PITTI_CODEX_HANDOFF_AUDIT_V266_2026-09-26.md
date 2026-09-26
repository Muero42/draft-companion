# PITTI authority audit v266 — bounded physical evidence

Generation: `20260926T1839Z-v266`
Reconciled at: `2026-09-26T18:39:41Z`

v11.8.0-rc4.211 is canonical source + Production via PR #200 reviewed head e3503a9f5a06e37d7d9795051d0a18eb06caa65e, main@84971e64b89757f2b59e6f4cae7891fd8c372843, tree b93018542ab7402b228b986e627e02aeffcabdc1, deployment 2564389d-2890-4d76-a582-ed66c0eb7185 / check 108449050892. Bounded physical PASS: RC4.211_PHYSICAL_PASS_STALE_SPECIAL_TEAMS_GUARD_AND_WEEK_LABEL_CONFIRMED. rc4.210 remains LAST_BROAD_PHYSICAL_EVIDENCE_BASELINE for Weekly Evidence, selected PITTI panel, Start/Sit persistence and Game Context. Current Preview weekly evidence was not loaded; unavailable is not a proven regression. Team Total remains UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME; outdoor weather remains fail-closed without fresh verified forecast.

Evidence provenance: user-supplied external CI/deployment observations and user physical inspection before merge. Git fetch verified canonical main locally; no GitHub, Cloudflare or device inspection performed by Codex.

- PR #200 reviewed head: `e3503a9f5a06e37d7d9795051d0a18eb06caa65e`.
- Canonical merge: `84971e64b89757f2b59e6f4cae7891fd8c372843`.
- Exact inspected Preview == reviewed PR == merged Production tree: `b93018542ab7402b228b986e627e02aeffcabdc1`.
- Production deployment/build: `2564389d-2890-4d76-a582-ed66c0eb7185`; check `108449050892` PASS.
- Premerge exact-head guardrails, behavioral-contract, package, pitti-cloud-validation and Cloudflare Preview: supplied PASS. Runtime package: 17 files.
- Main authority-coupled checks failed with `SEAL: seal drift` and `runtime version lock drift`; Production itself succeeded.
- Physical classification: `RC4.211_PHYSICAL_PASS_STALE_SPECIAL_TEAMS_GUARD_AND_WEEK_LABEL_CONFIRMED`.
- Bounded observations: WEEK 3 D/ST + K, explicit unavailable current Special Teams evidence; no stale W1 TARGET/WATCH/EMERGENCY or K upgrade/edge; live ownership and roster K preserved; K-vs-K only; no misleading FantasyPros W1 for current Week 3; footer rc4.211.
- Current Preview weekly evidence was not loaded and QB/RB/WR/TE ranks/projections showed unavailable. This is not proven to be a regression and is not a new broad physical PASS.
- Last broad physical baseline: rc4.210 / `RC4.210_PHYSICAL_PASS_SELECTED_PITTI_PERSISTENCE_AND_CONSUMER_CONFIRMED`: Weekly Projections, Broad ECR, selected PITTI panel, Week-3 rank persistence/Start-Sit consumption, Game Context 16 games/32 teams, opponent/dome semantics and secret safety. Preserve v265 evidence unchanged.
- No runtime changes, no automatic fantasy transactions. Team Total remains `UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME`; outdoor weather requires fresh verified forecast.

Exact gate: `RC4211_PRODUCTION_BOUNDED_PHYSICAL_ACCEPTED`.
Local checkpoint publication requires a separately authorized external action; no runtime deployment is part of this reconciliation.
