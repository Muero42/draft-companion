# PITTI bridge handoff v254 — RC4.204 post-merge authority

Generation: `20260915T1206Z-v254`.

Canonical source is `v11.8.0-rc4.204` at `main@8baf1799589550373d36357258d6d882e79e9842`, merged by PR #176 from authorized head `fe8b6a397dac2b60522cb959ffdb225b767fbcae`. RC4.204 is not Production-deployed, device-observed, or device-accepted.

The proven repair omits `ros` from FantasyPros weekly requests that already specify season/week/position. It does not add `ros=true`, an unsupported scoring parameter, or any speculative query parameter. `stats.points_half` and all weekly fail-closed consumer gates remain authoritative.

Pre-merge validation recorded focused 7/7 PASS, strict 225/225 PASS, package/re-extraction PASS, and exact-head PR #176 CI PASS. Archive SHA `d9fc7432c5cbea4a48a3fda97c13151bb56e0a14a8ea7deeb81822faa51400f3` is run/environment-scoped evidence only.

Latest Production/device history remains `v11.8.0-rc4.203` at `main@fb458e076de6710a91f1162e504b5b79fb67167c`, deployment `ef65bcf6-92d1-4c34-9873-c362bec002c7`, with verdict `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`: FAILED/NOT ACCEPTED. PR #175 remains historical/discoverable v253 handoff-only evidence. The next gate is `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`; this handoff does not authorize or execute it.
