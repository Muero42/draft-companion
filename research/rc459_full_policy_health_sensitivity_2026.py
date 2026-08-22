#!/usr/bin/env python3
"""Explicit dated health/availability sensitivity for the paired rc4.59 full-draft gate.

This is intentionally a scenario analysis, not an injury-point model. It uses only
explicit current timeline states from FRESH_2026_HEALTH_ROLE_2026-08-22.json.
Two transforms separate the double-counting question:
- TIMING_ONLY: unavailable weeks are zeroed and the player's existing independent
  bridge 14-week total is redistributed across remaining weeks. This isolates lineup
  timing without claiming extra season-value information beyond current ADP.
- AVAILABILITY_LOSS: unavailable weeks are zeroed without redistribution. This is a
  downside diagnostic because current ADP can already contain some injury discount.
Role-only uncertainty is not numerically invented.

Final policy certification is conservative: the primary central timing scenario must
not show Coach dominated at 95% vs the ADP-only MARKET_ROSTER under both legal
pre-Week1 drop rules. Downside loss scenarios remain diagnostic unless they reveal a
large robust policy interaction that warrants player-specific review.
"""
from __future__ import annotations
import collections,json,math,pathlib,statistics,urllib.request,re,unicodedata
DRAFT_ID='1225769229928648704';POS={'QB','RB','WR','TE'}
BYE={'CAR':5,'KC':5,'CIN':6,'DET':6,'MIA':6,'MIN':6,'BUF':7,'JAX':7,'LAC':7,'WAS':7,'HOU':8,'NO':8,'NYG':8,'SF':8,'PIT':9,'TEN':9,'CHI':10,'DEN':10,'PHI':10,'TB':10,'ATL':11,'CLE':11,'GB':11,'LAR':11,'NE':11,'SEA':11,'BAL':13,'IND':13,'LV':13,'NYJ':13,'ARI':14,'DAL':14}
# Explicit deterministic stress states from dated evidence; empty means no extra
# missed regular-season week assumed. Central uses high-confidence timelines only.
SCENARIOS={
 'CENTRAL_TIMING':{
   'Jordyn Tyson':[1,2,3,4,5],
   'Alvin Kamara':[1,2],
 },
 'DOWNSIDE_TIMING':{
   'Jordyn Tyson':[1,2,3,4,5,6],
   'Alvin Kamara':[1,2,3],
   'Jeremiyah Love':[1],
   'Sam LaPorta':[1],
   'George Kittle':[1,2,3],
   'Zach Charbonnet':[1,2,3,4],
   'Puka Nacua':[1],
 },
}
# Require each numeric scenario name to be present in the dated manifest. This guards
# against silently maintaining an injury scenario after the source layer changes.
REQUIRED_STATUS={
 'Jordyn Tyson':'OUT_APPROX_TWO_MONTHS','Alvin Kamara':'OUT_4_TO_6_WEEKS',
 'Jeremiyah Love':'WEEK1_UNCERTAIN','Sam LaPorta':'INJURY_TIMETABLE_UNKNOWN',
 'George Kittle':'ACHILLES_RETURN_RAMP','Zach Charbonnet':'PUP_RETURN_UNKNOWN',
 'Puka Nacua':'PSOAS_SORENESS_EXPECTED_RETURN_NEXT_WEEK'}
def norm(x):
 x=unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower();x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x);return re.sub(r'[^a-z0-9]+','',x)
def getj(url):
 req=urllib.request.Request(url,headers={'User-Agent':'PITTI-HealthSensitivity/1.0'});return json.load(urllib.request.urlopen(req,timeout=45))
def qtile(vals,q):
 v=sorted(float(x) for x in vals)
 if not v:return 0.0
 z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z));return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def core_ok(r):
 c=collections.Counter(p['pos'] for p in r);return c['QB']>=1 and c['RB']>=1 and c['WR']>=2 and c['TE']>=1
def adp(p,fc):
 x=(fc.get(str(p['key'])) or {}).get('sleeper_adp');return float(x) if isinstance(x,(int,float)) else 999.
def retain13(roster,fc,method):
 r=list(roster)
 for _ in range(2):
  cand=[]
  for i,p in enumerate(r):
   if not core_ok(r[:i]+r[i+1:]):continue
   key=(adp(p,fc),i) if method=='MARKET_VALUE_DROP' else (i,adp(p,fc));cand.append((key,i))
  if not cand:raise RuntimeError('no legal drop')
  _,i=max(cand,key=lambda z:z[0]);r.pop(i)
 if len(r)!=13 or not core_ok(r):raise RuntimeError('retain13 invariant')
 return r
def player_weeks(player,b,missed,transform):
 vals=[float(x) for x in b['pred_weeks_1_14']];zero=set(int(x) for x in missed)
 bw=BYE.get(str(player.get('team') or '').upper());
 if bw:zero.add(bw)
 # Bye redistribution is always timing-only: bridge total already reflects a normal
 # NFL season containing a bye. Extra injury weeks depend on transform.
 total=sum(vals)
 if bw and 1<=bw<=14:
  i=bw-1;non=sum(v for j,v in enumerate(vals) if j!=i)
  if non>0:vals=[0. if j==i else v*total/non for j,v in enumerate(vals)]
 for w in zero:
  if 1<=w<=14 and w!=bw:vals[w-1]=0.
 if transform=='TIMING_ONLY':
  non=sum(vals)
  if non>0:vals=[v*total/non for v in vals]
 elif transform!='AVAILABILITY_LOSS':raise ValueError(transform)
 return vals
def lineup(roster,w,repl,fc,miss,transform):
 vals={p:[] for p in POS}
 for p in roster:
  b=fc.get(str(p['key']))
  if b and b.get('pos') in POS:vals[b['pos']].append(player_weeks(p,b,miss.get(norm(p['name']),[]),transform)[w])
 for v in vals.values():v.sort(reverse=True)
 qb=vals['QB'][0] if vals['QB'] else repl['QB'][w];best=-1e99
 for rb in range(1,4):
  for wr in range(2,5):
   for te in range(1,3):
    if rb+wr+te!=6:continue
    s=0.
    for pos,n in {'RB':rb,'WR':wr,'TE':te}.items():s+=sum(vals[pos][:n])+max(0,n-len(vals[pos]))*repl[pos][w]
    best=max(best,s)
 return qb+best
def stats(ds):
 n=len(ds);m=statistics.mean(ds);sd=statistics.stdev(ds) if n>1 else 0.;se=sd/math.sqrt(n);lo=m-1.96*se;hi=m+1.96*se
 return {'n':n,'mean':m,'ci95':[lo,hi],'classification':'COACH_NOT_WORSE_95' if lo>=0 else 'COACH_DOMINATED_95' if hi<0 else 'INCONCLUSIVE'}
def main():
 drafts=json.load(open('policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json'));bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'));bg=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json'));health=json.load(open('freeze_2026/FRESH_2026_HEALTH_ROLE_2026-08-22.json'));v2=json.load(open('policy_certification_2026/RC459_FULL_POLICY_OUTCOME_CERTIFICATION_V2_2026_GATE.json'))
 if drafts.get('status')!='PASS' or bg.get('status')!='PASS' or drafts.get('runs_per_regime',0)<50:raise RuntimeError('paired/bridge prerequisite')
 wm={norm(x['name']):x for x in health.get('material_watch',[])}
 for name,status in REQUIRED_STATUS.items():
  x=wm.get(norm(name));
  if not x or x.get('status')!=status:raise RuntimeError(f'health source drift {name}')
 fc=bridge['forecasts'];bypos={p:[] for p in POS}
 for b in fc.values():
  if b.get('pos') in POS and isinstance(b.get('sleeper_adp'),(int,float)):bypos[b['pos']].append((float(b['sleeper_adp']),b))
 repl={}
 for pos,a in bypos.items():
  a.sort(key=lambda x:x[0]);tail=a[max(0,int(len(a)*.8)):];repl[pos]=[qtile([b['pred_weeks_1_14'][w] for _,b in tail],.5) for w in range(14)]
 meta=getj(f'https://api.sleeper.app/v1/draft/{DRAFT_ID}');league=str(meta['league_id']);players=getj('https://api.sleeper.app/v1/players/nfl');skill=[]
 for w in range(1,15):
  for g in getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}'):
   total=float(g.get('points') or 0);pp=g.get('players_points') or {};kd=0.
   for sid in [str(x) for x in (g.get('starters') or [])]:
    if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
   skill.append((w,total-kd))
 def wp(x,w):
  vals=[v for ww,v in skill if ww!=w];return (sum(v<x for v in vals)+.5*sum(v==x for v in vals)+1)/(len(vals)+2)
 results={};exposure={}
 for scen,rawmiss in SCENARIOS.items():
  miss={norm(k):v for k,v in rawmiss.items()}
  for transform in ('TIMING_ONLY','AVAILABILITY_LOSS'):
   for drop in ('MARKET_VALUE_DROP','LAST_TWO_DROP'):
    ev=[];exp=collections.defaultdict(collections.Counter)
    for r in drafts['rows']:
     kept=retain13(r['roster'],fc,drop);scores=[lineup(kept,w,repl,fc,miss,transform) for w in range(14)];ew=sum(wp(scores[w],w+1) for w in range(14))
     for p in kept:
      if norm(p['name']) in miss:exp[r['policy']][p['name']]+=1
     ev.append((r['stress'],r['seed'],r['policy'],ew))
    ix={(a,b,c):d for a,b,c,d in ev};exposure[f'{scen}|{transform}|{drop}']={p:dict(c) for p,c in exp.items()}
    for regime in drafts['regimes']:
     seeds=sorted({b for a,b,c,d in ev if a==regime and c=='COACH'});ds=[ix[(regime,s,'COACH')]-ix[(regime,s,'MARKET_ROSTER')] for s in seeds]
     results[f'{scen}|{transform}|{drop}|{regime}']=stats(ds)
 central=[v['classification'] for k,v in results.items() if k.startswith('CENTRAL_TIMING|TIMING_ONLY|')]
 central_status='PASS' if central and all(x=='COACH_NOT_WORSE_95' for x in central) else 'FAIL_CLOSED' if any(x=='COACH_DOMINATED_95' for x in central) else 'INCONCLUSIVE'
 structural=v2.get('structural_policy_gate')
 final='PASS' if structural=='PASS' and central_status=='PASS' else 'FAIL_CLOSED' if structural=='FAIL_CLOSED' or central_status=='FAIL_CLOSED' else 'INCONCLUSIVE'
 out={'schema':1,'status':final,'policy_ranking_certified':final=='PASS','structural_v2_gate':structural,'central_health_timing_gate':central_status,'health_manifest_as_of':health.get('as_of'),'scenario_weeks':SCENARIOS,'results':results,'exposure_counts':exposure,'interpretation':'Final PASS requires roster-valid/bye-aware structural v2 PASS plus no 95% Coach domination vs ADP-only MARKET_ROSTER under central dated timing sensitivity. Availability-loss and broader downside scenarios are diagnostics because current ADP may already encode some injury discount; role-only uncertainty is not numerically invented.'}
 pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_HEALTH_SENSITIVITY_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False));gate={k:out[k] for k in ('status','policy_ranking_certified','structural_v2_gate','central_health_timing_gate','health_manifest_as_of','scenario_weeks','results','interpretation')};pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_HEALTH_SENSITIVITY_2026_GATE.json').write_text(json.dumps(gate,indent=2,ensure_ascii=False));print(json.dumps(gate,indent=2,ensure_ascii=False))
if __name__=='__main__':main()
