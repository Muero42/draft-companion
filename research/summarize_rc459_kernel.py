#!/usr/bin/env python3
import json,pathlib,statistics
x=json.load(open('simulation_2026/RC459_OPPONENT_KERNEL_BASELINE_2026.json'))
turns={};all_abs=[]
for pn,rows in x.get('comparison_vs_36k_robust_mean',{}).items():
    material=[]
    for r in rows:
        d=float(r['delta']);all_abs.append(abs(d))
        if abs(d)>=.05:material.append(r)
    turns[pn]={'material_delta_ge_5pp':material,'max_abs_delta':round(max((abs(float(r['delta'])) for r in rows),default=0),4),'compared_players':len(rows)}
# Highlight early names directly relevant to slot-9/turn decision timing.
watch=['Amon-Ra St. Brown','Jaxon Smith-Njigba','Jonathan Taylor','James Cook III','Chase Brown','Ashton Jeanty','Justin Jefferson','Brock Bowers','CeeDee Lamb','Saquon Barkley']
def at(pn):
    rows=x['cell']['availability'].get(str(pn),[]);m={r['name']:r for r in rows};return {n:m[n]['availability'] for n in watch if n in m}
out={'schema':1,'status':'PASS' if x.get('status')=='PASS' else x.get('status'),'freeze_package_sha256':x['freeze_package_sha256'],'runs':x['runs'],
     'split_half':x['cell']['split_half_max_top50_availability_delta'],'mean_opponent_kdst':x['cell']['mean_opponent_kdst'],
     'early_availability':{'pick9':at(9),'pick12':at(12),'pick29':at(29),'pick32':at(32)},
     'turn_delta_summary':turns,'max_abs_delta_vs_36k':round(max(all_abs) if all_abs else 0,4),
     'conclusion':'MATERIAL_KERNEL_SENSITIVITY' if any(v['max_abs_delta']>=.10 for v in turns.values()) else 'NO_LARGE_KERNEL_SHIFT',
     'policy_ranking_certified':False,
     'interpretation':'If material, replace simplified 36k opponent sampler for decision/timing work. 36k remains descriptive historical research, not discarded.'}
pathlib.Path('simulation_2026/RC459_OPPONENT_KERNEL_DELTA_SUMMARY.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
print(json.dumps(out,indent=2,ensure_ascii=False))
