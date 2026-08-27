# PITTI Release Contract v2

A candidate is **not installable** merely because CI or packaging succeeds. This contract is fail-closed.

## Atomic release state
One coherent candidate version must cover runtime files, cache keys, candidate README metadata, package manifest and test report. Production/main baseline stays explicitly separate until promotion.

## Behavioral acceptance
The gate must execute representative decision fixtures through the same decision-state -> live-surface presentation path used by runtime and assert rendered semantics, not source-string presence alone.

Mandatory assertions:
- Selectable expert profiles: incumbent, WR-only v2, all-position v2.
- Exact v2 weights: QB DS35/Mariano25/DelDon20/Boone10/Pat10; RB DS35/Mariano25/DelDon25/Pat15; WR Mariano35/DS30/Pat15/DelDon10/Boone10; TE DS35/Pat30/DelDon25/Boone10.
- Visible expert order invariant: DS -> Del Don -> Pat -> Mariano -> Boone; omit non-members without reordering.
- Visible expert values are individual player ranks, never weights.
- Expert-v2 board coverage includes elite fixtures and Parker Washington.
- Header: only validated arrow plus its explanation; never injury/value/market labels.
- Parker Washington fixture: ↑↑ · WR2 mit WR1-Upside.
- Injury alone never creates an arrow.
- Return probability is normal timing. Additional WAIT only for high-return cases; no generic JETZT/EHER JETZT duplication on live decision surface.
- Clear cards retain +, -, Fazit and always-visible expert ranks.
- Top-10 keywords follow P/ADP/R metrics; NORMAL-CUT warning is a marker, never a sorting barrier.
- WR-saturation/roster fixture prevents inappropriate repeated WR recommendations.
- Similar evidence may intentionally produce similar prose. Differences must be evidence-backed, never manufactured.
- Player-specific product prose tables are forbidden as an evidence substitute. Named players may exist in regression fixtures only.
- Existing Return-v2, manager-model, Player Quality, ADP, roster and K/DST/QB/TE regression suites remain mandatory.

## Package gate
Final pre-install tests run against the **re-extracted runtime ZIP bytes**: exact runtime file count, JS syntax, version/cache coherence and the behavioral fixtures above.

## State/write-through gate
Before any candidate is described as installable, current checkpoint/history must record candidate, branch/commit, package hash, invalid predecessors, gate result and Android status. README must distinguish production baseline from candidate. Any mismatch = FAIL.

## Android
Android is the final browser/PWA/render/runtime gate, never the first integration test.
