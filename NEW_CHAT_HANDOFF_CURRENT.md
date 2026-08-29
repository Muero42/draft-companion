# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260829T1951Z-v180`
Updated: 2026-08-29 19:51Z

## FAIL-CLOSED TAKEOVER
1. Read `PITTI_COMMAND_CONTRACTS.json`.
2. Read `PITTI_CURRENT_STATE.json`.
3. Read `PITTI_HANDOFF_SEAL.json`; require generation `20260829T1951Z-v180`, PASS, handoff_ready=true, second_pass_pass=true and non-empty integrity map.
4. Verify every seal-listed Git blob SHA against current main.
5. Read `PITTI_EXECUTION_LOCK.json`, `PITTI_AUTO_PREFLIGHT.md`, and `PITTI_PROJECT_STATE.md` **to EOF**.
6. Read `PITTI_NEW_CHAT_BOOTSTRAP.md` and `HANDOFF_COMPLETENESS_MATRIX.md`.
7. Verify actual main / research branch / deployed runtime / device facts. Newest verified runtime and repository EOF facts override stale historical prose or Library mirrors.

## CURRENT RUNTIME BOUNDARY
- Accepted Android/runtime baseline: **v11.8.0-rc4.106**.
- Main runtime bytes are restored to the validated rc4.106 baseline.
- Research branch for new expert work: **`pitti/expert-v4-v5-v180`**.
- The prototype expert selector directly above Analyze is preserved on that branch from commit `f45bb99d0bd69d52f3cc792aae9571db4b2e615e`.
- It was deliberately reverted from main in `4940c943f64b03ecf1cc1ef6d4611dc56b4859be` to restore production/runtime parity until v4/v5 are validated.
- Do **not** edit production main for v4/v5 until the research branch passes coverage, regression, package/re-extract and release gates.

# CRITICAL FIRST ISSUE — EXPERT COVERAGE / MISSINGNESS

This is the highest-priority blocker and must not be lost.

The same displayed panel, **`expert-v3-rb`**, currently evaluates different players with different effective expert sets:

- **Tyjae Spears**: `panelN=5`
  - Ryan Weisse 126
  - Dalton Del Don 131
  - Pat Fitzmaurice 139
  - Nick Mariano 140
  - Draft Sharks Team 144

- **Tank Bigsby**: `panelN=4`
  - Pat Fitzmaurice 134
  - Nick Mariano 139
  - Dalton Del Don 149
  - Ryan Weisse 156
  - **Draft Sharks Team missing**

The root cause is localized in `ensureExpertV3Panels()`:
- if the challenger rank is absent, the old base row is inherited;
- if the challenger rank exists, a new row is rebuilt from the base individual ranks that happen to be present, plus challenger, then normalized by the sum of available weights.

Therefore missing source coverage can silently change the effective ensemble while the UI still shows the same panel name. Bigsby and Spears are not currently guaranteed to be ranked on equivalent foundations.

### Required fix semantics before v4/v5 can go live
- Never interpret missing import/acquisition coverage as an expert opinion.
- Distinguish:
  1. genuinely unranked / outside published range,
  2. import/acquisition failure,
  3. intentionally short expert board.
- No blind rank imputation.
- No silent renormalization across materially different expert sets without explicit coverage status.
- Make effective panel N + missingness reason fail-visible.
- Audit relevant players across **all positions**, not only Bigsby/Spears.
- v4/v5 remain blocked until this passes.

# EXPERT MODEL AUTHORITY

## v3
- **Freeze exactly as baseline/control.**
- Keep selectable.
- Do not retroactively change its weights or use the coverage fix to rewrite historical evidence.

## v2
- **Retire from the new comparison path.**
- Historical v2 evidence remains archived, but stale authority files must not resurrect it as the primary active experiment.

## v4 — Individual-only
- Baseline target: **4–6 experts per position**.
- Draft Sharks Team is excluded from v4 because the current **team feed cannot be cleanly equated to the historical accuracy of identified DS individuals**.
- This is **not** a conclusion that Draft Sharks as an organization is weak; their identifiable experts have strong historical accuracy.
- Existing v3 individual experts do **not** need to be displaced merely to make room for new names.
- Selection dimensions:
  - multi-year positional **draft** accuracy = primary signal,
  - 2025 = recency/stability correction, not 50/50 double counting,
  - current 2026 rank freshness = hard gate,
  - coverage/depth of current board = hard gate,
  - independence/diversity of signal,
  - cap single-expert influence.

### Provisional v4 candidate map — preserve, not final
- **QB:** Sean Koerner, Todd D Clark, Seth Miller + 1–3 best validated current individuals.
- **RB:** Ryan Weisse, Kev Wheeler, Dalton Del Don, Nick Mariano, Sean Koerner; Pat Fitzmaurice strongest current 6th-place challenger.
  - Audited multi-year positional ranks retained from current research: Weisse RB #2, Wheeler RB #4, Del Don RB #7, Mariano RB #11, Koerner RB #12.
  - Do not ignore recent counter-signals, especially Koerner's poor 2025 RB result.
- **WR:** Sean Koerner, Nick Mariano, Marc Shannep, Seth Miller + 0–2 best validated current candidates.
- **TE:** Wolf of Roto Street, Ryan Weisse, Pat Fitzmaurice, Sean Koerner; Kev Wheeler / Dalton Del Don current 5th–6th candidates.

These are **provisional**. Before final weights, verify current 2026 ranking, timestamp, board depth, exact player mapping and missingness for every selected expert.

## v5 — Minimal-invasive hybrid
- **v3 + Sean Koerner**, primarily funded by reducing Draft Sharks share.
- Transfer must be position-specific.
- Do **not** automatically transfer all DS weight to Koerner where Koerner's recent positional record is weak.
- Purpose: conservative second opinion / minimal regression risk versus v4.

# SEAN KOERNER / DRAFT SHARKS CORRECTIONS

- User screenshots on 2026-08-29 show **Sean Koerner's current ranking is available in FantasyPros**.
- The old handoff statement “Koerner unavailable because paywall” is **superseded**.
- Current import/coverage still needs exact verification before production use.
- Draft Sharks organization quality is strong, but the PITTI input is **Draft Sharks Team**, not a verified direct Jody Smith/Jared Smola individual board. Historical individual accuracy must not be blindly attributed to that team feed.

# UI REQUIREMENT
- Expert model selector belongs **directly above Analyze**.
- User must be able to switch **v3 / v4 / v5** and re-run the **same board/roster/draft state** for a second opinion.
- Preset switching alone must not mutate draft state.
- Result should make active preset clearly visible.
- Prototype exists on `pitti/expert-v4-v5-v180`; do not re-enable on main until v4/v5 pass.

# DEFERRED NATURAL MOCK — DO NOT ANALYZE
Exact file:
`draft-companion-v7-backup-2026-08-29T19-44-43-926Z.json`

Library id:
`libfile_5d98bb730a00819187cff3e062c430bc`

User identifies this as the previously missing mock containing **their actual decisions**. It is intentionally saved for later PITTI evaluation. **Do not analyze it on takeover** unless the user later explicitly lifts that restriction.

# PLAYER DESCRIPTIONS
- Some players still have weak/non-informative descriptions.
- This is secondary to expert-panel integrity before the draft.
- If time permits, use deterministic fallback text derived from existing panel/ADP/role evidence.
- Broad player-by-player research can wait until after the draft unless needed for a live pick.

# FUTURE / POST-SEASON EXPERT RESEARCH — MUST NOT BE LOST
Longer-term concept: phase-/archetype-specific expert teams:
- early-round stability,
- middle-round value/ceiling,
- late-round breakout / league-winner identification,
- potentially automatic weighting by draft phase + roster state.

Before the 2026 draft, collect only **time-sensitive raw data that could otherwise disappear**:
- timestamped expert-player ranks,
- panel provenance,
- contemporary ADP/ECR.

Everything reconstructible later can wait until after the season.

# REAL-DRAFT FAILSAFE / EXISTING MODEL INVARIANTS
- 10-team Half-PPR, user slot 9.
- User drafts exactly one QB; QB2 excluded from user Coach after QB1.
- No normal K/DST draft.
- Starter maxima are not roster caps.
- WR saturation is soft; exceptional WR value remains legal.
- No PairSum/Rolling resurrection.
- No blind RB forcing.
- No player-name forcing.
- No global Return-v2 retune.
- Mock manager names are **simulation labels, not observed real-manager decisions**.
- Real board is source of truth; manager/Return layer is sequencing, not permission to override a clear championship-utility gap.
- Plan B if manager layer produces implausible recommendations: decompose fundamental player value + roster utility + freshness first, use Return/manager only as sequencing. Shadow mock is reserve, not primary truth.

# CURRENT EXPERT-COVERAGE EVIDENCE FROM BACKUP
The current backup used for pre-handoff PITTI work remains:
`draft-companion-v7-backup-2026-08-29T13-17-22-398Z.json`
for the Bigsby/Spears coverage diagnosis and v3 panel audit.

The later 19:44 real-decision backup is deferred and must not replace this diagnostic source until its analysis is authorized.

# EXACT NEXT GATE
1. Verify v180 seal + actual main + research branch.
2. Continue on **`pitti/expert-v4-v5-v180`**.
3. Fix and test missing-expert coverage semantics first.
4. Complete the available-expert matrix from the user's 29.08 FantasyPros screenshots and current accessible rankings.
5. Finalize v4 and v5 panels/weights.
6. Counterfactual/regression compare **v3 vs v4 vs v5**, including:
   - Pick-12 RB cluster: Walker / Chase Brown / Barkley / Henry / Hampton / Jeanty,
   - late-RB coverage consistency,
   - known WR accumulation canaries,
   - QB1-only invariant,
   - TE path,
   - candidate visibility / no unexplained disappearance.
7. Only if PASS: wire selector, package/re-extract, release gates, main promotion, gh-pages parity, device acceptance.
8. Do not analyze the deferred 19:44 real-decision mock yet.
