# RC4.226 release report

VERDICT: SOURCE / CI / DEPLOYMENT VERIFIED, EXISTING ESPN UPSTREAM DEGRADED. Android PENDING. No full current functional-surface PASS claimed.

VERSION: v11.8.0-rc4.226
MAIN: 31e915fd6cce95ee9ec073c00113c8a2fc9e26c4
TREE: 859a10fe9d824c4a39fdbf0c5716ff576084eb06
REVIEWED HEAD: 49e15386373d00266817fdf7377ffe766cacf17a; merged tree identical.
DEPLOYMENT: 5a108780-9443-4ed0-9e1c-f784a1eb0c48
PR: https://github.com/Muero42/draft-companion/pull/229 (MERGED).

INTERRUPTED WORKTREE: initial v301 local Authority commit retained as feature-branch parent; original takeover had no uncommitted RC226 code. All implementation developed during this work preserved. Corrections cover anonymous usage rows, FA object shape, diagnostic rationale, axis metadata, import ordering and complete18-file package/offline contracts. No reset.

BEFORE STATE: legacy optimizer accumulated raw projection score. Existing exact selected provider ECR was filtered consensus, not PITTI custom weighting. Both paths remain frozen for Trade/Waiver; the new engine is promoted only into Start/Sit.

SEASON PHASE: Week4 MID, Draft accuracy weight0 in every phase. Completed Weeks1–3 only. Current/partial/future results excluded.

EXPERT POOLS: QB/WR/TE Boone, Dalton Del Don, Koerner, Fitzmaurice; RB additionally Wheeler, Weisse. Exact provider identity; starting incumbents are replaceable.

ACCURACY SOURCE: verified2025 positional IN-SEASON ordinal priors. Coarse top10=.60/top25=.55/other=.50 is an explicitly heuristic prior expectation, not a claimed published accuracy percentage. Public current2026 ordinals have no proven accuracy update timestamp; bounded Weeks1–3 backfill CURRENT_2026_ACCURACY_INSUFFICIENT. Public singleton filters returned broad consensus and were rejected. No reconstructed history or Draft substitution.

ACCURACY LEDGER: pitti.season-expert-accuracy.v1; stable per-position QB24/RB60/WR70/TE24 pre-lock universe, pairwise ordering Half-PPR metric, tied pairs omitted symmetrically. Exact individual snapshots pitti.expert-week-snapshot.v1 lock per player at kickoff; immutable thereafter. Requires completed matching prior week, verified actuals,70% depth/90% universe coverage, finite timestamps and unique identities; no hindsight injury exclusion. Prior and weight at capture retained.

ADAPTIVE WEIGHTS: six equivalent prior weeks;2026 influence grows with scored weeks. Maximum3percentage-point target movement per completed-week update,30% per expert. Same completed week freezes targets. Minimum4experts/75%coverage; stale or unproven current votes0. Frozen qualification configured weights follow below; current effective weights QB/RB/WR/TE are all0 in the unproven-individual audit. An authenticated current client response was not independently observed; its actual postqualification weights are not claimed.

QB: Dalton Del Don 26.09% configured / 0 effective; Pat Fitzmaurice 21.74% configured / 0 effective; Justin Boone 26.09% configured / 0 effective; Sean Koerner 26.09% configured / 0 effective

RB: Ryan Weisse 15.15% configured / 0 effective; Kev Wheeler 16.67% configured / 0 effective; Dalton Del Don 16.67% configured / 0 effective; Pat Fitzmaurice 15.15% configured / 0 effective; Justin Boone 18.18% configured / 0 effective; Sean Koerner 18.18% configured / 0 effective

WR: Dalton Del Don 25.00% configured / 0 effective; Pat Fitzmaurice 25.00% configured / 0 effective; Justin Boone 27.27% configured / 0 effective; Sean Koerner 22.73% configured / 0 effective

TE: Dalton Del Don 27.91% configured / 0 effective; Pat Fitzmaurice 23.26% configured / 0 effective; Justin Boone 25.58% configured / 0 effective; Sean Koerner 23.26% configured / 0 effective

CHALLENGERS: at most2 per position from exact directory with strong prior or at least3scored current weeks. Promotion needs current individual availability,3completed weeks,8pp shrunk advantage and2completed-update confirmations. Gradual incumbent transfer, one temporary additional member bounded to7 during RB transition. No current production promotion/demotion claimed without validated history.

WEEKLY PANEL: per-expert/position authenticated requests reuse existing pacing; no per-player request. Singleton identity/filter/total1/current scope/HALF/rank min=max=mean=ECR must prove individual shape. Weighted median primary; mean/dispersion diagnostic, disagreement reduces confidence. Inadequate proof/coverage explicitly falls back to unweighted selected/Broad evidence.

USAGE / BREAKOUT: verified current nflverse weekly stats + unique GSIS/Sleeper crosswalk;949 records. Latest completed game, recent3games and finite season-to-date means. Targets/share/air yards/receptions/first downs, carries/share/targets, QBattempts/carries. Sustained three-game role changes; one-game confidence lower. TD/box-score spikes alone never create growth. All roster and FA skill players receive normalized objects/flags; no FAAB/Trade engine promotion.

MATCHUP: preserved qualified FantasyPros position/team fallback (32 WR teams). Slot/outside, shadow and direct WR/CB UNAVAILABLE; no defender names invented.

CEILING / FLOOR: categorical verified volume/air-yards/receiving/rushing role; stable high volume supports floor, TD dependence flagged. Ceiling only near-tie opportunity group, no fake point bonus.

DECISION ENGINE: raw provider projection unchanged. Conservative uncalibrated1.0-point uncertainty band. Near swaps need primary evidence plus a second usable group and no verified contrary signal; usage/trajectory/news/ceiling share one group, environment/weather one group, expert+same-provider matchup alone insufficient. Outside-band override needs both primary groups, no contrary support, gap<=2bands. Missing optional evidence never votes positively; lower raw baseline cannot receive HIGH confidence. Larger baseline-only decisions explicitly LOW/BASELINE_ONLY. Locks/OUT/IR/PUP/legal geometry preserved.

PICKENS / DOWNS AUDIT: public reference12.1/11.3, not locally authenticated primary projections. Current individual expert panel unproven. Targets6/8/11 vs4/9/11; shares20/26/28% vs14/30/31%. Pickens trajectory MIXED; Downs UP with sourced air-yard ceiling support. Current pair-specific matchup/environment/news unresolved; no Allen absence assumption. Frozen partial-source decision HOLD current / ZU_KNAPP / LOW. Synthetic usage+matchup regression permits lower-projection Downs LEAN MEDIUM; screenshot is a presentation fixture, not live recommendation. No hardcoded player exception.

HISTORICAL VALIDATION: A projection-only, B static selected, C adaptive, D full PITTI all NOT ESTIMABLE without reproducible same-provider historical primary projections and pre-lock individual ranks. One bounded pass only, no superiority claim/parameter fishing.

DRAFT ARROW: Draft only; all Season workspaces hidden, disabled, tabindex-1, display:none/pointer-events:none. Draft click gate preserved.

PERFORMANCE: one shared source flight, bounded serial expert acquisition, caches, whole-batch429backoff, stale context cancellation, in-loop yields across normalization/acquisition. Compact learning <250k, exact timestamp roundtrip; optional persistence failure isolated. Existing scorer/trade cooperative parity pass. No device responsiveness claim.

FOCUSED TESTS: adaptive engine, real-source parser/provenance, acquisition/cache/FA normalization, durable policy coupling, eligibility, locks/persistence, roster225,21/21adversarial,4219cooperative parity, startup/release/package/service-worker/workflow/cloud-security foundation and Authority guards PASS. Mobile360/390/430 screenshot review PASS, no overflow, names/points17px, rows14px, DOME/materialROLE/actual/locks preserved.

STRICT / CLOUD CI: no local full Strict. Final reviewed exact-head287/287 and browser PASS; premerge5/5success. Canonical postmerge287/287/browser PASS and8/8success. Initial283/287 corrected startup/package count defects without weakening tests.

POSTMERGE: all17served static assets match canonical UTF8/LF; reviewed/merged tree identical. Production new sources HTTP200,949records, completed1–3, all4expert directories (171each at verification), no failures. Sleeper Week4 Half-PPR CLE9/Judkins18.6 verified read-only. Production WR context HTTP200/32teams.

CURRENT LIMITATION: Production /api/nfl-week-context returns HTTP502, all4ESPNvariants upstream403. Direct primary ESPN sourceHTTP200 proves CLE/PIT FINAL independently. Existing Runtime acquisition path unchanged; unavailable context fails closed and may prevent fresh recommendations after cached context expires. Deployment/CI do not imply full current live-surface PASS. No speculative source/header workaround applied.

AUTHORITY: coupled v303 reconciled locally; this unpublished Authority commit is not certified by canonical runtime CI. Historical rc4223 Android core USER_CONFIRMED PASS preserved.

ANDROID ACCEPTANCE = PENDING.
Next user action: one real Android Kader review; one safe diagnostic export only if required.

FILES CHANGED (48 in reviewed PR, including preserved v301 Authority):
- .github/workflows/release-contract-v2-package.yml
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
- _worker.js
- app.js
- config/season-expert-phase-policy.json
- docs/PITTI_RC4216_DECISION_QUALITY.md
- docs/PITTI_RC4225_PRODUCTION_RECEIPT.json
- docs/PITTI_RC4225_ROSTER_SURFACE_AUDIT.md
- docs/PITTI_RC4226_ADAPTIVE_DECISION_AUDIT.md
- index.html
- live-surface-v3.css
- live-surface-v3.js
- manifest.webmanifest
- research/IN_SEASON_EXPERT_PHASE_PLAN_2026-09-02.md
- season-decision-engine-v1.mjs
- sw.js
- tools/fixtures/rc4225/authority-digests.json
- tools/fixtures/rc4226/authority-digests.json
- tools/fixtures/rc4226/runtime-blobs.json
- tools/fixtures/rc4226/source-qualified-week4.json
- tools/handoff-seal-reseal.mjs
- tools/package-reextract.mjs
- tools/pitti_guardrail_check.mjs
- tools/postmerge-authority-contract.mjs
- tools/postmerge-authority-regression.mjs
- tools/rc4226-authority.mjs
- tools/runtime-files.mjs
- tools/season-boone-production-parity-regression.mjs
- tools/season-browser-review.mjs
- tools/season-dst-production-regression.mjs
- tools/season-expert-phase-policy-regression.mjs
- tools/season-lineup-evidence-status-regression.mjs
- tools/season-package-manifest-regression.mjs
- tools/season-rc4223-eligibility-regression.mjs
- tools/season-rc4226-adaptive-decision-regression.mjs
- tools/season-rc4226-runtime-regression.mjs
- tools/season-rc4226-sources-regression.mjs
- tools/season-service-worker-cache-regression.mjs
- tools/week1-dst-current-baseline-regression.mjs
