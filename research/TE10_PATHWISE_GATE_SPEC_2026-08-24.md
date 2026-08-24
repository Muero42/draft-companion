# PITTI pathwise elite-TE opportunity-cost gate — preregistration 2026-08-24

Status: RESEARCH ONLY / PREREGISTERED DESIGN. No production mutation.

## Question
At pick 12 in the exact 10-team slot-9 league, when Bowers and a plausible RB/WR alternative are both available, does taking Bowers create more robust roster value than taking the RB/WR and obtaining the best realistic later TE?

## Required harness
For every verified current-market prefix through Dutch picks 10/11 where Bowers and >=1 realistic RB/WR frontier candidate are available:
1. clone identical RNG/opponent state;
2. branch A = force Bowers at 12;
3. branch B = force one realistic RB/WR candidate at 12;
4. continue both with identical MARKET_NEUTRAL policy and identical RNG;
5. snapshot actual available TE and RB/WR supply immediately before user picks 29,32,49,52,69,72;
6. retain full metadata-safe identities; fail closed on ambiguity.

## Evaluators kept separate
A. Selected expert/panel quality of pair and later alternatives.
B. Fresh 2026 projection/startability lens. For TE sanity, current FP anchors: Bowers 195.8, McBride 199.8, Loveland 171.9, Warren 159.7, Pitts 155.9, Fannin 151.8, Kraft 147.7, Goedert 146.7, LaPorta 145.3, Kelce 144.6 Half-PPR season points.
C. Actual path opportunity cost: best realistically obtainable later TE versus RB/WR supply at the same future picks.
D. Return/market regret: whether passed candidate returns; sequencing only after intrinsic tier.
E. Health/role uncertainty separately (not baked invisibly into replacement values).

## Invariants / anti-error gates
- Never use bottom-20%-of-position bridge replacement as the TE/RB opportunity-cost baseline.
- Never infer a hard Bowers penalty from the 57 historical Bowers states.
- Never promote Bowers because he is TE1 alone; elite positional rank is not sufficient.
- Never suppress Bowers because of the user's late-TE preference alone; preference is a tiebreaker.
- Superior faller overrides modest scarcity/timing gain.
- Tyler Warren remains health-uncertain until current dated clearance evidence.
- No PairSum-v2, no Brown-specific penalty, no scalar collapse of evaluator disagreements.

## Promotion criterion
A future production change requires held-out current-market states where a simple opportunity-cost rule improves robust path outcomes across independent lenses without deterministic concentration or material regression. Existing 57 Bowers states may be used only as mechanism/regression diagnostics, not threshold fitting.