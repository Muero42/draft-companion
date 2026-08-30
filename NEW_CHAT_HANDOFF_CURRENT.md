# PITTI HANDOFF CURRENT — v191
Handoff generation: `20260830T1200Z-v191`
Generation: `20260830T1200Z-v191`

## Canonical state
- Draft tomorrow; finish-line freeze. No broad feature work, duplicate source research, or phone trial-and-error.
- Current source/package candidate: **v11.8.0-rc4.117**.
- rc4.117 full off-device gates/package: **PASS**.
- Package run **33305284763**, artifact **9730250635**, digest **sha256:f646b6e672f96fa8e5ced73fd743f9528ad20d74d1db0b2f117d777f42c059fc**.
- **gh-pages is still rc4.115 and is NOT byte-parity with main/rc4.117.**
- Therefore the next user/device action is forbidden until server-side rc4.117 deployment + byte-parity are proven.

## Expert model authority
- **v3:** frozen control/failsafe; historical hybrid including Draft Sharks.
- **v4 — PRIMARY TEST TARGET:** individual-only; only individually obtainable rankings. Koerner is native v4. Position-specific weights are authoritative in `EXPERT_V4_BLUEPRINT`.
  - QB: Koerner 30 / Todd D Clark 25 / Boone 15 / Del Don 10 / Mariano 10 / Pat 10.
  - RB: Ryan Weisse 25 / Kev Wheeler 25 / Del Don 15 / Mariano 15 / Koerner 10 / Pat 10.
  - WR: Koerner 25 / Mariano 25 / Boone 20 / Todd 10 / Del Don 10 / Pat 10.
  - TE: Wolf 25 / Weisse 20 / Koerner 15 / Del Don 15 / Pat 15 / Boone 10.
  - No Draft Sharks team ranking in v4.
- **v5 — SECONDARY/OPTIONAL IF TIME REMAINS:** frozen v3 + individually verified Sean Koerner at target 15 percentage points; fund Koerner from Draft Sharks Team first, and only any shortfall proportionally from other v3 voices.
- Never restore v5 = v4 + Koerner.
- Aggregation uses positional rank. Published Overall rank is preserved separately for provenance/UI. Never label a positional rank as Overall (Barkley/Pat example: Overall #14, RB8).

## Exact continuation
`RC4.117_DEPLOY_PARITY_THEN_DEVICE_V4_ACCEPTANCE`

New chat sequence:
1. Verify this v191 seal once.
2. Promote **rc4.117** to gh-pages and prove runtime byte parity with main/package.
3. Only then request **one** device refresh/install.
4. Test **v4 first**: readiness/coverage, correct experts/weights/provenance, Barkley Overall-vs-RB-rank canary, normal Coach output.
5. If v4 passes, begin realistic draft testing immediately.
6. Test v5 only if remaining time justifies it; v5 must not delay a validated v4 draft version.

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
