#!/usr/bin/env python3
"""Compact decision-facing extraction from the already-persisted 36k suite.
Does not re-simulate and does not certify policy superiority.
"""
import json, pathlib, statistics
s=json.load(open('simulation_2026/SIMULATION_2026_ROBUST_SUMMARY.json'))
pairs=[(9,12),(29,32),(49,52),(69,72)]
out={'schema':1,'freeze_package_sha256':s['freeze_package_sha256'],'full_drafts':s['total_full_drafts'],
     'policy_ranking_certified':False,'turns':{},'interpretation':'Market availability and timing only; not exact Coach/Return-v2 parity or outcome-optimality.'}
for a,b in pairs:
    A=s['availability'].get(str(a),[]);B=s['availability'].get(str(b),[])
    bm={r['name']:r for r in B}; rows=[]
    for r in A:
        q=bm.get(r['name'])
        rows.append({'name':r['name'],'pos':r['pos'],'quality_rank':r['quality_rank'],'adp':r['adp'],
                     'available_at_first_min':r['min'],'available_at_first_mean':r['mean'],'available_at_first_max':r['max'],
                     'available_at_second_min':q['min'] if q else 0.0,'available_at_second_mean':q['mean'] if q else 0.0,'available_at_second_max':q['max'] if q else 0.0,
                     'unconditional_survival_drop_mean':round(r['mean']-(q['mean'] if q else 0.0),4)})
    rows.sort(key=lambda z:(z['quality_rank'],-z['available_at_first_mean']))
    out['turns'][f'{a}->{b}']={'market_candidates':rows[:20],
                              'selection_rates_first':s.get('selection_rates',{}).get(str(a),[])[:15],
                              'selection_rates_second':s.get('selection_rates',{}).get(str(b),[])[:15]}
# Add conditional turn-pair artifact if v2 is available and PASS.
gp=pathlib.Path('simulation_2026/TURN_PAIR_COUNTERFACTUAL_2026_GATE.json')
tp=pathlib.Path('simulation_2026/TURN_PAIR_COUNTERFACTUAL_2026.json')
if gp.exists() and tp.exists():
    g=json.load(open(gp));out['turn_pair_gate']=g
    if g.get('status')=='PASS':
        t=json.load(open(tp));compact={}
        for pair,cells in t.get('pairs',{}).items():
            branch_rows={}
            for cell,info in cells.items():
                for name,b in info.get('branches',{}).items():
                    if not b.get('inference_eligible'):continue
                    key=(cell,name); branch_rows[str(key)]={'eligible_runs':b.get('eligible_runs'),'eligible_rate':b.get('eligible_rate'),
                        'second_pick_selections':b.get('second_pick_selections',[])[:8],
                        'alternative_return':b.get('alternative_return',[]),
                        'best_available_at_second':b.get('best_available_at_second',[])[:10]}
            compact[pair]=branch_rows
        out['conditional_turn_pairs']=compact
pathlib.Path('simulation_2026/SIMULATION_DECISION_INSIGHTS_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
print(json.dumps({'freeze':out['freeze_package_sha256'],'full_drafts':out['full_drafts'],'turns':list(out['turns']),'turn_pair_status':out.get('turn_pair_gate',{}).get('status')},indent=2))
