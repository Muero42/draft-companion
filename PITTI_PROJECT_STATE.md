# PITTI PROJECT STATE — CANONICAL

Updated: 2026-08-26
Authority: Source of Truth for PITTI/Draft Companion execution. Read this before project work or handoff. Actual verified artifacts/runtime can override stale statements; when they do, repair this file immediately.

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

## HARD PRODUCT / DRAFT INVARIANTS

- League: 10 teams, Half-PPR, 1QB. Starters QB, 2 WR, 1 RB, 1 TE, 2 Flex, K, DST; bench 6.
- Max 4 WR / 3 RB / 2 TE simultaneously startable are STARTER maxima, NOT roster/draft caps. Bench players remain legal.
- Do not draft K/DST in normal strategy.
- QB2/TE2 only exceptional in this 10-team 1QB format.
- Geno Smith and Aaron Rodgers are hard exclusions from user's QB path.
- Panel is baseline; ADP is market/timing input, not player-quality truth.
- Return-v2/opponent geometry and opportunity cost must be respected; do not override TAKE/WAIT merely for generic positional preference.
- Snapshot duplicate identity MUST include Draft-ID plus state/fingerprint. Never classify a new mock as duplicate merely because picks/fingerprint resemble another draft.
- Experts in live UI should be immediately visible and in stable ordering; do not require expansion/search during 2-minute decisions.
- Roster utility must suppress increasingly redundant WR recommendations when roster construction already has excessive WR depth; starter maxima must not be misread as roster caps.
- Freshness: do not knowingly use stale expert rankings when current draft rankings are obtainable; reject Superflex/2QB contamination fail-closed.

## EXPERT PANEL — CURRENT DECISIONS

Goal: 4–6 experts only when each contributes clear value; position-specific composition/weights are allowed and preferred when evidence supports them. Avoid correlated double counting.

- Pat Fitzmaurice: retained/reference candidate; current direct FantasyPros individual board obtainable.
- Nick Mariano: current free RotoBaller Half-PPR overall/tier board is obtainable and refreshable. Do not waste AUTO cycles repeatedly proving availability.
- Justin Boone: obtainable through current Companion/FantasyPros comparison reconstruction; do not confuse strong in-season accuracy with preseason draft accuracy.
- Dalton Del Don: restored as serious candidate; historical removal was not sufficiently justified.
- Matt Harmon: especially valuable as WR evaluation/evidence; numerical panel inclusion must earn marginal value.
- Andrew Erickson: challenger only; inclusion/weight requires demonstrated marginal value.
- Derek Brown: excluded from Expert-v2 unless new evidence materially changes the case. Do not silently reinsert.
- Sean Koerner: high-quality watchlist candidate but effectively paywalled/unavailable for Draft 2026. Spend no further current-draft acquisition time. Future availability may be checked occasionally.
- Draft Sharks: candidate source/family. Treat correlated Draft Sharks analysts/model as ONE source family unless independence is demonstrated; never double count Smola/Smith/team signal.
- Do not resurrect temporary Weisse/Gianni/Bobal experimental pool as Expert-v2 baseline; that near-wholesale pool replacement was rejected.
- Final Expert-v2 weights are NOT yet authoritative until current boards are exported and marginal-value/correlation analysis is completed. Do not invent weights from reputation or one accuracy table.

## CURRENT TECHNICAL STATE — 2026-08-26

- Production/default branch `main` is rc4.64 lineage.
- Latest known user Android runtime before board-export test: v11.8.0-rc4.64.
- A clean board-export branch was created from `main`: `pitti-rc464-board-export-clean`.
- Expert-board clipboard exporter implemented. Purpose: obtain machine-readable current boards without JSON upload friction; payload contains ranking data only, never API credentials.
- Clean packaging workflow succeeded on branch head `6ec035b3e73d930da9b003c54a597b60e2138350`.
- Generated artifact: `Draft_Companion_v11.8.0-rc4.64_EXPERT_BOARD_EXPORT_TEST.zip`.
- Artifact SHA-256: `e52549179c1b7927cde9879729851151da0921d9afed5698128a05df4f44b6d8`.
- Artifact has been provided to user for installation. It is NOT Android-verified yet.
- Expected device action after install: Advanced/FantasyPros API -> `Expert-Boards für ChatGPT kopieren`, then paste clipboard payload into chat.
- Export validation must fail closed for 2026 + HALF + ALL + DRAFT + exactly one expert where direct single-board retrieval is claimed.

## KNOWN RECENT FAILURE MODES — DO NOT REPEAT

- Multiple AUTO blocks announced future work instead of executing it, causing user-time loss.
- Research branches had `index.html` accidentally replaced by minimal audit/export pages. Never use those damaged variants as app baseline. Clean branch from `main` was created specifically to escape this history.
- Expert pool was changed too aggressively without proving candidate quality; temporary experts/weights appeared without adequate verification.
- Superflex contamination has occurred before; format must be verified, not assumed.
- Existing solved infrastructure (FantasyPros key/proxy/API) was unnecessarily rediscovered. Check actual current implementation before rebuilding capability.
- Mariano availability was rechecked/repeated excessively after already being solved. Settled-source repetition is prohibited unless freshness requires a new pull.
- Boone's in-season #1 accuracy was mistakenly used as if it were preseason draft accuracy; keep metrics semantically separated.

## NEXT GATE / AUTO QUEUE

A. Device/runtime gate: user installs the already-produced rc4.64 Expert Board Export TEST and pastes exported board payload. Do not ask for JSON upload; clipboard is primary path.
B. While A is pending, continue only independent useful work; do not fabricate board correlations without board data.
C. On payload receipt: validate metadata/freshness -> parse complete boards -> compute per-position rank correlations/redundancy -> evaluate marginal information value with preseason draft accuracy and source independence -> choose minimal 4–6 useful experts/position -> derive conservative weights -> A/B against unchanged rc4.64.
D. A/B must explicitly test previously observed failure modes, especially WR over-recommendation with 6–7 WR already rostered, early/late positional utility, Bowers/elite-TE decisions, Return-v2 TAKE/WAIT, and realistic mock distributions.
E. Only promote Expert-v2 after regression gates pass. Keep old panel selectable for controlled comparison until v2 is validated.
F. After any material result from C–E, update this file immediately.

## HANDOFF RULE

A new chat must start from this file plus verification of the relevant actual artifacts. If chat recollection conflicts with this state, do not guess: inspect artifacts/commits/runtime evidence, resolve the contradiction, then update this file before continuing.
