# Slot 9 second-turn sequence map — rc4.59 parity evidence, 2026-08-22

## Scope
Timing / sequencing only, not standalone Player Quality. Source: PASS `simulation_2026/RC459_TURN_PAIR_MARKET_2026.json` / decision insights, fresh freeze hash `5339a37d...`, 2,000 realistic prefix states with rc4.59 profiled-baseline opponent kernel.

For the 3.09 -> 4.02 turn, selected examples from the exact conditional timing study:

| Player | P(return to 4.02 if available at 3.09) | Timing implication |
|---|---:|---|
| Kyren Williams | 16.13% | strong TAKE-first pressure if target |
| Malik Nabers | 47.44% | material collision risk; roughly coin-flip return |
| Chris Olave | 80.17% | usually waitable, but not safe |
| Zay Flowers | 97.75% | very waitable in the modeled turn state |

## Sequence implications
When player-quality / health-adjusted utility is close:
- **Nabers before Olave or Flowers** on timing alone; however Nabers' ACL/cartilage return ramp is a real independent health-risk axis and can reverse a close quality decision.
- **Olave before Flowers** on timing alone: Olave has ~20% loss risk versus ~2% for Flowers.
- **Kyren before all three** when he is genuinely in the same target tier, because he is much less likely to survive the turn.
- Flowers' very high return probability is not a quality downgrade; it is a sequencing advantage allowing WAIT when another comparable target has greater collision risk.

This directly supports the project's intended TAKE/WAIT architecture: quality/evidence determines the acceptable target set; the rc4.59 opponent model determines the order in which similarly acceptable targets should be acquired.

## Live update
The 3.10 pick is observed before 4.01, so live Return-v2 must update after that observation. If either turn manager is currently AUTODRAFT, switch subsequent prediction to the Sleeper-autodraft branch. Fresh 30/31 Aug market/health refresh supersedes today's percentages, not the sequencing method.

## Later-turn timing examples already persisted
At 7.09 -> 8.02:
- Rome Odunze return ~28.31%
- Christian Watson ~55.64%
- Parker Washington ~81.89%

Again these are timing signals only. In particular Parker Washington's high return rate supports waiting when a similarly valued low-return target is available; it does not by itself raise or lower Parker's Player Quality.
