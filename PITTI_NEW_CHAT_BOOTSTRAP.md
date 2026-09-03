Generation: `20260903T0745Z-v233`
AUTO queue takeover: load CURRENT active/ready lanes and continue them in the same turn.
No device-side trial-and-error. Empty assistant response after tool work is forbidden. Never send status/progress/acknowledgement messages during AUTO while executable work exists.

# PITTI NEW CHAT BOOTSTRAP — v233

Canonical source: rc4.189 on canonical branch `main` (verify exact HEAD dynamically). Latest physical Android: rc4.188 PASS. Rollback: rc4.169. Deployment parity: UNKNOWN_REQUIRES_REVERIFICATION. PR #118 remains isolated/unmerged rc4.190 Codex work.

Current gate: `V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT`. All three strict gates must PASS on the exact sealed v233 head; then merge the checkpoint-only repair, update the local Codex clone, and repeat the same read-only authority audit before writable Codex work.

AUTO/AUTO BLOCK continuous same-turn execution; checkpoint/re-inventory after every package; waiting blocks only dependent lane; STATUS report-only.
