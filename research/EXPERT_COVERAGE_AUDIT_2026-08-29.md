# Expert coverage audit — 2026-08-29 v180

Source: `draft-companion-v7-backup-2026-08-29T13-17-22-398Z.json`.
Scope: current draft-pool limits QB30 / RB90 / WR80 / TE30. Diagnostic evidence only; no production/runtime mutation.

## Finding

The Bigsby/Spears discrepancy is not isolated. Effective expert composition varies materially inside the same displayed panel.

| panel | intended N | full-N rows | incomplete rows |
|---|---:|---:|---:|
| expert-v3-qb | 6 | 25/30 | 5/30 |
| expert-v3-rb | 5 | 54/90 | 36/90 |
| expert-v2-wr (v3 WR baseline) | 5 | 60/80 | 20/80 |
| expert-v3-te | 5 | 18/30 | 12/30 |

Observed N distributions:
- QB: N6=25, N5=5.
- RB: N5=54, N4=29, N3=4, N2=3.
- WR: N5=60, N4=20.
- TE: N5=18, N4=11, N2=1.

## Missing-vote concentration

QB30:
- Draft Sharks Team missing 3 (Fernando Mendoza, Aaron Rodgers, Geno Smith).
- Justin Boone missing 2 (Lamar Jackson, Jayden Daniels).

RB90:
- Draft Sharks Team missing 35.
- Dalton Del Don missing 4.
- Nick Mariano missing 4.
- Ryan Weisse missing 2.
- Pat Fitzmaurice missing 1.
- Known severe case: J.K. Dobbins N2.
- Tank Bigsby N4 because Draft Sharks Team is absent; Tyjae Spears N5.

WR80:
- Draft Sharks Team missing 18.
- Justin Boone missing 2 (Terry McLaurin, DJ Moore).

TE30:
- Draft Sharks Team missing 12.
- Wolf of Roto Street missing 1 and Dalton Del Don missing 1 (same severe Darren Waller N2 case).

## Fail-closed interpretation

The concentration of missing Draft Sharks rows in deeper RB/WR/TE ranges is consistent with materially shorter published/imported coverage rather than random per-player disagreement, but source metadata must determine the reason.

Never:
- treat absence as a zero-weight opinion,
- silently renormalize the remaining experts and present the result as the same ensemble,
- blindly impute a point rank.

For intentionally truncated boards, absence is right-censored information (rank beyond the published boundary), not a known point rank. Production aggregation must either use an explicitly censor-aware method or require adequate coverage for the decision pool. v4/v5 activation remains blocked until missingness reasons and coverage policy are explicit and regression-tested.

## Consequence for v4/v5

- v3 remains frozen historical/control baseline; no retroactive rewrite.
- v4 individual-only can select experts with verified current depth and avoids attributing identified Draft Sharks individual accuracy to the generic Team feed.
- v5 (v3 + Sean Koerner, mainly funded from Draft Sharks) still requires the same missingness fix; reducing DS weight alone does not make unequal per-player composition safe.
- Sean Koerner's 2026 FantasyPros ranking was visible in 2026-08-29 user screenshots; old paywall-only assumption remains superseded.
