# rc4.63 Threshold-0 — executable Natural Pick-92 gate

Research only. This is the construction contract for the missing executable gate; the existing pure boundary control is not accepted as a substitute.

## Verified executable source path
Use `research/rc463_full_safety_baseline_roster_120_shard_2026.js` -> `research/rc459_realistic_fullmock_tier_audit_2026.js` -> `research/rc459_decision_counterfactual_screen_2026.js`, preserving the blob-pinned source checks already used by the successful 120-seed family. Do not reuse the old Challenger-v1 decision logic.

The current fullmock harness already exposes the required primitives:
- `coachDecision(api,players,s,pn)` computes the actual current Coach decision without advancing the outer RNG;
- `userPick` records chosen row, top board, safety, state and raw score;
- `runDraft` deterministically executes opponents and user picks through the same league geometry.

## Required Pick-92 reconstruction
1. Use the same frozen Sleeper metadata snapshot SHA-256 as the parity-validated 120-seed threshold run.
2. Use a seed/state known to exhibit the Pick-92 QB2 Safety resurrection; reconstruct picks 1..91 through the unchanged current simulation kernel. Do not manually fabricate the roster.
3. Assert user state immediately before pick 92, including already having QB1 and the expected RB/WR/TE counts. Fail closed if the state is not the intended fixture.
4. Evaluate the unmodified Full-Safety decision at pick 92 and persist the full pre-Safety candidate board, the promoted candidate, natural raw leader and best legal RB/WR.
5. Apply only threshold-0 repeated-position QB/TE suppression. Re-normalize exactly as the current Coach does.
6. Assert the artificial QB2 resurrection is suppressed. Assert the winner equals the unchanged natural post-treatment board leader. Blake Corum is an expected historical fixture result, not a player-name forcing rule: if the reconstructed frozen state yields another genuinely stronger legal candidate, fail the historical expectation separately and inspect rather than force Corum.
7. Assert outer RNG snapshot is unchanged by both decision evaluations.
8. Emit complete fingerprints for picks 1..91, metadata snapshot, pre-Safety board, Full-Safety pick, threshold-0 pick and post-treatment board.

## Non-interference controls in same executable
- first QB case: threshold treatment must be a no-op;
- first TE case: no-op;
- repeated QB/TE that is natural pre-Safety leader: no-op;
- repeated QB/TE meeting the existing elite Exceptional-Slide semantics: no-op;
- RB/WR candidate: no-op.

## Fail-closed rule
Any source blob drift, metadata SHA mismatch, missing exact fixture state, RNG movement, or unexpected unrelated decision delta is FAIL. A pure arithmetic test of gap -54.428049 is insufficient.
