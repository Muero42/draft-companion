# QB/TE metadata-safe baseline pathology audit — 2026-08-24

Scope: exact 60 metadata-safe full drafts from run `32651366239`, seeds `459710001..459710060`. This is diagnostic evidence about the current rc4.59 research policy geometry; it is not production certification.

## Complete-roster geometry
Across 60 complete 15-pick user rosters:
- QB count distribution: QB2 = 14, QB3 = 26, QB4 = 16, QB5 = 4. Therefore 46/60 rosters contain at least three QBs.
- TE count distribution: TE1 = 29, TE2 = 26, TE3 = 5.
- RB count ranges 1..7; WR count ranges 4..9. Several extreme QB accumulations directly crowd out RB depth.

## Where the accumulation occurs
QB selection frequency by user pick:
- 69: 4/60
- 72: 13/60
- 89: 22/60
- 92: 35/60
- 109: 6/60
- 112: 23/60
- 129: 28/60
- 132: 14/60
- 149: 45/60

Third-or-later QB events: 70 across the 60 drafts. They occur mainly at 149 (36), 129 (14), 132 (12), 112 (6), plus one each at 92 and 109. Third-or-later TE events: 5 (four at 129, one at 132).

Thus there are 75 unequivocally structurally redundant QB3+/TE3+ selections in only 60 drafts.

## What those redundant picks displaced in the recorded Top boards
For the 75 QB3+/TE3+ events, the first recorded non-redundant alternative in the decision Top list was overwhelmingly an RB upside/contingency profile:
- Jonah Coleman: 40
- Keaton Mitchell: 18
- Tank Bigsby: 6
- Kenny Gainwell: 4
- Jordan Mason: 2
- Tyler Allgeier: 1
- Blake Corum: 1
- Jacory Croskey-Merritt: 1
- Matthew Golden (WR): 1
- one event surfaced Travis Kelce as the next TE context.

Examples from exact seeds:
- 459710001 pick129: QB3 Bo Nix over visible Jonah Coleman; pick149 QB4 Kyler Murray over Keaton Mitchell.
- 459710002 pick129: QB3 Brock Purdy over Jonah Coleman.
- 459710010 pick112: QB3 Brock Purdy over Jordan Mason; pick132 QB4 Bo Nix over Jonah Coleman.

This is strongly inconsistent with the championship-upside late-round objective in a shallow 10-team 1QB league.

## Second QB/TE before pick 121
There are 47 second-position selections before pick121:
- QB2 at 89: 6
- QB2 at 92: 11
- QB2 at 109: 2
- QB2 at 112: 16
- TE2 at 49: 8
- TE2 at 52: 4

Common selected duplicates: Trevor Lawrence (16), Brock Purdy (14), Colston Loveland (8), Tyler Warren (4), Justin Herbert (3), plus isolated Dak/Caleb. Visible alternatives again skew heavily to RB/WR depth: Kenny Gainwell, Jordan Mason, D'Andre Swift, Blake Corum, Rico Dowdle, David Montgomery, Jacory Croskey-Merritt, Josh Downs, Tony Pollard, Terry McLaurin.

## Interpretation
1. The baseline's duplicate-position soft penalties do not prevent severe QB accumulation. The issue is not a rare edge case.
2. The previously tested global one-QB/one-TE hard guard is still rejected because its paired complete-roster utility loss was material; therefore the correct response is not a blanket permanent ban.
3. A count-capped, phase-sensitive hybrid is directly motivated: QB3/TE3 should be inadmissible; ordinary QB2/TE2 should remain highly constrained while RB/WR option value is substantial; a second QB/TE can reopen late for true exceptional value.
4. Acceptance must inspect both paired outcome utility and roster geometry/displaced upside. A small average-utility gain cannot authorize a policy that still generates pathological multi-QB/TE rosters, and a modest utility loss may warrant closer diagnosis if the outcome proxy undervalues late contingency upside.

## Validation guard
The earlier rc4.60 phase-threshold run `32701499038` cannot answer this question because its intervention was a lexical-closure no-op. Use only corrected hybrid-v3 run `32703809667` or later explicitly canary-verified runs.