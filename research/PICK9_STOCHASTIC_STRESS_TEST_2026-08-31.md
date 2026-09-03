# PITTI PICK-9 STOCHASTIC STRESS TEST — 2026-08-31

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

## Scope / source
Actual simulation run performed against canonical backup `draft-companion-v7-backup-2026-08-31T09-21-02-891Z.json` (10-team Half-PPR, slot 9, active v4 positional panels, Sleeper ADP in backup). 6 stress environments × 1,000 runs = **6,000 simulated drafts**.

This is a decision-support stress harness, not a replay of the production Coach/Return-v2 engine. Opponents are stochastic ADP-driven; stress environments shift RB, WR, QB/TE demand or room variance. User selections use v4 overall panel rank plus the sealed strategic constraints (one QB, Geno/Rodgers excluded, late QB/TE, RB/WR roster utility). Therefore results identify portfolio fragility/robustness; they do NOT replace live Return-v2 probabilities.

## Stress environments
- baseline: ADP with realistic stochastic deviation
- RB run: RB demand shifted ~10 picks earlier
- WR run: WR demand shifted ~10 picks earlier
- QB/TE run: QB/TE demand shifted ~13 picks earlier
- autodraft-heavy: near-default ADP ordering / low variance
- chaos: high room variance

## Structural results
Average final roster position counts:
- baseline: RB 5.84 / WR 6.66 / QB 1.00 / TE 1.50
- RB run: RB 4.72 / WR 7.37 / QB 1.00 / TE 1.91
- WR run: RB 7.24 / WR 4.87 / QB 1.00 / TE 1.89
- QB/TE run: RB 6.11 / WR 6.87 / QB 1.00 / TE 1.02
- autodraft-heavy: RB 6.33 / WR 6.65 / QB 1.00 / TE 1.01
- chaos: RB 5.89 / WR 6.54 / QB 1.00 / TE 1.57

The simplified harness can draft TE2 and therefore its final TE counts are diagnostic only; production PITTI remains authority. The key fragility signal is the **RB-run environment**: 38% of simulations finished below five RB and 36% reached eight-plus WR. This does not justify a hard cap, but it validates the existing concern that a real-draft RB run should raise the opportunity cost of repeated WR selections.

## Turn / QB timing
Baseline first QB: pick 89 in 45.8%, pick 92 in 37.3%, pick 109 in 10.2%. Autodraft-heavy: pick 89 in 76.1%. QB/TE run shifts some QB acquisition later because the preferred tier can disappear; production live board must control. Overall, the one-QB late-QB strategy survives all six environments without needing QB2.

## Opening-pair adaptation
Baseline: RB/WR 37%, WR/WR 24%, RB/RB 22%, WR/RB 18%.
RB run: WR/WR 60%, RB/WR 24%, WR/RB 14%, RB/RB 3%.
WR run: RB/RB 68%, RB/WR 22%, WR/RB 8%, WR/WR 3%.
This is desirable anti-fragility: take falling value rather than mechanically forcing the position being run. However, the RB-run end-roster result shows that the later rounds must then actively exploit remaining upside RBs rather than continuing to accumulate WR depth.

## Correct five-WR availability stress
Canonical set: DeVonta Smith / Zay Flowers / Emeka Egbuka / Tetairoa McMillan / Jaylen Waddle.

Estimated availability from the stochastic room model:
- baseline pick 29: Waddle 98%, Flowers 96%, Egbuka 94%, McMillan 82%, Smith 75%
- baseline pick 32: Waddle 97%, Flowers 94%, Egbuka 89%, McMillan 75%, Smith 62%
- baseline pick 49: Waddle 40%, Flowers 20%, Egbuka 19%, McMillan 4%, Smith 2%
- baseline pick 52: Waddle 18%, Egbuka 6%, McMillan 2%, Flowers 1%, Smith ~0%

WR-run is harsher: at pick 49 Waddle 21%, Egbuka 8%, Flowers 5%, McMillan 1%, Smith ~0. RB-run is softer: pick 49 Waddle 60%, Flowers 38%, Egbuka 32%, McMillan 15%, Smith 8%.

Implication: **McMillan/Smith should not be treated as plausible pick-49 returns if deliberately passed at 29/32.** Flowers/Egbuka are also usually gone by 49. Waddle is the only one of the five with meaningful baseline pick-49 survival, but even that is only ~40% in this independent stress model. This strengthens the live Return-v2/turn-portfolio requirement and supports a justified McMillan reach when he is the preferred ceiling player and the live loss-if-gone is high.

## Decision rules from stress
1. Do not hard-force RB in an early RB run; exploit falling WR value at 9/12, then consciously repair RB depth with upside profiles later.
2. Do not hard-force WR in an early WR run; falling RB value at 9/12 is robust.
3. At 29/32, treat the five-WR cluster as a **decision window**, not as players expected to return at 49. Use live PITTI Return-v2 for exact sequencing.
4. McMillan remains the strongest ceiling/reach candidate among the five; the simulation specifically supports avoiding a casual “wait to 49” assumption.
5. One-QB late-QB remains robust. No QB2.
6. No production retune from this simulation. rc4.157 stays frozen.

## Limitations
Opponent selections are simulated from backup Sleeper ADP plus controlled noise/demand shocks, not the exact nine manager models. The stress harness deliberately tests extremes; percentages are scenario diagnostics, not calibrated real-draft probabilities. Exact real-draft choices remain driven by frozen rc4.157, live manager modes, Return-v2 and actual available board.
