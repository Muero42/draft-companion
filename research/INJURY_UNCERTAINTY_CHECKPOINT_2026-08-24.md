# Injury uncertainty checkpoint — 2026-08-24

Branch: `pitti-auto/injury-uncertainty-guard` from frozen rc4.60.

## Verified motivating evidence
- Pat Fitzmaurice Half-PPR ranking dated 2026-08-22 (pre-injury): Ashton Jeanty #9 overall / RB5; James Cook #12 overall / RB6.
- 2026-08-24 reporting: Jeanty believed to have a sprained ankle; injury not expected to be long-term, but Raiders had not provided an official detailed timeline at verification time.
- Current rc4.60 snapshot after event: Jeanty panel 18.6 / ADP 13.4 and absent from visible 10 despite being available.

## Root cause in rc4.60
`DRAFT_ACUTE_STATUS_2026.ashtonjeanty.blockRecommendation=true` causes `scoreCandidate` to return raw/coach score -998 immediately. `applyPlayerQualitySafetyGate` excludes `recommendationBlocked` rows. `visibleCoachCandidates` then only takes normal/fallback rows in score order, so an acute blocked elite player can become effectively invisible. This protects against an unsafe TAKE but over-solves the problem by suppressing user visibility.

## Chosen fix architecture
Do NOT remove the recommendation block and do NOT blend healthy/current ranks. Add a generic visibility-only uncertainty layer:
- preserve current panel as baseline;
- preserve provenance-backed pre-event healthy panel/rank separately;
- classify event KNOWN_SEVERE / KNOWN_MINOR / MATERIAL_UNCERTAINTY;
- MATERIAL_UNCERTAINTY + relevant healthy value forces decision-surface visibility without score inflation;
- recommendation remains HOLD while `blockRecommendation=true`;
- if ten normal candidates already occupy board, show uncertainty player separately as RISIKO-FALLER rather than evicting stronger normal candidates;
- no duplicate generic injury penalty when panel already reflects event.

## Artifacts
- `research/INJURY_UNCERTAINTY_VISIBILITY_GUARD_2026-08-24.md`
- `research/injury_uncertainty_guard.js`
- `research/test_injury_uncertainty_guard.js`
- `.github/workflows/injury-uncertainty-guard.yml`

Pure-kernel A-G logic has been sanity-checked locally; GitHub status API did not expose a completed check for the newly added branch-only workflow, so CI PASS must not be claimed yet.

## Next gate
Integrate the proven kernel minimally into runtime (prefer service-worker transform anchors to avoid rewriting the large app source), bump challenger version only, then run syntax + rc4.60 transform regression + realistic 1.09 snapshot reproduction. Promote only if unaffected snapshots are unchanged and Jeanty becomes visible as HOLD/RISIKO-FALLER with Healthy reference, not TAKE.