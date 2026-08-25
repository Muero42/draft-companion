# rc4.63 / realistic-scale Bowers-at-2.02 mechanism recheck — 2026-08-25

Research-only; no production mutation.

## New scale evidence
The metadata-safe realistic 120-seed baseline (`459820001..459820120`) selected Brock Bowers at pick 12 in 118/120 drafts and James Cook III in 2/120.

Direct inspection of the first 40 full seed traces confirms the previously diagnosed mechanism rather than revealing a new bug:
- Bowers was selected in all 40 inspected pick-12 states.
- Typical Bowers raw score: `107.352`.
- Typical best alternative was Chase Brown around `106.235`, so the lead was only about `+1.1` raw points.
- Across those 40 traces, Bowers' raw lead over the best visible alternative remained small (roughly `+1.10` to `+2.06`) despite different pick-9 choices (James Cook, Amon-Ra St. Brown, Jonathan Taylor, JSN).
- The reasons continue to show the previously identified cross-position alternative-scarcity mechanism: Bowers gets `Positions-Alternativen 0 nah · Gap 17.5 (+5.0)` and a large tier drop; RB/WR alternatives commonly get neutral/negative alternative-depth terms.

## Interpretation against prior canonical work
This reproduces the earlier metadata-safe/provisional finding: Bowers at 2.02 is individually defensible, but near-automatic concentration is not itself proof that the policy is optimal. The prior PairSum attempt that replaced this with a panel-rank lookahead collapsed to raw cross-position rank ordering and was correctly rejected; do not revive that route.

Current analyst evidence still supports Bowers as a legitimate 2.02 candidate (including Pat Fitzmaurice's aggressive overall placement and unanimous elite-TE treatment), so no hard demotion is justified. The unresolved question is whether the positional-alternative scarcity term is too deterministic in a 10-team league when Bowers and elite RB/WR alternatives share an overlapping quality tier.

## Freeze rule
Do not patch Bowers or TE scarcity as a side effect of the late-roster challenger. Keep this as a separate first-turn policy audit. Any future Bowers challenger must preserve Tier-first admissibility and compare complete Championship Utility / 10-team replacement economics; it may not simply force a preferred player or replay the rejected PairSum scalar.
