# PITTI mobile/cloud-first operating model — 2026-09-11

## Binding operating preference

Default PITTI execution should be mobile/cloud-first. The user's PC should be required only when a task genuinely needs a local desktop capability that cannot be replaced safely by a remote/cloud execution path.

Preferred order:
1. current ChatGPT chat + GitHub/connected cloud actions for authority checks, PR preparation, review, checkpointing, merge/deploy coordination and other reversible remote work;
2. Codex cloud/web/remote execution when available for repository coding, tests and longer-running implementation work;
3. phone browser / mobile ChatGPT for Cloudflare, GitHub and physical Android acceptance;
4. local PC only for a hard local-only dependency such as a non-cloudable local tool, local browser/CDP debugging, USB/ADB/device debugging, or local uncommitted state that cannot safely be reconstructed remotely.

Do not create a workflow that depends on the user's PC remaining powered on. Important work state must be committed/pushed to GitHub promptly and implementation should use a remote branch/PR so another cloud session can resume without the local checkout.

## Current implementation lane

Repository: `Muero42/draft-companion`
Branch: `pitti/rc4195-accepted-startsit-weekly-v1`
Draft PR: `#143`
Base authority at preparation: `main` at `8aedc4ea3b7b71591cbc45f971ccf85fe5167074`

Read completely before editing:
- `AGENTS.md`
- `PITTI_CURRENT_STATE.json`
- `PITTI_EXECUTION_LOCK.json`
- `PITTI_COMMAND_CONTRACTS.json`
- `NEW_CHAT_HANDOFF_CURRENT.md`
- `PITTI_HANDOFF_SEAL.json`
- `docs/RC4195_PHYSICAL_ACCEPTANCE_2026-09-11.md`
- `docs/STARTSIT_WEEKLY_SOURCE_AUDIT_2026-09-11.md`
- `docs/CODEX_STARTSIT_WEEKLY_CONTEXT_WORK_PACKAGE_2026-09-11.md`

## Cloud Codex bootstrap

When a Codex cloud/web/remote environment is available, use the existing remote repository and branch. Do not depend on the old local desktop checkout.

Paste this as the task:

```text
Repo: Muero42/draft-companion

Fetch origin and checkout the existing remote branch:
pitti/rc4195-accepted-startsit-weekly-v1

Reconcile live Git/GitHub authority first.
Read these files completely before editing:
- AGENTS.md
- PITTI_CURRENT_STATE.json
- PITTI_EXECUTION_LOCK.json
- PITTI_COMMAND_CONTRACTS.json
- NEW_CHAT_HANDOFF_CURRENT.md
- PITTI_HANDOFF_SEAL.json
- docs/RC4195_PHYSICAL_ACCEPTANCE_2026-09-11.md
- docs/STARTSIT_WEEKLY_SOURCE_AUDIT_2026-09-11.md
- docs/CODEX_STARTSIT_WEEKLY_CONTEXT_WORK_PACKAGE_2026-09-11.md

Then execute docs/CODEX_STARTSIT_WEEKLY_CONTEXT_WORK_PACKAGE_2026-09-11.md end-to-end in AUTO.

Binding order:
1. checkpoint physical rc4.195 acceptance
2. real Weekly Expert-Ranks ingestion
3. Start/Sit v6 with legal global slot optimization and cross-position-rank safety
4. canonical opponent/game context
5. verified matchup/weather/Vegas lanes only where robustly sourced

Preserve all rc4.195 Waiver/Trade/Boone/Weekly-Evidence physical-pass invariants.
Use remote/cloud state; do not require the user's PC or old local checkout.
Push all work to the same branch and keep Draft PR #143 updated.
Run and repair all relevant strict, regression, mobile Chromium, package/re-extraction and exact-head gates autonomously.

Do NOT merge.
Do NOT deploy production.
Do NOT clear cache/reinstall.
Do NOT execute Sleeper transactions or trades.
Stop only for a genuine authorization, security, source, sandbox or irreconcilable authority blocker.
```

## Session-resume contract

If a cloud/Codex session stops because of usage limits or environment expiry:
- never restart from scratch;
- fetch the current remote branch and PR;
- inspect the exact head, committed checkpoints and latest CI;
- resume only incomplete work;
- do not repeat already-green expensive test/research work unless the head changed or a required gate explicitly needs rerun.

## Mobile handoff contract

The mobile ChatGPT session should be able to continue all non-local work: GitHub authority checks, PR review, safe remote mutations, Cloudflare deployment coordination and Android canary review. If a manual action is unavoidable, provide one exact step at a time and return immediately to AUTO afterwards.
