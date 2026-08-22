# Slot 9 first-turn sequence map — rc4.59 parity evidence, 2026-08-22

## Scope
This is **timing / sequencing evidence only**, not a standalone player ranking. It is extracted from the already-PASS `simulation_2026/RC459_DECISION_INSIGHTS_2026.json` / `RC459_TURN_PAIR_MARKET_2026.json`, fresh freeze hash `5339a37d...`, rc4.59 profiled-baseline opponent kernel, 2,000 parent runs.

At 1.09, the user has only two opponent picks (1.10 and 2.01) before 2.02. The correct question for two similarly valuable targets is often not merely “who is better?” but “which one must be taken first because the other can plausibly return?”

## Conditional return to 2.02 when available at 1.09
| Player | Panel | Sleeper ADP | P(return to 2.02) | Timing label |
|---|---:|---:|---:|---|
| Jaxon Smith-Njigba | 6.52 | 6.6 | 0.0% | TAKE_FIRST_IF_TARGET |
| Jonathan Taylor | 8.30 | 6.2 | 0.0% | TAKE_FIRST_IF_TARGET |
| Amon-Ra St. Brown | 5.84 | 8.0 | 1.79% | TAKE_FIRST_IF_TARGET |
| James Cook III | 8.45 | 9.6 | 11.96% | TAKE_FIRST_IF_TARGET |
| CeeDee Lamb | 14.04 | 10.5 | 23.99% | TAKE_FIRST_IF_TARGET (timing only) |
| Saquon Barkley | 15.89 | 11.5 | 52.82% | MATERIAL_COLLISION_RISK |
| Ashton Jeanty | 12.40 | 12.6 | 68.86% | WAITABLE_WITH_RISK |
| Justin Jefferson | 13.60 | 13.7 | 85.01% | WAITABLE_WITH_RISK |
| De'Von Achane | 16.33 | 13.6 | 87.09% | WAITABLE_WITH_RISK |
| Omarion Hampton | 16.23 | 15.6 | 96.79% | VERY_WAITABLE |
| Chase Brown | 11.89 | 16.6 | 97.50% | VERY_WAITABLE |

Panel/ADP are the values attached to the rc4.59 timing artifact; timing labels describe collision only. They do not mean CeeDee (for example) is automatically a better 1.09 player than every WAITABLE candidate.

## Robust sequence implications
When player quality/evidence is close enough that either member is a legitimate target:
- **Amon-Ra / JSN / Jonathan Taylor / James Cook should normally be taken before Chase Brown.** Brown is expected to return ~97.5%; the others are expected to disappear 88–100% of the time.
- **Cook before Jeanty** is the default timing sequence if their player-quality utilities are close: Cook returns ~12%, Jeanty ~69%.
- **Cook before Jefferson** is also the default timing sequence if both are similarly acceptable after current health/evidence adjustment: Cook ~12%, Jefferson ~85%.
- **Low-return vs low-return (e.g. JSN vs Taylor)** cannot be solved by timing; Player Quality / health / roster-tail utility decides.
- **High-return vs high-return (e.g. Brown vs Hampton)** likewise shifts weight back to Player Quality because both are likely to survive.

## Important live adaptation
These are pre-draft conditional priors. In the real draft the first opponent pick at 1.10 becomes observed before 2.01. After observing it, Return-v2/manager state must update for the remaining player; do not mechanically reuse the unconditional 2-pick percentage.

If Sleeper shows either turn manager in AUTODRAFT, use the Sleeper-autodraft branch for subsequent forecasts rather than personal manual tendencies. Current platform state overrides historical manager priors.

## Why this matters for championship utility
This sequencing can obtain nearly the same two-player target set at lower opportunity cost. It does **not** require reaching for the more returnable player. The Chase Brown 20/20-at-1.09 research anomaly was exactly the opposite of this logic and is now invalidated.

## Draft-day refresh gate
Recompute 30/31 Aug from fresh panel, Sleeper Half-PPR ADP, injuries/roles and observed manager/autodraft state. Keep the structure; refresh the probabilities.
