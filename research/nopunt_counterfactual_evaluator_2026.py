#!/usr/bin/env python3
"""Independent 2026 projection lens for PITTI direct-decision counterfactuals.

Inputs are separated from the draft policy: raw causal branches produced BEFORE
outcome evaluation, frozen NoPunt pure-model 2026 projections, and the frozen PITTI
market pool used only to resolve Sleeper ids -> player names/positions for the actual
post-draft free-agent pool. Market ADP is never used in this evaluator's score.

This is NOT a championship-probability model and is never allowed to tune NoPunt or
PITTI on the same states.
"""
from __future__ import annotations
import json,re,sys,pathlib,itertools,collections
ALIASES={'jamescookiii':'jamescook','kennygainwell':'kennethgainwell'}
POS={'QB','RB','WR','TE'}
def norm(s):
    x=str(s or '').lower().replace('’',"'");x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x);x=re.sub(r'[^a-z0-9]+','',x);return ALIASES.get(x,x)
def lineup(vals):
    by={p:sorted(vals.get(p,[]),reverse=True) for p in POS}
    if not by['QB']:return None
    best=None
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6 or len(by['RB'])<rb or len(by['WR'])<wr or len(by['TE'])<te:continue
        v=by['QB'][0]+sum(by['RB'][:rb])+sum(by['WR'][:wr])+sum(by['TE'][:te]);best=v if best is None or v>best else best
    return best
def branch_metrics(branch,proj,market_by_id):
    vals=collections.defaultdict(list);missing=[];mapped=[]
    for p in branch['user_roster']:
        pos=str(p.get('pos') or '').upper();name=p.get('name')
        if pos not in POS:continue
        q=proj.get(norm(name))
        if not q:missing.append(name);continue
        v=float(q['half_ppr'])/17.0;vals[pos].append(v);mapped.append((name,pos,v))
    starter=lineup(vals)
    fa=collections.defaultdict(list);fa_missing=[]
    for fid in branch.get('free_agent_ids',[]):
        m=market_by_id.get(str(fid))
        if not m or str(m.get('pos') or '').upper() not in POS:continue
        q=proj.get(norm(m.get('name')))
        if not q:fa_missing.append(m.get('name'));continue
        fa[str(m['pos']).upper()].append(float(q['half_ppr'])/17.0)
    fa_lineup=lineup(fa);fa_best={p:(round(max(fa[p]),5) if fa[p] else None) for p in sorted(POS)}
    above=sum(1 for _,pos,v in mapped if fa_best.get(pos) is not None and v>fa_best[pos])
    return {'starter_expected_half_ppr_per_week':None if starter is None else round(starter,5),'actual_fa_lineup_expected_half_ppr_per_week':None if fa_lineup is None else round(fa_lineup,5),'starter_surplus_vs_actual_fa_lineup':None if starter is None or fa_lineup is None else round(starter-fa_lineup,5),'actual_fa_best_ppw_by_pos':fa_best,'roster_players_above_actual_fa_pos_best':above,'mapped_roster_players':len(mapped),'skill_roster_players':len([p for p in branch['user_roster'] if str(p.get('pos') or '').upper() in POS]),'missing_projection_names':sorted(missing),'mapping_complete':len(missing)==0,'legal_projected_lineup':starter is not None,'actual_fa_mapped_counts':{p:len(fa[p]) for p in sorted(POS)},'actual_fa_missing_projection_count':len(fa_missing)}
def main(raw_path,proj_path,market_path,out_path):
    raw=json.load(open(raw_path));pj=json.load(open(proj_path));mk=json.load(open(market_path))
    if raw.get('status')!='PASS' or not raw.get('raw_only') or raw.get('outcome_evaluated') is not False:raise SystemExit('raw causal precondition failed')
    if pj.get('status')!='PASS' or pj.get('schema',0)<2:raise SystemExit('projection freeze precondition failed')
    if 'zero betting or expert-ranking input' not in str(pj.get('source_claim','')).lower():raise SystemExit('projection independence claim missing')
    proj={norm(x['name']):x for x in pj['players'] if x.get('pos') in POS};market_by_id={str(x['key']):x for x in mk.get('pool_rows',[]) if x.get('key') is not None}
    if len(market_by_id)<200:raise SystemExit('market id map implausible')
    states=[];all_branches=complete=0
    for st in raw['states']:
        rows=[]
        for b in st['branches']:
            m=branch_metrics(b,proj,market_by_id);complete+=int(m['mapping_complete']);all_branches+=1;rows.append({'candidate':b['candidate'],'continuation':b['continuation'],**m})
        pairwise=[]
        for cont in sorted(set(r['continuation'] for r in rows)):
            rr=[r for r in rows if r['continuation']==cont and r['starter_expected_half_ppr_per_week'] is not None]
            for a,b in itertools.combinations(rr,2):
                same=a['missing_projection_names']==b['missing_projection_names'];metrics={}
                for k in ['starter_expected_half_ppr_per_week','starter_surplus_vs_actual_fa_lineup']:
                    metrics['delta_'+k+'_a_minus_b']=round(a[k]-b[k],5) if same and a[k] is not None and b[k] is not None else None
                pairwise.append({'continuation':cont,'a':a['candidate']['name'],'b':b['candidate']['name'],**metrics,'comparable_same_missing_set':same,'shared_missing_projection_names':a['missing_projection_names'] if same else None})
        states.append({'seed':st['seed'],'treatment_pick':st['treatment_pick'],'rows':rows,'pairwise':pairwise})
    out={'schema':2,'status':'PASS','lens':'NoPunt pure-model 2026 Half-PPR + actual post-draft shallow-league FA opportunity cost','NOT_championship_probability':True,'NOT_policy_certification':True,'projection_source_claim':pj['source_claim'],'projection_fetch':pj.get('fetched_at'),'scoring':'published PPR - 0.5*receptions; expected weekly contribution = projected season Half-PPR / 17','lineup_geometry':'QB1 + 6 non-QB: RB1-3, WR2-4, TE1-2','fa_lens':'same lineup optimizer applied to branch-specific actual undrafted pool; ADP is not used in scoring','unknown_handling':'never zero-imputed for pairwise claims; pairwise comparable only when missing roster-projection sets match','branch_mapping_complete_rate':complete/all_branches if all_branches else None,'states':states,'limitations':['Static expected-week lens does not model bye alignment, weekly variance, playoff covariance or transactions.','NoPunt is external; source-described independence and backtesting do not prove superiority.','Waiver-only lineup is an opportunity-cost benchmark, not an assumption that all best free agents can always be acquired simultaneously.']}
    pathlib.Path(out_path).parent.mkdir(parents=True,exist_ok=True);pathlib.Path(out_path).write_text(json.dumps(out,indent=2,ensure_ascii=False));print(json.dumps({'status':'PASS','states':len(states),'branches':all_branches,'mapping_complete_rate':out['branch_mapping_complete_rate']},indent=2))
if __name__=='__main__':
    if len(sys.argv)!=5:raise SystemExit('usage: nopunt_counterfactual_evaluator_2026.py RAW.json NOPUNT.json FRESH_2026_MARKET_PANEL_RAW.json OUT.json')
    main(*sys.argv[1:])
