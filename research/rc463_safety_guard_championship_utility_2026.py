#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,urllib.request,collections
DRAFT_ID='1225769229928648704'; EXPECTED=list(range(459820001,459820121)); POS={'QB','RB','WR','TE'}
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-RC463-SafetyGuardUtility/1.0'});return json.load(urllib.request.urlopen(req,timeout=60))
def qtile(v,q):
 v=sorted(float(x) for x in v);z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z));return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def load(root,tag,flag):
 out={}
 for p in glob.glob(root+'/**/*.json',recursive=True):
  try:x=json.load(open(p))
  except:continue
  if x.get('status')!='PASS' or not x.get(flag) or not isinstance(x.get('drafts'),list):continue
  for d in x['drafts']:
   seed=int(d['seed']);
   if seed in out:raise RuntimeError(f'{tag} duplicate seed {seed}')
   out[seed]=d
 if sorted(out)!=EXPECTED:raise RuntimeError(f'{tag} seed union {sorted(out)}')
 return out
def lineup(players,w,repl):
 vals={p:sorted([float(x['weeks'][w]) for x in players if x['pos']==p],reverse=True) for p in POS};qb=vals['QB'][0] if vals['QB'] else repl['QB'][w];best=-1e100
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
 B=load('/tmp/full','full-safety','rc463_full_safety_baseline_roster_export');C=load('/tmp/guard','guard','rc463_baseline_roster_export')
 bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'));assert bridge['status']=='PASS';fc=bridge['forecasts'];byname=collections.defaultdict(list)
 for v in fc.values():byname[(v.get('name','').strip().lower(),v.get('pos'))].append(v)
 def mapr(d):
  out=[]
  for p in d['user_roster']:
   m=byname[(p['name'].strip().lower(),p['pos'])]
   if len(m)!=1:raise RuntimeError('forecast mapping '+p['name']+' '+str(len(m)))
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
 rows=[];changed=0;posB=collections.Counter();posC=collections.Counter();byPickB={};byPickC={}
 for seed in EXPECTED:
  b,c=B[seed],C[seed];rb,rc=mapr(b),mapr(c);sb=[lineup(rb,w,repl) for w in range(14)];sc=[lineup(rc,w,repl) for w in range(14)];ub=sum(wp(sb[w],w+1) for w in range(14));uc=sum(wp(sc[w],w+1) for w in range(14));br=[(x['name'],x['pos']) for x in b['user_roster']];cr=[(x['name'],x['pos']) for x in c['user_roster']];changed+=br!=cr
  for k,v in b['position_counts'].items():posB[k]+=v
  for k,v in c['position_counts'].items():posC[k]+=v
  for z in b['decisions']:byPickB.setdefault(str(z['pick']),collections.Counter())[z['name']]+=1
  for z in c['decisions']:byPickC.setdefault(str(z['pick']),collections.Counter())[z['name']]+=1
  rows.append({'seed':seed,'full_safety_expected_wins_14w':ub,'guard_expected_wins_14w':uc,'delta_guard_minus_full_safety':uc-ub})
 ds=[r['delta_guard_minus_full_safety'] for r in rows];mean=statistics.mean(ds);sd=statistics.stdev(ds);se=sd/math.sqrt(120)
 def l1(a,b):
  o={}
  for k in sorted(set(a)|set(b),key=int):
   names=set(a.get(k,{}))|set(b.get(k,{}));o[k]=sum(abs(a.get(k,{}).get(n,0)-b.get(k,{}).get(n,0)) for n in names)/240
  return o
 out={'schema':1,'status':'PASS','research_only':True,'production_mutation':False,'comparison':'no-safety-resurrection guard minus production-like full PlayerQualitySafety candidate board','seeds':120,'seed_family':'459820001..459820120','changed_rosters':changed,'full_safety_mean_position_counts':{k:v/120 for k,v in posB.items()},'guard_mean_position_counts':{k:v/120 for k,v in posC.items()},'pick_l1_guard_vs_full_safety':l1(byPickC,byPickB),'mean_delta_expected_wins_14w':mean,'median_delta':statistics.median(ds),'sd_delta':sd,'mean_delta_ci95_normal_diagnostic':[mean-1.96*se,mean+1.96*se],'guard_better':sum(x>1e-12 for x in ds),'same':sum(abs(x)<=1e-12 for x in ds),'guard_worse':sum(x<-1e-12 for x in ds),'min_delta':min(ds),'max_delta':max(ds),'full_safety_mean_expected_wins_14w':statistics.mean(r['full_safety_expected_wins_14w'] for r in rows),'guard_mean_expected_wins_14w':statistics.mean(r['guard_expected_wins_14w'] for r in rows),'selected_panel_used_in_outcome_fit':False,'promotion_authorized':False,'interpretation':'Direct fresh paired gate for the minimal safety-resurrection guard. Promotion still requires freeze-risk and implementation-level regression review.','rows':rows}
 pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);pathlib.Path('diagnostics_2026/RC463_SAFETY_GUARD_PAIRED_CHAMPIONSHIP_UTILITY_120_20260825.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__':main()
