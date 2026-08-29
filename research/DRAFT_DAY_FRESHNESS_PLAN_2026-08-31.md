# PITTI Draft-Day Freshness Plan — 2026-08-31

Real draft: 20:00 Germany local time.
Accepted runtime: v11.8.0-rc4.104. Historical rollback reference: rc4.96.
Purpose: maximize fresh information without destabilizing the frozen decision kernel.

## Operating principle

Fresh information is an overlay on the frozen board, not permission for indiscriminate coefficient/rank changes. Separate:
1. confirmed material facts,
2. corroborated role/injury signals,
3. weak contextual signals,
4. noise.

## Monday cadence

### Overnight / early morning
Low expected incremental US news value. Consolidate already-known changes; do not repeatedly poll the same players/sources.

### ~14:00–17:30 Germany
Increase freshness monitoring as the US workday develops.
Focus:
- material injury/availability changes,
- trades/signings/waivers/releases,
- depth-chart/role changes,
- expert ranking timestamps/deltas,
- Sleeper half-PPR ADP movement.

### ~17:30–18:15
Primary full pre-draft freshness pass.
Produce a delta set against the accepted rc4.104 inputs. No runtime mutation unless a genuinely material source-data defect is proven and deterministic gates can still be completed safely.

### after late transaction/waiver processing, roughly ~19:05–19:30
Targeted delta scan, not a full research rebuild.
For every relevant new RB/WR/TE transaction:
- identify acquired/released player's likely roster purpose;
- map same-position incumbents in PITTI candidate corridor;
- check whether an incumbent already had injury/availability/role uncertainty;
- seek corroboration from team/beat/injury reporting;
- classify signal as NONE / WEAK / CORROBORATED / MATERIAL.

Weak-signal rule:
- transaction alone is never injury proof;
- special teams, generic depth, practice-squad planning and opportunistic talent acquisition remain alternative explanations;
- uncorroborated same-position acquisition may break a near-tie but must not create a hard rank penalty;
- early-round movement requires much stronger evidence than late-round contingent-upside movement.

### ~19:40–19:50
Final materiality scan.
Only incorporate:
- confirmed/strongly corroborated injury or availability changes,
- material trades/signings/claims with clear role consequences,
- meaningful expert-board deltas,
- major depth-chart/role information.

Do not chase trivial rank movement.

### ~19:50
Operational freeze for draft start.
Keep web/news research available for genuinely breaking information during the draft, but do not rebuild the runtime.

## Live-draft integration

- WAIT leader is not automatic TAKE. At the 9/10 turn, evaluate the two-pick portfolio, Return/loss risk, positional opportunity cost and fresh evidence.
- New transaction/injury evidence is an overlay and tiebreaker unless corroboration makes it materially stronger.
- Preserve no-K/DST, one-QB user path, soft WR saturation, no roster caps, no named-player forcing.
- Never resurrect PairSum/Rolling or globally retune Return-v2 from a late news item.

## Final checklist
- Expert-v3 QB/RB/TE health/freshness
- frozen Expert-v2 WR health/freshness
- Sleeper half-PPR ADP freshness
- acute injury/availability deltas
- transaction/claim role deltas
- emergency queue/failsafe
- device/app rc4.104 availability
- ChatGPT live-decision context loaded

## Aug 29 pre-draft delta checkpoint
- Current FantasyPros riser/faller board has Parker Washington at overall 72 (+7) and Bucky Irving at 51 (+6). Treat as corroborating market movement, not an automatic rank override.
- NFL Aug 28 reports Ashton Jeanty still recovering from the Aug 23 ankle injury; Las Vegas expects him but will reassess Week 1 readiness. Keep acute monitoring active without a hard block absent stronger evidence.
- Current CBS draft-prep coverage also flags Jeanty as a notable ADP faller because of Week 1 ankle uncertainty. This corroborates uncertainty only; no broad model change.

## Aug 29 runtime acceptance delta
- rc4.100 exposed a live-only `Assignment to constant variable.` crash after turn-portfolio ordering because `scored` was declared `const` and then reassigned. rc4.101 changes only that binding to `let` plus version/cache metadata.
- rc4.101 candidate behavioral/package/guardrail gates PASS, exact packaged-runtime deployment parity was established, and Android live rerun PASS: fresh snapshot generated, 341 candidates evaluated, Draft Coach rendered. rc4.101 is therefore the accepted draft runtime.

## Aug 29 early-morning freshness audit — bounded rc4.102 candidate
- **Josh Jacobs:** stale negative groin-absence residual was invalidated by his Aug. 18 return to practice. Remove that scoring penalty. New Aug. 27 misdemeanor charges are under NFL review, but no suspension has been announced; retain as neutral availability/discipline risk only. Sources: AP/NFL Aug. 27; contemporary return-to-practice reporting Aug. 18.
- **Puka Nacua:** psoas absence remained current through Aug. 24. Possible league discipline remains unresolved. Rams reacquired Tutu Atwell, but Sean McVay explicitly said the trade was for receiver depth and unrelated to a possible Nacua suspension. Keep both issues as uncertainty, not a hard block or score penalty.
- **Jeremiyah Love:** ankle issue is materially stronger than the old 'one week' wording; he missed the remaining preseason and was still visibly limited in individual work Aug. 28. Preserve existing bounded injury-risk strength; refresh wording only.
- **Zach Charbonnet:** still on active/PUP late in preseason after ACL repair. If moved to reserve/PUP at cutdown he must miss at least four games; until the designation is final, phrase conditionally and do not hard-block.
- **Wan'Dale Robinson:** after Aug. 27 helmet-to-helmet hit, early indications Aug. 28 were that he did not suffer a concussion; Titans continue symptom monitoring. Add acute monitor, no hard block.
- **Kenneth Walker III:** current issue described as foot/ankle swelling reportedly caused by cleats; keep neutral freshness gate until full practice return.
- **Sam LaPorta:** hip concern had created Week-1 uncertainty, but he returned to team drills Aug. 26; update display risk to reflect improvement rather than implying uninterrupted absence.
- **Alec Pierce:** activated from PUP Aug. 27. No stale negative hardcoded residual was found in the current app, so no runtime change needed.
- **CMC / Luther Burden / Ja'Marr Chase:** current app wording remains directionally consistent with Aug. 23-28 reporting; no additional mutation justified.

Scope rule: rc4.102 is a source-freshness correction, not a coefficient experiment. Only the already-invalidated Jacobs groin penalty changes a scored residual; all other changes are wording/neutral acute-risk context.


## Aug 29 rc4.104 acceptance + replay delta
- Accepted Android/source/deployment authority is now rc4.104; exact 13-file main/gh-pages parity and post-draft Android Snapshot path PASS.
- Frozen rc4.101 failure-point fixtures from draft 1399284498113294336 were replayed against the bounded rc4.104 mechanisms with CI-backed PASS: pick92/109/112 roster opportunity-cost behavior and exact pick132 Spears/Andrews long-turn reorder. Return-v2 values remain untouched.
- Browser-equivalent recomputation of every historical candidate board is not claimed because the backup does not preserve every transient runtime input. This is an evidence boundary, not a reason to reopen the validated rc4.104 mechanisms.


## Aug 29 09:25 local freshness delta — no runtime retune
- **Roster-cut timing:** final 53-man cuts are due Sunday Aug 30. This is the next high-value transaction window; Monday Aug 31 waiver claims can create additional role changes before the 20:00 draft. Treat cut/PUP/IR designations as factual overlays, then re-evaluate role impact rather than pre-emptively moving rankings.
- **Ja'Marr Chase:** Aug 26 reporting confirms only a small left-knee hyperextension; Chase said he could have played. Keep a monitor flag, no current first-round block.
- **Puka Nacua:** still an active psoas/groin monitoring case in Aug 28 coverage, but Week-1 optimism remains. No automatic top-tier removal absent a setback/official designation.
- **Ashton Jeanty:** ankle sprain is confirmed and Week-1 availability remains genuinely uncertain. Raiders backup Mike Washington has played well enough to be the contingency if Jeanty misses time. Preserve the materially stronger injury discount/monitor; watch Sunday roster designation closely. No season-ending inference.
- **Jeremiyah Love:** high-ankle sprain remains material. Aug 28 local reporting says recovery is trending positively but still roughly 50/50 for Week 1. Current panel/ADP discount is justified; do not erase injury risk from one positive update.
- **Tyler Warren:** groin absence remains current; Aug 26 FantasyPros reporting says Week 1 was not considered in danger yet if he returns to practice the following week. Monitor, no hard block.
- **Zach Charbonnet:** Seahawks placed him on active/PUP in July while rehabbing ACL. Sunday final designation is draft-relevant: reserve/PUP would force missed regular-season time; active-roster activation would materially improve availability. Do not assume season-ending IR.
- **Kenneth Walker:** current public injury aggregators still list ankle/questionable, but no new evidence in this pass supports a hard downgrade beyond existing acute monitor.
- No source in this pass justifies a global rank, Return-v2, expert-weight or roster-policy change. The correct action is a targeted Sunday/Monday designation + transaction delta scan.


## Aug 29 official NFL timing lock — Sunday/Monday transaction window
- NFL official calendar confirms final 53-man roster reduction is due **Sunday Aug 30 at 6:00 p.m. New York time**. At that cutdown, Active/PUP and Active/NFI players must receive their final active/reserve/waive/terminate/trade treatment.
- The claiming period for players waived at final cuts expires **Monday Aug 31 at 1:00 p.m. New York time**. On Aug 31, New York is EDT (UTC-4) and Germany is CEST (UTC+2), so this is **19:00 Europe/Berlin**, one hour before the 20:00 real draft.
- Therefore the existing **19:05–19:30 transaction delta scan is intentionally retained**: it begins immediately after the official waiver-claim deadline and is the first high-value window for claims plus corresponding depth-chart/injury inference. The 19:40–19:50 final materiality scan remains the last targeted pass before freeze.
- Sunday priority: official Reserve/PUP / Reserve/NFI / IR designations, waives/injury settlements, trades and 53-man role changes. Monday priority after 19:00 local: waiver claims and resulting same-position roster changes. A transaction alone remains weak Bayesian evidence unless corroborated by role/health context.


## Data-authority guard added Aug 29
- Official/current team transaction reporting outranks stale Sleeper team / injury_status metadata for roster-status interpretation. Sleeper remains the live draft-room identity/availability and ADP market source, but a player shown with an old club/status must not be treated as roster-secure when an official current transaction contradicts it.
- Concrete trigger discovered Aug 29: NFL.com's current cutdown preview reports Trey Benson already cut by Arizona while the rc4.105 pre-draft Snapshot still rendered Trey Benson — RB, ARI ... Injury IR. Sunday/Monday transaction scan must explicitly reconcile such conflicts before they influence championship utility or contingency-path reasoning.
- Do not remove a player from the draft candidate universe solely because of a release: first resolve destination/waiver status and fantasy role. The correction is about status authority, not an automatic player blacklist.


## Official-transaction precedence guard
- During Aug30/Aug31 freshness passes, an official NFL transaction (release/waive/IR/PUP/NFI/trade) overrides stale Sleeper team/status metadata for eligibility and role interpretation.
- Explicit current example to regression-check: official NFL.com cutdown coverage reports Arizona released Trey Benson while the current Sleeper-derived pool still showed ARI / Injury IR. Do not silently carry that stale state into the real-draft board.
- Mike Washington Jr. current first-team preseason usage with Jeanty sidelined is role evidence only; it must not be converted into an injury certainty or automatic ranking override.


## Aug29 freshness source-quality guard
- Generic web search can surface legacy NFL roundup pages with matching month/day but wrong season. Draft-day ingestion must verify **explicit 2026 season/date context** before accepting a news item as current.
- Prefer the NFL 2026-27 important-dates/calendar, current 2026 roster-cut coverage, current team/league transaction reporting, then corroborated fantasy analysis. Reject legacy same-date pages even when search freshness labels them as newly crawled.


## Aug29 source audit IV — same-date legacy trap confirmed in live search
- Live web search on Aug29 returned NFL pages titled Aug29/Aug30 that are actually 2023/2022 content alongside genuine 2026 pages. This independently validates the explicit-year guard added earlier.
- Current accepted official anchors are the NFL **2026-27 important dates** page and current 2026 cutdown coverage explicitly dated Aug25-28, 2026. Reject roundup pages unless the body itself establishes the 2026 season.
- Current official Aug28 2026 injury delta: Raiders HC Klint Kubiak says Ashton Jeanty is still recovering from the Aug23 ankle injury but the club is counting on him and has another week to assess Week 1 readiness. Treat as monitoring/availability uncertainty, not a presumed absence.
- Current official 2026 cutdown coverage confirms Arizona released Trey Benson. Any stale Sleeper ARI/IR label must not survive the final freshness pass as current roster truth.
