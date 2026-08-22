#!/usr/bin/env python3
"""Roster-valid independent outcome challenger for paired rc4.59 full drafts.

Corrections versus v1:
1) the drafted 15-skill-player roster is a temporary pre-Week-1 option set; two skill
   players must be released to add required K and DST. Primary evaluation therefore
   retains 13 skill players using a pre-specified ADP-only drop rule independent of the
   selected expert panel and independent of the outcome evaluator;
2) current 2026 team bye weeks are placed explicitly. The market-bridge 14-week total
   is conserved while its timing is redistributed around the actual bye, avoiding both
   a fictitious active player on bye and an extra bye penalty;
3) a LAST_TWO core-preserving drop is retained as a structural sensitivity. Final
   certification is intentionally withheld here until the separate dated health/role
   scenario layer is also evaluated; no generic injury-point penalties are invented.
"""
from __future__ import annotations
import collections,json,math,pathlib,statistics,urllib.request,re,unicodedata
DRAFT_ID='1225769229928648704'; POS={'QB','RB','WR','TE'}
# NFL.com 2026 schedule-release bye-week table, May 15 2026.
BYE={
 'CAR':5,'KC':5,'CIN':6,'DET':6,'MIA':6,'MIN':6,'BUF':7,'JAX':7,'LAC':7,'WAS':7,
 'HOU':8,'NO':8,'NYG':8,'SF':8,'PIT':9,'TEN':9,'CHI':10,'DEN':10,'PHI':10,'TB':10,
 'ATL':11,'CLE':11,'GB':11,'LAR':11,'NE':11,'SEA':11,'BAL':13,'IND':13,'LV':13,'NYJ':13,
 'ARI':14,'DAL':14}

def norm(x):
    x=unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower()
    x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x)
    return re.sub(r'[^a-z0-9]+','',x)
def getj(url):
    req=urllib.request.Request(url,headers={'User-Agent':'PITTI-FullPolicyOutcomeV2/1.0'})
    with urllib.request.urlopen(req,timeout=45) as r:return json.load(r)
def qtile(vals,q):
    v=sorted(float(x) for x in vals)
    if not v:return 0.0
    z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def scheduled_weeks(player,fcrow):
    vals=[float(x) for x in fcrow['pred_weeks_1_14']]
    team=str(player.get('team') or '').upper(); bw=BYE.get(team)
    if not bw or not 1<=bw<=14:return vals
    i=bw-1; total=sum(vals); non=sum(v for j,v in enumerate(vals) if j!=i)
    if non<=0:return [0.0 if j==i else v for j,v in enumerate(vals)]
    scale=total/non
    return [0.0 if j==i else v*scale for j,v in enumerate(vals)]
def core_ok(roster):
    c=collections.Counter(p['pos'] for p in roster)
    return c['QB']>=1 and c['RB']>=1 and c['WR']>=2 and c['TE']>=1
def market_adp(p,fc):
    b=fc.get(str(p['key'])) or {}; x=b.get('sleeper_adp')
    return float(x) if isinstance(x,(int,float)) else 999.0
def retain13(roster,fc,method):
    r=list(roster)
    if len(r)!=15: raise RuntimeError(f'expected 15 skill picks, got {len(r)}')
    dropped=[]
    for _ in range(2):
        cand=[]
        for i,p in enumerate(r):
            trial=r[:i]+r[i+1:]
            if not core_ok(trial):continue
            if method=='MARKET_VALUE_DROP': key=(market_adp(p,fc),i)
            elif method=='LAST_TWO_DROP': key=(i,market_adp(p,fc))
            else:raise ValueError(method)
            cand.append((key,i,p))
        if not cand:raise RuntimeError('no legal pre-Week1 drop')
        _,i,p=max(cand,key=lambda z:z[0]);dropped.append(p);r.pop(i)
    if len(r)!=13 or not core_ok(r):raise RuntimeError('retained roster invariant')
    return r,dropped
def lineup(roster,w,repl,fc):
    vals={p:[] for p in POS}
    for p in roster:
        b=fc.get(str(p['key']))
        if b and b.get('pos') in POS:
            vals[b['pos']].append(scheduled_weeks(p,b)[w])
    for v in vals.values():v.sort(reverse=True)
    qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]
    best=-1e99
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6:continue
        s=0.0
        for pos,n in {'RB':rb,'WR':wr,'TE':te}.items():
            s+=sum(vals[pos][:n])+(max(0,n-len(vals[pos])))*repl[pos][w]
        best=max(best,s)
    return qb+best
def paired_stats(ds):
    n=len(ds);m=statistics.mean(ds);sd=statistics.stdev(ds) if n>1 else 0.0;se=sd/math.sqrt(n) if n else float('inf')
    lo=m-1.96*se;hi=m+1.96*se;h=n//2
    return {'n':n,'mean_delta_expected_wins_14w':m,'sd':sd,'se':se,'ci95':[lo,hi],
            'split_half_means':[statistics.mean(ds[:h]) if h else None,statistics.mean(ds[h:]) if n-h else None],
            'classification':'COACH_NOT_WORSE_95' if lo>=0 else 'COACH_DOMINATED_95' if hi<0 else 'INCONCLUSIVE'}
def main():
    drafts=json.load(open('policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json'))
    dg=json.load(open('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026_GATE.json'))
    bg=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json'))
    bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'))
    util=json.load(open('outcome_certification/INDEPENDENT_UTILITY_V3_5_CERTIFICATION_2025.json'))
    health=json.load(open('freeze_2026/FRESH_2026_HEALTH_ROLE_2026-08-22.json'))
    if drafts.get('status')!='PASS' or dg.get('status')!='PASS' or bg.get('status')!='PASS' or util.get('status')!='PASS':raise RuntimeError('prerequisite gate')
    if bg.get('criteria',{}).get('selected_panel_not_used_in_fit') is not True:raise RuntimeError('bridge independence')
    fc=bridge['forecasts']; bypos={p:[] for p in POS}
    for _,b in fc.items():
        if b.get('pos') in POS and isinstance(b.get('sleeper_adp'),(int,float)):bypos[b['pos']].append((float(b['sleeper_adp']),b))
    repl={}
    for pos,a in bypos.items():
        a.sort(key=lambda x:x[0]);tail=a[max(0,int(len(a)*.80)):]
        repl[pos]=[qtile([b['pred_weeks_1_14'][w] for _,b in tail],.50) for w in range(14)]
    meta=getj(f'https://api.sleeper.app/v1/draft/{DRAFT_ID}');league=str(meta['league_id']);players=getj('https://api.sleeper.app/v1/players/nfl')
    skill=[]
    for w in range(1,15):
        for g in getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}'):
            total=float(g.get('points') or 0);pp=g.get('players_points') or {};kd=0.0
            for sid in [str(x) for x in (g.get('starters') or [])]:
                if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
            skill.append((w,total-kd))
    def winprob(x,w):
        vals=[v for ww,v in skill if ww!=w];return (sum(v<x for v in vals)+.5*sum(v==x for v in vals)+1)/(len(vals)+2)
    watch={norm(x['name']):x for x in health.get('material_watch',[])}
    all_eval={}; exposure={}
    for method in ('MARKET_VALUE_DROP','LAST_TWO_DROP'):
      evaluated=[];exp=collections.defaultdict(collections.Counter)
      for row in drafts['rows']:
        kept,dropped=retain13(row['roster'],fc,method)
        scores=[lineup(kept,w,repl,fc) for w in range(14)]; ew=sum(winprob(scores[w],w+1) for w in range(14))
        for p in kept:
            if norm(p['name']) in watch:exp[row['policy']][p['name']]+=1
        evaluated.append({**{k:row[k] for k in ('stress','seed','policy')},'expected_wins_14w':ew,'mean_weekly_lineup':statistics.mean(scores),
          'position_counts':dict(collections.Counter(p['pos'] for p in kept)),'roster':[p['name'] for p in kept],'dropped':[p['name'] for p in dropped]})
      all_eval[method]=evaluated
      exposure[method]={pol:dict(c) for pol,c in exp.items()}
    comparisons={}
    for method,evaluated in all_eval.items():
      idx={(r['stress'],r['seed'],r['policy']):r for r in evaluated}
      for regime in drafts['regimes']:
        for control in ('BRIDGE_GREEDY','MARKET_ROSTER'):
          seeds=sorted({r['seed'] for r in evaluated if r['stress']==regime and r['policy']=='COACH'});ds=[]
          for seed in seeds:ds.append(idx[(regime,seed,'COACH')]['expected_wins_14w']-idx[(regime,seed,control)]['expected_wins_14w'])
          comparisons[f'{method}|{regime}|COACH_vs_{control}']={**paired_stats(ds),'gate_role':'PRIMARY_INDEPENDENT_BASELINE' if control=='MARKET_ROSTER' else 'DIAGNOSTIC_EVALUATOR_OPTIMIZED_UPPER_BOUND'}
    core={}
    for method,evaluated in all_eval.items():
      core[method]={}
      for pol in drafts['policies']:
        rr=[r for r in evaluated if r['policy']==pol];core[method][pol]={'n':len(rr),'invalid_core':sum(not (x['position_counts'].get('QB',0)>=1 and x['position_counts'].get('RB',0)>=1 and x['position_counts'].get('WR',0)>=2 and x['position_counts'].get('TE',0)>=1) for x in rr)}
    pre={'source_lock_58_58':drafts.get('source_lock','').startswith('58/58'),'dynamic_exact_gate_pass':dg['status']=='PASS','bridge_pass':bg['status']=='PASS','selected_panel_not_used_in_outcome_fit':True,'utility_v3_5_pass':True,'runs_per_regime_ge_50':drafts.get('runs_per_regime',0)>=50,'temporary_15_to_13_skill_drop_modeled':True,'official_2026_bye_timing_modeled':True,'all_retained_core_valid':all(v['invalid_core']==0 for m in core.values() for v in m.values())}
    primary=[comparisons[f'{m}|{r}|COACH_vs_MARKET_ROSTER']['classification'] for m in ('MARKET_VALUE_DROP','LAST_TWO_DROP') for r in drafts['regimes']]
    if not all(pre.values()):struct='FAIL_CLOSED'
    elif all(x=='COACH_NOT_WORSE_95' for x in primary):struct='PASS'
    elif any(x=='COACH_DOMINATED_95' for x in primary):struct='FAIL_CLOSED'
    else:struct='INCONCLUSIVE'
    # Deliberately do not promote final policy certification until explicit health/role
    # scenario sensitivity is run; current ADP already incorporates some injury news,
    # so adding arbitrary point penalties here would double-count rather than solve it.
    final='HEALTH_SCENARIO_OPEN' if struct=='PASS' else struct
    out={'schema':3,'status':final,'structural_policy_gate':struct,'policy_ranking_certified':False,
      'criterion':'Coach must be non-inferior at zero margin vs ADP-only MARKET_ROSTER in baseline and stress under BOTH market-value and last-two legal pre-Week1 drop rules. Final certification additionally requires separate dated health/role scenario sensitivity.',
      'preconditions':pre,'comparisons':comparisons,'core_counts':core,'health_watch_retained_exposure_counts':exposure,
      'health_manifest_as_of':health.get('as_of'),'drop_rules':['MARKET_VALUE_DROP','LAST_TWO_DROP'],'bye_source':'NFL.com 2026 schedule release: every team bye week (2026-05-15)',
      'limitations':['Market bridge is an independently OOS-validated ADP-implied forecast, not realized 2026 production.','Bye placement preserves each player bridge total; it changes timing only.','Dated health/role uncertainty is not converted to arbitrary numeric penalties here; a separate explicit-state sensitivity is still required.','BRIDGE_GREEDY remains diagnostic only.']}
    pathlib.Path('policy_certification_2026').mkdir(exist_ok=True)
    pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_OUTCOME_CERTIFICATION_V2_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
    gate={k:out[k] for k in ('status','structural_policy_gate','policy_ranking_certified','criterion','preconditions','drop_rules','health_manifest_as_of')};gate['comparisons']={k:{z:v[z] for z in ('n','mean_delta_expected_wins_14w','ci95','split_half_means','classification','gate_role')} for k,v in comparisons.items()};gate['health_watch_retained_exposure_counts']=exposure
    pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_OUTCOME_CERTIFICATION_V2_2026_GATE.json').write_text(json.dumps(gate,indent=2,ensure_ascii=False))
    print(json.dumps(gate,indent=2,ensure_ascii=False))
if __name__=='__main__':main()
