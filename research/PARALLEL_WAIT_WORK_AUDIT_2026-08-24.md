# PITTI parallel wait-work audit — 2026-08-24

Status: research/support only. No rc4.63 or production mutation.

## Why this exists
A long-running external/CI task must automatically trigger a parallel-work scan. Waiting is not a reason to idle the project.

## Running 120-seed scale gate — infrastructure audit
Current scale commit: `68a61ac9af851ceb456085f85991a2a559b6dc0a` on `pitti-realistic-scale-20260824`.

The workflow runs 12 shards x 10 seeds, max-parallel 6, with 24-minute shard timeouts and a final evaluation job. Therefore an unchanged branch head for the first several minutes is not evidence of a hang.

### Reproducibility weakness found
The current workflow checks out the moving branch ref `pitti-realistic-scale-20260824` in every shard/evaluation job rather than the triggering commit SHA. Any concurrent write to that branch while the run is active could cause different shards to execute different repository states or make the final push race the branch head.

Operational rule for the current run: **do not modify the running branch until its result is persisted or the run is proven failed.** Parallel work must use a separate branch.

Future hardening: pin computation jobs to `${{ github.sha }}` (or an explicitly frozen commit SHA) and keep result persistence as a separate deliberate ref update/commit step.

### Observability weakness found
The connector's commit->workflow-run action exposes PR-triggered runs but not this push-triggered run. Branch-head polling only proves whether a result commit has landed; it does not show queued/running/failed status.

Future hardening should persist a tiny AUTO-readable lifecycle marker (`STARTED`, shard completion manifest, `PASS`/`FAIL`) or otherwise expose run identity without requiring a user screenshot.

### Result-granularity weakness found
The current final JSON persists aggregate choice counts and first-turn pair counts but does not persist the seed -> decision trace mapping. Aggregate counts are sufficient for prevalence, but exact paired counterfactual state regeneration is easier and safer if a compact per-seed trace is also persisted.

Future aggregate should include, at minimum, for each seed: own decisions at picks 9/12/29/32/49/52/69/72/89/92/109/112/129/132/149 plus compact position counts. This is small enough to persist and avoids an unnecessary second 120-draft pass merely to rediscover which seeds generated common states.

## Mid-draft preparation while scale runs
Do not invent a new score or hard-code players before seeing the 120-seed state frequencies. Prepare the analysis contract instead:

1. First focus states: 3.09/4.02 (picks 29/32), then 5.09/6.02 (49/52).
2. Candidate frontier for a state = union of selected-panel plausible candidates, current market plausible candidates, material Return-v2 pressure candidates, and independently supported PITTI targets.
3. Use common random numbers and force only the current decision; continuation remains frozen and outcome-blind.
4. Report availability at next own pick, roster construction, independent managed-mean utility, week-profile sensitivity separately, and health-regime sensitivity where relevant.
5. No production promotion from one lens or one state family.

## Current health/role delta checked 2026-08-24
- Ashton Jeanty: reported ankle sprain; not expected long-term, but return timeline still unknown. Keep explicit health-regime uncertainty; do not treat a 1.09 fall as automatic TAKE without a fresh status check.
- Christian McCaffrey: returned to team drills Aug 23 after a planned/tightness-related practice break; this materially reduces the earlier acute concern but does not erase age/workload decline-risk evaluation.
- Malik Nabers: progressed to team/live-speed work but recent reporting still had him in a no-contact phase with Week 1 medical clearance unresolved. Keep contact-clearance uncertainty.
- Jeremiyah Love: high-ankle sprain; expected to miss the remainder of preseason, team hopes for Week 1. This remains materially draft-relevant and should be a separate health regime in 3.09/4.02 analysis if he is in the frontier.

## Parallel-work policy going forward
Whenever an external run is pending, AUTO must scan at least these lanes before returning:
- independent research/evidence refresh,
- downstream analysis preparation,
- workflow/observability hardening,
- emergency/recovery readiness,
- checkpoint integrity.
Only work that could mutate the exact running branch/input state is blocked while a reproducibility-sensitive run is active.
