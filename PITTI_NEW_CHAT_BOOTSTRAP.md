Generation: `20260903T0720Z-v232`
AUTO queue takeover: load CURRENT active/ready lanes and continue them in the same turn.
No device-side trial-and-error. Empty assistant response after tool work is forbidden. Never send status/progress/acknowledgement messages during AUTO while executable work exists.

# PITTI NEW CHAT BOOTSTRAP — v232

Canonical source: rc4.189 on canonical branch `main` (verify exact HEAD dynamically). Latest physical Android: rc4.188 PASS. Rollback: rc4.169. Deployment parity: UNKNOWN_REQUIRES_REVERIFICATION. PR #118 remains isolated/unmerged rc4.190 Codex work.

Current gate: `V232_GUARDS_THEN_LOCAL_CODEX_PULL_REAUDIT`. After checkpoint-only merge, update the local Codex clone and repeat the same read-only audit before writable Codex work.

AUTO/AUTO BLOCK continuous same-turn execution; checkpoint/re-inventory after every package; waiting blocks only dependent lane; STATUS report-only.
