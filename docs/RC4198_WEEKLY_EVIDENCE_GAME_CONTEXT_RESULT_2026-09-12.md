# rc4.198 execution result — 2026-09-12

## Verified starting authority

- Fresh `origin/main`: `62d7ecf11774700551b6e5a0497ec054e327a0d7`.
- Draft PR #156 head before implementation: `c87ee01bd5c6be73985ea55b3df8b7cf659dcbba` on `pitti/rc4198-weekly-rank-game-context-repair`; base `main` at the exact SHA above; GitHub reported the Draft PR open and clean.
- The coupled v244 guardrail passed before implementation. Production/device authority was not changed: rc4.196 remains deployed but not accepted; rc4.195 remains the prior accepted rollback.

## Confirmed causes and repairs

1. Timestamp-less current-week FantasyPros projections were published as `VERIFIED` with `UNKNOWN` chronology, although the consumer rejected that chronology. rc4.198 gives only the validated FantasyPros `projected_points` endpoint an explicit `RETRIEVAL` chronology. Provider publication fields remain null, the real retrieval `verifiedAt` is retained, and publication uses the same chronology predicate as the consumer.
2. Broad ECR parsing expected projection-era aliases and payload-only time. rc4.198 recognizes the bounded production aliases (`player_id`, `player_name`, `player_position_id`, `player_team_id`) and evaluates `last_updated` per row. Yearless month/day values may infer only the requested season year when within eight days of retrieval, and remain date precision. Stale/ambiguous rows are excluded and counted; collisions, position mismatches, team mismatches and insufficient fresh/mapped coverage remain fail-closed. The evidence remains `BROAD_CONSENSUS_ONLY`, not PITTI selected-panel evidence.
3. The exact production app route could not be captured from this execution environment. `https://draft-companion.pages.dev/api/nfl-week-context?season=2026&week=1` failed at the network CONNECT tunnel with HTTP 403 before an application response; the GitHub Pages candidate behaved the same. Consequently no ESPN parser requirement was relaxed and no response geometry was invented. rc4.198 stores bounded HTTP/fetch failures and per-event rejection categories/field-presence diagnostics for the next public canary. Optional weather and Vegas remain unavailable without verified evidence.

## Package boundary

The canonical runtime manifest remains exactly 17 files. Six runtime files changed (`app.js`, `weekly-evidence-v2.js`, `game-context-v1.js`, `index.html`, `manifest.webmanifest`, and `sw.js`); the other eleven remain byte-unchanged from starting `main`. The generated rc4.198 archive is a local, run-scoped observation only and remains `PACKAGED_ONLY_NOT_DEPLOYED`.
