#!/usr/bin/env python3
import pathlib,hashlib
SRC=pathlib.Path('research/rc463_preweek1_repair_utility_2026.py')
s=SRC.read_text();b=s.encode();git=hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
if git!='c1318a5943427250630a789e3067061f23081c5a': raise RuntimeError('REPAIR_SOURCE_DRIFT '+git)
anchor="G=load('/tmp/guard','guard','rc463_baseline_roster_export')"
replacement="G=load('/tmp/neartie','neartie','rc463_neartie_safety_roster_export')"
if s.count(anchor)!=1: raise RuntimeError('NEARTIE_REPAIR_LOAD_ANCHOR_DRIFT')
s=s.replace(anchor,replacement)
# Rename diagnostic vocabulary only after replacing the exact loader contract.
s=s.replace('guard','neartie')
s=s.replace("'comparison':'minimal neartie minus full safety after conservative pre-Week-1 FA repair'","'comparison':'near-tie safety minus full safety after conservative pre-Week-1 FA repair'")
s=s.replace('diagnostics_2026/RC463_PREWEEK1_REPAIR_UTILITY_120_20260825.json','diagnostics_2026/RC463_NEARTIE_PREWEEK1_REPAIR_UTILITY_120_20260825.json')
# Fail closed if the intended exact input/output contracts are absent after transform.
for marker in ["G=load('/tmp/neartie','neartie','rc463_neartie_safety_roster_export')","'delta_repaired_neartie_minus_full'",'RC463_NEARTIE_PREWEEK1_REPAIR_UTILITY_120_20260825.json']:
 if marker not in s: raise RuntimeError('NEARTIE_REPAIR_TRANSFORM_MISSING '+marker)
exec(compile(s,'<neartie-repair-utility>','exec'),{'__name__':'__main__'})
