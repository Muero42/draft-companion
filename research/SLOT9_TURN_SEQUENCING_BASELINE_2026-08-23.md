# Slot-9 turn sequencing baseline — 2026-08-23

Purpose: convert already-PASS rc4.59 conditional turn-market evidence into a compact draft-day sequencing reference without changing Player Quality or Coach coefficients. These are timing probabilities only; player quality, health/role and roster utility remain separate gates.

Source family: `simulation_2026/RC459_TURN_PAIR_MARKET_2026.json` / `RC459_DECISION_INSIGHTS_2026.json`, fresh freeze hash `5339a37d...`, rc4.59 profiled-baseline opponent kernel, 2,000 realistic parent states.

## 1.09 -> 2.02
Conditional return if passed at 1.09:
- Jaxon Smith-Njigba: 0.0%
- Jonathan Taylor: 0.0%
- Amon-Ra St. Brown: 1.79%
- James Cook III: 11.96%
- CeeDee Lamb: 23.99%
- Saquon Barkley: 52.82%
- Ashton Jeanty: 68.86%
- Justin Jefferson: 85.01%
- De'Von Achane: 87.09%
- Omarion Hampton: 96.79%
- Chase Brown: 97.50%

Sequencing consequence: when Player Quality is close enough, use 1.09 on the strong low-return target and preserve the highly returnable target for 2.02. The canonical example is Cook before Brown in normal shared-availability states. This is not a Brown fade; it is opportunity-cost ordering.

## 3.09 -> 4.02
Selected conditional return examples:
- Kyren Williams: 16.13%
- Malik Nabers: 47.44%
- Chris Olave: 80.17%
- Zay Flowers: 97.75%

Sequencing consequence: if health-adjusted Player Quality is sufficiently close, a scarce/low-return candidate such as Kyren or Nabers should generally be considered before a very-high-return candidate such as Flowers. Nabers remains subject to his independent ACL/cartilage return-ramp gate; timing must not erase health risk.

## 5.09 -> 6.02
Selected conditional return examples from the same PASS decision-insight layer:
- Colston Loveland: 16.24%
- Garrett Wilson: 35.38%
- Tyler Warren: 52.49%
- Jaylen Waddle: 53.05%
- D'Andre Swift: 82.98%
- Terry McLaurin: 88.52%
- Jameson Williams: 94.73%
- Parker Washington: 99.75%

Sequencing consequence: on a board containing multiple acceptable targets, Loveland/Wilson/Warren/Waddle carry materially more immediate collision pressure than Jamo/Parker. This does not mean draft TE or WR by quota; it means do not spend 5.09 on a 95-99% return candidate while an equally attractive 16-53% return candidate is available without an independent reason.

## 7.09 -> 8.02
Selected conditional return examples:
- Rome Odunze: 28.31%
- Christian Watson: 55.64%
- Parker Washington: 81.89%

Again, this is ordering information only. Parker can remain a strong value thesis while still being the more waitable member of a close turn pair.

## Draft-day rule
At every slot-9 turn:
1. establish the admissible Player Quality / health-role / roster-utility set first;
2. within that set, compare conditional collision/return;
3. take the materially less-returnable close target first;
4. never promote a clearly weaker player solely because return is low;
5. re-run with 30/31 Aug market/health refresh rather than freezing these probabilities as immutable.

This baseline is independent of the experimental Joint PairSum policy. It may be used as a sanity control for that research, but it must not be tuned from the new PairSum screen.