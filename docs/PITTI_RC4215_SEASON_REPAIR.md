# rc4.215 Season runtime repair

Canonical base: faa6d37971fd6149b039f1b6c5a6106c5e978f10; tree 33f1503af8250f47fa9892d1aeaef27ece5f45fe. Local candidate v11.8.0-rc4.215; no Production or physical acceptance claimed.

Proven findings: weeklyLineupEvidence formatted absent publishedAt on legitimate RETRIEVAL records; live authority expired at five minutes with no roster recovery; persisted league/user identity still waited on historical draft identity, and bootstrap awaited optional completed-draft archive before rendering.

Presentation now distinguishes provider TIMESTAMP, DATE and retrieval/verification time without changing chronology admission. Missing/invalid times render Zeit nicht verfügbar. Other Season snapshot/game toISOString sites guard invalid inputs. Regression uses the exact RETRIEVAL provenance through the actual nine-opponent Waiver market and HTML evidence rendering.

Ownership refresh runs single-flight, checks near-expiry at four minutes on a one-minute cadence, and runs on resume/online or Kader aktualisieren. Five-minute authority remains strict. Failed refresh leaves old data visible and expires action authority normally. Derived roster/FA/DST/K state replaces the context coherently before dependent rendering. Optional transaction updates bind to the matching returned state, not the previous roster context. Bootstrap and live refresh cannot overlap.

Startup uses saved league/user IDs first; unresolved identity still falls back to draft mapping. Live bootstrap does not request completed-draft archive; explicit Draft archive loading retains its existing fetch path. A full player directory is fetched on startup and at most once per six-hour memory age during successful live refresh; no player-directory localStorage cache is added. Lightweight refresh does not invoke Weekly Evidence or Trade Value acquisition.

Transient projection finding: an immediate diagnostic success does not identify the earlier QB response/error. Existing per-position acquisition, request pacing, Retry-After and bounded automatic retry policy remain unchanged; no speculative retry or weaker evidence gate added.

rc4.214 is checkpointed Production DEPLOYED_SUCCESS / PHYSICAL FAIL (NOT ACCEPTED), preserving the positive projections/Broad ECR/selected PITTI/RB/persistence/13-of-13 Start/Sit/Game Context observations. D/ST physical acceptance remains incomplete, and its current/+1/+2 scoring is unchanged. rc4.210 remains the broad accepted baseline.

Focused validation: retrieval/waiver, live refresh and bootstrap, identity fallback, strict TTL, single flight, six-hour directory bound, manual/resume/timer, existing D/ST Week4/5/6 fail-closed, RB/storage, metadata quota, lineup, Boone, service worker and navigation checks PASS. No physical/device test. Complete strict suite exactly once: 249/252 PASS, exit 1. Three obsolete expectation failures: runtime-startup-contract prohibited the requested manual control; season-bootstrap-render-order and season-mobile-bootstrap-transport required the removed optional archive wait. Those expectations were corrected to enforce lightweight manual recovery and nonblocking archive; all three targeted reruns PASS. Runtime unchanged after the suite. No full-suite rerun; green final-tree full verification remains the next gate.

Next safe gate: RC4215_PUBLICATION_EXACT_HEAD_CI_THEN_PRODUCTION_PHYSICAL_ACCEPTANCE; publication and all external actions require separate authorization.

Changed files (27):
- HANDOFF_COMPLETENESS_MATRIX.md
- NEW_CHAT_HANDOFF_CURRENT.md
- PITTI_AUTO_PREFLIGHT.md
- PITTI_COMMAND_CONTRACTS.json
- PITTI_CURRENT_STATE.json
- PITTI_EXECUTION_LOCK.json
- PITTI_HANDOFF_SEAL.json
- PITTI_NEW_CHAT_BOOTSTRAP.md
- PITTI_PROJECT_STATE.md
- README.md
- app.js
- docs/PITTI_RC4215_SEASON_REPAIR.md
- index.html
- manifest.webmanifest
- sw.js
- tools/postmerge-authority-contract.mjs
- tools/postmerge-authority-regression.mjs
- tools/runtime-startup-contract.mjs
- tools/season-automatic-refresh-contract.mjs
- tools/season-boone-production-parity-regression.mjs
- tools/season-bootstrap-render-order-regression.mjs
- tools/season-bootstrap-runtime-regression.mjs
- tools/season-interaction-e2e-gate.mjs
- tools/season-live-refresh-regression.mjs
- tools/season-mobile-bootstrap-transport-regression.mjs
- tools/season-retrieval-waiver-regression.mjs
- tools/season-workspace-navigation-regression.mjs
