# PITTI HANDOFF CURRENT — v194
Handoff generation: `20260830T1359Z-v194`
Generation: `20260830T1359Z-v194`

## Canonical state
- Draft is 31.08.2026; finish-line freeze. No broad feature work/source churn/phone trial-and-error.
- Current source/deployment authority: **v11.8.0-rc4.130**.
- Latest fully operational device-observed v4/v5 runtime: **v11.8.0-rc4.126**.
- rc4.129 was observed on device only far enough to expose a fail-closed Decision-Evidence persistence error during the fresh mock at pick 12; do not call rc4.129 acceptance PASS.
- rc4.130 is a narrow storage-recovery correction. It changes no expert weights, Coach scoring, Return-v2, or v4/v5 model semantics.
- main and gh-pages were verified **IDENTICAL** on rc4.130 before this reseal.

## Evidence/root cause
- Latest backup: **draft-companion-v7-backup-2026-08-30T13-40-34-982Z.json**, draft **1399782216862588928**, rc4.129.
- Current-draft paired evidence in that backup: **2/15 pick states = picks 9 and 12 = 4 fixtures**.
- It also contains **22 historical fixtures** from draft 1399767853707636736.
- Exact rc4.129 bug: the final quota-recovery attempt used `history.slice(-0)`; JavaScript treats that as `slice(0)`, so history was not actually removed.
- rc4.130 maps zero-history recovery explicitly to `[]` and further removes redundant rankedPool `robustRankShadow` from persisted fixtures. Active-draft fixtures remain atomic and may never be silently pruned.
- Candidate package/re-extract, release contract, project guardrails, and the new deterministic rc4.130 quota regression all PASS.

## Exact continuation
`RC4.130_DEVICE_REFRESH_THEN_FULL_30_FIXTURE_V4V5_MOCK`

1. One controlled device/PWA refresh; verify visible **rc4.130**.
2. Confirm v4 and v5 remain selectable/operational.
3. **Start a fresh mock**; do not continue the interrupted rc4.129 mock for acceptance.
4. Run all 15 own picks. Before each user pick, analyze both v4 and v5; order between v4/v5 is irrelevant.
5. User may make own realistic draft decisions after both analyses.
6. Export backup after completion.
7. FIRST verify exactly **30 current-draft decisionFixtures = 15 pick states × 2 profiles**, every own pick paired once per profile.
8. Only after 30/30 PASS compare v4 vs v5, Return calibration, late-RB behavior, and user decisions.
9. If 30/30 fails, diagnose retention before model conclusions.

## Model/invariant authority
- **v4 PRIMARY**; **v5 CHALLENGER**; **v3 failsafe/control**.
- v4 individual-only with native Koerner and frozen position-specific blueprint; no Draft Sharks team ranking.
- v5 = frozen v3 + verified Sean Koerner at 15pp funded from Draft Sharks first; never v4+Koerner.
- Common published Overall panel is the cross-position Coach scale; positional ranks diagnostic/internal; compact live expert display Overall-only.
- 10-team Half-PPR, slot 9; user drafts exactly one QB; no K/DST; starter maxima are not roster caps.
- Geno Smith/Aaron Rodgers rank organically; no player-name forcing.
- Deferred backup `draft-companion-v7-backup-2026-08-29T19-44-43-926Z.json` remains intentionally unanalyzed unless user explicitly lifts that restriction.
- No source/weight redesign absent new concrete evidence.

## Process locks
- AUTO/AUTO BLOCK = actual long autonomous execution; no promise/status chatter.
- STATUS = report-only/no tools.
- No cache/app-data clear or reinstall. One controlled refresh only after server parity is proven.
- Repo v194 authority overrides stale Library mirrors and historical older sections.
