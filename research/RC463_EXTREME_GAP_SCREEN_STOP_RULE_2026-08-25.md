# rc4.63 Extreme-Gap Safety Screen — Stop / Holdout Rule

Research only. rc4.63 remains frozen.

## Why one additional arm is justified
Threshold 0 and -15 both remove almost all repeat-QB/TE Safety resurrections and are independently utility-adverse. The exact same-input -15 vs Full Safety gate changes 119/120 rosters and loses about 0.115 expected wins/14w on the independent outcome evaluator. Therefore continuing to tighten the guard is not justified.

The only remaining mechanistically distinct low-churn hypothesis is an **extreme-gap guard**: suppress Safety resurrection only when an already-rostered QB/TE is more than 50 original raw points below the best legal RB/WR. This is intentionally permissive, preserves most Safety behavior, and still catches the verified natural Pick-92 defect (~ -54.43 raw gap). It is not a player-name rule and is not selected from the exact observed maximum.

## Current-screen decision rule
Run threshold -50 on the same frozen metadata and 120 seeds only as a causal screen.

Stop threshold tuning and keep rc4.63 if ANY is true:
- independent mean complete-roster utility is materially negative versus exact same-input Full Safety;
- roster-reality improvement is trivial relative to behavior churn;
- benefit depends on one/few outliers;
- implementation would require broader logic than the single extreme-gap check.

If -50 is noninferior or positive AND materially reduces QB3+/TE3+/invalid-composition pathologies, it is still **not** production evidence. It must then pass a fresh holdout seed family not used to choose -50, plus existing executable Pick-92/Exceptional-Slide/first-QB-TE/noninterference and freeze-risk gates.

## Anti-overfit rule
Do not launch -60/-45/-40/-35/-30/-25/-20 sweeps in response to the same-screen result. A failed -50 screen closes this threshold family for pre-draft production. A promising -50 screen advances to holdout, not same-sample coefficient tuning.
