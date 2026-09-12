# PITTI BRIDGE HANDOFF — v246

Generation: `20260912T2057Z-v246`
Project: Draft Companion / PITTI
Primary repository: `Muero42/draft-companion`
Watcher repository: `Muero42/pitti-watcher`

## 0. TOP RULE — FAIL CLOSED / LIVE AUTHORITY

This handoff is the authoritative bridge for the next chat until a fresh canonical checkpoint reconciliation supersedes it. It intentionally captures live facts newer than the repository's v245 checkpoint files.

On takeover:

1. Read this file fully before acting.
2. Reverify live GitHub READ-ONLY for both repositories.
3. Reverify the exact PR heads and exact-head checks listed below.
4. Treat `PITTI_CURRENT_STATE.json`, `PITTI_EXECUTION_LOCK.json`, `PITTI_HANDOFF_SEAL.json`, `NEW_CHAT_HANDOFF_CURRENT.md`, `PITTI_NEW_CHAT_BOOTSTRAP.md`, `PITTI_PROJECT_STATE.md` and related v245 files on current main as stale where they conflict with this bridge. They still contain valuable historical invariants and must not be discarded.
5. Any material contradiction between this bridge, live GitHub, Codex output, Cloudflare evidence or physical-device evidence is an authority conflict: stop the dependent action, determine live authority, do not guess and do not restore an older state.
6. Source/build/package/preview/production/device-observed/device-accepted are separate states. Never infer a later state from an earlier one.

## 1. USER EXECUTION CONTRACT — PRESERVE EXACTLY

`PITTI AUTO` means execute all safe, reversible, authorized work autonomously in the same turn. Do not send interim status chatter, empty messages, acknowledgements such as "AUTO läuft weiter", or promise-only responses while executable work exists. Re-inventory after every package. External waiting blocks only the dependent lane.

`STATUS` is report-only: no work, no polling, no tool calls, no AUTO continuation.

`PITTI HANDOFF` means build a regression-resistant takeover package, live-verify authority, include all active lanes and negative constraints, and explicitly identify what the next chat must reverify before continuation.

No automatic Sleeper transaction. No cache/app-data clearing or reinstall as a diagnostic shortcut. No production deployment or physical-device action without the applicable explicit authorization. Routine safe PR work may continue only after fresh authority verification and green exact-head gates.

## 2. LIVE DRAFT-COMPANION AUTHORITY AT HANDOFF

Fresh live GitHub verification at handoff time:

- Repository: `Muero42/draft-companion`
- Canonical branch: `main`
- Canonical main HEAD: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- Main tree: `a680607573e9d14dfe7968e6f41667a1f26b9eb2`
- Commit message: `Merge PR #161: rc4.198 storage-quota hotfix`
- Parent main before #161: `493e5aac9cea5a7a667efec81e1bdc733935baf9`
- PR #161 feature head: `652d6e03b8bdda801c23f3858917bd5344ff7db5`
- Runtime product version string remains `v11.8.0-rc4.198`.

### Historical rc4.198 merge provenance

PR #156 was squash-merged to source/main as:

- reviewed head `931713f8f8beaa70edbfb75041b2c708fae66109`
- base `62d7ecf11774700551b6e5a0497ec054e327a0d7`
- merge commit `826a1f3327ffac643f3c32217246133ea32bd3ac`
- merged tree `1e91afc64a61f4aad08f7fc50d687736211b3d87`

That is historical source provenance only; it does not itself prove production or device acceptance.

## 3. VERIFIED PRODUCTION + PHYSICAL DEVICE EVIDENCE

A Cloudflare Pages Production deployment was physically verified SUCCESS for:

- branch: `main`
- source commit: `493e5aac9cea5a7a667efec81e1bdc733935baf9`
- deployment ID: `81598205-07db-47c9-93ef-3a968d460682`
- deployment URL: `https://81598205.draft-companion.pages.dev`
- observed status: `success`
- observed at approximately 2026-09-12 21:51 CEST

The already-installed Android/PWA then updated normally to `v11.8.0-rc4.198` without cache clearing, reinstall, or app-data deletion.

Preserved physical PASS observations from rc4.198:

- runtime badge/footer `v11.8.0-rc4.198`
- Sleeper Live-State `< 1 Min.`
- live roster geometry remains valid: 16 rostered players plus Reserve/IR 1
- Zach Charbonnet remains separate in Reserve/IR and is not an ordinary drop target
- Start/Sit preserves projection/rank lane separation semantics; no season-rank fallback is fabricated
- positional-rank unavailability is represented explicitly rather than substituted across positions

Physical blockers observed after rc4.198 production deployment:

1. First rc4.198 refresh failure: `STORAGE_QUOTA_EXCEEDED`. Weekly Evidence stale at ~1 day. No fresh current Half-PPR projection snapshot reached the physical consumer; 14 realistic active QB/RB/WR/TE remained not fully evaluable.
2. PR #161 storage-quota hotfix was merged to main as `c9f7eb1...`. It protects research/return-validation/active decision evidence and adds a projection-only persistence fallback under quota pressure.
3. A later physical retest at approximately 22:16 CEST still showed `v11.8.0-rc4.198`, Sleeper `<1 Min.`, but Weekly Evidence failed with `TIMEOUT`, not quota. Player cards still showed Half-PPR unavailable. Therefore the active blocker moved from local persistence to upstream/client latency.
4. The same later device evidence showed `Pitti Watcher: FAIL · automatische Research-Ingestion bleibt AUS` and `Research Cache: Noch keine versionierte Evidence gespeichert.`

Important: the visible `rc4.198` badge alone cannot distinguish source commit `493e5aa` from later hotfix main `c9f7eb1`, because #161 intentionally retained the same product version. Do not claim the physical TIMEOUT test proves the #161 main bytes were actually served unless production deployment identity for `c9f7eb1` is freshly proven. The latest production deployment that was physically and explicitly verified remains `493e5aa` unless newer Cloudflare evidence is obtained.

Current physical verdict is NOT full acceptance. The active operational state is:

`RC4.198_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED — WEEKLY_EVIDENCE_TIMEOUT + WATCHER_FAIL`

Do not clear cache/app data and do not reinstall. Preserve local evidence.

## 4. PR #162 — ACTIVE DRAFT-COMPANION P0 RESTORE LANE

Live verified at handoff:

- PR: `#162`
- title: `rc4.198 OR1: bound Weekly Evidence upstream latency`
- state: OPEN
- draft: false / ready for review
- mergeable: true
- base: `main`
- base SHA: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- branch: `pitti/rc4198-operational-restore-or1`
- head SHA: `a0e1208c00eade99a7d2e3a5ddb5f5e2a2b7a5bb`

Exact-head checks on `a0e1208...` were freshly observed green, including:

- Cloudflare Pages preview: SUCCESS
- package: SUCCESS
- behavioral-contract: SUCCESS
- pitti-cloud-validation: SUCCESS
- project guardrails / remaining exact-head gate: previously observed green; reverify exact current list before merge

Cloudflare preview identity for #162:

- deployment/check external ID `0e7fe9dc-8c89-439b-8bf3-3fd40d19f37d`
- preview URL `https://0e7fe9dc.draft-companion.pages.dev`
- branch preview `https://pitti-rc4198-operational-res.draft-companion.pages.dev`

### #162 implemented scope

Narrow operational latency boundary only:

- optional FantasyPros weekly-rank requests fail fast after 2.5 s
- projection requests receive at most two bounded 4.4 s attempts
- HTTP 429 is never retried
- unrelated live APIs continue bypassing the service-worker proxy/cache path
- existing rc4.198 projection/rank separation remains
- existing #161 storage-quota projection-only fallback remains
- new executable regression: `tools/season-fp-proxy-resilience-regression.mjs`
- service-worker cache advances to `static-v4`

### #162 explicit limitation

#162 does NOT implement the larger structural refactor where projections are persisted before any rank acquisition inside `app.js`. It is intentionally an OR1 operational boundary for Week 1. Do not misrepresent it as a complete transaction architecture redesign.

Before merge, Codex must independently audit #162 against the latest main and verify that the service-worker timeout/retry layer cannot introduce double-proxying, stale-cache capture, 429 retry, unrelated API interception, or a regression in the protected storage fallback.

## 5. PITTI WATCHER LIVE AUTHORITY + PR #6

Fresh live verification at handoff:

- Repository: `Muero42/pitti-watcher`
- canonical main HEAD: `90473a6e7b5a79097a8a0816329113a8c492698b`
- main tree: `f7f513421f04c250eeab9a89830c57c9001fc1bb`
- latest main commit is historical PR #5 player-state batching fix

Active repair:

- PR: `#6`
- title: `v0.2.7: isolate market and player-state health lanes`
- state: OPEN
- draft: false / ready for review
- mergeable: true
- base SHA: `90473a6e7b5a79097a8a0816329113a8c492698b`
- branch: `pitti-auto/v0.2.7-lane-isolation`
- head SHA: `77221ceeb900458e95c32d78c1ad395a37422e5d`

Exact-head checks freshly observed green:

- GitHub test: SUCCESS
- Cloudflare Workers Build / preview: SUCCESS
- second test/check run: SUCCESS

Cloudflare preview identity:

- build ID `777f2176-6fcb-4efc-8ed0-07207d6c5a82`
- Worker Version ID `a4f36c4e-abff-45f9-9b41-814d007b1484`
- preview URL `https://a4f36c4e-pitti-watcher.tim-muero.workers.dev`
- branch preview alias `https://pitti-auto-v0-2-7-lane-isolation-pitti-watcher.tim-muero.workers.dev`

### Watcher root cause and #6 scope

Current production failure mode is global-gate coupling: one failed daily `player_state:scheduled` run can disable the otherwise independent 15-minute market/trending lane for the whole Companion feed.

PR #6 adds a v0.2.7 wrapper that:

- gives market/trending and player-state independent health/freshness states
- keeps overall feed PASS when at least one lane is independently healthy
- filters evidence by lane health
- preserves fail-closed behavior when all lanes are unhealthy
- keeps free-agency ownership filtering
- delegates scheduled collectors to the existing worker implementation unchanged
- changes no D1 migration, cron cadence or automatic transaction behavior

Codex must independently audit that a healthy market lane cannot leak stale fundamental/player-state evidence, a healthy player-state lane cannot leak stale market evidence, ownership filtering remains correct, and all-unhealthy remains fail-closed.

## 6. WHAT IS STALE IN CURRENT REPOSITORY CHECKPOINTS

The canonical v245 checkpoint files on current `draft-companion/main` still encode older authority, including at least:

- handoff generation `20260912T1317Z-v245`
- reconciled source/main `826a1f3327ffac643f3c32217246133ea32bd3ac`
- rc4.198 packaged-only / not deployed wording
- older device authority that predates the verified rc4.198 production deployment and subsequent physical failures

These files must NOT be allowed to roll authority backward during the next handoff. They require a later v246 canonical reconciliation after the current P0 restore decision/merge sequence is settled.

Do not casually edit all coupled checkpoint files before Codex audit. The project has repeatedly suffered from stale alias repair that accidentally reverted newer facts. First audit live authority and active PRs; then perform one coupled checkpoint reconciliation.

## 7. OPERATIONAL PROBLEMS — CURRENT DIAGNOSIS

There are now two independent P0 production blockers:

### A. Weekly Evidence / Start-Sit

Observed physical state: Weekly Evidence ~1 day stale, `TIMEOUT`, Half-PPR projection unavailable on player cards, 14 realistic active skill players not fully evaluable.

Likely immediate operational cause addressed by PR #162: upstream FantasyPros projection/rank latency can consume the existing 10 s client boundary. Optional rank latency must not prevent projection persistence.

The broader architecture debt remains: projection acquisition/persistence and rank acquisition are still too transactionally coupled in `app.js`; #162 mitigates latency but does not fully redesign that path.

### B. Watcher / Live-News / Market edge

Observed physical state: `Pitti Watcher: FAIL`, automatic research ingestion off, no versioned Research Cache on device.

Production design flaw addressed by Watcher PR #6: global health gate couples the fast market lane to the slower daily player-state lane. This destroys the intended information advantage when one lane fails.

## 8. IMPORTANT NEGATIVE CONSTRAINTS / NO-REGRESSION RULES

Preserve all of the following:

- Current Sleeper league state is roster/ownership authority; completed draft roster is historical only.
- League is 10-team Half-PPR, 1QB. Starter geometry: QB, RB, WR, WR, TE, FLEX(RB/WR/TE), W/R(RB/WR), K, DST; bench 6 + IR.
- IR/Reserve is not an ordinary drop target.
- Kicker comparisons are K vs K only.
- Two TE can legally start through FLEX.
- Draft-only QB2 rule must not become a universal in-season QB roster cap.
- Geno Smith and Aaron Rodgers remain historical hard draft exclusions; do not project that draft rule into unrelated season logic.
- No automatic Sleeper transaction.
- Do not use Sleeper projections or Sleeper matchup ratings as PITTI decision evidence.
- Rank and projection lanes are independent; missing rank must never delete a valid projection.
- Positional ranks are never subtracted across positions.
- Do not fabricate PITTI selected-panel evidence from broad consensus ECR.
- Broad ECR remains `BROAD_CONSENSUS_ONLY` when individual selected-expert evidence is absent.
- Missing game/opponent/weather/lock/Team Total stays unavailable unless verified. Do not invent ESPN parser semantics or team aliases.
- Archive SHA is run/environment-scoped only; canonical package identity is the runtime manifest + source-byte/re-extraction parity.
- Production/device evidence must stay separate from source merge state.
- Do not clear cache/app data or reinstall to make a test pass.
- Preserve protected research, return-validation and active decision evidence.
- Do not resurrect old manager identities, stale draft order, stale QB2 blanket bans, or stale rc4.195/rc4.196 source authority.

## 9. USER ROSTER / SEASON CONTEXT TO PRESERVE

Latest device-observed roster geometry used by PITTI:

Starters shown: Jayden Daniels, Bucky Irving, Jaxon Smith-Njigba, Chris Olave, Isaiah Likely, George Pickens, Justin Jefferson, Harrison Mevis.

Bench shown/known: Blake Corum, Jadarian Price, Rico Dowdle, Trevor Lawrence, Kenny Gainwell, Christian Watson, Josh Downs.

Reserve/IR: Zach Charbonnet.

Live Sleeper remains dynamic authority; this list is a physical observation, not a future roster lock.

Week 1 has already started. Operational priority is no longer broad feature polish. Priority order:

1. Restore actionable Weekly Evidence / projections and Start/Sit.
2. Restore Watcher market signal availability without global gate coupling.
3. Restore/verify game-context lane where possible without guessed data.
4. Re-evaluate Waiver/FA immediately after reliable evidence returns.
5. Trades thereafter; draft archive is lowest priority.

## 10. NEXT-CHAT TAKEOVER SEQUENCE

The next chat must perform this sequence, not improvise from stale checkpoint aliases:

1. Read this bridge and `docs/PITTI_CODEX_HANDOFF_AUDIT_V246_2026-09-12.md`.
2. Fresh READ-ONLY verify both repository mains.
3. Fresh verify PR #162 exact head/state/base/mergeability/checks.
4. Fresh verify Watcher PR #6 exact head/state/base/mergeability/checks.
5. Run/obtain the Codex audit result described in the Codex audit file before promotion.
6. If Codex finds material defects, repair only on the existing PR branches; do not open duplicate repair PRs unless unavoidable.
7. If both audits are clean and exact-head checks remain green, proceed according to the current user authorization boundary. Never merge red.
8. After any merge, dynamically re-resolve the new canonical main SHA; do not predict it.
9. Verify production deployment identity separately. A green source merge is not production proof.
10. Only after exact production identity is proven, perform one bounded physical canary. No repetitive manual trial loops.
11. After P0 restore settles, perform one coupled v246+ canonical checkpoint reconciliation so CURRENT/LOCK/COMMAND/SEAL/bootstrap/handoff/project-state all agree with actual source, production and device evidence.

## 11. STOP CONDITIONS FOR THE NEXT CHAT

Stop only for:

- material authority contradiction
- failed/red exact-head gate with no safe repair available
- explicit consequential production/device/transaction authorization boundary
- unavoidable user-only physical observation
- no remaining safe independent work

Do not stop merely because CI is running if other safe lanes exist.

## 12. HANDOFF INTEGRITY INTENT

This bridge deliberately does NOT claim that PR #162 or Watcher PR #6 are merged, deployed to production, or physically accepted. It records them as green, mergeable, ready repair candidates at exact known heads. The next chat must reverify all mutable facts.

It also deliberately does NOT rewrite the stale v245 canonical checkpoint set in-place before independent Codex review. That coupled rewrite is deferred to avoid repeating the project's previous handoff-regression pattern.
