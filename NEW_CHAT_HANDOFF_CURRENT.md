# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260902T1125Z-v226`
Created: 2026-09-02

## AUTHORITY
Repository: `Muero42/draft-companion`. Always compare this handoff with actual main + current PR exact head/CI before mutation.

Physical Android: **rc4.183 installed/observed but DEVICE_REJECTED**. It crossed the old startup dead-state, but user screenshots proved two remaining defects: FA/Add-Drop cards under Kader and IR/Reserve Zach Charbonnet used as a normal drop target.

## MERGED FIXES
- PR #100 -> main `4ac2eec9...`: canonical Sleeper roster slots; FLEX RB/WR/TE; WRRB_FLEX RB/WR; REC_FLEX WR/TE; SUPER_FLEX QB/RB/WR/TE; two-TE lineups allowed when slot permits; canonical slot labels instead of occupant position; K/DST excluded from generic skill drop pool; K-only kicker replacement on Waiver/FA; no Sleeper projections/matchup grades; PITTI evidence parity for starters/alternatives.
- PR #101 -> main `f5f7b393...`: Kader lineup-only; FA/Add-Drop decisions route to Waiver/FA; live ordinary drop candidates must be ACTIVE, so IR/Reserve is never an ordinary drop/capacity target.

## CURRENT RELEASE CANDIDATE — PR #102
Branch: `pitti/rc4184-release`. **OPEN / UNMERGED.**
rc4.184 version promotion initially failed because only app.js was bumped. app.js/index.html/sw.js/README were synchronized. Exact head `6f7a82d702eeb17aafc54b7cdc579e5529c45f80` then showed Project Guardrails PASS and all important runtime/Season semantic regressions PASS, but Candidate Package + Release Contract failed because `manifest.webmanifest` still contained rc4.183. Manifest has now been corrected to rc4.184, creating a newer exact head. The new chat MUST query the actual PR #102 head and its CI; never treat 6f7a82d or any older head as current-green evidence.

No merge, deploy, or device test until **all gates on the new exact head are green**.

## DEVICE CANARY AFTER GREEN + MERGE/DEPLOY
One physical rc4.184 test only. It must prove:
1. Kader contains lineup/start-sit, not FA/Add-Drop cards.
2. Actual Sleeper slot labels are shown; FLEX eligibility includes RB/WR/TE.
3. IR/Reserve players are not ordinary drop targets.
4. Add/Drop decisions appear under Waiver/FA.
5. Kicker replacement is K-vs-K on Waiver/FA only.
6. Starter vs alternative comparison uses PITTI panel/projection/matchup evidence, not Sleeper projections/matchup grades.

## EXPERT / DST POLICY PRESERVED
- Position-specific expert phase policy; gradual transition from preseason/draft evidence into Week-1/in-season evidence.
- Justin Boone preserved as major in-season/Trade Value source; Jody Smith preserved where phase-appropriate.
- DST: combine RotoBaller tier assessment with multi-week schedule planning (Polizzi-style). A DST for the over-next week may be stashed early only when a roster spot is genuinely expendable/opportunity cost acceptable and the projected matchup edge is material. Information advantage/current-news reaction remains the larger general lever.
- FA/Waiver decisions precede Trade work in product priority.

## AUTO / AUTO BLOCK — NON-NEGOTIABLE
AUTO means continuous autonomous work while safe executable work exists.
- No intermediate/progress/acknowledgement messages.
- No empty messages.
- Never say “AUTO läuft weiter” and then stop.
- After each package: checkpoint material changes, re-inventory independent lanes, execute next highest-value safe package.
- External CI/deploy: at most one immediate poll. If pending, mark only that lane waiting and continue independent work. End only when no safe independent work remains.
- Device screenshots/version reports are immediately canonical evidence before further development/promotion.
- No device-side trial-and-error/cache clearing/reinstall loops.
- STATUS is report-only: no polling, mutations, or continuation.

## ANTI-REGRESSION
Do not resurrect rc4.171-176 debug loops, rc4.175 truncation, old Mevis-for-skill-player logic, Kader FA cards, IR drop targets, occupant-position-as-slot labels, Sleeper projection/matchup scoring, or stale green CI from superseded heads. Draft is immutable history; live Sleeper is current roster/ownership/slot authority.
