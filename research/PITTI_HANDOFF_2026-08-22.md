# PITTI HANDOFF — 2026-08-22

## Source-of-truth intent
This handoff supplements the canonical project state. On continuation, read the canonical PITTI_PROJECT_STATE.md to EOF first, then this handoff and the referenced research files. Verify current GitHub/runtime artifacts before assuming a prepared version is installed on Android.

## Immediate objective
Reach trustworthy, realistic full-draft simulations soon enough to extract actionable draft strategy for the real 10-team Half-PPR Sleeper draft on 2026-08-31 (user slot 9). Simulation realism and evidence from mocks are high priority. Avoid unnecessary/high-risk large production changes as draft day approaches, but **do not treat 2026-08-24 as a hard ban on large changes**: if evidence indicates a material Championship-Utility / league-win benefit and the change can still be implemented, tested and rolled back safely, a larger change remains explicitly allowed and desirable even after 2026-08-24. Prefer the smallest change that captures the benefit; change size itself is not the optimization target.

## Latest critical result: dynamic TE screen failed; turn-pair probe is current critical path
The completed 5-variant dynamic TE/opportunity-cost screen did NOT produce a promotable dynamic TE rule.
- TE_SOFT2, TE_SOFT4, TE_SOFT6 and TE_RETURN_GATE all reproduced the same poor outcome: about -0.630 expected wins baseline / -0.722 stress vs MARKET_ROSTER.
- The hard DEFER_TE69 diagnostic improved materially to about -0.148 baseline / -0.283 stress, but remains inferior and is diagnostic only.
- Representative bad Coach path remained Amon-Ra -> Bowers -> Olave -> Flowers -> Swift -> McLaurin, with RB1 delayed to 5.09.
Interpretation: do NOT keep grid-searching TE penalties. The structural defect is broader opportunity cost / snake-turn composition, not proof that elite TE itself is bad.

Current research response: Draft PR #6 / branch `pitti-turn-pair-probe` preregisters a position-agnostic two-pick lookahead at slot-9 turns. It evaluates current-player quality + expected return-pick quality + bounded starter-state coverage, with no Hero-RB/Late-TE objective and no named-player hard coding. First screen variants are CONTROL, PAIR_FIRST (1.09->2.02) and PAIR_FIRST_TWO (also 3.09->4.02). Production promotion is forbidden from this screen alone; a passing rule must be frozen and validated on fresh holdout seeds and realistic mocks.

GitHub Actions run 32596679736 is the active 3-arm 10-seed/regime turn-pair screen. At the latest checkpoint all three jobs are still in the simulation step, with Python pair-core invariant tests already PASS and no job failure. Do not restart or duplicate while healthy. Continue independent parallel work while it runs.

Methodological caveat: existing Return-v2 exposes calibrated marginal player return probabilities, not a true joint return-board distribution. The first turn-pair screen therefore uses a preregistered ordered-survival approximation over marginal Return-v2 probabilities. Even a positive screen must receive joint-state / conservative dependence validation before production promotion.

## Earlier RB2_BY52 diagnosis retained
GitHub Actions run 32590945054 (`PITTI rc4.59 RB2 Core Diagnostic`, run #2) completed with intentional failure at the final fail-closed gate.
- Simulation step: PASS.
- Raw draft artifact persisted: artifact 9480559792 `rb2-by52-raw-drafts`.
- Core audit persisted: artifact 9480559978 `rb2-by52-core-audit`.
- Outcome-v2 correctly SKIPPED because the core audit found an invalid Coach roster.
- Exact failing Coach row: stress=`baseline`, seed=`459260006`.
- Final 15-pick position counts: QB=1, RB=6, WR=8, TE=0.
Interpretation: do NOT relax retain13 to make this pass. Ensure generic final-roster starter feasibility, not a hard early-TE mandate.

## Realistic simulation validation matrix
Research spec: `research/REALISTIC_MOCK_VALIDATION_MATRIX_2026-08-22.md`.
Required ladder: small causal CRN screen -> simple candidate -> fresh held-out larger certification -> full realistic mock matrix -> pick-level sanity review -> production integration. Persist raw simulation before downstream evaluators; persist legality/core audit separately. Downstream failures must never destroy expensive simulation evidence.

## Opponent draft-mode semantics
Every opponent defaults to MANUAL whenever there is no current contrary information. Do NOT probabilistically mix autodraft into the baseline merely because an interruption is possible. Switch prospectively to AUTODRAFT only from current evidence; switch back if manual behavior resumes. AUTODRAFT/UNKNOWN picks must not train personal manager profiles.

Official Sleeper grounding: CPU auto-pick uses ordered Draft Queue when available; drafted players are removed automatically; with empty queue it falls back toward higher-ranked available players while considering roster needs. No supported custom ranking upload. Model consequence: AUTODRAFT is `QUEUE_IF_AVAILABLE -> SLEEPER_RANK_PLUS_ROSTER_NEED`.

## Autodraft effort priority
Autodraft is a low-probability contingency. Keep only the cheap robust minimum: deep Sleeper queue + MANUAL/AUTODRAFT state handling + queue-first semantics. Do not spend material engineering time on private-queue inference or elaborate autodraft modeling while Coach policy, realistic mocks, Player Evidence or TAKE/WAIT remain higher-EV.

## Player-evidence gates — latest 2026-08-22
Treat current camp/injury news as probability/evidence gates, not automatic ranking coefficients.
- Malik Nabers: trend is positive after return to 11-on-11/team work, but full contact/medical clearance remains the decisive gate. Do not equate non-contact team work with full return.
- Chris Olave: no new standalone health downgrade in the latest pass. Saints rookie WR Jordyn Tyson's hamstring absence can increase target concentration around Olave, but quantify only after role evidence stabilizes.
- Parker Washington: day-to-day with an undisclosed injury and expected back soon; preserve the value thesis for now, but mandatory draft-day recheck.
- Zay Flowers: quad contusion/day-to-day evidence reduces concern versus an unspecified serious injury; no major downgrade absent setback.
- Chase Brown: current Bengals camp evidence remains compatible with a lead/high-volume role; no new health/role warning that explains Coach's early-RB avoidance.
- D'Andre Swift: Chicago backfield evidence remains consistent with a tandem rather than a true workhorse; do not artificially boost him to solve roster-construction defects.
- Sam LaPorta: hip injury is a current TE evidence gate; Week-1 expectation is not completely certain. Recheck before using him as stable high-end-TE input.
- Other current recheck names include Breece Hall (groin), Chuba Hubbard (hamstring), Kyle Monangai (knee), Puka Nacua (groin), Emeka Egbuka (toe), Tucker Kraft (knee), Tyler Warren (groin) and George Kittle (Achilles/PUP). Do not convert list membership into a ranking penalty without severity/timeline evidence.

## AUTO operating rule — general and mandatory
On every AUTO block maintain two queues:
1. serial critical path;
2. independent parallel work.
Whenever any critical simulation, CI, research, deployment or other operation is running/waiting, automatically ask what useful independent work can proceed and execute it if it cannot contaminate the critical path. Repeated polling/waiting is allowed only when no worthwhile independent task exists. Prioritize by expected Championship-Utility / user-time benefit, not ease of execution. Diagnose failures before retrying; do not repeat failed approaches without new evidence.

## Immediate next actions (ordered)
1. Let healthy turn-pair run 32596679736 finish; do not duplicate it. On first completed arm, inspect raw pick behavior as well as outcome rather than waiting for all arms if useful evidence is available.
2. If turn-pair candidate passes small screen, freeze the exact rule and run fresh held-out certification; also validate the marginal-return approximation against joint-state simulation or conservative dependence bounds before production promotion.
3. If it fails, diagnose mechanism/pick paths before changing lambda/frontier. Do not tune those parameters on the same outcome screen.
4. In parallel continue targeted Player Evidence for likely slot-9 windows, TAKE/WAIT mapping and realistic-mock infrastructure. Do not merely poll CI.
5. Once a simple Coach candidate passes small screen + legality, run fresh held-out certification, then realistic full mocks. Do not calibrate from one illustrative mock.
6. Prepare slot-9 turn maps / TAKE-WAIT outputs and deep Sleeper Queue fallback before the real draft; K/DST omitted, QB2/TE2 deprioritized.

## Hard user/project constraints to preserve
- League: 10 teams, Half-PPR; QB, 2 WR, RB, TE, 2 Flex, K, DST; bench 6. Max four WR can START (2 WR + 2 Flex), not a roster cap.
- Draft slot 9; turn picks: 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149.
- K/DST not drafted by user strategy/queue fallback.
- Late QB / very late TE are preferences, not hard suppression of exceptional value.
- Geno Smith and Aaron Rodgers are hard QB exclusions for the user's path.
- Candidate lists during interactive mocks should be somewhat broad but only viable names; clearly mark favorites and alternatives.
- After a simulated draft ends, AUTO performs post-draft analysis/counterfactuals/validation; it does NOT automatically start a new mock.
- Before real draft: fresh data/rankings and backups; FantasyPros can be parallel when PC is available but own model assessment comes first.
- Change-size discipline: avoid unnecessary/high-risk large changes, especially late, but **large changes remain explicitly allowed even after 2026-08-24 when expected material benefit is supported by evidence and sufficient test/rollback time remains**. Prefer the smallest change that captures the benefit; do not reject a materially better redesign merely because it is large.