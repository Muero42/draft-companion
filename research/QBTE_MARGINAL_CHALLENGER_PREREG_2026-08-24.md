# PITTI state-aware repeat QB/TE challenger — preregistration 2026-08-24

Status: RESEARCH ONLY. No production mutation or threshold fit authorized.

## Mechanism facts already established
Quarantined seeds 459710001..060 are mechanism/regression data only. Corrected direct marginal audit covers 166/166 repeat QB/TE decisions. Early/mid repeat TE/QB can be directly harmful while late QB repeats can have genuine startability/streaming value. A global hard ban and the old unrestricted PlayerQualitySafety repeat behavior are both rejected.

## Candidate architecture
At any contemplated QB2/TE2 selection:
1. retain the best already-rostered same-position option(s);
2. identify highest-value visible natural RB/WR alternatives WITHOUT using a quality band centered on the repeat QB/TE;
3. estimate independent direct marginal lineup/contingency value of repeat candidate versus RB/WR alternative;
4. separately assess return/market opportunity cost and roster topology;
5. allow repeat only if direct marginal case is positive with an uncertainty buffer OR if late-draft replacement/streaming economics make the alternative clearly weaker.

## Critical non-fit rule
Do not derive numeric margins, pick cutoffs, position cutoffs, or rawScore thresholds from seeds 459710001..060. In particular do not encode observed failures at 49/52 or 89/92 or observed success at 149 as hard rules. Those observations diagnose structure only.

## Calibration plan
Use one of:
A. outcome-blind football/value prior fixed before fresh simulation (preferred if robustly defensible), or
B. a disjoint calibration seed block never used for final certification.
Then freeze the rule and test on a separate fresh certification block with common random numbers against MARKET_ROSTER/current baseline.

## Required reports
- repeat accept/reject frequency by QB/TE and draft stage;
- displaced RB/WR alternatives;
- direct marginal value distribution;
- complete-roster utility with paired CI;
- pick-frequency/determinism audit;
- sensitivity to uncertainty buffer;
- explicit regression check on quarantined 166-event mechanism set after rule is frozen (diagnostic only).

## Fail-closed conditions
Any identity ambiguity, incomplete candidate visibility, topology mismatch, contamination of calibration/certification seeds, or reuse of repeat-centered Safety admissibility invalidates the run.