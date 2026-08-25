#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,collections
EXPECTED=list(range(459820001,459820121))
def q(v,p):
 v=sorted(float(x) for x in v)
 if not v:return None
 z=(len(v)-1)*p;lo=int(math.floor(z));hi=int(math.ceil(z));return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load(root,flag):
 out={}
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or not x.get(flag):continue
  for d in x.get('drafts',[]):
   s=int(d['seed'])
   if s in out:raise RuntimeError('duplicate seed '+str(s))
   out[s]=d
 if sorted(out)!=EXPECTED:raise RuntimeError('seed union mismatch '+str(sorted(out)))
 return out
B=load('/tmp/base','rc463_full_safety_baseline_roster_export');I=load('/tmp/inst','rc463_full_safety_presafety_instrumented')
parity=[];rows=[]
for seed in EXPECTED:
 b,i=B[seed],I[seed]
 bd=[(d['pick'],d['name'],d['pos']) for d in b['decisions']];idc=[(d['pick'],d['name'],d['pos']) for d in i['decisions']]
 same_dec=bd==idc;same_roster=[(x['name'],x['pos']) for x in b['user_roster']]==[(x['name'],x['pos']) for x in i['user_roster']]
 same_fp=b['complete_fingerprint']==i['complete_fingerprint']
 parity.append({'seed':seed,'decisions_equal':same_dec,'roster_equal':same_roster,'fingerprint_equal':same_fp})
 if not (same_dec and same_roster and same_fp):raise RuntimeError('INSTRUMENTATION_POLICY_DRIFT seed '+str(seed))
 for d in i['decisions']:
  a=d['pre_safety_audit'];c=a['roster_counts'];pos=d['pos'];repeat=pos in {'QB','TE'} and int(c.get(pos,0))>=1
  if not repeat:continue
  r={'seed':seed,'pick':d['pick'],'name':d['name'],'pos':pos,'pre_count':int(c[pos]),'safety_triggered':bool(a['safety_triggered']),'pre_raw':a['chosen']['raw'],'natural_name':a['natural']['name'],'natural_pos':a['natural']['pos'],'natural_raw':a['natural']['raw'],'best_skill_name':a['best_skill']['name'] if a['best_skill'] else None,'best_skill_pos':a['best_skill']['pos'] if a['best_skill'] else None,'best_skill_raw':a['best_skill']['raw'] if a['best_skill'] else None,'chosen_minus_natural':a['chosen_minus_natural'],'chosen_minus_best_skill':a['chosen_minus_best_skill'],'chosen_was_natural':bool(a['chosen_was_natural']),'panel':d['panel'],'adp':d['adp']}
  rows.append(r)
safety=[r for r in rows if r['safety_triggered']];gaps=[r['chosen_minus_best_skill'] for r in safety if r['chosen_minus_best_skill'] is not None];ordinary=[r for r in safety if not r['chosen_was_natural']]
og=[r['chosen_minus_best_skill'] for r in ordinary if r['chosen_minus_best_skill'] is not None]
thresholds=[0,-1,-2,-3,-5,-7.5,-10,-15,-20,-30,-40,-50]
out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'instrumentation_parity':{'seeds':120,'decision_sequences_equal':all(x['decisions_equal'] for x in parity),'rosters_equal':all(x['roster_equal'] for x in parity),'complete_fingerprints_equal':all(x['fingerprint_equal'] for x in parity)},'repeat_qbte_choices':len(rows),'safety_triggered_repeat_qbte':len(safety),'ordinary_non_natural_safety_repeat_qbte':len(ordinary),'pre_safety_gap_definition':'chosen repeat QB/TE ORIGINAL pre-safety rawScore minus best legal RB/WR ORIGINAL pre-safety rawScore; negative means skill leader higher','all_safety_repeat_gap':{'min':min(gaps) if gaps else None,'p01':q(gaps,.01),'p05':q(gaps,.05),'p10':q(gaps,.10),'p25':q(gaps,.25),'median':q(gaps,.5),'p75':q(gaps,.75),'p90':q(gaps,.9),'p95':q(gaps,.95),'p99':q(gaps,.99),'max':max(gaps) if gaps else None},'ordinary_non_natural_safety_gap':{'n':len(og),'min':min(og) if og else None,'p01':q(og,.01),'p05':q(og,.05),'p10':q(og,.10),'p25':q(og,.25),'median':q(og,.5),'p75':q(og,.75),'p90':q(og,.9),'p95':q(og,.95),'p99':q(og,.99),'max':max(og) if og else None},'threshold_retention_counts':{str(t):sum(g>=t for g in og) for t in thresholds},'thresholds':thresholds,'parity_rows':parity,'repeat_rows':rows}
pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);p=pathlib.Path('diagnostics_2026/RC463_PRESAFETY_PARITY_GAP_AUDIT_120_20260825.json');p.write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k not in {'parity_rows','repeat_rows'}},indent=2))
