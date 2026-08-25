#!/usr/bin/env python3
import json,glob,pathlib,collections
EXPECTED=set(range(459820001,459820121))
def load(root,pattern,flag=None):
 out={}
 for p in glob.glob(root+'/**/'+pattern,recursive=True):
  try:x=json.load(open(p))
  except Exception:continue
  if x.get('status')!='PASS' or not isinstance(x.get('drafts'),list):continue
  if flag and not x.get(flag):continue
  for d in x['drafts']:
   s=int(d['seed'])
   if s in out:raise RuntimeError(f'duplicate seed {s} under {root}')
   out[s]=d
 if set(out)!=EXPECTED:raise RuntimeError(f'seed union {root}: {len(out)}')
 return out
def sig(d):return [(z['name'],z['pos']) for z in d.get('decisions',[])]
def roster(d):return [(z['name'],z['pos']) for z in d.get('user_roster',[])]
def firstdiff(a,b):
 sa,sb=sig(a),sig(b)
 for i,(x,y) in enumerate(zip(sa,sb)):
  if x!=y:return {'decision_index':i,'old':x,'new':y,'old_pick':a['decisions'][i].get('pick'),'new_pick':b['decisions'][i].get('pick')}
 if len(sa)!=len(sb):return {'decision_index':min(len(sa),len(sb)),'old_len':len(sa),'new_len':len(sb)}
 return None
old_full=load('/tmp/oldfull','*.json','rc463_full_safety_baseline_roster_export')
old_guard=load('/tmp/oldguard','*.json','rc463_baseline_roster_export')
new_full=load('/tmp/newpair','RC463_FULL_SAFETY_BASELINE_ROSTER_SHARD_*_2026.json','rc463_full_safety_baseline_roster_export')
new_guard=load('/tmp/newpair','RC463_BASELINE_ROSTER_SHARD_*_2026.json','rc463_baseline_roster_export')
rows=[]
for s in sorted(EXPECTED):
 of,og,nf,ng=old_full[s],old_guard[s],new_full[s],new_guard[s]
 rows.append({'seed':s,'full_changed':sig(of)!=sig(nf),'guard_changed':sig(og)!=sig(ng),'full_roster_changed':roster(of)!=roster(nf),'guard_roster_changed':roster(og)!=roster(ng),'full_first_diff':firstdiff(of,nf),'guard_first_diff':firstdiff(og,ng)})
summary={
 'full_decision_sequences_changed':sum(r['full_changed'] for r in rows),
 'guard_decision_sequences_changed':sum(r['guard_changed'] for r in rows),
 'full_rosters_changed':sum(r['full_roster_changed'] for r in rows),
 'guard_rosters_changed':sum(r['guard_roster_changed'] for r in rows),
 'both_arms_unchanged':sum(not r['full_changed'] and not r['guard_changed'] for r in rows),
}
# Pull common metadata provenance from the new same-input manifests.
ms=[]
for p in glob.glob('/tmp/newpair/**/RC463_SAMEINPUT_FULL_GUARD_MANIFEST_*_2026.json',recursive=True):ms.append(json.load(open(p)))
hs={m['metadata_snapshot_sha256'] for m in ms}
if len(ms)!=12 or len(hs)!=1:raise RuntimeError('manifest provenance')
out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'comparison':'historical independently-fetched metadata rosters vs regenerated current same-input metadata rosters, separately for full-safety and minimal-guard arms','seeds':120,'seed_family':'459820001..459820120','new_shared_metadata_snapshot_sha256':next(iter(hs)),'summary':summary,'rows':rows,'interpretation':'Quantifies how much mutable Sleeper player metadata changed autonomous draft trajectories in the old cross-time evidence. This is diagnostic only; it does not estimate policy utility.'}
pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);dst=pathlib.Path('diagnostics_2026/RC463_METADATA_DRIFT_ROSTER_IMPACT_120_20260825.json');dst.write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
