#!/usr/bin/env python3
import json,glob,pathlib,collections,statistics
BASE='/tmp/base'; OUT='diagnostics_2026/RC459_TE_PATHWISE_OPPORTUNITY_2026.json'
CHECKS=(29,32,49,52,69,72)

def load():
 out={}
 for p in glob.glob(BASE+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS':continue
  for d in x.get('drafts') or []:out[int(d['seed'])]=d
 exp=list(range(459710001,459710061))
 if sorted(out)!=exp:raise RuntimeError(f'seed union mismatch {len(out)}')
 return out

def main():
 D=load(); rows=[]
 for seed,d in sorted(D.items()):
  dec={int(x['pick']):x for x in d['decisions']}
  if 12 not in dec:raise RuntimeError(f'missing pick12 {seed}')
  p12=dec[12]
  if p12['name']!='Brock Bowers':continue
  row={'seed':seed,'pick9':dec[9]['name'],'pick12':'Brock Bowers','checkpoints':{}}
  for p in CHECKS:
   if p not in dec:raise RuntimeError(f'missing checkpoint {seed}/{p}')
   top=dec[p].get('top') or []
   tes=[r for r in top if r.get('pos')=='TE']
   rws=[r for r in top if r.get('pos') in {'RB','WR'}]
   def best(a):
    if not a:return None
    z=max(a,key=lambda r:(float(r.get('raw',-1e9)),-float(r.get('panel',1e9))))
    return {'name':z['name'],'pos':z['pos'],'raw':z.get('raw'),'panel':z.get('panel'),'adp':z.get('adp')}
   row['checkpoints'][str(p)]={'actual_pick':dec[p]['name'],'actual_pos':dec[p]['pos'],'best_visible_te':best(tes),'best_visible_rbwr':best(rws),'visible_te_count':len(tes),'visible_rbwr_count':len(rws)}
  rows.append(row)
 if len(rows)!=57:raise RuntimeError(f'Bowers-state coverage {len(rows)} expected 57')
 summary={}
 for p in CHECKS:
  tes=[r['checkpoints'][str(p)]['best_visible_te'] for r in rows]
  tes=[x for x in tes if x]
  names=collections.Counter(x['name'] for x in tes)
  summary[str(p)]={'states':len(rows),'te_visible_states':len(tes),'top_best_visible_te':names.most_common(12),'median_best_te_panel':statistics.median(float(x['panel']) for x in tes) if tes else None,'median_best_te_raw':statistics.median(float(x['raw']) for x in tes) if tes else None}
 out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'causal_claim_authorized':False,'threshold_calibration_authorized':False,'states':len(rows),'purpose':'Descriptive supply diagnostic: in metadata-safe rc4.59 baseline states where Bowers was selected at 2.02, measure the best visible TE and RB/WR alternatives at later slot-9 turn checkpoints. This does NOT claim the same board would occur if Bowers were passed; true counterfactual pathwise evaluation requires branching from pick 12 with identical RNG/opponents.','warning':'DESCRIPTIVE BASELINE PATH ONLY; do not treat as Bowers-vs-RB causal evidence.','summary':summary,'rows':rows}
 pathlib.Path(OUT).parent.mkdir(exist_ok=True);pathlib.Path(OUT).write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
