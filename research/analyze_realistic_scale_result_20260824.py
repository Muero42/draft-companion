#!/usr/bin/env python3
"""PITTI post-scale analyzer.

Consumes diagnostics_2026/REALISTIC_SCALE_120_20260824.json and produces a compact,
fail-closed prioritization of decision rounds for paired counterfactual follow-up.
Research only; no production policy mutation.
"""
from __future__ import annotations
import json, math, pathlib, sys

SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'diagnostics_2026/REALISTIC_SCALE_120_20260824.json')
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'diagnostics_2026/REALISTIC_SCALE_120_DECISION_PRIORITY_20260824.json')
EXPECTED_SEEDS = 120
OWN_PICKS = [9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]
FOCUS = [29,32,49,52]


def fail(msg: str) -> None:
    raise SystemExit('SCALE_PRIORITY_FAIL: ' + msg)


def entropy(counts: dict[str,int]) -> float:
    n=sum(counts.values())
    if not n: return 0.0
    return -sum((v/n)*math.log2(v/n) for v in counts.values() if v)

x=json.loads(SRC.read_text())
if x.get('status')!='PASS': fail('source status')
if x.get('seeds')!=EXPECTED_SEEDS: fail('seed count')
if x.get('reality_gate')!='PASS': fail('roster reality gate')
if x.get('strategy_certification_authorized') is not False: fail('unexpected certification flag')

by=x.get('pick_choice_counts') or {}
missing=[p for p in OWN_PICKS if str(p) not in by]
if missing: fail('missing own-pick distributions '+repr(missing))

rows=[]
for p in OWN_PICKS:
    c={k:int(v) for k,v in by[str(p)].items()}
    n=sum(c.values())
    if n!=EXPECTED_SEEDS: fail(f'pick {p} count {n}')
    ordered=sorted(c.items(), key=lambda kv:(-kv[1],kv[0]))
    topn=ordered[0][1] if ordered else 0
    rows.append({
        'pick':p,
        'unique_choices':len(c),
        'entropy_bits':entropy(c),
        'top_choice':ordered[0][0] if ordered else None,
        'top_choice_rate':topn/n if n else None,
        'top5':[{ 'name':k,'n':v,'rate':v/n } for k,v in ordered[:5]],
        # Higher means more heterogeneous and therefore more useful for state-level counterfactuals.
        'decision_priority_score': entropy(c) * (1-(topn/n if n else 0)),
    })

# Do not infer exact causal states from aggregate counts. State traces are required to select
# representative seeds without post-treatment cherry-picking.
trace_available=bool(x.get('seed_decision_traces'))
focus=[r for r in rows if r['pick'] in FOCUS]
focus.sort(key=lambda r:r['decision_priority_score'], reverse=True)

out={
    'schema':1,
    'status':'PASS',
    'source':str(SRC),
    'seeds':EXPECTED_SEEDS,
    'reality_gate':'PASS',
    'production_mutation':False,
    'pick_metrics':rows,
    'focus_order':[r['pick'] for r in focus],
    'seed_decision_traces_available':trace_available,
    'paired_state_execution_authorized':trace_available,
    'next_if_no_traces':'Recover current-run shard artifacts or deterministically regenerate compact seed->own-decision traces under the exact frozen commit before selecting representative state seeds.',
    'anti_overfit':'Use prevalence to prioritize states, not to tune a global score. Force one decision at a time under common random numbers and frozen continuation.',
}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(out,indent=2,ensure_ascii=False))
