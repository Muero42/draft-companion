# PITTI Expert Panel v2 Audit — 2026-08-25

Status: RESEARCH / SHADOW ONLY. No production, main, gh-pages, Android, Coach, Return-v2, PlayerQualitySafety, roster or scoring mutation is authorized by this document.

## Goal
Preserve the current rc4.64 expert-panel baseline while evaluating a second, selectable expert configuration with stronger position-specific historical accuracy, current-ranking freshness, and lower redundant-information risk.

## Current baseline (unchanged)
Current PRESETS in rc4.64:
- QB: Pat Fitzmaurice 45, Justin Boone 30, Sean Koerner 25, Andrew Erickson 15; max 3 usable.
- RB: Pat 35, Boone 30, Koerner 20, Erickson 15, Derek Brown 10; max 4 usable.
- WR: Matt Harmon 35, Pat 30, Boone 20, Erickson 15, Derek Brown 10; max 4 usable.
- TE: Pat 40, Boone 25, Erickson 20, Derek Brown 15, Koerner 15; max 4 usable.
At the 2026-08-25 phone refresh Koerner was UNAVAILABLE, while Pat/Boone/Erickson/Brown/Harmon were usable.

## Verified historical accuracy signal
FantasyPros multi-year Draft Accuracy 2023-2025 (overall rank; positional ranks QB/RB/WR/TE):
- Jody Smith: #1 overall; 40 / 1 / 13 / 9.
- Sean Koerner: #2; 4 / 12 / 6 / 15.
- Joey Wright: #3; 15 / 17 / 7 / 64.
- Jeff Ratcliffe: #4; 24 / 18 / 22 / 39.
- Dave Kluge: #5; 86 / 26 / 9 / 3.
- Nick Mariano: #6; 48 / 11 / 8 / 77.
- Jared Smola: #7; 23 / 14 / 14 / 120.
- Pat Fitzmaurice: #36; 91 / 40 / 52 / 14.
- Andrew Erickson: #108; 151 / 80 / 71 / 122.
- Matt Harmon: #117; 77 / 128 / 117 / 95. His PITTI value is therefore specialist/diversity evidence, not FantasyPros draft-accuracy leadership.
- Derek Brown: #141; 103 / 153 / 112 / 57.

Interpretation: Derek Brown has no historical-accuracy case to retain material RB/WR weight if a fresh, technically usable higher-quality alternative exists. Erickson also requires a challenger test rather than incumbency protection. Pat remains particularly defensible at TE. Koerner is the strongest all-position target by a wide margin.

## Current-ranking freshness audit
### Sean Koerner / FantasyLabs
- WR tiers/article dated 2026-08-25, explicitly based on 12-team 0.5 PPR and says his actual season-long ranks are updated daily.
- TE tiers/article dated 2026-08-24, same 0.5-PPR reference, and explicitly says actual ranks/projections are updated daily.
- RB upside/backfield work is current in the FantasyLabs article index on 2026-08-24; the article says current season-long rankings are the source of truth and are updated separately.
- Public exact full ranking access remains the blocker. PITTI's current automated FantasyPros/reconstruction route returned zero exact comparison ranks for Koerner at the 2026-08-25 refresh. Do not infer exact ranks from prose tiers when exact daily ranks are unavailable.

### Draft Sharks
- Site Half-PPR rankings are current and state they update in real time; page reviewed 2026-08-24 and live Draft Sharks activity continued 2026-08-25.
- Important provenance guard: these are Draft Sharks TEAM rankings, not a verifiable current Jody-Smith individual list. Do NOT label the team list as Jody Smith solely because Jody is #1 historically.
- Use Draft Sharks Team only as a separate site-ensemble challenger unless an individually attributable current Jody list becomes available.

### Nick Mariano / RotoBaller
- Public 2026 Top-300 Half-PPR ranks are explicitly attributed to Nick Mariano and remain an attractive RB/WR challenger (historical RB #11, WR #8).
- The surfaced public article is from early/mid August and therefore must pass the final freshness gate before production use. A current dashboard/API path would be preferable.

### Yahoo panel sources
- Yahoo 2026 consensus Top-300 was updated 2026-08-24 and includes Justin Boone and Matt Harmon among six analysts.
- This confirms current Yahoo ecosystem freshness, but the consensus is not a substitute for individual Boone/Harmon ranks. Current PITTI individual/reconstructed rows remain the relevant sources.

### Jeff Ratcliffe
- The publicly surfaced Half-PPR overall page remains dated 2026-08-14. That is too stale for a new live-production panel on 2026-08-25 absent proof that an underlying current ranking feed is fresher.

## Position-specific v2 design — preliminary, not yet production weights
Weights below are priors for shadow testing, not final values. Exact inclusion requires a current exact ranking source.

### QB v2 target
1. Sean Koerner — primary if exact current rank ingestion is solved (historical QB #4).
2. A high-accuracy fresh QB specialist/current expert (candidate search required; avoid adding stale data merely to improve historical rank).
3. Pat Fitzmaurice or Boone as stabilizer only if current and incrementally useful.
4. Erickson should not be a default QB component given historical QB #151.

### RB v2 target
1. Sean Koerner (RB #12) and/or Nick Mariano (RB #11) if fresh exact ranks are available.
2. Pat as current stable baseline anchor.
3. Boone only after correlation/marginal-value test.
4. Derek Brown (RB #153) should be the first incumbent challenged/replaced.
5. Draft Sharks Team can be a separate ensemble challenger; never relabel as Jody Smith.

### WR v2 target
1. Sean Koerner (WR #6) if exact current ranks are available.
2. Matt Harmon retained as a specialist-information challenger despite weak generic accuracy; require incremental-value/correlation evidence.
3. Nick Mariano (WR #8) is a strong replacement candidate if a fresh exact feed is available.
4. Pat/Boone can stabilize if they add independent information.
5. Erickson (WR #71) and especially Brown (WR #112) have no automatic incumbency protection.

### TE v2 target
1. Pat Fitzmaurice remains strong (TE #14).
2. Sean Koerner is strong (TE #15) if exact current ranks can be ingested.
3. Search for a fresh TE specialist/high-accuracy ranker (Dave Kluge historical TE #3 is attractive only if a genuinely current 2026 redraft feed exists).
4. Derek Brown (TE #57) may remain only if he adds current independent value; not a core accuracy anchor.
5. Erickson (TE #122) should be challenged.

## Freshness gate for new v2 panel
For the final draft week:
- <=2 days old: preferred/current.
- 3-5 days: warning; may be shadow-tested but requires evidence of no material intervening news.
- >5 days: not eligible for a newly promoted v2 live panel unless the source proves an underlying continuously updated feed and exact timestamp/state can be verified.
- Historical accuracy never overrides stale current information.

## Correlation / ensemble guard
Do not optimize by summing individual accuracy medals. For each position, compare rank-order correlation among candidate experts on the common current player pool. Highly correlated experts should receive shrinkage; a lower-ranked specialist may deserve weight only when it adds independent predictive information. No single expert should dominate solely because of one historical leaderboard.

## Validation contract
1. Baseline rc4.64 remains frozen and selectable.
2. v2 is a second configuration, never an overwrite.
3. Same current player metadata, ADP, injuries, Return-v2, manager model, roster state and Coach logic for both arms.
4. Evaluate panel-only ranking changes first, then decision-surface changes on the same frozen decision fixtures.
5. Report exact changed recommendations, panel-rank deltas, player/tier substitutions and whether changes are supported by independent outcome/market evidence.
6. No tuning to a single Bowers/Brown/Jefferson example.
7. No player-name overrides, no PairSum/Rolling resurrection, no roster caps, no generic Return-v2 retune.

## Draft-day UI requirement locked for next isolated candidate
- Expert rows must be visible by default on the decision cards; no tap/expand required.
- Expert ordering must be deterministic and stable, not sorted by the player's rank. Fixed order follows the configured panel priority for that position; missing experts are skipped without re-sorting the remaining names by rank.
- This is presentation-only and must not change scoring.

## Immediate next gates
A. Solve/verify exact current Koerner ingestion without fabricating ranks from tier prose.
B. Verify a <=2-day exact current source for Nick Mariano and at least one high-accuracy TE/QB challenger.
C. Compute same-player rank correlations and derive shrunken v2 weights.
D. Implement the baseline/v2 selector plus always-visible fixed-order expert UI only on this isolated branch, then run syntax/runtime/regression gates.
E. Shadow replay both panels on frozen natural fixtures before any main/gh-pages/device promotion.
