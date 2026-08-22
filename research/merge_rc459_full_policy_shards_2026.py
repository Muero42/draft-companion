#!/usr/bin/env python3
from __future__ import annotations
import glob,json,pathlib
EXPECTED_OFFSETS=[0,10,20,30,40,50]
EXPECTED_COUNT=10
files=sorted(glob.glob('policy_shards/RC459_FULL_POLICY_PAIRED_DRAFTS_2026_SHARD_*.json'))
if len(files)!=len(EXPECTED_OFFSETS): raise RuntimeError(f'shard count {len(files)}')
parts=[json.load(open(p)) for p in files]
off=sorted(int(x.get('seed_offset',-1)) for x in parts)
if off!=EXPECTED_OFFSETS: raise RuntimeError(f'offsets {off}')
base=parts[0]
keys=['status','numbered_rc459_app_sha256','source_lock','dynamic_gate_status','freeze_package_sha256','bridge_status','selected_panel_used_in_control_objective','regimes','policies','coach_return_runs_exact_900_except_final_pick']
for x in parts:
    if x.get('status')!='PASS' or x.get('runs_per_regime')!=EXPECTED_COUNT or x.get('shard_run_count')!=EXPECTED_COUNT: raise RuntimeError('shard gate')
    for k in keys:
        if x.get(k)!=base.get(k): raise RuntimeError(f'shard mismatch {k}')
rows=[r for x in parts for r in x['rows']]
expected=len(EXPECTED_OFFSETS)*EXPECTED_COUNT*len(base['regimes'])*len(base['policies'])
if len(rows)!=expected: raise RuntimeError(f'row count {len(rows)} != {expected}')
# Each regime/policy must contain exactly the same 60 distinct seeds; this is the CRN pairing invariant.
seedsets={}
for regime in base['regimes']:
  for policy in base['policies']:
    s=[int(r['seed']) for r in rows if r['stress']==regime and r['policy']==policy]
    if len(s)!=60 or len(set(s))!=60: raise RuntimeError(f'seed coverage {regime} {policy}')
    seedsets[(regime,policy)]=set(s)
  if len({tuple(sorted(seedsets[(regime,p)])) for p in base['policies']})!=1: raise RuntimeError(f'CRN mismatch {regime}')
out={k:base[k] for k in keys}
out.update({'schema':2,'status':'PASS','runs_per_regime':60,'seed_offsets':EXPECTED_OFFSETS,'shard_run_count':EXPECTED_COUNT,'total_full_drafts':len(rows),'coach_full_drafts':120,'policy_ranking_certified':False,'rows':rows})
pathlib.Path('policy_certification_2026').mkdir(exist_ok=True)
pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json').write_text(json.dumps(out,separators=(',',':')))
pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026_MERGE_GATE.json').write_text(json.dumps({'status':'PASS','runs_per_regime':60,'total_full_drafts':len(rows),'coach_full_drafts':120,'offsets':EXPECTED_OFFSETS,'common_random_numbers_exact':True},indent=2))
print(json.dumps({'status':'PASS','runs_per_regime':60,'total_full_drafts':len(rows),'coach_full_drafts':120,'common_random_numbers_exact':True},indent=2))
