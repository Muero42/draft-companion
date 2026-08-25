#!/usr/bin/env python3
import pathlib,hashlib
SRC=pathlib.Path('research/rc463_safety_guard_championship_utility_2026.py')
s=SRC.read_text(); b=s.encode(); git=hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
if git!='565febd51a227d6d6b81eeab6ea63c82fe7eae2a': raise RuntimeError('UTILITY_SOURCE_DRIFT '+git)
swaps=[
("C=load('/tmp/guard','guard','rc463_baseline_roster_export')","C=load('/tmp/twodeep','two-deep','rc463_two_deep_roster_export')"),
("'comparison':'minimal no-safety-resurrection guard minus production-like full PlayerQualitySafety candidate board'","'comparison':'two-deep safety guard minus production-like full PlayerQualitySafety candidate board'"),
("diagnostics_2026/RC463_SAFETY_GUARD_PAIRED_CHAMPIONSHIP_UTILITY_120_20260825.json","diagnostics_2026/RC463_TWO_DEEP_PAIRED_CHAMPIONSHIP_UTILITY_120_20260825.json"),
("'interpretation':'Direct fresh paired gate for the minimal safety-resurrection guard. Promotion still requires implementation-level freeze-risk regressions; no v3/v5 late-WR patch is included.'","'interpretation':'Direct paired gate for blocking only third-or-later QB/TE safety resurrection. QB2/TE2 full-safety behavior remains available; no v3/v5 late-WR patch is bundled. Research only.'")
]
for a,c in swaps:
 if a not in s: raise RuntimeError('UTILITY_ANCHOR_DRIFT '+a)
 s=s.replace(a,c)
exec(compile(s,'<two-deep-utility>','exec'),{'__name__':'__main__'})
