# PITTI HANDOFF CURRENT — v193
Handoff generation: `20260830T1310Z-v193`
Generation: `20260830T1310Z-v193`

## Canonical state
- Draft is tomorrow (31.08.2026); finish-line freeze. No broad feature work, source churn, or phone trial-and-error.
- Current source/deployment authority: **v11.8.0-rc4.129**.
- Latest device-observed operational runtime: **v11.8.0-rc4.126**. Device snapshots prove v4 and v5 both selectable/operational during realistic mocks.
- rc4.129 is a narrow evidence-retention correction, not a scoring/weight redesign.
- Final handoff transaction promotes gh-pages to main and requires IDENTICAL compare before takeover is considered complete.

## What rc4.129 contains
- v4 uses a common published-Overall weighted panel for positionsübergreifenden comparison; positional ranks remain diagnostic/internal.
- v5 remains frozen v3 + Sean Koerner at exact 15 percentage points, funded from Draft Sharks first; never restore v4+Koerner.
- Compact live expert display is Overall-only and fixed to the exact selected panel membership; missing intended rows render **#–**, never substitute another expert.
- Expert selector sits directly above Analyze; expert status is above selector.
- Duplicate analysis identity is profile-aware.
- v4/v5 decision fixtures are keyed separately by analysisProfile.
- **Active-draft decisionFixtures are atomic under quota pressure**: history may be trimmed, active evidence may not. Ranking-cache recovery may not delete them. Failed active persistence must stop with an explicit error.

## Evidence authority
- Latest backup: **draft-companion-v7-backup-2026-08-30T12-47-22-598Z.json**.
- It is NOT a complete 15-pick paired-model test.
- Exact paired v4/v5 decision states present: **11/15** = picks 49, 52, 69, 72, 89, 92, 109, 112, 129, 132, 149.
- Missing exact paired fixtures: **9, 12, 29, 32**. Those states exist only in returnValidation and cannot substitute for exact model-pair evidence.
- Backup serialization itself is pass-through; the loss occurred before export in local evidence retention.
- Do not infer/model-tune from this backup as though it were 15/15.
- Existing paired evidence still supports **v4 PRIMARY / v5 CHALLENGER**; no justified weight change yet.

## Exact continuation
`RC4.129_DEVICE_REFRESH_THEN_FULL_30_FIXTURE_V4V5_MOCK`

1. One controlled device refresh; verify visible **rc4.129**.
2. Confirm normal v4/v5 operation; do not start a repair loop unless a concrete defect appears.
3. Run one complete realistic 15-round mock.
4. At **every own pick**, analyze **both v4 and v5** before drafting.
5. Export backup after completion.
6. FIRST verify **30 decisionFixtures = 15 own-pick states × 2 profiles**, with every own pick paired exactly once per profile.
7. Only after 30/30 PASS: compare v4 vs v5, Return calibration, late-RB behavior, and actual user choices.
8. If 30/30 fails, diagnose evidence retention before any further model conclusions.

## Model authority
- **v4 PRIMARY**: individual-only, native Koerner, exact position-specific expert blueprints already frozen; no Draft Sharks team ranking.
- **v5 CHALLENGER**: frozen v3 + individually verified Koerner 15pp funded from Draft Sharks first.
- No source/weight redesign absent new, concrete evidence.
- v3 remains failsafe/control.

## Draft invariants
- 10 teams, Half-PPR, slot 9.
- User drafts exactly one QB; no QB2 after QB1.
- No K/DST in normal user draft.
- Starter maxima are not roster caps.
- Late bench increasingly RB/championship-upside weighted; Panel baseline + Sleeper ADP timing.
- Geno Smith/Aaron Rodgers rank organically; no player-name forcing.
- Deferred backup `draft-companion-v7-backup-2026-08-29T19-44-43-926Z.json` remains intentionally unanalyzed unless user explicitly lifts that restriction.

## Process locks
- **AUTO / AUTO BLOCK:** execute long autonomous blocks; no “läuft weiter”/promise/status chatter. Visible response only for result or unavoidable action.
- **STATUS:** report-only, no tools/work.
- Test before deploy/device. One controlled device candidate at a time.
- Checkpoint materially changed state immediately.
