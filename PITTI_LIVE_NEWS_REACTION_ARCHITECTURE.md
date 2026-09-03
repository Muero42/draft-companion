# PITTI LIVE / NEWS — PRECOMPUTED REACTION INTELLIGENCE

## Objective
Live / News is the event-response surface, not a passive news reader. PITTI should know the likely fantasy consequence before an injury/role event happens, then use breaking news only to activate/re-score a prepared scenario.

## Two-layer architecture

### A. Precomputed 32-team role graph (slow lane)
Maintain a versioned role graph for every NFL offense, refreshed on schedule and after transactions/depth-chart changes.

For each fantasy-relevant RB/WR/TE/QB store:
- team, position, active/IR/PUP/suspension status
- depth-chart position AND functional role (early-down, passing-down, goal-line, two-minute, slot, X/Z, move TE, blocker)
- likely direct replacement(s); explicitly allow committee replacement
- replacement confidence 0-100
- physical/profile notes relevant to role substitution
- current Sleeper ownership in our league
- current PITTI roster/FA/trade availability
- baseline ROS/weekly rank/projection evidence when verified
- contingent-value estimate if player(s) ahead become unavailable
- source provenance + timestamps + disagreement flags
- invalidators (coach says committee, new signing, practice activation, etc.)

The role graph must distinguish official listed depth from fantasy opportunity. A nominal RB2 is not automatically the injury beneficiary.

### B. Event activation (fast lane)
Ingest timestamped events and map them to affected role graphs:
1. DETECT — injury, inactive, IR/PUP, transaction, coach role statement, practice participation, snap/route/touch change.
2. VERIFY — classify source tier and seek independent/primary confirmation where needed.
3. IMPACT — identify vacated role/touches/targets/snaps, affected teammates, opponent/OL/game context.
4. LEAGUE — check live Sleeper ownership, our roster, all opponent rosters, FAAB and roster-capacity cost.
5. DECIDE — ADD/DROP, FAAB range, trade/watch/start-sit response with confidence, freshness and invalidator.
6. SURFACE — only actionable or decision-relevant events reach Live / News; raw noise stays in cache.

## Source ladder
Tier 0 primary/authoritative:
- NFL/team official transactions, injury reports, inactives, roster/depth-chart publications.
Tier 1 first-party/local:
- credentialed team beat reporters and direct coach/player press-conference reporting. Maintain per-team reporter registry with reliability/latency history.
Tier 2 specialist aggregators:
- RotoWire breaking player news/injury feed and continuously updated depth charts; established fantasy/news services used for fast discovery and synthesis.
Tier 3 analysis:
- trusted fantasy analysts for role interpretation, not as sole confirmation of a factual injury/transaction.

Speed policy: a Tier-1 direct practice/injury report may trigger a provisional WATCH immediately. CLEAR ADD / aggressive FAAB requires either primary confirmation or corroboration without a time-pressure exception; show confidence explicitly.

## Precompute priority
P0 all 32 RB rooms: starter(s), handcuff misconception risk, early-down/pass-down/goal-line successors, committee likelihood, free-agent contingent targets.
P1 all WR/TE rooms: target/route succession, slot/outside role, condensed target trees.
P2 QB: starter injury impact on replacement QB and pass-catcher values.
P3 OL/context: major line injuries that materially change offense/DST/kicker projections.

## UI target
Replace current mostly diagnostic Live / News page with:
- BREAKING / ACTION REQUIRED
- PREPARED CONTINGENCIES (e.g. "If RB X OUT -> Y/Z split; Y FA; provisional FAAB 12-18%; confidence 74%")
- WATCHLIST / ROLE CHANGES
- SOURCE HEALTH (collapsed diagnostics)
- RESEARCH CACHE stats (collapsed diagnostics)

No stale generic Coker card should dominate Live / News merely because the normal Waiver engine has one WATCH candidate.

## Fail-closed rules
- Never infer direct succession from depth-chart ordinal alone.
- Never claim an injury severity from vague video/social speculation.
- Never use stale roster ownership.
- Never execute a transaction automatically.
- If sources conflict, expose conflict and reduce confidence.
- Every activated event stores first_seen, source_published_at (when available), ingested_at, verified_at and decision_at so latency can be measured.

## Tests
- RB1 injury with clear three-down RB2 -> prepared successor activated, ownership checked, concrete contingent action.
- RB1 injury in committee -> multiple successors, no fake single handcuff.
- nominal RB2 whose role/profile does not replace RB1 -> no automatic promotion.
- unverified social rumor -> provisional only/non-actionable.
- official inactive after earlier beat report -> same event deduplicated and confidence upgraded.
- owned successor -> trade/roster impact path, not FA add.
- Reserve/IR candidate never ordinary drop.
