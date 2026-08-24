# PITTI final release acceptance plan — 2026-08-24

Objective: produce a stable Draft Companion for Aug 31 that improves decision quality in the user's actual 10-team Half-PPR league without overfitting research artifacts.

## Stable lineage
Current known prepared baseline remains `pitti-auto/finalization-rc4.52`. Its deterministic finalization workflow restores the rc4.50 runtime baseline, applies rc4.52 runtime + hardening patches, runs syntax/contract tests, builds exactly eight runtime files, verifies ZIP integrity, hashes the ZIP and persists provenance. Last recorded successful candidate: run 32230244548, runtime commit 8adb47c363785df54a06a96a831268939e1812e7, ZIP SHA-256 38e46c942e2b95c862587fdab1bd5bf71b2da524e5efc1ef0107acaad2c7bf32. This is a prepared baseline, not proof of Android installation.

## Release architecture rule
Do not port the rc4.59 research simulator wholesale into production. Make only small transparent changes on the stable lineage that are directly supported by finalization evidence.

Required policy shape:
1. intrinsic tier / quality safety;
2. acute hold/exclusion state;
3. roster-construction guard;
4. TAKE/WAIT return logic only within close intrinsic bands;
5. candidate presentation/provenance.

No PairSum/Rolling scalar. No name-only identity. No global QB2/TE2 hard ban.

## Required acceptance battery
Use fresh seeds and position-aware metadata. Do not fit policy thresholds on the same acceptance seeds.

### A. Decision-frequency audit
At minimum track by pick window and player:
- recommendation frequency;
- TAKE/WAIT frequency;
- intrinsic tier/category;
- first QB/TE timing;
- QB2/TE2 timing;
- RB/WR counts through each turn;
- late-round upside RB/WR share;
- true-faller capture rate;
- acute-HOLD recommendation count.

Hard fail examples:
- Chase Brown repeatedly at 1.09 without a new explicit re-tier;
- Josh Allen repeatedly at 2.02;
- Jeanty treated as healthy while HOLD active;
- repeated early QB2/TE2 without explicit exceptional-value evidence;
- systematic K/DST drafting by user policy;
- a single player/position dominating because of a deterministic artifact rather than board state.

### B. Roster plausibility
Audit complete rosters, not only scalar utility. League starters: QB, 2 WR, RB, TE, 2 FLEX; bench 6; K/DST are not user draft targets. Preserve late-QB/late-TE baseline but permit exceptional fallers. Require sufficient RB/WR depth and meaningful late upside.

### C. Robustness
Vary market dispersion/opponent paths. A policy is not accepted because it wins one deterministic seed set. Replicated explainable defects may justify a small patch; isolated odd drafts do not.

### D. Regression
Before RC ZIP:
- syntax/runtime gates;
- live draft ID/league invariant guard;
- dynamic candidate visibility and fallback labeling;
- manager live adaptation/provenance;
- ranking-storage quota regressions;
- backup/restore;
- snapshot version/provenance;
- position-aware player identity.

### E. RC and Android gate
Build one deterministic full ZIP, record runtime commit + ZIP hash + file list. Only then ask for Android install/runtime verification. Run one natural 2-minute dress rehearsal. If no release-blocking defect appears, freeze. After freeze: only material data/injury refresh and necessary low-risk bug fixes.

## Parallel work while mocks run
- finish 3.09/4.02 and later intrinsic/upside board;
- build Sleeper queue fallback;
- audit stable-lineage tests and version provenance;
- event-driven acute injury updates only;
- no optional TE research unless acceptance produces a replicated TE pathology.