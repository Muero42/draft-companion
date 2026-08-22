# Realistic mock validation matrix — 2026-08-22

Status: research specification; no production behavior changed.

## Objective
Use realistic full-draft simulation as the primary evidence loop for Draft Companion decisions, while separating opponent realism, Coach policy quality, and outcome evaluation so defects in one layer cannot masquerade as improvements in another.

## Default opponent state
- Every manager defaults to MANUAL when there is no current contrary evidence.
- AUTODRAFT is activated only from explicit current Sleeper/user evidence.
- UNKNOWN is reserved for genuinely conflicting transition evidence; it is not a baseline probability mixture.
- Picks made under AUTODRAFT or unresolved UNKNOWN must not train the manager-specific manual profile.

## Scenario families
A. Baseline manual: all nine opponents MANUAL.
B. Single-autodrafter stress: each opponent independently placed into AUTODRAFT for the full draft, one at a time.
C. Multi-autodrafter stress: representative 2- and 3-manager combinations, sampled rather than exhaustive unless evidence warrants expansion.
D. Mid-draft switches: MANUAL→AUTODRAFT and AUTODRAFT→MANUAL at representative turn boundaries. Mode changes affect subsequent picks only.
E. Profile uncertainty: manual manager tendencies shrunk toward market behavior according to evidence strength; no invented deterministic tendencies.

## Opponent pick kernel requirements
- Sequential roster state and legal roster construction.
- Sleeper-2026 market/ADP information as the base prior.
- Manager-specific deviations only when supported by historical/manual evidence.
- Current injuries, role/depth-chart evidence and updated rankings feed the same player universe used by Coach.
- Autodraft kernel calibrated from observed Sleeper-2026 autodraft behavior/mocks, not NFL.com ordering.
- Common random numbers for policy comparisons.

## Coach-policy evaluation
For every candidate policy report at minimum:
- expected wins / playoff-equivalent outcome versus MARKET_ROSTER control;
- paired deltas and confidence intervals by baseline and stress regime;
- pick distributions at slot-9 turn picks (9,12,29,32,49,52,69,72,89,92,109,112,129,132,149);
- roster composition after each turn and final roster;
- return probability / opportunity cost for materially different picks;
- frequency of hard/soft policy gates firing;
- failure/invalid-roster rate (must be zero for production eligibility).

## Current preregistered policy questions
1. QB: cap redundant QB accumulation while preserving exceptional QB1 value; personal Late-QB preference is a tiebreaker, not hard suppression.
2. Elite TE: replace deterministic early-TE behavior with a Return-v2/opportunity-cost gate. DEFER_TE69 is a causal anchor only, not a production rule.
3. RB foundation: diagnose RB2_BY52 separately; do not infer policy value until raw roster/core validity and outcome evaluation both pass.
4. WR/RB turn allocation: identify remaining expected-win deficit after QB/TE defects are removed before introducing further positional rules.
5. Late rounds: retain upside/league-winner emphasis and avoid K/DST; test whether this remains beneficial under outcome-v2 rather than assuming it.

## Validation ladder
1. Small CRN research screen for causal direction.
2. Select the simplest robust candidate; do not tune on certification seeds.
3. Fresh held-out larger certification against MARKET_ROSTER in baseline + stress.
4. Full realistic mock matrix including autodraft/switch scenarios.
5. Pick-level sanity review for user slot 9 and known league tendencies.
6. Only then production integration; after 2026-08-24 prefer only necessary, low-risk changes.

## Data-integrity requirements
- Persist raw draft output before downstream evaluators.
- Persist core/legality audit separately.
- A downstream evaluator failure must never destroy simulation evidence.
- Record code/ref, seeds, player-universe fingerprint and policy parameters with every artifact.
- Autodraft picks are excluded from manual manager-profile learning.

## Interpretation guardrails
- A single mock is illustrative, not calibration evidence.
- A policy that wins only because an opponent model is unrealistic is rejected.
- A hard positional rule requires stronger evidence than a dynamic opportunity-cost adjustment.
- User preferences can break close ties but should not override a materially superior expected-value option without surfacing the tradeoff.
