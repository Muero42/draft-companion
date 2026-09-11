# PITTI BRIDGE HANDOFF — rc4.196 PRODUCTION / PHYSICAL PARTIAL PASS

Authority timestamp: 2026-09-11 19:35 CEST
Repository: `Muero42/draft-companion`
Mode: `POST_DRAFT_SEASON_COMPANION`

## 0. Fail-closed rule

This bridge is a handoff aid, not a substitute for live Git/GitHub verification. At the start of the next ChatGPT/Codex session:

1. Read this file completely.
2. Re-verify live `main`, relevant PR state and exact-head CI.
3. Read `AGENTS.md`, `PITTI_CURRENT_STATE.json`, `PITTI_EXECUTION_LOCK.json`, `PITTI_COMMAND_CONTRACTS.json`, `PITTI_HANDOFF_SEAL.json`, `NEW_CHAT_HANDOFF_CURRENT.md`, `PITTI_NEW_CHAT_BOOTSTRAP.md`, `PITTI_AUTO_PREFLIGHT.md` and `PITTI_PROJECT_STATE.md`.
4. If this bridge conflicts with older v242 deployment/device statements, this bridge supersedes only those later-observed deployment/device facts. Do not use it to weaken unrelated invariants.
5. Never infer deployment, device acceptance, source freshness or fantasy actions from a source merge alone.

## 1. Live Git/source authority at handoff creation

Freshly verified canonical `main`:

`082d77003f6616e290146698641aebe63f37b8c2`

This is the merge commit for PR #145 (`rc4.196 post-merge authority reconciliation`). The rc4.196 runtime/source tree is therefore on canonical main.

Relevant history:
- PR #143: rc4.196 Start/Sit v6 + Weekly Expert Evidence + game context — merged.
- PR #145: post-merge authority reconciliation / stale-alias repair — merged.
- Package identity preserved for rc4.196: 17 runtime files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`.

Do not treat the SHA above as permanent future authority; reverify current main dynamically.

## 2. Production deployment — NEWER evidence than v242

rc4.196 is no longer merely packaged/source-merged.

Physical Cloudflare evidence from 2026-09-11 16:25 CEST:
- environment: Production
- repository: `Muero42/draft-companion`
- branch/commit shown: `main 082d770`
- status: `success`
- deployment ID: `da039536-7733-4b07-8f0c-70cc6e0bc8b7`
- deployment URL shown: `https://da039536.draft-companion.pages.dev`
- duration: 41 s

Therefore:
- rc4.196 production deployment: **VERIFIED SUCCESS** for exact main `082d770...`.
- Any older active statement that rc4.196 is `PACKAGED_ONLY_NOT_DEPLOYED` or that production is still rc4.195 is stale after this evidence.
- This deployment evidence does **not** by itself prove full physical acceptance.

## 3. Android/PWA physical canary — rc4.196 PARTIAL PASS, NOT FULLY ACCEPTED

The already-installed Android PWA updated without cache clearing or reinstall. Physical screenshots show badge `v11.8.0-rc4.196`.

### 3.1 Physical PASS / preserved behavior

Observed on-device after the production promotion:

- Sleeper Live-State: `< 1 Min.` and green `Live-Kader direkt von Sleeper aktualisiert.`
- Weekly Evidence age: `1 Min.`
- One physical status explicitly showed: `Weekly Evidence · W1 · 728 Records · Ranks UNAVAILABLE · PITTI-Panel UNAVAILABLE.`
- Another physical status showed: `FantasyPros Weekly Projections verifiziert · Expert-Ranks/Matchup-Lanes bleiben separat fail-closed.`
- Waiver / Free Agents remains evidence-gated and did not fabricate a skill-position move: `SKILL-POSITION HOLD`.
- D/ST streaming lane remained populated: Chargers / Packers / Titans = TARGET; Bills / Raiders = WATCH; Bears / Jets = EMERGENCY.
- Kicker lane remained K-only: current Harrison Mevis 8.4 projected; Evan McPherson 7.7 HOLD; Chris Boswell 7.6 HOLD.
- Trades remained fail-closed: Trade Offer Board v8, live Sleeper rosters, Boone/Yahoo ROS values `263/264 gemappt`, `TRADE HOLD`.
- Live/News Watcher remained PASS; screenshot showed 320 evidence events / 154 players in cache and `Pitti Watcher: PASS · 250 neue Evidence-Events`; no unsourced actionable critical delta was promoted.
- Reserve/IR remained separate; Zach Charbonnet displayed under `RESERVE / IR`, not as an ordinary active drop.

No cache clear, reinstall or automatic Sleeper transaction occurred.

### 3.2 Current physical roster shown in rc4.196 canary

Starter cards observed:
- QB Jayden Daniels
- RB Bucky Irving
- WR Jaxon Smith-Njigba
- WR Chris Olave
- TE Isaiah Likely
- FLEX George Pickens
- W/R Justin Jefferson
- K Harrison Mevis

Bench cards observed:
- Blake Corum
- Jadarian Price
- Rico Dowdle
- Trevor Lawrence
- Kenny Gainwell
- Christian Watson
- Josh Downs

Reserve/IR:
- Zach Charbonnet

App summary showed `LIVE Sleeper · 16 Spieler · Reserve/IR 1`.

Treat this physical roster snapshot as newer than draft-era roster memories, but Sleeper live state remains the actual authority and must be refreshed dynamically.

### 3.3 Physical blocker / reason rc4.196 is NOT fully accepted

The new rc4.196 Start/Sit/weekly-context purpose did not complete physically.

On the Kader surface, the shown QB/RB/WR/TE/FLEX/W-R and bench rows displayed variants of:
- `W1 <POS> nicht verfügbar`
- `Half-PPR nicht verfügbar`
- `Team-Total nicht verfügbar`
- `Gegner/Wetter: nicht verfügbar`

Start/Sit v6 status showed:
- global legal slot optimization text present
- `Spiel-/Lock-Kontext nicht verfügbar`
- `START/SIT TEILWEISE NICHT BEWERTBAR · 14 realistische Skill-Spieler ohne vollständige aktuelle Rank+Projection-Evidence`

Therefore current physical verdict is:

`RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`

Meaning:
- Existing Live-State / Waiver / Trade / Watcher / Reserve behavior is visibly preserved.
- New Start/Sit v6 UI loads.
- Full Start/Sit decision usefulness is blocked by missing weekly-rank consumption and/or rank availability plus missing game context.
- Do **not** record rc4.196 as full device acceptance yet.
- No rollback is currently required solely from this partial result because no material regression was observed in the already-accepted rc4.195 lanes; rollback remains an evidence-driven action if a real regression is found.

## 4. High-value code observation to reproduce, not blindly assume

Current main `app.js` constructs Start/Sit `values` only when **both** `weekly_rank` and `projected_points` are `VERIFIED` for a player before passing that player into the optimizer. The physical canary simultaneously proves the projection lane can be verified while the rank lane is unavailable.

This is a high-priority suspected integration defect because it can make valid projection evidence disappear from Start/Sit whenever ranks fail, contrary to the intended lane-independence/fail-closed design.

Codex must reproduce and confirm this before changing code. Do not assume it is the only cause.

Additional rank-lane questions to audit:
- actual FantasyPros `consensus-rankings` response shape for current Week 1 / HALF scoring
- whether source timestamp/freshness requirements reject otherwise usable ECR payloads
- whether player mapping/position/scoring/week validation is rejecting rows
- whether broad-consensus ECR is correctly distinct from selected PITTI expert-panel coverage

Game-context questions to audit:
- production `/api/nfl-week-context?season=2026&week=1` response
- ESPN event completeness / team uniqueness / venue requirements
- `game-context-v1.js` snapshot publication and validation
- whether a partial/conflicting schedule correctly fails closed without suppressing unrelated projection evidence

## 5. Binding next engineering priority

Preserve all currently working rc4.195/rc4.196 lanes and fix the new physical blocker in this order:

1. Reproduce the physical Start/Sit failure from rc4.196.
2. Restore true evidence-lane independence: verified projections must remain visible/usable when weekly rank evidence is unavailable, without inventing ranks.
3. Make incomplete evidence scoped to affected players/metrics/slots rather than blanket-hiding valid projection evidence.
4. Diagnose and, if robustly possible, repair the FantasyPros current-week Half-PPR rank lane.
5. Diagnose and repair canonical game/opponent/kickoff/lock context if the production endpoint/parser is actually failing.
6. Preserve cross-position safety: positional rank numbers are never directly compared/subtracted across positions; projected Half-PPR points/common FLEX evidence drive cross-position optimization.
7. Preserve legal global slot optimization, two-TE FLEX support, Reserve/IR/TAXI exclusion, K/DST isolation and duplicate-player prevention.
8. Preserve Waiver/Trade/Boone/Watcher/K/DST behavior and all prior regression gates.

Vegas remains fail-closed unless a robust verified source exists. Weather remains event-bound and fail-closed when a fresh outdoor forecast is unavailable.

## 6. Codex handoff-audit work package — checkpoint only before runtime repair

Before starting the actual fix, use Codex once to reconcile the canonical checkpoint/handoff surfaces with the newer physical evidence above.

Codex should:
- live-verify Git/GitHub authority first;
- read this bridge and all coupled checkpoint/seal files;
- update the checkpoint generation (next generation after v242) so it truthfully records:
  - rc4.196 source merged;
  - rc4.196 production deployment verified on exact `082d770...` deployment evidence;
  - rc4.196 physical canary = PARTIAL PASS / NOT FULLY ACCEPTED;
  - preserved PASS lanes and exact Start/Sit blockers above;
  - rc4.195 remains historical prior full physical acceptance / rollback reference, not current production version;
- remove stale operative statements that rc4.196 is undeployed or that rc4.195 is current production;
- preserve source/deployment/device-acceptance separation;
- regenerate the coupled seal from final blobs;
- harden negative regressions so future handoffs cannot convert `PARTIAL_PASS_NOT_ACCEPTED` into full acceptance or resurrect `PACKAGED_ONLY_NOT_DEPLOYED` after this production evidence;
- make **no runtime/product behavior changes** in this checkpoint-only task;
- run strict suite, guardrails/seal, postmerge/authority regressions and package parity as appropriate;
- do not merge or deploy.

After that checkpoint-only reconciliation is independently reviewed, the next runtime branch should address Section 5.

## 7. AUTO / user workflow

- `AUTO` / `AUTO BLOCK`: execute all safe/reversible work continuously without status chatter; stop only at real external/security/destructive/user-action gates.
- `STATUS`: report only; do not trigger new work.
- Mobile/cloud-first. Use Codex Cloud/Web from the phone where possible. PC only for genuinely local-only work.
- Codex Cloud shell may lack GitHub credentials. If local work is complete and push fails only for credentials, use the Codex platform `PR-Entwurf erstellen` handoff rather than introducing tokens.
- Never execute Sleeper add/drop/FAAB/trade automatically.

## 8. Next-chat bootstrap

The next ChatGPT conversation should begin with a live READ-ONLY authority verification and then locate/read this file on the active handoff branch/PR before interpreting older checkpoint claims.

Expected handoff branch created from exact main `082d77003f6616e290146698641aebe63f37b8c2`:

`pitti/rc4196-physical-partial-handoff`

If branch/main/PR state differs by then, treat that as new evidence and reconcile rather than restoring this snapshot mechanically.
