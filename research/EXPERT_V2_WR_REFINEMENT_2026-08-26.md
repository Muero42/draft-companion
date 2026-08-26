# Expert v2 WR refinement — 2026-08-26

Status: RESEARCH / SHADOW ONLY. Production `main`, `gh-pages`, Android and the rc4.64 baseline remain unchanged.

## New source evidence
The exact Yahoo staff-source smoke failed on both current public mirrors: the server-rendered HTML exposed a machine-readable page date but zero parseable Matt Harmon and zero Justin Boone ranking rows. This is not a freshness-parser failure; the public page no longer exposes the staff table in the exact form required by the runtime parser.

The historical PITTI backup also shows Matt Harmon's usable cache came from `FantasyPros Individual – Matt Harmon (reconstructed from comparison blocks)` with an empty `sourceUpdated`. The new v2 freshness gate therefore correctly treats that reconstruction as freshness-unknown and excludes it from v2 scoring.

Conclusion: Harmon can remain in the preserved rc4.64 baseline, but he is not eligible as an active member of the new exact/current v2 WR panel until a fresh exact individual board is ingestible.

## Expanded current exact-board audit
Run `32920613521` completed successfully on 2026-08-26. Exact Half-PPR boards found:
- Michael Bobal: 272 rows, Aug 25, usable.
- Guilherme Gianni: 285 rows, Aug 23, usable/degraded by v2 freshness semantics.
- Ryan Weisse: 348 rows, Aug 24, usable.
- Pat Fitzmaurice: 297 rows, Aug 26, usable.
- Jason Willan: 279 rows, Aug 17; technically parseable but >5 days and therefore v2-expired.
- Seth Miller, Marc Shannep, Jody Smith, Kevin Steele, Joey Wright: no usable exact board from the audited FantasyPros routes.

WR Spearman on common players:
- Gianni–Bobal: 0.997 (near duplicate)
- Gianni–Pat: 0.968
- Gianni–Weisse: 0.935
- Bobal–Pat: 0.965
- Bobal–Weisse: 0.931
- Pat–Weisse: 0.923

## Accuracy guard against diversity-for-diversity's-sake
FantasyPros 2025 draft accuracy is strongly position-specific: Gianni WR #11, Bobal #29, Pat #70, Weisse #171. Multi-year 2023–2025 WR accuracy is Pat #52, Weisse #110, Bobal #139, Gianni #141. Therefore Weisse's lower WR correlation is not sufficient evidence to give him WR weight; his recent WR accuracy is a material negative signal. Conversely, Gianni/Bobal had strong 2025 WR performance but are almost identical current boards, so Bobal must be heavily correlation-shrunk rather than counted as an independent vote. Pat provides the better multi-year stabilizing signal.

## Revised v2 WR shadow preset
- Guilherme Gianni 45
- Pat Fitzmaurice 40
- Michael Bobal 15
- max 3

Matt Harmon removed from v2 WR; Ryan Weisse not added at WR. This does not alter the baseline preset, where Harmon remains 35.

The weighting is deliberately conservative: it does not claim these three are the globally best WR forecasters. It is the best presently verified exact/current ingestible combination among the audited sources, with explicit shrinkage for the Gianni/Bobal duplicate-information problem. Koerner, Mariano, Seth Miller, Marc Shannep and other high-accuracy challengers remain acquisition targets if a fresh exact board becomes available.

## Promotion status
Still blocked. The v2 configuration remains shadow-only until exact current rank payloads are frozen reproducibly and A/B replay demonstrates robust decision benefit on frozen natural fixtures. No player-name override, WR cap, stale source exception, or fabricated rank reconstruction is authorized.
