# rc4.63 Final Mock-Readiness Gate — 2026-08-25

Purpose: finish all work independent of the running M50 research screen so no time is lost waiting. Production/main/gh-pages/Android remain frozen.

## Canonical fallback
If the final M50 threshold family screen fails its anti-overfit gate, Android-verified rc4.63 is the final pre-draft mock candidate. Do not reopen PairSum-v2, Rolling-v1/v4, global QB2/TE2 bans, starter-limit roster caps, player-name forcing, or broad threshold searches.

## Already-established gates that must not be rebuilt
- Android rc4.63 Mock/LIVE parity verified.
- Natural Pick-92 defect causally reproduced and natural-board result verified.
- Safety mechanism/non-interference controls 9/9 PASS, including first QB, first TE, natural repeated-position winner and Exceptional Slide.
- Same-input frozen-metadata threshold family runs and independent utility results remain evidence; failed merge-ref and `__thr` harness runs remain quarantined.

## Mock-ready release checks
Before declaring the candidate ready for natural phone mocks, verify/freeze:
1. app version displayed in Snapshot and duplicate/stale Snapshot detection;
2. league geometry: 10 teams, slot 9, 15 rounds, QB/2WR/RB/TE/2FLEX/K/DST, bench 6;
3. starter maxima are not roster caps; bench WR/RB/TE remain legal;
4. K/DST are not recommended as user draft targets under the established user strategy, while regression logic still understands league slots;
5. hard QB exclusions Geno Smith and Aaron Rodgers remain absent from user QB path;
6. Return-v2 remains the active return model and no historical PairSum/Rolling logic leaks back in;
7. Safety/Exceptional-Slide semantics remain exactly the verified rc4.63 semantics unless M50 passes all required holdout/promotion gates;
8. Snapshot pre-analysis remains fast enough for 2-minute live clock and stale identical snapshots are rejected;
9. backup/export path is preserved before any install candidate;
10. emergency fallback remains: Sleeper available-list screenshot -> assistant recommendation if Companion/Snapshot fails.

## Natural mock protocol
Run natural Sleeper mocks, not scripted beauty-case drafts. At each user pick:
- use a fresh current Snapshot;
- preserve the real 2-minute decision budget;
- show a broader viable candidate set but clearly mark favorite(s);
- record recommendation, chosen player, Return-v2 availability expectation, Safety/exception involvement, and roster state;
- user preference is a tie-breaker among close viable candidates, not an error;
- flag only choices clearly outside the viable set or hard rules.

After a completed mock, AUTO means post-draft analysis/counterfactuals/large-run validation; do not automatically start another mock.

## Freeze decision
M50 FAIL / material utility loss / cosmetic-only gain -> close threshold family and proceed to natural mocks on rc4.63.
M50 promising -> fresh holdout seed family required before any implementation discussion. No direct rc4.64 promotion from the tuning seeds.

## Draft proximity rule
With real draft 2026-08-31, prefer verified rc4.63 plus natural mock evidence over further speculative model breadth. Any later change must be small, necessary, causally isolated, regression-tested, and demonstrably better.