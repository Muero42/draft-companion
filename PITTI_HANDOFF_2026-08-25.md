# PITTI HANDOFF — 2026-08-25 21:16 CEST

## Source of truth for next chat
Read this file first, then verify current branch/artifacts. Do not reconstruct from older chat memory. Where an older checkpoint conflicts with this file, this file wins for Draft Companion state, rc4.64 recovery, simulation policy, and immediate next actions.

## Immediate state
- User has already installed Draft Companion v11.8.0-rc4.64 on Android.
- Next required gate: open Companion and verify runtime actually reports v11.8.0-rc4.64 and behaves normally. Then run a natural Sleeper mock.
- rc4.63 commit `a106b39dcf72fed6e0ac151382bc9ba19316fdb6` remains verified rollback baseline until Android verification of rc4.64.
- rc4.64 recovery branch: `pitti-rc464-recovery-fixtures`.
- Machine-gated candidate package: `dist/Draft_Companion_v11.8.0-rc4.64_FULL_TEST.zip` / `dist/PITTI-rc464.zip`.
- Expected SHA-256: `494c0335066f70f30b772cbbb23948d975fead9555d6afb6fa9964b78e70f4b3`.
- Full candidate gate run `32887208172`: SUCCESS. Candidate package persisted at branch commit `dbae4f9a64c9eee7b5732807294182a944296693`.
- The installation ZIP was also downloaded into chat and independently matched the expected SHA before the user installed it.

## rc4.64 causal repair
Natural rc4.63 mock exposed repeated-QB/TE behavior. Root cause was narrowed to Player-Quality Safety running after roster scoring and being able to resurrect an already-demoted QB2/TE2 because that repeated position had the strongest panel rank.

Repair is intentionally narrow:
- Safety promotion may not resurrect an already-rostered QB/TE after roster scoring demoted it.
- First QB / first TE remain normal candidates.
- A QB2/TE2 that naturally wins before Safety remains allowed; this is NOT a global QB2/TE2 ban.
- Existing rc4.63 exceptional-slide thresholds are reused exactly: QB panel rank <=45 plus slide >=35 picks; TE panel rank <=35 plus slide >=30 picks.
- No new generic QB/TE penalty family, global position cap, target roster quota, player-name forcing, PairSum, Rolling, or Late-WR quota.
- Deterministic mechanism candidate commit: `4df014a9d63fa4bbff293b27e26685c585f22229`.

## Validation already passed
Full candidate gate passed syntax, Safety-resurrection regression, dress-rehearsal hardening, position path, player-quality/expert-health, Return geometry/market, scarcity double-count, alternative scarcity/Late-WR saturation, IR/PUP/fetch, rc4.41 research-cache quota, rc4.42 ranking-storage quota, rc4.61 live-surface semantics, semantic Mock/LIVE parity, hard QB exclusions, acute-status guard, snapshot fingerprint, Return-v2, version/cache consistency, ZIP integrity.

Two red runs during recovery were TEST-HARNESS defects, not Companion regressions:
1. `Draft_Companion_IR_Stash_And_Fetch_Regression_2026-08-13.js` had an obsolete hard-coded rc4.13 version expectation; made version-agnostic while preserving IR/fetch semantics.
2. `RC4_61_LIVE_SURFACE_REGRESSION.js` incorrectly required current app/index to remain rc4.60; historical staged rc4.61 module remains pinned, current release marker is now accepted.
Do not rediscover these as product bugs.

## Critical simulation correction
The synthetic full-roster utility/harness produced implausible mean roster construction around 3.108 QB / 3.883 RB / 6.450 WR / 1.558 TE. Therefore synthetic full-roster Championship Utility is diagnostic only and MUST NOT independently promote production changes until its roster validity is repaired.
The 6.45 WR figure itself is not the principal problem; >3 QB average is the alarm.
Current promotion evidence order: natural decision fixtures -> mechanism controls/regressions -> prospective natural Sleeper mock. Do not restart broad synthetic threshold optimization before the real draft.

## Quarantined/rejected approaches
Do not revive without genuinely new evidence:
- PairSum / Rolling families.
- Broad Safety threshold tuning / generic QB2-TE2 penalty families that lost paired utility or caused collateral effects.
- Late-WR Near-Tie / WR-to-RB tweak as a solution to the main roster problem; it did not solve the >3 QB pathology.
- Global QB/TE/RB/WR caps or forced target roster distributions.
- Player-name forcing.
- Any old already-resolved Runtime/UI/Storage defect as a fresh TODO.
- Do not interpret an old red GitHub Actions badge/run as current failure without checking whether it was one of the known zero-job/parser or hard-coded-version harness failures.

## Closed defects that must stay closed
rc4.63 already contained fixes for draftphase/Next Pick, pre-draft display, completed state, Fried-view crash, Mock/LIVE decision hierarchy/parity, research/ranking localStorage quota issues and other previously verified runtime/UI fixes. Regression gates protect these. Do not reopen absent new evidence.

## League / real-draft invariants
- League: 10 teams, Half-PPR, 15 rounds.
- Starters: QB, 2 WR, 1 RB, 1 TE, 2 Flex, K, DST; bench 6.
- User draft slot: 9. Snake turn geometry must remain correct; after 3.09 comes 4.02, not 4.09.
- Real draft: 2026-08-31, about 2 minutes per pick, primarily on phone.
- K/DST are deliberately not drafted by the Companion strategy; use late roster capital on upside instead.
- Bench WR are allowed. The maximum of four WR concerns simultaneous starters (2 WR + 2 Flex), not a roster cap.
- Typical intent: one QB and one TE; QB2/TE2 only for exceptional value or a separately justified strategy case. QB3 should effectively never be a normal recommendation.
- Hard QB exclusions: Geno Smith and Aaron Rodgers must not appear in the user's QB path.
- Bye weeks are secondary, not a primary drafting constraint.

## Draft decision policy that must persist
- Use fresh evidence, but perform an independent Companion/assistant evaluation first; external expert tools are corroboration, not a substitute for the primary recommendation.
- Relevant evidence at each pick includes current Sleeper market/ADP, expert rankings, injuries/camp/role/depth-chart information, receiving/goal-line/offense context, Return-v2, opponent demand, reach/opportunity cost and roster fit.
- Personal user preferences/upside views are legitimate tie-breakers among close viable candidates. A user selection from the plausible shortlist is not automatically a model failure. Flag only when it is clearly outside the viable set or violates a hard rule.
- At each user pick show a somewhat broader set of genuinely viable candidates, while still clearly identifying favorite(s) and alternatives. Do not pad with irrelevant names.
- Return probability is a timing/opportunity-cost input, not by itself the draft conclusion. Do not duplicate Return-v2 with another generic reach penalty without evidence.
- Candidate `Parker Washington` remains a known value/reach-analysis example; do not player-force him. Opportunity cost and return likelihood govern timing.
- Emergency live fallback remains: if Companion/Snapshot fails, user sends a screenshot of the Sleeper available-player list; choose from visible players plus cached research and state clearly if Return-v2 is unavailable.

## Snapshot / live-draft protocol
- App-Version must be present in snapshots and used to detect stale/mismatched runtime state.
- Duplicate/same-state snapshots must be recognized. If an on-clock snapshot is stale, request the fresh current-pick snapshot immediately rather than analyzing the old state.
- During live-style rehearsal, after an own pick pre-analyze the next turn automatically; on-clock behavior must fit the real ~2-minute budget.
- Snapshot status before the first pick is sufficient for bulky baseline/state information; avoid unnecessary repeated oversized snapshots when state has not materially changed.
- Mock and LIVE must share the same decision hierarchy/candidate source; do not accept UI-only parity while recommendation logic diverges.

## Natural mock policy
- Natural Sleeper mocks now have higher evidentiary value than the invalid full-roster synthetic optimizer.
- Do not artificially choose players to make a theory look good. Let the Companion act naturally and capture real decision points.
- When a simulated draft is complete and the user says `AUTO`, do NOT automatically start another mock. First perform post-draft work on the completed simulation: conclusions, anomaly diagnosis, counterfactuals/validation as justified, and only then propose/start another mock if explicitly requested.
- Natural-mock anomalies must become reproducible decision fixtures before code is changed where feasible.

## Research layers that must not disappear
These are ongoing evidence layers, not a reason for a major pre-draft redesign:
- Breakout / young-player / residual-value mispricing layer: position-specific, focused on predictive information not already priced into ADP/expert ranks; avoid double-counting expert consensus.
- Decline/downside-risk layer: especially RB but also WR/TE/QB; age, NFL tenure, cumulative/recent workload, injury type/severity/recurrence, efficiency/athletic decline, role/competition and team incentives. Goal is to identify imminent cliffs not yet fully priced by market/panel.
- Analyst/source calibration remains useful: Pat Fitzmaurice is a key decider/recon source; Derek Brown especially useful for TE; broader expert evidence is supporting input, not a hard override.
- Before the real draft, refresh rankings/ADP/injury/news inputs; the night-before and immediately-pre-draft refresh/backup workflow remains important.

## Autodraft / emergency resilience
- Before the real draft, preserve the low-effort Sleeper autodraft fallback: a deep draft-room Queue derived from Companion rankings, omitting K/DST and deprioritizing QB2/TE2. Sleeper has no supported custom-ranking import and the public API is read-only.
- This Queue is an emergency fallback, not the preferred live workflow.
- Keep a known-good rollback package available; do not overwrite the only verified version during testing.

## Watcher / post-draft scope
- Pitti Watcher remains a separate post-draft/FA/waiver/injury/trade workstream and must not be silently forgotten.
- However, this handoff does NOT assert a newer Watcher deployment/runtime state than has been separately verified. Do not revive stale Watcher debugging instructions merely because they exist in older notes.
- Draft Companion readiness and natural mock validation are the immediate critical path. Watcher work may proceed in parallel only when it does not endanger that path.
- After the real draft and through Week 1, compare free agents against the roster quickly; post-draft FA/waiver reaction speed is strategically important.

## PC / external-tool protocol
- `PC` means the user is currently at and logged into a PC. It is a general availability signal, not a single Watcher command. On `PC`, determine the latest genuinely PC-dependent pending actions from the current checkpoint and prioritize them by value/dependency.
- FantasyPros or other PC-only parallel tools can be used when available, but the assistant/Companion must still perform its own evaluation first.
- Do not make the user manually repeat data collection that can be deferred until PC availability or performed autonomously elsewhere.

## STATUS protocol
- `STATUS` / `STATUS?` means check whether a long-running task is genuinely progressing or stuck/failed.
- Do not intentionally interrupt useful ongoing work just to answer status.
- If stuck/failed, diagnose and resume from the last reliable checkpoint without requiring the user to reconstruct the task.

## Time / release policy
Real draft is 2026-08-31. Major redesigns are frozen. Recovery -> natural mocks -> only small, evidence-based, low-risk fixes. Do not spend remaining time seeking a theoretically perfect general model.
Larger changes are avoided where possible, but this is not an absolute ban: a materially necessary change with strong evidence may still be made if it is the safer path to draft readiness.

## AUTO operating protocol — mandatory
`AUTO` means execute, not narrate intent.
- Run the longest stable autonomous block possible.
- Always look for independent work that can proceed in parallel while another gate/run is pending. Waiting time is work time whenever a safe independent track exists.
- Do not answer with `AUTO läuft`, status-only polling, apologies about prior status messages, or promises to continue.
- Return only for a material result, a genuinely unavoidable user action/input, or a blocker after autonomous diagnosis/research.
- If a step fails, diagnose root cause and reassess the end-to-end plan; do not cycle through variants or repeat an already failed path without new evidence.
- Preserve checkpoints promptly after material changes.
- Prefer direct downloadable installation ZIPs in chat when phone installation is required; do not make the user navigate GitHub branches/artifacts unnecessarily.
- Everything the assistant can safely do itself should be done autonomously; user interaction should be one verified step at a time only when genuinely necessary.
- Do not create meta-loops about AUTO behavior. If corrected, apply the correction and continue rather than responding with another process-status message.

## Immediate next actions
1. User opens installed Companion. Verify visible runtime version is v11.8.0-rc4.64; inspect first screen/snapshot for obvious cache/runtime regression.
2. If clean, proceed directly to a natural Sleeper mock with realistic decision flow; collect actual decision fixtures, not synthetic roster averages.
3. Evaluate any anomaly causally against rc4.63/rc4.64 behavior. Only small fixes with deterministic regression + Mock/LIVE/package gates may be promoted.
4. Preserve rc4.63 rollback until rc4.64 Android/runtime + natural mock gate is passed.
5. In parallel, without delaying the Android/mock gate, keep draft-input freshness, emergency Queue readiness, and outstanding draft-critical research/checkpoint hygiene on the radar.

## User-side state
At handoff time user had already installed rc4.64. GitHub mobile screen showed README active release v11.8.0-rc4.64 plus harmless `Compare & pull request` banners and `main branch isn't protected`; no user action is required for those GitHub notices.

## Anti-regression rule for the next chat
Before changing code or reopening an issue, first check this handoff, the rc4.64 recovery gate/validation files and the actual current artifact/runtime state. An older TODO, older branch, red historical workflow, screenshot, or remembered defect does not override a newer verified fix. If evidence conflicts, prefer the newest directly verified runtime/artifact state and diagnose the discrepancy before acting.
