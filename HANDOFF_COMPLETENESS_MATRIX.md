# PITTI HANDOFF COMPLETENESS MATRIX — REPO v115

A new-chat takeover fails closed unless all checks pass.

## 1 Authority
- command contract loaded
- CURRENT loaded
- PASS Seal loaded
- CURRENT / Seal / Handoff generation identical
- every seal-listed repo blob hash verified
- Execution Lock loaded
- Project State read to EOF
- current handoff/bootstrap/matrix loaded
- actual repo/runtime/artifact/device state checked
- Library checked when available; stale Library cannot override newer verified repo/device evidence

## 2 Runtime boundary
- rc4.64 production/control
- rc4.82 last fully Android-verified authority
- rc4.83 deployed TEST challenger, not promoted or Android-verified
- rc4.78 package/re-extract boundary
- rc4.52 Library aliases recovery only
- built/prepared/deployed/Android-verified kept distinct

## 3 Draft invariants
- 10-team Half-PPR, slot 9, 1QB
- exactly one user-drafted QB; QB2 hard user-Coach exclusion after QB1
- Geno Smith/Aaron Rodgers hard exclusions
- no normal K/DST
- starter maxima are not roster caps
- WR saturation soft, no hard cap; exceptional WR value remains legal
- TE2 exceptional-soft, not globally banned

## 4 Expert invariants
- incumbent, Expert-v2 ALL, Expert-v2 WR-only all selectable
- no final profile winner claimed
- exact v2 weights/order preserved
- Brown excluded; Erickson qualitative challenger only; DS counted once
- Frozen-v2 weights/provenance never live-renormalized

## 5 Evidence integrity
- rc4.83 kernel frozen pending OOS
- Evidence-v2 direct roster positions/counts bug fix present
- Coach-vs-user decision outcome retained
- user overrides/final roster not used as training labels
- current gate = realistic rc4.83 mock -> refresh -> one-tap Evidence-v2 export

## 6 AUTO durability
- long blocks default
- user reminder not required
- repeated post-package re-inventory required
- blocked lane only
- mandatory parallel lane inventory
- promise/status-only responses forbidden while work exists
- external gate valid only after independent-lane exhaustion

## 7 Old-error scan
Explicitly reject resurrection of PairSum/Rolling, fixed caps, player forcing, blind RB forcing, generic Return retune, generic QB2/TE2 ban, Superflex, starter-maxima cap error, Brown numeric v2, rejected temporary expert pool, DS double count, stale cross-draft identity, false Expert-v2 health/provenance, stale snapshot version, package/device conflation, or end-roster-as-Coach-success.

## 8 Execution witness
Before user-facing AUTO completion, actual work must have been executed in the current run unless the only remaining condition is a genuinely unavoidable external/device gate after all independent lanes are exhausted.

## 9 v115 tooling canaries
- release contracts execute rc4.83 draft-critical gate
- candidate package label derives from APP_VERSION and cross-checks index/sw/manifest
- Evidence-v2 completed mock requires exact rc4.83 + 15 unique own-pick fixtures

- active authority prose must be generation-generic; no stale sealed-generation pointer may override CURRENT/SEAL
- Evidence-v2 analysis separates dated acute-status hard blockers from the late-WR saturation hypothesis
 - promotion Evidence-v2 must be realistic mock mode, slot 9; acute-status confounds reported separately
- executable transfer guards must not require a historical handoff generation literal
- pre-real-draft freshness gate must fail closed on stale blocking acute-status entries; default max age 2 days
- Emergency Queue must retain executable 35-cap + one-QB/one-TE fallback contract
- Evidence-v2 OOS interpretation must expose clean non-acute-confounded metrics separately from whole-mock counts
