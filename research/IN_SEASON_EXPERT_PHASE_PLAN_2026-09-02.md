# PITTI In-Season Expert Phase Plan — 2026-09-02

## Purpose
Prepare expert authority for the 10-team Half-PPR Season Companion while the rc4.182 startup repair is gated. This is research/config planning only; it must not displace startup repair or become production authority before expert loading works.

## Evidence baseline
FantasyPros 2025 in-season Half-PPR accuracy: Justin Boone #1 overall (QB 6, RB 5, WR 1, TE 18); Dalton Del Don #6 overall (QB 9, RB 12, WR 13, TE 10). FantasyPros measures weekly Half-PPR rankings at Thursday/Sunday locks, making this directly relevant to this league.
2025 examples also support specialist challengers: Pat Fitzmaurice Week 3 overall #3 with RB/WR 10/10; Kev Wheeler Week 3 #5 and Week 4 #3 driven by RB; Ryan Weisse Week 10 #7 driven by RB #2; Sean Koerner Week 6 #9 and Week 17 #2, with strong late-season RB/WR.
Draft accuracy is a separate signal and must decay after Week 1. Jody Smith was #9 in 2025 draft accuracy and #1 multi-year 2023-25 draft accuracy; Sean Koerner #2 multi-year; Nick Mariano #6; Kev Wheeler #9.
Boone's current 2026 Yahoo work is actively updating toward Week 1, including Sep 1 risers/fallers and 2026 rankings.

## Phase A — now through Week 1 kickoff
Goal: decisions before real 2026 game usage exists.
Weekly/decision panel:
- QB: Justin Boone, Dalton Del Don, Sean Koerner, Pat Fitzmaurice.
- RB: Justin Boone, Dalton Del Don, Kev Wheeler, Ryan Weisse, Sean Koerner, Pat Fitzmaurice.
- WR: Justin Boone, Dalton Del Don, Sean Koerner, Pat Fitzmaurice.
- TE: Dalton Del Don, Justin Boone, Sean Koerner, Pat Fitzmaurice.
Preseason residual/context only: Jody Smith, Nick Mariano and the final draft panel. Do not let preseason residual overrule fresh weekly injury/role information.
Weight concept: 70% weekly/current projections, 20% preseason/rest-of-season prior, 10% role/news/market evidence. Until 2026 weekly rankings are fully published, move missing weekly weight to current projections/role evidence rather than stale draft rank.

## Phase B — Weeks 1-3
Goal: react quickly without overfitting one game.
- Weekly matchup/start-sit: 75%.
- Rest-of-season/preseason prior: 15%.
- Usage/role/news: 10%.
Boone is primary cross-position anchor. Dalton Del Don is primary second anchor because of 2025 #6 overall and balanced top-13 positional accuracy.
RB specialist votes: Kev Wheeler / Ryan Weisse / Sean Koerner.
WR: Boone carries the strongest prior; Dalton + Koerner/Fitzmaurice diversify.
TE: Dalton has strongest 2025 full-season result among retained core; Boone/Koerner/Fitzmaurice remain challengers.
After every completed week ingest 2026 accuracy, but cap one-week accuracy influence so a single noisy week cannot overturn the panel.

## Phase C — Weeks 4-8
Goal: transition from priors to 2026 evidence.
- Weekly matchup/projections: 80%.
- 2026 rolling expert accuracy: used to reweight experts within each position.
- ROS value: 10-15% depending on decision type.
- Preseason/draft accuracy: <=5%, retained mainly for breakout/role priors.
Use rolling Bayesian/shrinkage weighting: 2025 in-season + multi-year history as prior, 2026 position-specific weekly accuracy as evidence. Minimum sample before major weight movement: 3 completed weeks.

## Phase D — Weeks 9-14
Goal: maximize weekly wins and trade deadline value.
Draft accuracy weight = 0.
Weekly expert authority determined primarily by 2026 position-specific accuracy plus current projections.
Trade/ROS decisions remain separate from start/sit. Boone trade-value charts become a market/value anchor when a current 2026 redraft chart is available; never substitute dynasty trade values.

## Phase E — playoffs
Goal: weekly ceiling/floor and matchup precision.
Use 2026 weekly accuracy almost entirely; emphasize late injury/news updates and projected role. Season-long/draft rankings no longer influence lineup choices. Keep a small multi-year prior only to stabilize thin positions such as TE/K/DST.

## Decision-specific panels
Waiver/FA: weekly rank + ROS value + role/usage + ownership/FAAB market. Boone primary; Dalton second; RB specialist panel for RB acquisitions. Draft rankings are context only.
Start/Sit: weekly ranks only after availability/injury filtering; no draft rank.
Trade: ROS/value model, roster construction and replacement value. Boone redraft trade-value chart anchor when current; weekly ranks only for near-term schedule modifier.
K/DST streaming: separate weekly specialist/ECR pool; do not contaminate skill-position expert weights.

## Automatic learning policy
Store expert-week-position snapshots before kickoff and realized Half-PPR results. Maintain rolling 2026 accuracy per position. Reweight only after completed weeks, with shrinkage to 2025/multi-year prior and caps on week-to-week weight changes. Record source freshness and last update. Missing/stale experts lose weight automatically; they are not silently replaced by draft rankings.

## Immediate implementation after loading fix
1. Add phase=PRE_W1 / EARLY / MID / LATE / PLAYOFF.
2. Separate weekly, ROS, trade-value, waiver-market and draft-prior channels.
3. Make Boone + Dalton the default in-season core, position specialists additive.
4. Preserve Jody Smith/Nick Mariano/draft-v4 as PRE_W1 residual only, then decay.
5. Add weekly accuracy ledger and bounded adaptive weights.
6. Expose expert source/freshness in UI so a stale list cannot masquerade as current.


## Kicker and DST concrete phase automation

K and DST are first-class weekly positions, but they use a separate streaming authority because long-horizon draft rank has very little decision value.

### K panel
PRE_W1 / W1-3 prior:
- Jared Smola — primary accuracy prior (2025 K accuracy leader).
- FantasyPros current-week K ECR — broad market stabilizer.
- Current team implied points / spread / weather / kicker role — non-expert evidence channel.

W4+:
- 2026 K weekly accuracy becomes the primary expert-selection signal after a minimum three completed weeks.
- Keep Smola/multi-year prior with shrinkage until sample is sufficient.
- Automatically promote challengers only if current weekly rankings are available reliably and their 2026 K accuracy clears the incumbent after shrinkage.
- Never use draft K rank for start/stream decisions after Week 1.

### DST panel
PRE_W1 / W1-3 prior:
- Ted Chmyz — primary accuracy prior (2025 DST accuracy leader).
- FantasyPros current-week DST ECR — broad market stabilizer.
- Opponent QB/OL, implied points, spread, sack/turnover environment and injuries — non-expert evidence channel.

W4+:
- 2026 DST weekly accuracy becomes primary expert-selection evidence after minimum three completed weeks.
- Chmyz/multi-year prior shrinks as 2026 sample grows.
- Automatic challenger promotion uses position-specific DST accuracy and source freshness.
- No season-long DST draft ranking may override current matchup evidence.

### Automatic phase engine contract
The production implementation must derive phase from NFL week; no user toggle is required for normal operation:
- PRE_W1: before first regular-season kickoff.
- EARLY: completed weeks 0-3 / current Weeks 1-3.
- MID: Weeks 4-8.
- LATE: Weeks 9-14.
- PLAYOFF: Week 15+ or league playoff state when available.

Every expert record must carry: position, decision_channel, source_updated_at, rankings_lock_at, prior_accuracy, current_2026_accuracy, sample_weeks, freshness_state, effective_weight.

Weight updates occur only after a completed week. Maximum single-update weight movement is bounded; missing/stale weekly rankings receive zero current-week decision weight rather than falling back silently to draft rankings.

### Decision routing
- QB/RB/WR/TE start-sit -> WEEKLY.
- K/DST -> STREAMING_WEEKLY.
- Waiver/FA -> WEEKLY + ROS + ROLE + MARKET.
- Trade -> ROS + TRADE_VALUE + REPLACEMENT_VALUE; WEEKLY only as near-term modifier.
- Draft prior -> PRE_W1 residual only, decays to zero.
