#!/usr/bin/env python3
import json,glob,zipfile,pathlib,statistics,math,urllib.request,collections,os
DRAFT_ID='1225769229928648704'; POS={'QB','RB','WR','TE'}
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-QBTE-PairedUtility/1.0'}); return json.load(urllib.request.urlopen(req,timeout=60))
def qtile(v,q):
 v=sorted(float(x) for x in v); z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z)); return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load_shards(root,tag):
 out={}
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or not isinstance(x.get('drafts'),list):continue
  for d in x['drafts']: out[int(d['seed'])]=d
 if sorted(out)!=list(range(459710001,459710061)):raise RuntimeError(tag+' seed union '+str(sorted(out)))
 return out
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
def main():
 B=load_shards('/tmp/base','base'); C=load_shards('/tmp/chal','challenger')
 bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json')); assert bridge['status']=='PASS'; fc=bridge['forecasts']
 byname=collections.defaultdict(list)
 for k,v in fc.items(): byname[(v.get('name','').strip().lower(),v.get('pos'))].append(v)
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
 rows=[]
 for seed in sorted(B):
  rb,rc=map_roster(B[seed]),map_roster(C[seed]); sb=[lineup(rb,w,repl) for w in range(14)]; sc=[lineup(rc,w,repl) for w in range(14)]; ub=sum(wp(sb[w],w+1) for w in range(14)); uc=sum(wp(sc[w],w+1) for w in range(14)); rows.append({'seed':seed,'baseline_expected_wins_14w':ub,'challenger_expected_wins_14w':uc,'delta':uc-ub,'baseline_weekly_mean':statistics.mean(sb),'challenger_weekly_mean':statistics.mean(sc)})
 ds=[r['delta'] for r in rows]; out={'schema':1,'status':'PASS','method':'paired exact 60-seed complete-roster -> independent market/outcome bridge -> Utility-v3.5 exact lineup topology + empirical 2025 skill CDF','selected_panel_used_in_outcome_fit':False,'seeds':60,'mean_delta_expected_wins_14w':statistics.mean(ds),'median_delta':statistics.median(ds),'challenger_better':sum(x>1e-12 for x in ds),'same':sum(abs(x)<=1e-12 for x in ds),'challenger_worse':sum(x<-1e-12 for x in ds),'min_delta':min(ds),'max_delta':max(ds),'baseline_mean_expected_wins_14w':statistics.mean(r['baseline_expected_wins_14w'] for r in rows),'challenger_mean_expected_wins_14w':statistics.mean(r['challenger_expected_wins_14w'] for r in rows),'policy_promotion_authorized':False,'rows':rows}
 pathlib.Path('diagnostics_2026').mkdir(exist_ok=True); pathlib.Path('diagnostics_2026/RC459_META_SAFE_QBTE_PAIRED_COMPLETE_ROSTER_UTILITY_2026.json').write_text(json.dumps(out,indent=2)); print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
