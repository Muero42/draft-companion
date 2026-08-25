# rc4.63 Threshold-0 — Utility Adaptation Contract

Research only; no production promotion is authorized by this document.

## Reusable validated method
The historical `rc459_qbte_paired_complete_roster_utility_2026.py` is the closest valid downstream evaluator. Reuse its independent outcome semantics only:
- complete-roster paired evaluation;
- Market Outcome Bridge forecasts, not selected-panel ranks, for weekly player outcomes;
- Utility-v3.5 lineup topology;
- current-market vacancy replacement;
- empirical 2025 skill-score CDF;
- expected wins over Weeks 1-14.

Do not reuse its historical branch, run IDs, 60-seed assumptions, or base/challenger labels as evidence.

## Current paired inputs
Both arms must come only from successful workflow run 32870106661 and exact frozen metadata snapshot used there:
- threshold -15: seeds 459820001..459820120 exactly once;
- threshold 0: seeds 459820001..459820120 exactly once.
Fail if either seed union differs, if duplicate seeds exist, or if artifact metadata/input hashes differ.

The paired comparison is threshold 0 minus threshold -15. The 107 identical complete rosters must produce exactly zero utility delta. Any nonzero delta on an identical roster is evaluator/input drift and FAIL.

## Static divergence diagnostic
For each of the 13 known first-divergence seeds, separately evaluate the two candidates available at the first divergent decision using the independent outcome bridge and the exact pre-pick roster. This is diagnostic only; it cannot authorize promotion because it omits downstream opportunity cost.

## Complete-roster utility gate
Evaluate all 120 paired final rosters. Persist per-seed:
- roster fingerprints for both arms;
- expected wins Weeks 1-14;
- weekly lineup mean;
- delta (threshold0 - thresholdM15);
- first-divergence pick/candidates where applicable.

Report mean/median delta, better/same/worse counts, min/max and a divergence-only summary. Do not discard the 107 zero-delta pairs from the main paired estimate.

## Repair-aware Pre-Week-1 gate
A second evaluator must permit realistic pre-Week-1 free-agent repair of bench redundancy using the same replacement/outcome layer and a symmetric policy for both arms. It must not know which arm is the challenger. Persist all transactions and before/after utility. This is a sensitivity analysis, not permission to hide a bad draft behind arbitrary repair.

## Interpretation
- Roster aesthetics (QB1/TE1) are not utility evidence.
- A static candidate win does not establish downstream policy superiority.
- A tiny mean gain driven by one outlier is insufficient for promotion.
- If structural correctness favors threshold 0 but independent complete-roster/repair utility is materially worse, remain on rc4.63 and investigate.
- Promotion discussion requires the executable Natural Pick-92 and non-interference/Exceptional-Slide gates as well as utility.
