#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,urllib.request,collections,hashlib
DRAFT_ID='1225769229928648704'; POS={'QB','RB','WR','TE'}; RUN_ID=32870106661
SEEDS=list(range(459820001,459820121))
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-rc463-ThresholdUtility/1.0'}); return json.load(urllib.request.urlopen(req,timeout=60))
def qtile(v,q):
 v=sorted(float(x) for x in v); z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z)); return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load_arm(root,thr):
 out={}; meta=set(); files=[]
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or x.get('threshold')!=thr or not isinstance(x.get('drafts'),list):continue
  files.append(p); meta.add(x.get('metadata_snapshot_sha256'))
  for d in x['drafts']:
   s=int(d['seed'])
   if s in out: raise RuntimeError(f'duplicate seed {thr} {s}')
   out[s]=d
 if sorted(out)!=SEEDS: raise RuntimeError(f'threshold {thr} seed union mismatch: {sorted(out)}')
 if len(meta)!=1 or None in meta: raise RuntimeError(f'threshold {thr} metadata drift {meta}')
 return out,next(iter(meta)),files
def lineup(players,w,repl):
 vals={p:sorted([x['weeks'][w] for x in players if x['pos']==p],reverse=True) for p in POS}
 qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]; best=-1e9
 for rb in range(1,4):
  for wr in range(2,5):
   for te in range(1,3):
    if rb+wr+te!=6:continue
    tot=0
    for pos,n in [('RB',rb),('WR',wr),('TE',te)]:
     have=min(len(vals[pos]),n); tot+=sum(vals[pos][:have])+(n-have)*repl[pos][w]
    best=max(best,tot)
 return qb+best
def roster_fp(d):
 return hashlib.sha256(json.dumps(d['user_roster'],sort_keys=True,separators=(',',':')).encode()).hexdigest()
def main():
 A,ma,fa=load_arm('/tmp/threshold-artifacts',-15); B,mb,fb=load_arm('/tmp/threshold-artifacts',0)
 if ma!=mb: raise RuntimeError(f'metadata mismatch {ma} {mb}')
 bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json')); assert bridge['status']=='PASS'; fc=bridge['forecasts']
 if bridge.get('criteria',{}).get('selected_panel_not_used_in_fit') is not True: raise RuntimeError('bridge independence gate')
 byname=collections.defaultdict(list)
 for v in fc.values(): byname[(v.get('name','').strip().lower(),v.get('pos'))].append(v)
 def map_roster(d):
  out=[]
  for p in d['user_roster']:
   m=byname[(p['name'].strip().lower(),p['pos'])]
   if len(m)!=1: raise RuntimeError('forecast mapping '+p['name']+' '+p['pos']+' '+str(len(m)))
   out.append({'name':p['name'],'pos':p['pos'],'weeks':m[0]['pred_weeks_1_14']})
  return out
 bypos={p:[] for p in POS}
 for v in fc.values():
  if v.get('pos') in POS and isinstance(v.get('sleeper_adp'),(int,float)):bypos[v['pos']].append((float(v['sleeper_adp']),v))
 repl={}
 for pos,a in bypos.items():
  a.sort(key=lambda z:z[0]); tail=a[max(0,int(len(a)*.80)):]; repl[pos]=[qtile([v['pred_weeks_1_14'][w] for _,v in tail],.5) for w in range(14)]
 meta=getj('https://api.sleeper.app/v1/draft/'+DRAFT_ID); league=str(meta['league_id']); players=getj('https://api.sleeper.app/v1/players/nfl'); skill=[]
 for w in range(1,15):
  for g in getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}'):
   total=float(g.get('points') or 0); pp=g.get('players_points') or {}; kd=0
   for sid in map(str,g.get('starters') or []):
    if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
   skill.append((w,total-kd))
 def wp(score,w):
  v=[x for ww,x in skill if ww!=w]; return (sum(x<score for x in v)+.5*sum(x==score for x in v)+1)/(len(v)+2)
 rows=[]; identical=0
 for seed in SEEDS:
  ra,rb=map_roster(A[seed]),map_roster(B[seed]); fpa,fpb=roster_fp(A[seed]),roster_fp(B[seed]); same=fpa==fpb
  sa=[lineup(ra,w,repl) for w in range(14)]; sb=[lineup(rb,w,repl) for w in range(14)]; ua=sum(wp(sa[w],w+1) for w in range(14)); ub=sum(wp(sb[w],w+1) for w in range(14)); delta=ub-ua
  if same:
   identical+=1
   if abs(delta)>1e-12: raise RuntimeError(f'identical roster nonzero delta seed {seed}: {delta}')
  rows.append({'seed':seed,'m15_roster_fp':fpa,'zero_roster_fp':fpb,'identical_roster':same,'m15_expected_wins_14w':ua,'zero_expected_wins_14w':ub,'delta_zero_minus_m15':delta,'m15_weekly_mean':statistics.mean(sa),'zero_weekly_mean':statistics.mean(sb)})
 if identical!=107: raise RuntimeError(f'expected 107 identical rosters, got {identical}')
 ds=[r['delta_zero_minus_m15'] for r in rows]; div=[r for r in rows if not r['identical_roster']]
 out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'source_run_id':RUN_ID,'metadata_snapshot_sha256':ma,'method':'paired exact 120-seed complete-roster threshold0-minus-thresholdM15 -> independent market/outcome bridge -> Utility-v3.5 lineup topology + empirical 2025 skill CDF','selected_panel_used_in_outcome_fit':False,'seeds':120,'identical_rosters':identical,'divergent_rosters':len(div),'mean_delta_expected_wins_14w':statistics.mean(ds),'median_delta':statistics.median(ds),'zero_better':sum(x>1e-12 for x in ds),'same':sum(abs(x)<=1e-12 for x in ds),'zero_worse':sum(x<-1e-12 for x in ds),'min_delta':min(ds),'max_delta':max(ds),'divergence_mean_delta':statistics.mean(r['delta_zero_minus_m15'] for r in div),'m15_mean_expected_wins_14w':statistics.mean(r['m15_expected_wins_14w'] for r in rows),'zero_mean_expected_wins_14w':statistics.mean(r['zero_expected_wins_14w'] for r in rows),'policy_promotion_authorized':False,'rows':rows}
 pathlib.Path('diagnostics_2026').mkdir(exist_ok=True); pathlib.Path('diagnostics_2026/RC463_PRESAFETY_THRESHOLD_COMPLETE_ROSTER_UTILITY_2026.json').write_text(json.dumps(out,indent=2)); print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
