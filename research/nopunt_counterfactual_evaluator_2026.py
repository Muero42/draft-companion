#!/usr/bin/env python3
"""Independent 2026 projection lens for PITTI direct-decision counterfactuals.

Inputs are intentionally separated from the draft policy:
  1) raw causal branches produced before outcome evaluation;
  2) frozen NoPunt pure-model 2026 Half-PPR projections.

This is NOT a championship-probability model and is never allowed to tune NoPunt or
PITTI on the same states. It is a second, non-ADP/expert-ranking player forecast lens.
"""
from __future__ import annotations
import json, re, sys, pathlib, itertools, statistics, collections

ALIASES={
    'jamescookiii':'jamescook',
    'kennygainwell':'kennethgainwell',
}
POS={'QB','RB','WR','TE'}

def norm(s):
    x=str(s or '').lower().replace('’',"'")
    x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x)
    x=re.sub(r'[^a-z0-9]+','',x)
    return ALIASES.get(x,x)

def lineup(vals):
    """Expected weekly lineup points from durability-adjusted season totals / 17.
    Exact league skill geometry: QB1 + six RB/WR/TE slots, with RB 1..3, WR 2..4,
    TE 1..2. Returns None if mapped players cannot make a legal lineup.
    """
    by={p:sorted(vals.get(p,[]),reverse=True) for p in POS}
    if not by['QB']: return None
    best=None
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6: continue
        if len(by['RB'])<rb or len(by['WR'])<wr or len(by['TE'])<te: continue
        v=by['QB'][0]+sum(by['RB'][:rb])+sum(by['WR'][:wr])+sum(by['TE'][:te])
        best=v if best is None or v>best else best
    return best

def branch_metrics(branch, proj):
    vals=collections.defaultdict(list); missing=[]; mapped=[]
    for p in branch['user_roster']:
        pos=str(p.get('pos') or '').upper(); name=p.get('name')
        if pos not in POS: continue
        q=proj.get(norm(name))
        if not q:
            missing.append(name); continue
        v=float(q['half_ppr'])/17.0
        vals[pos].append(v); mapped.append((name,pos,v))
    starter=lineup(vals)

    # Actual post-draft waiver environment. Benchmark is highest projected undrafted
    # player at each position. It is descriptive opportunity cost, not an automatic
    # claim that every such player can be rostered simultaneously.
    fa=collections.defaultdict(list)
    for fid in branch.get('free_agent_ids',[]):
        # Raw branch persists ids, not names. A projection lookup cannot safely infer
        # names from ids, so leave FA benchmarks unavailable unless enriched raw rows
        # later persist name/position. Never silently substitute ADP replacement.
        pass
    return {
        'starter_expected_half_ppr_per_week': None if starter is None else round(starter,5),
        'mapped_roster_players':len(mapped),
        'skill_roster_players':len([p for p in branch['user_roster'] if str(p.get('pos') or '').upper() in POS]),
        'missing_projection_names':sorted(missing),
        'mapping_complete':len(missing)==0,
        'legal_projected_lineup':starter is not None,
    }

def main(raw_path,proj_path,out_path):
    raw=json.load(open(raw_path)); pj=json.load(open(proj_path))
    if raw.get('status')!='PASS' or not raw.get('raw_only') or raw.get('outcome_evaluated') is not False:
        raise SystemExit('raw causal precondition failed')
    if pj.get('status')!='PASS' or pj.get('schema',0)<2:
        raise SystemExit('independent projection freeze precondition failed')
    claim=str(pj.get('source_claim','')).lower()
    if 'zero betting or expert-ranking input' not in claim:
        raise SystemExit('projection independence claim missing')
    proj={norm(x['name']):x for x in pj['players'] if x.get('pos') in POS}
    states=[]; all_branches=0; complete=0
    for st in raw['states']:
        rows=[]
        for b in st['branches']:
            m=branch_metrics(b,proj); complete+=int(m['mapping_complete']); all_branches+=1
            rows.append({'candidate':b['candidate'],'continuation':b['continuation'],**m})
        # Paired comparisons only where both branches have the SAME missing-projection
        # set. This makes unknown-player effects cancel rather than pretending zero.
        pairwise=[]
        for cont in sorted(set(r['continuation'] for r in rows)):
            rr=[r for r in rows if r['continuation']==cont and r['starter_expected_half_ppr_per_week'] is not None]
            for a,b in itertools.combinations(rr,2):
                comparable=a['missing_projection_names']==b['missing_projection_names']
                pairwise.append({
                    'continuation':cont,
                    'a':a['candidate']['name'],'b':b['candidate']['name'],
                    'delta_a_minus_b': round(a['starter_expected_half_ppr_per_week']-b['starter_expected_half_ppr_per_week'],5) if comparable else None,
                    'comparable_same_missing_set':comparable,
                    'shared_missing_projection_names':a['missing_projection_names'] if comparable else None,
                })
        states.append({'seed':st['seed'],'treatment_pick':st['treatment_pick'],'rows':rows,'pairwise':pairwise})
    out={
      'schema':1,'status':'PASS','lens':'NoPunt pure-model 2026 Half-PPR durability-adjusted static starter projection',
      'NOT_championship_probability':True,'NOT_policy_certification':True,
      'projection_source_claim':pj['source_claim'],'projection_fetch':pj.get('fetched_at'),
      'scoring':'published PPR - 0.5*receptions; expected weekly contribution = projected season Half-PPR / 17',
      'lineup_geometry':'QB1 + 6 non-QB: RB1-3, WR2-4, TE1-2',
      'unknown_handling':'never zero-imputed for pairwise claims; pairwise comparable only when missing-projection name sets match',
      'branch_mapping_complete_rate':complete/all_branches if all_branches else None,
      'states':states,
      'limitations':['Static expected-week lens does not model bye-week alignment, weekly variance, playoff covariance or in-season transactions.','NoPunt is an external model; independence claim is source-described and does not prove model superiority.','FA ids in current raw schema lack names; shallow-waiver benchmark requires raw FA enrichment before use.']
    }
    pathlib.Path(out_path).parent.mkdir(parents=True,exist_ok=True)
    pathlib.Path(out_path).write_text(json.dumps(out,indent=2,ensure_ascii=False))
    print(json.dumps({'status':'PASS','states':len(states),'branches':all_branches,'mapping_complete_rate':out['branch_mapping_complete_rate']},indent=2))

if __name__=='__main__':
    if len(sys.argv)!=4: raise SystemExit('usage: nopunt_counterfactual_evaluator_2026.py RAW.json NOPUNT.json OUT.json')
    main(*sys.argv[1:])
