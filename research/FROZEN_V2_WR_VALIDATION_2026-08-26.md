# Frozen Expert-v2 + WR-depth validation — 2026-08-26

Status: RESEARCH / SHADOW ONLY. No main/gh-pages/Android promotion.

## Exact v2 payload provenance
Workflow `Freeze Expert v2 Exact Payload` run 32920817561 completed successfully. Artifact digest: `sha256:da54c650d7566effdfbf5a2d1b6826565cd64774e41bb7f181089f81d83e4846`.

Frozen HALF-PPR 2026 source boards at retrieval `2026-08-26T01:56:10Z`:
- Pat Fitzmaurice — source updated Aug 26, 2026 — 297 rows — row-payload SHA256 `db903f3b09d093a787187142553845810f30ab983cfcd13a6ebc634f8241e91d`.
- Michael Bobal — Aug 25 — 272 — `156af0be3d656c87cfe9637d65f1abaf654505abb88493d9781bc1637bb13f26`.
- Ryan Weisse — Aug 24 — 348 — `63c775efa092458f5e0909b3eaa65e9ae26b09371b67a2f732afcc05a8dc6545`.
- Guilherme Gianni — Aug 23 — 285 — `a7efb755dbdf29241178ed55b28c9fc5d7af75880de985b66809384ab5ac6a9e`.

Gianni is therefore freshness-degraded under the v2 gate, not silently treated as equally fresh. Brown remains excluded from v2. Koerner remains excluded until an exact current board is ingestible; no tier-prose reconstruction is allowed.

## Exact-board correlation audit
Same-player rank correlations on the frozen payload confirm strong redundancy among conventional overall rankers:
- QB: Gianni/Bobal .962; Gianni/Pat .983; Bobal/Weisse .903; Pat/Weisse .915.
- RB: Gianni/Bobal .987; Gianni/Pat .977; Bobal/Weisse .928; Pat/Weisse .933.
- WR: Gianni/Bobal .997; Gianni/Pat .962; Gianni/Weisse .918; Pat/Weisse .902.
- TE: Gianni/Bobal .990; Gianni/Pat .967; Bobal/Weisse .937; Pat/Weisse .937.

This supports correlation shrinkage and argues against filling v2 with several near-duplicate overall boards merely because each is individually accurate.

## Frozen natural-fixture join
Joined the exact current v2 payload by normalized player name + position to the complete 15/15 rc4.48 natural fixture sequence for draft `1395034363292319744` from the immutable backup `draft-companion-v7-backup-2026-08-18T18-38-10-768Z.json`.

Coverage across the 15 frozen ranked pools: min 88.9%, mean 90.9%, max 94.1%. This is sufficient for shadow comparison but not permission to invent ranks for missing players.

Panel-only best-available leader changed at 4/15 points. Most early leaders were stable. Important examples:
- Pick 9: Amon-Ra remains panel leader.
- Pick 12: Chase Brown remains panel leader (this is player rank evidence, not a Brown-expert rule).
- Pick 29: George Pickens remains leader.
- Pick 32: Chris Olave remains leader.
- Pick 69/72: Parker Washington remains leader.
- Pick 89: Trevor Lawrence remains leader.
- Picks 129/132/149: Kyler Murray remains raw panel leader, but QB2 roster-exception logic must suppress him after QB1; raw panel leader is not equivalent to Coach recommendation.

The four panel-only flips are at picks 52, 92, 109, 112 and are mainly QB-vs-WR rank-order changes. These MUST be evaluated through unchanged roster/QB1 logic before interpreting them as recommendation flips.

## Late-WR direction on the strongest frozen mock
This mock had six WR from pick 89 onward. Historical rc4.48 Coach had Jalen Coker (WR7 candidate) as #1 at picks 129/132/149. The current challenger deliberately does NOT hard-cap WR.

Using the frozen player pool and current v2 ranks, a deterministic pre-Return core-score audit (Player Quality + draft-phase need + Progressive Upside + marginal roster utility; no fabricated Return-v2) shows the intended direction:
- Pick 129, roster 6 WR / 4 RB: Woody Marks RB leads the deterministic core; Jalen Coker WR falls behind the top RB cluster.
- Pick 132, 6 WR / 5 RB: Woody Marks remains ahead of Coker.
- Pick 149, 6 WR / 6 RB: Woody Marks remains ahead; Coker remains viable rather than prohibited.

This is a directional diagnostic only, not a full Coach replay, because exact historical Return-v2/manager-state counterfactuals are not reconstructed. It nevertheless independently supports the new diminishing-marginal-WR utility and shows no need for a hard WR cap.

For the user's newer screenshot case with seven WR already rostered, the current challenger is intentionally stronger: WR8 receives both the deeper marginal-roster penalty and the stage-dependent Progressive WR saturation penalty. Existing `WR Depth Regression` CI is green at branch head, so the 7-WR synthetic contract remains protected.

## Decision
1. Keep baseline rc4.64 selectable and unchanged.
2. Keep Brown excluded from v2.
3. Keep current WR-depth challenger; do not strengthen it again from these fixtures.
4. Do not promote v2 or WR-depth to production yet solely from this replay.
5. Next high-value validation is a prospective mock with v2 selected, especially picks 109/112/129/132/149 and any state with 7 WR, while retaining the frozen fixture evidence.
6. Do not retune Return-v2, PlayerQualitySafety, QB2/TE2 exception logic, or introduce position caps as part of this gate.
