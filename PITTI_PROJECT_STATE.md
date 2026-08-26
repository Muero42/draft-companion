# PITTI PROJECT STATE — CANONICAL

Updated: 2026-08-26
Authority: Source of Truth for PITTI/Draft Companion execution. Read this before project work or handoff. Actual verified artifacts/runtime can override stale statements; when they do, repair this file immediately. The persistent Library checkpoint `/Pitti/PITTI_PROJECT_STATE.md` contains the full append-only audit history; this repository file is the compact execution lock and must agree with its newest verified material state.

## EXECUTION INVARIANTS — MUST NOT REGRESS

1. AUTO means end-to-end autonomous execution. Do not interrupt while useful work can continue autonomously. Waiting on one lane means work another independent lane. Interrupt only for unavoidable user action/information, material irreversible/security risk, an unresolved contradiction that blocks safe progress, or a meaningful completed result requiring device/runtime verification.
2. Optimize user time, not assistant response latency. Do not send status-only messages when more useful autonomous work is possible.
3. Before every material implementation/research path, preflight: current canonical state; actual branch/build/artifacts; latest Android-verified version; known failures/rejected approaches; prerequisites; parallelizable work; simplest robust end-to-end route.
4. Never silently revive a rejected/obsolete approach. A failed path may be retried only with new evidence explaining why the failure cause is removed.
5. Material decisions, implementations, verifications, failures, rejected approaches, artifact state and next gates must be written here promptly, not deferred until chat handoff.
6. New-chat recovery: read this file first, then verify relevant current artifacts/branches/runtime. Do not reconstruct state from conversational memory. Newer explicit sections supersede older conflicting notes.
7. Built/prepared != deployed != Android verified. Never promote a version's status without evidence for that exact stage.
8. Freeze discipline: near the 2026-08-31 draft, prefer small isolated reversible changes. Major changes require clear expected-value advantage and regression protection.
9. Regression prevention is technical where possible: once a bug class or hard rule is known, add/retain a test, fail-closed guard, or explicit invariant rather than relying on memory.
10. Do not repeatedly re-research settled facts unless freshness materially matters or new evidence appears.

Machine-readable mirror: `PITTI_EXECUTION_LOCK.json`. Executable check: `tools/pitti_guardrail_check.mjs`. CI gate: `.github/workflows/pitti-project-guardrails.yml`. These are guards, not substitutes for checking actual runtime/artifacts.

## HARD PRODUCT / DRAFT INVARIANTS

- League: 10 teams, Half-PPR, 1QB. Starters QB, 2 WR, 1 RB, 1 TE, 2 Flex, K, DST; bench 6.
- Max 4 WR / 3 RB / 2 TE simultaneously startable are STARTER maxima, NOT roster/draft caps. Bench players remain legal.
- Do not draft K/DST in normal strategy.
- QB2/TE2 only exceptional in this 10-team 1QB format; no global positional ban.
- Geno Smith and Aaron Rodgers are hard exclusions from user's QB path.
- Panel is baseline; ADP is market/timing input, not player-quality truth.
- Return-v2/opponent geometry and opportunity cost must be respected; do not override TAKE/WAIT merely for generic positional preference.
- Snapshot duplicate identity MUST include Draft-ID plus state/fingerprint. Never classify a new mock as duplicate merely because picks/fingerprint resemble another draft.
- Experts in live UI should be immediately visible and in stable ordering; do not require expansion/search during 2-minute decisions.
- Roster utility must suppress increasingly redundant WR recommendations when roster construction already has excessive WR depth; starter maxima must not be misread as roster caps.
- Freshness: do not knowingly use stale expert rankings when current draft rankings are obtainable; reject Superflex/2QB contamination fail-closed.
- Preserve quarantine: no PairSum-v2/Rolling-v1 resurrection, Chase-Brown/player-name forcing, fixed roster quotas/caps, or generic Return-v2 retune.

## EXPERT-V2 — CURRENT AUTHORITATIVE SHADOW CANDIDATE

Expert-v2 is NOT production. It must be implemented only as an additional selectable configuration; the unchanged rc4.64 incumbent remains selectable as control/fallback.

Source rules:
- Draft Sharks = ONE correlated source family. Never count Jody Smith + Jared Smola/team signal separately.
- Nick Mariano: current board solved/refreshable; do not repeat availability research without a freshness reason.
- Dalton Del Don: serious current candidate.
- Pat Fitzmaurice: retained/reference candidate.
- Justin Boone: current board available; keep draft-accuracy distinct from in-season accuracy. Boone-heavy variant is rejected.
- Andrew Erickson: challenger only; no incumbency protection.
- Matt Harmon: WR evidence/specialist layer only unless marginal numerical value is demonstrated.
- Derek Brown: excluded from NEW Expert-v2.
- Sean Koerner: current-draft acquisition closed because relevant source is paywalled/unavailable. Do not spend draft-week time forcing access.
- Temporary Weisse/Gianni/Bobal replacement pool is rejected and must not be resurrected from old research workflows.

Recovered rounded weights were the frozen four-position SHADOW hypothesis tested, not production weights:
- QB: Draft Sharks 35 / Nick Mariano 25 / Dalton Del Don 20 / Justin Boone 10 / Pat Fitzmaurice 10.
- RB: Draft Sharks 35 / Nick Mariano 25 / Dalton Del Don 25 / Pat Fitzmaurice 15.
- WR: Nick Mariano 35 / Draft Sharks 30 / Pat Fitzmaurice 15 / Dalton Del Don 10 / Justin Boone 10.
- TE: Draft Sharks 35 / Pat Fitzmaurice 30 / Dalton Del Don 25 / Justin Boone 10.

Do not micro-tune percentages merely to fit historical picks. +/-5-point perturbation testing showed high top-choice robustness.

## CURRENT VERIFIED TECHNICAL / RESEARCH STATE — 2026-08-26

- Android runtime verified: Draft Companion `v11.8.0-rc4.64`.
- Current decision-kernel baseline is pinned to main commit `9ba6db89fc1e7550052a7526bd0c68d6cc7459dc`; that commit's change from its parent is exporter-only, not a decision-kernel retune.
- Real Android `PITTI_EXPERT_BOARDS_V3` export succeeded from persisted verified app caches: Pat 296, Boone 264, Erickson 196, Harmon 239; Dalton Del Don failed closed because no verified local cache; Brown intentionally absent.
- App schema-13 export does NOT preserve expert tiers. Never invent tier values from blank fields; use exact-source tier evidence separately.
- Draft Sharks v4 research evidence is quarantined because its parser truncated apostrophe names. Corrected v5 is the only valid current DS freeze.
- Current Boone reconstruction: 264 rows; 210 exact + 54 bounded reconstructed. Reconstructed uncertainty remains explicit.
- Current-board expert correlations are high; adding voices requires marginal decision value, not panel-size justification.
- Canonical natural fixture backup: `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json`, draft `1397557585325891584`, 15 frozen states. Provenance is mixed: picks 9/12/29 rc4.60; picks 32 onward rc4.63. Never relabel all 15 rc4.63.
- Stored fixture `coachScore` is panel-contaminated and is NOT a neutral A/B target.
- Exact Return-v2 harness reached deterministic control parity for all 14 suitable natural fixtures. This supersedes the earlier non-certifying fixed-input diagnostic.
- Four-position Expert-v2 treatment is REJECTED. QB-v2 produced a material late QB2 regression (including Kyler Murray at pick 149); RB-v2 showed no demonstrated marginal decision value; TE-v2 produced only an isolated pick-12 Bowers -> Jefferson change and no sufficient promotion case.
- Only WR-v2 remains an open SHADOW challenger. In the exact decision comparison it changed/improved the surface at picks 69/92/112/132/149 sufficiently to justify a dedicated WR-only qualification, but this is NOT yet production certification.
- Therefore current authoritative research endpoint: rc4.64 incumbent remains Control and production; QB/RB/TE remain incumbent; WR-v2 alone proceeds to a dedicated marginal-value/roster-utility qualification.
- No player-specific fixes, hard WR cap, generic QB2/TE2 ban, Koerner/Brown resurrection, or rejected replacement-expert pool may be used to make WR-v2 pass.

## WR-V2 ONLY A/B GATE — CURRENT NEXT ACTION

The four-position v2 experiment is closed. Do not rerun it as the default next step.

Next research gate is isolated WR-v2 against unchanged rc4.64:
1. identical raw pre-decision states and exact current kernel;
2. only WR expert-board composition changes; QB/RB/TE remain incumbent;
3. full Return-v2 recomputation with deterministic/disjoint RNG semantics;
4. all non-WR-panel inputs/fingerprints identical;
5. explicitly measure whether apparent gains at picks 69/92/112/132/149 survive correct marginal WR utility as roster WR depth rises;
6. verify late-RB optionality and ordinary QB2 opportunity cost are not displaced by panel-driven WR inflation;
7. exceptional value slides remain legal; no hard positional caps/quotas;
8. promote only if WR-v2 adds repeatable decision value without material natural-control regression.

Mandatory controls remain picks 89, 92, 112, 129, 132, 149, with special emphasis on excessive-WR-depth states. If a weakness occurs in both arms it is a separate B-axis decision-surface problem, not evidence for manipulating the panel.

Even if WR-v2 passes, integration is additive/selectable only; unchanged rc4.64 remains selectable fallback/control.

## KNOWN RECENT FAILURE MODES — DO NOT REPEAT

- AUTO blocks announcing future work instead of doing it.
- Waiting idle when independent lanes exist.
- Chat handoffs or memory reviving stale states.
- Research branches with damaged/minimal `index.html` used as app baseline.
- Expert pool changed too aggressively without current-board/marginal-value proof.
- Superflex/format contamination.
- Rebuilding solved FantasyPros infrastructure or repeatedly re-proving Mariano availability.
- Treating Boone in-season accuracy as preseason draft accuracy.
- Using old selector/audit workflows as authority: some contain Koerner/Gianni/Bobal/Weisse and are historical/quarantined only.
- Treating built/prepared artifacts as Android verified.

## HANDOFF RULE

A new chat must start from this file AND the persistent `/Pitti/PITTI_PROJECT_STATE.md`, then verify the relevant actual branch/build/artifacts/runtime. If checkpoint/chat/repository disagree, do not guess and do not continue from memory: establish the newest verified reality, repair the stale checkpoint/lock, then proceed. Material state changes are written through during the work unit, not deferred until handoff.
