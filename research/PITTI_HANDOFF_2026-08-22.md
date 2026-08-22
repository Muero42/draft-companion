# PITTI HANDOFF — 2026-08-22

## Source-of-truth intent
This handoff supplements the canonical project state. On continuation, read the canonical PITTI_PROJECT_STATE.md to EOF first, then this handoff and the referenced research files. Verify current GitHub/runtime artifacts before assuming a prepared version is installed on Android.

## Immediate objective
Reach trustworthy, realistic full-draft simulations soon enough to extract actionable draft strategy for the real 10-team Half-PPR Sleeper draft on 2026-08-31 (user slot 9). Simulation realism and evidence from mocks are high priority. Avoid unnecessary/high-risk large production changes as draft day approaches, but **do not treat 2026-08-24 as a hard ban on large changes**: if evidence indicates a material Championship-Utility / league-win benefit and the change can still be implemented, tested and rolled back safely, a larger change remains explicitly allowed and desirable even after 2026-08-24. Prefer the smallest change that captures the benefit; change size itself is not the optimization target.

## Current critical path: Turn-Pair probe
The completed 5-variant dynamic TE/opportunity-cost screen did NOT produce a promotable dynamic TE rule.
- TE_SOFT2/4/6 and TE_RETURN_GATE all reproduced about -0.630 expected wins baseline / -0.722 stress vs MARKET_ROSTER.
- Hard DEFER_TE69 improved to about -0.148 / -0.283 but remains diagnostic only.
- Representative bad Coach path remained Amon-Ra -> Bowers -> Olave -> Flowers -> Swift -> McLaurin, RB1 delayed to 5.09.
Interpretation: no further blind TE-threshold tuning. Structural issue is broader snake-turn opportunity cost.

Draft PR #6 / `pitti-turn-pair-probe` preregisters a position-agnostic two-pick lookahead. CONTROL, PAIR_FIRST and PAIR_FIRST_TWO are running in GitHub Actions run 32596679736. At the latest checkpoint all three jobs remain healthy in the 10-seed/regime simulation step; Python pair-core invariant tests passed. Do not restart/duplicate while healthy.

Method caveat: Return-v2 exposes calibrated marginal player return probabilities, not true joint return-board states. Current screen uses preregistered ordered-survival approximation. Any positive result still requires joint-state/conservative dependence validation + fresh holdout before promotion.

## Major parallel AUTO findings — 2026-08-22 overnight block

### 1. Managed-redraft late-bench utility deserves explicit audit
Research specs:
- `research/LATE_ROUND_ASYMMETRIC_UPSIDE_2026-08-22.md`
- `research/MANAGED_REDRAFT_LATE_BENCH_UTILITY_SPEC_2026-08-22.md`

In this shallow managed league, late bench value should consider tail ceiling, probability of favorable role state, time-to-information, drop flexibility, waiver replacement cost and standalone startability rather than median projection alone. This is NOT Best Ball logic and NOT a hard late-RB rule. First step is pairwise dominance audit of actual Coach late picks; only build a numeric adjustment if repeated dominated-choice mechanism exists.

Primary-source evidence strengthened several late-round archetypes:
- Jacksonville officially lists Bhayshul Tuten / Chris Rodriguez as co-starters and describes run/pass-down work as committee. Rodriguez has physical/goal-line upside but no evidence justifies simply ranking him above Tuten.
- Denzel Boston has genuine Cleveland first-team camp reps; sleeper thesis is not purely analyst hype.
- Ja'Kobi Lane has repeated Ravens camp production plus preseason TD; still needs stable first-team-route evidence before material board promotion.
- Parker Washington remains a value thesis with current injury recheck, not an automatic boost.

### 2. Late-TE replacement value is materially non-trivial
Research file: `research/LATE_TE_REPLACEMENT_VALUE_2026-08-22.md`.

Dalton Kincaid has stronger current evidence than a generic sleeper label: official Bills reporting says no current limitation after recovery, strong conditioning and early red-zone production with Josh Allen. Current NFL.com analysis places him in a late-round market while citing a prior TE6-per-game stretch and strong yards/route profile. Jake Ferguson is a separate stable-floor/value archetype at a much cheaper cost than elite TE. Brenton Strange represents a very-late/waiver tail.

Method consequence: early-TE opportunity cost should compare an elite TE against a *distribution* of realistic later TE outcomes, not one fixed replacement TE. This does not prove Bowers is a fade; it raises the importance of correctly modeling later TE availability/value.

### 3. Decline-risk layer: Christian McCaffrey is a high-priority live gate
Research file: `research/DECLINE_RISK_REFRESH_2026-08-22.md`.

Official 49ers camp reports show repeated August missed practices for soreness. This combines with age 30, a 2025 career-high 413-touch workload and current analyst evidence of weaker rushing efficiency. His receiving/overall ceiling remains elite. Treat as correlated downside/availability evidence, not multiple independent penalties and not a hard exclusion. If CMC falls to 1.09, Coach must surface exceptional upside and explicit downside flag. Mandatory draft-day health recheck.

### 4. Shallow-league format creates a possible evaluator-modeling issue
Research files:
- `research/SHALLOW_LEAGUE_FORMAT_EDGE_2026-08-22.md`
- `research/OUTCOME_REPLACEMENT_VALUE_AUDIT_2026-08-22.md`

Fresh shallow-league strategy evidence independently supports higher bench-upside/churn value, but also provides a useful falsification check against dogmatic Late-QB/Late-TE: elite QB/TE can be easier to justify when replacement starters at RB/WR are abundant. Therefore personal Late-QB/Late-TE remains a tiebreaker only.

More importantly, direct audit of `research/rc459_full_policy_outcome_certification_v2_2026.py` found its weekly replacement score is the median forecast from the bottom 20% ADP tail by position. That is a generic deep-tail proxy, NOT explicitly calibrated to a 10-team / 6-bench free-agent pool. If too low, outcome-v2 may overvalue generic depth/positional scarcity and undervalue elite consolidation/churnable upside. Do NOT alter the evaluator during the active Turn-Pair screen. After artifacts are frozen, build a separate shallow-league replacement sensitivity derived from realistic post-draft free-agent pools and conservative FAAB/competition haircuts. Require policy conclusions to survive both the existing conservative challenger and shallow-league-calibrated challenger.

### 5. QB replacement remains plausibly deep, but must be modeled rather than assumed
Current NFL.com QB value work identifies Justin Herbert as a late/double-digit-round value with plausible offensive-line / Mike McDaniel rebound. This supports a deep one-QB replacement distribution. It does NOT justify suppressing exceptional early Allen/Jackson/Daniels/Hurts value. TAKE/WAIT should compare actual marginal QB edge to realistic later-QB distribution.

## Earlier RB2_BY52 diagnosis retained
Run 32590945054 simulation passed but core audit found a Coach roster with TE=0; outcome correctly skipped. Do not relax retain13. Generic final-roster starter feasibility is required; hard early TE is not.

## Realistic simulation validation ladder
Small causal CRN -> simple candidate -> fresh held-out larger certification -> full realistic mock matrix -> pick-level sanity review -> production. Persist raw simulation before downstream evaluators and legality/core separately.

## Opponent draft-mode semantics
All opponents default MANUAL absent current contrary evidence. AUTODRAFT switches prospectively only from current evidence and must not train personal manual profiles. Sleeper CPU uses Draft Queue first, then higher-ranked available + roster need when queue empty. Keep autodraft fallback cheap/secondary.

## Player-evidence gates
- Nabers: positive 11-on-11 progression; full contact/medical clearance remains decisive.
- Olave: no standalone downgrade; Jordyn Tyson absence may concentrate targets but offense-quality effect must remain separate.
- Parker Washington: day-to-day/expected back; preserve value thesis, mandatory recheck.
- Flowers: quad contusion/day-to-day, no large downgrade absent setback.
- Chase Brown: current lead/high-volume evidence; no new warning explaining Coach RB avoidance.
- Swift: tandem evidence, not true workhorse.
- LaPorta and other injured TE/RB/WR names remain evidence gates, not automatic penalties.
- CMC: explicit high-priority decline/availability gate as above.

## AUTO operating rule — mandatory
Every AUTO block maintains serial critical path + independent parallel queue. Do not merely poll/wait while worthwhile independent work exists. For explicitly requested large/unattended AUTO blocks, continue through multiple meaningful work packages before reporting; do not stop after the first checkpoint unless blocked or user action is genuinely required.

## Immediate next actions
1. Let healthy run 32596679736 finish. Inspect first completed artifact immediately; no duplicate run.
2. Freeze and diagnose exact Turn-Pair behavior before any parameter changes. Positive candidate -> fresh holdout + joint-state/dependence validation. Negative -> mechanism diagnosis, no same-seed lambda/frontier tuning.
3. After current outcome artifacts freeze, preregister and build shallow-league replacement-value sensitivity; do not retroactively alter current evaluator.
4. Pairwise-audit actual late Coach picks for managed-redraft dominance before creating any late-bench numeric adjustment.
5. Expand TAKE/WAIT map using distributions of later QB/TE/RB/WR alternatives, not fixed replacement values.
6. Continue primary-source player evidence and decline-risk gates; focus on likely slot-9 windows.
7. Once a simple Coach candidate passes small screen + legality + independent sensitivity, fresh held-out certification then realistic full mocks.
8. Keep deep Sleeper Queue fallback minimal/cheap; K/DST omitted, QB2/TE2 deprioritized.

## Hard constraints
- 10-team Half-PPR; QB, 2 WR, RB, TE, 2 Flex, K, DST; bench 6. Four-WR limit is STARTERS, not roster cap.
- Slot 9 picks: 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149.
- User does not draft K/DST in strategic queue; Late QB/very late TE are preferences, not hard suppression.
- Geno Smith and Aaron Rodgers hard QB exclusions.
- Broader but viable candidate lists in interactive mocks.
- After completed simulated draft, AUTO does post-draft analysis/validation, not a new mock unless explicitly requested.
- Fresh data/backups before real draft; own model assessment before optional FantasyPros parallel view.
- Large changes remain allowed after 2026-08-24 when evidence supports material Championship-Utility gain and sufficient test/rollback time remains.
