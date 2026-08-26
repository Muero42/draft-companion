# PITTI Expert-v2 — five-source weighting robustness audit (2026-08-26)

Status: RESEARCH / SHADOW ONLY. No main/gh-pages/device/runtime promotion.

## Source set
Current Half-PPR 2026 boards used:
- Draft Sharks Team, corrected v5 parser, Aug 26, 163 QB/RB/WR/TE rows, 100% source tier coverage.
- Nick Mariano / RotoBaller, Aug 25, 340 rows.
- Pat Fitzmaurice / FantasyPros, Aug 26, 296 rows.
- Dalton Del Don / FantasyPros, Aug 25, 256 rows.
- Justin Boone: current FantasyPros comparison reconstruction using the exact production `_worker.js` comparison semantics, run `32964971072`, 264 draftable rows, 210 exact comparison ranks + 54 bounded reconstructions, exact coverage 79.55%, reconstruction mean spread 6.56, max spread 14, normalized SHA-256 `fed5749c51301f62502f0086617ce0051369e29c51252714be21ebc9a4feb265`.

The Boone reconstruction reproduces every manually cross-checked rank from the user's verified Android V3 export in the checked set, including Josh Allen 34, Chase Brown 11, Brock Bowers 16, Tuten 56, Kyle Pitts 91, Josh Downs 81, Wan'Dale Robinson 109, Chris Rodriguez 121, Jalen Coker 114, Parker Washington 49, Mike Washington 124, Blake Corum 95, Waddle 31, McConkey 36, Davante Adams 56 and others. It is therefore usable as a reproducible representation of the current Boone cache; rows marked reconstructed remain reconstructed rather than falsely relabeled exact.

## Candidate weights under test
- QB: Draft Sharks 35 / Mariano 25 / Del Don 20 / Boone 10 / Pat 10.
- RB: Draft Sharks 35 / Mariano 25 / Del Don 25 / Pat 15.
- WR: Mariano 35 / Draft Sharks 30 / Pat 15 / Del Don 10 / Boone 10.
- TE: Draft Sharks 35 / Pat 30 / Del Don 25 / Boone 10.

These remain research weights, not production coefficients.

## Five-source common-universe correlation
Boone does not change the principal redundancy conclusion. Pairwise positional Spearman ranges are:
- QB: 0.951–0.992.
- RB: 0.971–0.982.
- WR: 0.934–0.979. Boone vs Draft Sharks is the least-correlated WR pair (rho ~0.934), so Boone provides some genuine WR diversity despite its low 2025 draft-accuracy prior.
- TE: 0.930–0.975.

Thus source count alone cannot justify a larger panel. Marginal decision behavior remains the relevant gate.

## Full five-source leave-one-source-out sensitivity
Largest draft-relevant examples confirm that source influence is concentrated rather than uniform:
- QB: C.J. Stroud max |LOO| ~16.2 overall-rank points; Kyler Murray ~9.5; Josh Allen ~6.3.
- RB: Jonah Coleman ~25.3; Mike Washington ~20.5; Chris Rodriguez ~19.6; Keaton Mitchell ~12.8.
- WR: Jalen Coker ~28.5; Denzel Boston ~23.8; De'Zhaun Stribling ~20.2; Wan'Dale Robinson ~19.3.
- TE: Juwan Johnson ~34.2; Hunter Henry ~27.5; Dalton Kincaid ~26.1; Isaiah Likely ~25.8.

Draft Sharks is frequently the dominant dissent source in the late RB/WR/TE cases. That is information, not automatically error, but it makes full decision-layer validation mandatory.

## Canonical natural-fixture panel swap
Canonical backup `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json`, draft `1397557585325891584`, contains 15 frozen decisions: rc4.60 at picks 9/12/29 and rc4.63 at picks 32/49/52/69/72/89/92/109/112/129/132/149. Do not relabel all 15 as rc4.63.

Selected panel-only changes under the candidate source set:
- pick 9: James Cook remains #1 v2 quality, ~8.50.
- pick 12: Justin Jefferson becomes clear panel #1 (~12.30); Bowers moves from incumbent panel 14.0 to ~17.85 and Chase Brown from ~11.47 to ~16.10.
- pick 29/32: Chris Olave remains #1; Josh Jacobs moves materially upward (~43.83 incumbent -> ~31.75 v2).
- pick 49: v2 panel slightly prefers Jaylen Waddle (~38.65) over Ladd McConkey (~39.90), reversing the incumbent Coach's Ladd preference before downstream logic.
- pick 69: Parker Washington (~61.20) remains slightly ahead of Tucker Kraft (~63.40).
- pick 89: Justin Herbert (~76.30) and Trevor Lawrence (~76.35) are effectively tied.
- pick 92: pure v2 quality strongly prefers Trevor Lawrence (~76.35) over Blake Corum (~101.90). The historical user had already drafted Herbert at 89 and chose Corum at 92. This is not evidence against the panel: it proves that rc4.64 repeat-QB marginal-utility/safety logic must be retained in the A/B and that panel-only replay cannot certify production.
- pick 109: Josh Downs (~100.50) narrowly moves ahead of Stefon Diggs (~100.95), directionally matching the historical choice.
- pick 112: pure panel still prefers Diggs; Chris Rodriguez is ~135.65. Downstream roster/Return/upside utility therefore remains decisive.
- pick 129: Jonah Coleman moves from incumbent panel ~127.67 to ~175.10; Jalen Coker from ~111.70 to ~146.55. These are material late-board changes, not rounding noise.
- pick 132/149: Coker remains materially lower under v2 (~146.55); the state-dependent late-WR/RB utility controls remain essential.

The objective is Championship Utility, not reproducing historical user choices. These differences must not be "fixed" with player-name overrides or weights chosen to match prior picks.

## Weight-precision robustness test
To determine whether the exact recovered percentages themselves require fine tuning, 5,000 zero-sum random perturbations were generated independently per position around the candidate weights.

With every source weight constrained to within +/-5 percentage points of the candidate:
- picks 9,12,29,32,49,52,69,72,92,112,129,132,149 had the same panel-only #1 in 100% of perturbations;
- pick 89: Herbert 77.84%, Lawrence 22.16%; they are a genuine tie boundary;
- pick 109: Downs 88.04%, Diggs 11.96%.

With a much wider +/-10-point perturbation:
- pick 49: Waddle 95.52%, McConkey 4.48%;
- pick 69: Parker Washington 99.72%, Tucker Kraft 0.28%;
- pick 89: Herbert 68.14%, Lawrence 31.86%;
- pick 109: Downs 75.68%, Diggs 24.32%;
- every other listed fixture retained the same panel-only #1 in 100% of runs.

### Consequence
The exact 35/25/20/10/10-style percentages are **not the main uncertainty**. Reasonable +/-5 and even +/-10 perturbations rarely alter the frozen-fixture panel leader. The material uncertainty comes from **which source family is included and how downstream Coach/Return/roster utility reacts to the changed board**, especially late in the draft.

Therefore do not waste final-week time optimizing 35 vs 32 vs 38 from this evidence. Keep the recovered rounded weights as the shadow candidate until full fixed-logic A/B. If full A/B fails, investigate source-set composition / late decision utility before micro-tuning percentages.

## Promotion boundary
Still required before any v2 promotion:
1. Replay candidate vs unchanged rc4.64 baseline with identical Coach, Return-v2, manager, roster/championship, Value-Safety and injury/research inputs except the panel.
2. Preserve rc4.64 repeat-QB/TE marginal-value safety behavior, especially natural pick 92.
3. Explicitly test deep-WR/late-WR saturation controls and reversibility (natural picks 129/132/149).
4. No hard WR cap, no player-name forcing, no PairSum/Rolling resurrection, no generic Return-v2 retune.
5. Baseline remains selectable and unchanged.
