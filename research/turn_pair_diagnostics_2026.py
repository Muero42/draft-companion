#!/usr/bin/env python3
"""Research-only conditional return diagnostics for slot-9 short turns.
For each REALISTIC opponent regime/user policy and each early turn pair, identify
frequently reachable high-quality first-pick branches, force each branch, fully
resimulate the remainder of the draft, and measure conditional return availability.
No policy superiority claim is made here.
"""
import importlib.util, pathlib, collections, statistics, json, random, sys

spec=importlib.util.spec_from_file_location('sim','research/policy_simulator_2026_realistic.py')
sim=importlib.util.module_from_spec(spec); spec.loader.exec_module(sim)
gate,raw,health,manager_data,players=sim.load()
PAIRS=[(9,12),(29,32),(49,52),(69,72)]
POLICIES=sim.POLICIES; REGIMES=sim.REGIMES
BASE_RUNS=int(sys.argv[1]) if len(sys.argv)>1 else 200
BRANCH_N=6

def run(seed,policy,regime,p1,p2,forced=None):
    rng=random.Random(seed); available=set(players); rosters={s:[] for s in range(1,11)}; used=set(); special=sim.special_schedule(rng,manager_data)
    p1_board_keys=None; p2_avail=None; p2_pick=None; first_pick=None
    selections=[]
    for pn in range(1,151):
        s=sim.slot_at_pick(pn)
        if s!=sim.USER_SLOT and pn in special:
            typ,key=special[pn]
            if key in used: raise AssertionError('duplicate special')
            used.add(key);rosters[s].append({'key':key,'name':key,'pos':typ,'panel':999,'std':999,'adp':999});continue
        board=sim.candidate_board(players,available,pn)
        if not board: raise AssertionError('empty board')
        if s==sim.USER_SLOT:
            board,_=sim.completion_guard(board,rosters[s],pn)
            if pn==p1:
                p1_board_keys={x['key'] for x in board}
                if forced is not None:
                    if forced not in p1_board_keys or forced not in available:return None
                    chosen=players[forced]
                else: chosen=min(board,key=lambda p:(sim.user_score(p,pn,policy,rosters[s]),p['panel'],p['adp']))
                first_pick=chosen['key']
            else:
                if pn==p2:p2_avail=set(available)
                chosen=min(board,key=lambda p:(sim.user_score(p,pn,policy,rosters[s]),p['panel'],p['adp']))
                if pn==p2:p2_pick=chosen['key']
            selections.append((pn,chosen['key']))
        else:
            chosen=sim.opponent_pick(rng,board,pn,s,rosters[s],regime,sim.VARIANCE['REALISTIC'],manager_data)
        if chosen['key'] not in available or chosen['key'] in used:raise AssertionError('state failure')
        available.remove(chosen['key']);used.add(chosen['key']);rosters[s].append(chosen)
    if len(used)!=150 or sim.missing_core(rosters[sim.USER_SLOT]):raise AssertionError('invalid completed draft')
    return {'p1_board':p1_board_keys,'p2_avail':p2_avail,'p2_pick':p2_pick,'first_pick':first_pick,'roster':rosters[sim.USER_SLOT],'selections':selections}

def diagnose_cell(policy,regime,p1,p2,seedbase):
    base=[];reach=collections.Counter(); p2base=collections.Counter()
    for i in range(BASE_RUNS):
        d=run(seedbase+i,policy,regime,p1,p2)
        base.append(d)
        for k in d['p1_board']:reach[k]+=1
        for k in d['p2_avail']:p2base[k]+=1
    branches=[k for k,c in sorted(reach.items(),key=lambda kv:(players[kv[0]]['panel'],-kv[1])) if c/BASE_RUNS>=.15][:BRANCH_N]
    targets=[k for k,c in sorted(p2base.items(),key=lambda kv:(players[kv[0]]['panel'],-kv[1])) if c/BASE_RUNS>=.03][:16]
    out=[]
    for bi,a in enumerate(branches):
        n=0; ret=collections.Counter(); second=collections.Counter(); rosterpos=collections.Counter(); paths=collections.Counter()
        for i in range(BASE_RUNS):
            d=run(seedbase+1000000+bi*10000+i,policy,regime,p1,p2,forced=a)
            if d is None:continue
            n+=1
            for b in targets:
                if b!=a and b in d['p2_avail']:ret[b]+=1
            if d['p2_pick']:second[d['p2_pick']]+=1
            c=collections.Counter(x['pos'] for x in d['roster']);rosterpos[tuple(sorted(c.items()))]+=1
            paths[tuple(players[k]['name'] for _,k in d['selections'][:4])]+=1
        if n<30:continue
        se=lambda p:(p*(1-p)/n)**.5
        returns=[]
        for b,c in ret.items():
            p=c/n
            if p>=.02:
                returns.append({'name':players[b]['name'],'pos':players[b]['pos'],'quality_rank':round(players[b]['panel'],2),'adp':round(players[b]['adp'],2),'p_return':round(p,4),'mc_se':round(se(p),4)})
        returns.sort(key=lambda z:(z['quality_rank'],-z['p_return']))
        out.append({'forced_first':players[a]['name'],'pos':players[a]['pos'],'quality_rank':round(players[a]['panel'],2),'adp':round(players[a]['adp'],2),'n':n,
                    'return_candidates':returns[:16],
                    'second_pick_distribution':[{'name':players[k]['name'],'pos':players[k]['pos'],'rate':round(c/n,4)} for k,c in second.most_common(12)],
                    'roster_position_distribution':[{'counts':dict(k),'rate':round(c/n,4)} for k,c in rosterpos.most_common(8)],
                    'top_first_four_paths':[{'players':list(k),'rate':round(c/n,4)} for k,c in paths.most_common(8)]})
    return {'runs_requested_per_branch':BASE_RUNS,'policy':policy,'opponent_regime':regime,'pair':[p1,p2],
            'baseline_first_pick_distribution':[{'name':players[k]['name'],'pos':players[k]['pos'],'rate':round(c/BASE_RUNS,4)} for k,c in collections.Counter(d['first_pick'] for d in base).most_common(12)],
            'branches':out}

def main():
    result={'schema':1,'freeze_package_sha256':gate['package_sha256'],'variance':'REALISTIC','pairs':{},'policy_ranking_certified':False,
            'interpretation':'Conditional return/roster-construction evidence only; each forced branch fully resimulates the draft under the same current market/manager process.'}
    cell=0
    for p1,p2 in PAIRS:
        result['pairs'][f'{p1}->{p2}']={}
        for regime in REGIMES:
            for policy in POLICIES:
                cell+=1;key=f'{regime}|{policy}'
                result['pairs'][f'{p1}->{p2}'][key]=diagnose_cell(policy,regime,p1,p2,73000000+cell*2000000)
    pathlib.Path('TURN_PAIR_2026_CONDITIONAL_RESULTS.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
    # compact gate: structural completion is guaranteed by run(); require usable branches everywhere.
    usable=min(len(v['branches']) for pair in result['pairs'].values() for v in pair.values())
    gateout={'status':'PASS' if usable>=3 else 'FAIL_CLOSED','freeze_package_sha256':gate['package_sha256'],'pairs':list(result['pairs']),'cells':sum(len(v) for v in result['pairs'].values()),'runs_requested_per_branch':BASE_RUNS,'min_usable_branches_per_cell':usable,'policy_ranking_certified':False}
    pathlib.Path('TURN_PAIR_2026_CONDITIONAL_GATE.json').write_text(json.dumps(gateout,indent=2))
    print(json.dumps(gateout,indent=2))
if __name__=='__main__':main()
