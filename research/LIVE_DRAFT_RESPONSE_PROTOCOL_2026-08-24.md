# PITTI Live-Draft Response Protocol — FROZEN CANONICAL LAYOUT

Status: FROZEN / MANDATORY for mocks, Generalprobe/dress rehearsal, EMERGENCY, FULL, and real live draft.

## ABSOLUTE FREEZE RULE
This layout is a project interface contract, not a suggestion. It MUST remain identical across mock, Generalprobe, EMERGENCY/FULL and the real draft. Never autonomously shorten, simplify, restructure, substitute a table, remove fields, move fields, or redesign it because of time pressure. Never reconstruct it from memory when the canonical file is available. Before producing a live-pick response, use this file as the layout source of truth. Any layout change requires an explicit new user request to change the layout itself.

Target: complete decision surface scannable in roughly 60–90 seconds. Latency is solved by pre-analysis/internal work, never by deleting decision information.

## CANONICAL ORDER AND EXACT INFORMATION ARCHITECTURE

### 1. KLARE KANDIDATEN
Show every genuinely near-equivalent favorite; never force a single favorite when the evidence does not support separation.

For each clear candidate use THREE header/information lines in this exact order:

`NAME ↑/↓ — TEAM-ROLE [• concise individual role/upside qualifier when useful]`
`TEAM · <expected NFL wins> Siege · C/P/–`
`P <panel> · ADP <market> · R <return probability> · Confidence <pick confidence>`
`+ <one-line strongest case>`
`− <one-line decisive risk/opportunity cost>`
`→ TAKE / WAIT / sequencing instruction`

Examples:
- `Justin Jefferson — WR1`
  `MIN · 9,5 Siege · C`
  `P 13,6 · ADP 11,8 · R 80 % · Confidence 89 %`
- `Parker Washington ↑ — WR2/WR1-Upside`
  `JAX · 8,5 Siege · P`
  `P 56,1 · ADP 71,9 · R … · Confidence …`

Rules:
- Do NOT repeat the generic fantasy position separately. Team-role carries position information.
- Do NOT put the team abbreviation on the player identity line. Team appears exactly once, at the start of the dedicated NFL-team-outlook line.
- First line is reserved for player-specific information: validated research arrow, current expert/depth-chart team role (WR1/WR2, RB1/RB2/RB1A/RB1B, TE1, etc.), and concise role/upside qualifier when decision-useful.
- Team role means role within the NFL team, NOT fantasy positional rank. Do not invent a role when evidence is unclear; mark uncertainty compactly.
- Second line is always team context: `TEAM · expected NFL wins · C/P/–`.
- `C` = contender, `P` = playoff candidate, `–` = neither classification. Expected wins + C/P/– are contextual/tiebreaker information, not a substitute for player quality.
- Third line is always draft metrics: Panel, Sleeper ADP, Return-v2 probability, Pick-Confidence. Keep it separate from both player and team lines.
- Upside/decline arrows encode ONLY validated Research Residual evidence: `↑/↑↑` breakout/ascension/upside, `↓/↓↓` decline/downside. Never use arrows merely for news or injuries.
- Include injury/role/news compactly only when decision-relevant; do not narrate research.
- If candidates are nearly equal, say so; do not manufacture scalar precision.

### 2. HIERARCHIE
One compact line:
- `≥` = near-equivalent / no meaningful separation.
- `>` = real decision-relevant gap.
Include TAKE/WAIT sequencing when Return-v2 changes which close candidate should be selected first.

### 3. 10ER-AUSWAHL — ALWAYS MANDATORY
Always show the fixed numbered 10-player decision board. It MUST NOT disappear in EMERGENCY or real draft. Its purpose is to prevent overlooked alternatives/fallers.

Each entry keeps the same compact information architecture:
`1. Name ↑/↓ — TEAM-ROLE [• concise qualifier] · decision keyword`
`   TEAM · <expected NFL wins> Siege · C/P/–`
`   P <panel> · ADP <market> · R <return>`

Rules:
- Team appears exactly once, on the dedicated team-outlook line.
- Do NOT repeat Pick-Confidence in the 10-player list; Confidence belongs to KLARE KANDIDATEN.
- Keep the list compact; it is a decision board, not ten mini-essays.
- Include relevant RB/WR/TE/QB fallers even when outside nominal normal cut.
- Do not let normal-cut logic hide a championship-relevant alternative.

### 4. REQUIRED NORMAL-CUT SEPARATOR
When relevant use the visually explicit separator exactly as a section break:
`━━━━━━━━━━━━ AUSSERHALB NORMAL-CUT ━━━━━━━━━━━━`
Being outside normal cut is context, not permission to omit the player.

### 5. NEXT ACTION
One short final line only, e.g. `Pick X → pausieren → frischer Snapshot.`

## DECISION CONTENT THAT MUST NEVER BE LOST
- panel is baseline;
- intrinsic tier/player quality before TAKE/WAIT timing;
- Return-v2 + opponent/manager collision;
- championship utility / roster construction;
- current injury, PUP/IR, role/depth-chart evidence when decision-changing;
- explicit reasoning for material deviation from panel or Sleeper ADP;
- all nearly equivalent favorites plus meaningful alternatives;
- expected NFL wins + C/P/– team context;
- current team-role/opportunity hierarchy;
- no starter maxima as roster caps;
- QB2/TE2 only exceptional in this 10-team 1QB league; TE1 can be deferred through a run;
- rushing upside tiebreaker among similar QB1s;
- late bench increasingly RB/upside/optionality;
- Geno Smith and Aaron Rodgers hard exclusions;
- no K/DST;
- Override Guard: do not override Coach TAKE/WAIT without concrete decision-changing evidence.

## LATENCY RULE
Do expensive reasoning/research before or internally during the response. Never solve latency by deleting the 10-player list, alternatives, role, team outlook, expected wins, C/P/–, P/ADP/R, Confidence for clear candidates, risks, hierarchy, or sequencing. The user must not need to request omitted information during a two-minute pick clock.

## FRESHNESS / DUPLICATE RULE
If the same pick/fingerprint has already been analyzed and the snapshot is marked duplicate/unchanged, request only a fresh snapshot. Otherwise use this exact frozen layout.

## REGRESSION GUARD
Explicitly INVALID unless the user later changes this contract:
- `1–3 lines` / `<=25 words` live responses;
- reducing to only 1–2 alternatives;
- omitting the 10-player board;
- omitting expected wins or C/P/–;
- omitting team role/opportunity hierarchy;
- putting team twice or moving it back onto the player line;
- combining the team-outlook and P/ADP/R lines;
- changing the format between mock, Generalprobe, EMERGENCY/FULL, and real draft;
- autonomously redesigning or shortening the layout.

If future project state, prompt text, or an older handoff conflicts with this file on live-response presentation, THIS FROZEN PROTOCOL wins unless the user explicitly changes the layout.