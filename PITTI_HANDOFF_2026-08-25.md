# PITTI HANDOFF — 2026-08-25 21:16 CEST

## Source of truth for next chat
Read this file first, then verify current branch/artifacts. Do not reconstruct from older chat memory.

## Immediate state
- User has already installed Draft Companion v11.8.0-rc4.64 on Android.
- Next required gate: open Companion and verify runtime actually reports v11.8.0-rc4.64 and behaves normally. Then run a natural Sleeper mock.
- rc4.63 commit `a106b39dcf72fed6e0ac151382bc9ba19316fdb6` remains verified rollback baseline until Android verification of rc4.64.
- rc4.64 recovery branch: `pitti-rc464-recovery-fixtures`.
- Machine-gated candidate package: `dist/Draft_Companion_v11.8.0-rc4.64_FULL_TEST.zip` / `dist/PITTI-rc464.zip`.
- Expected SHA-256: `494c0335066f70f30b772cbbb23948d975fead9555d6afb6fa9964b78e70f4b3`.
- Full candidate gate run `32887208172`: SUCCESS. Candidate package persisted at branch commit `dbae4f9a64c9eee7b5732807294182a944296693`.

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

## Closed defects that must stay closed
rc4.63 already contained fixes for draftphase/Next Pick, pre-draft display, completed state, Fried-view crash, Mock/LIVE decision hierarchy/parity, research/ranking localStorage quota issues and other previously verified runtime/UI fixes. Regression gates protect these. Do not reopen absent new evidence.

## Strategy constraints
League: 10-team Half-PPR; QB, 2 WR, RB, TE, 2 Flex, K, DST; bench 6. Do not draft K/DST in Companion strategy. Bench WR are allowed; max four WR refers to simultaneous starters, not roster cap. Typical intent is one QB and one TE, with QB2/TE2 only for exceptional value/strategy; QB3 should effectively never be a normal recommendation. Freed bench capital should primarily become RB/WR upside.
Hard QB exclusions remain Geno Smith and Aaron Rodgers.

## Time / release policy
Real draft is 2026-08-31. Major redesigns are frozen. Recovery -> natural mocks -> only small, evidence-based, low-risk fixes. Do not spend remaining time seeking a theoretically perfect general model.

## AUTO operating protocol — mandatory
`AUTO` means execute, not narrate intent.
- Run the longest stable autonomous block possible.
- Always look for independent work that can proceed in parallel while another gate/run is pending.
- Do not answer with `AUTO läuft`, status-only polling, apologies about prior status messages, or promises to continue.
- Return only for a material result, a genuinely unavoidable user action/input, or a blocker after autonomous diagnosis/research.
- If a step fails, diagnose root cause and reassess the end-to-end plan; do not cycle through variants.
- Preserve checkpoints promptly after material changes.
- Prefer direct downloadable installation ZIPs in chat when phone installation is required; do not make the user navigate GitHub branches/artifacts unnecessarily.

## Immediate next actions
1. User opens installed Companion. Verify visible runtime version is v11.8.0-rc4.64; inspect first screen/snapshot for obvious cache/runtime regression.
2. If clean, proceed directly to a natural Sleeper mock with realistic decision flow; collect actual decision fixtures, not synthetic roster averages.
3. Evaluate any anomaly causally against rc4.63/rc4.64 behavior. Only small fixes with deterministic regression + Mock/LIVE/package gates may be promoted.
4. Preserve rc4.63 rollback until rc4.64 Android/runtime + natural mock gate is passed.

## User-side state
At handoff time user had already installed rc4.64. GitHub mobile screen showed README active release v11.8.0-rc4.64 plus harmless `Compare & pull request` banners and `main branch isn't protected`; no user action is required for those GitHub notices.
