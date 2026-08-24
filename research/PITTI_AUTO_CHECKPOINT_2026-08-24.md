# PITTI AUTO checkpoint — 2026-08-24

Authority: subordinate to canonical Library `PITTI_CURRENT_STATE.json` generation `20260823T210148Z-v57` and newer verified evidence. Read after `PITTI_HANDOFF_CURRENT_OVERRIDE_LATEST_2026-08-23.md`.

## Material findings in this AUTO block

### 1. QB2/TE2 mechanism — blanket guard remains rejected, but old repeat behavior is NOT vindicated
The exact metadata-safe 60-seed paired utility result remains PASS and rejects the global hard QB2/TE2 guard (mean delta -0.11654 expected wins/14w; challenger better 9/60, worse 51/60). Full shard decomposition shows the baseline made 166 repeat-QB/TE selections; all 166 were PlayerQualitySafety-triggered and only 1/166 was a selected-panel same-position upgrade over the best already-rostered player. The full-draft utility effect is strongly path-mediated through changed opponent availability/later boards, so the hard-guard loss is not clean direct evidence that redundant QB/TE picks are valuable.

Frozen correction: do not fit a raw-score threshold on seeds 459710001..459710060. They are mechanism/audit data only.

Persistent note: `research/QBTE_OPPORTUNITY_COST_DIAGNOSTIC_2026-08-24.md` commit `17d75cab78c576f4ba9339fd29a98dbc4f5d8594`.

### 2. Corrected direct marginal QB2/TE2 mechanism result
A first direct-marginal run was caught as incomplete: it reported only 73/166 repeat events because it reused the original repeat-centered Safety quality band to find RB/WR alternatives. That silently reproduced the known admissibility-order defect. The run is INVALID and must not be cited.

Corrected schema-v2 run `32681654639` fails closed unless all 166 repeat events are covered and compares each repeat QB/TE against the highest-raw visible eligible RB/WR natural alternative without reusing the repeat-centered band. PASS, exact 166/166 coverage.

Corrected mechanism evidence:
- repeat QB/TE directly better than the RB/WR alternative in 120 states, tie 1, worse 45;
- aggregate mean weekly direct delta ~-0.0074, median +0.1218: strongly heterogeneous;
- QB repeats: 130 states, 99 better / 1 tie / 30 worse, mean +0.139 weekly points;
- TE repeats: 36 states, 21 better / 15 worse, mean -0.534 weekly points.

Draft-stage structure is material:
- picks 49/52 repeat TE: 0/12 better; mean losses ~-1.43 / -1.20 weekly points;
- picks 89/92 repeat QB: 0/18 better; mean losses ~-1.68 / -0.66;
- pick 112 onward becomes mixed as RB/WR alternatives weaken;
- pick 149: 45/45 repeat QB better, mean +0.705 weekly points (almost all Kyler Murray vs fringe RB).

Interpretation: the hard-ban loss can be explained by genuine late-draft startability/streaming/contingency value, while early/mid repeat QB/TE can still be directly harmful. Do NOT turn the observed pick cutoffs into a rule from these seeds. The eventual challenger must be state/value-aware and naturally more permissive late.

Persistent result note: `research/QBTE_DIRECT_MARGINAL_RESULT_2026-08-24.md` commit `e82d26a46223abecc53198a1fff814b890a0be45`.

### 3. Bowers 2.02 concentration / 10-team TE economics
Metadata-safe baseline concentration remains 57/60 Bowers at pick 12. In all 57 Bowers states the highest-raw RB/WR alternative is Chase Brown, and Bowers' Coach raw advantage is almost invariant: mean +1.110, range +1.097..+1.117. This is a deterministic-concentration warning, not proof Bowers is bad.

Existing direct 2.02 candidate counterfactual evidence preserves disagreement rather than certifying Bowers:
- selected-panel lineup-rank lens puts Bowers near the upper-middle frontier, not dominant;
- independent regular-season bridge ranks him materially lower;
- no scalar winner is certified.

A new isolated Bowers-vs-Chase-Brown bridge diagnostic shows Brown favored 57/57 and mean Bowers-minus-Brown direct delta ~-5.27 weekly points, BUT component audit demonstrates this evaluator is structurally unsuitable as an early-pick elite-TE adjudicator:
- bridge Bowers ~8.55 weekly Half-PPR;
- bridge Brown ~12.60;
- bridge replacement TE ~4.13;
- bridge replacement RB only ~1.67.
The replacement baseline is derived from the bottom 20% of the full positional ADP pool, not a realistic 10-team actual FA/FLEX replacement pool. It therefore makes early RB replacement implausibly weak and mechanically boosts RB VOR.

Fresh external projection sanity check strengthens the evaluator-bias concern. FantasyPros current 2026 projections imply roughly 11.52 Half-PPR points/game for Bowers (147.5 standard + 0.5*96.6 receptions over 17) and ~14.51 for Chase Brown (214.8 standard + 0.5*63.8 receptions over 17). Bowers remains consensus elite TE/TE1-range; Pat Fitzmaurice and Derek Brown both support elite target-share/upside. Therefore the historical bridge may remain an independent regular-season lens but **must not mechanically demote Bowers** or define 10-team TE replacement economics.

Current classification: **Bowers legitimate 2.02 comparison / not automatic**. Superior fallers or clearly stronger intrinsic RB/WR values beat TE scarcity. No scalar TE penalty may be fit on these 57 states.

Persistent note: `research/BOWERS_10TEAM_TE_ECONOMICS_AUDIT_2026-08-24.md` commit `d681d0d1fad2970198df9e0666cff2bb05b18d44`.

### 4. Fresh health/role evidence changes
Player-evidence branch records:
- Christian McCaffrey: Aug. 23 official practice return/team-drill work materially lowers the acute current-health gate; retain separate age/workload/availability downside prior and require no setback before draft day.
- Parker Washington: official Aug. 23 full-speed return closes the short-term absence gate absent setback.
- Tyler Warren: groin watch remains OPEN; no dated meaningful return-to-practice milestone yet.
Persistent note commit `0a6b5f9141cd14601d7624bb058fc67f32e33863`.

### 5. Pick 29/32 freshness
- Malik Nabers: positive progression, still no full contact-clearance milestone; keep wider ACL/cartilage recovery distribution.
- Chris Olave: Aug. 20 absence explicitly rest day; no acute health downgrade.
- Zay Flowers: normal Aug. 20 joint-practice work closes prior quad concern absent setback.
Timing remains 47.44% Nabers / 80.17% Olave / 97.75% Flowers for 29->32 and is sequencing-only after intrinsic tier/health.
Persistent note commit `9623c1659de109d151d88fcff025a57b49322186`.

## Stale-error guards unchanged
- Tier-first always precedes TAKE/WAIT/timing.
- Turn-Pair Brown 1.09 INVALID; Rolling-v1 INVALID; PairSum-v2 aggregation REJECTED.
- Chase Brown not normal 1.09; Josh Allen not normal 2.02 even if an independent regular-season evaluator likes him.
- Name-only later-round lineage is contaminated; position-aware metadata-safe evidence required.
- No global QB2/TE2 hard ban and no seed-fit pick-cutoff rule.
- Bowers 2.02 remains legitimate comparison; concentration/economics is the question, not a mechanical ban or bridge-based demotion.
- Research-only outcomes do not authorize production promotion; rc4.52 prepared production baseline and rc4.59 Android-used research/test boundary remain distinct.
- AUTO never starts an interactive mock.

## Exact continuation
Serial critical path:
1. Build the disjoint/outcome-blind QB2/TE2 marginal-value challenger using the corrected architecture; use 459710001..060 only as a mechanism regression set, never for threshold fitting.
2. Build/validate an actual 10-team TE replacement/opportunity-cost lens (realistic TE streaming/FA pool + later RB/WR supply) before changing Bowers treatment.
3. Integrate improved CMC acute-health status into the Tier-first faller map without erasing decline-risk prior.
4. Continue 1.09->2.02 intrinsic adjudication with separate expert/role/health/current-projection and market timing lenses; no scalar collapse.
5. Advance 29/32 with refreshed health ordering and metadata-safe/current evidence.
6. Once these gates are stable, run complete realistic mocks and audit pick-frequency artifacts; AUTO itself does not start an interactive user mock.

Parallel queue whenever compute/fetch is pending:
- material health/role/injury freshness for draft-window players;
- first-turn and 29/32 TAKE/WAIT plausibility;
- realistic-mock readiness and deterministic-artifact frequency audits;
- actual 10-team replacement-pool / FA economics;
- checkpoint/source/artifact hygiene;
- lower-priority Watcher/UI/autodraft only if draft-critical expected value rises.

No user action is currently required.
