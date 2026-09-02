# PITTI CODEX WORK PACKAGE — Season Decision Engine v2

## Goal
Implement the next coherent Season Companion increment without regressing verified rc4.188/rc4.189 behavior. Read `AGENTS.md` and canonical checkpoint files first.

## Workstream A — compact Week-1 roster
1. Keep the numeric 1–9 roster-slot grid removed.
2. Keep the duplicate lightweight START-ALTERNATIVEN block removed from Kader.
3. Replace verbose roster header/status copy with one compact live-state/evidence strip.
4. For every current player, expose a compact weekly evidence line when verified data exists:
   - NFL team
   - Week-N positional rank (e.g. WR7)
   - projected Half-PPR points
   - opponent
   - verified implied team total / Vegas score
   - DOME or current forecast summary.
5. Missing/stale weekly evidence must display unavailable rather than silently falling back to preseason panel rank.

## Workstream B — waiver/team-needs v3
Build a roster-relative acquisition model around legal lineup improvement and future capacity cost.
- Preserve only-active-QB/TE protection and Reserve/IR exclusion.
- Compute current team need by position from starters + best legal FLEX alternatives + bench contingency/upside.
- Evaluate each FA against the actual weakest legal replacement, not a global rank delta.
- Price the pending D/ST roster slot into any earlier acquisition.
- Surface rationale: need addressed, expected lineup/bench gain, drop cost, market/FAAB pressure, evidence freshness.
- Add regression tests including Coker -> only TE must never be actionable.

## Workstream C — trade/team-needs v2
Replace simplistic target-first 1-for-1 generation with bilateral roster-need evaluation.
- Determine PITTI needs and each opponent's needs independently from live Sleeper rosters.
- Respect current starter/FLEX geometry and replacement loss on both sides.
- Before Week 1, recent draft capital is strong revealed-preference evidence.
- Add a hard plausibility gate for severe recent-draft-capital reversals unless current verified news/value evidence explains the reversal.
- Prepare an adapter for current trade-value evidence; Justin Boone is preferred when a current public redraft chart is actually available. Do not fabricate it.
- Allow 2-for-1/1-for-2 exploration only when roster capacity and both teams' utility improve and valuation evidence is sufficient.
- Acceptance probability is conservative heuristic, never fact.
- Regression: JSN -> Gibbs must not be surfaced as plausible near-even 1-for-1 under the current pre-W1 evidence.

## Workstream D — tests and release discipline
- Add executable regression tests for every invariant above.
- Run syntax/runtime startup, Candidate Package, Release Contract v2, Project Guardrails, and relevant Season E2E tests.
- Do not merge or deploy. Return a reviewable branch/PR with exact test results and unresolved evidence gaps.
- Update canonical checkpoint state with implemented behavior, tests, failures, and next gate.

## Evidence-source rule
Source integration is separate from presentation. Implement adapters/cache/freshness/provenance so that current verified Week-N projections, positional ranks, Vegas implied totals, weather/dome, and trade values can be hydrated. Do not hard-code guessed current values into app logic.
