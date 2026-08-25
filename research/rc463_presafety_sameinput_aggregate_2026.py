#!/usr/bin/env python3
import json,pathlib,statistics,math
ROOT=pathlib.Path('/tmp/pairs')
files=sorted(ROOT.rglob('RC463_PRESAFETY_SAMEINPUT_PAIR_SHARD_*_2026.json'))
if len(files)!=12: raise RuntimeError(f'PAIR_SHARD_COUNT {len(files)}')
rows=[]; hashes=set(); parker=[]
for p in files:
 x=json.loads(p.read_text());
 if x.get('status')!='PASS': raise RuntimeError('SHARD_NOT_PASS '+str(p))
 hashes.add(x['metadata_snapshot_sha256']);parker.append(x.get('parker_washington_snapshot'))
 for r in x['rows']:
  if not (r['same_decisions'] and r['same_roster'] and r['same_fingerprint']): raise RuntimeError('PARITY_FAIL '+str(r['seed']))
  rows.append(r)
if len(rows)!=120 or len({r['seed'] for r in rows})!=120: raise RuntimeError('SEED_UNION')
if len(hashes)!=1: raise RuntimeError('METADATA_HASH_DRIFT '+repr(hashes))
repeat=[]
for r in rows:
 for d in r['instrumented_decisions']:
  a=d.get('pre_safety_audit') or {}; c=a.get('roster_counts') or {}; pos=d.get('pos')
  isrepeat=(pos=='QB' and c.get('QB',0)>=1) or (pos=='TE' and c.get('TE',0)>=1)
  if not (isrepeat and a.get('safety_triggered')): continue
  repeat.append({'seed':r['seed'],'pick':d['pick'],'name':d['name'],'pos':pos,'roster_counts':c,'gap_to_natural':a.get('chosen_minus_natural'),'gap_to_best_skill':a.get('chosen_minus_best_skill'),'chosen_was_natural':a.get('chosen_was_natural'),'safety':d.get('safety')})
def q(vals,p):
 vals=sorted(x for x in vals if isinstance(x,(int,float)) and math.isfinite(x))
 if not vals:return None
 z=(len(vals)-1)*p;i=int(math.floor(z));j=min(i+1,len(vals)-1);f=z-i
 return vals[i]*(1-f)+vals[j]*f
def summ(key):
 v=[x[key] for x in repeat if isinstance(x.get(key),(int,float)) and math.isfinite(x[key])]
 return {'n':len(v),'min':min(v) if v else None,'p05':q(v,.05),'p25':q(v,.25),'median':q(v,.5),'p75':q(v,.75),'p95':q(v,.95),'max':max(v) if v else None,'mean':statistics.mean(v) if v else None}
out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'seeds':120,'seed_family':'459820001..459820120','metadata_snapshot_sha256':next(iter(hashes)),'parker_washington_snapshot':parker[0],'exact_sameinput_parity':'120/120 decision-core + roster + complete fingerprint','repeat_qbte_safety_promoted_chosen_count':len(repeat),'gap_to_natural':summ('gap_to_natural'),'gap_to_best_skill':summ('gap_to_best_skill'),'repeat_rows':repeat,'interpretation':'Pre-safety raw gaps are admissible for threshold/mechanism research only because baseline and instrumentation consumed one identical frozen Sleeper metadata snapshot and achieved exact no-effect parity. No production promotion authorized.'}
pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);dst=pathlib.Path('diagnostics_2026/RC463_PRESAFETY_SAMEINPUT_AGGREGATE_120_20260825.json');dst.write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='repeat_rows'},indent=2))
