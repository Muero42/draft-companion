#!/usr/bin/env python3
import json, pathlib

SRC=pathlib.Path('simulation_2026/RC459_DECISION_INSIGHTS_2026.json')
OUT=pathlib.Path('simulation_2026/SLOT9_TAKE_WAIT_MAP_2026.json')

x=json.loads(SRC.read_text())
if x.get('status')!='PASS': raise SystemExit('decision insights not PASS')
rows=[]
for turn, items in x.get('turns',{}).items():
    for r in items:
        rows.append({
            'turn':turn,
            'name':r.get('name'),
            'pos':r.get('pos'),
            'panel':r.get('panel'),
            'adp':r.get('adp'),
            'exposure':r.get('exposure'),
            'eligible_runs':r.get('eligible_runs'),
            'return_if_wait':r.get('return_if_wait'),
            'return_95ci':r.get('return_95ci'),
            'timing_label':r.get('timing_label'),
            'take_now_second_pick_top':r.get('take_now_second_pick_top',[])[:4],
            'wait_second_pick_top':r.get('wait_second_pick_top',[])[:4],
        })

# Timing evidence only: never convert this ordering into cross-player quality ranking.
by_turn={}
for r in rows: by_turn.setdefault(r['turn'],[]).append(r)
for arr in by_turn.values(): arr.sort(key=lambda z:(z['return_if_wait'] is None, z['return_if_wait'] if z['return_if_wait'] is not None else 9))

out={
 'schema':1,
 'status':'PASS',
 'source':'RC459_DECISION_INSIGHTS_2026.json',
 'freeze_package_sha256':x.get('freeze_package_sha256'),
 'policy_ranking_certified':False,
 'interpretation':'TAKE/WAIT timing only; combine with Player Quality, current health/role evidence and roster opportunity cost. Never treat low return probability as proof a lower-quality player should be selected.',
 'turns':by_turn,
}
OUT.write_text(json.dumps(out,indent=2))
print(json.dumps({'status':'PASS','turns':len(by_turn),'rows':len(rows),'out':str(OUT)},indent=2))
