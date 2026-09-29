Handoff generation: `20260929T1322Z-v274`
Generation: `20260929T1322Z-v274`
CURRENT AUTHORITY v274: runtime candidate v11.8.0-rc4.215; published_branch = codex/rc4215-season-live-refresh-repair; publication_status = BRANCH_PUBLISHED_PR_NOT_CREATED; published_head = DYNAMIC_VERIFICATION_REQUIRED. Unmerged, nonproduction, not physically accepted.
Exact-head rule: Freshly resolve remote branch HEAD immediately before PR creation and bind PR/CI to that exact observed SHA.
Canonical main faa6d37971fd6149b039f1b6c5a6106c5e978f10; tree 33f1503af8250f47fa9892d1aeaef27ece5f45fe. Production v11.8.0-rc4.214 DEPLOYED_SUCCESS; PHYSICAL FAIL / NOT ACCEPTED.
Next gate: RC4215_PR_EXACT_HEAD_CI_PENDING. Freshly verify remote branch HEAD -> create rc4.215 PR against main -> require Exact-HEAD CI for that observed PR head.
Continuation: fresh remote HEAD -> PR against main -> exact-head CI -> merge -> resolve new canonical main/tree -> exact-main Production SUCCESS -> RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING.
Historical evidence: 74f8751b3d07bd6302fb6d3d4df6f9ff32482475 externally observed published before this follow-up; focused 12/12 PASS; strict 252/252 PASS, Exit 0, exactly once. Historical SHAs are receipts, never immutable future branch HEAD.
Details: docs/PITTI_V274_RC4215_SELF_REFERENCE_SAFE_AUTHORITY.md. No future merge, deployment or physical acceptance claimed.

## HISTORICAL REPAIR AND V273 FOLLOW-UP

# rc4.215 Season runtime repair

Canonical base: faa6d37971fd6149b039f1b6c5a6106c5e978f10; tree 33f1503af8250f47fa9892d1aeaef27ece5f45fe. Published branch candidate v11.8.0-rc4.215 at 860323b908217c11272b74f9e5b2c2a2c417b1c5; new corrective work remains local; no Production or physical acceptance claimed.

Proven findings: weeklyLineupEvidence formatted absent publishedAt on legitimate RETRIEVAL records; live authority expired at five minutes with no roster recovery; persisted league/user identity still waited on historical draft identity, and bootstrap awaited optional completed-draft archive before rendering.

Presentation now distinguishes provider TIMESTAMP, DATE and retrieval/verification time without changing chronology admission. Missing/invalid times render Zeit nicht verfügbar. Other Season snapshot/game toISOString sites guard invalid inputs. Regression uses the exact RETRIEVAL provenance through the actual nine-opponent Waiver market and HTML evidence rendering.

Ownership refresh runs single-flight, checks near-expiry at four minutes on a one-minute cadence, and runs on resume/online or Kader aktualisieren. Five-minute authority remains strict. Failed refresh leaves old data visible and expires action authority normally. Derived roster/FA/DST/K state replaces the context coherently before dependent rendering. Optional transaction updates bind to the matching returned state, not the previous roster context. Bootstrap and live refresh cannot overlap.

Startup uses saved league/user IDs first; unresolved identity still falls back to draft mapping. Live bootstrap does not request completed-draft archive; explicit Draft archive loading retains its existing fetch path. A full player directory is fetched on startup and at most once per six-hour memory age during successful live refresh; no player-directory localStorage cache is added. Lightweight refresh does not invoke Weekly Evidence or Trade Value acquisition.

Transient projection finding: an immediate diagnostic success does not identify the earlier QB response/error. Existing per-position acquisition, request pacing, Retry-After and bounded automatic retry policy remain unchanged; no speculative retry or weaker evidence gate added.

rc4.214 is checkpointed Production DEPLOYED_SUCCESS / PHYSICAL FAIL (NOT ACCEPTED), preserving the positive projections/Broad ECR/selected PITTI/RB/persistence/13-of-13 Start/Sit/Game Context observations. D/ST physical acceptance remains incomplete, and its current/+1/+2 scoring is unchanged. rc4.210 remains the broad accepted baseline.

Historical initial repair validation: retrieval/waiver, live refresh and bootstrap, identity fallback, strict TTL, single flight, six-hour directory bound, manual/resume/timer, existing D/ST Week4/5/6 fail-closed, RB/storage, metadata quota, lineup, Boone, service worker and navigation checks PASS. No physical/device test. Complete strict suite exactly once: 249/252 PASS, exit 1. Three obsolete expectation failures: runtime-startup-contract prohibited the requested manual control; season-bootstrap-render-order and season-mobile-bootstrap-transport required the removed optional archive wait. Those expectations were corrected to enforce lightweight manual recovery and nonblocking archive; all three targeted reruns PASS. Runtime unchanged after the suite. A later separately authorized final verification on 860323b908217c11272b74f9e5b2c2a2c417b1c5 completed 252/252 PASS, exit 0, exactly once on that final commit; no files changed. This is the final published-head receipt.

Next safe gate: RC4215_PUBLICATION_EXACT_HEAD_CI_PENDING; publication and all external actions require separate authorization.

Historical initial repair changed files (27):
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

## v273 corrective follow-up

Visible age uses current Sleeper season.generated_at; a failed refresh retains the previous age and TTL. Bootstrap fallback is limited to five minutes without current context. Cached canonical manager mapping requires matching league, owner, roster, draft slot and canonical profile; missing mapping gives no historical prior. Persisted identity still performs zero blocking draft requests; lightweight refresh preserves mapping. Coupled current authority is v273; known published receipt above is separate from this local corrective work. See PITTI_V273_RC4215_PRE_PR_AUTHORITY.md.
