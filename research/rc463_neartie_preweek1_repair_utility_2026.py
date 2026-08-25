#!/usr/bin/env python3
import pathlib,hashlib
SRC=pathlib.Path('research/rc463_preweek1_repair_utility_2026.py')
s=SRC.read_text();b=s.encode();git=hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
if git!='c1318a5943427250630a789e3067061f23081c5a': raise RuntimeError('REPAIR_SOURCE_DRIFT '+git)
repls=[
("G=load('/tmp/guard','guard','rc463_baseline_roster_export')","G=load('/tmp/neartie','neartie','rc463_neartie_safety_roster_export')"),
("'comparison':'minimal guard minus full safety after conservative pre-Week-1 FA repair'","'comparison':'near-tie safety minus full safety after conservative pre-Week-1 FA repair'"),
("'guard_static'","'neartie_static'"),
("'guard_repaired'","'neartie_repaired'"),
("'delta_repaired_guard_minus_full'","'delta_repaired_neartie_minus_full'"),
("'guard_ops'","'neartie_ops'"),
("'guard_unmatched_fa'","'neartie_unmatched_fa'"),
("r['delta_repaired_guard_minus_full']","r['delta_repaired_neartie_minus_full']"),
("'guard_better'","'neartie_better'"),
("'guard_worse'","'neartie_worse'"),
("'guard_mean_static'","'neartie_mean_static'"),
("'guard_mean_repaired'","'neartie_mean_repaired'"),
("'mean_guard_repair_gain'","'mean_neartie_repair_gain'"),
("r['guard_static']","r['neartie_static']"),
("r['guard_repaired']","r['neartie_repaired']"),
("diagnostics_2026/RC463_PREWEEK1_REPAIR_UTILITY_120_20260825.json","diagnostics_2026/RC463_NEARTIE_PREWEEK1_REPAIR_UTILITY_120_20260825.json")
]
for a,c in repls:
 if a not in s: raise RuntimeError('NEARTIE_REPAIR_ANCHOR_DRIFT '+a)
 s=s.replace(a,c)
exec(compile(s,'<neartie-repair-utility>','exec'),{'__name__':'__main__'})
