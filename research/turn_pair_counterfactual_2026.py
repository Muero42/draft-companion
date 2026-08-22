#!/usr/bin/env python3
"""PITTI slot-9 conditional turn-pair counterfactual diagnostics.

Research-only. REALISTIC market variance only. For each early/mid turn pair and
cell, discover the policy's material first-pick choices, then force each such
choice when it is genuinely available/in-candidate-set and fully re-simulate
all intervening opponent picks using common random seeds. Reports conditional
return/survival of alternatives and second-pick selection distributions.
No Championship-Utility policy superiority is inferred here.
"""
from __future__ import annotations
import collections, importlib.util, json, pathlib, random, statistics, sys

SPEC=importlib.util.spec_from_file_location('sim','research/policy_simulator_2026_realistic.py')
sim=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(sim)
PAIRS=[(9,12),(29,32),(49,52),(69,72)]
REGIMES=sim.REGIMES
POLICIES=sim.POLICIES


def run_to_pair(players,seed,policy,regime,a,b,manager_data,forced=None):
    rng=random.Random(seed); available=set(players); rosters={s:[] for s in range(1,11)}; used=set(); special=sim.special_schedule(rng,manager_data)
    first=None; second=None; first_board_keys=set(); second_available=None
    for pn in range(1,b+1):
        s=sim.slot_at_pick(pn)
        if s!=sim.USER_SLOT and pn in special:
            typ,key=special[pn]
            if key in used: raise AssertionError('duplicate special')
            used.add(key); rosters[s].append({'key':key,'name':key,'pos':typ,'panel':999,'std':999,'adp':999}); continue
        board=sim.candidate_board(players,available,pn)
        if not board: raise AssertionError('empty board')
        if s==sim.USER_SLOT:
            board,_=sim.completion_guard(board,rosters[s],pn)
            if pn==a:
                first_board_keys={p['key'] for p in board}
                if forced is not None:
                    if forced not in available or forced not in first_board_keys:
                        return {'eligible':False}
                    chosen=players[forced]
                else:
                    chosen=min(board,key=lambda p:(sim.user_score(p,pn,policy,rosters[s]),p['panel'],p['adp']))
                first=chosen['key']
            elif pn==b:
                second_available=set(available)
                chosen=min(board,key=lambda p:(sim.user_score(p,pn,policy,rosters[s]),p['panel'],p['adp']))
                second=chosen['key']
            else:
                chosen=min(board,key=lambda p:(sim.user_score(p,pn,policy,rosters[s]),p['panel'],p['adp']))
        else:
            chosen=sim.opponent_pick(rng,board,pn,s,rosters[s],regime,sim.VARIANCE['REALISTIC'],manager_data)
        if chosen['key'] not in available or chosen['key'] in used: raise AssertionError('state failure')
        available.remove(chosen['key']); used.add(chosen['key']); rosters[s].append(chosen)
    return {'eligible':True,'first':first,'second':second,'second_available':second_available or set(),'first_board_keys':first_board_keys}


def top_discovery(players,runs,policy,regime,a,b,manager_data,seedbase):
    sel=collections.Counter(); avail=collections.Counter(); board=collections.Counter()
    for i in range(runs):
        d=run_to_pair(players,seedbase+i,policy,regime,a,b,manager_data,None)
        sel[d['first']]+=1
        for k in d['first_board_keys']: board[k]+=1
    # Material policy choices first; then high-quality commonly exposed alternatives.
    candidates=[k for k,_ in sel.most_common(6) if sel[k]/runs>=.01]
    if len(candidates)<4:
        extras=sorted((k for k,c in board.items() if c/runs>=.10 and k not in candidates),key=lambda k:(players[k]['panel'],players[k]['adp']))
        candidates+=extras[:4-len(candidates)]
    return candidates[:6],sel,board


def branch(players,runs,policy,regime,a,b,forced,alts,manager_data,seedbase):
    eligible=0; second_sel=collections.Counter(); survive=collections.Counter(); quality_survive=collections.Counter()
    top_quality=[k for k,_ in sorted(players.items(),key=lambda kv:(kv[1]['panel'],kv[1]['adp']))[:60]]
    for i in range(runs):
        d=run_to_pair(players,seedbase+i,policy,regime,a,b,manager_data,forced)
        if not d['eligible']: continue
        eligible+=1; second_sel[d['second']]+=1
        for k in alts:
            if k!=forced and k in d['second_available']: survive[k]+=1
        for k in top_quality:
            if k in d['second_available']: quality_survive[k]+=1
    if eligible==0:return {'eligible_runs':0,'eligible_rate':0.0}
    choices=[{'name':players[k]['name'],'pos':players[k]['pos'],'rate':round(c/eligible,4)} for k,c in second_sel.most_common(12)]
    ret=[{'name':players[k]['name'],'pos':players[k]['pos'],'return_rate':round(survive[k]/eligible,4)} for k in alts if k!=forced]
    best=[]
    for k,c in quality_survive.items():
        r=c/eligible
        if r>=.03:best.append((players[k]['panel'],-r,k))
    best.sort()
    best=[{'name':players[k]['name'],'pos':players[k]['pos'],'quality_rank':round(players[k]['panel'],2),'adp':round(players[k]['adp'],2),'availability':round(-r,4)} for _,r,k in best[:15]]
    return {'eligible_runs':eligible,'eligible_rate':round(eligible/runs,4),'second_pick_selections':choices,'alternative_return':ret,'best_available_at_second':best}


def main():
    runs=int(sys.argv[1]) if len(sys.argv)>1 else 250
    gate,raw,health,manager_data,players=sim.load()
    out={'schema':1,'freeze_package_sha256':gate['package_sha256'],'variance':'REALISTIC','runs_per_branch':runs,'pairs':{},
         'policy_ranking_certified':False,'interpretation':'Conditional market/return evidence only; each forced branch fully re-simulates intervening opponent picks with common random seeds.'}
    cell=0
    for a,b in PAIRS:
        pairkey=f'{a}->{b}';out['pairs'][pairkey]={}
        for regime in REGIMES:
            for policy in POLICIES:
                cell+=1;seed=73100000+cell*100000
                candidates,sel,board=top_discovery(players,runs,policy,regime,a,b,manager_data,seed)
                ckey=f'{regime}|{policy}'
                branches={}
                for k in candidates:
                    branches[players[k]['name']]=branch(players,runs,policy,regime,a,b,k,candidates,manager_data,seed)
                out['pairs'][pairkey][ckey]={
                    'material_first_pick_candidates':[{'name':players[k]['name'],'pos':players[k]['pos'],'baseline_selection_rate':round(sel[k]/runs,4),'candidate_exposure_rate':round(board[k]/runs,4)} for k in candidates],
                    'branches':branches
                }
    pathlib.Path('TURN_PAIR_COUNTERFACTUAL_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
    # Compact gate is structural only; statistical adequacy is judged per eligible branch.
    eligible=[b['eligible_runs'] for p in out['pairs'].values() for c in p.values() for b in c['branches'].values()]
    gateout={'status':'PASS' if eligible and min(eligible)>=max(30,int(.10*runs)) else 'FAIL_CLOSED','freeze_package_sha256':gate['package_sha256'],
             'runs_per_branch':runs,'pair_count':len(PAIRS),'cell_count':len(PAIRS)*len(REGIMES)*len(POLICIES),'min_eligible_branch_runs':min(eligible) if eligible else 0,
             'policy_ranking_certified':False}
    pathlib.Path('TURN_PAIR_COUNTERFACTUAL_2026_GATE.json').write_text(json.dumps(gateout,indent=2))
    print(json.dumps(gateout,indent=2))

if __name__=='__main__':main()
