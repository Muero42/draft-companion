#!/usr/bin/env python3
"""Research-only validation audit for experimental full-draft policy artifacts.

Flags repeated choices that are dominated on BOTH selected-panel Player Quality and
Sleeper Half-PPR timing/ADP by another candidate visible in the policy's exported
Coach top list. This is a diagnostic invariant, never a policy scoring modifier.

Usage:
  python research/policy_quality_timing_sanity_audit_2026.py \
      policy_certification_2026/EXPERIMENT.json \
      freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json \
      [output.json]
"""
from __future__ import annotations
import json, pathlib, re, sys

PANEL_MARGIN = 1.5
ADP_MARGIN = 3.0


def norm(s: str) -> str:
    s = str(s or '').lower()
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def load_market(path: str):
    x = json.load(open(path, encoding='utf-8'))
    # Fresh raw freeze has payloads.panel / payloads.market in current project;
    # support several persisted shapes fail-closed rather than silently guessing.
    rows = []
    if isinstance(x, list):
        rows = x
    elif isinstance(x, dict):
        for key in ('players','rows','pool','panel_rows','market_rows'):
            if isinstance(x.get(key), list):
                rows.extend(x[key])
        # canonical FRESH_2026_MARKET_PANEL_RAW uses nested source payloads in some revisions
        def walk(v, depth=0):
            if depth > 6: return
            if isinstance(v, list):
                for z in v:
                    if isinstance(z, dict) and ('name' in z or 'player' in z or 'player_name' in z):
                        rows.append(z)
                    else: walk(z, depth+1)
            elif isinstance(v, dict):
                for z in v.values(): walk(z, depth+1)
        if not rows: walk(x)
    out = {}
    for r in rows:
        if not isinstance(r, dict): continue
        name = r.get('name') or r.get('player_name') or r.get('player') or r.get('full_name')
        if isinstance(name, dict): name = name.get('name') or name.get('full_name')
        if not name: continue
        panel = None
        for k in ('panel_standard','panel','panel_rank','rank','overall_rank'):
            if isinstance(r.get(k),(int,float)):
                panel=float(r[k]); break
        adp = None
        for k in ('adp','sleeper_adp','half_ppr_adp','market_adp'):
            if isinstance(r.get(k),(int,float)):
                adp=float(r[k]); break
        k=norm(name)
        prev=out.get(k,{})
        if panel is not None and prev.get('panel') is None: prev['panel']=panel
        if adp is not None and prev.get('adp') is None: prev['adp']=adp
        prev['name']=str(name)
        out[k]=prev
    usable={k:v for k,v in out.items() if isinstance(v.get('panel'),(int,float)) and isinstance(v.get('adp'),(int,float))}
    if len(usable)<100:
        raise RuntimeError(f'fail closed: only {len(usable)} players have both panel and ADP; market shape not safely parsed')
    return usable


def main():
    if len(sys.argv)<3:
        raise SystemExit('usage: audit.py EXPERIMENT.json FRESH_RAW.json [OUT.json]')
    exp=json.load(open(sys.argv[1],encoding='utf-8'))
    market=load_market(sys.argv[2])
    rows=exp.get('rows') if isinstance(exp,dict) else None
    if not isinstance(rows,list): raise RuntimeError('experiment rows missing')
    violations=[]; decisions=0; missing=0
    for row in rows:
        if row.get('policy')!='COACH': continue
        regime=row.get('stress') or row.get('regime')
        seed=row.get('seed')
        for d in row.get('decisions') or []:
            diag=d.get('coach_diag') or {}; top=diag.get('top') or []
            if not top: continue
            chosen_name=d.get('name') or (top[0].get('name') if top else None)
            chosen=market.get(norm(chosen_name)); decisions+=1
            if not chosen: missing+=1; continue
            for alt0 in top:
                alt=market.get(norm(alt0.get('name')))
                if not alt: continue
                if alt['panel'] <= chosen['panel']-PANEL_MARGIN and alt['adp'] <= chosen['adp']-ADP_MARGIN:
                    violations.append({
                        'regime':regime,'seed':seed,'pick':d.get('pick'),
                        'chosen':chosen_name,'chosen_panel':chosen['panel'],'chosen_adp':chosen['adp'],
                        'dominator':alt0.get('name'),'dominator_panel':alt['panel'],'dominator_adp':alt['adp'],
                        'panel_gap':round(chosen['panel']-alt['panel'],4),
                        'adp_gap':round(chosen['adp']-alt['adp'],4),
                        'note':'requires explicit evidence/feasibility override or experimental mechanism fails sanity review'
                    })
    bypair={}
    for v in violations:
        k=f"{v['chosen']} <- {v['dominator']}"
        bypair[k]=bypair.get(k,0)+1
    out={
        'status':'PASS_AUDIT_EXECUTED',
        'policy_ranking_certified':False,
        'diagnostic_only':True,
        'thresholds':{'panel_rank_margin':PANEL_MARGIN,'sleeper_adp_margin':ADP_MARGIN},
        'coach_decisions_audited':decisions,'market_lookup_missing':missing,
        'violation_count':len(violations),
        'violation_rate':len(violations)/decisions if decisions else None,
        'repeated_pairs':sorted(({'pair':k,'count':v} for k,v in bypair.items()),key=lambda z:(-z['count'],z['pair'])),
        'violations':violations,
        'interpretation':'A flag is not automatically a bad pick; explicit health/role/feasibility evidence may justify it. Repeated unexplained flags invalidate an experimental mechanism for promotion.'
    }
    p=pathlib.Path(sys.argv[3] if len(sys.argv)>3 else 'policy_certification_2026/QUALITY_TIMING_SANITY_AUDIT.json')
    p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf-8')
    print(json.dumps({k:out[k] for k in ('status','coach_decisions_audited','market_lookup_missing','violation_count','violation_rate')},indent=2))

if __name__=='__main__': main()
