# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260828T175500Z-v155`
Updated: 2026-08-28 17:55Z

## Fail-closed takeover order
1. Read `PITTI_COMMAND_CONTRACTS.json`.
2. Read `PITTI_CURRENT_STATE.json`.
3. Read `PITTI_HANDOFF_SEAL.json`; require PASS, handoff_ready=true, second_pass_pass=true, and a NON-EMPTY integrity map containing every required authority/runtime file.
4. Verify CURRENT == SEAL == this handoff generation and every seal-listed Git blob SHA.
5. Read `PITTI_AUTO_PREFLIGHT.md`, `PITTI_EXECUTION_LOCK.json`, and `PITTI_PROJECT_STATE.md` to EOF.
6. Read bootstrap/matrix and verify actual main/gh-pages/device facts. Stale Library mirrors cannot override verified repo/device state.

## Exact current boundary
- **main/source:** v11.8.0-rc4.98.
- **package/re-extract:** v11.8.0-rc4.98 PASS; run 33194280926, artifact 9695061955, SHA-256 43887c2cbeb3a142fa383941caac0b6768687203f862e0d234a54bb9854dd44e.
- **Android/PWA observed:** v11.8.0-rc4.98 is installed and renders live cards.
- **Android acceptance:** NOT PASS. User-visible semantic/evidence defects remain under audit.
- **rollback authority:** v11.8.0-rc4.96.
- **gh-pages deployment:** v11.8.0-rc4.96; it currently diverges from main rc4.98. Never claim main/pages parity.
- No automatic mock.

## Canonical paired OOS evidence
Library file: **draft-companion-v7-backup-2026-08-28T17-30-01-853Z.json** ("PITTI BACKUP 28-08 17:30").
- Realistic/user-decision draft: **1399109246460682240** (rc4.97). Only five complete late decision fixtures retained; do not invent missing frozen candidate states.
- Strict Coach-control draft: **1399114762087895040** (rc4.98), 15/15 `followedCoach=true`.

### CRITICAL COUNT — NEVER REGRESS
Strict Coach roster = **9 WR / 4 RB / 1 TE / 1 QB**, not 7 WR / 5 RB.
WR: Jaxon Smith-Njigba, Justin Jefferson, Malik Nabers, Chris Olave, Jaylen Waddle, Christian Watson, Parker Washington, Josh Downs, Stefon Diggs.
RB: D'Andre Swift, Chris Rodriguez, Woody Marks, Tyjae Spears.
TE: Harold Fannin.
QB: Trevor Lawrence.

This is material evidence that generic marginal WR/championship utility may be too weak. Starter maxima are not roster caps: the solution may NOT be a hard WR cap/quota or blind RB forcing. Exceptional WR value must remain legal.

## Evidence-display state — two distinct defect classes
1. **Polarity:** CMC age/workload/durability downside appeared as green plus. rc4.98 sign-aware routing fixes the generic class; 194 structured components passed the polarity contract.
2. **Substantive coverage:** after the polarity fix, CMC fell back to generic **"+ Fairer Bereich"** as its plus. This exposed missing substantive positive evidence / generic fallback quality as a separate pool-wide issue.

Required audit is pool-wide, not visual spot checking by the user:
- wrong Pro/Contra polarity;
- generic/non-informative Pro or Contra fallback where player-specific evidence should exist;
- missing substantive positive or negative decision evidence;
- arrow/Fazit/risk/evidence contradictions;
- stale evidence displayed as current;
- evidence text direction inconsistent with structured `dir`.

### CMC implementation status — do not misstate
Draft PR **#33** / branch `pitti/rc4.98-release-close` contains a proposed CMC positive evidence component (`elite_dual_threat_role`) and stronger regression coverage, but **PR #33 is OPEN, DRAFT, UNMERGED**. main does NOT yet contain that positive-evidence patch. Do not report it as implemented.

## Exact continuation gate
**RC498_WR_SATURATION_AND_EVIDENCE_COVERAGE_AUDIT**

Priorities:
1. Reconstruct all 15 strict-Coach decisions from the canonical backup and quantify when WR5→WR9 beat plausible RB/TE/QB alternatives, including existing WR-saturation, MRU, Safety, Return and Loss-if-gone terms.
2. Test generic bounded alternatives only. No hard WR cap/quota, no blind RB forcing, no player-name forcing, no PairSum/Rolling resurrection, no generic Return-v2 retune, no expert-weight redesign.
3. Run systematic candidate-pool evidence-quality audit and create deterministic regressions so the user does not have to inspect every card manually.
4. Keep rc4.96 as immediate rollback until rc4.98 (or successor) passes release/package/device acceptance.
5. Preserve draft-day freshness plan for Monday 2026-08-31 20:00 Europe/Berlin.

AUTO/AUTO BLOCK remains a hard execution contract: long autonomous blocks, re-inventory after every package, no empty/progress-only replies, and no interruption while safe positive-value independent work remains.


## Historical takeover canaries — semantics retained, state superseded
- Library mirror is stale/writeback-blocked: fail closed; verified repo/device state wins.
- rc4.82: historical regression guard retained; not current authority.
- rc4.83: historical regression guard retained; not current authority.
- Re-inventory after EVERY completed work package remains mandatory during AUTO/AUTO BLOCK.

- Obsolete rc4.61 auto-package workflow is retired/manual-only; current package authority is release-contract-v2-package.yml.
