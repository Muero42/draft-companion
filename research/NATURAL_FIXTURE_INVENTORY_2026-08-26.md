# Natural/frozen Decision Fixture inventory — 2026-08-26

Scope: evidence inventory only. No production/main/gh-pages/Android mutation and no fabricated replay.

## Source inspected
Library backup `draft-companion-v7-backup-2026-08-18T18-38-10-768Z.json`, exported by v11.8.0-rc4.50.

The backup contains 110 immutable decision fixtures and 135 Return-validation windows across eight recorded Sleeper mock draft IDs. Fixture model-version counts are:
- rc4.12: 30
- rc4.18: 18
- rc4.4: 17
- rc4.48: 15
- rc4.11: 13
- rc4.25: 7
- rc4.42: 6
- rc4.9: 2
- rc4: 1
- rc4.5: 1

For slot 9 in a 10-team snake, the 15 true user decision points are 9, 12, 29, 32, 49, 52, 69, 72, 89, 92, 109, 112, 129, 132, 149. Across the full backup, 88/110 stored fixtures occur at those true user decision points; the remainder are useful pre/post snapshots but must not be silently treated as independent user decisions.

## Strongest replay substrate
Mock `1395034363292319744` is especially valuable: it has exactly 15/15 rc4.48 decision fixtures, one at every true user decision point, and every fixture contains a full frozen `rankedPool` (101–222 available skill players depending on draft stage), candidates, user roster and resolved chosen player. This is materially stronger than reconstructing a draft from screenshots or final board text.

Other fixtures with full `rankedPool` in this backup are rc4.25 (7) and rc4.42 (6). Earlier fixture schemas generally retain top candidates but not the full frozen pool, so they are suitable for narrower diagnostics but not an unrestricted modern re-score.

## Direct late-WR diagnostic from the complete rc4.48 mock
The rc4.48 roster reached six WR by pick 89 and remained at six through pick 149. Historical Coach leaders at the late true decision points were:
- 89: Trevor Lawrence (QB), Coach 100; user chose Blake Corum.
- 92: Dak Prescott (QB), 100; user chose Jacory Croskey-Merritt.
- 109: Brock Purdy (QB), 100; user chose Kenny Gainwell.
- 112: Brock Purdy (QB), 100; user chose Brock Purdy.
- 129: Jalen Coker (WR), 100; user chose Zach Charbonnet.
- 132: Jalen Coker (WR), 100; user chose Jonah Coleman.
- 149: Jalen Coker (WR), 100; user chose Jalen Coker.

This is genuine frozen evidence that excess-WR pressure was not limited to the recent screenshots: once the roster already held six WR, a seventh WR still became the historical top Coach option at all three final decision points 129/132/149. It supports testing diminishing marginal WR utility, but does NOT support a hard WR cap: the user eventually chose Coker at 149, where an upside seventh WR can still be rational.

## A/B contract and limitation
Use the complete rc4.48 fixture sequence as a high-value frozen natural replay substrate for roster-utility / decision-surface challengers. Keep all frozen state constant and compare exact changed recommendations at the same 15 decision points.

Do not claim a clean Expert-Panel-v2 A/B from the rc4.48 stored panel ranks alone. The new v2 panel is defined by 2026-08-24/25 current-source boards that did not exist in the rc4.48 fixture. A valid expert-v2 replay therefore requires the exact current v2 rank payload to be frozen and then joined to the old player pool by stable player identity/name with explicit missingness; otherwise it would mix historical decision state with invented/currently unavailable rank values.

## Next validation units
1. Re-score the complete rc4.48 15-point sequence for the isolated WR-depth challenger wherever the frozen fields are sufficient; report flips and margins rather than tuning to one screenshot.
2. Freeze/export the exact current v2 expert rank payload (including sourceUpdated/provenance) so Expert v2 can be replayed reproducibly against the same player pools.
3. Keep baseline rc4.64 selectable and unchanged. No promotion from this inventory alone.
