# rc4.63 Pre-Safety Threshold Plan — 2026-08-25

Research-only. No production mutation.

## Newly admissible evidence
Exact same-input parity passed on all 120 seeds (459820001..459820120), using one frozen Sleeper metadata snapshot. Decision core, final roster and complete fingerprint are identical baseline vs instrumented for 120/120 seeds. Therefore ORIGINAL pre-Safety raw gaps may now be used for mechanism/threshold research.

Observed repeated QB/TE Safety-promoted chosen cases after already holding the position: n=333.
- chosen minus natural leader: min -65.415; p05 -59.160; p25 -49.744; median -43.542; p75 -36.221; p95 -21.468; max -11.663; mean -42.037.
- chosen minus best legal RB/WR is identical in this sample.

Interpretation: every observed repeated-position Safety resurrection in this 120-seed baseline was materially below the natural RB/WR leader before Safety. There are no observed near-tie repeated-position Safety promotions in this sample; the least-bad gap is still -11.663 raw points. This strongly explains why broad Full Safety produces pathological extra QB/TE selections.

## Fail-closed threshold sweep
Do NOT select a threshold directly from the sample maximum. Test a pre-registered family to avoid fitting the exact boundary:
- allow repeated-position Safety resurrection only if original chosen-minus-best-skill gap >= -15, -10, -5, 0, +5 raw points;
- always preserve natural-leader status and independently defined Exceptional Slide behavior;
- first QB/TE remains unaffected;
- no position quota, no player-name rule, no starter-max-as-roster-cap;
- isolate this Safety mechanism: do not bundle Late-WR v3 logic.

For each threshold, run the same frozen metadata snapshot and same 120 paired seeds against Full Safety. Required outputs: decision diffs by pick, QB/TE counts, repeated-position Safety events retained/suppressed, full rosters/fingerprints, static Championship Utility, and repair-aware Pre-Week-1 Championship Utility. Natural fixture Pick 92 and explicit Exceptional-Slide controls are mandatory before any promotion discussion.

## Promotion rule
A candidate is only promotable if it removes the demonstrated pathological Safety resurrection without materially harming Championship Utility after repair, passes natural-state/exception controls, and remains a minimal freeze-safe change. A prettier roster distribution is not sufficient. rc4.63 remains frozen until all gates pass.