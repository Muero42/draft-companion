# Shallow-League Replacement Challenger — preregistration 2026-08-22

## Purpose
Outcome-v2 currently uses the median weekly forecast of the bottom 20% of each positional market-bridge pool as generic replacement scoring. That is independent and conservative, but it is not calibrated to this actual 10-team / 6-bench managed-redraft environment.

This challenger must test whether strategy conclusions survive more realistic waiver replacement. It is a sensitivity layer, not a replacement for the existing evaluator and not a tuning target for Coach policy.

## League mechanics relevant to replacement
- 10 teams.
- Required weekly starters: QB, 2 WR, RB, TE, 2 Flex, K, DST.
- Six bench slots.
- Active waivers/FAAB and frequent post-draft management are available.
- User intentionally does not spend draft capital on K/DST in the research skill-player draft; outcome evaluation retains 13 of 15 drafted skill players to reserve two roster spots for K/DST.

A realistic post-draft free-agent pool is therefore materially shallower than 'all undrafted players' but likely stronger than the median of the bottom 20% of a 225+ player skill pool.

## Correct empirical input
Future full-draft harnesses should persist the final available skill-player set for every simulated draft, plus the two user players released by the preregistered retain13 rule. This allows policy-specific, seed-specific post-draft free-agent pools without guessing a fixed ADP cutoff.

Do not infer free agents solely from overall ADP >130 when simulated ownership is available; ADP cutoff may be used only as a fallback sensitivity.

## Replacement scenarios — fixed before policy comparison
For each position/week, derive the best available free-agent weekly forecast from each simulated post-draft pool. Then evaluate three preregistered acquisition scenarios:

1. CURRENT_CONSERVATIVE: existing outcome-v2 bottom-20%-tail median. This remains the anchor.
2. SHALLOW_FAAB_50: 50th percentile of the per-draft best-free-agent distribution, multiplied by 0.90 acquisition haircut.
3. SHALLOW_FAAB_25: 25th percentile of the per-draft best-free-agent distribution, multiplied by 0.85 acquisition haircut.

The haircut represents waiver competition / imperfect acquisition without pretending every best free agent is freely obtainable. These exact percentile/haircut values are fixed prospectively and must not be tuned after candidate outcomes are seen.

## Evaluation use
- Re-score only frozen candidate/control draft artifacts; do not rerun or change draft decisions from replacement results.
- Report expected-wins delta vs MARKET_ROSTER under all three replacement scenarios.
- Separately report how often each policy relies on replacement at QB/RB/WR/TE by week.
- Report starter concentration benefit and bench-depth contribution so the mechanism is visible.

## Pass criterion
No production strategy is rejected or promoted solely because of this challenger. A candidate is robust only if its direction versus CONTROL/MARKET_ROSTER does not depend on an implausibly weak replacement assumption. If conclusions reverse between CURRENT_CONSERVATIVE and both shallow scenarios, classify replacement sensitivity as material and require realistic managed-season simulation / waiver evidence before promotion.

## Anti-leakage
- Selected expert panel is not used to define replacement quality.
- Candidate-policy outcomes do not determine percentile/haircut choices.
- Injury-news adjustments remain a separate dated scenario layer.
- No Best-Ball-only roster construction assumptions.

## Implementation dependency
The current rc4.59 paired artifact stores the user's roster/decisions but not the final league-wide available set. Therefore implementation should be added to the next realistic/full-draft harness rather than retroactively fabricating exact pools from old artifacts. Until then, current outcome-v2 remains the structural anchor and this challenger is OPEN, not silently approximated.
