# Joint next-own-pick v1 result audit — 2026-08-22

## Verdict
**Board-state simulator: useful / parity-supported. Candidate decision rule: REJECTED. No holdout, no production promotion.**

Actions run `32598923886` completed successfully for CONTROL / JOINT_LONG2 / JOINT_EARLY4. Smoke and all implementation invariants passed. Outcome-v2 correctly remained `FAIL_CLOSED` for formal certification because this causal screen has only 5 runs/regime (<50 required).

## Independent outcome diagnostics (n=5/regime; NOT certification)
Against MARKET_ROSTER under MARKET_VALUE_DROP:
- CONTROL: baseline about **-0.685**, stress **-0.712** expected wins / 14w.
- JOINT_LONG2: baseline **-0.327**, stress **-0.494**.
- JOINT_EARLY4: baseline **-0.474**, stress **-0.300**.

These directional improvements are not sufficient for advancement because the policy aggregation itself fails pick-plausibility / scale sanity.

## What the joint simulator got right
The new nested simulator no longer uses current-top-five marginal fallback for future boards. It forces candidate A, removes A, sequentially simulates every intervening opponent pick and evaluates the full board at the actual next user pick.

The preregistered external 9->12 parity control is encouraging. Mean expected-best-next selected-panel rank across JOINT_EARLY4 parent states was approximately:
- James Cook III **11.883** vs pre-existing rc4.59 turn reference **11.89**;
- Chase Brown **11.672** vs reference **11.75**;
- Ashton Jeanty **11.489** vs reference **11.44**;
- Amon-Ra St. Brown **11.647** vs reference **11.78**;
- Jonathan Taylor observed state **11.905** vs reference **11.78**.

Given only 120 nested rollouts/state and different parent-state mixtures, this is broadly consistent. The **joint board generator itself is therefore worth retaining**.

## Why the v1 decision rule fails
The preregistered rule was:
`z(canonical current normalized Coach score) + z(-expected best-next selected-panel rank)`.

This standardizes the *cross-candidate spread* of the future term to unit variance regardless of its absolute magnitude. Consequently a tiny or practically meaningless future-board difference can receive the same nominal weight as a very large current-quality difference.

### Long-gap pick 12 evidence
Across 10 JOINT_LONG2 Coach states at pick 12, the full range between the five candidates' expected-best-next panel ranks averaged only **0.0319 ranks** (min 0.001; max 0.069). Yet the z transform expands that microscopic range to roughly the same scale as current Coach score differences and overrode the canonical Bowers choice in 4/10 states.

Example baseline seed 459260001:
- future expected-best ranks: Jefferson 25.100, Brown 25.114, Bowers 25.127, Walker 25.114, CeeDee 25.114;
- only **0.027 ranks** total future spread;
- nevertheless z-scaling allowed Jefferson/Brown to compete with a current-score range of 5 points.

That is not defensible opportunity-cost measurement; it is amplification of nested Monte-Carlo/state noise.

### Pick 9 red flag
JOINT_EARLY4 selected **Brock Bowers at 1.09 in 4/10 drafts**, despite canonical current Coach winners being Amon-Ra or James Cook in those states.

Example baseline seed 459260000:
- Amon-Ra current Coach score 100, panel 5.839, expected next rank 11.905;
- Bowers current score 51, panel 14.0, expected next rank 11.248.
The z rule transformed Bowers' ~0.66-rank better follow-up board into enough utility to overcome a 49-point current Coach-score gap and >8 selected-panel-rank current-quality gap. That is a direct `QUALITY_TIMING_DOMINANCE` / scale failure, not a rational 1.09 TE discovery.

## Behavioral summary
CONTROL first six picks across 10 drafts:
- 1.09: Cook 6 / Amon-Ra 4;
- 2.02: Bowers 10;
- 3.09: Olave 8 / Pickens 2;
- 4.02: Flowers 9 / Olave 1.

JOINT_LONG2:
- 1.09 unchanged: Cook 6 / Amon-Ra 4;
- 2.02: Bowers 6 / Jefferson 2 / Brown 2;
- 3.09: Olave 7 / Pickens 2 / Nabers 1;
- 4.02: DeVonta 6 plus scattered alternatives.

JOINT_EARLY4:
- 1.09: Bowers 4 / Cook 3 / Amon-Ra 3 — unacceptable sequencing artifact;
- 2.02: Bowers 4 / Brown 3 / Cook 1 / Walker 1 / Jefferson 1;
- later choices also become highly sensitive to equal-weight z aggregation.

## Method decision
Do NOT tune the z weights or add an ad-hoc reach penalty on these same seeds. The failure is dimensional: current and future terms were normalized separately instead of compared on a common interpretable scale.

Retain the validated joint board-state generator. The next experiment, if run, must:
1. use fresh outer seeds;
2. keep canonical admissibility/frontier and all immutability/order/legal invariants;
3. compare current and future player quality in the **same units**, with no within-state z amplification;
4. apply next-pick roster legality (especially QB1/TE1 cap) when selecting the future player;
5. remain research-only and require plausibility before outcome interpretation.

A natural non-parametric candidate is selected-panel **two-pick package rank sum** within the canonical quality-safe frontier: `panel_rank(A) + E[best legal selected-panel rank at next own pick]`. Overall selected-panel rank already embeds positional scarcity/value and gives current/future quality the same unit. This candidate must be preregistered and tested only on fresh seeds; it is not inferred as successful from the v1 outcome deltas.
