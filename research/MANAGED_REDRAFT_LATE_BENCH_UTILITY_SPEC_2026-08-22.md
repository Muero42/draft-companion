# Managed-Redraft Late-Bench Utility — preregistration 2026-08-22

## Objective
Improve Championship Utility for the user's shallow managed 10-team Half-PPR league. This is not Best Ball portfolio logic and not a hard late-RB rule.

## Core hypothesis
For late bench slots, season-long median projection can underprice players whose favorable role state has high ceiling and resolves early. Active waivers/FAAB make a failed early bet cheaper than a low-upside season-long bench clogger. Conversely, pure contingent upside with no standalone use, slow information and expensive opportunity cost can be overrated.

## Research-only utility components
For candidate p at pick t, retain canonical player quality as the base and expose these additional diagnostics before any numeric promotion:
- TailCeiling: conditional starter-level ceiling in favorable role state.
- RoleProbability: evidence-calibrated probability of reaching that state.
- TimeToInformation: expected weeks until role thesis is materially resolved.
- DropFlexibility: how cleanly the player can be churned if thesis fails.
- ReplacementCost: expected waiver/FAAB cost of replacing the roster slot.
- StandaloneStartability: usefulness while waiting for upside state.
- Injury/DeclineRisk: downside layer already required project-wide.
- ReturnProbability: existing Return-v2 timing signal.

## First causal test form
Do NOT tune coefficients on outcome data yet. First test whether the existing Coach systematically selects dominated late-bench profiles by pairwise dominance review:
A dominates B for managed-redraft bench utility only when A is no worse on canonical quality within a small tolerance, has at least as much plausible tail upside, resolves no later, and is no harder to drop/replace, with no materially worse injury/role evidence.

If repeated dominated choices exist, then preregister a bounded utility adjustment on fresh seeds. If not, do not create a new numeric layer merely because the concept sounds appealing.

## Candidate archetypes for evidence review
- ambiguous-backfield RB with real standalone/goal-line path (e.g. Chris Rodriguez / Bhayshul Tuten competition);
- young WR with first-team role evidence and large target/red-zone tail (Denzel Boston, Ja'Kobi Lane type);
- cheap late TE with high-end per-route/per-game tail (Dalton Kincaid type), relevant to early-TE replacement value;
- returning injured high-ceiling WR where medical uncertainty may make waiver-watch preferable to draft investment (Tank Dell type);
- existing value target with role evidence but current minor injury gate (Parker Washington).
Examples are diagnostic only; no named player receives a rule.

## Anti-overfit rules
- no numeric sleeper-list bonus;
- no hard RB/WR/TE quota;
- no Best Ball stacking/portfolio bonus imported into managed redraft;
- no outcome tuning on the same seeds used to discover the mechanism;
- repeated analyst articles about the same role thesis count as one underlying evidence family;
- current primary-source role/health evidence outranks stale preseason narrative;
- canonical quality, Return-v2 and roster feasibility remain separate layers.

## Promotion ladder
1. pairwise dominance audit of actual Coach late picks;
2. identify repeated mechanism, not named-player miss;
3. preregister one bounded adjustment if warranted;
4. small CRN causal screen;
5. fresh held-out seeds;
6. realistic full-mock matrix;
7. production only if incremental Championship Utility survives and pick-level behavior remains plausible.
