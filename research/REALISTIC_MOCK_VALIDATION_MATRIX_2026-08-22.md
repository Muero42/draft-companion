# Realistic mock validation matrix — 2026-08-22

Status: research specification; no production behavior changed.

## Objective
Use realistic full-draft simulation as the primary evidence loop for Draft Companion decisions, while separating opponent realism, Coach policy quality, player-evidence uncertainty and outcome evaluation so defects in one layer cannot masquerade as improvements in another.

## Default opponent state
- Every manager defaults to MANUAL when there is no current contrary evidence.
- AUTODRAFT is activated only from explicit current Sleeper/user evidence.
- UNKNOWN is reserved for genuinely conflicting transition evidence; it is not a baseline probability mixture.
- Picks made under AUTODRAFT or unresolved UNKNOWN must not train the manager-specific manual profile.
- Because actual autodraft is low probability, detailed autodraft calibration remains secondary; the matrix includes it as stress, not as a reason to delay higher-EV policy work.

## Scenario families
A. Baseline manual: all nine opponents MANUAL.
B. Single-autodrafter stress: each opponent independently placed into AUTODRAFT for the full draft, one at a time.
C. Multi-autodrafter stress: representative 2- and 3-manager combinations, sampled rather than exhaustive unless evidence warrants expansion.
D. Mid-draft switches: MANUAL→AUTODRAFT and AUTODRAFT→MANUAL at representative turn boundaries. Mode changes affect subsequent picks only.
E. Profile uncertainty: manual manager tendencies shrunk toward market behavior according to evidence strength; no invented deterministic tendencies.
F. Player-evidence states: small preregistered scenarios for unresolved material health/role gates (for example contact clearance / limited workload / normal workload). Do not invent generic injury penalties.
G. Market perturbation: plausible ADP/ranking drift and position-run shocks, including unexpected value falls. These are stress cases, not parameter-fitting targets.

## Opponent pick kernel requirements
- Sequential roster state and legal roster construction.
- Sleeper-2026 market/ADP information as the base prior.
- Manager-specific deviations only when supported by historical/manual evidence.
- Current injuries, role/depth-chart evidence and updated rankings feed the same player universe used by Coach.
- Autodraft kernel uses verified Sleeper semantics: private queue if available; otherwise higher-ranked available player plus roster need. Unknown private queues belong in sensitivity, not manager learning.
- Common random numbers for policy comparisons.

## Coach-policy evaluation
For every candidate policy report at minimum:
- expected wins / playoff-equivalent outcome versus MARKET_ROSTER control;
- paired deltas and confidence intervals by baseline and stress regime;
- pick distributions at slot-9 picks (9,12,29,32,49,52,69,72,89,92,109,112,129,132,149);
- roster composition after each turn and final roster;
- return probability / opportunity cost for materially different picks;
- explicit next-own-pick gap (9->12, 12->29, etc.) for TAKE/WAIT decisions;
- frequency of policy gates/lookahead overrides;
- failure/invalid-roster rate (must be zero for production eligibility).

## Current policy questions
1. Rolling opportunity cost: the failed turn-start pair probe showed that 9->12 lookahead alone can move 1.09 while leaving 2.02 structurally wrong. Test next-own-pick opportunity cost, especially long exits 12->29, 32->49, 52->69, without positional quotas.
2. QB: cap redundant QB accumulation while preserving exceptional QB1 value; personal Late-QB preference is a tiebreaker, not hard suppression.
3. Elite TE: deterministic Bowers-at-2.02 behavior must be tested against realistic later TE replacement distributions, not solved by a hard Late-TE rule. DEFER_TE69 remains a diagnostic anchor only.
4. RB/WR allocation: identify whether the Coach's remaining deficit comes from true player-value errors, temporal opportunity cost or roster-depth valuation before adding any positional rule.
5. Late rounds: test managed-redraft asymmetric upside (ceiling, role probability, time-to-information, drop flexibility, waiver replacement) rather than importing Best Ball portfolio heuristics.

## Shallow-league / managed-redraft requirement
The current outcome-v2 bottom-20%-tail replacement proxy is retained as an independent conservative anchor but is not sufficient by itself for a 10-team shallow league.

Every new full-draft artifact MUST additionally persist:
- final available skill-player IDs after pick 150;
- enough league-wide ownership/pick information to reconstruct the available pool;
- the two user players released by each preregistered 15->13 retain rule when outcome is evaluated.

This enables the separately preregistered `SHALLOW_LEAGUE_REPLACEMENT_CHALLENGER_PLAN_2026-08-22.md`: empirical best-free-agent distributions with conservative FAAB acquisition haircuts. Candidate conclusions must be reported under both the existing conservative evaluator and the shallow-league challenger; replacement sensitivity must not be used to tune draft decisions on the same seeds.

## Validation ladder
1. Small CRN research screen for causal direction.
2. Select the simplest robust candidate; do not tune on the same outcome seeds.
3. Freeze the exact candidate and run fresh held-out larger certification against MARKET_ROSTER in baseline + stress.
4. If policy uses marginal Return-v2 approximations for multi-player future states, validate against joint-state simulation or conservative dependence bounds.
5. Full realistic mock matrix including opponent-mode, market and player-evidence stress scenarios.
6. Re-score frozen drafts under both conservative outcome-v2 and shallow-league replacement challenger.
7. Pick-level sanity review / TAKE-WAIT map for user slot 9 and known league tendencies.
8. Only then production integration.

There is NO hard 2026-08-24 ban on large changes. Prefer the smallest change that captures the benefit, but a larger redesign remains allowed and desirable after that date if evidence indicates material Championship-Utility gain and enough time remains for test, verification and rollback.

## Data-integrity requirements
- Persist raw draft output before downstream evaluators.
- Persist core/legality audit separately.
- A downstream evaluator failure must never destroy simulation evidence.
- Record code/ref, seeds, player-universe fingerprint and policy parameters with every artifact.
- Persist final available/free-agent pool as described above.
- Autodraft picks are excluded from manual manager-profile learning.
- Player-evidence scenario definitions are dated and frozen before policy comparison.

## Interpretation guardrails
- A single mock is illustrative, not calibration evidence.
- A policy that wins only because an opponent model is unrealistic is rejected.
- A hard positional rule requires stronger evidence than a dynamic opportunity-cost adjustment.
- User preferences can break close ties but should not override a materially superior expected-value option without surfacing the tradeoff.
- No candidate is promoted because it matches a fashionable roster-construction label (Hero RB, Zero RB, Robust RB, Late TE, etc.).
- No outcome layer may feed policy tuning on the same seeds after the fact.
