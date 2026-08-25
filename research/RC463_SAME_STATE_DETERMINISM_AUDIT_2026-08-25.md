# rc4.63 same-state recommendation determinism audit — 2026-08-25

Research-only audit; no production mutation.

## Question
Does the Companion randomly choose between candidates for an identical draft state, or does randomness only create alternative simulated opponent trajectories?

## Source-path result
Current rc4.63 `simulateReturnV2()` uses an explicit deterministic PRNG:
- `seededRng(seed)` is a deterministic integer-state generator.
- `seedBase` is derived from `current`, `next`, and `stress` (plus a fixed constant in the current path).
- Each Monte Carlo run uses `seededRng(seedBase + run*2654435761)`.
- Candidate weights/pool/rosters depend on the supplied draft state, but there is no unseeded recommendation-choice RNG in the final Coach sort.
- Final Coach ordering is deterministic sort by normalized Coach score, then raw score, then panel rank.

The `Math.random()` occurrences in current app source are used for fetch cache-busters, research-event IDs, or as a default for generic `weightedChoice`; Return-v2 passes its seeded RNG explicitly into simulated opponent choices.

## Consequence
For an identical input state (same current/next picks, same available board, same rosters/picks, same panel/ADP/evidence/manager settings and stress mode), Return-v2 and the resulting Coach recommendation are deterministic. A repeated identical state should therefore produce the same candidate ordering. Differences such as “Mitchell in 7/10 drafts, Coker in 3/10” must come from different simulated draft states/availability/rosters, not a 70/30 recommendation lottery.

## Regression invariant
Any rc4.64+ candidate must preserve this property. A policy challenger may change deterministic decision priority from the baseline, but it must not introduce RNG into the final recommendation selector. Same-state replay should be byte-/ordering-stable apart from explicitly time-varying external evidence inputs.

Source baseline: GitHub main promotion commit `a106b39dcf72fed6e0ac151382bc9ba19316fdb6`, `app.js`.
