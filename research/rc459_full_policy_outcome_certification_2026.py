#!/usr/bin/env python3
"""Fail-closed paired outcome gate for exact rc4.59 full-draft policy.

Primary certification baseline is MARKET_ROSTER: a pre-specified ADP-only roster-aware
control that is independent of the selected expert panel and of the outcome evaluator.
BRIDGE_GREEDY is retained only as an evaluator-optimized upper-bound diagnostic; it
cannot by itself fail certification because optimizing on the same forecast used for
scoring would bias that comparison against Coach.

Certification uses a strict zero-margin paired 95% CI in BOTH baseline and stress.
PASS requires Coach lower CI >= 0 vs MARKET_ROSTER in both regimes. If any market-
control upper CI < 0 the gate FAILS_CLOSED; otherwise it remains INCONCLUSIVE.
"""
from __future__ import annotations
import json,math,pathlib,statistics,urllib.request,collections
DRAFT_ID='1225769229928648704';POS={'QB','RB','WR','TE'}

def getj(url):
    req=urllib.request.Request(url,headers={'User-Agent':'PITTI-FullPolicyOutcome/1.1'})
    with urllib.request.urlopen(req,timeout=45) as r:return json.load(r)
def qtile(vals,q):
    v=sorted(float(x) for x in vals)
    if not v:return 0.0
    z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)
def lineup(roster,w,repl,fc):
    vals={p:[] for p in POS}
    for p in roster:
        b=fc.get(str(p['key']))
        if b and b.get('pos') in POS:vals[b['pos']].append(float(b['pred_weeks_1_14'][w]))
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
    n=len(ds);m=statistics.mean(ds);sd=statistics.stdev(ds) if n>1 else 0.0;se=sd/math.sqrt(n) if n else float('inf');lo=m-1.96*se;hi=m+1.96*se
    h=n//2;h1=statistics.mean(ds[:h]) if h else None;h2=statistics.mean(ds[h:]) if n-h else None
    return {'n':n,'mean_delta_expected_wins_14w':m,'sd':sd,'se':se,'ci95':[lo,hi],'split_half_means':[h1,h2],'classification':'COACH_NOT_WORSE_95' if lo>=0 else 'COACH_DOMINATED_95' if hi<0 else 'INCONCLUSIVE'}
def main():
    drafts=json.load(open('policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json'))
    dg=json.load(open('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026_GATE.json'))
    bg=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json'))
    bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'))
    util=json.load(open('outcome_certification/INDEPENDENT_UTILITY_V3_5_CERTIFICATION_2025.json'))
    if drafts.get('status')!='PASS' or dg.get('status')!='PASS' or bg.get('status')!='PASS' or util.get('status')!='PASS':raise RuntimeError('prerequisite gate not PASS')
    if bg.get('criteria',{}).get('selected_panel_not_used_in_fit') is not True:raise RuntimeError('bridge independence not PASS')
    fc=bridge['forecasts']
    bypos={p:[] for p in POS}
    for k,b in fc.items():
        if b.get('pos') in POS and isinstance(b.get('sleeper_adp'),(int,float)):bypos[b['pos']].append((float(b['sleeper_adp']),b))
    repl={}
    for pos,a in bypos.items():
        a.sort(key=lambda x:x[0]);tail=a[max(0,int(len(a)*.80)):]
        repl[pos]=[qtile([b['pred_weeks_1_14'][w] for _,b in tail],.50) for w in range(14)]
    meta=getj(f'https://api.sleeper.app/v1/draft/{DRAFT_ID}');league=str(meta['league_id']);players=getj('https://api.sleeper.app/v1/players/nfl')
    skill=[]
    for w in range(1,15):
        games=getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}')
        for g in games:
            total=float(g.get('points') or 0);pp=g.get('players_points') or {};kd=0.0
            for sid in [str(x) for x in (g.get('starters') or [])]:
                if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
            skill.append((w,total-kd))
    def winprob(x,w):
        vals=[v for ww,v in skill if ww!=w];return (sum(v<x for v in vals)+.5*sum(v==x for v in vals)+1)/(len(vals)+2)
    evaluated=[]
    for r in drafts['rows']:
        scores=[lineup(r['roster'],w,repl,fc) for w in range(14)]
        ew=sum(winprob(scores[w],w+1) for w in range(14))
        evaluated.append({**{k:r[k] for k in ('stress','seed','policy')},'expected_wins_14w':ew,'mean_weekly_lineup':statistics.mean(scores),'position_counts':dict(collections.Counter(p['pos'] for p in r['roster'])),'roster':[p['name'] for p in r['roster']]})
    idx={(r['stress'],r['seed'],r['policy']):r for r in evaluated};comparisons={}
    for regime in drafts['regimes']:
        for control in ('BRIDGE_GREEDY','MARKET_ROSTER'):
            ds=[];details=[]
            seeds=sorted({r['seed'] for r in evaluated if r['stress']==regime and r['policy']=='COACH'})
            for seed in seeds:
                a=idx[(regime,seed,'COACH')];b=idx[(regime,seed,control)];d=a['expected_wins_14w']-b['expected_wins_14w'];ds.append(d);details.append({'seed':seed,'coach':a['expected_wins_14w'],'control':b['expected_wins_14w'],'delta':d})
            comparisons[f'{regime}|COACH_vs_{control}']={**paired_stats(ds),'gate_role':'PRIMARY_INDEPENDENT_BASELINE' if control=='MARKET_ROSTER' else 'DIAGNOSTIC_EVALUATOR_OPTIMIZED_UPPER_BOUND','details':details}
    core_counts={}
    for p in drafts['policies']:
        rr=[r for r in evaluated if r['policy']==p];core_counts[p]={'n':len(rr),'missing_qb':sum(x['position_counts'].get('QB',0)<1 for x in rr),'missing_rb':sum(x['position_counts'].get('RB',0)<1 for x in rr),'missing_wr2':sum(x['position_counts'].get('WR',0)<2 for x in rr),'missing_te':sum(x['position_counts'].get('TE',0)<1 for x in rr)}
    pre={'source_lock_58_58':drafts.get('source_lock','').startswith('58/58'),'dynamic_exact_gate_pass':dg['status']=='PASS','bridge_pass':bg['status']=='PASS','selected_panel_not_used_in_outcome_fit':bg.get('criteria',{}).get('selected_panel_not_used_in_fit') is True,'utility_v3_5_pass':util['status']=='PASS','runs_per_regime_ge_50':drafts.get('runs_per_regime',0)>=50,'market_control_core_complete':sum(core_counts['MARKET_ROSTER'][k] for k in ('missing_qb','missing_rb','missing_wr2','missing_te'))==0,'coach_core_complete':sum(core_counts['COACH'][k] for k in ('missing_qb','missing_rb','missing_wr2','missing_te'))==0}
    primary=[comparisons[f'{r}|COACH_vs_MARKET_ROSTER']['classification'] for r in drafts['regimes']]
    if not all(pre.values()):status='FAIL_CLOSED'
    elif all(x=='COACH_NOT_WORSE_95' for x in primary):status='PASS'
    elif any(x=='COACH_DOMINATED_95' for x in primary):status='FAIL_CLOSED'
    else:status='INCONCLUSIVE'
    criterion='Primary: zero-margin paired 95% CI vs pre-specified ADP-only MARKET_ROSTER in baseline and stress. PASS only if both lower bounds >= 0; FAIL_CLOSED if either upper bound < 0; otherwise INCONCLUSIVE. BRIDGE_GREEDY is diagnostic only because it optimizes directly on the scoring forecast.'
    out={'schema':2,'status':status,'policy_ranking_certified':status=='PASS','criterion':criterion,'preconditions':pre,'core_counts':core_counts,'comparisons':comparisons,'evaluated':evaluated,'limitations':['2026 outcomes are forecasts from the independently OOS-validated Sleeper market bridge, not realized 2026 production.','Opponent paths are stochastic rc4.59-parity research-kernel realizations; baseline and stress are both required.','Zero-margin gate is intentionally conservative; no post-hoc non-inferiority margin is allowed.','BRIDGE_GREEDY is evaluator-optimized and therefore cannot independently fail Coach certification.']}
    pathlib.Path('policy_certification_2026').mkdir(exist_ok=True)
    pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_OUTCOME_CERTIFICATION_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
    gate={'status':status,'policy_ranking_certified':out['policy_ranking_certified'],'criterion':criterion,'preconditions':pre,'core_counts':core_counts,'comparisons':{k:{z:v[z] for z in ('n','mean_delta_expected_wins_14w','ci95','split_half_means','classification','gate_role')} for k,v in comparisons.items()}}
    pathlib.Path('policy_certification_2026/RC459_FULL_POLICY_OUTCOME_CERTIFICATION_2026_GATE.json').write_text(json.dumps(gate,indent=2,ensure_ascii=False))
    print(json.dumps(gate,indent=2,ensure_ascii=False))
if __name__=='__main__':main()
