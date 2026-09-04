Generation: `20260904T1200Z-v234`
AUTO queue takeover: load CURRENT active/ready lanes and continue them in the same turn within user-authorized scope.
No device-side trial-and-error. Empty assistant response after tool work is forbidden. Never send status/progress/acknowledgement messages during AUTO while executable work exists.

# PITTI NEW CHAT BOOTSTRAP — v234

Source/runtime v11.8.0-rc4.190 in this tree (verify canonical main containment dynamically); latest physical Android rc4.188 PASS; rollback rc4.169; deployment parity UNKNOWN_REQUIRES_REVERIFICATION. PR #121 / v233 MERGED/HISTORICAL. PR #118 was last observed OPEN / UNMERGED / NON-PRODUCTION; retain that conservative boundary until fresh GitHub verification proves otherwise.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify local repository identity, branch, HEAD and working tree against canonical Git/GitHub remote, main HEAD, relevant PR state and exact-head CI. If evidence is unavailable or contradictory, stop the dependent action fail-closed. Then follow the currently user-authorized work package. A source commit or merge never proves deployment parity or physical device acceptance.

Historical v234 provenance (not an operative boundary): see PITTI_CURRENT_STATE.json historical_superseded.v234_local_request. Verify current file and branch authority dynamically.

AUTO/AUTO BLOCK continuous same-turn execution; checkpoint/re-inventory after every package; waiting blocks only dependent lane; STATUS report-only.

Canonical permission boundary: AGENTS.md. Deterministic local validation: `node tools/strict-suite.mjs`; dynamic takeover: `node tools/takeover-authority.mjs <fresh-github-evidence.json>`. The evidence file is an external observation, never tracked CURRENT status. Read the schema and limits in PITTI_CODEX_WORK_PACKAGE.md.

QB2 phase authority: Draft: after QB1, QB2 recommendation/drafting is excluded until a future explicit user decision. Season: context-dependent QB2 exceptions through waiver/free agency/trade/roster optimization remain possible with verified evidence and legal capacity; same-bye and future D/ST costs matter. Season exceptions never retroactively weaken the draft rule. Canonical machine policy: PITTI_CURRENT_STATE.json:qb_policy.
