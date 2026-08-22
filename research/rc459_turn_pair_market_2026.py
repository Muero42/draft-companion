#!/usr/bin/env python3
"""rc4.59-kernel conditional turn-pair market simulation for slot 9.

At each first pick of 9->12, 29->32, 49->52 and 69->72, generate realistic
prefix states with the verified rc4.59 profiled baseline opponent kernel. For
each materially exposed candidate, compare TAKE now vs WAIT (neutral best-panel
alternative now) and simulate the two intervening Slot-10 picks sequentially.

This directly estimates conditional return/timing under the rc4.59 opponent
kernel. It does not claim exact Coach-policy optimality or championship utility.
"""
from __future__ import annotations
import collections,copy,hashlib,json,pathlib,random,statistics,sys
import rc459_opponent_kernel_sim_2026 as k

PAIRS=[(9,12),(29,32),(49,52),(69,72)]

def clone_rosters(r):return {s:collections.Counter(v) for s,v in r.items()}
def branch_seed(parent,candidate,mode):
    h=int(hashlib.sha256(f'{parent}|{candidate}|{mode}'.encode()).hexdigest()[:12],16)
    return (45977000+h)&0xffffffff

def opp_step(rng,players,avail,rosters,pn):
    slot=k.slot_at_pick(pn);name=k.ACTIVE[slot]
    sp=k.choose_special(rng,k.MANAGER_DATA,name,rosters[slot],pn)
    if sp:rosters[slot][sp]+=1;return {'special':sp,'slot':slot,'name':None,'pos':sp}
    pool=sorted((players[z] for z in avail),key=lambda p:(p['panel'],p['adp']))[:70]
    weights=[k.candidate_weight(p,pn,rosters[slot],name,'baseline') for p in pool]
    chosen=k.weighted_pick(rng,pool,weights);avail.remove(chosen['key']);rosters[slot][chosen['pos']]+=1
    return {'special':None,'slot':slot,'name':chosen['name'],'pos':chosen['pos']}

def prefix_state(players,seed,stop_pick):
    rng=random.Random(seed);avail=set(players);rosters={s:collections.Counter({'QB':0,'RB':0,'WR':0,'TE':0,'K':0,'DEF':0}) for s in range(1,11)}
    for pn in range(1,stop_pick):
        slot=k.slot_at_pick(pn);pool=sorted((players[z] for z in avail),key=lambda p:(p['panel'],p['adp']))
        if slot==k.USER_SLOT:
            chosen=k.neutral_user_pick(pool[:70],rosters[slot],pn);avail.remove(chosen['key']);rosters[slot][chosen['pos']]+=1
        else:opp_step(rng,players,avail,rosters,pn)
    return avail,rosters

def best_user(players,avail,roster,pn,exclude=None):
    pool=sorted((players[z] for z in avail if z!=exclude),key=lambda p:(p['panel'],p['adp']))[:70]
    return k.neutral_user_pick(pool,roster,pn)

def main():
    global_runs=int(sys.argv[1]) if len(sys.argv)>1 else 2000
    gate,players,k.MANAGER_DATA,mhash=k.load();states={a:[] for a,b in PAIRS}
    for i in range(global_runs):
        seed=45970000+i
        # Each turn gets its own realistic prefix; no cross-turn reuse assumptions.
        for a,b in PAIRS:
            av,r=prefix_state(players,seed+a*100003,a);states[a].append((av,r))
    out={'schema':1,'status':'PASS','freeze_package_sha256':gate['package_sha256'],'parent_runs':global_runs,
         'manager_profile_source_hash':mhash,'scope':'rc4.59 profiled-baseline opponent kernel; neutral user control; conditional turn timing only','policy_ranking_certified':False,'pairs':{}}
    for a,b in PAIRS:
        exposure=collections.Counter()
        for av,_ in states[a]:
            for z in av:exposure[z]+=1
        candidates=[z for z,c in exposure.items() if c/global_runs>=.05]
        candidates.sort(key=lambda z:(players[z]['panel'],-exposure[z]))
        candidates=candidates[:18]
        rows=[]
        for z in candidates:
            p=players[z];eligible=0;survive=0;taken_first=0;taken_second=0;take_second_ranks=[];wait_second_ranks=[];wait_second_names=collections.Counter();take_second_names=collections.Counter();opp_taken=collections.Counter()
            for i,(av0,r0) in enumerate(states[a]):
                if z not in av0:continue
                eligible+=1
                # WAIT: pick best neutral alternative now, leaving candidate exposed to Slot 10.
                av=set(av0);r=clone_rosters(r0);alt=best_user(players,av,r[k.USER_SLOT],a,exclude=z);av.remove(alt['key']);r[k.USER_SLOT][alt['pos']]+=1
                rng=random.Random(branch_seed(i+a*100000,z,'wait'));opp=[]
                for pn in range(a+1,b):opp.append(opp_step(rng,players,av,r,pn))
                if z in av:survive+=1
                else:
                    hits=[j for j,q in enumerate(opp) if q.get('name')==p['name']]
                    if 0 in hits:taken_first+=1
                    elif hits:taken_second+=1
                for q in opp:
                    if q.get('name'):opp_taken[q['name']]+=1
                w2=best_user(players,av,r[k.USER_SLOT],b);wait_second_ranks.append(w2['panel']);wait_second_names[w2['name']]+=1
                # TAKE: remove candidate now; evaluate best neutral second-pick quality after same geometry.
                av=set(av0);r=clone_rosters(r0);av.remove(z);r[k.USER_SLOT][p['pos']]+=1
                rng=random.Random(branch_seed(i+a*100000,z,'take'))
                for pn in range(a+1,b):opp_step(rng,players,av,r,pn)
                t2=best_user(players,av,r[k.USER_SLOT],b);take_second_ranks.append(t2['panel']);take_second_names[t2['name']]+=1
            if not eligible:continue
            rate=eligible/global_runs;ret=survive/eligible
            rows.append({'name':p['name'],'pos':p['pos'],'panel':round(p['panel'],2),'adp':round(p['adp'],2),'exposure':round(rate,4),'eligible_runs':eligible,
                         'return_if_wait':round(ret,4),'taken_on_slot10_first':round(taken_first/eligible,4),'taken_on_slot10_second':round(taken_second/eligible,4),
                         'take_branch_second_best_panel_mean':round(statistics.mean(take_second_ranks),2),'wait_branch_second_best_panel_mean':round(statistics.mean(wait_second_ranks),2),
                         'take_branch_second_pick_top':[{'name':n,'rate':round(c/eligible,4)} for n,c in take_second_names.most_common(6)],
                         'wait_branch_second_pick_top':[{'name':n,'rate':round(c/eligible,4)} for n,c in wait_second_names.most_common(6)],
                         'top_slot10_takes_while_waiting':[{'name':n,'rate':round(c/eligible,4)} for n,c in opp_taken.most_common(8)]})
        out['pairs'][f'{a}->{b}']={'candidates':rows}
    # Gate: every pair must retain >=8 material candidates and each material row >=100 eligible parent states.
    mins=[min((r['eligible_runs'] for r in v['candidates']),default=0) for v in out['pairs'].values()]
    counts=[len(v['candidates']) for v in out['pairs'].values()]
    ok=all(c>=8 for c in counts) and min(mins)>=100
    out['status']='PASS' if ok else 'FAIL_CLOSED';out['gate']={'pair_candidate_counts':counts,'min_eligible_runs':min(mins),'criteria':{'each_pair_ge_8_candidates':all(c>=8 for c in counts),'every_reported_candidate_ge_100_eligible':min(mins)>=100}}
    pathlib.Path('RC459_TURN_PAIR_MARKET_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
    pathlib.Path('RC459_TURN_PAIR_MARKET_2026_GATE.json').write_text(json.dumps({'status':out['status'],'freeze_package_sha256':out['freeze_package_sha256'],'parent_runs':global_runs,**out['gate'],'policy_ranking_certified':False},indent=2))
    print(json.dumps({'status':out['status'],'parent_runs':global_runs,**out['gate']},indent=2))
if __name__=='__main__':main()
