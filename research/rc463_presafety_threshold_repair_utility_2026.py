#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,urllib.request,collections,hashlib
DRAFT_ID='1225769229928648704'; POS={'QB','RB','WR','TE'}; SEEDS=list(range(459820001,459820121)); MAX_SWAPS=2
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-rc463-RepairUtility/1.0'}); return json.load(urllib.request.urlopen(req,timeout=60))
def qtile(v,q):
 v=sorted(float(x) for x in v); z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z)); return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load_arm(root,thr):
 out={}; meta=set()
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or x.get('threshold')!=thr or not isinstance(x.get('drafts'),list):continue
  meta.add(x.get('metadata_snapshot_sha256'))
  for d in x['drafts']:
   s=int(d['seed']);
   if s in out: raise RuntimeError(f'duplicate {thr} {s}')
   out[s]=d
 if sorted(out)!=SEEDS: raise RuntimeError(f'seed union {thr}')
 if len(meta)!=1 or None in meta: raise RuntimeError(f'metadata {thr} {meta}')
 return out,next(iter(meta))
def lineup(players,w,repl):
 vals={p:sorted([x['weeks'][w] for x in players if x['pos']==p],reverse=True) for p in POS}
 qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]; best=-1e9
 for rb in range(1,4):
  for wr in range(2,5):
   for te in range(1,3):
    if rb+wr+te!=6: continue
    tot=0
    for pos,n in [('RB',rb),('WR',wr),('TE',te)]:
     have=min(len(vals[pos]),n); tot+=sum(vals[pos][:have])+(n-have)*repl[pos][w]
    best=max(best,tot)
 return qb+best
def feasible(r):
 c=collections.Counter(x['pos'] for x in r); return c['QB']>=1 and c['RB']>=1 and c['WR']>=2 and c['TE']>=1
def main():
 A,ma=load_arm('/tmp/threshold-artifacts',-15); B,mb=load_arm('/tmp/threshold-artifacts',0)
 if ma!=mb: raise RuntimeError('metadata mismatch')
 bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json')); assert bridge['status']=='PASS'; fc=bridge['forecasts']
 if bridge.get('criteria',{}).get('selected_panel_not_used_in_fit') is not True: raise RuntimeError('bridge independence gate')
 byname=collections.defaultdict(list)
 for k,v in fc.items(): byname[(v.get('name','').strip().lower(),v.get('pos'))].append((str(k),v))
 def map_roster(d):
  out=[]
  for p in d['user_roster']:
   m=byname[(p['name'].strip().lower(),p['pos'])]
   if len(m)!=1: raise RuntimeError('forecast mapping '+p['name']+' '+p['pos']+' '+str(len(m)))
   k,v=m[0]; out.append({'key':k,'name':p['name'],'pos':p['pos'],'weeks':v['pred_weeks_1_14']})
  return out
 bypos={p:[] for p in POS}
 for k,v in fc.items():
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
 def utility(r): return sum(wp(lineup(r,w,repl),w+1) for w in range(14))
 def fa_pool(d):
  out=[]
  for k in map(str,d.get('free_agent_ids') or []):
   v=fc.get(k)
   if v and v.get('pos') in POS: out.append({'key':k,'name':v['name'],'pos':v['pos'],'weeks':v['pred_weeks_1_14']})
  return out
 def repair(d):
  r=map_roster(d); fas=fa_pool(d); before=utility(r); tx=[]
  for step in range(MAX_SWAPS):
   base=utility(r); best=(base,None,None,None)
   held={x['key'] for x in r}
   for i,drop in enumerate(r):
    for add in fas:
     if add['key'] in held: continue
     nr=r[:i]+[add]+r[i+1:]
     if not feasible(nr): continue
     u=utility(nr)
     if u>best[0]+1e-12: best=(u,i,drop,add)
   if best[1] is None: break
   u,i,drop,add=best; r[i]=add; fas=[x for x in fas if x['key']!=add['key']]+[drop]; tx.append({'step':step+1,'drop':drop['name'],'drop_pos':drop['pos'],'add':add['name'],'add_pos':add['pos'],'before_utility':base,'after_utility':u,'gain':u-base})
  return before,utility(r),tx,r
 rows=[]
 for seed in SEEDS:
  a0,a1,at,ar=repair(A[seed]); b0,b1,bt,br=repair(B[seed]); rows.append({'seed':seed,'m15_before':a0,'zero_before':b0,'m15_after_repair':a1,'zero_after_repair':b1,'delta_after_repair_zero_minus_m15':b1-a1,'m15_transactions':at,'zero_transactions':bt})
 ds=[r['delta_after_repair_zero_minus_m15'] for r in rows]; out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'source_run_id':32870106661,'metadata_snapshot_sha256':ma,'method':'symmetric greedy up-to-2 pre-Week-1 FA swaps per arm using independent market/outcome bridge and Utility-v3.5 lineup topology','max_swaps':MAX_SWAPS,'seeds':120,'mean_delta_after_repair':statistics.mean(ds),'median_delta_after_repair':statistics.median(ds),'zero_better':sum(x>1e-12 for x in ds),'same':sum(abs(x)<=1e-12 for x in ds),'zero_worse':sum(x<-1e-12 for x in ds),'min_delta':min(ds),'max_delta':max(ds),'mean_m15_repair_gain':statistics.mean(r['m15_after_repair']-r['m15_before'] for r in rows),'mean_zero_repair_gain':statistics.mean(r['zero_after_repair']-r['zero_before'] for r in rows),'policy_promotion_authorized':False,'rows':rows}
 pathlib.Path('diagnostics_2026').mkdir(exist_ok=True); pathlib.Path('diagnostics_2026/RC463_PRESAFETY_THRESHOLD_REPAIR_UTILITY_2026.json').write_text(json.dumps(out,indent=2)); print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
