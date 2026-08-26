# PITTI Expert-v2 — exact Return-v2 rerun gate (2026-08-26)

Status: RESEARCH / SHADOW ONLY / FAIL-CLOSED. No main, gh-pages, device, or production mutation authorized.

## Why this gate exists
The fixed-input intermediate A/B established useful falsification evidence but did not rerun Return-v2 end-to-end after panel substitution. Because selected-panel / market-relative inputs can affect Return and downstream decision utility, frozen Return outputs cannot certify Expert-v2.

## Two-axis design
Do not conflate expert-panel quality with decision-surface quality.

Axis A — panel arm:
- A0: unchanged rc4.64 incumbent selectable expert configuration.
- A1: frozen Expert-v2 candidate source set/weights.

Axis B — decision surface:
- B0: unchanged current rc4.64 marginal-roster / Championship-Utility semantics.
- B1: any future challenger must be independently preregistered and validated before use; it must be applied identically to A0 and A1. It may not be tuned to make Expert-v2 pass.

The first certification comparison is A0/B0 vs A1/B0 only.

## Exact rerun contract
For each canonical frozen pre-decision state, clone the same raw state into both arms and recompute from raw inputs:
1. selected-panel ranks;
2. every panel-dependent board/market/value-safety input;
3. Return-v2, including next-pick/joint-lookahead outputs and deterministic RNG streams;
4. board-relative Return context/medians;
5. marginal-roster / Championship-Utility adjustments;
6. final candidate ordering and winner.

Never reuse a treatment-contaminated incumbent coachScore, Return adjustment, board median, or panel-dependent cache.

## Fail-closed invariants
Persist and compare fingerprints for all non-panel inputs: available-player set, roster, pick geometry, Sleeper market/ADP, manager state, injury/research state, opponent state, non-panel coefficients, utility semantics, and deterministic RNG seeds/streams. Any unintended mismatch invalidates the affected comparison.

The outer opponent RNG and nested Return-v2/joint-lookahead RNG must remain disjoint. Same state + same arm + same seed must reproduce byte-identical Return outputs and candidate ordering.

## Mandatory natural controls
- Pick 89: QB1 remains legal.
- Pick 92: with QB1 filled, ordinary QB2 must clear the existing state-dependent marginal-value/opportunity-cost hurdle; do not blacklist a player or position.
- Picks 112/129/132/149: deep-WR diminishing marginal utility and late-RB optionality/saturation remain state-dependent. No hard WR cap, fixed positional quota, or blind RB accumulation.
- Exceptional QB/TE slides remain legal.
- Historical user choices are evidence, not supervised labels.

## Promotion rule
Expert-v2 remains additive/selectable SHADOW until A1/B0 passes exact end-to-end parity/invariant checks and shows no material regression on natural controls. Changed leaders require a defensible Championship-Utility / opportunity-cost rationale, not merely a better expert rank.

If exact rerun exposes a decision-surface weakness shared by both panel arms, diagnose it as a separate B-axis research problem. Do not alter B0 inside the Expert-v2 certification loop.

## Current recovered candidate panel (frozen pending exact rerun)
- QB: Draft Sharks 35 / Nick Mariano 25 / Dalton Del Don 20 / Justin Boone 10 / Pat Fitzmaurice 10.
- RB: Draft Sharks 35 / Nick Mariano 25 / Dalton Del Don 25 / Pat Fitzmaurice 15.
- WR: Nick Mariano 35 / Draft Sharks 30 / Pat Fitzmaurice 15 / Dalton Del Don 10 / Justin Boone 10.
- TE: Draft Sharks 35 / Pat Fitzmaurice 30 / Dalton Del Don 25 / Justin Boone 10.

Justin Boone reconstructed-rank discount remains explicit. Koerner remains excluded for this draft because the relevant ranking input is paywalled.

## Engineering next step
Implement a research-only extracted/browserless harness from current rc4.64 source with explicit panel dependency injection and exact Return-v2 execution. First reproduce A0/B0 deterministically; only after control parity passes run A1/B0. Stop on parity failure and diagnose rather than tuning weights.