# rc4.63 v3 near-tie result interpretation — 2026-08-25

Research-only. No production mutation.

## 120-seed result
Persisted paired v3 result on the exact baseline seed family `459820001..459820120`:
- QB 1.000 / TE 1.000 / K 0 / DEF 0
- RB 6.325 vs baseline 5.833 (`+0.492`)
- WR 6.675 vs baseline 7.167 (`-0.492`)
- all pick distributions through 112 are exactly unchanged (L1 = 0)
- changes are confined to 129/132/149:
  - 129: Jonah Coleman 61, Coker 26 (baseline Coker 87, Coleman 4)
  - 132: Chris Rodriguez 50, Coleman 34, Coker 16 (baseline Coleman 73, Coker 21, Rodriguez 4)
  - 149: Mitchell 85, Coker 12, Bigsby 10 (baseline Mitchell 87, no Coker)

## Interpretation
V3 proves a deterministic WR-saturation near-tie intervention can shift the late roster materially without contaminating early/mid pick distributions. That is useful causal evidence.

It is **not a complete production solution**:
- by construction it cannot address the verified natural pick-112 ordinary-WR7 marginal-utility miss because it activates only at pick >=120;
- it cannot address the natural pick-69 Kraft/Parker sequencing case;
- its ~0.49 mean RB/WR shift is larger than the tiny local intervention might suggest because changing pick 129 changes the downstream available board/roster at 132/149. This is expected path dependence, not recommendation RNG.

Therefore v3 is retained as a narrow ablation/control, not promoted. V4 is the more complete pending challenger because it explicitly includes the already-established local-turn, WR-saturation and final-slot option-value semantics while preserving deterministic selection.
