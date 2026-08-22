#!/usr/bin/env python3
"""Independent position-aware challenger for exact rc4.59 dynamic Coach decisions.

This is deliberately a CHALLENGER, not policy certification. It takes the already
source-locked exact rc4.59 Coach top-10 at realistic frozen-2026 states and scores
candidate branches with the independently fitted Sleeper market->weekly bridge,
then applies the v3.5 lineup topology and an empirical 2025 league skill-score CDF.
The selected 2026 expert panel is never used in the outcome model.
"""
from __future__ import annotations
import json,math,pathlib,statistics,urllib.request

DRAFT_ID='1225769229928648704'
POS={'QB','RB','WR','TE'}
START={'QB':1,'RB':1,'WR':2,'TE':1}


def getj(url):
    req=urllib.request.Request(url,headers={'User-Agent':'PITTI-ChampUtility-Challenger/1.0'})
    with urllib.request.urlopen(req,timeout=45) as r:return json.load(r)

def qtile(vals,q):
    v=sorted(float(x) for x in vals)
    if not v:return 0.0
    z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)

def lineup_value(players,week,repl):
    vals={p:sorted([x['weeks'][week] for x in players if x['pos']==p],reverse=True) for p in POS}
    qb=vals['QB'][0] if vals['QB'] else repl['QB'][week]
    best=None
    # Exact v3.5 six non-QB slots: RB1 + WR2 + TE1 + one RB/WR/TE flex + one WR/RB flex; TE max 2.
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6:continue
        c={'RB':rb,'WR':wr,'TE':te};tot=0.0
        for pos in ('RB','WR','TE'):
            have=min(len(vals[pos]),c[pos]);tot+=sum(vals[pos][:have]);tot+=(c[pos]-have)*repl[pos][week]
        if best is None or tot>best:best=tot
    return qb+(best or 0.0)

def main():
    dg=json.load(open('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026_GATE.json'))
    if dg.get('status')!='PASS' or not dg.get('all_return_runs_900') or not dg.get('all_input_rosters_exact'):raise RuntimeError('dynamic Coach gate not PASS')
    full=json.load(open('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026.json'))
    fx=json.load(open('diagnostics_2026/RC459_DYNAMIC_FIXTURES_2026.json'))
    bg=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json'))
    bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'))
    if bg.get('status')!='PASS' or bridge.get('status')!='PASS' or not bridge.get('criteria',{}).get('selected_panel_not_used_in_fit'):raise RuntimeError('independent bridge gate not PASS')
    fc=bridge['forecasts']

    # Current-market vacancy replacement, selected only by draft-market cutline, mirroring v3.5 semantics.
    bypos={p:[] for p in POS}
    for key,v in fc.items():
        if v.get('pos') in POS and isinstance(v.get('sleeper_adp'),(int,float)):
            bypos[v['pos']].append((float(v['sleeper_adp']),key,v))
    repl={}
    for pos,arr in bypos.items():
        arr.sort();tail=arr[max(0,int(len(arr)*.80)):]
        repl[pos]=[qtile([x[2]['pred_weeks_1_14'][w] for x in tail],.50) for w in range(14)]

    # Empirical 2025 league skill-score CDF, the same nuisance-removal idea certified in Utility v3.5.
    meta=getj(f'https://api.sleeper.app/v1/draft/{DRAFT_ID}');league=str(meta['league_id'])
    players=getj('https://api.sleeper.app/v1/players/nfl')
    skill=[]
    for w in range(1,15):
        games=getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}')
        for g in games:
            total=float(g.get('points') or 0);pp=g.get('players_points') or {};kd=0.0
            for sid in [str(x) for x in (g.get('starters') or [])]:
                if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
            skill.append((w,total-kd))
    def winprob(score,w):
        vals=[v for ww,v in skill if ww!=w];below=sum(v<score for v in vals);ties=sum(v==score for v in vals)
        return (below+.5*ties+1)/(len(vals)+2)

    fmap={x['id']:x for x in fx['fixtures']};rows=[]
    for dr in full['fixtures']:
        f=fmap[dr['id']]
        # Existing user skill roster before this decision.
        base=[]
        for p in f['picks']:
            if int(p['draft_slot'])!=9:continue
            key=str(p['player_id']);b=fc.get(key)
            if b and b.get('pos') in POS:base.append({'key':key,'name':b['name'],'pos':b['pos'],'weeks':b['pred_weeks_1_14']})
        cand=[]
        for x in dr['top']:
            key=next((str(a['id']) for a in f['available'] if a['name']==x['name']),None)
            b=fc.get(key or '')
            if not b:continue
            roster=base+[{'key':key,'name':b['name'],'pos':b['pos'],'weeks':b['pred_weeks_1_14']}]
            scores=[lineup_value(roster,w,repl) for w in range(14)]
            utility=sum(winprob(scores[w],w+1) for w in range(14))
            cand.append({'coach_rank':x['rank'],'name':x['name'],'pos':x['pos'],'coach_score':x['score'],'utility_expected_wins':utility,'weekly_lineup_mean':statistics.mean(scores)})
        if not cand:continue
        cand.sort(key=lambda z:(-z['utility_expected_wins'],z['coach_rank']))
        best=cand[0];coach=next(z for z in cand if z['coach_rank']==min(y['coach_rank'] for y in cand))
        delta=best['utility_expected_wins']-coach['utility_expected_wins']
        rows.append({'id':dr['id'],'current':dr['current'],'coach':coach,'utility_best':best,'utility_gap_expected_wins_14w':delta,'material_gt_0_10_expected_wins':delta>.10,'candidates':cand})
    material=[r for r in rows if r['material_gt_0_10_expected_wins']]
    gaps=[r['utility_gap_expected_wins_14w'] for r in rows]
    out={'schema':1,'status':'PASS','method':'Exact rc4.59 Coach dynamic top10 -> independent Sleeper market/outcome bridge -> Utility-v3.5 lineup topology + empirical 2025 skill-score CDF','dynamic_gate_status':dg['status'],'bridge_gate_status':bg['status'],'selected_panel_used_in_outcome_fit':False,'fixture_count':len(rows),'material_gap_threshold_expected_wins_14w':.10,'material_challenger_count':len(material),'material_challenger_rate':len(material)/len(rows) if rows else None,'mean_gap_expected_wins_14w':statistics.mean(gaps) if gaps else None,'max_gap_expected_wins_14w':max(gaps) if gaps else None,'policy_ranking_certified':False,'interpretation':'Position-aware independent challenger only. Partial-roster candidate utility omits downstream draft-path opportunity cost; material gaps require full paired downstream policy evaluation before any Coach certification or tuning.','rows':rows}
    pathlib.Path('diagnostics_2026').mkdir(exist_ok=True)
    pathlib.Path('diagnostics_2026/RC459_DYNAMIC_CHAMPIONSHIP_UTILITY_CHALLENGER_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
    gate={'status':'PASS','fixture_count':len(rows),'material_challenger_count':len(material),'material_challenger_rate':out['material_challenger_rate'],'mean_gap_expected_wins_14w':out['mean_gap_expected_wins_14w'],'max_gap_expected_wins_14w':out['max_gap_expected_wins_14w'],'selected_panel_used_in_outcome_fit':False,'policy_ranking_certified':False}
    pathlib.Path('diagnostics_2026/RC459_DYNAMIC_CHAMPIONSHIP_UTILITY_CHALLENGER_2026_GATE.json').write_text(json.dumps(gate,indent=2))
    print(json.dumps(gate,indent=2))
if __name__=='__main__':main()
