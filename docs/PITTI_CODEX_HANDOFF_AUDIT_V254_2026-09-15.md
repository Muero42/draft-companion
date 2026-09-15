# PITTI Codex handoff audit v254

Generation: `20260915T1206Z-v254`.

Status: `PASS`.

The audit scope is authority-only. Runtime/product bytes must remain identical to canonical base `8baf1799589550373d36357258d6d882e79e9842`. The audit rejects rc4.203 as current source, PR #175 as a current runtime lane, `ros=false` as weekly semantics, or any claim that RC4.204 is already Production-deployed, device-observed, or device-accepted.

Independent disk re-read confirmed generation `20260915T1206Z-v254`, source `v11.8.0-rc4.204`, gate `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`, and a final PASS/ready/second-pass seal. Canonical source is `main@8baf1799589550373d36357258d6d882e79e9842`, with PR #176 repair head `fe8b6a397dac2b60522cb959ffdb225b767fbcae`. The scan found only explicitly historical v252/v253 claims and this audit's negative assertions; no operative stale-current claim remained.

Latest Production/device authority remains `v11.8.0-rc4.203` at `main@fb458e076de6710a91f1162e504b5b79fb67167c`, deployment `ef65bcf6-92d1-4c34-9873-c362bec002c7`, with `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`: FAILED/NOT ACCEPTED. PR #175 remains historical/discoverable handoff-only evidence. `stats.points_half` remains Half-PPR authority and the archive SHA remains run/environment-scoped.

The postmerge authority contract/regression, PITTI guardrail, runtime startup, release completeness, seal integrity, `git diff --check`, required runtime-byte comparisons, and strict suite passed on the reconciled bytes. No runtime/product behavior changed.
