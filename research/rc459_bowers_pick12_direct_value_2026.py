#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,collections
POS={'QB','RB','WR','TE'}; BASE='/tmp/base'; BRIDGE='bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'; OUT='diagnostics_2026/RC459_BOWERS_PICK12_DIRECT_VALUE_2026.json'
def qtile(v,q):
 v=sorted(float(x) for x in v); z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z)); return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load():
 out={}
 for p in glob.glob(BASE+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS':continue
  for d in x.get('drafts') or []:out[int(d['seed'])]=d
 if sorted(out)!=list(range(459710001,459710061)):raise RuntimeError('seed union')
 return out
def bridge():
 b=json.load(open(BRIDGE)); assert b['status']=='PASS'; fc=b['forecasts']; by=collections.defaultdict(list); bypos={p:[] for p in POS}
 for v in fc.values():
  k=(v.get('name','').strip().lower(),v.get('pos','').upper()); by[k].append(v)
  if k[1] in POS and isinstance(v.get('sleeper_adp'),(int,float)):bypos[k[1]].append((float(v['sleeper_adp']),v))
 repl={}
 for p,a in bypos.items():
  a.sort(key=lambda z:z[0]); tail=a[max(0,int(len(a)*.80)):]; repl[p]=[qtile([v['pred_weeks_1_14'][w] for _,v in tail],.5) for w in range(14)]
 return by,repl
def f(by,n,p):
 m=by[(n.strip().lower(),p.upper())]
 if len(m)!=1:raise RuntimeError(f'map {n} {p} {len(m)}')
 return {'name':n,'pos':p,'weeks':m[0]['pred_weeks_1_14'],'sleeper_adp':m[0].get('sleeper_adp')}
def lineup(players,w,repl):
 vals={p:sorted([x['weeks'][w] for x in players if x['pos']==p],reverse=True) for p in POS}; qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]; best=-1e9
 for rb in range(1,4):
  for wr in range(2,5):
   for te in range(1,3):
    if rb+wr+te!=6:continue
    t=0
    for p,n in [('RB',rb),('WR',wr),('TE',te)]:
     h=min(len(vals[p]),n);t+=sum(vals[p][:h])+(n-h)*repl[p][w]
    best=max(best,t)
 return qb+best
def main():
 D=load();by,repl=bridge();rows=[]; bow=f(by,'Brock Bowers','TE'); br=f(by,'Chase Brown','RB')
 for seed,d in sorted(D.items()):
  d9=next(x for x in d['decisions'] if x['pick']==9); d12=next(x for x in d['decisions'] if x['pick']==12)
  if d12['name']!='Brock Bowers':continue
  brown=next((r for r in d12['top'] if r['name']=='Chase Brown'),None)
  if not brown:raise RuntimeError(f'Brown missing seed {seed}')
  prior=[f(by,d9['name'],d9['pos'])]
  sb=[lineup(prior+[bow],w,repl) for w in range(14)]; sr=[lineup(prior+[br],w,repl) for w in range(14)]; ds=[sb[w]-sr[w] for w in range(14)]
  rows.append({'seed':seed,'pick9':d9['name'],'bowers_raw':d12['raw'],'brown_raw':brown['raw'],'coach_raw_gap_bowers_minus_brown':d12['raw']-brown['raw'],'direct_mean_weekly_points_delta_bowers_minus_brown':statistics.mean(ds),'direct_total_14w_points_delta':sum(ds),'bowers_better_weeks':sum(x>1e-9 for x in ds),'brown_better_weeks':sum(x<-1e-9 for x in ds)})
 if len(rows)!=57:raise RuntimeError(f'Bowers coverage {len(rows)} expected 57')
 ds=[r['direct_mean_weekly_points_delta_bowers_minus_brown'] for r in rows]; rg=[r['coach_raw_gap_bowers_minus_brown'] for r in rows]
 by9={}
 for n in sorted(set(r['pick9'] for r in rows)):
  q=[r for r in rows if r['pick9']==n];x=[r['direct_mean_weekly_points_delta_bowers_minus_brown'] for r in q];by9[n]={'n':len(q),'mean_direct_delta':statistics.mean(x),'median_direct_delta':statistics.median(x),'bowers_direct_better':sum(v>1e-9 for v in x)}
 comp={'bowers_forecast_mean_weekly':statistics.mean(bow['weeks']),'brown_forecast_mean_weekly':statistics.mean(br['weeks']),'replacement_te_mean_weekly':statistics.mean(repl['TE']),'replacement_rb_mean_weekly':statistics.mean(repl['RB']),'replacement_wr_mean_weekly':statistics.mean(repl['WR']),'bowers_over_replacement_te':statistics.mean(bow['weeks'][w]-repl['TE'][w] for w in range(14)),'brown_over_replacement_rb':statistics.mean(br['weeks'][w]-repl['RB'][w] for w in range(14)),'bowers_sleeper_adp':bow.get('sleeper_adp'),'brown_sleeper_adp':br.get('sleeper_adp')}
 out={'schema':2,'status':'PASS','research_only':True,'production_mutation':False,'threshold_calibration_authorized':False,'purpose':'Audit Bowers-vs-Chase-Brown direct startability/value at pick 12 without later draft cascade on the 57 metadata-safe baseline states where rc4.59 selected Bowers.','states':57,'coach_raw_gap_mean':statistics.mean(rg),'coach_raw_gap_min':min(rg),'coach_raw_gap_max':max(rg),'direct_mean_weekly_points_delta_bowers_minus_brown':statistics.mean(ds),'direct_median_weekly_points_delta':statistics.median(ds),'bowers_direct_better_states':sum(x>1e-9 for x in ds),'brown_direct_better_states':sum(x<-1e-9 for x in ds),'ties':sum(abs(x)<=1e-9 for x in ds),'bridge_component_audit':comp,'by_pick9':by9,'rows':rows}
 pathlib.Path(OUT).parent.mkdir(exist_ok=True);pathlib.Path(OUT).write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
