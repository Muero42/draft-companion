# PITTI HANDOFF CURRENT — v195
Handoff generation: `20260830T1618Z-v195`
Generation: `20260830T1618Z-v195`

## Canonical state
- Runtime/source/deployment authority remains **v11.8.0-rc4.130**.
- Latest canonical backup: **draft-companion-v7-backup-2026-08-30T16-02-06-862Z.json**, draft **1399782216862588928**.
- Exact evidence count: **29 current-draft fixtures across 15 own picks; 14/15 exact v4/v5 pairs**.
- Exact missing pair: **pick 29 / expertv5**. Therefore the intended 30/30 gate is NOT PASS.
- Do not fabricate the missing fixture or call the backup complete unless a deterministic replay reproduces the original state exactly.

## Model verdict
- **v4 PRIMARY**, **v5 CHALLENGER**, **v3 failsafe/control**.
- 14 exact paired states: same leader 11/14.
- Divergences: pick32 v4 Javonte vs v5 Nabers; pick92 v4 Dak vs v5 Trevor Lawrence; pick129 v4 De'Zhaun Stribling vs v5 Chris Rodriguez.
- User choices matched v5 in those three divergences, but user choices are not labels and do not by themselves justify promotion.
- Paired Top-10 Return Brier is effectively tied (v4 0.09056, v5 0.09052); no last-minute weight/source retune is justified.

## Data-quality audit
- Terry McLaurin is **4/6 expert coverage in both v4 and v5**, missing **Justin Boone + Sean Koerner**. This is real panel missingness, not merely a rendering artifact.
- D'Andre Swift at pick52 is Top-1 in both profiles with no player-specific researchEvidence and inactive researchResidual, so the visible rationale is generic-only.
- Backup-wide Top-10 generic-only rows: v4 **34/150**, v5 **28/140**.
- Persistent audit tool now merged: `tools/audit-v45-backup.mjs`, CI self-test PASS. It checks pair completeness, sparse coverage/missing expert identities, generic descriptions, and v4/v5 leader divergences.

## Exact continuation
- Keep **rc4.130** as the draft runtime; audit tooling alone requires no phone update.
- Keep **v4 PRIMARY / v5 CHALLENGER** for the real draft.
- Any later backup/export must run through the new quality audit before model conclusions.
- Do not reopen expert-source/weight design absent new concrete evidence.
- No cache/app-data clear, reinstall, or phone trial-and-error.

## Process locks
- AUTO/AUTO BLOCK = actual long autonomous execution; no progress chatter.
- STATUS = report-only/no tools.
- Starter maxima are not roster caps; normal user draft excludes K/DST; exactly one QB for user roster; Geno/Rodgers rank organically.
