#!/usr/bin/env python3
"""Exposure-aware wrapper for PITTI turn-pair counterfactuals.

Runs the existing conditional simulator unchanged, then evaluates statistical
adequacy only for branches with material baseline exposure. Rare forced branches
remain in the artifact but cannot invalidate every otherwise-useful cell.
Research-only; no policy-superiority claim.
"""
import json, subprocess, sys, pathlib

runs=int(sys.argv[1]) if len(sys.argv)>1 else 400
subprocess.run([sys.executable,'research/turn_pair_counterfactual_2026.py',str(runs)],check=True)
p=pathlib.Path('TURN_PAIR_COUNTERFACTUAL_2026.json')
x=json.loads(p.read_text())
threshold=max(30,int(round(.08*runs)))
cell_stats=[]; qualified_total=0; rare_total=0
for pair,cells in x['pairs'].items():
    for cell,info in cells.items():
        candidates={r['name']:r for r in info.get('material_first_pick_candidates',[])}
        qualified=[]; rare=[]
        for name,b in info.get('branches',{}).items():
            exp=float(candidates.get(name,{}).get('candidate_exposure_rate',0))
            sel=float(candidates.get(name,{}).get('baseline_selection_rate',0))
            er=int(b.get('eligible_runs',0))
            inference=(exp>=.08 and er>=threshold)
            b['candidate_exposure_rate']=exp
            b['baseline_selection_rate']=sel
            b['inference_eligible']=inference
            b['adequacy_threshold_runs']=threshold
            (qualified if inference else rare).append(name)
        qualified_total+=len(qualified);rare_total+=len(rare)
        cell_stats.append({'pair':pair,'cell':cell,'qualified_branches':len(qualified),'rare_or_low_n_branches':len(rare),'qualified_names':qualified})
# A cell needs at least two materially exposed branches for a useful TAKE/WAIT comparison.
adequate_cells=sum(1 for c in cell_stats if c['qualified_branches']>=2)
status='PASS' if adequate_cells==len(cell_stats) else 'FAIL_CLOSED'
x['adequacy']={'status':status,'runs_per_branch':runs,'threshold_runs':threshold,'min_exposure':.08,
               'cells_total':len(cell_stats),'cells_adequate':adequate_cells,
               'qualified_branches':qualified_total,'rare_or_low_n_branches':rare_total,
               'cell_stats':cell_stats,
               'note':'Rare/low-exposure forced branches are retained descriptively but excluded from inference; every cell must retain >=2 adequate branches.'}
p.write_text(json.dumps(x,indent=2,ensure_ascii=False))
gate={'status':status,'freeze_package_sha256':x['freeze_package_sha256'],'runs_per_branch':runs,
      'pair_count':len(x['pairs']),'cell_count':len(cell_stats),'adequacy_threshold_runs':threshold,
      'min_material_exposure':.08,'cells_adequate':adequate_cells,'cells_total':len(cell_stats),
      'qualified_branches':qualified_total,'rare_or_low_n_branches':rare_total,'policy_ranking_certified':False}
pathlib.Path('TURN_PAIR_COUNTERFACTUAL_2026_GATE.json').write_text(json.dumps(gate,indent=2))
print(json.dumps(gate,indent=2))
