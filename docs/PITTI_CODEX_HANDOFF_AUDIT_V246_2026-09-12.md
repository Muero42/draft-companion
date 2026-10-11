# PITTI CODEX HANDOFF AUDIT — v246

Use this as a **read-only independent audit** before the next chat promotes or merges the active P0 restore work.

## Authority to verify first

Do not trust this file, the bridge, chat memory, or stale checkpoint aliases without fresh verification.

Expected live authorities at creation time:

### Draft Companion

- repo `Muero42/draft-companion`
- canonical `main` expected at `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- active PR #162 expected OPEN / ready / mergeable
- #162 base expected `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- #162 head expected `a0e1208c00eade99a7d2e3a5ddb5f5e2a2b7a5bb`

### PITTI Watcher

- repo `Muero42/pitti-watcher`
- canonical `main` expected at `90473a6e7b5a79097a8a0816329113a8c492698b`
- active PR #6 expected OPEN / ready / mergeable
- #6 base expected `90473a6e7b5a79097a8a0816329113a8c492698b`
- #6 head expected `77221ceeb900458e95c32d78c1ad395a37422e5d`

If any expected mutable fact differs, record the live fact and treat it as an authority conflict. Do not silently coerce reality back to the expected value.

## Audit mode

READ-ONLY ONLY.

- Do not edit files.
- Do not create/amend commits.
- Do not push.
- Do not merge.
- Do not deploy.
- Do not clear caches, app data, or local evidence.
- Do not create a replacement PR.
- Do not change Cloudflare settings.

## Required audit A — bridge completeness and stale-authority defense

Read:

- `docs/PITTI_BRIDGE_HANDOFF_V246_2026-09-12.md` from branch `pitti/handoff-v246-20260912`
- current-main `PITTI_CURRENT_STATE.json`
- current-main `PITTI_EXECUTION_LOCK.json`
- current-main `PITTI_COMMAND_CONTRACTS.json`
- current-main `PITTI_HANDOFF_SEAL.json`
- current-main `NEW_CHAT_HANDOFF_CURRENT.md`
- current-main `PITTI_NEW_CHAT_BOOTSTRAP.md`
- current-main `PITTI_PROJECT_STATE.md`
- current-main `PITTI_AUTO_PREFLIGHT.md`
- `AGENTS.md`

Confirm that the bridge correctly identifies the v245 checkpoint set as stale where it conflicts with newer live facts and that the bridge does not accidentally demote or overwrite newer source/production/device evidence.

Specifically verify these newer facts are preserved distinctly:

1. source main advanced through PR #161 to `c9f7eb1...`
2. verified Cloudflare Production success exists for `493e5aa...`, deployment `81598205-07db-47c9-93ef-3a968d460682`
3. physical Android/PWA rc4.198 was observed without cache clear/reinstall
4. first physical blocker was `STORAGE_QUOTA_EXCEEDED`
5. later physical blocker was `TIMEOUT`
6. later physical Watcher state was FAIL with no versioned Research Cache visible
7. the bridge does **not** falsely claim physical proof that `c9f7eb1...` itself was deployed/served
8. PR #162 and Watcher PR #6 are described as pending candidates, not merged/production/device-accepted facts

Report every material omission, contradiction, stale alias risk or ambiguous wording.

## Required audit B — Draft Companion PR #162

Audit exact head `a0e1208c00eade99a7d2e3a5ddb5f5e2a2b7a5bb` against base `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`.

Read the full diff and all changed files. Verify the implementation and tests, not just the PR body.

Required checks:

1. Optional weekly-rank latency is actually bounded so a slow rank lane cannot consume the full client timeout.
2. Projection retries are bounded and cannot exceed the intended total client boundary in a way that recreates the timeout.
3. HTTP 429 is never retried and Retry-After/provider backoff semantics are not weakened.
4. 4xx non-429 behavior is not accidentally retried.
5. unrelated APIs are not intercepted by the new service-worker path.
6. service-worker routing cannot recursively proxy or double-fetch the same `/api/fantasypros` request.
7. CacheStorage/static asset behavior remains bounded and live API results are not accidentally cached as static content.
8. #161 storage-quota behavior is preserved: protected research, return validation and active decision evidence are not intentionally pruned by this repair; projection-only fallback remains available.
9. rank failure cannot erase otherwise valid projection records.
10. no Sleeper projection/matchup evidence, season rank fallback, cross-position rank arithmetic, or fabricated selected PITTI panel evidence is introduced.
11. runtime manifest remains exactly the expected canonical set; no accidental runtime-file omission.
12. existing release/guardrail/package/security tests remain applicable and exact-head checks are genuinely green.

Also state clearly whether #162 is only an operational latency mitigation or a full structural projection-before-rank persistence refactor. The expected answer is the former unless the actual diff proves otherwise.

## Required audit C — PITTI Watcher PR #6

Audit exact head `77221ceeb900458e95c32d78c1ad395a37422e5d` against base `90473a6e7b5a79097a8a0816329113a8c492698b`.

Required checks:

1. market/trending and player-state health are genuinely independent.
2. market PASS survives player-state FAIL/STALE without leaking stale fundamental evidence.
3. player-state PASS survives market FAIL/STALE without leaking stale market evidence.
4. all-unhealthy remains fail-closed.
5. ownership filtering still excludes all owned players from free-agency candidates.
6. a missing/unavailable league state cannot produce actionable free-agency output.
7. scheduled collectors still delegate to the existing implementation and cron behavior is unchanged.
8. no D1 migration is introduced.
9. no automatic Sleeper transaction is introduced.
10. the wrapper cannot accidentally double-run scheduled collectors or duplicate evidence writes.
11. response schema changes are compatible with current Draft Companion consumer expectations or are safely additive.
12. Cloudflare preview/test success corresponds to the exact head.

## Required audit D — cross-repo integration risk

Assess the interaction between #162 and Watcher #6 as one P0 restore package.

Focus on:

- whether the Draft Companion UI will correctly interpret the Watcher v0.2.7 `gate` structure
- whether current consumer code treats `gate.overall=PASS` as sufficient while preserving lane-level warnings
- whether `events`, `market`, `freeAgency` shape changes remain compatible
- whether restoring market-only mode could create a false impression that player-state/injury evidence is also current
- whether any UI wording must be updated before production so partial-lane health is transparent

If integration is unsafe, identify the smallest concrete repair and exact existing PR branch to use. Do not create a new branch or PR.

## Required audit E — handoff regression inventory

Confirm the bridge preserves these non-negotiable invariants:

- live Sleeper current league state is roster/ownership authority
- IR/Reserve not ordinary drop
- K vs K only
- TE2 can be legal through FLEX
- draft-only QB2 constraint does not become a season roster cap
- no automatic transaction
- rank/projection independence
- no cross-position rank arithmetic
- no fabricated expert-panel evidence
- game/weather/opponent/lock stays unavailable when unverified
- source/package/production/device states remain distinct
- archive SHA is not cross-environment canonical identity
- no manual cache/app-data clearing or reinstall as diagnostic shortcut
- protected evidence retention remains explicit

## Tests / evidence to inspect

For Draft Companion #162 inspect exact-head check runs and relevant regression coverage including at least:

- package
- behavioral-contract
- pitti-cloud-validation
- project guardrails
- Cloudflare Pages preview
- `tools/season-fp-proxy-resilience-regression.mjs`
- existing Weekly Evidence / Start-Sit / storage-quota regressions affected by the change

For Watcher #6 inspect exact-head test runs and Cloudflare Workers preview plus the new lane-isolation tests.

## Output contract

Return one report with these exact top-level sections:

1. `AUTHORITY_VERDICT`
2. `BRIDGE_HANDOFF_VERDICT`
3. `PR162_VERDICT`
4. `WATCHER_PR6_VERDICT`
5. `CROSS_REPO_INTEGRATION_VERDICT`
6. `REGRESSION_INVARIANTS_VERDICT`
7. `BLOCKERS_BEFORE_MERGE`
8. `SAFE_NEXT_SEQUENCE`

For each verdict use exactly one of:

- `PASS`
- `PASS_WITH_NONBLOCKING_NOTES`
- `FAIL_CLOSED`

Every blocker must cite the exact repository/path/function/test or live authority fact that caused it.

End with a machine-readable compact line:

`CODEX_HANDOFF_AUDIT_RESULT=<PASS|FAIL_CLOSED>;PR162=<PASS|FAIL_CLOSED>;WATCHER_PR6=<PASS|FAIL_CLOSED>;CROSS_REPO=<PASS|FAIL_CLOSED>`

Do not claim a merge, deployment or device acceptance occurred during this audit.
