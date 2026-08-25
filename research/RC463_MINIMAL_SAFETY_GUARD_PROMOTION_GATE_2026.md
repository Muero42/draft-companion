# rc4.63 minimal repeat-QB/TE safety-resurrection guard — promotion gate

Research-only design note. No production mutation is authorized by this document.

## Defect mechanism to isolate

The production Coach keeps QB/TE on the normal candidate board. `applyPlayerQualitySafetyGate` can nevertheless replace the natural raw-score leader by a candidate in the narrow panel-quality band, lifting that candidate to `maxRaw + 0.25`. On the frozen natural rc4.63 pick-92 state, this mechanism promotes Trevor Lawrence (QB2) over natural raw leader Blake Corum.

The intended correction is **not** a QB2/TE2 ban and **not** a positional quota. Repeat QB/TE remain eligible in normal scoring and may win naturally. The narrow change under test is only whether an already-filled QB/TE candidate may participate in the PlayerQualitySafety promotion pool.

## Candidate rule

For the primary live Coach safety gate only, before PlayerQualitySafety promotion:

- RB/WR and first QB/TE: unchanged.
- Repeat QB/TE: remain on `scored` and normal ordering.
- Repeat QB/TE may enter the safety-promotion pool if it is already the natural pre-safety raw-score leader.
- Preserve the established exceptional-slide escape (QB: panel <=45 and slide >=35; TE: panel <=35 and slide >=30) unless a stricter independently validated rule supersedes it.
- Do not add any player-name exception, round quota, final roster cap, or fixed number of RB/WR.

## Mandatory implementation-level gates before any rc4.64/main/gh-pages promotion

1. **Exact frozen natural pick92** — production-full-safety branch reproduces Trevor Lawrence safety promotion; guarded candidate keeps Blake Corum while Trevor remains on normal board.
2. **First QB / first TE invariance** — when count is zero, safety behavior is byte-for-byte/order-equivalent to rc4.63 for representative early/mid/late states.
3. **Natural repeat QB/TE win survives** — a materially superior repeat QB/TE that is natural pre-safety leader remains recommendation #1.
4. **Exceptional slide survives** — established QB/TE exceptional-slide conditions remain safety-eligible.
5. **No hard exclusion** — repeat QB/TE still appear in candidate/path/visible-board diagnostics when otherwise admissible.
6. **Late roster behavior** — no implicit RB/WR quota; RB7 saturation and meaningful WR quality-edge reversibility remain intact.
7. **Mock/LIVE parity** — one shared decision path; no mode-specific ranking fork.
8. **Snapshot/backup compatibility** — no schema break; no localStorage growth/regression.
9. **Static/syntax/package regression** — app.js syntax, service worker, package hashes/build checks and existing regression suite PASS.
10. **Fresh paired utility** — same 120 frozen seeds, production-like full safety vs minimal guard; non-inferior Championship Utility plus improved roster reality required.

## Interpretation rules

- The broad v5 late-WR challenger is a separate research question. A positive v5 Utility result does not authorize bundling late-WR behavior into the minimal safety fix.
- Serialized fixture `coachScore` is not `rawScore`; natural raw margins must be recomputed executable from the frozen state.
- A failed harness is diagnosed as harness/model separately before any policy conclusion.
- Freeze proximity raises the evidence threshold: absent a material defect, remain on rc4.63. If the safety-resurrection defect is promoted, the patch must be the smallest validated change and must not reopen unrelated UI/model work.
