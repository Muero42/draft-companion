# AGENTS.md — PITTI Companion implementation contract

## Authority and scope
- Canonical permission contract: this file, section `PITTI Codex permission contract`. Current user instructions define each work package and override historical permissions. Verify the coupled v234 CURRENT/SEAL through `node tools/pitti_guardrail_check.mjs` and the dynamic Git/GitHub takeover contract before dependent continuation or promotion.
- Treat `PITTI_CURRENT_STATE.json`, `PITTI_EXECUTION_LOCK.json`, `PITTI_COMMAND_CONTRACTS.json`, and the latest handoff/checkpoint as authoritative. Do not resurrect historical PRs, draft-era roster state, rejected device versions, or superseded fixes.
- Current mode is POST_DRAFT_SEASON_COMPANION. Sleeper live league state is roster/ownership/starter/reserve/FAAB authority. Draft data is historical evidence only.
- Work on a feature branch. Never deploy, merge, clear caches, reinstall the app, execute fantasy transactions, or contact third parties unless the task explicitly authorizes it.

## Working method
- Inspect existing implementation and regression tests before editing. Prefer root-cause fixes over additive patches.
- Preserve previously verified fixes. If a requested change conflicts with an invariant, fail closed and explain the conflict in the PR/test output rather than silently weakening the invariant.
- Run the repository's strict gates after material changes. A change is not complete while a reproduced failure remains.
- Do not fabricate projections, rankings, weather, Vegas lines, trade values, ownership, FAAB, injuries, or matchup data. Missing/stale evidence must render as unavailable/fail-closed.
- UI changes must be mobile-first and must not duplicate the same decision information across Kader, Waiver, Trades, and Live surfaces.

## Season roster / lineup
- Canonical starter geometry: QB, RB, WR, WR, TE, FLEX(RB/WR/TE), W/R(RB/WR), K, DST. Bench 6 plus one Reserve/IR.
- Starter maxima are not roster caps. Two TE are legal because FLEX accepts TE.
- Reserve/IR is never an ordinary active drop candidate.
- Never recommend dropping the only active QB or only active TE for a different position.
- Kicker comparisons are K-vs-K only. D/ST decisions belong to the D/ST stream model.
- Weekly lineup rows should prefer verified Week-N positional rank and projected fantasy points. Team context may show verified implied team total / Vegas score and DOME or current weather. Never substitute preseason panel rank as a weekly projection.

## Waiver / free agency
- Evaluate live free agents against the actual current roster and legal roster capacity.
- Recommendations must be concrete ADD X / DROP Y only when evidence is sufficient; otherwise WATCH/HOLD/MONITOR.
- Model team need, replacement value, starter/FLEX improvement, bench upside, role/injury contingency, market competition, remaining FAAB, and the next mandatory roster-capacity event.
- A future D/ST add consumes an active slot and must be priced into any preceding acquisition.
- A QB2 is exceptional but not categorically forbidden in season; same-bye and second-drop costs matter.
- No automatic external transaction.

## Trades
- Generate trades from both teams' live rosters and needs. A player being useful to PITTI is not sufficient.
- Respect revealed preference from the just-completed draft, especially before Week 1. Do not propose implausible 1-for-1 upgrades that effectively assume an opponent immediately reverses a materially earlier draft choice.
- Use current trade-value evidence when available (Justin Boone is a desired anchor), plus roster fit, replacement loss, positional scarcity, recent draft capital, and manager/market context.
- Acceptance probability must be conservative and explicitly heuristic unless backed by current market evidence.
- Never mark a trade actionable when current valuation evidence is missing.

## Regression examples that must remain impossible
- Jalen Coker for Isaiah Likely when Likely is PITTI's only active TE.
- Any Reserve/IR player surfaced as an ordinary DROP.
- Kicker evaluated against RB/WR/TE.
- JSN-for-Gibbs presented as a plausible near-even 1-for-1 immediately after this league's draft solely because a panel rank happens to be close.
- Sleeper `roster_id` treated as historical draft slot.

## AUTO / handoff discipline
- AUTO means execute all independently available work without progress/acknowledgement chatter. Waiting on one external gate blocks only its dependent lane.
- STATUS is report-only.
- Never write “AUTO läuft weiter” unless actual tool/code work follows in the same turn.
- Never use an empty assistant message as a pseudo-continuation.
- Material decisions, reproduced failures, fixes, verification results, rejected approaches, and next gates must be checkpointed promptly.

## PITTI Codex permission contract
Within the authorized PITTI work package, these reversible actions are preapproved:
- Read/search the repository; create, edit and delete package-related repository files.
- Create/switch local work branches; make local commits; configure Git repository-locally without weakening global security.
- Fetch and fast-forward-only pull; push non-production work branches; create/update their pull requests.
- Run tests, linters, builds, guardrails, regressions, mutation and package/re-extraction checks; create harmless helper scripts and temporary workspace files.
- Install harmless project dependencies; read CI, diagnose failures and repair the work branch autonomously until its exact-head checks pass.

These actions require separate explicit authorization:
- Merge to main or another canonical/production branch; force-push; destructive reset or deletion of important/unsaved branches or work.
- Deployment, production promotion or publication.
- Changes, disclosure or transfer of secrets, tokens or credentials; security-sensitive system changes outside this workspace.
- External communication on the user's behalf; purchases or financial/legal obligations.
- Automatic Sleeper Add/Drop, FAAB bids or trades.

Technical sandbox approval remains independent of this content authorization. Report the exact command and purpose if the sandbox requires approval. Do not delegate a technically available approved development step to the user as a precaution.

## PITTI Codex budget guard — mandatory in every Codex work package
- This rule is persistent project authority, not a chat-memory preference. It applies after chat changes, handoffs, AUTO/AUTO BLOCK, and future checkpoint generations.
- Every PITTI Codex assignment MUST already contain the complete guard below when it is handed to Codex. The user must not have to remember or re-add it.
- AUTO/AUTO BLOCK never overrides or broadens this budget boundary.
- Codex is an engineering executor, not the project orchestrator. GitHub/PR/CI/Cloudflare/device follow-up stays outside Codex unless a later user instruction explicitly overrides this rule for that specific task.

```text
PITTI CODEX BUDGET GUARD

Optimize for minimum Codex/Work usage, not maximum autonomy.

Your scope is LOCAL ENGINEERING ONLY.

Allowed:
- read the minimum repository instructions and files required for this task
- inspect the exact relevant implementation paths
- implement the bounded code/test change
- run focused tests
- run the full required suite once after focused tests pass
- create one clean local commit
- report exact branch/head/tree, changed files, tests and remaining gate

Do NOT spend Codex time on:
- GitHub web/browser navigation
- creating or editing a Pull Request
- waiting for GitHub Actions
- reading CI results after publication
- Cloudflare dashboard navigation
- deployment
- checking Production visually
- device/manual physical acceptance
- screenshots
- routine GitHub state verification that can be done externally
- PR descriptions beyond a short suggested text
- handoff/authority bulk rewrites unless explicitly required by this task
- unrelated repository cleanup
- speculative refactors
- repeated repo-wide searches after the relevant code path is identified

Do not open a browser merely to perform GitHub or Cloudflare actions.

Efficiency rules:
1. Start from the explicitly supplied canonical SHA/state.
2. Inspect only the files/code paths needed to prove the root cause.
3. Do not perform a broad repository audit unless evidence makes it necessary.
4. Do not implement multiple speculative fixes.
5. If the root cause is not proven, add the smallest diagnostic needed and STOP at that diagnostic candidate.
6. Run focused regressions first.
7. Run the expensive/full suite only once, after focused tests pass.
8. If a focused test fails, diagnose that failure before rerunning large suites.
9. Maximum one implementation/retry cycle unless the second change is directly proven by the first test failure.
10. After a clean local commit, STOP. Do not publish, create PRs, monitor CI, merge or deploy.

You are authorized to approve and execute the local repository operations
required by this bounded engineering task without asking the user for
intermediate confirmation.

This authorization does NOT expand the task scope.
After the tested local commit, STOP.
Do not use the authorization to continue into GitHub UI, PR creation,
CI monitoring, deployment, Cloudflare, physical-device work, or unrelated
follow-up tasks.

If a task reaches a point where the next action is manual, GitHub/UI/cloud/device work,
stop immediately and report the exact action required.

Output only:
- root cause / finding
- files changed
- tests
- branch/head/tree
- exact next safe gate

No status chatter.
```

QB2 phase authority: Draft: after QB1, QB2 recommendation/drafting is excluded until a future explicit user decision. Season: context-dependent QB2 exceptions through waiver/free agency/trade/roster optimization remain possible with verified evidence and legal capacity; same-bye and future D/ST costs matter. Season exceptions never retroactively weaken the draft rule. Canonical machine policy: PITTI_CURRENT_STATE.json:qb_policy.
