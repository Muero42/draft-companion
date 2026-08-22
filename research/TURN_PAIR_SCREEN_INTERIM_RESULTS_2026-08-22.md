# Turn-Pair Screen — interim results 2026-08-22

Run: GitHub Actions 32596679736. CONTROL was still running at this checkpoint; PAIR_FIRST and PAIR_FIRST_TWO both completed successfully, including the roster/bye-aware outcome evaluator. These two candidate arms are already sufficient to reject promotion because both remain clearly dominated by the independent MARKET_ROSTER baseline and both are materially worse than the earlier DEFER_TE69 diagnostic anchor.

## Outcomes vs MARKET_ROSTER
PAIR_FIRST:
- baseline: -0.50985 expected wins over 14 weeks; 95% CI [-0.68120, -0.33849]
- stress: -0.70152; 95% CI [-0.85689, -0.54614]

PAIR_FIRST_TWO:
- baseline: -0.47045; 95% CI [-0.69000, -0.25091]
- stress: -0.67121; 95% CI [-0.87790, -0.46452]

Both drop-rule sensitivities (MARKET_VALUE_DROP and LAST_TWO_DROP) produced the same primary MARKET_ROSTER deltas in these arms. The evaluator marks both arms COACH_DOMINATED_95. The small-screen gate itself reports FAIL_CLOSED because 10 seeds/regime is intentionally below the certification minimum; regardless, the negative CIs already rule out advancement.

Reference diagnostic anchor from the completed prior screen: DEFER_TE69 approximately -0.148 baseline / -0.283 stress vs MARKET_ROSTER. Therefore neither turn-pair candidate is competitive with the diagnostic anchor and neither goes to holdout.

## Pick behavior diagnosis
PAIR_FIRST selected Chase Brown at 1.09 in all 20 Coach drafts. At 2.02 it still selected Brock Bowers 18/20, with James Cook III 2/20. Typical first-turn construction therefore became RB+TE rather than fixing the actual opportunity-cost problem at the second pick.

PAIR_FIRST_TWO likewise selected Chase Brown 20/20 at 1.09 and Brock Bowers 18/20 at 2.02. Its extra 3.09 lookahead mainly changed which WR was selected at 3.09 (DeVonta Smith 13/20, Zay Flowers 6/20), while 4.02 remained Chris Olave 15/20 / Zay Flowers 5/20. This is not the desired structural correction.

Final roster construction remained broad and legal, usually 1 QB / 1 TE / 4-7 RB / 6-9 WR, so failure is not a roster-legality artifact.

## Mechanism failure
The experiment applied lookahead at turn starts (9->12 and optionally 29->32) but left the second pick at the turn to the canonical isolated policy. That means the most important early decision at 2.02 was still evaluated primarily as an isolated pick, even though its real opportunity cost is the long gap to 3.09 (pick 29). Consequently Bowers remained selected almost deterministically.

This reveals that the correct temporal unit is not merely a snake-turn pair. Every own pick has an opportunity cost to the NEXT own pick:
9->12, 12->29, 29->32, 32->49, 49->52, 52->69, ...
The long-gap decisions at 12, 32, 52, etc. are especially important because passing a scarce RB/WR there can be much more expensive than passing the same player at the near return pick.

A second caveat is that the pair score was injected back into the existing single-player safety/normalization pipeline. That was useful for a causal probe but should not be treated as a final architecture for sequence utility.

## Decision
- Reject PAIR_FIRST and PAIR_FIRST_TWO for holdout and production.
- Do not tune lambda/frontier on these same outcome seeds.
- Keep the positive causal lesson: explicit future-pick utility can materially alter pick 9, but turn-start-only lookahead targets the wrong decision boundary.
- Next candidate should be rolling NEXT-OWN-PICK opportunity-cost evaluation, position-agnostic, with explicit treatment of pick 12->29 and 32->49.
- Preserve the same anti-overfit ladder: preregistration -> small CRN screen -> fresh holdout -> joint-state/dependence validation -> realistic mocks -> production only if robust.
