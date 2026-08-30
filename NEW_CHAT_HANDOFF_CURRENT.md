# PITTI HANDOFF CURRENT — v192
Handoff generation: `20260830T1010Z-v192`
Generation: `20260830T1010Z-v192`

## Canonical state
- Draft tomorrow; finish-line freeze. No broad feature work, duplicate source research, or phone trial-and-error.
- Current source/package/deployed candidate: **v11.8.0-rc4.117**.
- rc4.117 full off-device gates/package: **PASS**.
- Package run **33305284763**, artifact **9730250635**, digest **sha256:f646b6e672f96fa8e5ced73fd743f9528ad20d74d1db0b2f117d777f42c059fc**.
- **gh-pages is now rc4.117 with byte parity to main.** Pre-deploy compare showed gh-pages as an ancestor; it was fast-forwarded without force, then compare returned IDENTICAL, ahead 0 / behind 0.
- Direct gh-pages reads expose rc4.117 app/index/sw/manifest blobs equal to main.
- Device v4 acceptance is still pending; no Android success is inferred from deployment.

## Expert model authority
- **v3:** frozen control/failsafe; historical hybrid including Draft Sharks.
- **v4 — PRIMARY TEST TARGET:** individual-only; only individually obtainable rankings. Koerner is native v4.
  - QB: Koerner 30 / Todd D Clark 25 / Boone 15 / Del Don 10 / Mariano 10 / Pat 10.
  - RB: Ryan Weisse 25 / Kev Wheeler 25 / Del Don 15 / Mariano 15 / Koerner 10 / Pat 10.
  - WR: Koerner 25 / Mariano 25 / Boone 20 / Todd 10 / Del Don 10 / Pat 10.
  - TE: Wolf 25 / Weisse 20 / Koerner 15 / Del Don 15 / Pat 15 / Boone 10.
  - No Draft Sharks team ranking in v4.
- **v5 — OPTIONAL ONLY AFTER v4 PASS:** frozen v3 + individually verified Sean Koerner at target 15 percentage points; fund Koerner from Draft Sharks Team first, then only any shortfall proportionally from other v3 voices.
- Never restore v5 = v4 + Koerner.
- Aggregation uses positional rank. Published Overall rank is preserved separately for provenance/UI. Barkley/Pat canary: Overall #14, RB8; never label RB8 as Overall #8.

## Exact continuation
`RC4.117_DEVICE_V4_ACCEPTANCE`

1. Exactly one device refresh/install now.
2. Verify visible rc4.117.
3. Test v4 first: readiness/coverage, correct experts/weights/provenance, Barkley Overall-vs-RB-rank canary, normal Coach output.
4. If v4 passes, begin realistic draft testing immediately.
5. Test v5 only if remaining time justifies it; v5 must not delay a validated v4 draft version.

## Process locks
- AUTO/AUTO BLOCK = silent execution. No empty replies, progress chatter, promises, apologies, or “AUTO läuft” messages.
- STATUS = report-only from known state; no tools/work/polling.
- One controlled device candidate at a time.
- No source re-research unless a direct source failure proves current source unusable.
- Existing expert is replaced only by demonstrated superior obtainable individual source; no speculative churn.

## Draft invariants
- User slot 9, 10-team Half-PPR, exactly one QB drafted; no QB2 after QB1; no K/DST normal draft.
- Starter maxima are not roster caps.
- Geno Smith/Aaron Rodgers rank organically; no player-name forcing/exclusion.
- Bigsby/Spears/Dobbins missing expert coverage remains explicit; no silent renormalization.
- Deferred real-decision mock `draft-companion-v7-backup-2026-08-29T19-44-43-926Z.json` remains intentionally unanalyzed until user lifts restriction.
