# TE supply harness pre-execution correction — 2026-08-24

The descriptive TE-supply harness was reviewed before using any output. `decision.top` is a truncated diagnostic list and may omit the actually selected player, so treating `top` alone as the complete checkpoint candidate view can understate positional availability.

Status of schema-1 harness/workflow: **INVALID / NOT AUTHORIZED FOR EVIDENCE**, even if a workflow reports success.

Required correction before descriptive evidence use:
- construct each checkpoint candidate view from `decision.top` plus the actual chosen player reinserted when absent;
- increment schema;
- retain exact 60-seed / 57-Bowers-state fail-closed coverage;
- continue labeling the result DESCRIPTIVE ONLY, never causal;
- do not use this descriptive harness as a substitute for the true pick-12 causal branch.

Repository hygiene note: the earlier correction existed on side commit `bf8cda54b8fe4d222ac67e64ddf139b1daa70b6a`; this file re-establishes the guard on the canonical research lineage after branch reconciliation.