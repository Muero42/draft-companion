#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,urllib.request,collections,re,itertools
DRAFT_ID='1225769229928648704'; EXPECTED=list(range(459820001,459820121)); POS={'QB','RB','WR','TE'}
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-RC463-RepairUtility/1.0'});return json.load(urllib.request.urlopen(req,timeout=60))
def qtile(v,q):
 v=sorted(float(x) for x in v);z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z));return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def nrm(s): return re.sub(r'[^a-z0-9]','',str(s).lower())
def load(root,tag,flag):
 out={}
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or not x.get(flag) or not isinstance(x.get('drafts'),list):continue
  for d in x['drafts']:
   seed=int(d['seed'])
   if seed in out:raise RuntimeError(f'{tag} duplicate seed {seed}')
   out[seed]=d
 if sorted(out)!=EXPECTED:raise RuntimeError(f'{tag} seed union {sorted(out)}')
 return out
def lineup(players,w,repl):
 vals={p:sorted([float(x['weeks'][w]) for x in players if x['pos']==p],reverse=True) for p in POS}
 qb=vals['QB'][0] if vals['QB'] else repl['QB'][w];best=-1e100
 for rb in range(1,4):
  for wr in range(2,5):
   for te in range(1,3):
    if rb+wr+te!=6:continue
    tot=0
    for pos,k in [('RB',rb),('WR',wr),('TE',te)]:
     have=min(len(vals[pos]),k);tot+=sum(vals[pos][:have])+(k-have)*repl[pos][w]
    best=max(best,tot)
 return qb+best
def feasible(d):
 c=d.get('position_counts') or {};return int(c.get('QB',0))>=1 and int(c.get('RB',0))>=1 and int(c.get('WR',0))>=2
def main():
 B=load('/tmp/full','full-safety','rc463_full_safety_baseline_roster_export');G=load('/tmp/guard','guard','rc463_baseline_roster_export')
 bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'));assert bridge['status']=='PASS';fc=bridge['forecasts']
 byname=collections.defaultdict(list);bynorm=collections.defaultdict(list)
 for v in fc.values():
  key=(v.get('name','').strip().lower(),v.get('pos'));byname[key].append(v);bynorm[(nrm(v.get('name','')),v.get('pos'))].append(v)
 def frow(name,pos):
  m=byname[(name.strip().lower(),pos)]
  if len(m)==1:return m[0]
  m=bynorm[(nrm(name),pos)]
  if len(m)==1:return m[0]
  raise RuntimeError('forecast mapping '+name+' '+pos+' '+str(len(m)))
 def mapr(d): return [{'name':p['name'],'pos':p['pos'],'weeks':frow(p['name'],p['pos'])['pred_weeks_1_14'],'source':'draft'} for p in d['user_roster']]
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
 def util(roster): return sum(wp(lineup(roster,w,repl),w+1) for w in range(14))
 # Pre-Week-1 repair is deliberately conservative: at most two free-agent swaps, using only
 # the best 3 preseason-expectation FAs per position from that exact draft's undrafted pool.
 # FA ranking uses bridge expected weeks only (no 2026 realized information).
 def fa_candidates(d):
  out=[];unmatched=[]
  for slug in d.get('free_agent_ids') or []:
   ms=[]
   for pos in POS:
    z=bynorm.get((nrm(slug),pos),[])
    if len(z)==1:ms.append(z[0])
   if len(ms)==1:
    v=ms[0];out.append({'name':v['name'],'pos':v['pos'],'weeks':v['pred_weeks_1_14'],'source':'fa','mean':statistics.mean(v['pred_weeks_1_14'])})
   elif len(ms)>1: unmatched.append({'slug':slug,'reason':'ambiguous'})
   else: unmatched.append({'slug':slug,'reason':'unmatched'})
  keep=[]
  for pos in POS:
   a=sorted([x for x in out if x['pos']==pos],key=lambda x:x['mean'],reverse=True)[:3];keep.extend(a)
  return keep,unmatched
 def repair(d):
  base=mapr(d);fas,unmatched=fa_candidates(d);best=(util(base),base,[])
  # one swap
  for i in range(len(base)):
   for fa in fas:
    if any(x['name']==fa['name'] and x['pos']==fa['pos'] for x in base):continue
    r=base[:i]+base[i+1:]+[fa];u=util(r)
    if u>best[0]+1e-12:best=(u,r,[{'drop':base[i]['name'],'add':fa['name'],'add_pos':fa['pos']}])
  # two swaps; retain only top one-swap paths by score to bound computation.
  one=[]
  for i in range(len(base)):
   for fa in fas:
    if any(x['name']==fa['name'] and x['pos']==fa['pos'] for x in base):continue
    r=base[:i]+base[i+1:]+[fa];one.append((util(r),r,[{'drop':base[i]['name'],'add':fa['name'],'add_pos':fa['pos']}]))
  for _,r0,ops0 in sorted(one,key=lambda z:z[0],reverse=True)[:24]:
   for i in range(len(r0)):
    for fa in fas:
     if any(x['name']==fa['name'] and x['pos']==fa['pos'] for x in r0):continue
     r=r0[:i]+r0[i+1:]+[fa];u=util(r)
     if u>best[0]+1e-12:best=(u,r,ops0+[{'drop':r0[i]['name'],'add':fa['name'],'add_pos':fa['pos']}])
  return {'static':util(base),'repaired':best[0],'ops':best[2],'fa_candidates':[(x['name'],x['pos'],round(x['mean'],4)) for x in fas],'unmatched_n':len(unmatched)}
 rows=[]
 for seed in EXPECTED:
  b=repair(B[seed]);g=repair(G[seed]);rows.append({'seed':seed,'full_static':b['static'],'guard_static':g['static'],'full_repaired':b['repaired'],'guard_repaired':g['repaired'],'delta_repaired_guard_minus_full':g['repaired']-b['repaired'],'full_ops':b['ops'],'guard_ops':g['ops'],'full_unmatched_fa':b['unmatched_n'],'guard_unmatched_fa':g['unmatched_n']})
 ds=[r['delta_repaired_guard_minus_full'] for r in rows];mean=statistics.mean(ds);sd=statistics.stdev(ds);se=sd/math.sqrt(len(ds))
 out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'comparison':'minimal guard minus full safety after conservative pre-Week-1 FA repair','seeds':120,'seed_family':'459820001..459820120','repair_policy':'optimize up to two swaps using top-3 bridge-expected undrafted FAs per QB/RB/WR/TE from exact draft; preseason bridge only; no realized-2026 data','mean_delta_expected_wins_14w':mean,'median_delta':statistics.median(ds),'ci95_normal_diagnostic':[mean-1.96*se,mean+1.96*se],'p05':qtile(ds,.05),'p25':qtile(ds,.25),'p75':qtile(ds,.75),'p95':qtile(ds,.95),'guard_better':sum(x>1e-12 for x in ds),'same':sum(abs(x)<=1e-12 for x in ds),'guard_worse':sum(x<-1e-12 for x in ds),'full_mean_static':statistics.mean(r['full_static'] for r in rows),'guard_mean_static':statistics.mean(r['guard_static'] for r in rows),'full_mean_repaired':statistics.mean(r['full_repaired'] for r in rows),'guard_mean_repaired':statistics.mean(r['guard_repaired'] for r in rows),'mean_full_repair_gain':statistics.mean(r['full_repaired']-r['full_static'] for r in rows),'mean_guard_repair_gain':statistics.mean(r['guard_repaired']-r['guard_static'] for r in rows),'selected_panel_used_in_outcome_fit':False,'promotion_authorized':False,'rows':rows}
 pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);pathlib.Path('diagnostics_2026/RC463_PREWEEK1_REPAIR_UTILITY_120_20260825.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
