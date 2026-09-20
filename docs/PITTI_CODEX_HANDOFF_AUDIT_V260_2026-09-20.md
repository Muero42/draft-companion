# PITTI Codex handoff audit v260 — Independent Evidence Lane Diagnosis

Generation: `20260920T1100Z-v260`

Version: `v11.8.0-rc4.205`

Canonical main:
`2a08f856c7e72b0e1a9667e47e3e4467790d0f98`

Preserved physical classification:
`RC4.205_PR186_PHYSICAL_PASS_LAWRENCE_MAPPING_AND_GAME_CONTEXT_FAILURE_PROVENANCE`

## Independent diagnosis summary

Broad weekly Expert-Ranks are physically AVAILABLE.

Selected PITTI-Panel remains unavailable for a structural reason: the current Season weekly refresh consumes broad weekly ECR only, while selected expert acquisition remains draft/preseason infrastructure. FantasyPros documents exact expert filtering and a rankings/experts endpoint, so a bounded current-week selected-expert pipeline is feasible but not yet implemented.

Canonical game-context data remains unavailable because the Production Worker receives ESPN upstream HTTP 403. The failure-provenance repair is already physically proven; this is an upstream acquisition problem.

Team Total remains unavailable because the runtime has no approved same-event total+spread source. The existing `impliedTeamTotal` helper is not itself the blocker.

Opponent/weather remains dependent on restored complete game context. Weather must continue to require a fresh event-bound forecast for outdoor games.

## Repair boundary

A future repair may:
- add exact-current-week selected-expert FantasyPros filtering with identity/freshness/coverage validation;
- perform a bounded non-production ESPN schedule-source A/B test;
- only after event acquisition is reliable, evaluate one explicit ESPN odds-provider policy for same-event total+spread.

A future repair may **not**:
- rename broad ECR as PITTI-Panel;
- invent missing selected-expert votes;
- synthesize Team Total from projections;
- accept partial/inconsistent game schedules;
- relax weather freshness;
- expose raw upstream errors or credentials.

Next gate:
`SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_BOUNDED_REPAIR`

v260 changes authority/checkpoint/handoff validation only.
