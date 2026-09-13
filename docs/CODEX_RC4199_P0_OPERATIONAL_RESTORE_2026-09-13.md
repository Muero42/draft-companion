# Codex work package — rc4.199 P0 Operational Restore

Date: 2026-09-13
Repository: `Muero42/draft-companion`
Existing PR only: **#162**
Existing branch only: **`pitti/rc4198-operational-restore-or1`**

## 0. Authority / takeover

Before editing, perform a fresh authenticated READ-ONLY verification of:

- `draft-companion/main`
- PR #162 exact head, base, state, mergeability and checks
- `pitti-watcher/main`
- Watcher PR #6 exact head, state, mergeability and checks

Expected observations at handoff creation, to be treated only as takeover hints and never as permanent authority:

- Draft Companion main: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- PR #162 parent head before this task document: `a0e1208c00eade99a7d2e3a5ddb5f5e2a2b7a5bb`
- Watcher main: `90473a6e7b5a79097a8a0816329113a8c492698b`
- Watcher PR #6 head: `77221ceeb900458e95c32d78c1ad395a37422e5d`

Read `AGENTS.md`, the v246 bridge/audit handoff under `docs/`, current coupled checkpoint files, the complete PR #162 diff and Watcher PR #6 diff before editing. Newer live evidence supersedes conflicting historical checkpoint claims. Do not restore older deployment/device claims.

## 1. Scope and authorization

This is one integrated Week-1 **P0 Operational Restore**, not another isolated device/symptom patch.

Work **only on the existing PR #162 branch**. Do not create a replacement PR. Reversible branch edits/commits/tests are authorized by `AGENTS.md`.

Not authorized in this package:

- merge to `main`
- production deployment/promotion
- physical/device acceptance
- cache/app-data clear or reinstall
- Sleeper transaction, FAAB bid or trade
- weakening security / least-privilege controls
- restoring stale rc4.196/v243 authority as current

## 2. User objective / priority

Primary product objective is to restore a usable Season Companion for:

1. **Waiver / free agency**
2. **Trades**
3. fast, evidence-backed reaction to market/news changes

Start/Sit/game-context remains important but must not expand this P0 unless required to keep existing invariants. Draft-era work is not the current priority.

The application must move from an all-or-nothing evidence chain to independent evidence lanes: use everything still verified and available; fail closed only for the actually defective lane/player/decision.

## 3. Preserve OR1

PR #162 already contains the OR1 service-worker latency boundary. Preserve it unless an independent review proves a defect:

- current-week FantasyPros rank request: one bounded 2.5 s upstream attempt
- projections: max two bounded 4.4 s attempts
- HTTP 429 never retried
- unrelated live APIs bypass this service-worker proxy path
- no static caching of live FantasyPros API responses

Do not regress these guarantees while doing the structural repair below.

## 4. P0-A — Weekly Evidence must be structurally independent

Current defect to reproduce before repair:

- app fetches all four projections, then all four ranks, then persists one combined snapshot
- a slow/failing optional lane can therefore delay or prevent persistence of already-successful evidence
- current `projectionLane()` drops all projection records when the four-position lane is not globally AVAILABLE

Required behavior:

### Projection acquisition

- QB/RB/WR/TE projection requests settle independently (`allSettled` or equivalent).
- A failure in one projection position must not delete or suppress verified records from the other positions.
- Persist a projection-stage snapshot **before any rank request begins**.
- Do not fabricate source publication times or freshness.
- If a position fails, a still-valid previous record for the same season/week/scoring/position may be retained only through the existing record-level chronology contract. The failed fresh position must remain visibly failed/unavailable; cached evidence must not falsely mark the fresh lane AVAILABLE.
- If all projection positions fail and no fresh projection position is available, preserve the previous verified snapshot and fail closed.

### Rank acquisition

- Weekly ranks remain optional and separate from projections.
- Rank requests start only after projection-stage persistence succeeded.
- Rank positions settle independently.
- Rank failure/timeout must never remove already-persisted projection evidence.
- Still-valid prior rank records may be retained under their own chronology contract without claiming a fresh rank PASS.
- Selected PITTI expert panel must remain unavailable unless genuinely verified; broad FantasyPros ECR must never be mislabeled as the selected panel.

### Consumer contract

- `seasonEvidenceCache()` / snapshot validation must accept a projection snapshot with verified partial-position evidence instead of discarding every record merely because one position failed.
- Record-level validation remains authoritative for whether a specific metric can be used.
- Do not weaken Trade/Waiver fail-closed rules merely to produce actions. A decision that lacks required current evidence remains HOLD/WATCH/UNAVAILABLE.

## 5. P0-B — central storage priority; protected evidence may not be sacrificed for rank caches

Current contradiction to remove:

- Weekly Evidence quota recovery protects research / return-validation / active decision evidence.
- `pruneNonCriticalStorageForRankWrite()` still deletes `v118_returnValidation` and `v117_researchEvidence` to make a rebuildable expert-rank cache fit.

Required behavior:

- `v117_researchEvidence` is protected.
- `v118_returnValidation` is protected.
- active decision evidence is protected.
- current verified Season/Weekly Evidence is protected.
- rebuildable/legacy rank caches lose first.
- if an individual expert-rank cache still cannot be persisted after safe legacy duplicate cleanup, report a persistence warning/fail that cache write; do **not** delete protected Season evidence.
- keep the existing research-cache quota recovery semantics that preserve the previous evidence cache if a replacement cannot fit.

IndexedDB may be noted as follow-up architecture, but it is not required for this immediate P0 if the deterministic budget/eviction policy is sufficient.

## 6. P0-C — Watcher partial lane health must remain useful and honest

Watcher PR #6 separates:

- `gate.market`
- `gate.player_state_status`
- `gate.overall` = PASS if either lane is healthy

Server PR #6 filters events by lane. Draft Companion currently consumes only `gate.overall`, which can show a generic `Pitti Watcher: PASS` even when Player-State is FAIL.

Required client behavior for watcher-feed v2:

- inspect `gate.market` and `gate.player_state_status`
- `overall PASS` with no healthy sub-lane is inconsistent and must fail closed
- defense-in-depth: ingest `fundamental_or_market=market` only when market is PASS; ingest `fundamental` only when player-state is PASS
- surface partial health explicitly, e.g. `TEILWEISE VERFÜGBAR · Markt PASS · Player-State FAIL`
- a healthy market lane must continue to deliver market/FA evidence even if Player-State failed
- a healthy Player-State lane must not authorize stale market events
- v1 compatibility remains supported
- do not invent injury/role chronology; current critical-state chronology safeguards remain intact

Do not change Watcher PR #6 in this Draft Companion package unless independent audit finds a server-side blocker. Cross-repo consumer compatibility is the Draft Companion change expected here.

## 7. P0-D — unique runtime identity

Any runtime-byte change after the already-published rc4.198 line must have an unambiguous visible identity.

Use **`v11.8.0-rc4.199`** for this integrated candidate unless fresh repository authority proves that number has already been consumed.

Synchronize all runtime identity surfaces, including:

- `app.js` APP_VERSION
- visible `index.html` badge/query strings
- `manifest.webmanifest`
- `sw.js` BASE/TARGET and a new unique static cache identity

Do not reuse the rc4.198 badge for changed runtime bytes.

## 8. Mandatory regression scenarios

Before calling the branch merge-ready, executable tests must prove at least:

1. projections succeed while a rank request times out -> projections persist and remain consumable
2. QB/RB/TE projections succeed while WR projection fails -> healthy positions persist; WR fresh lane remains failed; still-valid prior WR evidence may remain usable without a false fresh PASS
3. all projection positions fail -> previous verified snapshot remains unchanged
4. near-full browser storage -> research, return-validation, decision evidence and prior Weekly Evidence are not evicted for rank-cache persistence
5. full projection+rank snapshot does not fit but projection-only snapshot does -> verified projections remain usable and protected evidence survives
6. Watcher market PASS + Player-State FAIL -> only market events ingest, UI is partial rather than generic PASS
7. Watcher market STALE/FAIL + Player-State PASS -> only fundamental/player-state events ingest
8. Watcher overall PASS + no healthy sub-lane -> client rejects as inconsistent
9. OR1 429 semantics and bounded projection/rank retry/timeouts remain unchanged
10. existing Waiver v3 regressions remain green, including legal ADD/DROP, Reserve/IR exclusion, sole active QB/TE protection, K-vs-K and D/ST isolation
11. existing Trade v8 regressions remain green, including bilateral roster improvement, current-value comparability, real live rosters/capacity and conservative fail-closed behavior
12. 17-file runtime package and byte-exact re-extraction still pass if no new runtime module is introduced

Add/update focused regressions rather than relying only on broad unit/guardrail green status. CI must exercise the production-shaped failure combinations above.

## 9. Independent Codex review requirement

Do **not** blindly implement this document. First independently inspect the code and challenge the proposed repair. In particular review:

- race conditions between projection-stage persistence and optional rank-stage persistence
- whether retained prior records can accidentally be re-stamped as fresh
- record-key collision/dedup semantics when merging prior evidence
- whether partial snapshots can leak stale evidence into Waiver/Trade decisions
- localStorage atomicity/quota behavior
- service-worker/app timeout interaction
- Watcher v2 lane filtering and v1 compatibility
- mobile/PWA cache upgrade semantics for rc4.199
- whether a smaller root-cause implementation achieves the same guarantees with lower regression risk

If the proposed design is unsafe, repair the design while preserving the product invariants. Document the reason and executable regression.

## 10. Required validation

At minimum run:

- syntax checks for changed JS/MJS
- `node tools/weekly-evidence-v2-regression.mjs`
- focused production-shaped Weekly Evidence lane-isolation regression
- `node tools/season-fp-proxy-resilience-regression.mjs`
- `node tools/season-watcher-feed-v2-regression.mjs`
- `node tools/rc4111-storage-quota.mjs`
- Waiver v3 / Trade v8 / combined Waiver-Trade regressions
- adversarial Season review
- service-worker cache regression
- runtime startup/version parity regression
- `node tools/strict-suite.mjs`
- candidate preflight/guardrail as appropriate for an unmerged runtime version
- `node tools/package-reextract.mjs <output>`
- `git diff --check`

After publication, verify **exact-head GitHub CI** and Cloudflare **preview/check only**. Do not promote production.

## 11. Output / stop condition

Commit only to the existing PR #162 branch. Update the PR description to the integrated rc4.199 scope after implementation.

Final Codex report must include:

- fresh main SHA
- exact PR #162 head SHA
- changed files
- independent design-review findings
- reproduced failures and fixes
- exact tests + results
- package identity / file count
- exact-head CI results when available
- remaining blockers
- explicit statement: no merge, no production deployment, no device acceptance, no cache clear/reinstall, no Sleeper transaction

Stop fail-closed if live authority moved materially or any required regression remains red.
