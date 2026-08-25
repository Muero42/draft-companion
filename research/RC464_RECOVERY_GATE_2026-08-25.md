# rc4.64 Recovery Gate — 2026-08-25

## Why this branch exists
The last natural phone mock already ran on Android-verified rc4.63. Synthetic full-roster optimization subsequently exposed an invalid evaluation target: the production-like Full-Safety simulation averaged 3.108 QB, 3.883 RB, 6.450 WR, 1.558 TE over 120 drafts. That roster construction is not an acceptable optimization target for Tim's 10-team, 1-QB, Half-PPR league. Therefore no synthetic Championship-Utility result may promote a production change by itself.

## Frozen baseline
Base commit: a106b39dcf72fed6e0ac151382bc9ba19316fdb6 (Android-verified rc4.63 code line).
No PairSum, Rolling, threshold-family, global position cap, player-name forcing, or late-WR quota is allowed back into production.

## Recovery objective
Produce the smallest rc4.64 candidate that corrects demonstrated natural-mock decision defects while preserving rc4.63 behavior at clean decision points.

## Roster-construction invariant
This is an admissibility/tie-breaking policy, NOT a target position-count quota:
- QB1 normal.
- QB2 only for an objectively exceptional value/slide case; QB3 must never be a normal recommendation.
- TE1 normal. TE2 only for objectively exceptional value/slide or a separately justified flex/value case; TE3 must never be a normal recommendation.
- K/DST remain omitted from the user's draft targets.
- Remaining bench capital should normally compete among RB/WR upside/value; there is no WR roster cap.
- User league starter limits must never be misread as roster caps.

## Causal finding in rc4.63
`rosterState()` already penalizes a second QB/TE strongly after the first starter is owned (QB roughly -24 before pick 121; TE roughly -22 before pick 121). The later `applyPlayerQualitySafetyGate()` is position-agnostic and can overwrite the natural leader by promoting a player from the best overall panel-quality band. Therefore a repeated QB/TE can be resurrected after roster need already demoted it. The recovery must fix this interaction, not stack another generic QB/TE score penalty.

## Required fixture behavior before any package exists
1. Natural rc4.63 failure fixture(s), including the reproduced Pick-92 case, must change in the intended direction.
2. First-QB and first-TE controls must remain unchanged.
3. Natural repeated-position winner controls must remain unchanged when the repeated QB/TE wins without Safety resurrection.
4. Exceptional-slide control must remain available; recovery may not become a global QB2/TE2 ban.
5. Clean non-QB/TE decision fixtures from the natural mock must remain unchanged unless independently justified.
6. Geno Smith and Aaron Rodgers remain hard-excluded from the user QB path.
7. Return-v2 remains active and is not duplicated with a second generic reach penalty.
8. Mock/LIVE parity, snapshot fingerprint/duplicate handling, canonical 2026/10-team/15-round/slot-9 LIVE guard, runtime syntax, version/cache and package-integrity gates must all pass.

## Promotion hierarchy
Natural decision fixtures > deterministic mechanism controls > prospective natural Sleeper mock > synthetic full-roster distribution/utility.
Synthetic utility is diagnostic only until its roster-construction validity is repaired and independently validated.

## Stop rule
Do not search a family of numeric penalties. If a narrow causal Safety/admissibility repair cannot satisfy the fixture controls without broad behavior changes, retain rc4.63 and handle the known edge case explicitly in live decision review rather than destabilizing production six days before the draft.
