#!/usr/bin/env python3
"""Diagnostic evaluator for raw rc4.59 decision-counterfactual branches.

This does NOT certify a strategy. It deliberately keeps three distinct lenses:
1) selected-panel roster quality (lower rank sum is better),
2) Sleeper-market/ADP roster cost (lower is better),
3) the existing historical ADP-neighbor weekly Half-PPR bridge as a market-regret
   guardrail, not sole truth.

The evaluator consumes raw branches only after causal plumbing has passed. It never
changes a draft or candidate frontier. It models the unavoidable pre-Week-1 reduction
from 15 skill players to 13 skill players with two pre-specified legal drop rules.
"""
from __future__ import annotations
import collections,json,math,pathlib,statistics
POS=('QB','RB','WR','TE')
RAW=pathlib.Path('counterfactual_2026/RC459_CF_MARKET_BREADTH_2026.json')
BRIDGE=pathlib.Path('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json')
BGATE=pathlib.Path('bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json')
OUT=pathlib.Path('counterfactual_2026/RC459_CF_MARKET_BREADTH_MULTILENS_2026.json')

def qtile(vals,q):
    v=sorted(float(x) for x in vals)
    if not v:return 0.0
    z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)

def core_ok(r):
    c=collections.Counter(p['pos'] for p in r)
    return c['QB']>=1 and c['RB']>=1 and c['WR']>=2 and c['TE']>=1

def retain13(roster,method):
    r=list(roster); dropped=[]
    if len(r)!=15:raise RuntimeError('expected 15 skill players')
    original_index={str(p['key']):i for i,p in enumerate(r)}
    for _ in range(2):
        cand=[]
        for i,p in enumerate(r):
            trial=r[:i]+r[i+1:]
            if not core_ok(trial):continue
            if method=='MARKET_VALUE_DROP': key=(float(p.get('adp',999)),original_index[str(p['key'])])
            elif method=='LAST_TWO_DROP': key=(original_index[str(p['key'])],float(p.get('adp',999)))
            else:raise ValueError(method)
            cand.append((key,i,p))
        if not cand:raise RuntimeError('no legal drop')
        _,i,p=max(cand,key=lambda z:z[0]); dropped.append(p); r.pop(i)
    if len(r)!=13 or not core_ok(r):raise RuntimeError('retain13 invariant')
    return r,dropped

def build_repl(fc):
    by={p:[] for p in POS}
    for b in fc.values():
        pos=b.get('pos'); adp=b.get('sleeper_adp')
        if pos in by and isinstance(adp,(int,float)) and isinstance(b.get('pred_weeks_1_14'),list):by[pos].append((float(adp),b))
    repl={}
    for pos,a in by.items():
        a.sort(key=lambda x:x[0]);tail=a[max(0,int(len(a)*.80)):]
        repl[pos]=[qtile([b['pred_weeks_1_14'][w] for _,b in tail],.50) for w in range(14)]
    return repl

def lineup(roster,w,fc,repl):
    vals={p:[] for p in POS}
    for p in roster:
        b=fc.get(str(p['key']))
        if b and b.get('pos') in vals and isinstance(b.get('pred_weeks_1_14'),list):
            vals[b['pos']].append(float(b['pred_weeks_1_14'][w]))
    for v in vals.values():v.sort(reverse=True)
    qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]
    best=-1e99
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6:continue
        s=0.0
        for pos,n in {'RB':rb,'WR':wr,'TE':te}.items():
            s+=sum(vals[pos][:n])+max(0,n-len(vals[pos]))*repl[pos][w]
        best=max(best,s)
    return qb+best

def rank_rows(rows,key,reverse=False):
    sr=sorted(rows,key=lambda x:x[key],reverse=reverse)
    return {id(x):i+1 for i,x in enumerate(sr)}

def main():
    raw=json.load(open(RAW)); bridge=json.load(open(BRIDGE)); gate=json.load(open(BGATE))
    if raw.get('status')!='PASS' or not raw.get('raw_only') or raw.get('outcome_evaluated') is not False:raise RuntimeError('raw prerequisite')
    if gate.get('status')!='PASS' or gate.get('criteria',{}).get('selected_panel_not_used_in_fit') is not True:raise RuntimeError('bridge prerequisite')
    fc=bridge['forecasts']; repl=build_repl(fc); rows=[]
    for state in raw['rows']:
      for b in state['branches']:
        roster=b['user_roster']
        base={'seed':state['seed'],'treatment_pick':state['treatment_pick'],'candidate':b['candidate'],'prefix_fingerprint':state['prefix_fingerprint']}
        for method in ('MARKET_VALUE_DROP','LAST_TWO_DROP'):
            kept,dropped=retain13(roster,method)
            weeks=[lineup(kept,w,fc,repl) for w in range(14)]
            coverage=sum(str(p['key']) in fc for p in kept)
            rows.append({**base,'drop_rule':method,'kept_count':len(kept),'forecast_coverage':coverage,
              'panel_rank_sum_15':sum(float(p['panel']) for p in roster),'market_adp_sum_15':sum(float(p['adp']) for p in roster),
              'panel_rank_sum_13':sum(float(p['panel']) for p in kept),'market_adp_sum_13':sum(float(p['adp']) for p in kept),
              'bridge_lineup_total_14w':sum(weeks),'bridge_mean_weekly_lineup':statistics.mean(weeks),
              'dropped':[p['name'] for p in dropped],'position_counts_13':dict(collections.Counter(p['pos'] for p in kept))})
    # State-local ranks are important: candidates can only be compared inside identical shared-prefix states.
    groups=collections.defaultdict(list)
    for r in rows:groups[(r['seed'],r['treatment_pick'],r['drop_rule'])].append(r)
    for rr in groups.values():
        pr=rank_rows(rr,'panel_rank_sum_13',False); ar=rank_rows(rr,'market_adp_sum_13',False); br=rank_rows(rr,'bridge_lineup_total_14w',True)
        for x in rr:x['state_rank_panel13']=pr[id(x)];x['state_rank_market13']=ar[id(x)];x['state_rank_bridge']=br[id(x)]
    # Candidate summaries never pool unmatched states as if they were paired. Availability count is explicit.
    agg=collections.defaultdict(list)
    for r in rows:agg[(r['treatment_pick'],r['candidate']['name'],r['drop_rule'])].append(r)
    summaries=[]
    for (pick,name,drop),rr in agg.items():
        summaries.append({'treatment_pick':pick,'candidate':name,'drop_rule':drop,'n_states':len(rr),
          'mean_state_rank_panel13':statistics.mean(x['state_rank_panel13'] for x in rr),
          'mean_state_rank_market13':statistics.mean(x['state_rank_market13'] for x in rr),
          'mean_state_rank_bridge':statistics.mean(x['state_rank_bridge'] for x in rr),
          'mean_panel_rank_sum_13':statistics.mean(x['panel_rank_sum_13'] for x in rr),
          'mean_market_adp_sum_13':statistics.mean(x['market_adp_sum_13'] for x in rr),
          'mean_bridge_lineup_total_14w':statistics.mean(x['bridge_lineup_total_14w'] for x in rr)})
    out={'schema':1,'status':'PASS','policy_ranking_certified':False,
      'purpose':'diagnostic multi-lens evaluation of causal MARKET_NEUTRAL breadth branches',
      'lens_roles':{'panel':'independent expert-quality diagnostic, not calibrated season utility','market':'market-cost diagnostic','bridge':'ADP-aligned historical outcome guardrail; NOT sole truth'},
      'bridge_oos':gate.get('oos'),'state_count':len(raw['rows']),'branch_count':sum(len(x['branches']) for x in raw['rows']),
      'drop_rules':['MARKET_VALUE_DROP','LAST_TWO_DROP'],'rows':rows,'candidate_summaries':summaries,
      'limitations':['Only MARKET_NEUTRAL continuation in this breadth run.','Ten fresh states are diagnostic, not certification-sized.','Bridge forecast is structurally aligned with Sleeper ADP and must not by itself determine PITTI strategy.','Panel rank sums are quality diagnostics, not a cardinal championship-value scale.','Comparisons are causal only within identical seed/treatment shared-prefix states; aggregate summaries report availability counts explicitly.']}
    OUT.parent.mkdir(exist_ok=True);OUT.write_text(json.dumps(out,indent=2,ensure_ascii=False));
    compact=sorted(summaries,key=lambda x:(x['treatment_pick'],x['drop_rule'],x['mean_state_rank_bridge']))
    print(json.dumps({'status':'PASS','states':out['state_count'],'branches':out['branch_count'],'top_bridge_state_rank':compact[:12]},indent=2,ensure_ascii=False))
if __name__=='__main__':main()
