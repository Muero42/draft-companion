#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,urllib.request,collections
DRAFT_ID='1225769229928648704'; POS={'QB','RB','WR','TE'}; SEEDS=list(range(459820001,459820121))
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-rc463-FullVsM15Utility/1.0'}); return json.load(urllib.request.urlopen(req,timeout=60))
def qtile(v,q):
 v=sorted(float(x) for x in v); z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z)); return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load_full(root):
 out={}; meta=set()
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or x.get('parity')!='10/10 exact decision-core + roster + fingerprint':continue
  meta.add(x.get('metadata_snapshot_sha256'))
  for row in x.get('rows') or []:
   s=int(row['seed'])
   if s in out: raise RuntimeError('duplicate full '+str(s))
   dec=row.get('instrumented_decisions') or []
   if len(dec)!=15: raise RuntimeError('full decisions '+str(s)+' '+str(len(dec)))
   out[s]={'user_roster':[{'name':d['name'],'pos':d['pos']} for d in dec]}
 if sorted(out)!=SEEDS: raise RuntimeError('full seed union '+str(sorted(out)))
 if len(meta)!=1 or None in meta: raise RuntimeError('full metadata '+repr(meta))
 return out,next(iter(meta))
def load_m15(root):
 out={}; meta=set()
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or x.get('threshold')!=-15 or not isinstance(x.get('drafts'),list):continue
  meta.add(x.get('metadata_snapshot_sha256'))
  for d in x['drafts']:
   s=int(d['seed'])
   if s in out: raise RuntimeError('duplicate m15 '+str(s))
   out[s]=d
 if sorted(out)!=SEEDS: raise RuntimeError('m15 seed union '+str(sorted(out)))
 if len(meta)!=1 or None in meta: raise RuntimeError('m15 metadata '+repr(meta))
 return out,next(iter(meta))
def lineup(players,w,repl):
 vals={p:sorted([x['weeks'][w] for x in players if x['pos']==p],reverse=True) for p in POS}
 qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]; best=-1e9
 for rb in range(1,4):
  for wr in range(2,5):
   for te in range(1,3):
    if rb+wr+te!=6:continue
    tot=0
    for pos,n in [('RB',rb),('WR',wr),('TE',te)]:
     have=min(len(vals[pos]),n);tot+=sum(vals[pos][:have])+(n-have)*repl[pos][w]
    best=max(best,tot)
 return qb+best
def main():
 F,mf=load_full('/tmp/full-sameinput'); M,mm=load_m15('/tmp/threshold-artifacts')
 if mf!=mm: raise RuntimeError('metadata mismatch '+str((mf,mm)))
 bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json')); assert bridge['status']=='PASS'; fc=bridge['forecasts']
 if bridge.get('criteria',{}).get('selected_panel_not_used_in_fit') is not True: raise RuntimeError('bridge independence gate')
 byname=collections.defaultdict(list)
 for k,v in fc.items():byname[(v.get('name','').strip().lower(),v.get('pos'))].append(v)
 def map_roster(d):
  out=[]
  for p in d['user_roster']:
   m=byname[(p['name'].strip().lower(),p['pos'])]
   if len(m)!=1:raise RuntimeError('forecast mapping '+p['name']+' '+p['pos']+' '+str(len(m)))
   out.append({'name':p['name'],'pos':p['pos'],'weeks':m[0]['pred_weeks_1_14']})
  return out
 bypos={p:[] for p in POS}
 for v in fc.values():
  if v.get('pos') in POS and isinstance(v.get('sleeper_adp'),(int,float)):bypos[v['pos']].append((float(v['sleeper_adp']),v))
 repl={}
 for pos,a in bypos.items():
  a.sort(key=lambda z:z[0]);tail=a[max(0,int(len(a)*.80)):];repl[pos]=[qtile([v['pred_weeks_1_14'][w] for _,v in tail],.5) for w in range(14)]
 meta=getj('https://api.sleeper.app/v1/draft/'+DRAFT_ID);league=str(meta['league_id']);players=getj('https://api.sleeper.app/v1/players/nfl');skill=[]
 for w in range(1,15):
  for g in getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}'):
   total=float(g.get('points') or 0);pp=g.get('players_points') or {};kd=0
   for sid in map(str,g.get('starters') or []):
    if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
   skill.append((w,total-kd))
 def wp(score,w):
  v=[x for ww,x in skill if ww!=w];return (sum(x<score for x in v)+.5*sum(x==score for x in v)+1)/(len(v)+2)
 def util(r):return sum(wp(lineup(r,w,repl),w+1) for w in range(14))
 rows=[]
 for seed in SEEDS:
  rf,rm=map_roster(F[seed]),map_roster(M[seed]);uf,um=util(rf),util(rm)
  sigf=tuple((x['name'],x['pos']) for x in F[seed]['user_roster']);sigm=tuple((x['name'],x['pos']) for x in M[seed]['user_roster'])
  rows.append({'seed':seed,'same_roster':sigf==sigm,'full_safety_expected_wins_14w':uf,'m15_expected_wins_14w':um,'delta_m15_minus_full':um-uf})
 ds=[r['delta_m15_minus_full'] for r in rows];changed=[r for r in rows if not r['same_roster']]
 out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'full_source_run_id':32865478995,'m15_source_run_id':32870106661,'metadata_snapshot_sha256':mf,'comparison':'threshold -15 minus exact same-input Full Safety','seeds':120,'changed_rosters':len(changed),'same_rosters':120-len(changed),'mean_delta_expected_wins_14w':statistics.mean(ds),'median_delta':statistics.median(ds),'m15_better':sum(x>1e-12 for x in ds),'same':sum(abs(x)<=1e-12 for x in ds),'m15_worse':sum(x<-1e-12 for x in ds),'min_delta':min(ds),'max_delta':max(ds),'changed_mean_delta':statistics.mean([r['delta_m15_minus_full'] for r in changed]) if changed else 0,'selected_panel_used_in_outcome_fit':False,'policy_promotion_authorized':False,'rows':rows}
 pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);pathlib.Path('diagnostics_2026/RC463_PRESAFETY_FULL_VS_M15_UTILITY_2026.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
