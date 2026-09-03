Generation: `20260903T1200Z-v234`
AUTO queue takeover: load CURRENT active/ready lanes and continue them in the same turn within user-authorized scope.
No device-side trial-and-error. Empty assistant response after tool work is forbidden. Never send status/progress/acknowledgement messages during AUTO while executable work exists.

# PITTI NEW CHAT BOOTSTRAP — v234

Canonical source/runtime rc4.189 on main (verify HEAD dynamically); latest physical Android rc4.188 PASS; rollback rc4.169; deployment parity UNKNOWN_REQUIRES_REVERIFICATION. PR #121 / v233 MERGED/HISTORICAL; PR #118 OPEN / UNMERGED / NON-PRODUCTION.

Current gate: `LOCAL_AUTHORITY_REVIEW_ONLY_NO_REMOTE_ACTION`. Review the locally validated post-merge authority repair. No v233 merge or strict-CI gate remains. Its local post-merge read-only audit already ran and failed closed on residual state pointers. This work is local only: no push, merge, deployment, network access or PR #118 changes are authorized.

Local repair branch: `pitti/v234-postmerge-authority-repair`, based on verified main `2749537945ec7e6b96d95e2f6b55a26e455124fa` (historical base, not the containing repair commit). AGENTS.md and PITTI_CODEX_WORK_PACKAGE.md remain PR #118-only and are intentionally absent here.

AUTO/AUTO BLOCK continuous same-turn execution; checkpoint/re-inventory after every package; waiting blocks only dependent lane; STATUS report-only.
