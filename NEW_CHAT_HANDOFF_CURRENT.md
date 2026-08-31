# NEW CHAT HANDOFF — PITTI DRAFT DAY 2026-08-31
Generation: `20260831T1455Z-v215`
Generated: 2026-08-31 ~16:55 CEST
Purpose: clean continuation chat for remaining draft-day preparation. This file supersedes stale handoffs for operational state.

## 0. CANONICAL AUTHORITY / FAIL-CLOSED
- Repository: Muero42/draft-companion.
- Android accepted runtime: **v11.8.0-rc4.158**.
- main/gh-pages runtime parity: **13/13 PASS**.
- rc4.158 full gates: Project Guardrails PASS; Release Contract PASS; Candidate Package/Re-Extract PASS.
- Android smoke PASS: version 158 visible, Expert Delta button visible.
- Device expert day baseline: **9/9 complete**.
- Runtime status: **DRAFT_READY_FROZEN**.
- Do not resurrect rc4.152/153/154/157 as current authority. rc4.157 is only historical accepted predecessor.
- No code/model/runtime changes before draft absent a critical draft-blocking defect.
- Library handoff data may be stale; GitHub canonical state/checkpoints outrank it.

## 1. LEAGUE / DRAFT
- Real draft: 2026-08-31 20:00 CEST, phone, 2 min/pick.
- 10 teams, Half-PPR.
- Starters: QB, 2 WR, RB, TE, 2 Flex, K, DST; bench 6.
- User slot: #9.
- Exact manager/draft order: **1 Michael · 2 Pascal Voerde · 3 Marc Düsseldorf · 4 Thomas · 5 Björn · 6 Pascal Gelderner · 7 Giuliano · 8 Bastian · 9 Muerotechnik · 10 Dutch Marc.**
- Identity locks: no Michael K; user team is Muerotechnik, not Moers Venom; Pascal Voerde and Pascal Gelderner are distinct; Bastian is slot 8.
- Historical locks: Michael includes 2025; Pascal Voerde identity chain = Bracht Eagles 2017–2022 + Voerde Eagles 2023–2025; Björn 2021 theme and 2023 autodraft are excluded from ordinary human-preference learning.
- Exact picks: 9/12, 29/32, 49/52, 69/72, 89/92, 109/112, 129/132, 149.
- No K/DST drafted.
- One QB only; no QB2.
- Hard QB exclusions: Geno Smith, Aaron Rodgers.
- Late QB/TE strategy remains; do not force either early.

## 2. CURRENT V4 EXPERT PANEL — DO NOT ALTER
Visible live expert display order is visual only and stable: Sean Koerner → Dalton Del Don → Pat Fitzmaurice → Nick Mariano → Justin Boone → Todd D Clark → Ryan Weisse → Kev Wheeler → Wolf of Roto Street. Only panel members for the analyzed position appear; missing individual player rank stays #–/fehlt.
QB: Todd D Clark / Sean Koerner / Justin Boone / Dalton Del Don / Nick Mariano / Pat Fitzmaurice.
RB: Ryan Weisse / Kev Wheeler / Dalton Del Don / Nick Mariano / Sean Koerner / Pat Fitzmaurice.
WR: Sean Koerner / Justin Boone / Todd D Clark / Pat Fitzmaurice / Nick Mariano / Dalton Del Don.
TE: Pat Fitzmaurice / Ryan Weisse / Sean Koerner / Justin Boone / Dalton Del Don / Wolf of Roto Street.
v4 PRIMARY; v5 challenger; v3 failsafe.
Expert day baseline created on Android rc4.158: 9/9 COMPLETE.

## 3. EXPERT DELTA WORKFLOW
- New rc4.158 control: **Experten-Delta prüfen**.
- It is manual, intentionally not automatic.
- Do not use blanket expert “Alles aktualisieren” after today's baseline.
- Delta check force-fetches each v4 expert temporarily, compares full ranking fingerprint, restores exact baseline when unchanged, and fail-closes to prior verified baseline on incomplete/error result.
- Cache-only panel rebuild after real change; incomplete baseline repair retries only failed experts.
- Planned final device delta check: ~19:40–19:45 CEST.
- Do not refresh experts during real draft.
- Earlier extra delta check only if explicit material expert-update signal/new material news warrants it.

## 4. COMPLETED WORK — DO NOT REPEAT WITHOUT NEW EVIDENCE
- rc4.158 implementation/test/deploy/device acceptance.
- 6,000-draft stochastic stress across baseline/RB-run/WR-run/QB-TE-run/autodraft-heavy/chaos.
- Manager/autodraft turn stress.
- Exact pick-pair execution matrix.
- Five-WR ceiling/floor/market reconciliation.
- Josh Jacobs exempt-list / suspension-risk calibration.
- First-pass final-53 fantasy reconciliation.
- Late-RB opportunity classes.
- Generic market vs Sleeper/Return-v2 precedence.
- Injury/legal price reconciliation.
- Pre-waiver static closeout.

## 5. STRESS / MANAGER FINDINGS
- RB-run stress: 38% ended <5 RB and 36% >=8 WR. Do not impose hard quota; exploit falling WR early, consciously repair RB depth with upside later.
- WR-run: RB/RB worked in 68% scenarios; exploit falling RB rather than chase WR scarcity.
- Late QB stable; no QB2.
- Bastian #8 can be a meaningful mid-round WR snipe risk.
- Dutch Marc #10 more variable.
- When manager is confidently AUTO, rc4.158 disables historical manager tendencies and uses Sleeper order + roster need.
- A single pick at timer expiry is NOT enough to label AUTO.
- Sleeper real-draft autodraft without custom queue likely follows Sleeper ranking more closely than mock NPC behavior.

## 6. FIVE-WR CLUSTER — CORRECT NAMES
**DeVonta Smith / Zay Flowers / Emeka Egbuka / Tetairoa McMillan / Jaylen Waddle.**
Never substitute Higgins/McConkey; that was an old assistant error.
Current independent rankings confirm a tight cluster; do not manufacture a tier break.
PITTI utility roles:
- McMillan = strongest ceiling/reach thesis.
- Smith = strongest floor/role-security thesis.
- Flowers = balanced middle.
- Egbuka = demonstrated high-end scoring path with more variance.
- Waddle = strongest WAIT/return candidate from PITTI stress geometry; this is Sleeper/manager-specific, not generic ADP truth.
At 29/32 choose two as a portfolio using availability + v4 + ceiling + Return-v2 + taker risk. No universal hard 1–5 order.

## 7. KEY CURRENT RISK OVERLAYS
### Josh Jacobs
- On Commissioner's Exempt List; cannot practice/play while there.
- Exempt status is administrative, not a fixed six-game suspension.
- NFL policy six-game baseline is relevant only if a qualifying conduct violation is found; do NOT encode “six games certain.”
- Current unavailability + unknown duration + possible later discipline makes Jacobs a materially discounted high-variance asset.
### MarShawn Lloyd
- Material upgrade from Jacobs status; strong upside.
- Do not assume guaranteed uncontested workhorse: durability + Kaleb Johnson/Chris Brooks uncertainty.
### Ashton Jeanty
- Not placed on IR; positive horizon signal.
- Ankle/Week-1 uncertainty remains; Mike Washington Jr. first-team/two-back evidence is a ceiling counterweight.
### Kenneth Walker
- Ankle/questionable Week 1; no evidence for long absence.
- Emmett Johnson upgraded contingency target; Brashard Smith remains competition.
### Jeremiyah Love
- High-ankle sprain remains material early-season risk; no clean full-recovery evidence yet.
### Tyler Warren
- Groin/Week-1 monitor; no basis for season-long fade.
### Puka Nacua
- Returned to practice and was not placed on exempt list; acute availability improved. Conduct-policy tail remains separate.

## 8. LATE-RB UPSIDE CLASSES — PRE-WAIVER
A: MarShawn Lloyd / Jordan Mason / Tyjae Spears.
A-/B+: Emmett Johnson / Mike Washington Jr. / Keaton Mitchell.
B/cheap asymmetry: Chris Rodriguez Jr. / Seth McGowan.
Destination watch: Jaydon Blue after Dallas waiver.
Trey Benson is not a normal active redraft assumption.
Reclassify after waiver claims; do not treat this as immutable ordering.

## 9. PICK-PAIR EXECUTION
9/12: two true difference-makers; no forced positional balance; no QB/TE reach.
29/32: key 5-WR portfolio zone; use live Return-v2/taker risk.
49/52: structure/correction turn; if WR-heavy early, RB opportunity-cost checkpoint; if RB-heavy, accept WR value.
69/72: transition to asymmetric upside; standalone+contingency RB preferred to ordinary injury-only handcuff.
89/92: upside acquisition zone; role-capture/contingent RB1 and true WR breakout paths.
109/112: late lottery; concentrated workload pathways > replacement floor.
129/132: championship-utility; high-upside skill players; if QB still absent, rushing-ceiling QB path relevant; still no QB2.
149: best remaining asymmetric skill-position bet. No K/DST/QB2.

## 10. LIVE PRECEDENCE
For TAKE/WAIT:
1. official availability/status;
2. PITTI v4 panel + ceiling research;
3. Sleeper-specific list/Return-v2;
4. observed manager/autodraft state;
5. generic web ADP last.
Return-v2 is timing context, not automatic TAKE/WAIT.
Official transaction truth outranks stale Sleeper metadata.
Same-position acquisition is evidence, not proof of injury.
No hard RB/WR quotas.

## 11. REMAINING DRAFT-DAY GATES
Before 19:00:
- material-news-only delta scan; do not rerun completed work.
At/after 19:00:
- waiver-claim/destination reconciliation; reclassify affected RB/WR/TE only.
~19:40–19:45:
- user presses **Experten-Delta prüfen** once; inspect result.
- final material injury/transaction/news scan.
~19:50:
- operational freeze.
20:00:
- real draft execution.

## 12. LIVE-DRAFT CHAT REQUIREMENTS
For the real draft use a fresh chat after a FINAL PRE-DRAFT HANDOFF around 19:45–19:50.
That final handoff should be short and execution-focused, carrying:
- accepted rc4.158 state;
- final expert delta result;
- post-19:00 waiver deltas;
- any final injuries/legal/transactions;
- exact league/pick geometry and hard rules;
- live manager/autodraft rules;
- five-WR and late-RB final boards;
- emergency screenshot fallback.
Do NOT make the live-draft chat rely on this long research chat or stale memory.

Emergency fallback: if Sleeper snapshot fails live, user sends screenshot of available players + current board; choose from visible players + accepted cached evidence. If manager layer demonstrably harms suggestions, real draft can be represented in companion mock mode as contingency.

## 13. NEXT CHAT INSTRUCTION
On “PITTI AUTO”:
0. Treat generation **20260831T1455Z-v215** as takeover generation. If CURRENT/LOCK/SEAL/HANDOFF/MATRIX generations or rc4.158 authority disagree, STOP and repair the handoff transaction before ordinary work.
1. Read this handoff plus PITTI_CURRENT_STATE.json and PITTI_EXECUTION_LOCK.json.
2. Verify Android authority rc4.158 / expert baseline 9/9.
3. Continue only remaining time-dependent gates.
4. Do not repeat completed stress/research without new evidence.
5. Near 19:45 create a fresh FINAL PRE-DRAFT HANDOFF for the separate live-draft chat.
