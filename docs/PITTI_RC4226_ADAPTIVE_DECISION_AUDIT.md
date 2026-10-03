# RC4.226 adaptive Weekly decision engine — work checkpoint

Status: implementation in progress; NOT PUBLISHED / NOT PRODUCTION / ANDROID PENDING.

## Interrupted worktree reconciliation

The takeover worktree was CLEAN on `codex/v301-rc4225-production-authority`, HEAD `e8bece95168cc3d53dabd693a87c531210d6c514`, tree `d1cdf0875089713921f89371588fe5b5efb696b6`, parent/main `c4f067a0ee9acb0d91f46ac6f9e116d073d2f915`. No partial RC4.226 implementation existed. KEEP: unpublished v301 Authority and verified RC4.225 runtime; KEEP: source research captured in ignored local output. CORRECT: the superseded plan to reuse Draft v4/v5 numeric weights. DROP: that plan only, no file reset. Feature branch starts from preserved local HEAD. Coupled guardrail passes v301. Remote Git and GitHub main agree with canonical RC4.225 main/tree `f793be8d6d5c309e7fd4a9379ac756c99dd3cbbd`.

## Before-state proof

`lineup-start-sit-v2.js:optimize` accumulates `score+(choice.ev.locked?0:choice.ev.projection)`. `playerEvidence` exposes rank but the objective does not use it. `app.js:seasonProjectionLineup` maps raw weekly projected points to the legacy roster utility; that function remains unchanged for Trade/Waiver contracts. `acquireSelectedWeeklyRankPayloads` filters exact selected expert IDs and consumes provider ECR. `weekly-evidence-v2.js:selectedWeeklyRankLane` explicitly labels `FILTERED_ECR_SELECTED_PITTI_PANEL`, not custom weighted consensus. Primary projections are FantasyPros; the existing separately labeled Sleeper/Rotowire fallback remains unchanged. Matchup/environment/weather are card display signals, and Watcher reactions were not part of the optimizer. `config/season-expert-phase-policy.json` describes adaptive policy, while the old regression validates configuration rather than Runtime learning. No Runtime individual pre-lock accuracy ledger existed.

## Source qualification — one bounded pass

Current 2026 [nflverse weekly player stats](https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_2026.csv) returned HTTP 200, last modified 2026-10-03 14:22 UTC. The loader's [official source](https://raw.githubusercontent.com/nflverse/nflreadr/main/R/load_stats.R) identifies this asset. The [nflreadr identity loader](https://nflreadr.nflverse.com/reference/load_ff_playerids.html) documents DynastyProcess's GSIS/Sleeper crosswalk. Sleeper's current Pickens/Downs directory has no GSIS IDs, so exact unique crosswalk IDs are necessary; no fuzzy names. A direct current feed parse yields 949 skill-player completed-game records and fully completed Weeks 1–3. Duplicate/conflicting crosswalk bindings must fail closed. Future/current-week rows do not enter decisions or expert learning. Schedule scores/result plus conservative elapsed kickoff guard qualify completion. No routes, first reads, coverage, red-zone or defender assignments are derived.

FantasyPros public Weekly pages embed exact expert IDs, current per-expert ranking timestamps and separately identified last-season positional **in-season** accuracy ordinals. The 2025 published accuracy page confirms Boone overall #1 and positional QB6/RB5/WR1/TE18. Core identities: Boone317, Dalton285, Koerner120, Fitzmaurice22; RB also Wheeler835 and Weisse3585. QB page is STD: only its position-specific in-season accuracy-directory metadata is consumed; its QB ranks never become HALF evidence.

Bounded current/historical single-expert public-page `filters=317` probes returned 37/156-expert broad consensus, respectively. Public API without existing credential returns 403. These responses are rejected as individual ranks. Existing authenticated request pacing is reused at Runtime, with singleton expert identity/filter/total-experts, exact season/week/HALF/position, and rank min=max=mean=ECR assertions. A provider response that does not prove this shape has zero vote. No current credential is exported or newly obtained.

Public accuracy reports expose ten rows. The wider directory contains current positional accuracy ordinals through Week 3, but no separately proven accuracy update timestamp or pre-lock snapshots. Ranking update timestamps cannot be relabeled as accuracy update timestamps. Backfill: **CURRENT_2026_ACCURACY_INSUFFICIENT**. No reconstruction from Draft/current ranks/consensus. Current ordinals remain diagnostics only. Future exact pre-lock snapshots are scored prospectively.

## Frozen learning rules

Week 4 is MID. Draft accuracy weight is zero in every skill-position Weekly panel, including EARLY. Core pools come directly from the durable phase policy. Historical in-season positional ordinals become explicitly heuristic coarse prior categories: top10=.60, top25=.55, otherwise/unknown=.50; these are conservative prior expectations for PITTI's own pairwise accuracy metric, not published proprietary accuracy percentages. Historical source/ordinal remains visible. Six equivalent prior weeks; no parameter fitting. Current completed-week pairwise ordering accuracy over predeclared QB24/RB60/WR70/TE24 decision core, correct Half-PPR actuals only. Tied rank/result pairs omitted symmetrically. No hindsight injury/participation exclusion. Missing actuals/pre-lock identity must meet 70% depth and 90% snapshot coverage or the week is unscored. Unknown current accuracy does not penalize an incumbent.

Weights move at most three percentage points per completed-week update; single expert cap30%. Same completed week freezes target weights. Current stale/missing ranks have zero vote; minimum four verified experts and75% panel coverage before capped renormalization. Weighted median is primary; mean/dispersion diagnostic, disagreement lowers confidence. Selected provider consensus/Broad ECR remain explicitly unweighted fallback. Two bounded challengers per position are acquired; promotion needs three scored weeks, an eight-percentage-point shrunk advantage and two completed-update confirmations. Transfer occurs gradually, with one temporary additional panel member while the incumbent's weight falls; no abrupt challenger weight jump. No Sunday partial-week update.

## Decision hierarchy

Raw points remain unchanged. No PITTI fantasy-point forecast is created. Conservative **uncalibrated** close-call band1.0 point; no reproducible same-provider historical primary projections plus pre-lock individual ranks were proven, so models A/B/C/D historical accuracy/regret/high-confidence/override metrics remain NOT ESTIMABLE. No predictive superiority claim or threshold fishing.

Within the band, a swap needs a primary divergence plus another usable lane and no contrary verified signal. Expert+FantasyPros team-matchup alone is treated as correlated and cannot supply the two independent lanes. Usage/trajectory/news/ceiling share one opportunity/role group; environment/weather share one group. Both players need usable comparable evidence; source availability itself supplies no vote. Ceiling is categorical, restricted to near ties and derived from verified underlying volume. Outside the band, two contrary primary groups are required for an override, limited to a two-band gap. Baseline-only uncertain edges up to two bands hold current lineup; larger baseline differences are labeled LOW / BASELINE_ONLY. No automatic transaction.

Three completed games are required for confident trajectory; sustainable growth means both recent games above the original level, latest not declining, and material total increase. Fantasy points/TD spikes never create role growth. Stable volume supports floor; volume plus air yards/receiving/QB rush role supports ceiling. TD-dependent results require three verified games and low underlying volume. News requires validated primary Watcher chronology, role graph and publication after projection to avoid an already incorporated injury bonus. Direct WR/CB, slot/outside and shadow remain unavailable.

## Remaining gates

Source parser/endpoint and adversarial cache/runtime regressions; full integration/stale/cancellation review; genuine frozen Week4 audit rationale; compact mobile360/390/430 review; version/Authority reconciliation; exact-head full Cloud Strict, adversarial review, promotion, Production/static parity and postmerge8/8. No RC4.226 publication yet. Historical RC4.223 core Android acceptance remains PASS; RC4.226 Android acceptance PENDING.

## Final local candidate checkpoint

Version v11.8.0-rc4.226; candidate generation v302. All existing partial implementation retained and corrected by focused tests. Anonymous nflverse zero-volume rows excluded; identified FB/QB/WR carries remain in team denominator. Sticky crosswalk conflicts cannot resurrect on a third row. Conservative EST completion bound also covers EDT. FA rows use actual raw Sleeper object shape; 122-player normalization regression yields within loop. Accepted lineup-change rationale takes precedence in safe diagnostics. Individual snapshot stores prior and effective weight at capture, ledger retains them.

Source parse of the frozen current CSVs returns 949 records / completed Weeks1–3 in 125ms on local Node (not a device responsiveness claim). One shared source request, bounded serial per-expert requests, whole-batch 429 backoff; no per-player requests. Learning storage under250k, relative timestamps roundtrip exactly, optional storage failure isolated.

Mobile360/390/430 visually inspected: no overflow, name/point17px, rows14px, ROLE useful only, DOME/OUT/IR/LIVE/FINAL retained. Screenshots are synthetic presentation fixtures; their illustrative Downs LEAN is not the real partial-source audit verdict. Real frozen partial-source Pickens12.1/Downs11.3 references (not authenticated primary), individual panels unavailable, target share20→26→28% vs14→30→31%; Pickens MIXED vs Downs UP, air-share supports categorical ceiling for Downs. Team matchup/environment/weather/current role news unresolved in this audit. HOLD current lineup / ZU_KNAPP / LOW, no player-specific exception or Allen absence assumption.

Models A/B/C/D retrospective metrics all NOT ESTIMABLE: same-provider historical primary projections and proven pre-lock individual ranks unavailable. No predictive superiority claimed. Historical rc4223 core physical PASS retained; RC4226 Android acceptance PENDING. Cloud full Strict required; local full Strict not run.

Frozen configured prior-only weights; effective current individual weights zero until singleton current response proves provenance:

```json
{
  "QB": [
    {
      "name": "Dalton Del Don",
      "priorPositionRank": 9,
      "configured": 0.26087,
      "effective": 0
    },
    {
      "name": "Pat Fitzmaurice",
      "priorPositionRank": 42,
      "configured": 0.217391,
      "effective": 0
    },
    {
      "name": "Justin Boone",
      "priorPositionRank": 6,
      "configured": 0.26087,
      "effective": 0
    },
    {
      "name": "Sean Koerner",
      "priorPositionRank": 7,
      "configured": 0.26087,
      "effective": 0
    }
  ],
  "RB": [
    {
      "name": "Ryan Weisse",
      "priorPositionRank": 36,
      "configured": 0.151515,
      "effective": 0
    },
    {
      "name": "Kev Wheeler",
      "priorPositionRank": 24,
      "configured": 0.166667,
      "effective": 0
    },
    {
      "name": "Dalton Del Don",
      "priorPositionRank": 12,
      "configured": 0.166667,
      "effective": 0
    },
    {
      "name": "Pat Fitzmaurice",
      "priorPositionRank": 45,
      "configured": 0.151515,
      "effective": 0
    },
    {
      "name": "Justin Boone",
      "priorPositionRank": 5,
      "configured": 0.181818,
      "effective": 0
    },
    {
      "name": "Sean Koerner",
      "priorPositionRank": 7,
      "configured": 0.181818,
      "effective": 0
    }
  ],
  "WR": [
    {
      "name": "Dalton Del Don",
      "priorPositionRank": 13,
      "configured": 0.25,
      "effective": 0
    },
    {
      "name": "Pat Fitzmaurice",
      "priorPositionRank": 20,
      "configured": 0.25,
      "effective": 0
    },
    {
      "name": "Justin Boone",
      "priorPositionRank": 1,
      "configured": 0.272727,
      "effective": 0
    },
    {
      "name": "Sean Koerner",
      "priorPositionRank": 27,
      "configured": 0.227273,
      "effective": 0
    }
  ],
  "TE": [
    {
      "name": "Dalton Del Don",
      "priorPositionRank": 10,
      "configured": 0.27907,
      "effective": 0
    },
    {
      "name": "Pat Fitzmaurice",
      "priorPositionRank": 47,
      "configured": 0.232558,
      "effective": 0
    },
    {
      "name": "Justin Boone",
      "priorPositionRank": 18,
      "configured": 0.255814,
      "effective": 0
    },
    {
      "name": "Sean Koerner",
      "priorPositionRank": 44,
      "configured": 0.232558,
      "effective": 0
    }
  ]
}
```
