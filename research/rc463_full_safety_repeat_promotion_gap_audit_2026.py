#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,collections
EXPECTED=list(range(459820001,459820121))
def q(v,p):
 v=sorted(v)
 if not v:return None
 z=(len(v)-1)*p;lo=int(math.floor(z));hi=int(math.ceil(z))
 return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
D={}
for p in glob.glob('/tmp/full/**/*.json',recursive=True):
 try:x=json.load(open(p))
 except:continue
 if x.get('status')!='PASS' or not x.get('rc463_full_safety_baseline_roster_export'):continue
 for d in x.get('drafts',[]):D[int(d['seed'])]=d
if sorted(D)!=EXPECTED:raise RuntimeError('seed union '+str(sorted(D)))
rows=[];all_repeat=[]
for seed in EXPECTED:
 c=collections.Counter()
 for dec in D[seed]['decisions']:
  pos=dec['pos'];repeat=pos in {'QB','TE'} and c[pos]>=1
  if repeat:
   skills=[float(z['raw']) for z in dec.get('top',[]) if z.get('pos') in {'RB','WR'} and isinstance(z.get('raw'),(int,float))]
   gap=(float(dec['raw'])-max(skills)) if skills else None
   rec={'seed':seed,'pick':dec['pick'],'name':dec['name'],'pos':pos,'pre_count':c[pos],'raw':dec['raw'],'safety_triggered':bool((dec.get('safety') or {}).get('triggered')),'best_visible_skill_raw':max(skills) if skills else None,'repeat_minus_best_visible_skill_raw':gap,'panel':dec.get('panel'),'adp':dec.get('adp')}
   all_repeat.append(rec)
   if rec['safety_triggered']:rows.append(rec)
  c[pos]+=1
vals=[r['repeat_minus_best_visible_skill_raw'] for r in rows if r['repeat_minus_best_visible_skill_raw'] is not None]
allvals=[r['repeat_minus_best_visible_skill_raw'] for r in all_repeat if r['repeat_minus_best_visible_skill_raw'] is not None]
out={'schema':1,'status':'PASS','research_only':True,'source_run':32839901036,'seeds':120,'repeat_qbte_choices':len(all_repeat),'safety_triggered_repeat_qbte':len(rows),'with_visible_skill_gap':len(vals),'gap_definition':'chosen repeat QB/TE rawScore minus maximum RB/WR rawScore present in serialized top candidate list at same decision; negative means skill raw leader is higher','safety_repeat_gap_summary':{'min':min(vals) if vals else None,'p01':q(vals,.01),'p05':q(vals,.05),'p10':q(vals,.10),'p25':q(vals,.25),'median':q(vals,.5),'p75':q(vals,.75),'p90':q(vals,.9),'p95':q(vals,.95),'p99':q(vals,.99),'max':max(vals) if vals else None,'within_1_below':sum(v>=-1 for v in vals),'within_3_below':sum(v>=-3 for v in vals),'within_5_below':sum(v>=-5 for v in vals),'within_10_below':sum(v>=-10 for v in vals),'nonnegative':sum(v>=0 for v in vals)},'all_repeat_gap_summary':{'median':q(allvals,.5),'p10':q(allvals,.1),'p90':q(allvals,.9)},'rows':rows,'all_repeat_rows':all_repeat,'production_mutation':False}
pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);pathlib.Path('diagnostics_2026/RC463_FULL_SAFETY_REPEAT_PROMOTION_GAP_AUDIT_20260825.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k not in {'rows','all_repeat_rows'}},indent=2))
