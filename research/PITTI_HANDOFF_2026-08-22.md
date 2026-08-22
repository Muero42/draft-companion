# PITTI HANDOFF — 2026-08-22

## Source-of-truth intent
This handoff supplements the canonical project state. On continuation, read the canonical PITTI_PROJECT_STATE.md to EOF first, then this handoff and the referenced research files. Verify current GitHub/runtime artifacts before assuming a prepared version is installed on Android.

## Immediate objective
Reach trustworthy, realistic full-draft simulations soon enough to extract actionable draft strategy for the real 10-team Half-PPR Sleeper draft on 2026-08-31 (user slot 9). Simulation realism and evidence from mocks are high priority. Avoid major risky production changes as draft day approaches; after 2026-08-24 prefer necessary low-risk fixes only.

## Latest critical result: RB2_BY52 diagnosis
GitHub Actions run 32590945054 (`PITTI rc4.59 RB2 Core Diagnostic`, run #2) completed with intentional failure at the final fail-closed gate.
- Simulation step: PASS.
- Raw draft artifact persisted: artifact 9480559792 `rb2-by52-raw-drafts`.
- Core audit persisted: artifact 9480559978 `rb2-by52-core-audit`.
- Outcome-v2 correctly SKIPPED because the core audit found an invalid Coach roster.
- Exact failing Coach row: stress=`baseline`, seed=`459260006`.
- Final 15-pick position counts: QB=1, RB=6, WR=8, TE=0.
- Roster: Amon-Ra St. Brown; Chase Brown; Malik Nabers; Zay Flowers; D'Andre Swift; Jaylen Waddle; Christian Watson; Parker Washington; Justin Herbert; Rico Dowdle; Jacory Croskey-Merritt; Stefon Diggs; Rachaad White; KC Concepcion; Keaton Mitchell.
Interpretation: the previous `no legal pre-Week1 drop` was not primarily a retain13 bug. The RB2_BY52 candidate can finish a legal-length draft without any TE, so it fails starter/core feasibility before outcome evaluation. Do NOT relax retain13 to make this pass. Investigate/ensure late-draft TE feasibility in candidate policies, but do not infer that a hard early-TE rule is desirable.

## Completed rc4.59 ablation evidence
Small CRN screen, 10 seeds/regime, MARKET_ROSTER control:
- QB1_ONLY: expected-wins delta about -0.572 baseline / -0.711 stress.
- QB1_TE1: about -0.630 baseline / -0.722 stress.
- QB1_TE1_DEFER_TE69: about -0.148 baseline / -0.283 stress; large improvement but not certification-ready.
- QB1_TE1_RB2_BY52: draft simulation passed but is invalid as policy evidence because one Coach roster has TE=0; outcome intentionally not evaluated in the new diagnostic.
Key causal observation: QB1_TE1 selected Brock Bowers essentially 20/20 at pick 12; DEFER_TE69 instead selected Chase Brown 20/20 there. Evidence is against deterministic early-TE behavior, NOT proof that Bowers/elite TE is intrinsically bad.
QB cap fixes redundant QB accumulation but QB1_ONLY remains clearly inferior, so QB overdrafting is only one defect.

## Elite-TE next path
Research plan exists at `research/ELITE_TE_OPPORTUNITY_COST_GATE_PLAN_2026-08-22.md`.
Do NOT promote DEFER_TE69 as production rule. Preferred candidate is a dynamic elite-TE opportunity-cost / Return-v2 gate or soft penalty:
- early elite TE remains available when its marginal value exceeds the expected value lost by passing the best RB/WR until the return pick;
- use existing Coach score + Return-v2 + slot-9 next-pick geometry + roster opportunity cost;
- personal Late-TE preference is context/tiebreaker, not hard suppression;
- preregister small CRN research variants, select simple robust rule, then fresh held-out certification seeds.
Also diagnose the remaining deficit after the 2.02 correction rather than stacking positional hard rules.

## Realistic simulation validation matrix
Research spec: `research/REALISTIC_MOCK_VALIDATION_MATRIX_2026-08-22.md` (commit 152d515d16967f59e887296f1a49dbc48258df1b).
Required ladder: small causal CRN screen -> simple candidate -> fresh held-out larger certification -> full realistic mock matrix -> pick-level sanity review -> production integration.
Persist raw simulation before downstream evaluators; persist legality/core audit separately. Downstream failures must never destroy expensive simulation evidence.

## Opponent draft-mode semantics (important user correction)
Every opponent defaults to MANUAL whenever there is no current contrary information. Do NOT probabilistically mix autodraft into the baseline merely because an interruption is possible.
- User can report shortly before/during draft which Sleeper managers show AUTODRAFT.
- Switch those managers prospectively to AUTODRAFT immediately.
- If a manager later drafts manually / user reports manual, switch future picks back to MANUAL.
- UNKNOWN exists only for genuinely conflicting/transition evidence; it is not the default.
- AUTODRAFT or unresolved UNKNOWN picks must never train the manager's personal manual profile.
Realistic simulation should separately stress-test one/multiple autodrafter and mid-draft switches using Sleeper-2026 calibrated autodraft behavior.

### 2026-08-22 official Sleeper grounding added
Parallel realism research verified current official Sleeper support behavior and updated `research/UNIVERSAL_AUTODRAFT_STATE_MODEL_2026-08-22.md` at commit `31caa0079a282c405e7998b1fd9e26e62f6ecf84`.
- CPU auto-pick uses the team's ordered Draft Queue when available.
- Drafted players are removed from the queue automatically.
- When the queue is empty, CPU falls back to a higher-ranked available player while considering roster needs.
- Sleeper still has no supported custom pre-draft-ranking upload; the league-specific Draft Queue is the supported workaround.
Model consequence: AUTODRAFT is now explicitly a two-stage latent policy `QUEUE_IF_AVAILABLE -> SLEEPER_RANK_PLUS_ROSTER_NEED`, not pure ADP/rank sampling. Opponent private queues are normally unobserved and therefore belong in sensitivity analysis, not personal-manager learning. Baseline remains MANUAL absent current contrary evidence.

## AUTO operating rule
On every AUTO block maintain two queues:
1. serial critical path;
2. independent parallel work.
Automatically ask what useful work can proceed in parallel and execute it when it cannot contaminate the critical path. Do not merely poll/wait while useful independent work exists. Diagnose failures before retrying; do not repeat failed approaches without new evidence.

## Current GitHub research infrastructure
Repository: Muero42/draft-companion.
Main research branch used for specs: `pitti-outcome-bridge-20250821`.
RB2 diagnostic probe branch: `pitti-rb2-core-diagnostic-probe`, diagnostic head SHA `46a605fbb1c4f6ee9aee8e70e3789722992fb4da`.
Fresh Draft PR #3 was used to trigger the isolated diagnostic.
The diagnostic workflow intentionally uploads raw output before evaluator/core failure.

## Immediate next actions (ordered)
1. Treat RB2_BY52 as invalid in its current form; use the persisted raw/core evidence to determine why late TE feasibility was not guaranteed and design a generic final-roster feasibility safeguard rather than an early hard-TE mandate.
2. Build the small research harness for the preregistered dynamic elite-TE variants (`TE_RETURN_GATE`, `TE_SOFT_PENALTY`, optional tightly localized PICK12 gate if diagnostics justify it) using existing Return-v2/scoring ingredients and identical CRN controls.
3. Pick-level diagnose QB1_TE1_DEFER_TE69 after 2.02 to locate the remaining baseline/stress deficit (turns 3.09/4.02 onward, RB/WR allocation, TE timing, bench construction).
4. Implement/test the universal MANUAL/AUTODRAFT state machine using the now-verified queue-first -> rank+roster-need semantics; keep it independent of the Coach-policy critical path.
5. Once a simple Coach candidate passes small screen + legality, run fresh held-out certification, then realistic full mocks. Do not calibrate from one illustrative mock.
6. Prepare slot-9 turn maps / TAKE-WAIT opportunity-cost outputs and deep Sleeper Queue fallback before the real draft; K/DST omitted, QB2/TE2 deprioritized.

## Hard user/project constraints to preserve
- League: 10 teams, Half-PPR; QB, 2 WR, RB, TE, 2 Flex, K, DST; bench 6. Max four WR can START (2 WR + 2 Flex), not a roster cap.
- Draft slot 9; turn picks: 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149.
- K/DST not drafted by user strategy/queue fallback.
- Late QB / very late TE are preferences, not hard suppression of exceptional value.
- Geno Smith and Aaron Rodgers are hard QB exclusions for the user's path.
- Candidate lists during interactive mocks should be somewhat broad but only viable names; clearly mark favorites and alternatives.
- After a simulated draft ends, AUTO performs post-draft analysis/counterfactuals/validation; it does NOT automatically start a new mock.
- Before real draft: fresh data/rankings and backups; FantasyPros can be parallel when PC is available but own model assessment comes first.
- Freeze discipline: focus on testing/fine-tuning; by 2026-08-24 avoid major changes unless necessary and low-risk.
