Generation: `20260911T1352Z-v242`
AUTO queue takeover: load CURRENT active/ready lanes and continue them in the same turn within user-authorized scope.
No device-side trial-and-error. Empty assistant response after tool work is forbidden. Never send status/progress/acknowledgement messages during AUTO while executable work exists.

# PITTI NEW CHAT BOOTSTRAP — v242

Source/runtime v11.8.0-rc4.196 is merged through PR #143; merge commit `555487237c9075d5e5ceeb1fee196f4763f87cc3` is historical provenance and current main must be verified dynamically. v11.8.0-rc4.195 remains production/device authority. rc4.196 is not deployed or physically accepted; deployment parity is UNKNOWN_REQUIRES_REVERIFICATION. Its local package identity is 17 files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, PACKAGED_ONLY_NOT_DEPLOYED.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify local repository identity, branch, HEAD and working tree against canonical Git/GitHub remote, main HEAD, relevant PR state and exact-head CI. If evidence is unavailable or contradictory, stop the dependent action fail-closed. Then follow the currently user-authorized work package. A source commit or merge never proves deployment parity or physical device acceptance.

Historical v235 provenance (not an operative boundary): see PITTI_CURRENT_STATE.json historical_superseded.v235_local_request. Verify current file and branch authority dynamically.

AUTO/AUTO BLOCK continuous same-turn execution; checkpoint/re-inventory after every package; waiting blocks only dependent lane; STATUS report-only.

Canonical permission boundary: AGENTS.md. Deterministic local validation: `node tools/strict-suite.mjs`; dynamic takeover: `node tools/takeover-authority.mjs <fresh-github-evidence.json>`. The evidence file is an external observation, never tracked CURRENT status. Read the schema and limits in PITTI_CODEX_WORK_PACKAGE.md.

QB2 phase authority: Draft: after QB1, QB2 recommendation/drafting is excluded until a future explicit user decision. Season: context-dependent QB2 exceptions through waiver/free agency/trade/roster optimization remain possible with verified evidence and legal capacity; same-bye and future D/ST costs matter. Season exceptions never retroactively weaken the draft rule. Canonical machine policy: PITTI_CURRENT_STATE.json:qb_policy.

Earlier rc4.190/rc4.192/rc4.194 identities are historical and cannot override the v242 authority above.

rc4.196 source is MERGED/HISTORICAL through PR #143; rc4.195 remains production/device authority. rc4.196 deployment parity is UNKNOWN_REQUIRES_REVERIFICATION and no physical acceptance is claimed.
