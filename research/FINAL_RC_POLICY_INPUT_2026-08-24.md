# FINAL RC policy input — 2026-08-24

This file documents the minimal release changes to apply on a separate RC branch derived from the verified rc4.52 lineage. It does not itself alter runtime behavior.

1. Preserve selected-panel/tier-first quality safety and dynamic top-candidate visibility.
2. Do not hard-code Chase Brown/Bowers/other player winners into the runtime.
3. Replace permanent QB2/TE2 suppression with phase-sensitive duplicate handling: strongly suppress early/mid duplicates; permit late exceptional value/optionality to remain visible and draftable.
4. Add explicit acute-status handling so a manually flagged unresolved player cannot be presented as an ordinary healthy recommendation. Status must be transparent and easy to update/remove without architecture changes.
5. Retain hard exclusions for Geno Smith and Aaron Rodgers in the user's QB path.
6. K/DST remain excluded from user drafting policy.
7. Acceptance, not research score, is promotion gate: full realistic slot-9 drafts on fresh/disjoint seeds must show no repeated pathological early picks or deterministic position/player concentration.
