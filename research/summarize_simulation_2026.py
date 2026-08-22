#!/usr/bin/env python3
import json, statistics, collections, pathlib

SRC=pathlib.Path('SIMULATION_2026_REALISTIC_RESULTS.json')
if not SRC.exists(): SRC=pathlib.Path('simulation_2026/SIMULATION_2026_REALISTIC_RESULTS.json')
x=json.loads(SRC.read_text())
real={k:v for k,v in x['cells'].items() if k.startswith('REALISTIC|')}
if len(real)!=9: raise SystemExit(f'expected 9 REALISTIC cells, got {len(real)}')
picks=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]

def rows_at(cell,pn,field):
    return cell.get(field,{}).get(str(pn),[])

def robust_avail(pn):
    names={r['name'] for c in real.values() for r in rows_at(c,pn,'availability')}
    out=[]
    for name in names:
        vals=[]; meta=None
        for c in real.values():
            hit=next((r for r in rows_at(c,pn,'availability') if r['name']==name),None)
            vals.append(float(hit['availability']) if hit else 0.0)
            meta=meta or hit
        if not meta: continue
        out.append({'name':name,'pos':meta['pos'],'quality_rank':meta['quality_rank'],'adp':meta['adp'],
                    'min':round(min(vals),4),'mean':round(statistics.mean(vals),4),'max':round(max(vals),4),
                    'range':round(max(vals)-min(vals),4)})
    out.sort(key=lambda r:(r['quality_rank'],-r['mean']))
    return out[:25]

def robust_selection(pn):
    names={r['name'] for c in real.values() for r in rows_at(c,pn,'selections')}
    out=[]
    for name in names:
        vals=[]; pos=''
        for c in real.values():
            hit=next((r for r in rows_at(c,pn,'selections') if r['name']==name),None)
            vals.append(float(hit['rate']) if hit else 0.0)
            if hit: pos=hit['pos']
        if max(vals)>=.01:
            out.append({'name':name,'pos':pos,'min':round(min(vals),4),'mean':round(statistics.mean(vals),4),'max':round(max(vals),4)})
    out.sort(key=lambda r:-r['mean'])
    return out[:20]

# Aggregate roster construction and first-four paths equally across REALISTIC cells.
pos_counter=collections.Counter(); path_counter=collections.Counter()
for c in real.values():
    for r in c.get('roster_position_distribution',[]):
        key=tuple(sorted((str(k),int(v)) for k,v in r['counts'].items()))
        pos_counter[key]+=float(r['rate'])/len(real)
    for r in c.get('top_first_four_patterns',[]):
        path_counter[tuple(r['players'])]+=float(r['rate'])/len(real)

summary={
 'schema':1,
 'freeze_package_sha256':x['freeze_package_sha256'],
 'total_full_drafts':x['total_full_drafts'],
 'runs_per_cell':x['runs_per_cell'],
 'realistic_cells':len(real),
 'policy_ranking_certified':bool(x.get('policy_ranking_certified',False)),
 'policy_ranking_note':x.get('policy_ranking_note',''),
 'max_realistic_split_half_top50_availability_delta':max(float(c['split_half_max_top50_availability_delta']) for c in real.values()),
 'availability':{str(p):robust_avail(p) for p in picks},
 'selection_rates':{str(p):robust_selection(p) for p in picks},
 'roster_position_distribution':[{'counts':dict(k),'mean_rate':round(v,4)} for k,v in pos_counter.most_common(20)],
 'early_path_clusters':[{'players':list(k),'mean_rate':round(v,4)} for k,v in path_counter.most_common(30)],
 'cell_diagnostics':{k:{'mean_completion_forces':v['mean_completion_forces'],'mean_opponent_kdst':v['mean_opponent_kdst'],'split_half_delta':v['split_half_max_top50_availability_delta']} for k,v in real.items()}
}
pathlib.Path('SIMULATION_2026_ROBUST_SUMMARY.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False))
print(json.dumps({k:summary[k] for k in ('freeze_package_sha256','total_full_drafts','runs_per_cell','realistic_cells','max_realistic_split_half_top50_availability_delta','policy_ranking_certified')},indent=2))
